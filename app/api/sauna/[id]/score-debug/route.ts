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

  // Performer lookup (static mapping)
  const perfInfo = getPerformerBonus(sauna.name);

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
      perfInfo.count > 0 ? { count: perfInfo.count, hasLeaderOrOwner: perfInfo.hasLeaderOrOwner } : null,
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
      performerCount: perfInfo.count,
      hasLeaderOrOwner: perfInfo.hasLeaderOrOwner,
      matchedPerformers: perfInfo.performers,
      matchedKeywords: matchedKw,
      reviewSample: reviewTexts.slice(0, 3).map((t) => t.slice(0, 100)),
    },
  });
}
