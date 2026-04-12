"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { normalizeLang } from "@/lib/i18n";

const HONMONO_SERIES = [
  {
    name_ja: "添加物検索図鑑",
    name_en: "Food Additive Encyclopedia",
    desc_ja: "食品添加物の安全性を論文ベースで検索",
    desc_en: "Search food additives by peer-reviewed evidence",
    href: "https://tenkabutsu-zukan.vercel.app/ja",
  },
  {
    name_ja: "栄養成分検索図鑑",
    name_en: "Nutrient Encyclopedia",
    desc_ja: "栄養成分とサプリを論文で比較",
    desc_en: "Compare nutrients and supplements with research",
    href: "https://eiyo-zukan.vercel.app/ja",
  },
  {
    name_ja: "リタマ",
    name_en: "Ritama",
    desc_ja: "近所の本物のお店を本物スコアで探す",
    desc_en: "Find authentic local restaurants by HONMONO score",
    href: "https://ritama.vercel.app/ja",
  },
];

export default function Footer() {
  const params = useParams();
  const lang = normalizeLang((params?.lang as string) || "ja");
  const isEn = lang === "en";

  return (
    <footer
      className="py-10 px-4"
      style={{
        background: "#0d0505",
        borderTop: "1px solid rgba(255,255,255,0.1)",
      }}
    >
      <div className="max-w-6xl mx-auto">
        {/* HONMONO シリーズ */}
        <div className="mb-8">
          <p className="text-white/80 text-sm font-bold mb-3 tracking-wider">
            {isEn ? "HONMONO Series" : "HONMONOシリーズ"}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {HONMONO_SERIES.map((s) => (
              <a
                key={s.href}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-lg p-3 border border-white/15 hover:border-amber-400 hover:bg-white/5 transition-colors"
              >
                <p className="text-white text-base font-bold mb-0.5">
                  {isEn ? s.name_en : s.name_ja}
                </p>
                <p className="text-white/50 text-xs leading-snug">
                  {isEn ? s.desc_en : s.desc_ja}
                </p>
              </a>
            ))}
          </div>
        </div>

        {/* Site nav */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4 pt-4 border-t border-white/10">
          <p className="text-white font-bold text-lg">
            {isEn ? "Musarebito" : "蒸され人"}
          </p>
          <nav className="flex flex-wrap gap-4 text-sm">
            <Link href={`/${lang}`} className="text-gray-400 hover:text-white">
              {isEn ? "Home" : "トップ"}
            </Link>
            <Link href={`/${lang}/goods`} className="text-gray-400 hover:text-white">
              {isEn ? "Goods" : "グッズ"}
            </Link>
            <Link href={`/${lang}/glossary`} className="text-gray-400 hover:text-white">
              {isEn ? "Glossary" : "用語辞典"}
            </Link>
            <Link href={`/${lang}/privacy`} className="text-gray-400 hover:text-white">
              {isEn ? "Privacy" : "プライバシーポリシー"}
            </Link>
            <Link href={`/${lang}/terms`} className="text-gray-400 hover:text-white">
              {isEn ? "Terms" : "利用規約"}
            </Link>
          </nav>
        </div>
        <p className="text-gray-500 text-xs">
          &copy; 2026 {isEn ? "Musarebito" : "蒸され人"} All rights reserved.
        </p>
      </div>
    </footer>
  );
}
