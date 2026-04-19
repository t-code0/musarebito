import { NextRequest, NextResponse } from "next/server";
import { searchSaunas, getPlaceDetail } from "@/lib/places";
import { getServiceSupabase as getServiceClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") || "";
  const prefecture = searchParams.get("prefecture") || undefined;
  const featured = searchParams.get("featured") === "true";

  // Featured: return top-scored saunas across all prefectures
  if (featured) {
    try {
      const sb = getServiceClient();
      const { data: scored, error } = await sb
        .from("saunas")
        .select("id, name, honmono_score, prefecture, photos, score_detail")
        .not("honmono_score", "is", null)
        .order("honmono_score", { ascending: false })
        .limit(9);
      if (error) throw error;

      const scoredCount = scored?.length || 0;
      if (scoredCount >= 9) {
        return NextResponse.json({ saunas: scored });
      }

      // Fallback: fill with high-rated facilities that have photos
      const need = 9 - scoredCount;
      const excludeIds = (scored || []).map((s) => s.id);
      let fb = sb
        .from("saunas")
        .select("id, name, honmono_score, prefecture, photos, score_detail, rating")
        .is("honmono_score", null)
        .not("photos", "is", null)
        .order("rating", { ascending: false, nullsFirst: false })
        .limit(need * 3);
      if (excludeIds.length > 0) {
        fb = fb.not("id", "in", `(${excludeIds.map((id) => `"${id}"`).join(",")})`);
      }
      const { data: fallback } = await fb;
      const withPhotos = (fallback || [])
        .filter((s) => Array.isArray(s.photos) && s.photos.length > 0)
        .slice(0, need);
      return NextResponse.json({ saunas: [...(scored || []), ...withPhotos] });
    } catch {
      return NextResponse.json({ saunas: [] });
    }
  }

  if (!query && !prefecture) {
    return NextResponse.json(
      { error: "検索キーワードまたは都道府県を指定してください" },
      { status: 400 }
    );
  }

  // Minimal column set to keep payload small and queries fast.
  // Exclude heavy columns (google_reviews, score_detail, food_info, opening_hours).
  const LIST_COLUMNS =
    "id, place_id, name, prefecture, city, address, lat, lng, rating, honmono_score, photos, ai_summary, website, phone, is_closed, created_at";

  try {
    // DB-first search: try Supabase before hitting Places API
    if (query) {
      const sb = getServiceClient();
      const pattern = `%${query}%`;
      let dbQuery = sb
        .from("saunas")
        .select(LIST_COLUMNS)
        .or(`name.ilike.${pattern},address.ilike.${pattern}`)
        .limit(30);
      if (prefecture) {
        dbQuery = dbQuery.eq("prefecture", prefecture);
      }
      const { data: dbHits } = await dbQuery;
      if (dbHits && dbHits.length > 0) {
        const response = NextResponse.json({ saunas: dbHits });
        response.headers.set("Cache-Control", "public, s-maxage=300, stale-while-revalidate=600");
        return response;
      }
    } else if (prefecture) {
      // Prefecture-only browse: always serve from DB
      const sb = getServiceClient();
      const { data: dbHits } = await sb
        .from("saunas")
        .select(LIST_COLUMNS)
        .eq("prefecture", prefecture)
        .limit(200);
      if (dbHits && dbHits.length > 0) {
        const response = NextResponse.json({ saunas: dbHits });
        response.headers.set("Cache-Control", "public, s-maxage=300, stale-while-revalidate=600");
        return response;
      }
    }

    const saunas = await searchSaunas(query, prefecture);

    // Prefetch photos for ALL saunas with photos=null or empty
    const needPhotos = saunas.filter(
      (s: { photos: unknown; place_id: string }) =>
        (s.photos === null || (Array.isArray(s.photos) && s.photos.length === 0)) && s.place_id
    );

    if (needPhotos.length > 0) {
      const sb = getServiceClient();
      // Process in batches of 5 concurrently
      for (let i = 0; i < needPhotos.length; i += 5) {
        const batch = needPhotos.slice(i, i + 5);
        const results = await Promise.allSettled(
          batch.map(async (s: { id: string; place_id: string; website?: string }) => {
            const detail = await getPlaceDetail(s.place_id, s.website);
            if (detail?.photos) {
              await sb.from("saunas").update({
                photos: detail.photos,
                cached_at: new Date().toISOString(),
              }).eq("id", s.id);
              const idx = saunas.findIndex((x: { id: string }) => x.id === s.id);
              if (idx !== -1) saunas[idx].photos = detail.photos;
            }
          })
        );
        results.forEach((r, j) => {
          if (r.status === "rejected") {
            console.error(`Photo prefetch failed for ${batch[j].name}:`, r.reason);
          }
        });
      }
    }

    const response = NextResponse.json({ saunas });
    response.headers.set("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
    return response;
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("Search error:", msg, error);
    return NextResponse.json(
      { error: "検索中にエラーが発生しました", detail: msg },
      { status: 500 }
    );
  }
}
