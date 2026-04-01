import { ScoreDetail } from "@/types/sauna";

export interface FoodInfo {
  restaurant: string;
  local_food: string[];
  nearby_spots: string[];
}

async function fetchSinglePage(url: string): Promise<string> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
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
  const subPages = ["/sauna/", "/spa/", "/restaurant/"];
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

export async function generateSummary(
  reviews: string[],
  name: string,
  websiteUrl?: string
): Promise<string> {
  const websiteContent = websiteUrl ? await fetchWebsiteContent(websiteUrl) : "";
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY!,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 400,
      messages: [
        {
          role: "user",
          content: `あなたはサウナ専門ライターです。以下の【公式サイト情報】と【口コミ】から、この施設だけの唯一無二の特徴を200字で書いてください。
必ず含めること：
・温泉の具体的な成分・泉質・深度・効能（数値で）
・炭酸泉・水風呂などの具体的なスペック
・他施設にない独自設備・こだわり
禁止：「ととのい」「癒し」などの抽象語、一般的な説明
【公式サイト情報】${websiteContent || "なし"}
【口コミ】${reviews.join("\n---\n")}`,
        },
      ],
    }),
  });
  const data = await res.json();
  return data.content?.[0]?.text || "要約を生成できませんでした。";
}

export async function generateFoodInfo(
  reviews: string[],
  name: string,
  address: string,
  websiteUrl?: string
): Promise<FoodInfo | null> {
  try {
    const websiteContent = websiteUrl ? await fetchWebsiteContent(websiteUrl) : "";
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY!,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 400,
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
  }
}

export async function calculateHonmonoScore(
  reviews: string[],
  name: string
): Promise<ScoreDetail> {
  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY!,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 400,
        messages: [
          {
            role: "user",
            content: `あなたはサウナ施設の評価専門家です。以下の「${name}」の口コミから、5項目を各0〜20点で採点してください。

口コミ：
${reviews.join("\n---\n")}

採点基準：
- water_bath: 水風呂（温度・水質・深さ・広さ）（0-20）
- heat_quality: 熱の質（サウナ室の温度・湿度・ロウリュ・オートロウリュの有無と質）（0-20）
- outside_air: 外気浴（ととのいスペースの充実度・椅子の数と種類・眺望・風通し）（0-20）
- cleanliness: 清潔さ（館内・浴室・脱衣所の清潔感、メンテナンス状態）（0-20）
- authenticity: 本物度（施設独自のこだわり・他にない特徴・サウナ文化への敬意）（0-20）
- overall: 上記5項目の合計（0-100）
- explanation: スコアの根拠を50字以内で

以下のJSON形式のみで返してください。JSON以外の文字は一切含めないでください：
{"water_bath":0,"heat_quality":0,"outside_air":0,"cleanliness":0,"authenticity":0,"overall":0,"explanation":""}`,
          },
        ],
      }),
    });
    const data = await res.json();
    const text = data.content?.[0]?.text;
    if (!text) throw new Error("No response");
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON found");
    const parsed = JSON.parse(jsonMatch[0]);
    const wb = Math.min(Math.max(parsed.water_bath || 0, 0), 20);
    const hq = Math.min(Math.max(parsed.heat_quality || 0, 0), 20);
    const oa = Math.min(Math.max(parsed.outside_air || 0, 0), 20);
    const cl = Math.min(Math.max(parsed.cleanliness || 0, 0), 20);
    const au = Math.min(Math.max(parsed.authenticity || 0, 0), 20);
    return {
      water_bath: wb,
      heat_quality: hq,
      outside_air: oa,
      cleanliness: cl,
      authenticity: au,
      overall: wb + hq + oa + cl + au,
      explanation: parsed.explanation || "",
    };
  } catch {
    return {
      water_bath: 10, heat_quality: 10, outside_air: 10,
      cleanliness: 10, authenticity: 10, overall: 50,
      explanation: "スコア生成中にエラーが発生しました",
    };
  }
}
