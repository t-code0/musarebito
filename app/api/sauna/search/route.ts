import { NextRequest, NextResponse } from "next/server";
import { searchSaunas, getPlaceDetail } from "@/lib/places";
import { getServiceSupabase as getServiceClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") || "";
  const prefecture = searchParams.get("prefecture") || undefined;

  if (!query && !prefecture) {
    return NextResponse.json(
      { error: "検索キーワードまたは都道府県を指定してください" },
      { status: 400 }
    );
  }

  try {
    const saunas = await searchSaunas(query, prefecture);

    // Prefetch photos for up to 5 saunas with photos=null or empty array
    const needPhotos = saunas
      .filter((s: { photos: unknown; place_id: string }) =>
        (s.photos === null || (Array.isArray(s.photos) && s.photos.length === 0)) && s.place_id
      )
      .slice(0, 5);

    if (needPhotos.length > 0) {
      const sb = getServiceClient();
      const results = await Promise.allSettled(
        needPhotos.map(async (s: { id: string; place_id: string }) => {
          const detail = await getPlaceDetail(s.place_id);
          if (detail?.photos) {
            await sb.from("saunas").update({
              photos: detail.photos,
              cached_at: new Date().toISOString(),
            }).eq("id", s.id);
            // Update in-memory for response
            const idx = saunas.findIndex((x: { id: string }) => x.id === s.id);
            if (idx !== -1) saunas[idx].photos = detail.photos;
          }
        })
      );
      results.forEach((r, i) => {
        if (r.status === "rejected") {
          console.error(`Photo prefetch failed for ${needPhotos[i].name}:`, r.reason);
        }
      });
    }

    return NextResponse.json({ saunas });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("Search error:", msg, error);
    return NextResponse.json(
      { error: "検索中にエラーが発生しました", detail: msg },
      { status: 500 }
    );
  }
}
