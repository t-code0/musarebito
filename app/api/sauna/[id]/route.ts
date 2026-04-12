import { NextRequest, NextResponse } from "next/server";
import { getServiceSupabase as getServiceClient } from "@/lib/supabase";
import { calculateHonmonoScoreLocal } from "@/lib/claude";

export const dynamic = "force-dynamic";

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const sb = getServiceClient();

  // Fast DB read (parallel) — no Places API, no Claude API.
  // Heavy work is delegated to /api/sauna/refresh/[id], called by the client.
  const [saunaResult, reviewsResult] = await Promise.all([
    sb.from("saunas").select("*").eq("id", params.id).single(),
    sb
      .from("sauna_reviews")
      .select("*")
      .eq("sauna_id", params.id)
      .order("created_at", { ascending: false }),
  ]);

  if (saunaResult.error || !saunaResult.data) {
    return NextResponse.json({ error: "Sauna not found" }, { status: 404 });
  }

  const sauna = saunaResult.data;

  // Compute score immediately if missing — pure DB-driven, no Claude API needed.
  // This guarantees the score is always present in the response.
  if (sauna.honmono_score == null) {
    try {
      const gReviews = sauna.google_reviews as { text: string }[] | null;
      const reviewTexts = (gReviews || [])
        .map((r) => r.text)
        .filter(Boolean);
      const prevDetail = (sauna.score_detail as Record<string, unknown> | null) || null;
      const savedRc = prevDetail?.review_count as number | undefined;
      const rc = savedRc || gReviews?.length || 0;
      const { score: scoreVal } = calculateHonmonoScoreLocal({
        name: sauna.name,
        rating: sauna.rating,
        reviewCount: rc,
        hasWebsite: !!sauna.website,
        reviews: reviewTexts,
        websiteContent: "",
        aiSummary: sauna.ai_summary || "",
      });
      (scoreVal as Record<string, unknown>).review_count = rc;
      // Preserve facility_facts from previous score_detail, if any
      if (prevDetail?.facility_facts) {
        (scoreVal as Record<string, unknown>).facility_facts = prevDetail.facility_facts;
      }
      sauna.honmono_score = scoreVal.overall;
      sauna.score_detail = scoreVal;
      // Persist (fire-and-forget — don't block the response on this)
      sb
        .from("saunas")
        .update({
          honmono_score: scoreVal.overall,
          score_detail: scoreVal,
        })
        .eq("id", sauna.id)
        .then(() => {});
    } catch (e) {
      console.error("Inline score calc error:", e);
    }
  }

  // Lift cached English summary out of score_detail for easier client access
  const sdAny = sauna.score_detail as Record<string, unknown> | null;
  if (sdAny && typeof sdAny.ai_summary_en === "string") {
    (sauna as Record<string, unknown>).ai_summary_en = sdAny.ai_summary_en;
  }

  // Filter out vote rows (stored as reviews with user_id starting with __vote__:)
  const realReviews = (reviewsResult.data || []).filter(
    (r) => !(typeof r.user_id === "string" && r.user_id.startsWith("__vote__:"))
  );

  // Vote tallies
  const voteRows = (reviewsResult.data || []).filter(
    (r) => typeof r.user_id === "string" && r.user_id.startsWith("__vote__:")
  );
  let up = 0;
  let down = 0;
  for (const r of voteRows) {
    if (r.user_id.endsWith(":up")) up++;
    else if (r.user_id.endsWith(":down")) down++;
  }
  const total = up + down;
  const votes = {
    up,
    down,
    total,
    percentage: total === 0 ? 0 : Math.round((up / total) * 100),
  };

  const response = NextResponse.json({
    sauna,
    reviews: realReviews,
    votes,
  });
  response.headers.set("Cache-Control", "no-store, max-age=0");
  return response;
}
