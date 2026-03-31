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

    // Refresh from Places API if cache expired or missing details
    if ((cacheExpired || (!sauna.phone && !sauna.website)) && sauna.place_id) {
      const detail = await getPlaceDetail(sauna.place_id);
      if (detail) {
        const updates: Record<string, unknown> = {
          cached_at: new Date().toISOString(),
        };
        if (detail.formatted_phone_number) updates.phone = detail.formatted_phone_number;
        if (detail.website) updates.website = detail.website;
        if (detail.opening_hours) updates.opening_hours = detail.opening_hours;
        if (detail.reviews) updates.google_reviews = detail.reviews;
        if (detail.photos) updates.photos = detail.photos.slice(0, 10).map((p) => p.photo_reference);
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

    // Generate AI summary and food info if missing
    if (!sauna.ai_summary && sauna.google_reviews?.length > 0) {
      const reviewTexts = sauna.google_reviews.map((r: { text: string }) => r.text).filter(Boolean);
      if (reviewTexts.length > 0) {
        const [summary, foodInfo, score] = await Promise.all([
          generateSummary(reviewTexts, sauna.name, sauna.website),
          generateFoodInfo(reviewTexts, sauna.name, sauna.address || "", sauna.website),
          calculateHonmonoScore(reviewTexts, sauna.name),
        ]);
        const aiUpdates: Record<string, unknown> = {
          ai_summary: summary,
          honmono_score: score.overall,
          score_detail: score,
        };
        if (foodInfo) aiUpdates.food_info = foodInfo;
        await sb.from("saunas").update(aiUpdates).eq("id", sauna.id);
        sauna.ai_summary = summary;
        sauna.honmono_score = score.overall;
        sauna.score_detail = score;
        if (foodInfo) sauna.food_info = foodInfo;
      }
    }

    // Generate food info separately if summary exists but food info doesn't
    if (!sauna.food_info && sauna.google_reviews?.length > 0) {
      const reviewTexts = sauna.google_reviews.map((r: { text: string }) => r.text).filter(Boolean);
      if (reviewTexts.length > 0) {
        const foodInfo = await generateFoodInfo(reviewTexts, sauna.name, sauna.address || "", sauna.website);
        if (foodInfo) {
          await sb.from("saunas").update({ food_info: foodInfo }).eq("id", sauna.id);
          sauna.food_info = foodInfo;
        }
      }
    }

    const { data: reviews } = await sb
      .from("reviews")
      .select("*")
      .eq("sauna_id", sauna.id)
      .order("created_at", { ascending: false });

    return NextResponse.json({ sauna, reviews: reviews || [] });
  } catch (error) {
    console.error("Detail error:", error);
    return NextResponse.json({ sauna, reviews: [] });
  }
}
