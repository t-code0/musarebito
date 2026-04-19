const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";
const TIMEOUT = 10000;

async function fetchHTML(url: string): Promise<string> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT);
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

/** Prefecture to sauna-ikitai.com path slug */
const IKITAI_SLUGS: Record<string, string> = {
  "北海道": "hokkaido", "青森県": "aomori", "岩手県": "iwate", "宮城県": "miyagi",
  "秋田県": "akita", "山形県": "yamagata", "福島県": "fukushima",
  "茨城県": "ibaraki", "栃木県": "tochigi", "群馬県": "gunma",
  "埼玉県": "saitama", "千葉県": "chiba", "東京都": "tokyo", "神奈川県": "kanagawa",
  "新潟県": "niigata", "富山県": "toyama", "石川県": "ishikawa", "福井県": "fukui",
  "山梨県": "yamanashi", "長野県": "nagano", "岐阜県": "gifu",
  "静岡県": "shizuoka", "愛知県": "aichi", "三重県": "mie",
  "滋賀県": "shiga", "京都府": "kyoto", "大阪府": "osaka", "兵庫県": "hyogo",
  "奈良県": "nara", "和歌山県": "wakayama",
  "鳥取県": "tottori", "島根県": "shimane", "岡山県": "okayama", "広島県": "hiroshima", "山口県": "yamaguchi",
  "徳島県": "tokushima", "香川県": "kagawa", "愛媛県": "ehime", "高知県": "kochi",
  "福岡県": "fukuoka", "佐賀県": "saga", "長崎県": "nagasaki", "熊本県": "kumamoto",
  "大分県": "oita", "宮崎県": "miyazaki", "鹿児島県": "kagoshima", "沖縄県": "okinawa",
};

/**
 * Scrape sauna-ikitai.com /{prefecture_slug}
 * DOM structure:
 *   <h3>\n  施設名  \n</h3>
 *   <address class="p-saunaItem_address">カテゴリ - 県名&nbsp;市名</address>
 */
function parseIkitaiPage(html: string): { name: string; address: string }[] {
  const facilities: { name: string; address: string }[] = [];
  const blockRegex = /<h3>\s*([^<]+?)\s*<\/h3>[\s\S]*?<address[^>]*class="p-saunaItem_address"[^>]*>([\s\S]*?)<\/address>/gi;
  let m: RegExpExecArray | null;
  while ((m = blockRegex.exec(html)) !== null) {
    const name = m[1].trim().replace(/&amp;/g, "&");
    const addrRaw = m[2].replace(/&nbsp;/g, " ").replace(/<[^>]+>/g, "").trim();
    const locPart = addrRaw.includes(" - ") ? addrRaw.split(" - ")[1]?.trim() || "" : addrRaw;
    if (name && name.length > 2 && name.length < 60) {
      facilities.push({ name, address: locPart });
    }
  }
  return facilities;
}

async function scrapeIkitai(prefecture: string): Promise<{ name: string; address: string }[]> {
  const slug = IKITAI_SLUGS[prefecture];
  if (!slug) return [];

  const all: { name: string; address: string }[] = [];

  for (let page = 1; page <= 10; page++) {
    const url = page === 1
      ? `https://sauna-ikitai.com/${slug}`
      : `https://sauna-ikitai.com/${slug}?page=${page}`;
    const html = await fetchHTML(url);
    if (!html) break;

    const items = parseIkitaiPage(html);
    if (items.length === 0) break;
    all.push(...items);

    // 500ms wait between pages
    if (page < 5) await new Promise(r => setTimeout(r, 500));
  }

  return all;
}

/** Scrape sauna-ikitai.com and return results filtered by prefecture */
export async function scrapeSaunaFacilities(
  prefecture: string
): Promise<{ name: string; address: string }[]> {
  const results = await Promise.allSettled([
    scrapeIkitai(prefecture),
  ]);

  const prefShort = prefecture.replace(/[都道府県]$/, "");
  const seen = new Set<string>();
  const merged: { name: string; address: string }[] = [];

  for (const r of results) {
    if (r.status !== "fulfilled") continue;
    for (const fac of r.value) {
      // Address from ikitai already contains prefecture - verify it matches
      if (fac.address && !fac.address.includes(prefShort) && !fac.address.includes(prefecture)) continue;
      const key = fac.name.replace(/[\s　]+/g, "").toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        merged.push(fac);
      }
    }
  }

  return merged;
}
