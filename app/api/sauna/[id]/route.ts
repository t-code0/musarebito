import { NextRequest, NextResponse } from "next/server";
import { getServiceSupabase as getServiceClient } from "@/lib/supabase";
import { getPlaceDetail, isCacheExpired } from "@/lib/places";
import { generateSummary, generateFoodInfo, calculateHonmonoScore } from "@/lib/claude";

export async function GET(
  request: NextRequest,
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

  try {
    const cacheExpired = isCacheExpired(sauna.cached_at);
    const missingPhotos = !sauna.photos || sauna.photos.length === 0;

    // Refresh from Places API if cache expired, missing photos, or missing details
    if ((cacheExpired || missingPhotos || (!sauna.phone && !sauna.website)) && sauna.place_id) {
      const detail = await getPlaceDetail(sauna.place_id);
      if (detail) {
        const updates: Record<string, unknown> = {
          cached_at: new Date().toISOString(),
        };
        if (detail.formatted_phone_number) updates.phone = detail.formatted_phone_number;
        if (detail.website) updates.website = detail.website;
        if (detail.opening_hours) updates.opening_hours = detail.opening_hours;
        if (detail.reviews) updates.google_reviews = detail.reviews;
        if (detail.photos) updates.photos = detail.photos.slice(0, 10).map((p) => {
          const ref = p.photo_reference;
          return ref.startsWith("http") ? ref : `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference=${ref}&key=${process.env.GOOGLE_PLACES_API_KEY}`;
        });
        if (detail.business_status === "CLOSED_PERMANENTLY") {
          updates.is_closed = true;
        }
        // Reset AI-generated fields on cache refresh
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

    // Generate AI fields if any are missing
    const needsSummary = !sauna.ai_summary;
    const needsScore = sauna.honmono_score == null;
    const needsFood = !sauna.food_info;

    if ((needsSummary || needsScore || needsFood) && sauna.google_reviews?.length > 0) {
      const reviewTexts = sauna.google_reviews.map((r: { text: string }) => r.text).filter(Boolean);
      if (reviewTexts.length > 0) {
        const promises = [
          needsSummary ? generateSummary(reviewTexts, sauna.name, sauna.website) : Promise.resolve(null),
          needsFood ? generateFoodInfo(reviewTexts, sauna.name, sauna.address || "", sauna.website) : Promise.resolve(null),
          needsScore ? calculateHonmonoScore(reviewTexts, sauna.name) : Promise.resolve(null),
        ] as const;
        const [summary, foodInfo, score] = await Promise.all(promises);

        const aiUpdates: Record<string, unknown> = {};
        if (summary) { aiUpdates.ai_summary = summary; sauna.ai_summary = summary; }
        if (score) { aiUpdates.honmono_score = score.overall; aiUpdates.score_detail = score; sauna.honmono_score = score.overall; sauna.score_detail = score; }
        if (foodInfo) { aiUpdates.food_info = foodInfo; sauna.food_info = foodInfo; }

        if (Object.keys(aiUpdates).length > 0) {
          await sb.from("saunas").update(aiUpdates).eq("id", sauna.id);
        }
      }
    }

    const { data: reviews } = await sb
      .from("sauna_reviews")
      .select("*")
      .eq("sauna_id", sauna.id)
      .order("created_at", { ascending: false });

    return NextResponse.json({ sauna, reviews: reviews || [] });
  } catch (error) {
    console.error("Detail error:", error);
    return NextResponse.json({ sauna, reviews: [] });
  }
}
