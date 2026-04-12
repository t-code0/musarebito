"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams, usePathname } from "next/navigation";
import SaunaGoods from "@/components/SaunaGoods";
import { t, normalizeLang, type Lang } from "@/lib/i18n";

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

const contentCards: { icon: string; title: string; description: string; href: string; comingSoon?: boolean }[] = [
  {
    icon: "🔥",
    title: "グーサー(熱波師)一覧",
    description: "全国の熱波師を探す",
    href: "/aufgusser",
  },
  {
    icon: "🌿",
    title: "ウィスカー",
    description: "ウィスキング体験を探す",
    href: "/whisker",
    comingSoon: true,
  },
  {
    icon: "📸",
    title: "サウナ紹介インスタ一覧",
    description: "サウナ系Instagramアカウント",
    href: "/sauna-instagram",
    comingSoon: true,
  },
  {
    icon: "🛍️",
    title: "サウナグッズ",
    description: "おすすめサウナグッズ",
    href: "/goods",
  },
  {
    icon: "📖",
    title: "サウナ用語辞典",
    description: "サウナ用語を学ぶ",
    href: "/glossary",
  },
  {
    icon: "💪",
    title: "サウナの健康効果",
    description: "科学的に証明された効果",
    href: "/health",
  },
  {
    icon: "🔰",
    title: "初心者ガイド",
    description: "サウナの入り方",
    href: "/beginners",
  },
];

interface FeaturedSauna {
  id: string;
  name: string;
  honmono_score: number | null;
  prefecture: string;
  photos: string[];
  score_detail: { explanation?: string } | null;
}

export default function HomePage() {
  const [query, setQuery] = useState("");
  const router = useRouter();
  const params = useParams();
  const pathname = usePathname();
  const lang: Lang = normalizeLang(params.lang as string);
  const [featured, setFeatured] = useState<FeaturedSauna[]>([]);

  const switchLang = (next: Lang) => {
    if (next === lang) return;
    // Replace the leading /<lang>/ segment
    const newPath = pathname.replace(/^\/(ja|en)(?=\/|$)/, `/${next}`);
    router.push(newPath || `/${next}`);
  };

  useEffect(() => {
    fetch("/api/sauna/search?featured=true")
      .then((r) => r.json())
      .then((d) => {
        const saunas = (d.saunas || [])
          .filter((s: FeaturedSauna) => Array.isArray(s.photos) && s.photos.length > 0)
          .sort((a: FeaturedSauna, b: FeaturedSauna) => (b.honmono_score || 0) - (a.honmono_score || 0))
          .slice(0, 9);
        setFeatured(saunas);
      })
      .catch(() => {});
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/${lang}/sauna/${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <main
      className="min-h-screen"
      style={{
        background:
          "linear-gradient(180deg, #0a1a0a 0%, #152d15 30%, #0a1a0a 100%)",
      }}
    >
      {/* Hero */}
      <div className="flex flex-col items-center justify-center px-4 pt-12 md:pt-20 pb-12 md:pb-16">
        {/* Language switcher */}
        <div className="absolute top-4 right-4 flex gap-1 bg-white/10 backdrop-blur rounded-full p-1 border border-white/20">
          <button
            onClick={() => switchLang("ja")}
            className={`min-w-[44px] h-11 px-3 rounded-full text-base font-medium transition ${
              lang === "ja" ? "bg-[#D97706] text-white" : "text-white/70 hover:text-white"
            }`}
            aria-label={t("language_japanese", lang)}
          >
            🇯🇵 JA
          </button>
          <button
            onClick={() => switchLang("en")}
            className={`min-w-[44px] h-11 px-3 rounded-full text-base font-medium transition ${
              lang === "en" ? "bg-[#D97706] text-white" : "text-white/70 hover:text-white"
            }`}
            aria-label={t("language_english", lang)}
          >
            🇬🇧 EN
          </button>
        </div>

        <h1 className="text-4xl md:text-8xl font-bold text-white mb-3">
          {t("site_name", lang)}
        </h1>
        <p className="text-base md:text-2xl text-green-400 text-center">
          {t("site_subtitle", lang)}
        </p>
        <p className="text-base md:text-2xl text-green-400 text-center mb-8 md:mb-10">
          {t("site_tagline", lang)}
        </p>

        <form
          onSubmit={handleSearch}
          className="w-full max-w-full md:max-w-3xl flex gap-2"
        >
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("search_placeholder", lang)}
            className="flex-1 h-12 md:h-16 px-5 rounded-lg text-base md:text-xl bg-white/10 text-white placeholder-white/40 border border-white/20 outline-none focus:ring-2 focus:ring-[#D97706] focus:border-transparent"
          />
          <button
            type="submit"
            className="bg-[#D97706] text-white h-12 md:h-16 px-6 md:px-10 rounded-lg text-base md:text-xl font-medium hover:bg-[#B45309] transition-colors"
          >
            {t("search_button", lang)}
          </button>
        </form>
      </div>

      {/* About */}
      <section className="mx-2 md:max-w-[85vw] md:mx-auto px-2 md:px-4 mb-8">
        <div
          className="rounded-2xl p-6"
          style={{
            background: "linear-gradient(135deg, #1a2e1a 0%, #2d4a2d 25%, #1a2e1a 50%, #2d4a2d 75%, #1a2e1a 100%)",
            boxShadow: "0 4px 20px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.15), inset 0 -1px 0 rgba(0,0,0,0.3)",
            border: "1px solid rgba(34,197,94,0.3)",
          }}
        >
          <h2 className="text-3xl font-bold text-green-400 mb-3 flex items-center gap-2">
            {t("home_about_title", lang)}
          </h2>
          <p className="text-base text-gray-200 leading-relaxed">
            {t("home_about_body", lang)}
          </p>
        </div>
      </section>

      {/* Honmono Score explanation */}
      <section className="mx-2 md:max-w-[85vw] md:mx-auto px-2 md:px-4 mb-8">
        <div
          className="rounded-2xl p-4"
          style={{
            background: "linear-gradient(135deg, #1a2e1a 0%, #2d4a2d 25%, #1a2e1a 50%, #2d4a2d 75%, #1a2e1a 100%)",
            boxShadow: "0 4px 20px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.15), inset 0 -1px 0 rgba(0,0,0,0.3)",
            border: "1px solid rgba(34,197,94,0.3)",
          }}
        >
          <h2 className="text-3xl font-bold text-green-400 mb-4 flex items-center gap-2">
            {t("home_score_title", lang)}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-4">
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
                <p className="text-base font-bold text-white mb-1"><span className="text-green-400">✅</span> {name}</p>
                <p className="text-sm text-gray-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row sm:flex-wrap gap-1 sm:gap-3 sm:justify-start">
            <p className="text-sm"><span className="text-base font-bold text-amber-400">S</span><span className="text-gray-300">{t("home_rank_s", lang)}</span></p>
            <p className="text-sm"><span className="text-base font-bold text-amber-400">A</span><span className="text-gray-300">{t("home_rank_a", lang)}</span></p>
            <p className="text-sm"><span className="text-base font-bold text-amber-400">B</span><span className="text-gray-300">{t("home_rank_b", lang)}</span></p>
            <p className="text-sm"><span className="text-base font-bold text-amber-400">C</span><span className="text-gray-300">{t("home_rank_c", lang)}</span></p>
          </div>
        </div>
      </section>

      {/* Prefectures */}
      <section className="max-w-[95vw] mx-auto px-4 pb-16">
        <h2 className="text-2xl md:text-4xl font-bold text-white mb-6 text-center">
          {t("home_prefs_title", lang)}
        </h2>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-2">
          {prefectures.map((pref) => (
            <button
              key={pref}
              onClick={() =>
                router.push(`/${lang}/sauna/${encodeURIComponent(pref)}`)
              }
              className="bg-white/10 hover:bg-green-600 text-white text-sm md:text-lg py-2 md:py-3 px-3 rounded-lg transition-colors text-center"
            >
              {pref}
            </button>
          ))}
        </div>
      </section>

      {/* Content Grid */}
      <section className="max-w-[85vw] mx-auto px-4 pb-16">
        <h2 className="text-3xl font-bold text-white mb-6 text-center">
          {t("home_content_title", lang)}
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {contentCards.map((card) => (
            <a
              key={card.title}
              href={card.comingSoon ? undefined : `/${lang}${card.href}`}
              onClick={
                card.comingSoon ? (e: React.MouseEvent) => e.preventDefault() : undefined
              }
              className={`bg-white/5 border border-green-500/30 rounded-2xl p-5 transition-colors block relative ${
                card.comingSoon
                  ? "cursor-default opacity-70"
                  : "hover:bg-white/10"
              }`}
            >
              {card.comingSoon && (
                <span className="absolute top-3 right-3 text-[10px] font-bold uppercase tracking-wider bg-white/10 text-white/50 px-2 py-0.5 rounded-full">
                  coming soon
                </span>
              )}
              <span className="text-2xl">{card.icon}</span>
              <h3 className="text-sm font-bold text-white mt-2 mb-1">
                {card.title}
              </h3>
              <p className="text-xs text-white/50">{card.description}</p>
            </a>
          ))}
        </div>
      </section>

      {/* Sauna Goods (Affiliate) */}
      <section className="mx-2 md:max-w-[85vw] md:mx-auto px-2 md:px-4 mb-8">
        <SaunaGoods source="home" />
      </section>

      {/* Featured Saunas - Rich */}
      {featured.length > 0 && (
        <section className="mx-2 md:max-w-[85vw] md:mx-auto px-2 md:px-4 pb-20">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 text-center">
            {t("home_featured_title", lang)}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {featured.map((sauna) => (
              <a
                key={sauna.id}
                href={`/${lang}/sauna/${encodeURIComponent(sauna.prefecture)}/${sauna.id}`}
                className="block rounded-2xl overflow-hidden transition-transform hover:scale-[1.02] cursor-pointer"
                style={{
                  background: "linear-gradient(160deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.04) 50%, rgba(255,255,255,0.08) 100%)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.5), inset 0 2px 0 rgba(255,255,255,0.1)",
                }}
              >
                {/* Photo */}
                <div className="relative aspect-[16/9] w-full bg-white/5">
                  {sauna.photos && sauna.photos.length > 0 ? (
                    <img
                      src={sauna.photos[0]}
                      alt={sauna.name}
                      className="aspect-[16/9] w-full object-cover"
                    />
                  ) : (
                    <div className="aspect-[16/9] w-full flex items-center justify-center text-5xl text-white/20">
                      ♨
                    </div>
                  )}
                  {sauna.honmono_score && (
                    <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm text-white font-bold text-sm px-3 py-1 rounded-full border border-white/20">
                      {sauna.honmono_score}点
                    </div>
                  )}
                </div>
                {/* Info */}
                <div className="p-4">
                  <h3 className="text-lg font-bold text-white mb-1">
                    {sauna.name}
                  </h3>
                  <p className="text-xs text-green-300/70 mb-2">{sauna.prefecture}</p>
                  {sauna.score_detail?.explanation && (
                    <p className="text-sm text-white/60 line-clamp-2">
                      {sauna.score_detail.explanation}
                    </p>
                  )}
                </div>
              </a>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
