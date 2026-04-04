import { NextRequest, NextResponse } from "next/server";
import { getServiceSupabase as getServiceClient } from "@/lib/supabase";
import { getPlaceDetail, isCacheExpired } from "@/lib/places";
import { generateSummary, generateFoodInfo, calculateHonmonoScore } from "@/lib/claude";

export const dynamic = "force-dynamic";

/** Background AI generation only — saves to DB */
async function generateAIInBackground(sauna: Record<string, unknown>) {
  const sb = getServiceClient();
  try {
    const needsSummary = !sauna.ai_summary;
    const needsScore = sauna.honmono_score == null;
    const needsFood = !sauna.food_info;

    if (!needsSummary && !needsScore && !needsFood) return;

    const reviews = sauna.google_reviews as { text: string }[] | null;
    const hasReviews = reviews && reviews.length > 0;
    const reviewTexts = hasReviews ? reviews.map((r) => r.text).filter(Boolean) : [];
    const canGenerateFromWeb = reviewTexts.length > 0 || !!sauna.website;
    const textsForAI = reviewTexts.length > 0 ? reviewTexts : ["口コミなし"];

    const [summary, foodInfo, score] = await Promise.allSettled([
      needsSummary && canGenerateFromWeb ? generateSummary(textsForAI, sauna.name as string, sauna.website as string | undefined) : Promise.resolve(null),
      needsFood && canGenerateFromWeb ? generateFoodInfo(textsForAI, sauna.name as string, (sauna.address as string) || "", sauna.website as string | undefined) : Promise.resolve(null),
      needsScore && reviewTexts.length > 0 ? calculateHonmonoScore(reviewTexts, sauna.name as string) : Promise.resolve(null),
    ]);

    const aiUpdates: Record<string, unknown> = {};
    const summaryVal = summary.status === "fulfilled" ? summary.value : null;
    const foodVal = foodInfo.status === "fulfilled" ? foodInfo.value : null;
    const scoreVal = score.status === "fulfilled" ? score.value : null;

    if (summaryVal) aiUpdates.ai_summary = summaryVal;
    if (scoreVal) { aiUpdates.honmono_score = scoreVal.overall; aiUpdates.score_detail = scoreVal; }
    if (foodVal) aiUpdates.food_info = foodVal;

    if (Object.keys(aiUpdates).length > 0) {
      await sb.from("saunas").update(aiUpdates).eq("id", sauna.id);
    }
  } catch (e) {
    console.error("AI generation error:", e);
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const sb = getServiceClient();

  // Fast DB read (parallel)
  const [saunaResult, reviewsResult] = await Promise.all([
    sb.from("saunas").select("*").eq("id", params.id).single(),
    sb.from("sauna_reviews").select("*").eq("sauna_id", params.id).order("created_at", { ascending: false }),
  ]);

  if (saunaResult.error || !saunaResult.data) {
    return NextResponse.json({ error: "Sauna not found" }, { status: 404 });
  }

  const sauna = saunaResult.data;
  const reviews = reviewsResult.data || [];

  // --- Phase 1: Places API refresh (SYNC — needed for photos/reviews) ---
  try {
    const cacheExpired = isCacheExpired(sauna.cached_at);
    const missingPhotos = sauna.photos === null || (Array.isArray(sauna.photos) && sauna.photos.length === 0);

    if ((cacheExpired || missingPhotos || (!sauna.phone && !sauna.website)) && sauna.place_id) {
      const detail = await getPlaceDetail(sauna.place_id, sauna.website);
      if (detail) {
        const updates: Record<string, unknown> = {
          cached_at: new Date().toISOString(),
        };
        if (detail.formatted_phone_number) updates.phone = detail.formatted_phone_number;
        if (detail.website) updates.website = detail.website;
        if (detail.opening_hours) updates.opening_hours = detail.opening_hours;
        if (detail.reviews) updates.google_reviews = detail.reviews;
        if (detail.photos) {
          updates.photos = detail.photos;
        } else if (missingPhotos) {
          updates.photos = [];
        }
        if (detail.business_status === "CLOSED_PERMANENTLY") {
          updates.is_closed = true;
        }
        if (cacheExpired) {
          updates.ai_summary = null;
          updates.honmono_score = null;
          updates.score_detail = null;
          updates.food_info = null;
        }
        await sb.from("saunas").update(updates).eq("id", sauna.id);
        Object.assign(sauna, updates);
      }
    }
  } catch (e) {
    console.error("Places API refresh error:", e);
  }

  // --- Phase 2: AI generation (ASYNC — background, client polls) ---
  const needsAI = !sauna.ai_summary || sauna.honmono_score == null || !sauna.food_info;
  if (needsAI) {
    generateAIInBackground({ ...sauna }).catch(e => console.error("Background AI error:", e));
  }

  return NextResponse.json({ sauna, reviews });
}
