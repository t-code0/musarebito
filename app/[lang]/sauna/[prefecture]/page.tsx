"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import SaunaCard from "@/components/SaunaCard";
import { Sauna } from "@/types/sauna";

export default function PrefecturePage() {
  const params = useParams();
  const lang = params.lang as string;
  const prefecture = decodeURIComponent(params.prefecture as string);
  const [saunas, setSaunas] = useState<Sauna[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSaunas() {
      try {
        const res = await fetch(
          `/api/sauna/search?prefecture=${encodeURIComponent(prefecture)}`
        );
        const data = await res.json();
        setSaunas(data.saunas || []);
      } catch (error) {
        console.error("Failed to fetch saunas:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchSaunas();
  }, [prefecture]);

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#1B4332] text-white py-8 px-4">
        <div className="max-w-5xl mx-auto">
          <a
            href={`/${lang}`}
            className="text-emerald-300 hover:text-white text-sm mb-2 inline-block"
          >
            ← トップに戻る
          </a>
          <h1 className="text-3xl font-bold">{prefecture}のサウナ</h1>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block w-8 h-8 border-4 border-[#1B4332] border-t-transparent rounded-full animate-spin" />
            <p className="mt-4 text-gray-500">サウナを検索中...</p>
          </div>
        ) : saunas.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <p className="text-lg">サウナが見つかりませんでした</p>
            <p className="text-sm mt-2">
              別のキーワードで検索してみてください
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {saunas.map((sauna) => (
              <SaunaCard key={sauna.id} sauna={sauna} lang={lang} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
