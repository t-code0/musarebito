import { NextRequest, NextResponse } from "next/server";
import { getServiceSupabase as getServiceClient } from "@/lib/supabase";
import { calculateHonmonoScoreLocal, SCORE_VERSION } from "@/lib/claude";

export const dynamic = "force-dynamic";

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const sb = getServiceClient();

  const { data: sauna, error } = await sb
    .from("saunas")
    .select("*")
    .eq("id", params.id)
    .single();

  if (error || !sauna) {
    return NextResponse.json({ error: "Sauna not found" }, { status: 404 });
  }

  const prevDetail = (sauna.score_detail as Record<string, unknown> | null) || null;
  const gReviews = sauna.google_reviews as { text: string }[] | null;
  const reviewTexts = (gReviews || []).map((r) => r.text).filter(Boolean);
  const savedRc = prevDetail?.review_count as number | undefined;
  const rc = savedRc || gReviews?.length || 0;
  const facilityFacts = (prevDetail?.facility_facts as {
    sauna_temp_c: number | null;
    water_bath_temp_c: number | null;
    has_outside_air: boolean | null;
    loyly_type: string | null;
  }) || null;

  // Performer lookup
  let perfCount = 0;
  let hasLeader = false;
  const matchedPerformers: string[] = [];
  try {
    const { data: perfData } = await sb
      .from("sauna_performers")
      .select("name,description,facilities")
      .eq("type", "aufgusser");
    if (perfData) {
      const saunaName = sauna.name;
      const matched = perfData.filter((p: Record<string, unknown>) => {
        const facs = p.facilities as string[] | null;
        if (facs && facs.length > 0)
          return facs.some(
            (f: string) =>
              f === saunaName || saunaName.includes(f) || f.includes(saunaName)
          );
        return false;
      });
      perfCount = matched.length;
      hasLeader = matched.some((p: Record<string, unknown>) => {
        const desc = (p.description as string) || "";
        return /リーダー|オーナー|代表|隊長|チーフ/.test(desc);
      });
      matchedPerformers.push(
        ...matched.map((p: Record<string, unknown>) => p.name as string)
      );
    }
  } catch { /* best-effort */ }

  const { score, matchedKw, debug } = calculateHonmonoScoreLocal({
    name: sauna.name,
    rating: sauna.rating,
    reviewCount: rc,
    hasWebsite: !!sauna.website,
    reviews: reviewTexts,
    websiteContent: "",
    aiSummary: sauna.ai_summary || "",
    facilityFacts,
    performerBonus:
      perfCount > 0 ? { count: perfCount, hasLeaderOrOwner: hasLeader } : null,
  });

  const rank =
    score.overall >= 75
      ? "S"
      : score.overall >= 60
        ? "A"
        : score.overall >= 45
          ? "B"
          : "C";

  return NextResponse.json({
    score_version: SCORE_VERSION,
    facility: {
      id: sauna.id,
      name: sauna.name,
      prefecture: sauna.prefecture,
      rating: sauna.rating,
      reviewCount: rc,
      hasWebsite: !!sauna.website,
    },
    result: {
      overall: score.overall,
      rank,
      heat_quality: score.heat_quality,
      water_bath: score.water_bath,
      outside_air: score.outside_air,
      cleanliness: score.cleanliness,
      authenticity: score.authenticity,
      sauna_focus: score.facility,
    },
    category_breakdown: debug,
    inputs: {
      facilityFacts,
      performerCount: perfCount,
      hasLeaderOrOwner: hasLeader,
      matchedPerformers,
      matchedKeywords: matchedKw,
      reviewSample: reviewTexts.slice(0, 3).map((t) => t.slice(0, 100)),
    },
  });
}
