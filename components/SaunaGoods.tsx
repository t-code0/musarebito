"use client";

import { useParams } from "next/navigation";
import { t, normalizeLang } from "@/lib/i18n";

const TAG = "trustcheck-22";

interface Good {
  id: string;
  emoji: string;
  ja_label: string;
  en_label: string;
  ja_desc: string;
  en_desc: string;
  /** Amazon search keyword */
  keyword: string;
}

const GOODS: Good[] = [
  {
    id: "hat",
    emoji: "🎩",
    ja_label: "サウナハット",
    en_label: "Sauna Hat",
    ja_desc: "熱から頭を守る必需品",
    en_desc: "A must-have to protect your head from the heat",
    keyword: "サウナハット",
  },
  {
    id: "mat",
    emoji: "🧘",
    ja_label: "サウナマット",
    en_label: "Sauna Mat",
    ja_desc: "ベンチを快適にする折りたたみマット",
    en_desc: "Foldable mat for comfortable bench seating",
    keyword: "サウナマット",
  },
  {
    id: "totonoi",
    emoji: "🌀",
    ja_label: "ととのいグッズ",
    en_label: "Totonou Goods",
    ja_desc: "ロウリュオイル・ヴィヒタ・タオルなど",
    en_desc: "Löyly oils, vihta whisks, towels and more",
    keyword: "サウナグッズ",
  },
  {
    id: "drink",
    emoji: "🥤",
    ja_label: "サウナドリンク",
    en_label: "Sauna Drinks",
    ja_desc: "オロポ・Chill Cola等の定番ドリンク",
    en_desc: "Oropo, Chill Cola and other sauna favourites",
    keyword: "サウナドリンク オロポ",
  },
  {
    id: "poncho",
    emoji: "🧥",
    ja_label: "サウナポンチョ",
    en_label: "Sauna Poncho",
    ja_desc: "サウナ後のリラックスタイムに",
    en_desc: "Cosy poncho for the post-sauna chill",
    keyword: "サウナポンチョ",
  },
  {
    id: "towel",
    emoji: "🟦",
    ja_label: "サウナ用タオル(今治)",
    en_label: "Imabari Sauna Towel",
    ja_desc: "高品質な今治タオル、速乾・吸水",
    en_desc: "Premium fast-drying Imabari cotton towels",
    keyword: "サウナタオル 今治",
  },
  {
    id: "watch",
    emoji: "⌚",
    ja_label: "サウナウォッチ(耐熱)",
    en_label: "Heat-Proof Sauna Watch",
    ja_desc: "高温下でも使える耐熱仕様の腕時計",
    en_desc: "Heat-proof watches that survive 100°C+",
    keyword: "サウナウォッチ 耐熱",
  },
  {
    id: "aroma",
    emoji: "🌿",
    ja_label: "サウナ用アロマ",
    en_label: "Löyly Aroma Oil",
    ja_desc: "ロウリュにかける本場のアロマオイル",
    en_desc: "Authentic löyly aroma oils for the steam",
    keyword: "サウナアロマ ロウリュ",
  },
  {
    id: "book",
    emoji: "📖",
    ja_label: "サウナ本・雑誌",
    en_label: "Sauna Books & Mags",
    ja_desc: "サウナ文化・施設ガイド・コミック",
    en_desc: "Sauna culture guides, facility books, manga",
    keyword: "サウナ 本",
  },
];

function buildAmazonUrl(keyword: string): string {
  return `https://www.amazon.co.jp/s?tag=${TAG}&k=${encodeURIComponent(keyword)}`;
}

interface Props {
  /** Tracking origin: which page this component was rendered on. */
  source?: string;
}

export default function SaunaGoods({ source = "unknown" }: Props) {
  const params = useParams();
  const lang = normalizeLang((params?.lang as string) || "ja");

  const handleClick = (productId: string, keyword: string) => {
    try {
      fetch("/api/affiliate/click", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product_id: productId, keyword, source }),
        keepalive: true,
      }).catch(() => {});
    } catch {
      /* swallow */
    }
  };

  return (
    <section className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-xl font-bold text-[#1B4332] mb-1">{t("goods_title", lang)}</h2>
      <p className="text-sm text-gray-500 mb-4">{t("goods_subtitle", lang)}</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
        {GOODS.map((g) => (
          <a
            key={g.id}
            href={buildAmazonUrl(g.keyword)}
            target="_blank"
            rel="nofollow sponsored noopener noreferrer"
            onClick={() => handleClick(g.id, g.keyword)}
            className="border border-gray-200 rounded-lg p-4 flex flex-col items-center text-center hover:border-amber-400 hover:shadow transition min-h-[160px]"
          >
            <div className="text-3xl mb-2">{g.emoji}</div>
            <h3 className="font-bold text-sm text-[#1B4332] mb-1 leading-tight">
              {lang === "en" ? g.en_label : g.ja_label}
            </h3>
            <p className="text-xs text-gray-500 mb-3 flex-1 leading-snug">
              {lang === "en" ? g.en_desc : g.ja_desc}
            </p>
            <span
              className="w-full text-center text-xs py-2 rounded-lg font-medium text-white"
              style={{ background: "#ff9900" }}
            >
              {t("goods_amazon_button", lang)}
            </span>
          </a>
        ))}
      </div>
      <p className="text-[10px] text-gray-400 mt-3 text-center">{t("goods_disclosure", lang)}</p>
    </section>
  );
}
