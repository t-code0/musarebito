import { NextRequest, NextResponse } from "next/server";
import { getServiceSupabase as getServiceClient } from "@/lib/supabase";
import { calculateHonmonoScoreLocal, SCORE_VERSION } from "@/lib/claude";
import { getPerformerBonus } from "@/lib/performer-facilities";

export const dynamic = "force-dynamic";

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const sb = getServiceClient();

  // Fast DB read (parallel) — no Places API, no Claude API.
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

  // Score v2: recalculate if missing or outdated version
  const prevDetail = (sauna.score_detail as Record<string, unknown> | null) || null;
  const prevVersion = prevDetail?.score_version as number | undefined;
  const needsRescore = sauna.honmono_score == null || prevVersion !== SCORE_VERSION;

  if (needsRescore) {
    try {
      const gReviews = sauna.google_reviews as { text: string }[] | null;
      const reviewTexts = (gReviews || []).map((r) => r.text).filter(Boolean);
      const savedRc = prevDetail?.review_count as number | undefined;
      const rc = savedRc || gReviews?.length || 0;

      // Performer lookup (static mapping)
      const perfInfo = getPerformerBonus(sauna.name);
      const facilityFacts = prevDetail?.facility_facts as { sauna_temp_c: number | null; water_bath_temp_c: number | null; has_outside_air: boolean | null; loyly_type: string | null } | null;

      const { score: scoreVal } = calculateHonmonoScoreLocal({
        name: sauna.name,
        rating: sauna.rating,
        reviewCount: rc,
        hasWebsite: !!sauna.website,
        reviews: reviewTexts,
        websiteContent: "",
        aiSummary: sauna.ai_summary || "",
        facilityFacts,
        performerBonus: perfInfo.count > 0 ? { count: perfInfo.count, hasLeaderOrOwner: perfInfo.hasLeaderOrOwner } : null,
      });
      (scoreVal as Record<string, unknown>).review_count = rc;
      (scoreVal as Record<string, unknown>).score_version = SCORE_VERSION;
      if (prevDetail?.facility_facts) {
        (scoreVal as Record<string, unknown>).facility_facts = prevDetail.facility_facts;
      }
      if (prevDetail?.ai_summary_en) {
        (scoreVal as Record<string, unknown>).ai_summary_en = prevDetail.ai_summary_en;
      }
      sauna.honmono_score = scoreVal.overall;
      sauna.score_detail = scoreVal;
      // Persist (fire-and-forget)
      sb.from("saunas").update({
        honmono_score: scoreVal.overall,
        score_detail: scoreVal,
      }).eq("id", sauna.id).then(() => {});
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
