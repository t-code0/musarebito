"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { normalizeLang } from "@/lib/i18n";

const HONMONO_SERIES = [
  {
    emoji: "🔍",
    name_ja: "アリフ（Amazon本物商品検索）",
    name_en: "Arifu (Amazon Real Filter Search)",
    desc_ja: "Amazonで本物の商品を見つける",
    desc_en: "Find authentic products on Amazon",
    href: "https://arisa.vercel.app",
  },
  {
    emoji: "🧪",
    name_ja: "添加物検索図鑑",
    name_en: "Food Additive Encyclopedia",
    desc_ja: "バーコードで食品の安全性をチェック",
    desc_en: "Check food safety by barcode",
    href: "https://tenkabutsu-zukan.vercel.app/ja",
  },
  {
    emoji: "🥗",
    name_ja: "栄養成分検索図鑑",
    name_en: "Nutrition Encyclopedia",
    desc_ja: "食品の栄養を科学的に比較",
    desc_en: "Compare food nutrition scientifically",
    href: "https://eiyo-zukan.vercel.app/ja",
  },
  {
    emoji: "📍",
    name_ja: "リタマ（近所の本物店舗検索）",
    name_en: "Ritama (Local Business Finder in Japan)",
    desc_ja: "近所の本物店舗検索",
    desc_en: "Local Business Finder in Japan",
    href: "https://ritama.vercel.app",
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {HONMONO_SERIES.map((s) => (
              <a
                key={s.href}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-lg p-3 border border-white/15 hover:border-amber-400 hover:bg-white/5 transition-colors"
              >
                <p className="text-white text-base font-bold mb-0.5">
                  {s.emoji} {isEn ? s.name_en : s.name_ja}
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
          </nav>
        </div>

        {/* Legal links */}
        <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs mb-4 pt-3 border-t border-white/10">
          <Link href={`/${lang}/terms`} className="text-gray-500 hover:text-white">
            {isEn ? "Terms of Service" : "利用規約"}
          </Link>
          <Link href={`/${lang}/privacy`} className="text-gray-500 hover:text-white">
            {isEn ? "Privacy Policy" : "プライバシーポリシー"}
          </Link>
          <Link href={`/${lang}/disclaimer`} className="text-gray-500 hover:text-white">
            {isEn ? "Disclaimer" : "免責事項"}
          </Link>
          <Link href={`/${lang}/legal`} className="text-gray-500 hover:text-white">
            {isEn ? "Legal Notice" : "特定商取引法に基づく表記"}
          </Link>
          <Link href={`/${lang}/contact`} className="text-gray-500 hover:text-white">
            {isEn ? "Contact" : "お問い合わせ"}
          </Link>
        </div>

        {/* Affiliate disclosure */}
        <p className="text-gray-600 text-[10px] leading-relaxed mb-3">
          {isEn
            ? "This site participates in the Amazon.co.jp Associates Program, Rakuten Affiliate, and other affiliate programs. We may earn referral fees from qualifying purchases through affiliate links."
            : "当サイトはAmazon.co.jpアソシエイト、楽天アフィリエイト等のアフィリエイトプログラムに参加しています。リンク経由の購入により紹介料が発生する場合があります。"}
        </p>

        <p className="text-gray-500 text-xs">
          &copy; 2026 {isEn ? "Musarebito" : "蒸され人"} All rights reserved.
        </p>
      </div>
    </footer>
  );
}
