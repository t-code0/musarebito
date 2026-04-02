import { Client, Language } from "@googlemaps/google-maps-services-js";
import { getServiceSupabase as getServiceClient } from "./supabase";

const client = new Client({});
const CACHE_DAYS = 180;

function photoRefToUrl(ref: string): string {
  if (ref.startsWith("http")) return ref;
  return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference=${ref}&key=${process.env.GOOGLE_PLACES_API_KEY}`;
}

function isCacheExpired(cachedAt: string | null): boolean {
  if (!cachedAt) return true;
  const diff = Date.now() - new Date(cachedAt).getTime();
  return diff > CACHE_DAYS * 24 * 3600_000;
}

export async function searchPlaces(query: string, prefecture?: string) {
  const sb = getServiceClient();
  const searchQuery = prefecture ? `${query} ${prefecture} サウナ` : `${query} サウナ`;

  // Always return DB data first if available
  const { data: cached } = await sb
    .from("saunas")
    .select("*")
    .ilike("name", `%${query}%`);

  if (cached && cached.length > 0) return cached;

  // No data in DB — fetch from Places API
  const res = await client.textSearch({
    params: {
      query: searchQuery,
      key: process.env.GOOGLE_PLACES_API_KEY!,
      language: Language.ja,
    },
  });

  const results = res.data.results || [];
  for (const place of results) {
    const isClosed = place.business_status === "CLOSED_PERMANENTLY";
    await sb.from("saunas").upsert(
      {
        place_id: place.place_id,
        name: place.name || "",
        prefecture: prefecture || "",
        city: "",
        address: place.formatted_address || "",
        lat: place.geometry?.location.lat || 0,
        lng: place.geometry?.location.lng || 0,
        rating: place.rating || 0,
        photos: place.photos?.map((p) => photoRefToUrl(p.photo_reference)) || [],
        cached_at: new Date().toISOString(),
        is_closed: isClosed,
      },
      { onConflict: "place_id" }
    );
  }

  const { data } = await sb
    .from("saunas")
    .select("*")
    .ilike("name", `%${query}%`);

  return data || [];
}

export async function getPlaceDetail(placeId: string) {
  const res = await client.placeDetails({
    params: {
      place_id: placeId,
      key: process.env.GOOGLE_PLACES_API_KEY!,
      language: Language.ja,
      fields: [
        "name",
        "formatted_address",
        "formatted_phone_number",
        "website",
        "opening_hours",
        "reviews",
        "photos",
        "rating",
        "geometry",
        "business_status",
      ],
    },
  });
  return res.data.result;
}

export { isCacheExpired };
export { searchPlaces as searchSaunas };
