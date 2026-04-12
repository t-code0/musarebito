"use client";

import { useParams } from "next/navigation";
import { ScoreDetail } from "@/types/sauna";
import { normalizeLang, type Lang } from "@/lib/i18n";

interface Props {
  score: number | null;
  detail: ScoreDetail | null;
}

const displayItemsByLang: Record<Lang, { label: string; max: number }[]> = {
  ja: [
    { label: "熱の質", max: 17 },
    { label: "水風呂", max: 17 },
    { label: "外気浴", max: 17 },
    { label: "清潔感", max: 17 },
    { label: "アロマ", max: 17 },
    { label: "サウナ特化度", max: 17 },
  ],
  en: [
    { label: "Heat Quality", max: 17 },
    { label: "Cold Bath", max: 17 },
    { label: "Outdoor Air", max: 17 },
    { label: "Cleanliness", max: 17 },
    { label: "Aroma & Löyly", max: 17 },
    { label: "Sauna Focus", max: 17 },
  ],
};

function getRank(score: number, lang: Lang): { rank: string; label: string } {
  if (lang === "en") {
    if (score >= 75) return { rank: "S", label: "The real deal" };
    if (score >= 60) return { rank: "A", label: "Trusted" };
    if (score >= 45) return { rank: "B", label: "Average" };
    return { rank: "C", label: "Room to grow" };
  }
  if (score >= 75) return { rank: "S", label: "本物" };
  if (score >= 60) return { rank: "A", label: "信頼できる" };
  if (score >= 45) return { rank: "B", label: "普通" };
  return { rank: "C", label: "発展に期待" };
}

/** Convert 6-category score to display 6×/17 format */
function toDisplay6(detail: ScoreDetail, overall: number): number[] {
  // Internal keys: outside_air=visit(18), water_bath=quality(18), heat_quality=sauna(18),
  //   cleanliness=trust(10), authenticity=aroma(18), facility(18) = total 100
  const raw = [
    ((detail.heat_quality as number) || 0) / 18, // sauna → 熱の質
    ((detail.water_bath as number) || 0) / 18,    // quality → 水風呂
    ((detail.outside_air as number) || 0) / 18,   // visit → 外気浴
    ((detail.cleanliness as number) || 0) / 10,   // trust → 清潔感
    ((detail.authenticity as number) || 0) / 18,  // aroma → アロマ
    ((detail.facility as number) || 0) / 18,      // facility → サウナ特化度
  ];

  const values = raw.map(r => Math.round(r * 17));

  // Adjust sum to match overall
  const sum = values.reduce((a, b) => a + b, 0);
  const diff = overall - sum;
  if (diff > 0 && values[0] < 17) values[0] = Math.min(values[0] + diff, 17);
  else if (diff < 0 && values[3] > 0) values[3] = Math.max(values[3] + diff, 0);

  return values;
}

export default function HonmonoScore({ score, detail }: Props) {
  const params = useParams();
  const lang: Lang = normalizeLang((params?.lang as string) || "ja");
  const isEn = lang === "en";

  if (score == null || !detail) {
    return (
      <div className="bg-gray-100 rounded-2xl p-6 text-center text-gray-500">
        <p className="font-medium">{isEn ? "Calculating score..." : "スコア算出中"}</p>
        <p className="text-sm mt-2">
          {isEn
            ? "The score will appear once enough reviews are collected."
            : "口コミが集まり次第、スコアが算出されます。"}
        </p>
      </div>
    );
  }

  const displayItems = displayItemsByLang[lang];
  const values = toDisplay6(detail, score);
  const { rank, label } = getRank(score, lang);

  return (
    <div
      className="rounded-2xl p-6"
      style={{
        background: "linear-gradient(135deg, #1a3a2a 0%, #2d5a3d 30%, #1a3a2a 50%, #2d5a3d 70%, #1a3a2a 100%)",
        boxShadow: "0 4px 20px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)",
      }}
    >
      <div className="text-center mb-5">
        <p className="text-sm text-white/70 mb-1">{isEn ? "HONMONO Score" : "本物スコア"}</p>
        <p className="text-5xl font-bold text-white" style={{ textShadow: "0 2px 4px rgba(0,0,0,0.3)" }}>
          {score}
        </p>
        <p className="text-sm text-white/50 mt-1">/ 100</p>
        <div className="mt-3 inline-flex items-center gap-2 px-4 py-1.5 rounded-full" style={{ background: "rgba(217,119,6,0.2)", border: "1px solid rgba(217,119,6,0.5)" }}>
          <span className="text-2xl font-bold text-amber-400">{rank}</span>
          <span className="text-sm text-white/90">{label}</span>
        </div>
      </div>

      <div className="space-y-2.5">
        {displayItems.map(({ label, max }, i) => {
          const value = Math.min(values[i] || 0, max);
          return (
            <div key={label}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-white/80">{label}</span>
                <span className="text-white font-medium">{value} / {max}</span>
              </div>
              <div className="w-full bg-white/15 rounded-full h-2.5 overflow-hidden">
                <div
                  className="h-2.5 rounded-full transition-all"
                  style={{
                    width: `${(value / max) * 100}%`,
                    background: "linear-gradient(90deg, #dc2626, #ef4444, #ff6b6b)",
                    boxShadow: "0 0 8px rgba(239,68,68,0.6), inset 0 1px 0 rgba(255,255,255,0.3)",
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {detail.explanation && (
        <p className="mt-4 text-sm text-white/70 bg-white/10 rounded-lg p-3">
          {detail.explanation}
        </p>
      )}
    </div>
  );
}
