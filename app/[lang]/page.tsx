"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams, usePathname } from "next/navigation";
import SaunaGoods from "@/components/SaunaGoods";
import { t, normalizeLang, prefEn, type Lang } from "@/lib/i18n";

const prefectures: { ja: string; en: string }[] = [
  { ja: "北海道", en: "Hokkaido" },
  { ja: "青森県", en: "Aomori" }, { ja: "岩手県", en: "Iwate" }, { ja: "宮城県", en: "Miyagi" }, { ja: "秋田県", en: "Akita" }, { ja: "山形県", en: "Yamagata" }, { ja: "福島県", en: "Fukushima" },
  { ja: "茨城県", en: "Ibaraki" }, { ja: "栃木県", en: "Tochigi" }, { ja: "群馬県", en: "Gunma" }, { ja: "埼玉県", en: "Saitama" }, { ja: "千葉県", en: "Chiba" }, { ja: "東京都", en: "Tokyo" }, { ja: "神奈川県", en: "Kanagawa" },
  { ja: "新潟県", en: "Niigata" }, { ja: "富山県", en: "Toyama" }, { ja: "石川県", en: "Ishikawa" }, { ja: "福井県", en: "Fukui" }, { ja: "山梨県", en: "Yamanashi" }, { ja: "長野県", en: "Nagano" }, { ja: "岐阜県", en: "Gifu" }, { ja: "静岡県", en: "Shizuoka" }, { ja: "愛知県", en: "Aichi" },
  { ja: "三重県", en: "Mie" }, { ja: "滋賀県", en: "Shiga" }, { ja: "京都府", en: "Kyoto" }, { ja: "大阪府", en: "Osaka" }, { ja: "兵庫県", en: "Hyogo" }, { ja: "奈良県", en: "Nara" }, { ja: "和歌山県", en: "Wakayama" },
  { ja: "鳥取県", en: "Tottori" }, { ja: "島根県", en: "Shimane" }, { ja: "岡山県", en: "Okayama" }, { ja: "広島県", en: "Hiroshima" }, { ja: "山口県", en: "Yamaguchi" },
  { ja: "徳島県", en: "Tokushima" }, { ja: "香川県", en: "Kagawa" }, { ja: "愛媛県", en: "Ehime" }, { ja: "高知県", en: "Kochi" },
  { ja: "福岡県", en: "Fukuoka" }, { ja: "佐賀県", en: "Saga" }, { ja: "長崎県", en: "Nagasaki" }, { ja: "熊本県", en: "Kumamoto" }, { ja: "大分県", en: "Oita" }, { ja: "宮崎県", en: "Miyazaki" }, { ja: "鹿児島県", en: "Kagoshima" }, { ja: "沖縄県", en: "Okinawa" },
];

const contentCards: { icon: string; title_ja: string; title_en: string; desc_ja: string; desc_en: string; href: string; comingSoon?: boolean }[] = [
  {
    icon: "🔥",
    title_ja: "アウフグーサー(熱波師)一覧",
    title_en: "Aufgusser (Heat-Wave Master) List",
    desc_ja: "全国の熱波師を探す",
    desc_en: "Find aufguss masters across Japan",
    href: "/aufgusser",
  },
  {
    icon: "🌿",
    title_ja: "ウィスカー",
    title_en: "Whisking Experience",
    desc_ja: "ウィスキング体験を探す",
    desc_en: "Find whisking experiences",
    href: "/whisker",
    comingSoon: true,
  },
  {
    icon: "📸",
    title_ja: "サウナ紹介インスタ一覧",
    title_en: "Sauna Instagram Directory",
    desc_ja: "サウナ系Instagramアカウント",
    desc_en: "Curated sauna Instagram accounts",
    href: "/sauna-instagram",
    comingSoon: true,
  },
  {
    icon: "🛍️",
    title_ja: "サウナグッズ",
    title_en: "Sauna Goods",
    desc_ja: "おすすめサウナグッズ",
    desc_en: "Recommended sauna gear",
    href: "/goods",
  },
  {
    icon: "📖",
    title_ja: "サウナ用語辞典",
    title_en: "Sauna Glossary",
    desc_ja: "サウナ用語を学ぶ",
    desc_en: "Learn sauna terminology",
    href: "/glossary",
  },
  {
    icon: "💪",
    title_ja: "サウナの健康効果",
    title_en: "Health Benefits of Sauna",
    desc_ja: "科学的に証明された効果",
    desc_en: "Scientifically proven benefits",
    href: "/health",
  },
  {
    icon: "🔰",
    title_ja: "初心者ガイド",
    title_en: "Beginner's Guide",
    desc_ja: "サウナの入り方",
    desc_en: "How to enjoy a sauna",
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
        <div className="absolute top-4 right-4 flex bg-white/10 backdrop-blur rounded-full p-0.5 border border-white/20">
          <button
            onClick={() => switchLang("ja")}
            className={`px-3 py-1.5 rounded-full text-sm font-bold transition ${
              lang === "ja" ? "bg-[#1B4332] text-white" : "text-white/50 hover:text-white"
            }`}
          >
            JA
          </button>
          <button
            onClick={() => switchLang("en")}
            className={`px-3 py-1.5 rounded-full text-sm font-bold transition ${
              lang === "en" ? "bg-[#1B4332] text-white" : "text-white/50 hover:text-white"
            }`}
          >
            EN
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
              key={pref.ja}
              onClick={() =>
                router.push(`/${lang}/sauna/${encodeURIComponent(pref.ja)}`)
              }
              className="bg-white/10 hover:bg-green-600 text-white text-sm md:text-lg py-2 md:py-3 px-3 rounded-lg transition-colors text-center"
            >
              {lang === "en" ? pref.en : pref.ja}
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
              key={card.title_ja}
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
                {lang === "en" ? card.title_en : card.title_ja}
              </h3>
              <p className="text-xs text-white/50">{lang === "en" ? card.desc_en : card.desc_ja}</p>
            </a>
          ))}
        </div>
      </section>

      {/* Sauna Goods (Affiliate) */}
      <section className="mx-2 md:max-w-[85vw] md:mx-auto px-2 md:px-4 mb-8">
        <SaunaGoods source="home" />
      </section>

      {/* HONMONO Series */}
      <section className="mx-2 md:max-w-[85vw] md:mx-auto px-2 md:px-4 mb-12">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 text-center">
          {lang === "en" ? "🏆 HONMONO Series" : "🏆 HONMONOシリーズ"}
        </h2>
        <p className="text-center text-white/60 text-sm md:text-base mb-6">
          {lang === "en"
            ? "Our family of evidence-based search apps. Find the real deal in every category."
            : "本物だけを探すための姉妹サービス。各分野で「課金しても使いたい」を追求中。"}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              icon: "🧪",
              name_ja: "添加物検索図鑑",
              name_en: "Food Additive Encyclopedia",
              desc_ja: "食品添加物の安全性を論文ベースで検索。子育て世代・健康意識の高い人に。",
              desc_en: "Search food additives by peer-reviewed research. Built for health-conscious families.",
              href: "https://tenkabutsu-zukan.vercel.app/ja",
            },
            {
              icon: "🥗",
              name_ja: "栄養成分検索図鑑",
              name_en: "Nutrient Encyclopedia",
              desc_ja: "栄養成分とサプリを論文で比較。サプリ選びを科学的に。",
              desc_en: "Compare nutrients and supplements by clinical evidence.",
              href: "https://eiyo-zukan.vercel.app/ja",
            },
            {
              icon: "🍽",
              name_ja: "リタマ",
              name_en: "Ritama",
              desc_ja: "近所の本物のお店を本物スコアで探す。食べログにない深い情報を。",
              desc_en: "Discover authentic local restaurants ranked by HONMONO score.",
              href: "https://ritama.vercel.app/ja",
            },
          ].map((s) => (
            <a
              key={s.href}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-2xl p-5 transition-transform hover:scale-[1.02]"
              style={{
                background:
                  "linear-gradient(160deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.04) 50%, rgba(255,255,255,0.08) 100%)",
                border: "1px solid rgba(255,255,255,0.2)",
                boxShadow:
                  "0 8px 24px rgba(0,0,0,0.5), inset 0 2px 0 rgba(255,255,255,0.1)",
              }}
            >
              <div className="text-3xl mb-2">{s.icon}</div>
              <h3 className="text-lg font-bold text-white mb-2">
                {lang === "en" ? s.name_en : s.name_ja}
              </h3>
              <p className="text-sm text-white/60 leading-relaxed mb-4">
                {lang === "en" ? s.desc_en : s.desc_ja}
              </p>
              <span className="inline-block text-sm px-4 py-2 rounded-full bg-amber-500 text-white font-bold">
                {lang === "en" ? "Open →" : "サイトを見る →"}
              </span>
            </a>
          ))}
        </div>
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
                      {sauna.honmono_score}{lang === "en" ? " pts" : "点"}
                    </div>
                  )}
                </div>
                {/* Info */}
                <div className="p-4">
                  <h3 className="text-lg font-bold text-white mb-1">
                    {sauna.name}
                  </h3>
                  <p className="text-xs text-green-300/70 mb-2">{lang === "en" ? prefEn(sauna.prefecture) : sauna.prefecture}</p>
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
