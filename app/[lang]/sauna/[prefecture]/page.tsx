"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams } from "next/navigation";
import SaunaCard from "@/components/SaunaCard";
import AdSlot from "@/components/AdSlot";
import { Sauna } from "@/types/sauna";
import { t, normalizeLang, type Lang } from "@/lib/i18n";

type SortKey = "score" | "rating" | "newest";

function sortSaunas(saunas: Sauna[], key: SortKey): Sauna[] {
  return [...saunas].sort((a, b) => {
    // Closed facilities always at bottom
    if (a.is_closed !== b.is_closed) return a.is_closed ? 1 : -1;
    if (key === "score") {
      const sa = a.honmono_score ?? -1;
      const sb = b.honmono_score ?? -1;
      if (sa !== sb) return sb - sa;
      return (b.rating ?? 0) - (a.rating ?? 0);
    }
    if (key === "rating") {
      return (b.rating ?? 0) - (a.rating ?? 0);
    }
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });
}

export default function PrefecturePage() {
  const params = useParams();
  const lang: Lang = normalizeLang(params.lang as string);
  const prefecture = decodeURIComponent(params.prefecture as string);
  const [saunas, setSaunas] = useState<Sauna[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortKey, setSortKey] = useState<SortKey>("score");
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [showAll, setShowAll] = useState(false);

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

  // Hokkaido area groups for geographic sorting
  const HOKKAIDO_AREAS: { area: string; cities: string[] }[] = [
    { area: "道央", cities: ["札幌市","千歳市","恵庭市","北広島市","江別市","小樽市","石狩市","岩見沢市"] },
    { area: "道北", cities: ["旭川市","東川町","美瑛町","富良野市","当麻町","増毛町","上川郡東川町","上川郡当麻町","空知郡上富良野町"] },
    { area: "道東", cities: ["帯広市","釧路市","北見市","網走市","斜里町","弟子屈町","阿寒郡鶴居村","河東郡鹿追町"] },
    { area: "道南", cities: ["函館市","登別市","洞爺湖町","室蘭市","北斗市","七飯町","鹿部町","森町","木古内町","知内町"] },
  ];

  // Build city list: geographic groups for Hokkaido, count-sorted for others
  const cities = useMemo(() => {
    const counts: Record<string, number> = {};
    saunas.forEach((s) => {
      const c = s.city || "";
      if (c) counts[c] = (counts[c] || 0) + 1;
    });

    if (prefecture === "北海道") {
      // Sort by area group, then by count within group
      const ordered: { city: string; count: number; area: string }[] = [];
      const placed = new Set<string>();
      for (const g of HOKKAIDO_AREAS) {
        for (const c of g.cities) {
          if (counts[c]) {
            ordered.push({ city: c, count: counts[c], area: g.area });
            placed.add(c);
          }
        }
      }
      // Remaining cities not in any group
      for (const [c, n] of Object.entries(counts)) {
        if (!placed.has(c)) ordered.push({ city: c, count: n, area: "その他" });
      }
      return ordered;
    }

    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .map(([city, count]) => ({ city, count, area: "" }));
  }, [saunas, prefecture]);

  // Filter + sort
  const filtered = useMemo(() => {
    const base = selectedCity
      ? saunas.filter((s) => s.city === selectedCity)
      : saunas;
    return sortSaunas(base, sortKey);
  }, [saunas, selectedCity, sortKey]);

  return (
    <main className="min-h-screen" style={{ background: "linear-gradient(180deg, #1a0a0a 0%, #2d1515 30%, #1a0a0a 100%)" }}>
      {/* Header */}
      <div className="py-8 px-4 sm:px-6" style={{ background: "linear-gradient(180deg, #2d1515 0%, #1a0a0a 100%)" }}>
        <a
          href={`/${lang}`}
          className="text-red-300 hover:text-white text-base mb-2 inline-block"
        >
          {lang === "en" ? "← Back to home" : "← トップに戻る"}
        </a>
        <h1 className="text-3xl font-bold text-white">
          {lang === "en" ? `Saunas in ${prefecture}` : `${prefecture}のサウナ`}
        </h1>
      </div>

      {/* Score explanation */}
      <div className="max-w-[95vw] mx-auto px-4 pt-6 mb-4">
        <div
          className="rounded-2xl p-4"
          style={{
            background: "linear-gradient(135deg, #1a2e1a 0%, #2d4a2d 25%, #1a2e1a 50%, #2d4a2d 75%, #1a2e1a 100%)",
            boxShadow: "0 4px 20px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.15), inset 0 -1px 0 rgba(0,0,0,0.3)",
            border: "1px solid rgba(34,197,94,0.3)",
          }}
        >
          <h2 className="text-2xl font-bold text-green-400 mb-4 flex items-center gap-2">
            {t("home_score_title", lang)}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-4">
            {[
              { name: `${t("home_score_axis_heat", lang)}（17）`, desc: t("home_score_desc_heat", lang) },
              { name: `${t("home_score_axis_water", lang)}（17）`, desc: t("home_score_desc_water", lang) },
              { name: `${t("home_score_axis_outside", lang)}（17）`, desc: t("home_score_desc_outside", lang) },
              { name: `${t("home_score_axis_clean", lang)}（17）`, desc: t("home_score_desc_clean", lang) },
              { name: `${t("home_score_axis_aroma", lang)}（17）`, desc: t("home_score_desc_aroma", lang) },
              { name: `${t("home_score_axis_focus", lang)}（17）`, desc: t("home_score_desc_focus", lang) },
            ].map(({ name, desc }) => (
              <div
                key={name}
                className="p-4 min-h-[100px] transition-shadow hover:shadow-lg"
                style={{
                  background: "linear-gradient(160deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 50%, rgba(255,255,255,0.1) 100%)",
                  border: "1px solid rgba(255,255,255,0.25)",
                  borderRadius: 20,
                  boxShadow: "0 6px 16px rgba(0,0,0,0.5), inset 0 3px 0 rgba(255,255,255,0.15), inset 0 -2px 0 rgba(0,0,0,0.3)",
                }}
              >
                <p className="text-sm font-bold text-white mb-1"><span className="text-green-400">✅</span> {name}</p>
                <p className="text-xs text-gray-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row sm:flex-wrap gap-1 sm:gap-3 sm:justify-start">
            <p className="text-xs"><span className="text-sm font-bold text-amber-400">S</span><span className="text-gray-300">{t("home_rank_s", lang)}</span></p>
            <p className="text-xs"><span className="text-sm font-bold text-amber-400">A</span><span className="text-gray-300">{t("home_rank_a", lang)}</span></p>
            <p className="text-xs"><span className="text-sm font-bold text-amber-400">B</span><span className="text-gray-300">{t("home_rank_b", lang)}</span></p>
            <p className="text-xs"><span className="text-sm font-bold text-amber-400">C</span><span className="text-gray-300">{t("home_rank_c", lang)}</span></p>
          </div>
        </div>
      </div>

      <div className="max-w-[95vw] mx-auto px-4 sm:px-6 py-8">
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block w-8 h-8 border-4 border-red-400 border-t-transparent rounded-full animate-spin" />
            <p className="mt-4 text-red-200/70">{t("list_loading", lang)}</p>
          </div>
        ) : saunas.length === 0 ? (
          <div className="text-center py-20 text-red-200/70">
            <p className="text-lg">{t("list_empty", lang)}</p>
            <p className="text-sm mt-2">{t("list_empty_hint", lang)}</p>
          </div>
        ) : (
          <>
            {/* City filter (horizontal scroll) */}
            {cities.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2 mb-3 scrollbar-hide">
                <button
                  onClick={() => setSelectedCity("")}
                  className={`shrink-0 px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                    selectedCity === ""
                      ? "bg-red-600 text-white"
                      : "bg-red-900/50 text-red-200 border border-red-800/50"
                  }`}
                >
                  {lang === "en" ? "All" : "すべて"}({saunas.length})
                </button>
                {(() => {
                  let lastArea = "";
                  return cities.map(({ city, count, area }) => {
                    const showArea = area && area !== lastArea;
                    lastArea = area;
                    return (
                      <span key={city} className="contents">
                        {showArea && (
                          <span className="shrink-0 text-[10px] text-red-400/60 self-center px-1 font-bold">
                            {area}
                          </span>
                        )}
                        <button
                          onClick={() => setSelectedCity(city)}
                          className={`shrink-0 px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                            selectedCity === city
                              ? "bg-red-600 text-white"
                              : "bg-red-900/50 text-red-200 border border-red-800/50"
                          }`}
                        >
                          {city}({count})
                        </button>
                      </span>
                    );
                  });
                })()}
              </div>
            )}

            {/* Sort control */}
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs sm:text-sm text-red-200/70">
                {lang === "en" ? `${filtered.length} results` : `${filtered.length}件`}
              </span>
              <select
                value={sortKey}
                onChange={(e) => setSortKey(e.target.value as SortKey)}
                className="text-xs sm:text-sm border border-red-800/50 rounded-lg px-2 py-1.5 bg-red-900/50 text-red-200 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="score">{t("sort_score", lang)}</option>
                <option value="rating">{t("sort_rating", lang)}</option>
                <option value="newest">{t("sort_newest", lang)}</option>
              </select>
            </div>

            {(() => {
              const visible = showAll ? filtered : filtered.slice(0, 12);
              const slice1 = visible.slice(0, 3);
              const slice2 = visible.slice(3, 6);
              const slice3 = visible.slice(6);
              const gridClass =
                "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-3 sm:gap-4";
              return (
                <>
                  {slice1.length > 0 && (
                    <div className={gridClass}>
                      {slice1.map((s) => (
                        <SaunaCard key={s.id} sauna={s} lang={lang} />
                      ))}
                    </div>
                  )}
                  {slice2.length > 0 && (
                    <>
                      <AdSlot slotName="list-after-3" className="my-4" />
                      <div className={gridClass}>
                        {slice2.map((s) => (
                          <SaunaCard key={s.id} sauna={s} lang={lang} />
                        ))}
                      </div>
                    </>
                  )}
                  {slice3.length > 0 && (
                    <>
                      <AdSlot slotName="list-after-6" className="my-4" />
                      <div className={gridClass}>
                        {slice3.map((s) => (
                          <SaunaCard key={s.id} sauna={s} lang={lang} />
                        ))}
                      </div>
                    </>
                  )}
                </>
              );
            })()}
            {!showAll && filtered.length > 12 && (
              <div className="text-center mt-6">
                <button
                  onClick={() => setShowAll(true)}
                  className="px-6 py-2 bg-red-700 text-white rounded-lg text-base font-medium hover:bg-red-600 transition-colors"
                >
                  {lang === "en"
                    ? `Show more (${filtered.length - 12} remaining)`
                    : `もっと見る（残り${filtered.length - 12}件）`}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
