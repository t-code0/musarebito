"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

interface Performer {
  id: string;
  name: string;
  description: string;
  instagram_url: string | null;
  photo_url: string | null;
}

export default function AufgusserPage() {
  const params = useParams();
  const lang = params.lang as string;
  const [performers, setPerformers] = useState<Performer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/sauna/performers?type=aufgusser")
      .then((r) => r.json())
      .then((d) => {
        const list: Performer[] = d.performers || [];
        const sorted = [...list].sort((a, b) => {
          const aIsPT = a.name.includes("プレジャー田中");
          const bIsPT = b.name.includes("プレジャー田中");
          if (aIsPT && !bIsPT) return -1;
          if (!aIsPT && bIsPT) return 1;
          return a.name.localeCompare(b.name, "ja");
        });
        setPerformers(sorted);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <main
      className="min-h-screen"
      style={{ background: "linear-gradient(180deg, #1a0a0a 0%, #2d1515 30%, #1a0a0a 100%)" }}
    >
      <div className="py-8 px-4 sm:px-6" style={{ background: "linear-gradient(180deg, #2d1515 0%, #1a0a0a 100%)" }}>
        <a href={`/${lang}`} className="text-red-300 hover:text-white text-sm mb-2 inline-block">
          ← トップに戻る
        </a>
        <h1 className="text-3xl font-bold text-white">🔥 グーサー(熱波師)一覧</h1>
        <p className="text-red-200/70 text-sm mt-2">日本を代表するグーサーたち</p>
      </div>

      <div className="px-4 sm:px-6 py-8">
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block w-8 h-8 border-4 border-red-400 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {performers.map((p) => (
              <div
                key={p.id}
                className="rounded-2xl p-5"
                style={{
                  background: "linear-gradient(160deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.04) 50%, rgba(255,255,255,0.08) 100%)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.4), inset 0 2px 0 rgba(255,255,255,0.1)",
                }}
              >
                <h3 className="text-lg font-bold text-white mb-2">{p.name}</h3>
                <p className="text-sm text-gray-300 leading-relaxed mb-3">{p.description}</p>
                <div className="flex items-center gap-3">
                  <a
                    href={`https://www.instagram.com/explore/tags/${encodeURIComponent(p.name.replace(/[\s　]+/g, ""))}/`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-red-300 hover:text-white transition-colors"
                  >
                    #{p.name.replace(/[\s　]+/g, "")} の投稿を見る
                  </a>
                  <a
                    href={`https://x.com/search?q=${encodeURIComponent(p.name)}&src=typed_query`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-gray-400 hover:text-white transition-colors font-bold"
                  >
                    𝕏 で検索
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
