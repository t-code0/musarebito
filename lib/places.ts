import { getServiceSupabase } from "./supabase";
import { Sauna } from "@/types/sauna";

const CACHE_HOURS = 24;
const API_KEY = () => process.env.GOOGLE_PLACES_API_KEY!;

// Places API (New) - Text Search
export async function searchSaunas(
  query: string,
  prefecture?: string
): Promise<Sauna[]> {
  const textQuery = prefecture
    ? `サウナ ${query} ${prefecture}`.trim()
    : `サウナ ${query}`.trim();

  const res = await fetch(
    "https://places.googleapis.com/v1/places:searchText",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": API_KEY(),
        "X-Goog-FieldMask":
          "places.id,places.displayName,places.formattedAddress,places.location,places.rating,places.nationalPhoneNumber,places.websiteUri,places.regularOpeningHours,places.photos,places.reviews,places.addressComponents",
      },
      body: JSON.stringify({
        textQuery,
        languageCode: "ja",
        regionCode: "JP",
        maxResultCount: 20,
      }),
    }
  );

  if (!res.ok) {
    const errText = await res.text();
    console.error("Places searchText error:", res.status, errText);
    return [];
  }

  const data = await res.json();
  const places = data.places || [];
  const saunas: Sauna[] = [];

  for (const place of places) {
    if (!place.id) continue;
    const sauna = await getOrCacheSauna(place.id, place);
    if (sauna) saunas.push(sauna);
  }

  return saunas;
}

// Places API (New) - Place Details
async function fetchPlaceDetails(placeId: string) {
  const res = await fetch(
    `https://places.googleapis.com/v1/places/${placeId}`,
    {
      headers: {
        "X-Goog-Api-Key": API_KEY(),
        "X-Goog-FieldMask":
          "id,displayName,formattedAddress,location,rating,nationalPhoneNumber,websiteUri,regularOpeningHours,photos,reviews,addressComponents",
      },
    }
  );

  if (!res.ok) {
    console.error("Places detail error:", res.status, await res.text());
    return null;
  }

  return res.json();
}

function extractPrefecture(
  addressComponents: Array<{
    longText: string;
    types: string[];
  }> | undefined
): string {
  if (!addressComponents) return "";
  const comp = addressComponents.find((c: { types: string[] }) =>
    c.types.includes("administrative_area_level_1")
  );
  return comp?.longText || "";
}

function extractCity(
  addressComponents: Array<{
    longText: string;
    types: string[];
  }> | undefined
): string {
  if (!addressComponents) return "";
  const comp = addressComponents.find((c: { types: string[] }) =>
    c.types.includes("locality")
  );
  return comp?.longText || "";
}

function buildPhotoUrl(photoName: string): string {
  return `https://places.googleapis.com/v1/${photoName}/media?maxWidthPx=800&key=${API_KEY()}`;
}

function placeToSaunaData(placeId: string, detail: Record<string, unknown>) {
  const photos = detail.photos as Array<{ name: string }> | undefined;
  const reviews = detail.reviews as Array<{
    authorAttribution?: { displayName?: string };
    rating?: number;
    text?: { text?: string };
    publishTime?: string;
  }> | undefined;
  const location = detail.location as { latitude: number; longitude: number } | undefined;
  const displayName = detail.displayName as { text?: string } | undefined;
  const openingHours = detail.regularOpeningHours as { weekdayDescriptions?: string[] } | undefined;
  const addressComponents = detail.addressComponents as Array<{
    longText: string;
    types: string[];
  }> | undefined;

  return {
    place_id: placeId,
    name: displayName?.text || "",
    prefecture: extractPrefecture(addressComponents),
    city: extractCity(addressComponents),
    address: (detail.formattedAddress as string) || "",
    lat: location?.latitude || 0,
    lng: location?.longitude || 0,
    rating: (detail.rating as number) || null,
    phone: (detail.nationalPhoneNumber as string) || null,
    website: (detail.websiteUri as string) || null,
    opening_hours: openingHours?.weekdayDescriptions
      ? openingHours.weekdayDescriptions.map((text: string) => ({ text }))
      : null,
    photos: photos
      ? photos.slice(0, 5).map((p) => buildPhotoUrl(p.name))
      : null,
    google_reviews: reviews
      ? reviews.map((r) => ({
          author_name: r.authorAttribution?.displayName || "",
          rating: r.rating || 0,
          text: r.text?.text || "",
          time: r.publishTime
            ? Math.floor(new Date(r.publishTime).getTime() / 1000)
            : 0,
        }))
      : null,
    cached_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

export async function getOrCacheSauna(
  placeId: string,
  searchResult?: Record<string, unknown>
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

  // Use search result data or fetch details
  const detail = searchResult || (await fetchPlaceDetails(placeId));
  if (!detail) return null;

  const saunaData = placeToSaunaData(placeId, detail);

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

  return searchSaunas("", prefecture);
}
