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

  const scoreColor =
    score >= 80
      ? "text-emerald-600"
      : score >= 60
        ? "text-amber-600"
        : "text-red-600";

  return (
    <div className="bg-white border-2 border-[#1B4332] rounded-xl p-6">
      <div className="text-center mb-4">
        <p className="text-sm text-gray-500 mb-1">本物スコア</p>
        <p className={`text-5xl font-bold ${scoreColor}`}>{score}</p>
        <p className="text-sm text-gray-400 mt-1">/ 100</p>
      </div>

      <div className="space-y-3">
        {categories.map(({ key, label }) => (
          <div key={key}>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-700">{label}</span>
              <span className="font-medium">{detail[key]} / 20</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-[#1B4332] h-2 rounded-full transition-all"
                style={{ width: `${(detail[key] / 20) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {detail.explanation && (
        <p className="mt-4 text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
          {detail.explanation}
        </p>
      )}
    </div>
  );
}
