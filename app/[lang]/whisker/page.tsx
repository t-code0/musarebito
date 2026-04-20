"use client";

import { useState } from "react";
import { useParams } from "next/navigation";

interface WhiskerProfile {
  name: string;
  subtitle_ja: string;
  subtitle_en: string;
  location_ja: string;
  location_en: string;
  group: string;
  group_en: string;
  desc_ja: string;
  desc_en: string;
  instagram: { url: string; label: string }[];
  website?: { url: string; label_ja: string; label_en: string };
}

const WHISKERS: WhiskerProfile[] = [
  {
    name: "AYAKA",
    subtitle_ja: "伝統療法と蒸気浴でヒトを元気にする人",
    subtitle_en: "Healing through traditional therapy and steam bathing",
    location_ja: "茨城",
    location_en: "Ibaraki",
    group: "Mahārāja",
    group_en: "Mahārāja",
    desc_ja:
      "世界最古かつ世界三大医学の一つ「アーユルヴェーダ」と、バルト三国リトアニアより習得したサウナセラピー「ウィスキング」、世界のヒーリング技術を掛け合わせた唯一無二のサウナセラピーを行う。",
    desc_en:
      "Combines Ayurveda — one of the world's oldest and three great medical traditions — with sauna therapy \"whisking\" learned in Lithuania, and global healing techniques to deliver a one-of-a-kind sauna therapy experience.",
    instagram: [
      { url: "https://www.instagram.com/zenspa1118/", label: "@zenspa1118" },
      { url: "https://www.instagram.com/maharaja__ritual/", label: "@maharaja__ritual" },
    ],
  },
  {
    name: "鈴木翔",
    subtitle_ja:
      "85歳が創る茨城極熱サウナ「3un」運営／ウィスキング×アーユルヴェーダセラピー",
    subtitle_en:
      'Operator of "3un" — Ibaraki\'s extreme heat sauna built by an 85-year-old / Whisking × Ayurveda therapy',
    location_ja: "茨城",
    location_en: "Ibaraki",
    group: "Mahārāja",
    group_en: "Mahārāja",
    desc_ja:
      "茨城の極熱サウナ「3un」を運営。ラトビアから直輸入した白樺・オークの若枝を用いたフィンランド式ウィスキングを平日1〜2名限定でパーソナル提供。低温サウナ室での施術・指圧マッサージ・オイルトリートメント・水風呂フローティング・シンギングボウル倍音浴まで含む約50〜60分の極快ウィスキングセッション。",
    desc_en:
      'Operates "3un," an extreme heat sauna in Ibaraki. Offers personal Finnish-style whisking sessions limited to 1–2 guests on weekdays, using birch and oak branches imported directly from Latvia. Sessions of approximately 50–60 minutes include treatment in a low-temperature sauna room, shiatsu massage, oil treatment, cold bath floating, and singing bowl overtone bathing.',
    instagram: [
      { url: "https://www.instagram.com/3un_sauna/", label: "@3un_sauna" },
      { url: "https://www.instagram.com/maharaja__ritual/", label: "@maharaja__ritual" },
    ],
    website: {
      url: "https://3un-sauna.com/",
      label_ja: "公式サイト",
      label_en: "Official Site",
    },
  },
];

const GROUPS = ["all", "Mahārāja"] as const;

export default function WhiskerPage() {
  const params = useParams();
  const lang = (params.lang as string) || "ja";
  const isEn = lang === "en";
  const [filter, setFilter] = useState<string>("all");

  const filtered =
    filter === "all"
      ? WHISKERS
      : WHISKERS.filter((w) => w.group === filter);

  return (
    <main
      className="min-h-screen"
      style={{
        background:
          "linear-gradient(180deg, #0a1a0a 0%, #152d15 30%, #0a1a0a 100%)",
      }}
    >
      {/* Header */}
      <div
        className="py-8 px-4 sm:px-6"
        style={{
          background:
            "linear-gradient(180deg, #152d15 0%, #0a1a0a 100%)",
        }}
      >
        <div className="max-w-7xl mx-auto">
          <a
            href={`/${lang}`}
            className="text-green-300 hover:text-white text-sm mb-2 inline-block"
          >
            {isEn ? "← Back to Home" : "← トップに戻る"}
          </a>
          <h1 className="text-3xl font-bold text-white">
            🌿 {isEn ? "Whisker Directory" : "ウィスカー一覧"}
          </h1>
          <p className="text-green-200/70 text-sm mt-2">
            {isEn
              ? "Japanese whisking therapists — masters of the birch branch ritual"
              : "日本のウィスキング施術者たち"}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Mahārāja Organization Section */}
        <section
          className="rounded-2xl p-6 mb-8"
          style={{
            background:
              "linear-gradient(135deg, #1a2e1a 0%, #2d4a2d 25%, #1a2e1a 50%, #2d4a2d 75%, #1a2e1a 100%)",
            boxShadow:
              "0 4px 20px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.15)",
            border: "1px solid rgba(34,197,94,0.3)",
          }}
        >
          <div className="flex items-center gap-3 mb-3">
            <span className="text-3xl">🏛️</span>
            <div>
              <h2 className="text-2xl font-bold text-green-400">
                Mah&#x101;r&#x101;ja
              </h2>
              <p className="text-white/60 text-sm">
                {isEn ? "マハラジャ" : "マハラジャ"}
              </p>
            </div>
          </div>
          <p className="text-gray-200 text-sm leading-relaxed">
            {isEn
              ? "Japan's most distinguished sauna organization, comprising Ayurveda therapists certified by the Indian government. Mahārāja produces herbal sauna experiences at hot spring facilities nationwide, managing pesticide-free medicinal herb cultivation, harvesting, and blending entirely in-house. Their herb garden \"Maharani herb eden\" spans over one hectare, producing more than 50 varieties of medicinal herbs annually. Their events deliver overwhelming botanical steam bathing experiences, and their premium reservation-only \"Mahārāja session\" is in constant demand."
              : "インド政府認定アーユルヴェーダセラピストが属する日本一高貴なサウナ団体。全国温浴施設および薬草ハーブサウナのプロデュースを手掛け、農薬不使用の業務用薬草ハーブの生産・管理・収穫・調合を全て自社で行う。運営するherb garden「Maharani herb eden」では、1ヘクタール以上のハーブガーデンで50種類以上の薬草ハーブを年間生産。各施設でのイベントでは圧倒的な植物蒸気浴と、予約殺到の有料セッション「Mahārāja session」を展開。"}
          </p>
          <div className="flex items-center gap-3 mt-4">
            <a
              href="https://www.instagram.com/maharaja__ritual/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-green-300 hover:text-white transition-colors"
            >
              📸 @maharaja__ritual
            </a>
          </div>
        </section>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          {GROUPS.map((g) => (
            <button
              key={g}
              onClick={() => setFilter(g)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                filter === g
                  ? "bg-green-600 text-white"
                  : "bg-white/10 text-white/60 hover:bg-white/20"
              }`}
            >
              {g === "all"
                ? isEn
                  ? `All (${WHISKERS.length})`
                  : `全て (${WHISKERS.length})`
                : `${g} (${WHISKERS.filter((w) => w.group === g).length})`}
            </button>
          ))}
        </div>

        {/* Whisker Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((w) => (
            <div
              key={w.name}
              className="rounded-2xl p-5 flex flex-col"
              style={{
                background:
                  "linear-gradient(160deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.04) 50%, rgba(255,255,255,0.08) 100%)",
                border: "1px solid rgba(255,255,255,0.2)",
                boxShadow:
                  "0 4px 12px rgba(0,0,0,0.4), inset 0 2px 0 rgba(255,255,255,0.1)",
              }}
            >
              {/* Name + Badge */}
              <div className="flex items-start justify-between mb-1">
                <h3 className="text-lg font-bold text-white">{w.name}</h3>
                <span className="shrink-0 text-[10px] font-bold bg-green-500/20 text-green-300 px-2 py-0.5 rounded-full border border-green-500/30">
                  {isEn ? w.group_en : w.group}
                </span>
              </div>

              {/* Subtitle */}
              <p className="text-xs text-green-300/80 mb-2 leading-snug">
                {isEn ? w.subtitle_en : w.subtitle_ja}
              </p>

              {/* Location */}
              <p className="text-xs text-white/40 mb-3">
                📍 {isEn ? w.location_en : w.location_ja}
              </p>

              {/* Description */}
              <p className="text-sm text-gray-300 leading-relaxed mb-4 flex-1">
                {isEn ? w.desc_en : w.desc_ja}
              </p>

              {/* Links */}
              <div className="flex flex-wrap items-center gap-2">
                {w.instagram.map((ig) => (
                  <a
                    key={ig.url}
                    href={ig.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-green-300 hover:text-white transition-colors bg-white/5 px-2.5 py-1.5 rounded-lg"
                  >
                    📸 {ig.label}
                  </a>
                ))}
                {w.website && (
                  <a
                    href={w.website.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-amber-300 hover:text-white transition-colors bg-white/5 px-2.5 py-1.5 rounded-lg"
                  >
                    🌐 {isEn ? w.website.label_en : w.website.label_ja}
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
