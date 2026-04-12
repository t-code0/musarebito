import { NextRequest, NextResponse } from "next/server";
import { getServiceSupabase as getServiceClient } from "@/lib/supabase";
import { getPlaceDetail, isCacheExpired } from "@/lib/places";
import {
  generateSummary,
  generateFoodInfo,
  prefetchWebsiteContent,
  extractFacilityFacts,
  translateSummaryToEnglish,
} from "@/lib/claude";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function POST(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  return handle(params.id);
}

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  return handle(params.id);
}

async function handle(id: string) {
  const sb = getServiceClient();

  const { data: sauna, error } = await sb
    .from("saunas")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !sauna) {
    return NextResponse.json({ error: "Sauna not found" }, { status: 404 });
  }

  // --- Phase 1: Places API refresh (only when really needed) ---
  try {
    const cacheExpired = isCacheExpired(sauna.cached_at);
    const missingPhotos =
      sauna.photos === null ||
      (Array.isArray(sauna.photos) && sauna.photos.length === 0);

    if (
      (cacheExpired || missingPhotos || (!sauna.phone && !sauna.website)) &&
      sauna.place_id
    ) {
      const detail = await getPlaceDetail(sauna.place_id, sauna.website);
      if (detail) {
        const updates: Record<string, unknown> = {
          cached_at: new Date().toISOString(),
        };
        if (detail.formatted_phone_number)
          updates.phone = detail.formatted_phone_number;
        if (detail.website) updates.website = detail.website;
        if (detail.opening_hours) updates.opening_hours = detail.opening_hours;
        if (detail.reviews) updates.google_reviews = detail.reviews;
        if (detail.photos) updates.photos = detail.photos;
        if (detail.business_status === "CLOSED_PERMANENTLY") {
          updates.is_closed = true;
        }
        await sb.from("saunas").update(updates).eq("id", sauna.id);
        Object.assign(sauna, updates);
      }
    }
  } catch (e) {
    console.error("Places API refresh error:", e);
  }

  // --- Phase 2: AI generation (summary + food + facility facts — score is computed in /api/sauna/[id]) ---
  try {
    const existingDetail = (sauna.score_detail as Record<string, unknown> | null) || null;
    const needsSummary = !sauna.ai_summary;
    const needsFood = !sauna.food_info;
    const needsFacts = !existingDetail || !existingDetail.facility_facts;

    if (needsSummary || needsFood || needsFacts) {
      const gReviews = sauna.google_reviews as { text: string }[] | null;
      const reviewTexts = (gReviews || []).map((r) => r.text).filter(Boolean);
      const canGenerateFromWeb = reviewTexts.length > 0 || !!sauna.website;
      const textsForAI = reviewTexts.length > 0 ? reviewTexts : ["口コミなし"];

      const websiteContent = sauna.website
        ? await prefetchWebsiteContent(sauna.website)
        : "";

      const [summary, foodInfo, facilityFacts] = await Promise.allSettled([
        needsSummary && canGenerateFromWeb
          ? generateSummary(textsForAI, sauna.name, undefined, websiteContent, {
              address: sauna.address,
              rating: sauna.rating,
            })
          : Promise.resolve(null),
        needsFood && canGenerateFromWeb
          ? generateFoodInfo(
              textsForAI,
              sauna.name,
              sauna.address || "",
              undefined,
              websiteContent
            )
          : Promise.resolve(null),
        needsFacts && canGenerateFromWeb
          ? extractFacilityFacts(websiteContent, reviewTexts)
          : Promise.resolve(null),
      ]);

      const aiUpdates: Record<string, unknown> = {};
      const summaryVal =
        summary.status === "fulfilled" ? summary.value : null;
      const foodVal = foodInfo.status === "fulfilled" ? foodInfo.value : null;
      const factsVal =
        facilityFacts.status === "fulfilled" ? facilityFacts.value : null;

      if (summaryVal && needsSummary) {
        aiUpdates.ai_summary = summaryVal;
        sauna.ai_summary = summaryVal;
      }
      if (foodVal) {
        aiUpdates.food_info = foodVal;
        sauna.food_info = foodVal;
      }
      if (factsVal && needsFacts) {
        // Persist inside score_detail.facility_facts (preserves through other code paths)
        const baseDetail = (existingDetail || {}) as Record<string, unknown>;
        const updatedDetail = { ...baseDetail, facility_facts: factsVal };
        aiUpdates.score_detail = updatedDetail;
        sauna.score_detail = updatedDetail as never;
      }

      if (Object.keys(aiUpdates).length > 0) {
        await sb.from("saunas").update(aiUpdates).eq("id", sauna.id);
      }
    }

    // --- Phase 3: English summary translation (cached in score_detail.ai_summary_en) ---
    const sd = (sauna.score_detail as Record<string, unknown> | null) || {};
    const hasJa = !!sauna.ai_summary;
    const hasEn = typeof sd.ai_summary_en === "string" && (sd.ai_summary_en as string).length > 0;
    if (hasJa && !hasEn) {
      const en = await translateSummaryToEnglish(
        sauna.ai_summary as string,
        sauna.name,
        sauna.address || ""
      );
      if (en) {
        const updatedDetail = { ...sd, ai_summary_en: en };
        sauna.score_detail = updatedDetail as never;
        await sb
          .from("saunas")
          .update({ score_detail: updatedDetail })
          .eq("id", sauna.id);
      }
    }
  } catch (e) {
    console.error("AI generation error:", e);
  }

  return NextResponse.json({ sauna });
}
