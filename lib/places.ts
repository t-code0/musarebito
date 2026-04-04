import { getServiceSupabase as getServiceClient } from "./supabase";
import { fetchWebsiteImages } from "./claude";

const CACHE_DAYS = 180;
const API_KEY = () => process.env.GOOGLE_PLACES_API_KEY!;
const REFERER = "https://musarebito.vercel.app/";

// Places API (New) base URL
const PLACES_V1 = "https://places.googleapis.com/v1";

function isCacheExpired(cachedAt: string | null): boolean {
  if (!cachedAt) return true;
  const diff = Date.now() - new Date(cachedAt).getTime();
  return diff > CACHE_DAYS * 24 * 3600_000;
}

/** Convert Places API (New) photo name to a direct image URL via Media API redirect */
async function photoNameToUrl(photoName: string): Promise<string> {
  const url = `${PLACES_V1}/${photoName}/media?maxWidthPx=800&key=${API_KEY()}&skipHttpRedirect=true`;
  const res = await fetch(url, { headers: { Referer: REFERER } });
  const data = await res.json();
  return data.photoUri || `${PLACES_V1}/${photoName}/media?maxWidthPx=800&key=${API_KEY()}`;
}

/** Pick 6 photos evenly spread from an array */
function pickEvenly(urls: string[], count: number): string[] {
  if (urls.length <= count) return urls;
  const step = (urls.length - 1) / (count - 1);
  const result: string[] = [];
  for (let i = 0; i < count; i++) {
    result.push(urls[Math.round(i * step)]);
  }
  return result;
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

  // No data in DB — fetch from Places API (New): Text Search
  const res = await fetch(`${PLACES_V1}/places:searchText`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": API_KEY(),
      "X-Goog-FieldMask": "places.id,places.displayName,places.formattedAddress,places.location,places.rating,places.photos,places.businessStatus",
      Referer: REFERER,
    },
    body: JSON.stringify({
      textQuery: searchQuery,
      languageCode: "ja",
    }),
  });
  const data = await res.json();
  const results = data.places || [];

  for (const place of results) {
    const isClosed = place.businessStatus === "CLOSED_PERMANENTLY";
    const photoUrls: string[] = [];
    if (place.photos?.length) {
      for (const p of place.photos.slice(0, 3)) {
        try {
          photoUrls.push(await photoNameToUrl(p.name));
        } catch { /* skip */ }
      }
    }

    await sb.from("saunas").upsert(
      {
        place_id: place.id,
        name: place.displayName?.text || "",
        prefecture: prefecture || "",
        city: "",
        address: place.formattedAddress || "",
        lat: place.location?.latitude || 0,
        lng: place.location?.longitude || 0,
        rating: place.rating || 0,
        photos: photoUrls.length > 0 ? photoUrls : [],
        cached_at: new Date().toISOString(),
        is_closed: isClosed,
      },
      { onConflict: "place_id" }
    );
  }

  const { data: freshData } = await sb
    .from("saunas")
    .select("*")
    .ilike("name", `%${query}%`);

  return freshData || [];
}

/** Fetch place details using Places API (New) */
export async function getPlaceDetail(placeId: string, websiteUrl?: string) {
  const fields = [
    "displayName", "formattedAddress", "nationalPhoneNumber",
    "websiteUri", "regularOpeningHours", "reviews",
    "photos", "rating", "location", "businessStatus",
  ].join(",");

  const res = await fetch(
    `${PLACES_V1}/places/${placeId}?fields=${fields}&languageCode=ja`,
    {
      cache: "no-store",
      headers: {
        "X-Goog-Api-Key": API_KEY(),
        Referer: REFERER,
      },
    }
  );

  if (!res.ok) {
    throw new Error(`Places API error: ${res.status} ${await res.text()}`);
  }

  const place = await res.json();

  // Resolve Google photo URLs: up to 20, filter out tall/narrow (menu/signage)
  const googleUrls: string[] = [];
  if (place.photos?.length) {
    const candidates = place.photos
      .slice(0, 20)
      .filter((p: { widthPx?: number; heightPx?: number }) =>
        !(p.heightPx && p.widthPx && p.heightPx > p.widthPx * 1.5)
      );
    for (const p of candidates) {
      try {
        googleUrls.push(await photoNameToUrl(p.name));
      } catch { /* skip */ }
    }
  }

  // Fetch website images if URL available
  const siteUrl = websiteUrl || place.websiteUri;
  let siteImages: { url: string; path: string }[] = [];
  if (siteUrl) {
    try {
      siteImages = await fetchWebsiteImages(siteUrl);
    } catch { /* skip */ }
  }

  // Merge: website images first (categorized by path), then Google photos
  const saunaPattern = /\/sauna|\/spa|\/onsen|\/bath|風呂|サウナ/i;
  const foodPattern = /\/restaurant|\/food|\/menu|\/cafe|\/drink|レストラン|食事/i;

  const siteSauna = siteImages.filter(img => saunaPattern.test(img.path) || saunaPattern.test(img.url));
  const siteFood = siteImages.filter(img => foodPattern.test(img.path) || foodPattern.test(img.url));
  const siteOther = siteImages.filter(img =>
    !siteSauna.includes(img) && !siteFood.includes(img)
  );

  // Build final list: prioritize website images, fill with Google
  const seen = new Set<string>();
  const finalPhotos: string[] = [];
  const addUnique = (url: string) => {
    if (!seen.has(url) && finalPhotos.length < 6) {
      seen.add(url);
      finalPhotos.push(url);
    }
  };

  // 1. Website sauna/onsen images (up to 2)
  siteSauna.slice(0, 2).forEach(img => addUnique(img.url));
  // 2. Website food images (up to 1)
  siteFood.slice(0, 1).forEach(img => addUnique(img.url));
  // 3. Website other images (up to 1)
  siteOther.slice(0, 1).forEach(img => addUnique(img.url));
  // 4. Fill remaining with Google photos (evenly picked)
  const googlePicked = pickEvenly(googleUrls, 6);
  for (const url of googlePicked) addUnique(url);

  const photos = finalPhotos.length > 0 ? finalPhotos : null;

  return {
    formatted_phone_number: place.nationalPhoneNumber,
    website: place.websiteUri,
    opening_hours: place.regularOpeningHours?.weekdayDescriptions?.map(
      (text: string) => ({ text })
    ),
    reviews: place.reviews?.map((r: { text?: { text: string }; rating?: number; authorAttribution?: { displayName: string }; publishTime?: string }) => ({
      text: r.text?.text || "",
      rating: r.rating || 0,
      author_name: r.authorAttribution?.displayName || "",
      time: r.publishTime ? Math.floor(new Date(r.publishTime).getTime() / 1000) : 0,
    })),
    photos,
    rating: place.rating,
    business_status: place.businessStatus === "CLOSED_PERMANENTLY"
      ? "CLOSED_PERMANENTLY"
      : place.businessStatus,
  };
}

export { isCacheExpired };
export { searchPlaces as searchSaunas };
