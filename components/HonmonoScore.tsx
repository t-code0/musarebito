"use client";

import { ScoreDetail } from "@/types/sauna";

interface Props {
  score: number | null;
  detail: ScoreDetail | null;
}

const categories = [
  { key: "water_bath" as const, label: "水風呂" },
  { key: "heat_quality" as const, label: "熱の質" },
  { key: "outside_air" as const, label: "外気浴" },
  { key: "cleanliness" as const, label: "清潔感" },
  { key: "authenticity" as const, label: "本物感" },
];

export default function HonmonoScore({ score, detail }: Props) {
  if (!score || !detail) {
    return (
      <div className="bg-gray-100 rounded-xl p-6 text-center text-gray-500">
        スコア未算出
      </div>
    );
  }

  return (
    <div className="bg-[#1B4332] rounded-xl p-6">
      <div className="text-center mb-5">
        <p className="text-sm text-white/70 mb-1">本物スコア</p>
        <p className="text-5xl font-bold text-white">{score}</p>
        <p className="text-sm text-white/50 mt-1">/ 100</p>
      </div>

      <div className="space-y-3">
        {categories.map(({ key, label }) => {
          const value = Math.min((detail[key] as number) ?? 0, 20);
          return (
            <div key={key}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-white/80">{label}</span>
                <span className="text-white font-medium">{value} / 20</span>
              </div>
              <div className="w-full bg-white/15 rounded-full h-3 overflow-hidden">
                <div
                  className="h-3 rounded-full transition-all"
                  style={{
                    width: `${(value / 20) * 100}%`,
                    background: "linear-gradient(90deg, #dc2626, #ef4444, #ff6b6b)",
                    boxShadow: "0 0 8px rgba(239,68,68,0.6)",
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
