import { Client } from "@googlemaps/google-maps-services-js";
import { getServiceSupabase } from "./supabase";
import { Sauna } from "@/types/sauna";

const mapsClient = new Client({});
const CACHE_HOURS = 24;

export async function searchSaunas(
  query: string,
  prefecture?: string
): Promise<Sauna[]> {
  const searchQuery = prefecture
    ? `サウナ ${query} ${prefecture}`
    : `サウナ ${query}`;

  const response = await mapsClient.textSearch({
    params: {
      query: searchQuery,
      key: process.env.GOOGLE_PLACES_API_KEY!,
      language: "ja" as unknown as undefined,
      region: "jp",
    },
  });

  const places = response.data.results || [];
  const saunas: Sauna[] = [];

  for (const place of places) {
    if (!place.place_id) continue;
    const sauna = await getOrCacheSauna(place.place_id);
    if (sauna) saunas.push(sauna);
  }

  return saunas;
}

export async function getOrCacheSauna(
  placeId: string
): Promise<Sauna | null> {
  const supabase = getServiceSupabase();

  // Check cache
  const { data: cached } = await supabase
    .from("saunas")
    .select("*")
    .eq("place_id", placeId)
    .single();

  if (cached) {
    const cachedAt = new Date(cached.cached_at).getTime();
    const now = Date.now();
    const hoursDiff = (now - cachedAt) / (1000 * 60 * 60);

    if (hoursDiff < CACHE_HOURS) {
      return cached as Sauna;
    }
  }

  // Fetch from Google Places
  const detailResponse = await mapsClient.placeDetails({
    params: {
      place_id: placeId,
      key: process.env.GOOGLE_PLACES_API_KEY!,
      language: "ja" as unknown as undefined,
      fields: [
        "place_id",
        "name",
        "formatted_address",
        "geometry",
        "rating",
        "formatted_phone_number",
        "website",
        "opening_hours",
        "photos",
        "reviews",
        "address_components",
      ],
    },
  });

  const detail = detailResponse.data.result;
  if (!detail) return null;

  const addressComponents = detail.address_components || [];
  const prefectureComponent = addressComponents.find((c) =>
    c.types.includes("administrative_area_level_1" as never)
  );
  const cityComponent = addressComponents.find((c) =>
    c.types.includes("locality" as never)
  );

  const saunaData = {
    place_id: placeId,
    name: detail.name || "",
    prefecture: prefectureComponent?.long_name || "",
    city: cityComponent?.long_name || "",
    address: detail.formatted_address || "",
    lat: detail.geometry?.location?.lat || 0,
    lng: detail.geometry?.location?.lng || 0,
    rating: detail.rating || null,
    phone: detail.formatted_phone_number || null,
    website: detail.website || null,
    opening_hours: detail.opening_hours?.weekday_text
      ? detail.opening_hours.weekday_text.map((text: string) => ({
          text,
        }))
      : null,
    photos: detail.photos
      ? detail.photos.slice(0, 5).map(
          (p) =>
            `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference=${p.photo_reference}&key=${process.env.GOOGLE_PLACES_API_KEY}`
        )
      : null,
    google_reviews: detail.reviews
      ? detail.reviews.map((r) => ({
          author_name: r.author_name,
          rating: r.rating,
          text: r.text,
          time: r.time,
        }))
      : null,
    cached_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  if (cached) {
    const { data, error } = await supabase
      .from("saunas")
      .update(saunaData)
      .eq("place_id", placeId)
      .select()
      .single();
    if (error) throw error;
    return data as Sauna;
  } else {
    const { data, error } = await supabase
      .from("saunas")
      .insert({ ...saunaData, created_at: new Date().toISOString() })
      .select()
      .single();
    if (error) throw error;
    return data as Sauna;
  }
}

export async function getSaunasByPrefecture(
  prefecture: string
): Promise<Sauna[]> {
  const supabase = getServiceSupabase();

  const { data } = await supabase
    .from("saunas")
    .select("*")
    .eq("prefecture", prefecture)
    .order("honmono_score", { ascending: false });

  if (data && data.length > 0) {
    return data as Sauna[];
  }

  // If no cached data, search Google
  return searchSaunas("", prefecture);
}
