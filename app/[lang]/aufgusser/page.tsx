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
  const lang = (params.lang as string) || "ja";
  const isEn = lang === "en";
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
        <div className="max-w-7xl mx-auto">
          <a href={`/${lang}`} className="text-red-300 hover:text-white text-sm mb-2 inline-block">
            {isEn ? "← Back to Home" : "← トップに戻る"}
          </a>
          <h1 className="text-3xl font-bold text-white">
            🔥 {isEn ? "Aufgussers" : "グーサー"}
          </h1>
          <p className="text-red-200/70 text-sm mt-2">
            {isEn ? "Japan's leading Aufgussers" : "日本を代表する熱波師たち"}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* What is Aufguss — intro section */}
        <section
          className="rounded-2xl p-6 mb-8"
          style={{
            background: "linear-gradient(135deg, #2d1515 0%, #4a2020 25%, #2d1515 50%, #4a2020 75%, #2d1515 100%)",
            boxShadow: "0 4px 20px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.15)",
            border: "1px solid rgba(239,68,68,0.3)",
          }}
        >
          <h2 className="text-2xl font-bold text-red-400 mb-3">
            {isEn ? "What is Aufguss?" : "アウフグースとは？"}
          </h2>
          <p className="text-gray-200 text-sm leading-relaxed">
            {isEn
              ? 'Aufguss is a sauna ritual originating in Germany. An Aufgusser (heat-wave master, "Neppa-shi" in Japanese) pours aromatic water onto sauna stones and fans the resulting steam and fragrance toward the audience using towels — a theatrical performance combining heat, scent, and showmanship. Established in Germany in the 1950s–60s, it reached Japan in the late 1990s starting at New Japan in Osaka. Today, the annual Aufguss World Championship draws international competitors, and in 2023 the Japanese team (Wellbe Sakae) won the team division world title. Japan\'s uniquely evolved "Neppa-shi" culture has become a competitive sport merging entertainment and technique — known as "Show Aufguss."'
              : "アウフグースとは、ドイツ発祥のサウナリチュアル。熱波師（アウフグーサー）がサウナストーンにアロマ水をかけ、タオルを振って熱波と香りを観客に送るパフォーマンス。1950〜60年代にドイツで確立し、日本には1990年代後半に大阪ニュージャパンを起点に広まった。現在では世界大会「Aufguss World Championship」も開催され、2023年には日本チーム（ウェルビー栄）が団体部門で世界一に。日本独自の進化を遂げた「熱波師」文化は、エンタメ性と技術を融合したショーアウフグースとして競技化されている。"}
          </p>
          <p className="text-white/40 text-xs mt-3">
            {isEn
              ? `${performers.length} aufgussers registered`
              : `${performers.length}名のグーサーを掲載中`}
          </p>
        </section>

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
                    #{p.name.replace(/[\s　]+/g, "")} {isEn ? "posts" : "の投稿を見る"}
                  </a>
                  <a
                    href={`https://x.com/search?q=${encodeURIComponent(p.name)}&src=typed_query`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-gray-400 hover:text-white transition-colors font-bold"
                  >
                    𝕏 {isEn ? "search" : "で検索"}
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
