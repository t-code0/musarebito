import { CategorizedPhotos } from "@/types/sauna";

const UA = "Mozilla/5.0 (compatible; musarebito/1.0)";
const TIMEOUT_MS = 8000;
const EXCLUDE_IMG = /icon|logo|favicon|sprite|pixel|badge|button|arrow|loading|svg|gif|video|movie|youtube|banner|ads|tracking/i;
const VALID_EXT = /\.(jpe?g|png|webp|avif)(\?.*)?$/i;

interface CategoryDef {
  key: keyof CategorizedPhotos;
  linkPatterns: RegExp;
}

const CATEGORIES: CategoryDef[] = [
  { key: "interior", linkPatterns: /\/facility|\/guide|\/about|\/info|館内|施設/i },
  { key: "onsen", linkPatterns: /\/onsen|\/bath|\/spa|温泉|お風呂|泉質/i },
  { key: "sauna", linkPatterns: /\/sauna|サウナ|ロウリュ|蒸/i },
  { key: "food", linkPatterns: /\/restaurant|\/food|\/menu|\/dining|食事|レストラン|お食事|グルメ/i },
  { key: "drink", linkPatterns: /\/drink|\/bar|\/cafe|ドリンク|カフェ|バー/i },
];

async function fetchPage(url: string): Promise<string> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { "User-Agent": UA },
    });
    clearTimeout(timer);
    if (!res.ok) return "";
    return await res.text();
  } catch {
    clearTimeout(timer);
    return "";
  }
}

function getBaseUrl(url: string): string {
  try {
    const u = new URL(url);
    return `${u.protocol}//${u.host}`;
  } catch {
    return url.replace(/\/+$/, "");
  }
}

function toAbsolute(src: string, base: string): string {
  if (src.startsWith("//")) return "https:" + src;
  if (src.startsWith("/")) return base + src;
  if (src.startsWith("http")) return src;
  return base + "/" + src;
}

/** Extract the best image URL from an HTML page */
function extractBestImage(html: string, base: string): string | null {
  // Extract all img tags with attributes
  const imgRegex = /<img([^>]+)>/gi;
  const candidates: { src: string; score: number }[] = [];
  let m: RegExpExecArray | null;

  while ((m = imgRegex.exec(html)) !== null) {
    const tag = m[1];

    // Get src (try data-src first for lazy loading)
    const srcMatch = /(?:data-src|data-lazy-src|src)=["']([^"']+)["']/i.exec(tag);
    if (!srcMatch) continue;
    let src = srcMatch[1];
    if (!src || src.startsWith("data:")) continue;
    src = toAbsolute(src, base);

    if (EXCLUDE_IMG.test(src)) continue;
    if (!VALID_EXT.test(src)) continue;

    // Score based on attributes
    let score = 0;
    const wMatch = /width=["']?(\d+)/i.exec(tag);
    const hMatch = /height=["']?(\d+)/i.exec(tag);
    const w = wMatch ? parseInt(wMatch[1]) : 0;
    const h = hMatch ? parseInt(hMatch[1]) : 0;

    // Skip small images
    if ((w > 0 && w < 200) || (h > 0 && h < 150)) continue;

    // Larger images score higher
    if (w >= 600) score += 3;
    else if (w >= 400) score += 2;
    else if (w >= 200) score += 1;

    // Hero/main/top class or id
    if (/hero|main|top|key|visual|feature|primary|banner/i.test(tag)) score += 2;

    // Earlier in DOM = higher priority (via array order)
    candidates.push({ src, score });
  }

  // Also check background-image in CSS
  const bgRegex = /background(?:-image)?\s*:\s*url\(["']?([^"')]+)["']?\)/gi;
  while ((m = bgRegex.exec(html)) !== null) {
    let src = m[1];
    if (src.startsWith("data:")) continue;
    src = toAbsolute(src, base);
    if (EXCLUDE_IMG.test(src)) continue;
    if (VALID_EXT.test(src)) {
      candidates.push({ src, score: 1 });
    }
  }

  if (candidates.length === 0) return null;

  // Sort by score desc, pick first
  candidates.sort((a, b) => b.score - a.score);
  return candidates[0].src;
}

/** Extract all internal links from HTML */
function extractLinks(html: string, base: string): string[] {
  const linkRegex = /href=["']([^"'#]+)["']/gi;
  const links: string[] = [];
  const seen = new Set<string>();
  let m: RegExpExecArray | null;

  while ((m = linkRegex.exec(html)) !== null) {
    let href = m[1];
    if (href.startsWith("mailto:") || href.startsWith("tel:") || href.startsWith("javascript:")) continue;
    href = toAbsolute(href, base);
    // Only same-origin links
    if (!href.startsWith(base)) continue;
    if (seen.has(href)) continue;
    seen.add(href);
    links.push(href);
  }
  return links;
}

export async function scrapeOfficialPhotos(websiteUrl: string): Promise<CategorizedPhotos> {
  const result: CategorizedPhotos = {
    exterior: null, interior: null, onsen: null,
    sauna: null, food: null, drink: null,
  };

  const base = getBaseUrl(websiteUrl);

  // 1. Fetch top page
  const topHtml = await fetchPage(base);
  if (!topHtml) return result;

  // 2. Exterior = best image from top page
  result.exterior = extractBestImage(topHtml, base);

  // 3. Extract all internal links
  const allLinks = extractLinks(topHtml, base);

  // 4. Match links to categories
  const pagesToFetch: { key: keyof CategorizedPhotos; url: string }[] = [];
  for (const cat of CATEGORIES) {
    const matched = allLinks.find(link => cat.linkPatterns.test(link));
    if (matched) {
      pagesToFetch.push({ key: cat.key, url: matched });
    }
  }

  // 5. Fetch category pages (max 6, parallel)
  const fetches = pagesToFetch.slice(0, 6).map(async ({ key, url }) => {
    const html = await fetchPage(url);
    if (!html) return;
    const img = extractBestImage(html, base);
    if (img) result[key] = img;
  });

  await Promise.allSettled(fetches);

  return result;
}
