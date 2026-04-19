import { ScoreDetail } from "@/types/sauna";

export interface FoodInfo {
  restaurant: string;
  local_food: string[];
  nearby_spots: string[];
}

async function fetchSinglePage(url: string): Promise<string> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { "User-Agent": "Mozilla/5.0 (compatible; musarebito/1.0)" },
    });
    clearTimeout(timeout);
    if (!res.ok) {
      console.log(`[fetchWebsite] ${url} → HTTP ${res.status}`);
      return "";
    }
    const html = await res.text();
    console.log(`[fetchWebsite] ${url} → ${html.length} chars fetched`);
    const cleaned = html
      .replace(/<script[\s\S]*?<\/script>/gi, "")
      .replace(/<style[\s\S]*?<\/style>/gi, "")
      .replace(/<nav[\s\S]*?<\/nav>/gi, "")
      .replace(/<header[\s\S]*?<\/header>/gi, "")
      .replace(/<footer[\s\S]*?<\/footer>/gi, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    console.log(`[fetchWebsite] ${url} → ${cleaned.length} chars after cleanup`);
    return cleaned;
  } catch (e) {
    console.log(`[fetchWebsite] ${url} → error: ${e}`);
    return "";
  }
}

function getBaseUrl(url: string): string {
  try {
    const parsed = new URL(url);
    return `${parsed.protocol}//${parsed.host}`;
  } catch {
    return url.replace(/\/+$/, "");
  }
}

async function fetchWebsiteContent(url: string): Promise<string> {
  const baseUrl = getBaseUrl(url);
  const subPages = ["/sauna/", "/spa/", "/restaurant/", "/neppa/", "/aufguss/", "/event/", "/staff/"];
  const urls = [baseUrl, ...subPages.map((p) => `${baseUrl}${p}`)];

  const results = await Promise.allSettled(
    urls.map((u) => fetchSinglePage(u))
  );

  const combined = results
    .map((r) => (r.status === "fulfilled" ? r.value : ""))
    .filter(Boolean)
    .join("\n\n");

  console.log(`[fetchWebsite] combined total: ${combined.length} chars`);
  return combined.slice(0, 5000);
}

/** Fetch image URLs from a website's HTML pages */
export async function fetchWebsiteImages(websiteUrl: string): Promise<{ url: string; path: string }[]> {
  const baseUrl = getBaseUrl(websiteUrl);
  const subPages = ["/sauna/", "/spa/", "/onsen/", "/bath/", "/restaurant/", "/menu/", "/food/", "/drink/", "/gallery/"];
  const urls = [baseUrl, ...subPages.map((p) => `${baseUrl}${p}`)];

  const excludePatterns = /thumbnail|icon|logo|banner|favicon|sprite|pixel|tracking|badge|button|arrow|loading|video|movie|concept|youtube|youtu\.be/i;
  const validExtensions = /\.(jpe?g|png|webp|avif)(\?.*)?$/i;

  const allImages: { url: string; path: string }[] = [];
  const seen = new Set<string>();

  const results = await Promise.allSettled(
    urls.map(async (pageUrl) => {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 5000);
        const res = await fetch(pageUrl, {
          signal: controller.signal,
          headers: { "User-Agent": "Mozilla/5.0 (compatible; musarebito/1.0)" },
        });
        clearTimeout(timeout);
        if (!res.ok) return [];
        const html = await res.text();

        const pagePath = new URL(pageUrl).pathname;
        const images: { url: string; path: string }[] = [];

        const addImage = (rawSrc: string) => {
          let src = rawSrc;
          if (!src || src.startsWith("data:")) return;
          if (src.startsWith("//")) src = "https:" + src;
          else if (src.startsWith("/")) src = baseUrl + src;
          else if (!src.startsWith("http")) src = baseUrl + "/" + src;

          if (excludePatterns.test(src)) return;
          if (!validExtensions.test(src)) return;
          if (seen.has(src)) return;
          seen.add(src);
          images.push({ url: src, path: pagePath });
        };

        // 1. <img> tags: src and data-src (lazy loading)
        const imgRegex = /<img([^>]+)>/gi;
        const widthRegex = /width=["']?(\d+)/i;
        const heightRegex = /height=["']?(\d+)/i;
        let m: RegExpExecArray | null;
        while ((m = imgRegex.exec(html)) !== null) {
          if (images.length >= 5) break;
          const tag = m[1];
          // Skip small images
          const w = widthRegex.exec(tag);
          const h = heightRegex.exec(tag);
          if ((w && parseInt(w[1]) <= 100) || (h && parseInt(h[1]) <= 100)) continue;

          // Try src, then data-src, then data-lazy-src
          const srcMatch = /(?:data-src|data-lazy-src|src)=["']([^"']+)["']/i.exec(tag);
          if (srcMatch) addImage(srcMatch[1]);
        }

        // 2. CSS background-image: url(...)
        const bgRegex = /background(?:-image)?\s*:\s*url\(["']?([^"')]+)["']?\)/gi;
        while ((m = bgRegex.exec(html)) !== null) {
          if (images.length >= 5) break;
          addImage(m[1]);
        }

        return images;
      } catch {
        return [];
      }
    })
  );

  for (const r of results) {
    if (r.status === "fulfilled") allImages.push(...r.value);
  }

  return allImages.slice(0, 20);
}

/** Pre-fetch website content (exported for route.ts to call once) */
export async function prefetchWebsiteContent(url: string): Promise<string> {
  return fetchWebsiteContent(url);
}

export async function generateSummary(
  reviews: string[],
  name: string,
  websiteUrl?: string,
  prefetchedContent?: string,
  meta?: { address?: string; rating?: number | null }
): Promise<string> {
  const raw = prefetchedContent ?? (websiteUrl ? await fetchWebsiteContent(websiteUrl) : "");
  const websiteContent = raw.slice(0, 4000);
  const reviewText = reviews.slice(0, 5).map(r => r.slice(0, 500)).join("\n---\n");
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY!,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 300,
        messages: [
          {
            role: "user",
            content: `あなたはサウナ施設の紹介記事を書くライターです。
以下の情報をもとに、この施設の特徴を200字以内で書いてください。

【絶対厳守ルール】
1.「申し訳ございません」「情報が不足」「記事作成が困難」「ルールを満たさない」等の言い訳は絶対に書かない。どんなに情報が少なくても必ず紹介文を書く。
2. 情報が少ない場合は、ある情報だけで短く書く。50字でもOK。
3. ネガティブ表現は絶対禁止。「課題」「問題」「不足」「限定的」「低い」「不明」「困難」「痛い」「臭い」「汚い」「古い」「狭い」「混む」禁止。
4.「記載なし」「詳細なし」「情報がない」は絶対に書かない。ない情報には一切言及しない。
5. 人物名には必ず肩書きを補足する。
6. 対策の提案や情報提供のお願いは絶対に書かない。紹介文を書くだけ。
7.「衛生管理に課題」「清潔感に課題」等は名誉毀損リスクがあるため絶対禁止。
8. 公式サイトに熱波師・アウフグーサー・イベント・スタッフの情報があれば、代表者名と人数を含めて紹介文に反映する。全員の名前は不要、代表者と人数だけでOK。

【公式サイト情報】${websiteContent || "なし"}
【口コミ】${reviewText || "なし"}`,
          },
        ],
      }),
    });
    if (!res.ok) {
      console.error("[generateSummary] API error:", res.status);
    } else {
      const data = await res.json();
      const text = data.content?.[0]?.text;
      if (text) return text;
    }
  } catch (e) {
    console.error("[generateSummary] error:", e);
  } finally {
    clearTimeout(timeout);
  }

  // Fallback: simple description without review content
  const area = meta?.address?.match(/[都道府県].+?[市区町村]/)?.[0] || "";
  return `${name}${area ? "は" + area + "にある" : "の"}サウナ施設。`;
}

export async function generateFoodInfo(
  reviews: string[],
  name: string,
  address: string,
  websiteUrl?: string,
  prefetchedContent?: string
): Promise<FoodInfo | null> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    const websiteContent = prefetchedContent ?? (websiteUrl ? await fetchWebsiteContent(websiteUrl) : "");
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY!,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 300,
        messages: [
          {
            role: "user",
            content: `以下の【公式サイト情報】と【口コミ】から施設の食事・グルメ情報をJSONで返してください。
公式サイトにメニューがあればそこから具体的な料理名・特徴を抽出すること。
{"restaurant": "名物料理や食事の特徴を具体的に（例：自家製すくい豆腐・10種スパイスカレー）", "local_food": ["周辺ご当地グルメ3つ"], "nearby_spots": ["近くの観光スポット3つ"]}
「不明」禁止。必ず埋めること。
【公式サイト情報】${websiteContent || "なし"}
【口コミ】${reviews.join("\n---\n")}

以下のJSON形式のみで返してください。JSON以外の文字は一切含めないでください：
{"restaurant": "string", "local_food": ["string","string","string"], "nearby_spots": ["string","string","string"]}`,
          },
        ],
      }),
    });
    const data = await res.json();
    const text = data.content?.[0]?.text;
    if (!text) return null;
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return null;
    return JSON.parse(jsonMatch[0]) as FoodInfo;
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

/** Score algorithm version — bump when logic changes to trigger batch rescore */
export const SCORE_VERSION = 3;

interface PerformerBonusInput {
  count: number;
  hasLeaderOrOwner: boolean;
}

export interface CategoryBreakdown {
  [cat: string]: { base: number; facts: number; performer: number; floor: number; final: number };
}

/**
 * Whitelist of famous sauna facilities per prefecture.
 * Matched facilities are guaranteed a minimum overall score of 75 (S rank).
 * Uses substring matching against facility name.
 */
const FAMOUS_SAUNA_WHITELIST: string[] = [
  // 北海道
  "ニコーリフレ", "SPA & SAUNA オスパー", "森林公園温泉きよら",
  // 青森
  "青森センターホテル",
  // 岩手
  "喜盛の湯",
  // 宮城
  "スパメッツァ仙台", "スパメッツァ 仙台", "竜泉寺の湯 仙台",
  // 秋田
  "ユーランドホテル八橋", "ユーランド ホテル八橋",
  // 山形
  "高源ゆ",
  // 福島
  "みなとや", "MINATOYA SAUNA",
  // 茨城
  "ゆるうむ",
  // 栃木
  "グランドスパ南大門",
  // 群馬
  "白井屋ホテル", "SHIROIYA",
  // 埼玉
  "おふろcafe utatane", "おふろcafé utatane",
  // 千葉
  "スパメッツァおおたか", "竜泉寺の湯 流山",
  // 東京
  "かるまる池袋", "渋谷SAUNAS", "サウナ東京", "サウナラボ神田",
  "北欧", "黄金湯", "ドシー五反田", "ドシー恵比寿",
  "ニューウイング", "松本湯", "ROOFTOP",
  // 神奈川
  "スカイスパYOKOHAMA", "スカイスパ YOKOHAMA", "朝日湯源泉 ゆいる",
  // 新潟
  "サウナ宝来洲", "ホライズン",
  // 長野
  "The Sauna",
  // 富山
  "The Hive SAUNA", "Hive SAUNA",
  // 石川
  "LINNAS Kanazawa",
  // 福井
  "ゆけむり温泉 ゆ～遊", "ゆけむり温泉 ゆ〜遊", "ゆけむり温泉ゆー遊", "ゆけむり温泉 ゆー遊",
  // 山梨
  "ふじやま温泉",
  // 岐阜
  "大垣サウナ",
  // 静岡
  "サウナしきじ",
  // 愛知
  "ウェルビー栄", "ウェルビー今池", "サウナラボ名古屋", "IE:SAUNA",
  // 三重
  "玉の湯",
  // 滋賀
  "草津湯元 水春",
  // 京都
  "ルーマプラザ", "白山湯",
  // 大阪
  "サウナDESSE", "大阪サウナDESSE",
  // 兵庫
  "神戸サウナ&スパ", "神戸サウナ＆スパ", "神戸クアハウス",
  // 奈良
  "奈良健康ランド",
  // 和歌山
  "ふくろうの湯",
  // 鳥取
  "ラピスパ",
  // 島根
  "四季荘",
  // 岡山
  "後楽温泉ほのかの湯", "後楽温泉 ほのかの湯",
  // 広島
  "ニュージャパン", "ニュージャパンEX",
  // 山口
  "くだまつ健康パーク",
  // 徳島
  "あらたえの湯",
  // 香川
  "琴弾廻廊",
  // 愛媛
  "喜助の湯",
  // 高知
  "SAUNAグリンピア", "グリンピア",
  // 福岡
  "ウェルビー福岡", "ウェルビー 福岡", "ROUTE 8", "らかん温泉",
  // 佐賀
  "らかんの湯", "御船山楽園ホテル",
  // 長崎
  "MINATO SAUNA",
  // 熊本
  "湯らっくす",
  // 大分
  "寒の地獄旅館",
  // 宮崎
  "サウナMIYAZAKI",
  // 鹿児島
  "ニューニシノ",
  // 沖縄
  "龍神の湯", "琉球温泉", "KIELO SAUNA",
  // その他有名施設
  "サウナ東京八戸", "延羽の湯", "水春松井山手",
];

/** Check if a facility name matches the famous sauna whitelist.
 * Uses normalized comparison (spaces removed) for robust matching. */
function isWhitelisted(name: string): boolean {
  const norm = (s: string) => s.replace(/[\s　]/g, "").toLowerCase();
  const n = norm(name);
  return FAMOUS_SAUNA_WHITELIST.some((w) => {
    const nw = norm(w);
    return n.includes(nw) || nw.includes(n);
  });
}

/** Advanced keywords that earn extra points (+4~5 each, cumulative) */
const PREMIUM_KEYWORDS = [
  "ハーバル", "ヴィヒタ", "アウフグース", "セルフロウリュ", "ケロ",
  "薪ストーブ", "フィンランド式", "サウナシュラン", "サ道", "しきじの水",
  "アロマ", "サ活", "オロポ", "ロウリュ", "ウィスキング", "外気浴",
  "熱波師", "アウフグーサー", "ウィスキングマイスター",
];

/** Data-driven score calculation v3 — 6 categories × max 17, total capped at 100 */
export function calculateHonmonoScoreLocal(input: {
  name: string;
  rating: number | null;
  reviewCount: number;
  hasWebsite: boolean;
  reviews: string[];
  websiteContent: string;
  aiSummary?: string;
  facilityFacts?: FacilityFacts | null;
  performerBonus?: PerformerBonusInput | null;
}): { score: ScoreDetail; matchedKw: string[]; debug: CategoryBreakdown } {
  const { name, rating, reviewCount, hasWebsite, reviews, websiteContent, aiSummary } = input;
  const facts = input.facilityFacts || null;
  const perf = input.performerBonus || null;
  const allText = reviews.join(" ") + " " + websiteContent + " " + (aiSummary || "") + " " + name;
  const hasSignal = reviewCount >= 1 || !!websiteContent || !!aiSummary;

  const countKw = (keywords: string[]) => {
    let n = 0;
    for (const kw of keywords) { if (allText.includes(kw)) n++; }
    return n;
  };

  // === Premium keyword bonus (spread across categories) ===
  const premiumCount = countKw(PREMIUM_KEYWORDS);
  const premiumBonus = Math.min(premiumCount * 2, 12); // max +12 total, spread to categories

  // === High-rating bonus (applies to all categories) ===
  let ratingBonus = 0;
  if (rating !== null) {
    if (rating >= 4.5) ratingBonus = 3;
    else if (rating >= 4.3) ratingBonus = 2;
  }

  // === Review trust bonus ===
  let trustBonus = 0;
  if (reviewCount >= 500) trustBonus = 5;
  else if (reviewCount >= 200) trustBonus = 3;

  // ===== 1. Heat Quality (max 17) =====
  const heatKw = ["熱波","アウフグース","ロウリュイベント","熱波師","セルフロウリュ","オートロウリュ","薪サウナ","バレルサウナ","ハーバルサウナ","薬草サウナ"];
  let heatBase = Math.min(countKw(heatKw) * 2, 8);
  if (/サウナ|SAUNA|Sauna/i.test(name)) heatBase += 3;
  heatBase += ratingBonus;
  let heatFacts = 0;
  if (facts) {
    if (facts.sauna_temp_c != null) {
      if (facts.sauna_temp_c >= 90) heatFacts += 3;
      else if (facts.sauna_temp_c >= 80) heatFacts += 2;
      else if (facts.sauna_temp_c >= 70) heatFacts += 1;
    }
    if (facts.loyly_type && facts.loyly_type !== "なし") {
      heatFacts += facts.loyly_type.includes("アウフグース") ? 3 : 1;
    }
  }
  let heatPerf = 0;
  if (perf) {
    if (perf.count >= 10) heatPerf = 7;
    else if (perf.count >= 5) heatPerf = 4;
    else if (perf.count >= 2) heatPerf = 2;
    if (perf.hasLeaderOrOwner) heatPerf += 1;
  }
  let heat = Math.min(heatBase + heatFacts + heatPerf, 17);
  const heatFloor = hasSignal ? (rating !== null && rating >= 3.5 ? 6 : 3) : 0;
  heat = Math.max(heat, heatFloor);

  // ===== 2. Cold Bath / Water Bath (max 17) =====
  let coldBase = rating && rating >= 3.0 ? Math.min(Math.round(rating * 2.5), 10) : 0;
  if (reviewCount >= 500) coldBase += 4;
  else if (reviewCount >= 200) coldBase += 3;
  else if (reviewCount >= 50) coldBase += 2;
  else if (reviewCount >= 10) coldBase += 1;
  coldBase += ratingBonus;
  let coldFacts = 0;
  if (facts && facts.water_bath_temp_c != null) {
    if (facts.water_bath_temp_c <= 14) coldFacts = 4;
    else if (facts.water_bath_temp_c <= 17) coldFacts = 3;
    else if (facts.water_bath_temp_c <= 20) coldFacts = 2;
    else coldFacts = 1;
  }
  let coldPerf = 0;
  if (perf) {
    if (perf.count >= 10) coldPerf = 2;
    else if (perf.count >= 5) coldPerf = 1;
  }
  let cold = Math.min(coldBase + coldFacts + coldPerf, 17);
  const coldFloor = rating !== null && rating >= 3.5 ? 6 : 0;
  cold = Math.max(cold, coldFloor);

  // ===== 3. Outdoor Air (max 17) =====
  let outBase = 0;
  if (reviewCount >= 501) outBase = 8;
  else if (reviewCount >= 301) outBase = 7;
  else if (reviewCount >= 101) outBase = 6;
  else if (reviewCount >= 51) outBase = 5;
  else if (reviewCount >= 21) outBase = 4;
  else if (reviewCount >= 6) outBase = 3;
  else if (reviewCount >= 1) outBase = 2;
  const outKw = ["外気浴","露天","ととのい椅子","デッキチェア","インフィニティチェア"];
  outBase += Math.min(countKw(outKw) * 2, 4);
  outBase += ratingBonus;
  let outFacts = 0;
  if (facts && facts.has_outside_air === true) outFacts = 5;
  let outPerf = 0;
  if (perf && perf.count >= 5) outPerf = 3;
  else if (perf && perf.count >= 2) outPerf = 1;
  let outdoor = Math.min(outBase + outFacts + outPerf, 17);
  const outFloor = hasSignal ? (rating !== null && rating >= 3.5 ? 4 : 2) : 0;
  outdoor = Math.max(outdoor, outFloor);

  // ===== 4. Cleanliness (max 17) =====
  let cleanBase = 0;
  if (hasWebsite) cleanBase += 3;
  if (reviewCount >= 10) cleanBase += 2;
  if (reviewCount >= 100 && rating !== null && rating >= 3.5) cleanBase += 2;
  if (rating !== null) {
    if (rating >= 4.5) cleanBase += 5;
    else if (rating >= 4.0) cleanBase += 3;
    else if (rating >= 3.5) cleanBase += 1;
  }
  cleanBase += ratingBonus;
  const cleanKw = ["清潔","きれい","綺麗","清掃","掃除"];
  cleanBase += Math.min(Math.floor(countKw(cleanKw) * 1.5), 3);
  let cleanPerf = 0;
  if (perf && perf.count >= 10) cleanPerf = 4;
  else if (perf && perf.count >= 5) cleanPerf = 3;
  else if (perf && perf.count >= 2) cleanPerf = 1;
  let clean = Math.min(cleanBase + cleanPerf, 17);
  const cleanFloor = hasSignal ? (rating !== null && rating >= 3.5 ? 5 : 3) : 0;
  clean = Math.max(clean, cleanFloor);

  // ===== 5. Aroma & Löyly (max 17) =====
  const aromaKw = ["アロマ","ハーブ","ハーバル","ヴィヒタ","白樺","ロウリュ","セルフロウリュ","薬草","ウィスキング","アロマロウリュ"];
  let aromaBase = Math.min(countKw(aromaKw) * 2, 8);
  aromaBase += ratingBonus;
  let aromaFacts = 0;
  if (facts && facts.loyly_type && facts.loyly_type !== "なし") {
    const lt = facts.loyly_type;
    if (lt.includes("アロマ")) aromaFacts = 5;
    else if (lt.includes("アウフグース")) aromaFacts = 4;
    else if (lt.includes("セルフ") || lt.includes("オート")) aromaFacts = 3;
    else aromaFacts = 2;
  }
  let aromaPerf = 0;
  if (perf) {
    if (perf.count >= 10) aromaPerf = 5;
    else if (perf.count >= 5) aromaPerf = 4;
    else if (perf.count >= 2) aromaPerf = 2;
    if (perf.hasLeaderOrOwner) aromaPerf += 1;
  }
  let aroma = Math.min(aromaBase + aromaFacts + aromaPerf, 17);
  const aromaFloor = hasSignal ? (rating !== null && rating >= 3.5 ? 6 : 3) : 0;
  aroma = Math.max(aroma, aromaFloor);

  // ===== 6. Sauna Focus (max 17) =====
  const focusKw = ["水風呂","岩盤浴","炭酸泉","休憩","ととのい"];
  let focusBase = Math.min(countKw(focusKw) * 2, 6);
  if (/サウナ|SAUNA|Sauna/i.test(name)) focusBase += 3;
  focusBase += ratingBonus;
  let focusFacts = 0;
  if (facts) {
    let factFields = 0;
    if (facts.sauna_temp_c != null) factFields++;
    if (facts.water_bath_temp_c != null) factFields++;
    if (facts.has_outside_air != null) factFields++;
    if (facts.loyly_type) factFields++;
    focusFacts = Math.min(factFields, 3);
  }
  let focusPerf = 0;
  if (perf) {
    if (perf.count >= 10) focusPerf += 5;
    else if (perf.count >= 5) focusPerf += 4;
    else if (perf.count >= 2) focusPerf += 2;
    if (perf.hasLeaderOrOwner) focusPerf += 2;
  }
  let focus = Math.min(focusBase + focusFacts + focusPerf, 17);
  const focusFloor = hasSignal ? (rating !== null && rating >= 3.5 ? 7 : 4) : 0;
  focus = Math.max(focus, focusFloor);

  // ===== Premium keyword spread (distribute evenly across 6 cats) =====
  if (premiumBonus > 0) {
    const perCat = Math.floor(premiumBonus / 6);
    const remainder = premiumBonus % 6;
    const cats = [heat, cold, outdoor, clean, aroma, focus];
    for (let i = 0; i < 6; i++) {
      cats[i] = Math.min(cats[i] + perCat + (i < remainder ? 1 : 0), 17);
    }
    [heat, cold, outdoor, clean, aroma, focus] = cats;
  }

  // ===== Trust bonus spread (distribute to weaker categories) =====
  if (trustBonus > 0) {
    const cats = [
      { val: heat, idx: 0 }, { val: cold, idx: 1 }, { val: outdoor, idx: 2 },
      { val: clean, idx: 3 }, { val: aroma, idx: 4 }, { val: focus, idx: 5 },
    ];
    cats.sort((a, b) => a.val - b.val);
    let remaining = trustBonus;
    for (const c of cats) {
      if (remaining <= 0) break;
      const add = Math.min(remaining, 17 - c.val);
      c.val += add;
      remaining -= add;
    }
    const arr = [0, 0, 0, 0, 0, 0];
    for (const c of cats) arr[c.idx] = c.val;
    [heat, cold, outdoor, clean, aroma, focus] = arr;
  }

  // ===== Whitelist guarantee: ensure min 75 for famous facilities =====
  const whitelisted = isWhitelisted(name);
  if (whitelisted) {
    let rawTotal = heat + cold + outdoor + clean + aroma + focus;
    if (rawTotal < 75) {
      const deficit = 75 - rawTotal;
      const cats = [
        { val: heat, idx: 0 }, { val: cold, idx: 1 }, { val: outdoor, idx: 2 },
        { val: clean, idx: 3 }, { val: aroma, idx: 4 }, { val: focus, idx: 5 },
      ];
      // Boost weaker categories first to create balanced breakdown
      cats.sort((a, b) => a.val - b.val);
      let remaining = deficit;
      for (const c of cats) {
        if (remaining <= 0) break;
        const room = 17 - c.val;
        const add = Math.min(Math.ceil(remaining / cats.filter(x => x.val < 17).length), room, remaining);
        c.val += add;
        remaining -= add;
      }
      // Second pass for any remainder
      if (remaining > 0) {
        for (const c of cats) {
          if (remaining <= 0) break;
          const add = Math.min(remaining, 17 - c.val);
          c.val += add;
          remaining -= add;
        }
      }
      const arr = [0, 0, 0, 0, 0, 0];
      for (const c of cats) arr[c.idx] = c.val;
      [heat, cold, outdoor, clean, aroma, focus] = arr;
    }
  }

  // ===== Overall (capped at 100) =====
  const overall = Math.min(heat + cold + outdoor + clean + aroma + focus, 100);

  const allKw = [...heatKw, ...outKw, ...cleanKw, ...aromaKw, ...focusKw, ...PREMIUM_KEYWORDS];
  const matchedKw = Array.from(new Set(allKw.filter(kw => allText.includes(kw))));

  const debug: CategoryBreakdown = {
    heat_quality: { base: heatBase, facts: heatFacts, performer: heatPerf, floor: heatFloor, final: heat },
    water_bath: { base: coldBase, facts: coldFacts, performer: coldPerf, floor: coldFloor, final: cold },
    outside_air: { base: outBase, facts: outFacts, performer: outPerf, floor: outFloor, final: outdoor },
    cleanliness: { base: cleanBase, facts: 0, performer: cleanPerf, floor: cleanFloor, final: clean },
    authenticity: { base: aromaBase, facts: aromaFacts, performer: aromaPerf, floor: aromaFloor, final: aroma },
    sauna_focus: { base: focusBase, facts: focusFacts, performer: focusPerf, floor: focusFloor, final: focus },
  };

  return {
    score: {
      water_bath: cold,
      heat_quality: heat,
      outside_air: outdoor,
      cleanliness: clean,
      authenticity: aroma,
      facility: focus,
      overall,
      explanation: "",
    },
    matchedKw,
    debug,
  };
}

/** Generate writer-style explanation via Claude API (async, called after score) */
export async function generateScoreExplanation(
  name: string,
  _reviewCount: number,
  _rating: number,
  _overall: number,
  matchedKeywords: string[],
  address?: string,
): Promise<string | null> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  try {
    const kwText = matchedKeywords.length > 0 ? matchedKeywords.join("・") : "特になし";
    const locationHint = address || "";
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY!,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 150,
        messages: [{
          role: "user",
          content: `あなたは年間300施設を巡るプロサウナーであり、サウナ専門誌の看板ライターです。
この施設を訪れた体験を、読者が「今すぐ行きたい」と感じる100字の文章にしてください。

施設名: ${name}
所在地: ${locationHint}
サウナ関連キーワード: ${kwText}

【絶対ルール】
- その土地の気候・風土・文化を活かした言葉を選ぶ
- その施設だけのオリジナルの特徴を際立たせる
- 五感のうち最低2つを刺激する描写を入れる
- 体言止め、倒置法、短文のリズムで畳みかける
- 口コミ数・評価点数・スコアには絶対に言及しない
- 「提供します」「体験できます」「施設です」禁止
- 「質の高い」「本格的な」「充実した」禁止
- 100字以内。テキストのみ返す。`,
        }],
      }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.content?.[0]?.text || null;
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

export interface FacilityFacts {
  sauna_temp_c: number | null;       // サウナ室温度（℃）
  water_bath_temp_c: number | null;  // 水風呂温度（℃）
  has_outside_air: boolean | null;   // 外気浴の有無
  loyly_type: string | null;         // ロウリュの種類（"なし" | "セルフロウリュ" | "オートロウリュ" | "アウフグース" | "アロマロウリュ" 等）
}

/**
 * Extract structured facility facts (sauna/water bath temp, outside air, loyly type)
 * from a facility's website content + Google reviews using Claude.
 */
export async function extractFacilityFacts(
  websiteContent: string,
  reviewTexts: string[]
): Promise<FacilityFacts | null> {
  if (!websiteContent && reviewTexts.length === 0) return null;
  const sourceText = (websiteContent.slice(0, 4000) +
    "\n---\n" +
    reviewTexts.slice(0, 5).map((r) => r.slice(0, 400)).join("\n")).slice(0, 6000);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);
  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY!,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 200,
        messages: [
          {
            role: "user",
            content: `以下の【公式サイト情報】と【口コミ】からサウナ施設の数値・設備データを抽出してJSONで返してください。

抽出ルール:
- sauna_temp_c: サウナ室温度の℃数値（例: 90）。記載がなければnull。
- water_bath_temp_c: 水風呂温度の℃数値（例: 16）。記載がなければnull。
- has_outside_air: 外気浴スペースがあればtrue、なければfalse、不明ならnull。
- loyly_type: ロウリュの種類を1単語で。なければnull。値の例: "セルフロウリュ" "オートロウリュ" "アウフグース" "アロマロウリュ" "なし"

【情報】
${sourceText}

JSONのみで返答（他の文字は禁止）:
{"sauna_temp_c": number|null, "water_bath_temp_c": number|null, "has_outside_air": boolean|null, "loyly_type": string|null}`,
          },
        ],
      }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    const text = data.content?.[0]?.text;
    if (!text) return null;
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) return null;
    const parsed = JSON.parse(match[0]);
    return {
      sauna_temp_c: typeof parsed.sauna_temp_c === "number" ? parsed.sauna_temp_c : null,
      water_bath_temp_c: typeof parsed.water_bath_temp_c === "number" ? parsed.water_bath_temp_c : null,
      has_outside_air: typeof parsed.has_outside_air === "boolean" ? parsed.has_outside_air : null,
      loyly_type: typeof parsed.loyly_type === "string" ? parsed.loyly_type : null,
    };
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * Translate (or summarise + translate) a Japanese sauna facility description
 * into a short English paragraph for inbound tourists.
 *
 * The input may be a short AI summary (~200 chars) OR a much longer
 * markdown article scraped from the facility website. Either way, we always
 * return a concise 200-300 char English paragraph.
 */
export async function translateSummaryToEnglish(
  jaSummary: string,
  facilityName: string,
  address: string
): Promise<string | null> {
  if (!jaSummary || jaSummary.trim().length === 0) return null;
  // Hard cap on input so very long markdown articles don't blow up tokens
  const truncated = jaSummary.replace(/\s+/g, " ").slice(0, 1800);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 25000);
  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY!,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 500,
        messages: [
          {
            role: "user",
            content: `You are writing a short English description of a Japanese sauna facility for inbound tourists.

Source material is in Japanese and may be a short AI summary OR a long marketing article — produce ONE concise English paragraph (180–280 characters, ~2-3 sentences) that captures what makes this facility special.

Rules:
- Keep proper nouns (facility name, neighbourhood) in romaji or English.
- Warm, inviting, evocative tone — not a brochure.
- Mention concrete differentiators (sauna types, water bath, outdoor cool-down, food, etc.) when present.
- Do NOT include disclaimers, apologies, headings or commentary.
- Return ONLY the English paragraph, nothing else.

Facility name: ${facilityName}
Address: ${address}

Japanese source:
${truncated}`,
          },
        ],
      }),
    });
    if (!res.ok) {
      console.error("[translateSummary] API error:", res.status);
      return null;
    }
    const data = await res.json();
    const text = data.content?.[0]?.text;
    if (typeof text !== "string") return null;
    // Strip surrounding quotes / leading "Translation:" prefixes the model
    // sometimes adds despite our instructions.
    return text
      .trim()
      .replace(/^["「『]/, "")
      .replace(/["」』]$/, "")
      .replace(/^(Translation|English|Output)\s*:\s*/i, "")
      .trim();
  } catch (e) {
    console.error("[translateSummary] error:", e);
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

/** Find the sauna room photo index from a list of photo URLs using Vision */
export async function findSaunaPhotoIndex(
  photoUrls: string[]
): Promise<number | null> {
  if (photoUrls.length === 0) return null;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30000);
  try {
    const content: unknown[] = [];
    photoUrls.forEach((url, i) => {
      content.push({ type: "image", source: { type: "url", url } });
      content.push({ type: "text", text: `[${i}]` });
    });
    content.push({
      type: "text",
      text: `上記の写真を見て、サウナ室・ストーブ・ロウリュ・蒸気の写真を探してください。
最もサウナ室らしい写真のインデックス番号を1つだけ返してください。
該当なしならnullを返してください。
広告・イラスト・文字だけの画像は選ばないでください。
JSONのみ: {"sauna": 3}  または {"sauna": null}`,
    });

    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY!,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 50,
        messages: [{ role: "user", content }],
      }),
    });

    if (!res.ok) {
      console.error("findSaunaPhoto API error:", res.status);
      return null;
    }

    const data = await res.json();
    const text = data.content?.[0]?.text;
    if (!text) return null;
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) return null;
    const parsed = JSON.parse(match[0]);

    if (typeof parsed.sauna === "number" && parsed.sauna >= 0 && parsed.sauna < photoUrls.length) {
      return parsed.sauna;
    }
    return null;
  } catch (e) {
    console.error("findSaunaPhoto error:", e);
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

