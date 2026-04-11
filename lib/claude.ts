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

/** Data-driven score calculation — 6 categories, 100 points total */
export function calculateHonmonoScoreLocal(input: {
  name: string;
  rating: number | null;
  reviewCount: number;
  hasWebsite: boolean;
  reviews: string[];
  websiteContent: string;
  aiSummary?: string;
}): { score: ScoreDetail; matchedKw: string[] } {
  const { name, rating, reviewCount, hasWebsite, reviews, websiteContent, aiSummary } = input;
  const allText = reviews.join(" ") + " " + websiteContent + " " + (aiSummary || "") + " " + name;

  // 1. Visit (18pts)
  let visit = 0;
  if (reviewCount >= 501) visit = 18;
  else if (reviewCount >= 301) visit = 15;
  else if (reviewCount >= 101) visit = 12;
  else if (reviewCount >= 51) visit = 10;
  else if (reviewCount >= 21) visit = 8;
  else if (reviewCount >= 6) visit = 5;
  else if (reviewCount >= 1) visit = 3;

  // 2. Quality (18pts) — rating × 4.5
  let quality = 0;
  if (rating && rating >= 3.0) quality = Math.min(Math.round(rating * 4.5), 18);

  // 3. Sauna specialization (18pts)
  // Sauna-dedicated facility bonus
  let saunaSpec = 0;
  if (/サウナ|SAUNA|Sauna/i.test(name)) saunaSpec += 6;
  // Event richness
  const eventKw = ["熱波","アウフグース","ロウリュイベント","熱波師"];
  for (const kw of eventKw) { if (allText.includes(kw)) saunaSpec += 2; }
  // Goods/merch
  if (["サウナハット","タオル","グッズ","物販"].some(kw => allText.includes(kw))) saunaSpec += 3;
  // Equipment detail
  const equipKw = ["セルフロウリュ","オートロウリュ","薪サウナ","バレルサウナ","ハーバルサウナ","薬草サウナ","アロマ","アロマロウリュ","ウィスキング","ヴィヒタ"];
  for (const kw of equipKw) { if (allText.includes(kw)) saunaSpec += 2; }
  saunaSpec = Math.min(saunaSpec, 18);
  const saunaKw = [...eventKw, ...equipKw, "水風呂","外気浴","ととのい"];

  // 4. Trust (10pts)
  let trust = 0;
  if (hasWebsite) trust += 3;
  if (reviewCount >= 10) trust += 3;
  if (reviewCount >= 100 && rating && rating >= 3.5) trust += 4;
  trust = Math.min(trust, 10);

  // 5. Aroma/Herbal (18pts)
  const aromaKw = ["アロマ","ハーブ","ハーバル","ヴィヒタ","白樺","ロウリュ","セルフロウリュ","薬草","ウィスキング"];
  let aroma = 0;
  for (const kw of aromaKw) { if (allText.includes(kw)) aroma += 3; }
  aroma = Math.min(aroma, 18);

  // 6. Facilities (18pts)
  const facKw = ["水風呂","外気浴","岩盤浴","炭酸泉","露天","休憩"];
  let facility = 0;
  for (const kw of facKw) { if (allText.includes(kw)) facility += 3; }
  facility = Math.min(facility, 18);

  // Popularity boost: well-known facilities (high reviews + high rating) get baseline minimums
  // This compensates for thin Google review samples (max 5 per call) that miss keywords.
  const isPopular = reviewCount >= 500 && rating !== null && rating >= 4.0;
  const isWellKnown = reviewCount >= 200 && rating !== null && rating >= 4.0;
  if (isPopular) {
    saunaSpec = Math.max(saunaSpec, 12);
    aroma = Math.max(aroma, 9);
    facility = Math.max(facility, 12);
  } else if (isWellKnown) {
    saunaSpec = Math.max(saunaSpec, 10);
    aroma = Math.max(aroma, 6);
    facility = Math.max(facility, 9);
  }

  const overall = visit + quality + saunaSpec + trust + aroma + facility;
  const allMatched = [...saunaKw, ...aromaKw, ...facKw].filter(kw => allText.includes(kw));
  const matchedKw = Array.from(new Set(allMatched));

  return {
    score: {
      water_bath: quality,
      heat_quality: saunaSpec,
      outside_air: visit,
      cleanliness: trust,
      authenticity: aroma,
      facility,
      overall,
      explanation: "",
    },
    matchedKw,
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

