"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";

const prefectures = [
  "北海道",
  "青森県", "岩手県", "宮城県", "秋田県", "山形県", "福島県",
  "茨城県", "栃木県", "群馬県", "埼玉県", "千葉県", "東京都", "神奈川県",
  "新潟県", "富山県", "石川県", "福井県", "山梨県", "長野県", "岐阜県", "静岡県", "愛知県",
  "三重県", "滋賀県", "京都府", "大阪府", "兵庫県", "奈良県", "和歌山県",
  "鳥取県", "島根県", "岡山県", "広島県", "山口県",
  "徳島県", "香川県", "愛媛県", "高知県",
  "福岡県", "佐賀県", "長崎県", "熊本県", "大分県", "宮崎県", "鹿児島県", "沖縄県",
];

export default function HomePage() {
  const [query, setQuery] = useState("");
  const router = useRouter();
  const params = useParams();
  const lang = (params.lang as string) || "ja";

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/${lang}/sauna/${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#1B4332] to-[#2D6A4F]">
      {/* Hero */}
      <div className="flex flex-col items-center justify-center px-4 pt-20 pb-12">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-2">
          蒸され人
        </h1>
        <p className="text-lg md:text-xl text-emerald-200 mb-8">
          むされびと — 本物のサウナを探す
        </p>

        <form
          onSubmit={handleSearch}
          className="w-full max-w-xl flex gap-2"
        >
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="サウナ名・エリアで検索..."
            className="flex-1 px-5 py-3 rounded-lg text-lg outline-none focus:ring-2 focus:ring-[#D97706]"
          />
          <button
            type="submit"
            className="bg-[#D97706] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#B45309] transition-colors"
          >
            検索
          </button>
        </form>
      </div>

      {/* Prefectures */}
      <div className="max-w-5xl mx-auto px-4 pb-20">
        <h2 className="text-xl font-bold text-white mb-6 text-center">
          都道府県から探す
        </h2>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
          {prefectures.map((pref) => (
            <button
              key={pref}
              onClick={() => router.push(`/${lang}/sauna/${encodeURIComponent(pref)}`)}
              className="bg-white/10 hover:bg-white/20 text-white text-sm py-2 px-3 rounded-lg transition-colors text-center"
            >
              {pref}
            </button>
          ))}
        </div>
      </div>
    </main>
  );
}
