import Anthropic from "@anthropic-ai/sdk";
import { GoogleReview, ScoreDetail } from "@/types/sauna";

function getAnthropic() {
  return new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY!,
  });
}

export async function generateSummary(
  name: string,
  reviews: GoogleReview[] | null,
  address: string
): Promise<string> {
  if (!reviews || reviews.length === 0) {
    return "まだレビューが少ないため、AI要約を生成できません。";
  }

  const reviewTexts = reviews
    .map((r) => `★${r.rating} ${r.text}`)
    .join("\n");

  const message = await getAnthropic().messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 500,
    messages: [
      {
        role: "user",
        content: `あなたはサウナの専門家です。以下のサウナ施設のGoogle口コミをもとに、日本語で簡潔なAI要約（200文字以内）を生成してください。サウナの特徴、水風呂、外気浴、雰囲気について触れてください。

施設名: ${name}
住所: ${address}

口コミ:
${reviewTexts}

要約:`,
      },
    ],
  });

  const textBlock = message.content.find((b) => b.type === "text");
  return textBlock?.text || "要約を生成できませんでした。";
}

export async function calculateHonmonoScore(
  name: string,
  reviews: GoogleReview[] | null,
  rating: number | null
): Promise<{ score: number; detail: ScoreDetail }> {
  if (!reviews || reviews.length === 0) {
    return {
      score: 0,
      detail: {
        water_bath: 0,
        heat_quality: 0,
        outside_air: 0,
        cleanliness: 0,
        authenticity: 0,
        explanation: "レビューが不足しているため、スコアを算出できません。",
      },
    };
  }

  const reviewTexts = reviews
    .map((r) => `★${r.rating} ${r.text}`)
    .join("\n");

  const message = await getAnthropic().messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 500,
    messages: [
      {
        role: "user",
        content: `あなたはサウナの専門家です。以下の口コミを分析し、「本物スコア」をJSON形式で返してください。

施設名: ${name}
Google評価: ${rating || "不明"}

口コミ:
${reviewTexts}

以下の5項目を各20点満点（合計100点）で評価し、必ず以下のJSON形式のみで回答してください：
{
  "water_bath": <水風呂の質 0-20>,
  "heat_quality": <熱の質 0-20>,
  "outside_air": <外気浴 0-20>,
  "cleanliness": <清潔感 0-20>,
  "authenticity": <本物感・こだわり 0-20>,
  "explanation": "<50文字以内の総評>"
}`,
      },
    ],
  });

  const textBlock = message.content.find((b) => b.type === "text");
  const text = textBlock?.text || "";

  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON found");
    const detail: ScoreDetail = JSON.parse(jsonMatch[0]);
    const score =
      detail.water_bath +
      detail.heat_quality +
      detail.outside_air +
      detail.cleanliness +
      detail.authenticity;
    return { score, detail };
  } catch {
    return {
      score: 50,
      detail: {
        water_bath: 10,
        heat_quality: 10,
        outside_air: 10,
        cleanliness: 10,
        authenticity: 10,
        explanation: "スコアの解析に失敗しました。",
      },
    };
  }
}
