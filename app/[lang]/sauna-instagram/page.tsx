"use client";

import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import {
  SAUNA_INSTAGRAM_ACCOUNTS,
  CATEGORY_LABEL_JA,
  CATEGORY_LABEL_EN,
  CATEGORY_EMOJI,
  instagramUrl,
  type InstagramCategory,
} from "@/lib/sauna-instagram";
import { normalizeLang } from "@/lib/i18n";

const CATEGORIES: InstagramCategory[] = ["official", "review", "goods", "female"];

export default function SaunaInstagramPage() {
  const params = useParams();
  const lang = normalizeLang(params.lang as string);
  const isEn = lang === "en";
  const labels = isEn ? CATEGORY_LABEL_EN : CATEGORY_LABEL_JA;

  const [selected, setSelected] = useState<InstagramCategory | "all">("all");

  const filtered = useMemo(() => {
    if (selected === "all") return SAUNA_INSTAGRAM_ACCOUNTS;
    return SAUNA_INSTAGRAM_ACCOUNTS.filter((a) => a.category === selected);
  }, [selected]);

  const allLabel = isEn ? "All" : "すべて";
  const total = SAUNA_INSTAGRAM_ACCOUNTS.length;

  return (
    <main
      className="min-h-screen"
      style={{
        background: "linear-gradient(180deg, #0a1a0a 0%, #152d15 30%, #0a1a0a 100%)",
      }}
    >
      <div className="py-8 px-4 sm:px-6">
        <a
          href={`/${lang}`}
          className="text-green-300 hover:text-white text-base mb-2 inline-block"
        >
          {isEn ? "← Back to home" : "← トップに戻る"}
        </a>
        <h1 className="text-3xl md:text-4xl font-bold text-white">
          📸 {isEn ? "Sauna Instagram Accounts" : "サウナ紹介インスタアカウント一覧"}
        </h1>
        <p className="text-green-200/70 text-base mt-2">
          {isEn
            ? `Hand-picked Japanese sauna accounts on Instagram (${total} verified accounts)`
            : `編集部が厳選した日本のサウナ系インスタアカウント（${total}件）`}
        </p>
      </div>

      <div className="max-w-[95vw] mx-auto px-4 sm:px-6 pb-16">
        {/* Category filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setSelected("all")}
            className={`min-h-[44px] px-4 py-2 rounded-full text-base font-medium transition ${
              selected === "all"
                ? "bg-green-600 text-white"
                : "bg-white/10 text-white/80 border border-white/20 hover:bg-white/20"
            }`}
          >
            {allLabel} ({total})
          </button>
          {CATEGORIES.map((cat) => {
            const count = SAUNA_INSTAGRAM_ACCOUNTS.filter((a) => a.category === cat).length;
            return (
              <button
                key={cat}
                onClick={() => setSelected(cat)}
                className={`min-h-[44px] px-4 py-2 rounded-full text-base font-medium transition ${
                  selected === cat
                    ? "bg-green-600 text-white"
                    : "bg-white/10 text-white/80 border border-white/20 hover:bg-white/20"
                }`}
              >
                {CATEGORY_EMOJI[cat]} {labels[cat]} ({count})
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((acc) => (
            <a
              key={acc.handle}
              href={instagramUrl(acc.handle)}
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-2xl p-5 transition-transform hover:scale-[1.02]"
              style={{
                background:
                  "linear-gradient(160deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.04) 50%, rgba(255,255,255,0.08) 100%)",
                border: "1px solid rgba(255,255,255,0.2)",
                boxShadow:
                  "0 4px 12px rgba(0,0,0,0.4), inset 0 2px 0 rgba(255,255,255,0.1)",
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">{CATEGORY_EMOJI[acc.category]}</span>
                <span className="text-[11px] uppercase tracking-wider text-green-400/80 font-bold">
                  {labels[acc.category]}
                </span>
              </div>
              <h2 className="text-base font-bold text-white mb-1">{acc.name}</h2>
              <p className="text-xs text-green-300/80 font-mono mb-2">@{acc.handle}</p>
              <p className="text-sm text-gray-300 leading-relaxed mb-3">{acc.description}</p>
              <span className="inline-block text-xs px-3 py-1.5 rounded-full bg-pink-600/80 text-white font-medium">
                {isEn ? "View on Instagram" : "Instagramで見る"}
              </span>
            </a>
          ))}
        </div>

        <p className="text-[11px] text-white/40 text-center mt-8 leading-relaxed">
          {isEn
            ? "* Accounts are independently selected. Inclusion does not imply endorsement by the account owner."
            : "※ アカウントは編集部が独自に選定。掲載は各アカウント運営者からの承認を意味するものではありません。"}
        </p>
      </div>
    </main>
  );
}
