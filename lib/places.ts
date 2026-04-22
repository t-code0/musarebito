import { getServiceSupabase as getServiceClient } from "./supabase";
import { findSaunaPhotoIndex } from "./claude";

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

/** Pick N photos evenly spread from an array */
function pickEvenly(urls: string[], count: number): string[] {
  if (urls.length <= count) return urls;
  const step = (urls.length - 1) / (count - 1);
  const result: string[] = [];
  for (let i = 0; i < count; i++) {
    result.push(urls[Math.round(i * step)]);
  }
  return result;
}

/** Check if a place name indicates a non-sauna business */
const EXCLUDE_NAME_PATTERNS = /グッズ|専門店|ショップ|shop|store|販売|用品|ヘッドスパ|マッサージ|エステ|ネイル|美容|整体|接骨|鍼灸|カイロ|ジム|GYM|フィットネス|FITNESS|スポーツクラブ|JOYFIT|エニタイム|ANYTIME|コナミ|ルネサンス|ゴールドジム|GOLD'S|カーブス|ティップネス|セントラルウェルネス/i;

/** Extract city from Japanese address */
function extractCity(address: string): string {
  // Remove prefecture prefix and postal code
  const cleaned = address.replace(/〒\d{3}-?\d{4}\s*/, "").replace(/^日本、?\s*/, "");
  // Match city: 〇〇市, 〇〇区, 〇〇町, 〇〇郡〇〇町, 〇〇村
  const m = cleaned.match(/(?:北海道|東京都|.{2,3}[府県])?\s*(.+?[市区町村])/);
  return m ? m[1].trim() : "";
}

/** Save places from API results to DB */
async function savePlacesToDB(
  places: Record<string, unknown>[],
  prefecture: string,
  sb: ReturnType<typeof getServiceClient>,
) {
  for (const place of places) {
    const name = ((place as { displayName?: { text: string } }).displayName)?.text || "";
    if (EXCLUDE_NAME_PATTERNS.test(name)) continue;

    const isClosed = (place as { businessStatus?: string }).businessStatus === "CLOSED_PERMANENTLY";
    const photos = place.photos as { name: string }[] | undefined;
    const photoUrls: string[] = [];
    if (photos?.length) {
      for (const p of photos.slice(0, 10)) {
        try { photoUrls.push(await photoNameToUrl(p.name)); } catch { /* skip */ }
      }
    }

    const addr = ((place as { formattedAddress?: string }).formattedAddress) || "";
    const city = extractCity(addr);

    await sb.from("saunas").upsert(
      {
        place_id: (place as { id?: string }).id,
        name: ((place as { displayName?: { text: string } }).displayName)?.text || "",
        prefecture,
        city,
        address: addr,
        lat: ((place as { location?: { latitude: number } }).location)?.latitude || 0,
        lng: ((place as { location?: { longitude: number } }).location)?.longitude || 0,
        rating: (place as { rating?: number }).rating || 0,
        photos: photoUrls.length > 0 ? photoUrls : [],
        cached_at: new Date().toISOString(),
        is_closed: isClosed,
      },
      { onConflict: "place_id" }
    );
  }
}

export async function searchPlaces(query: string, prefecture?: string) {
  const sb = getServiceClient();
  const searchQuery = prefecture
    ? (query ? `${query} ${prefecture} サウナ` : `${prefecture} サウナ`)
    : `${query} サウナ`;

  // Return DB data if available (no limit)
  let dbQuery = sb.from("saunas").select("*");
  if (prefecture) dbQuery = dbQuery.eq("prefecture", prefecture);
  if (query) dbQuery = dbQuery.ilike("name", `%${query}%`);
  dbQuery = dbQuery.order("honmono_score", { ascending: false, nullsFirst: false }).order("rating", { ascending: false });
  const { data: cached } = await dbQuery;

  if (cached && cached.length > 0) return cached;

  // No data in DB — fetch from Places API with a single keyword (cold-start: keep it cheap)
  const coldKeyword = prefecture && !query ? `サウナ ${prefecture}` : searchQuery;

  const seenIds = new Set<string>();
  const allPlaces: Record<string, unknown>[] = [];

  const res = await fetch(`${PLACES_V1}/places:searchText`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": API_KEY(),
      "X-Goog-FieldMask": "places.id,places.displayName,places.formattedAddress,places.location,places.rating,places.photos,places.businessStatus",
      Referer: REFERER,
    },
    body: JSON.stringify({ textQuery: coldKeyword, languageCode: "ja", pageSize: 20 }),
  });
  const data = await res.json();
  for (const p of data.places || []) {
    if (!seenIds.has(p.id)) {
      seenIds.add(p.id);
      allPlaces.push(p);
    }
  }

  await savePlacesToDB(allPlaces, prefecture || "", sb);

  // Re-read from DB with same filters
  let freshQuery = sb.from("saunas").select("*");
  if (prefecture) freshQuery = freshQuery.eq("prefecture", prefecture);
  if (query) freshQuery = freshQuery.ilike("name", `%${query}%`);
  freshQuery = freshQuery.order("honmono_score", { ascending: false, nullsFirst: false }).order("rating", { ascending: false });
  const { data: freshData } = await freshQuery;

  return freshData || [];
}

/** Bulk seed: search and save for a specific query */
export async function seedSearch(searchQuery: string, prefecture: string) {
  const sb = getServiceClient();
  let allPlaces: Record<string, unknown>[] = [];
  let pageToken: string | undefined;

  for (let page = 0; page < 3; page++) {
    const body: Record<string, unknown> = {
      textQuery: searchQuery,
      languageCode: "ja",
      pageSize: 20,
    };
    if (pageToken) body.pageToken = pageToken;

    const res = await fetch(`${PLACES_V1}/places:searchText`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": API_KEY(),
        "X-Goog-FieldMask": "places.id,places.displayName,places.formattedAddress,places.location,places.rating,places.photos,places.businessStatus,nextPageToken",
        Referer: REFERER,
      },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    allPlaces = allPlaces.concat(data.places || []);
    pageToken = data.nextPageToken;
    if (!pageToken) break;
  }

  await savePlacesToDB(allPlaces, prefecture, sb);
  return allPlaces.length;
}

/** Fetch place details using Places API (New) */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function getPlaceDetail(placeId: string, websiteUrl?: string) {
  const fields = [
    "displayName", "formattedAddress", "nationalPhoneNumber",
    "websiteUri", "regularOpeningHours", "reviews", "userRatingCount",
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

  // Google Photos: up to 20, near-square only
  const googleUrls: string[] = [];
  if (place.photos?.length) {
    const candidates = place.photos
      .slice(0, 20)
      .filter((p: { widthPx?: number; heightPx?: number }) => {
        if (!p.widthPx || !p.heightPx) return true;
        const ratio = p.widthPx / p.heightPx;
        return ratio > 0.5 && ratio < 2.0;
      });
    for (const p of candidates) {
      try {
        googleUrls.push(await photoNameToUrl(p.name));
      } catch { /* skip */ }
    }
  }
  // Pick up to 10, then try to find sauna photo and put it first
  let photos: string[] | null = null;
  if (googleUrls.length > 0) {
    const picked = pickEvenly(googleUrls, 10);
    try {
      const saunaIdx = await findSaunaPhotoIndex(googleUrls);
      if (saunaIdx !== null) {
        const saunaUrl = googleUrls[saunaIdx];
        const rest = picked.filter(u => u !== saunaUrl);
        photos = [saunaUrl, ...rest].slice(0, 10);
      } else {
        photos = picked;
      }
    } catch {
      photos = picked;
    }
  }

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
    review_count: place.userRatingCount || 0,
    business_status: place.businessStatus === "CLOSED_PERMANENTLY"
      ? "CLOSED_PERMANENTLY"
      : place.businessStatus,
  };
}

/** Normalize facility name for comparison */
function normalizeName(name: string): string {
  return name
    .replace(/[Ａ-Ｚａ-ｚ０-９]/g, s => String.fromCharCode(s.charCodeAt(0) - 0xFEE0))
    .replace(/＆/g, "&")
    .replace(/[\s　]+/g, "")
    .toLowerCase();
}

/** Register missing saunas from an external facility list */
export async function registerMissingSaunas(
  facilities: { name: string; address: string }[],
  prefecture: string
): Promise<{ registered: string[]; existing: string[]; notFound: string[] }> {
  const sb = getServiceClient();
  const registered: string[] = [];
  const existing: string[] = [];
  const notFound: string[] = [];
  let count = 0;

  // Pre-fetch all DB names for this prefecture (normalize for comparison)
  const { data: dbSaunas } = await sb
    .from("saunas")
    .select("name")
    .eq("prefecture", prefecture);
  const dbNormalized = new Set(
    (dbSaunas || []).map((s: { name: string }) => normalizeName(s.name))
  );

  for (const fac of facilities) {
    if (count >= 15) break;
    if (EXCLUDE_NAME_PATTERNS.test(fac.name)) continue;
    if (count > 0 && count % 5 === 0) await new Promise(r => setTimeout(r, 1000));

    // Check if already in DB (normalized comparison)
    if (dbNormalized.has(normalizeName(fac.name))) {
      existing.push(fac.name);
      continue;
    }

    // Search via Places API
    const searchQ = `${fac.name} ${fac.address || prefecture}`;
    const res = await fetch(`${PLACES_V1}/places:searchText`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": API_KEY(),
        "X-Goog-FieldMask": "places.id,places.displayName,places.formattedAddress,places.location,places.rating,places.photos,places.businessStatus",
        Referer: REFERER,
      },
      body: JSON.stringify({ textQuery: searchQ, languageCode: "ja", pageSize: 1 }),
    });
    const data = await res.json();
    const places = data.places || [];

    if (places.length > 0) {
      // Verify the result is actually in the target prefecture
      const addr = places[0].formattedAddress || "";
      const prefShort = prefecture.replace(/[都道府県]$/, "");
      if (!addr.includes(prefShort) && !addr.includes(prefecture)) {
        notFound.push(fac.name + " (県外)");
        continue;
      }
      await savePlacesToDB(places, prefecture, sb);
      registered.push(fac.name);
      dbNormalized.add(normalizeName(fac.name));
      // Also add the Google name to prevent re-registration
      const gName = places[0].displayName?.text;
      if (gName) dbNormalized.add(normalizeName(gName));
      count++;
    } else {
      notFound.push(fac.name);
    }
  }

  return { registered, existing, notFound };
}

export { isCacheExpired };
export { searchPlaces as searchSaunas };
