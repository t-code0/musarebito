"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

type Product = {
  name: string;
  name_en: string;
  category: string;
  description: string;
  desc_en: string;
  /** Amazon search keyword (overrides name for URL). */
  keyword?: string;
};

const categoriesJa = [
  "すべて",
  "サウナハット",
  "タオル",
  "サウナマット",
  "アロマオイル",
  "サウナポンチョ",
  "ドリンク",
  "サウナ本・漫画",
  "サウナグッズ",
];

const categoryEnMap: Record<string, string> = {
  "すべて": "All",
  "サウナハット": "Sauna Hats",
  "タオル": "Towels",
  "サウナマット": "Sauna Mats",
  "アロマオイル": "Aroma Oils",
  "サウナポンチョ": "Sauna Ponchos",
  "ドリンク": "Drinks",
  "サウナ本・漫画": "Books & Manga",
  "サウナグッズ": "Sauna Goods",
};

const products: Product[] = [
  // サウナハット
  {
    name: "TOYOKOサウナハット",
    name_en: "TOYOKO Sauna Hat",
    category: "サウナハット",
    description: "国産ウールの断熱力で、110℃のサウナ室でも頭皮は別世界。深めデザインで耳まで守る、本気サウナーの定番。",
    desc_en: "Domestic wool insulation keeps your scalp cool even in 110°C saunas. Deep design covers your ears — a staple for serious sauna lovers.",
  },
  {
    name: "今治タオルサウナハット",
    name_en: "Imabari Towel Sauna Hat",
    category: "サウナハット",
    description: "プロサウナーの9割が愛用する今治タオル製。頭皮を灼熱から守る、サウナ室の相棒。",
    desc_en: "Made from Imabari towel fabric loved by 90% of pro sauna-goers. Protects your scalp from extreme heat — your sauna room companion.",
  },
  {
    name: "MORZHサウナハット",
    name_en: "MORZH Sauna Hat",
    category: "サウナハット",
    description: "ロシアの極寒で鍛えられた老舗ブランドのフェルト製。本場の重厚感と断熱性能、格が違う。",
    desc_en: "Felt hat from a legendary Russian brand forged in extreme cold. Authentic weight and insulation — in a class of its own.",
  },
  {
    name: "ウールサウナハット",
    name_en: "Wool Sauna Hat",
    category: "サウナハット",
    description: "天然ウール100%、熱を通さない鉄壁ガード。セッション終盤まで頭がクリアなまま攻められる。",
    desc_en: "100% natural wool — an impenetrable heat barrier. Stay clear-headed right through your final session.",
  },
  {
    name: "リネンサウナハット",
    name_en: "Linen Sauna Hat",
    category: "サウナハット",
    description: "わずか33gの超軽量。持ち運びゼロストレスで、毎日のサ活に必携の一枚。",
    desc_en: "Ultra-lightweight at just 33g. Zero stress to carry — essential for your daily sauna routine.",
  },
  // タオル
  {
    name: "今治サウナタオル",
    name_en: "Imabari Sauna Towel",
    category: "タオル",
    description: "一度使えば他に戻れない吸水力。汗を瞬時に吸い取り、外気浴の快適度が段違いに変わる。",
    desc_en: "Absorbency so good you'll never go back. Instantly wicks away sweat, transforming your outdoor cooling experience.",
  },
  {
    name: "MOKUタオル",
    name_en: "MOKU Towel",
    category: "タオル",
    description: "サウナーの間で「神タオル」と呼ばれる薄手軽量の名品。かさばらず、乾きも早い。毎日持ち歩ける相棒。",
    desc_en: "Called the \"God Towel\" among sauna enthusiasts. Thin, lightweight, compact, and quick-drying — your everyday companion.",
  },
  {
    name: "サウナマット大判",
    name_en: "Large Sauna Mat Towel",
    category: "タオル",
    description: "ベンチに敷けば自分だけの聖域。大判サイズで衛生的、ストレスフリーなサウナ体験を約束。",
    desc_en: "Lay it on the bench for your own personal sanctuary. Large-format and hygienic for a stress-free sauna session.",
  },
  {
    name: "速乾サウナタオル",
    name_en: "Quick-Dry Sauna Towel",
    category: "タオル",
    description: "マイクロファイバーの驚異的速乾力。使った30分後にはもうカラカラ。連続サ活の強い味方。",
    desc_en: "Incredible microfiber quick-dry power. Bone-dry in 30 minutes — your ally for back-to-back sauna sessions.",
  },
  // サウナマット
  {
    name: "折りたたみサウナマット",
    name_en: "Foldable Sauna Mat",
    category: "サウナマット",
    description: "ポケットに入るコンパクトさなのに、座った瞬間の断熱感に驚く。マイサウナマット入門に最適。",
    desc_en: "Compact enough for your pocket, yet surprisingly insulating the moment you sit. Perfect entry-level personal sauna mat.",
  },
  {
    name: "携帯用サウナマット",
    name_en: "Portable Sauna Mat",
    category: "サウナマット",
    description: "カラビナでバッグにぶら下げるだけ。忘れ物ゼロ、どこでもマイマットでサウナを楽しめる。",
    desc_en: "Just clip it to your bag with a carabiner. Never forget it — enjoy your own mat at any sauna.",
  },
  {
    name: "防水サウナマット",
    name_en: "Waterproof Sauna Mat",
    category: "サウナマット",
    description: "汗を一切通さない防水加工。サッと拭くだけで清潔、潔癖サウナーの救世主。",
    desc_en: "Waterproof coating blocks all sweat. A quick wipe keeps it clean — a lifesaver for hygiene-conscious sauna lovers.",
  },
  // アロマオイル
  {
    name: "ユーカリ精油",
    name_en: "Eucalyptus Essential Oil",
    category: "アロマオイル",
    description: "ロウリュに数滴垂らせば、蒸気が清涼感に変わる。鼻が通り、呼吸が深くなり、ととのいが加速。",
    desc_en: "A few drops in the loyly and the steam turns refreshing. Clears your sinuses, deepens breathing, and accelerates that perfect state.",
  },
  {
    name: "白樺精油",
    name_en: "Birch Essential Oil",
    category: "アロマオイル",
    description: "一滴でフィンランドの森に飛べる。ウッディで爽やかな香りが、自宅サウナを本場に変える。",
    desc_en: "One drop transports you to a Finnish forest. Woody, refreshing aroma that turns your home sauna into the real thing.",
  },
  {
    name: "ヴィヒタエッセンス",
    name_en: "Vihta Essence",
    category: "アロマオイル",
    description: "白樺ヴィヒタの香りを凝縮。お風呂に入れるだけで、湯船がフィンランドのレイクサイドになる。",
    desc_en: "Concentrated birch vihta fragrance. Just add to your bath and your tub becomes a Finnish lakeside retreat.",
  },
  {
    name: "ロウリュ用アロマウォーター",
    name_en: "Loyly Aroma Water",
    category: "アロマオイル",
    description: "ストーンにそのままかけるだけ。ハーブブレンドの蒸気が広がり、サウナ室が天国に変わる瞬間。",
    desc_en: "Just pour directly on the stones. Herbal steam fills the room — the moment your sauna becomes paradise.",
  },
  // サウナポンチョ
  {
    name: "サウナポンチョ フリーサイズ",
    name_en: "Sauna Poncho (Free Size)",
    category: "サウナポンチョ",
    description: "外気浴の「あと一歩」を埋める最終兵器。さっと羽織れば冷えを防ぎ、ととのいが持続する。",
    desc_en: "The ultimate weapon to complete your outdoor cooling. Throw it on to prevent chill and sustain that perfect feeling.",
    keyword: "サウナポンチョ フリーサイズ",
  },
  {
    name: "マイクロファイバーポンチョ",
    name_en: "Microfiber Poncho",
    category: "サウナポンチョ",
    description: "驚きの軽さと速乾性。畳めばペットボトルサイズ、テントサウナ遠征のお供に。",
    desc_en: "Amazingly light and quick-drying. Folds to water bottle size — perfect for tent sauna trips.",
  },
  {
    name: "今治ポンチョ",
    name_en: "Imabari Poncho",
    category: "サウナポンチョ",
    description: "今治タオルの肌触りで全身を包む贅沢。吸水力も最高峰、外気浴が至福の時間になる。",
    desc_en: "Wrap yourself in the luxury of Imabari towel fabric. Top-tier absorbency turns outdoor cooling into pure bliss.",
  },
  // ドリンク
  {
    name: "オロポ",
    name_en: "Oro-Po",
    category: "ドリンク",
    description: "オロナミンC×ポカリスエット。サウナ後の至福の一杯、通称オロポ。これを飲むためにサウナに行く人、続出中。",
    desc_en: "Oronamin C x Pocari Sweat. The ultimate post-sauna drink known as Oro-Po. People go to saunas just for this.",
    keyword: "オロポ サウナ",
  },
  {
    name: "チルコーラ",
    name_en: "Chill Cola",
    category: "ドリンク",
    description: "サウナ発のクラフトコーラ。天然スパイスとハーブが織りなす刺激と爽快感、サウナ後の新定番ドリンク。",
    desc_en: "A craft cola born from sauna culture. Natural spices and herbs deliver stimulation and refreshment — the new post-sauna standard.",
    keyword: "チルコーラ Chill Cola",
  },
  {
    name: "チル缶",
    name_en: "Chill Can",
    category: "ドリンク",
    description: "サウナドリンクブランドChillの缶タイプ。キンキンに冷やして水風呂後に一気飲み、至福のととのいタイム。",
    desc_en: "Canned version from sauna drink brand Chill. Ice-cold chug after the cold plunge for the ultimate relaxation moment.",
    keyword: "チル缶 Chill",
  },
  {
    name: "オロナミンC",
    name_en: "Oronamin C",
    category: "ドリンク",
    description: "ビタミンC配合の元気ハツラツドリンク。オロポの片割れとしても、単体でもサウナ後の定番。",
    desc_en: "Vitamin C-packed energy drink. Half of the Oro-Po combo and a post-sauna staple on its own.",
    keyword: "オロナミンC",
  },
  {
    name: "ポカリスエット",
    name_en: "Pocari Sweat",
    category: "ドリンク",
    description: "発汗で失われた水分・電解質を素早く補給。サウナ前後の水分補給の王道、医師も推奨する定番。",
    desc_en: "Rapidly replenishes fluids and electrolytes lost through sweating. The gold standard for sauna hydration, recommended by doctors.",
    keyword: "ポカリスエット",
  },
  {
    name: "デカビタC",
    name_en: "Dekavita C",
    category: "ドリンク",
    description: "ビタミンC・ローヤルゼリー配合の炭酸栄養ドリンク。サウナ後のシャキッとした爽快感が癖になる。",
    desc_en: "Carbonated nutrition drink with Vitamin C and royal jelly. The crisp refreshment after sauna becomes addictive.",
    keyword: "デカビタC",
  },
  {
    name: "VAAM",
    name_en: "VAAM",
    category: "ドリンク",
    description: "体脂肪を燃やすアミノ酸飲料。サウナ前に飲めば脂肪燃焼効率アップ、フィットネスサウナーの相棒。",
    desc_en: "Amino acid drink that burns body fat. Drink before sauna for enhanced fat burning — the fitness sauna lover's companion.",
    keyword: "VAAM ヴァーム",
  },
  {
    name: "OS-1",
    name_en: "OS-1",
    category: "ドリンク",
    description: "医療現場でも使われる経口補水液。大量発汗後の電解質バランスを最速で回復、サウナの安全装置。",
    desc_en: "Oral rehydration solution used in medical settings. Fastest electrolyte recovery after heavy sweating — your sauna safety net.",
    keyword: "OS-1 経口補水液",
  },
  {
    name: "イオンウォーター",
    name_en: "ION Water",
    category: "ドリンク",
    description: "カロリー控えめなのに電解質しっかり補給。サウナ前後の水分チャージはこれ一択。",
    desc_en: "Low calorie yet full electrolyte replenishment. The one and only choice for pre and post-sauna hydration.",
    keyword: "イオンウォーター",
  },
  {
    name: "ヤクルト1000",
    name_en: "Yakult 1000",
    category: "ドリンク",
    description: "乳酸菌シロタ株1000億個の腸活パワー。サウナ×ヤクルト1000で、ととのいの先へ。",
    desc_en: "100 billion Shirota strain probiotics for gut health. Sauna x Yakult 1000 — beyond the perfect state.",
    keyword: "ヤクルト1000",
  },
  // サウナ本・漫画
  {
    name: "サ道 タナカカツキ",
    name_en: "Sa-Do by Tanaka Katsuki",
    category: "サウナ本・漫画",
    description: "サウナブームはここから始まった。読めばサウナの見え方が180度変わる、全サウナーのバイブル。",
    desc_en: "Where the sauna boom began. Read it and your view of sauna changes 180 degrees — the bible for all sauna lovers.",
    keyword: "サ道 タナカカツキ",
  },
  {
    name: "マンガ サ道 タナカカツキ",
    name_en: "Manga Sa-Do by Tanaka Katsuki",
    category: "サウナ本・漫画",
    description: "ドラマ化もされた大人気コミック。笑えて、学べて、サウナに行きたくなる。未読は損。",
    desc_en: "The mega-hit comic adapted into a TV drama. Funny, educational, and makes you want to hit the sauna. Don't miss it.",
    keyword: "マンガ サ道",
  },
  {
    name: "サウナの教科書",
    name_en: "The Sauna Textbook",
    category: "サウナ本・漫画",
    description: "「なぜととのうのか？」を科学で解き明かす一冊。正しい入り方を知れば、効果が倍になる。",
    desc_en: "A book that scientifically explains the sauna experience. Learn the proper technique and double the benefits.",
  },
  {
    name: "人生を変えるサウナ術",
    name_en: "Life-Changing Sauna Techniques",
    category: "サウナ本・漫画",
    description: "仕事の生産性を上げたいならサウナへ。ビジネスパーソン必読、サウナ×パフォーマンスの決定版。",
    desc_en: "Want to boost productivity? Head to the sauna. Essential reading for professionals — the definitive guide to sauna x performance.",
  },
  // サウナグッズ
  {
    name: "サウナウォッチ",
    name_en: "Sauna Watch",
    category: "サウナグッズ",
    description: "耐熱・防水の12分計。時間を気にせず蒸されていた日々にサヨナラ。最適なセッション管理を。",
    desc_en: "Heat-resistant, waterproof 12-minute timer. Say goodbye to guessing — manage your sessions perfectly.",
  },
  {
    name: "サウナメガネ曇り止め",
    name_en: "Sauna Glasses Anti-Fog Spray",
    category: "サウナグッズ",
    description: "塗るだけでサウナ室の視界クリア。メガネ勢の「何も見えない」問題、これで完全解決。",
    desc_en: "Just apply for clear vision in the sauna room. The \"I can't see anything\" problem for glasses wearers — completely solved.",
  },
  {
    name: "ヴィヒタ 白樺の束",
    name_en: "Vihta Birch Bundle",
    category: "サウナグッズ",
    description: "フィンランド直伝、白樺の若枝で身体を叩けば血行促進＆リラックス。本物のサウナ体験がここに。",
    desc_en: "Straight from Finland — whisk young birch branches on your body for circulation and relaxation. The authentic sauna experience.",
    keyword: "ヴィヒタ 白樺",
  },
  {
    name: "サウナ用メガネ 曇らない",
    name_en: "Anti-Fog Sauna Glasses",
    category: "サウナグッズ",
    description: "高温多湿のサウナ室でもレンズが曇らない専用設計。メガネ派サウナーの視界を完全に守る必需品。",
    desc_en: "Specially designed lenses that won't fog in hot, humid sauna rooms. Essential gear that protects glasses wearers' vision.",
    keyword: "サウナメガネ 曇らない",
  },
  {
    name: "ととのいチェア",
    name_en: "Totonoi Chair",
    category: "サウナグッズ",
    description: "外気浴の快適さを極限まで追求した専用リクライニングチェア。自宅でもキャンプでもととのいが再現できる。",
    desc_en: "A reclining chair designed for the ultimate outdoor cooling comfort. Recreate that perfect feeling at home or while camping.",
    keyword: "ととのいチェア",
  },
  {
    name: "サウナストーン",
    name_en: "Sauna Stones",
    category: "サウナグッズ",
    description: "ロウリュの蒸気を均一に広げる天然サウナストーン。自宅サウナやテントサウナの心臓部。",
    desc_en: "Natural sauna stones that spread loyly steam evenly. The heart of your home sauna or tent sauna.",
    keyword: "サウナストーン",
  },
  {
    name: "サウナ用スキンケア",
    name_en: "Sauna Skincare Set",
    category: "サウナグッズ",
    description: "サウナ前後の肌をケアする専用スキンケアセット。大量発汗で開いた毛穴を整え、美肌効果を最大化。",
    desc_en: "Dedicated skincare set for before and after sauna. Refines pores opened by sweating and maximizes skin benefits.",
    keyword: "サウナ スキンケア",
  },
  {
    name: "防水イヤホン",
    name_en: "Waterproof Earbuds",
    category: "サウナグッズ",
    description: "IPX7以上の防水性能でサウナ室でも使える。好きな音楽やポッドキャストでととのい体験をアップグレード。",
    desc_en: "IPX7+ waterproof rating works even in sauna rooms. Upgrade your experience with your favorite music or podcasts.",
    keyword: "防水イヤホン サウナ",
  },
  {
    name: "ロウリュ用ハーブ",
    name_en: "Loyly Herb Blend",
    category: "サウナグッズ",
    description: "ストーンにかけるハーブブレンド。ユーカリ・白樺・ラベンダーの天然蒸気で、サウナ室が森になる。",
    desc_en: "Herb blend to pour on sauna stones. Eucalyptus, birch, and lavender natural steam turns your sauna into a forest.",
    keyword: "ロウリュ アロマ ハーブ",
  },
  {
    name: "サウナ室温度計",
    name_en: "Sauna Room Thermometer",
    category: "サウナグッズ",
    description: "120℃まで対応する耐熱仕様の温度計。自宅サウナやテントサウナの温度管理に必須のアイテム。",
    desc_en: "Heat-resistant thermometer rated up to 120°C. Essential for temperature management in your home or tent sauna.",
    keyword: "サウナ 温度計 耐熱",
  },
];

const categoryColors: Record<string, string> = {
  "サウナハット": "bg-green-500/20 text-green-300",
  "タオル": "bg-amber-500/20 text-amber-300",
  "サウナマット": "bg-orange-500/20 text-orange-300",
  "アロマオイル": "bg-emerald-500/20 text-emerald-300",
  "サウナポンチョ": "bg-blue-500/20 text-blue-300",
  "ドリンク": "bg-yellow-500/20 text-yellow-300",
  "サウナ本・漫画": "bg-purple-500/20 text-purple-300",
  "サウナグッズ": "bg-pink-500/20 text-pink-300",
};

const categoryGradients: Record<string, string> = {
  "サウナハット": "linear-gradient(135deg, #f97316 0%, #dc2626 100%)",
  "タオル": "linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)",
  "サウナマット": "linear-gradient(135deg, #f59e0b 0%, #b45309 100%)",
  "アロマオイル": "linear-gradient(135deg, #10b981 0%, #047857 100%)",
  "サウナポンチョ": "linear-gradient(135deg, #8b5cf6 0%, #5b21b6 100%)",
  "ドリンク": "linear-gradient(135deg, #eab308 0%, #a16207 100%)",
  "サウナ本・漫画": "linear-gradient(135deg, #ec4899 0%, #9d174d 100%)",
  "サウナグッズ": "linear-gradient(135deg, #06b6d4 0%, #0e7490 100%)",
};

function amazonUrl(keyword: string) {
  return `https://www.amazon.co.jp/s?k=${encodeURIComponent(keyword)}&tag=trustcheck-22`;
}

function rakutenUrl(keyword: string) {
  return `https://hb.afl.rakuten.co.jp/hgc/5225c217.0725d77e.5225c218.5705d87b/?pc=https://search.rakuten.co.jp/search/mall/${encodeURIComponent(keyword)}/`;
}

export default function GoodsPage() {
  const params = useParams();
  const lang = (params.lang as string) || "ja";
  const isEn = lang === "en";
  const [selectedCategory, setSelectedCategory] = useState("すべて");

  const filteredProducts =
    selectedCategory === "すべて"
      ? products
      : products.filter((p) => p.category === selectedCategory);

  const t = (ja: string, en: string) => (isEn ? en : ja);

  const displayCategory = (catJa: string) =>
    isEn ? (categoryEnMap[catJa] || catJa) : catJa;

  const quickSearchItems = isEn
    ? [
        { label: "Sauna Drinks", k: "サウナドリンク オロポ", id: "drink" },
        { label: "Sauna Ponchos", k: "サウナポンチョ", id: "poncho" },
        { label: "Imabari Towels", k: "サウナタオル 今治", id: "towel-imabari" },
        { label: "Sauna Watch", k: "サウナウォッチ 耐熱", id: "watch-heatproof" },
        { label: "Sauna Aroma", k: "サウナアロマ ロウリュ", id: "aroma-loyly" },
        { label: "Sauna Books", k: "サウナ 本", id: "book" },
      ]
    : [
        { label: "サウナドリンク", k: "サウナドリンク オロポ", id: "drink" },
        { label: "サウナポンチョ", k: "サウナポンチョ", id: "poncho" },
        { label: "サウナタオル(今治)", k: "サウナタオル 今治", id: "towel-imabari" },
        { label: "サウナウォッチ(耐熱)", k: "サウナウォッチ 耐熱", id: "watch-heatproof" },
        { label: "サウナアロマ(ロウリュ)", k: "サウナアロマ ロウリュ", id: "aroma-loyly" },
        { label: "サウナ本・雑誌", k: "サウナ 本", id: "book" },
      ];

  return (
    <main
      className="min-h-screen text-white"
      style={{
        background:
          "linear-gradient(180deg, #0a1a0a 0%, #152d15 30%, #0a1a0a 100%)",
      }}
    >
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Back link */}
        <Link
          href={`/${lang}`}
          className="inline-flex items-center text-green-300 hover:text-green-200 transition-colors mb-8"
        >
          <svg
            className="w-4 h-4 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          {t("トップに戻る", "Back to Home")}
        </Link>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-5xl font-bold mb-3">
            {t("サウナグッズ", "Sauna Goods")}
          </h1>
          <p className="text-green-200/70 text-lg">
            {isEn
              ? `${products.length} essential items to enhance your sauna experience`
              : `サウナをもっと楽しむためのおすすめアイテム${products.length}選`}
          </p>
        </div>

        {/* Quick Amazon search shortcuts */}
        <div
          className="rounded-2xl p-5 mb-8"
          style={{
            background: "linear-gradient(160deg, rgba(217,119,6,0.18) 0%, rgba(217,119,6,0.05) 100%)",
            border: "1px solid rgba(217,119,6,0.3)",
          }}
        >
          <h2 className="text-lg font-bold text-amber-300 mb-3">
            {t("🔥 人気カテゴリで検索", "🔥 Search popular categories")}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {quickSearchItems.map((item) => (
              <a
                key={item.id}
                href={`https://www.amazon.co.jp/s?tag=trustcheck-22&k=${encodeURIComponent(item.k)}`}
                target="_blank"
                rel="nofollow sponsored noopener noreferrer"
                onClick={() => {
                  try {
                    fetch("/api/affiliate/click", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        product_id: item.id,
                        keyword: item.k,
                        source: "goods-shortcut",
                      }),
                      keepalive: true,
                    }).catch(() => {});
                  } catch {}
                }}
                className="flex items-center justify-center text-center text-sm font-medium text-white bg-[#ff9900] hover:bg-[#e68a00] rounded-lg py-3 min-h-[48px] transition-colors"
              >
                {item.label}
              </a>
            ))}
          </div>
          <p className="text-xs text-white/40 mt-3">
            {t(
              "※ Amazonアソシエイト・プログラムによるリンクです",
              "* Links are part of Amazon Associates program"
            )}
          </p>
        </div>

        {/* Category filter */}
        <div className="mb-8 -mx-4 px-4 overflow-x-auto scrollbar-hide">
          <div className="flex gap-2 pb-2 min-w-max">
            {categoriesJa.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? "bg-green-600 text-white"
                    : "bg-green-900/50 text-green-200 hover:bg-green-800/50"
                }`}
              >
                {displayCategory(cat)}
              </button>
            ))}
          </div>
        </div>

        {/* Products grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProducts.map((product, idx) => (
            <div
              key={idx}
              className="rounded-xl overflow-hidden flex flex-col"
              style={{
                background: "linear-gradient(160deg, rgba(34,197,94,0.15) 0%, rgba(34,197,94,0.05) 50%, rgba(34,197,94,0.1) 100%)",
                border: "1px solid rgba(34,197,94,0.25)",
              }}
            >
              {/* Product image placeholder - category gradient with product name */}
              <div
                className="aspect-[16/9] w-full flex items-center justify-center p-4"
                style={{ background: categoryGradients[product.category] || "linear-gradient(135deg, #64748b 0%, #334155 100%)" }}
              >
                <span
                  className="text-white text-xl sm:text-2xl font-bold text-center drop-shadow-lg"
                  style={{ textShadow: "0 2px 4px rgba(0,0,0,0.5)" }}
                >
                  {isEn ? product.name_en : product.name}
                </span>
              </div>
              <div className="p-5 flex flex-col flex-1">
                <div className="mb-3">
                  <span
                    className={`inline-block text-xs px-2 py-1 rounded-full ${categoryColors[product.category] || "bg-white/10 text-white/70"}`}
                  >
                    {displayCategory(product.category)}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">
                  {isEn ? product.name_en : product.name}
                </h3>
                <p className="text-white/60 text-sm mb-4 flex-1">
                  {isEn ? product.desc_en : product.description}
                </p>
                <div className="flex gap-2">
                  <a
                    href={amazonUrl(product.keyword || product.name)}
                    target="_blank"
                    rel="nofollow sponsored noopener noreferrer"
                    className="flex-1 text-center bg-[#ff9900] text-white font-bold py-2.5 rounded-lg text-sm min-h-[44px] flex items-center justify-center hover:bg-[#e68a00] transition-colors"
                  >
                    {t("Amazonで見る", "View on Amazon")}
                  </a>
                  <a
                    href={rakutenUrl(product.keyword || product.name)}
                    target="_blank"
                    rel="nofollow sponsored noopener noreferrer"
                    className="flex-1 text-center bg-red-600 text-white font-bold py-2.5 rounded-lg text-sm min-h-[44px] flex items-center justify-center hover:bg-red-700 transition-colors"
                  >
                    {t("楽天で見る", "View on Rakuten")}
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center mt-12">
          <Link
            href={`/${lang}`}
            className="text-green-300 hover:text-green-200 transition-colors"
          >
            {t("トップに戻る", "Back to Home")}
          </Link>
        </div>
      </div>
    </main>
  );
}
