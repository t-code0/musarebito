"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

type Product = {
  name: string;
  category: string;
  description: string;
  /** Amazon search keyword (overrides name for URL). */
  keyword?: string;
};

const categories = [
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

const products: Product[] = [
  // サウナハット
  { name: "TOYOKOサウナハット", category: "サウナハット", description: "国産ウールの断熱力で、110℃のサウナ室でも頭皮は別世界。深めデザインで耳まで守る、本気サウナーの定番。" },
  { name: "今治タオルサウナハット", category: "サウナハット", description: "プロサウナーの9割が愛用する今治タオル製。頭皮を灼熱から守る、サウナ室の相棒。" },
  { name: "MORZHサウナハット", category: "サウナハット", description: "ロシアの極寒で鍛えられた老舗ブランドのフェルト製。本場の重厚感と断熱性能、格が違う。" },
  { name: "ウールサウナハット", category: "サウナハット", description: "天然ウール100%、熱を通さない鉄壁ガード。セッション終盤まで頭がクリアなまま攻められる。" },
  { name: "リネンサウナハット", category: "サウナハット", description: "わずか33gの超軽量。持ち運びゼロストレスで、毎日のサ活に必携の一枚。" },
  // タオル
  { name: "今治サウナタオル", category: "タオル", description: "一度使えば他に戻れない吸水力。汗を瞬時に吸い取り、外気浴の快適度が段違いに変わる。" },
  { name: "MOKUタオル", category: "タオル", description: "サウナーの間で「神タオル」と呼ばれる薄手軽量の名品。かさばらず、乾きも早い。毎日持ち歩ける相棒。" },
  { name: "サウナマット大判", category: "タオル", description: "ベンチに敷けば自分だけの聖域。大判サイズで衛生的、ストレスフリーなサウナ体験を約束。" },
  { name: "速乾サウナタオル", category: "タオル", description: "マイクロファイバーの驚異的速乾力。使った30分後にはもうカラカラ。連続サ活の強い味方。" },
  // サウナマット
  { name: "折りたたみサウナマット", category: "サウナマット", description: "ポケットに入るコンパクトさなのに、座った瞬間の断熱感に驚く。マイサウナマット入門に最適。" },
  { name: "携帯用サウナマット", category: "サウナマット", description: "カラビナでバッグにぶら下げるだけ。忘れ物ゼロ、どこでもマイマットでサウナを楽しめる。" },
  { name: "防水サウナマット", category: "サウナマット", description: "汗を一切通さない防水加工。サッと拭くだけで清潔、潔癖サウナーの救世主。" },
  // アロマオイル
  { name: "ユーカリ精油", category: "アロマオイル", description: "ロウリュに数滴垂らせば、蒸気が清涼感に変わる。鼻が通り、呼吸が深くなり、ととのいが加速。" },
  { name: "白樺精油", category: "アロマオイル", description: "一滴でフィンランドの森に飛べる。ウッディで爽やかな香りが、自宅サウナを本場に変える。" },
  { name: "ヴィヒタエッセンス", category: "アロマオイル", description: "白樺ヴィヒタの香りを凝縮。お風呂に入れるだけで、湯船がフィンランドのレイクサイドになる。" },
  { name: "ロウリュ用アロマウォーター", category: "アロマオイル", description: "ストーンにそのままかけるだけ。ハーブブレンドの蒸気が広がり、サウナ室が天国に変わる瞬間。" },
  // サウナポンチョ
  { name: "サウナポンチョ フリーサイズ", category: "サウナポンチョ", description: "外気浴の「あと一歩」を埋める最終兵器。さっと羽織れば冷えを防ぎ、ととのいが持続する。", keyword: "サウナポンチョ フリーサイズ" },
  { name: "マイクロファイバーポンチョ", category: "サウナポンチョ", description: "驚きの軽さと速乾性。畳めばペットボトルサイズ、テントサウナ遠征のお供に。" },
  { name: "今治ポンチョ", category: "サウナポンチョ", description: "今治タオルの肌触りで全身を包む贅沢。吸水力も最高峰、外気浴が至福の時間になる。" },
  // ドリンク
  { name: "オロポ", category: "ドリンク", description: "オロナミンC×ポカリスエット。サウナ後の至福の一杯、通称オロポ。これを飲むためにサウナに行く人、続出中。", keyword: "オロポ サウナ" },
  { name: "チルコーラ", category: "ドリンク", description: "サウナ発のクラフトコーラ。天然スパイスとハーブが織りなす刺激と爽快感、サウナ後の新定番ドリンク。", keyword: "チルコーラ Chill Cola" },
  { name: "チル缶", category: "ドリンク", description: "サウナドリンクブランドChillの缶タイプ。キンキンに冷やして水風呂後に一気飲み、至福のととのいタイム。", keyword: "チル缶 Chill" },
  { name: "オロナミンC", category: "ドリンク", description: "ビタミンC配合の元気ハツラツドリンク。オロポの片割れとしても、単体でもサウナ後の定番。", keyword: "オロナミンC" },
  { name: "ポカリスエット", category: "ドリンク", description: "発汗で失われた水分・電解質を素早く補給。サウナ前後の水分補給の王道、医師も推奨する定番。", keyword: "ポカリスエット" },
  { name: "デカビタC", category: "ドリンク", description: "ビタミンC・ローヤルゼリー配合の炭酸栄養ドリンク。サウナ後のシャキッとした爽快感が癖になる。", keyword: "デカビタC" },
  { name: "VAAM", category: "ドリンク", description: "体脂肪を燃やすアミノ酸飲料。サウナ前に飲めば脂肪燃焼効率アップ、フィットネスサウナーの相棒。", keyword: "VAAM ヴァーム" },
  { name: "OS-1", category: "ドリンク", description: "医療現場でも使われる経口補水液。大量発汗後の電解質バランスを最速で回復、サウナの安全装置。", keyword: "OS-1 経口補水液" },
  { name: "イオンウォーター", category: "ドリンク", description: "カロリー控えめなのに電解質しっかり補給。サウナ前後の水分チャージはこれ一択。", keyword: "イオンウォーター" },
  { name: "ヤクルト1000", category: "ドリンク", description: "乳酸菌シロタ株1000億個の腸活パワー。サウナ×ヤクルト1000で、ととのいの先へ。", keyword: "ヤクルト1000" },
  // サウナ本・漫画
  { name: "サ道 タナカカツキ", category: "サウナ本・漫画", description: "サウナブームはここから始まった。読めばサウナの見え方が180度変わる、全サウナーのバイブル。", keyword: "サ道 タナカカツキ" },
  { name: "マンガ サ道 タナカカツキ", category: "サウナ本・漫画", description: "ドラマ化もされた大人気コミック。笑えて、学べて、サウナに行きたくなる。未読は損。", keyword: "マンガ サ道" },
  { name: "サウナの教科書", category: "サウナ本・漫画", description: "「なぜととのうのか？」を科学で解き明かす一冊。正しい入り方を知れば、効果が倍になる。" },
  { name: "人生を変えるサウナ術", category: "サウナ本・漫画", description: "仕事の生産性を上げたいならサウナへ。ビジネスパーソン必読、サウナ×パフォーマンスの決定版。" },
  // サウナグッズ
  { name: "サウナウォッチ", category: "サウナグッズ", description: "耐熱・防水の12分計。時間を気にせず蒸されていた日々にサヨナラ。最適なセッション管理を。" },
  { name: "サウナメガネ曇り止め", category: "サウナグッズ", description: "塗るだけでサウナ室の視界クリア。メガネ勢の「何も見えない」問題、これで完全解決。" },
  { name: "ヴィヒタ 白樺の束", category: "サウナグッズ", description: "フィンランド直伝、白樺の若枝で身体を叩けば血行促進＆リラックス。本物のサウナ体験がここに。", keyword: "ヴィヒタ 白樺" },
  { name: "サウナ用メガネ 曇らない", category: "サウナグッズ", description: "高温多湿のサウナ室でもレンズが曇らない専用設計。メガネ派サウナーの視界を完全に守る必需品。", keyword: "サウナメガネ 曇らない" },
  { name: "ととのいチェア", category: "サウナグッズ", description: "外気浴の快適さを極限まで追求した専用リクライニングチェア。自宅でもキャンプでもととのいが再現できる。", keyword: "ととのいチェア" },
  { name: "サウナストーン", category: "サウナグッズ", description: "ロウリュの蒸気を均一に広げる天然サウナストーン。自宅サウナやテントサウナの心臓部。", keyword: "サウナストーン" },
  { name: "サウナ用スキンケア", category: "サウナグッズ", description: "サウナ前後の肌をケアする専用スキンケアセット。大量発汗で開いた毛穴を整え、美肌効果を最大化。", keyword: "サウナ スキンケア" },
  { name: "防水イヤホン", category: "サウナグッズ", description: "IPX7以上の防水性能でサウナ室でも使える。好きな音楽やポッドキャストでととのい体験をアップグレード。", keyword: "防水イヤホン サウナ" },
  { name: "ロウリュ用ハーブ", category: "サウナグッズ", description: "ストーンにかけるハーブブレンド。ユーカリ・白樺・ラベンダーの天然蒸気で、サウナ室が森になる。", keyword: "ロウリュ アロマ ハーブ" },
  { name: "サウナ室温度計", category: "サウナグッズ", description: "120℃まで対応する耐熱仕様の温度計。自宅サウナやテントサウナの温度管理に必須のアイテム。", keyword: "サウナ 温度計 耐熱" },
];

const categoryColors: Record<string, string> = {
  サウナハット: "bg-green-500/20 text-green-300",
  タオル: "bg-amber-500/20 text-amber-300",
  サウナマット: "bg-orange-500/20 text-orange-300",
  アロマオイル: "bg-emerald-500/20 text-emerald-300",
  サウナポンチョ: "bg-blue-500/20 text-blue-300",
  ドリンク: "bg-yellow-500/20 text-yellow-300",
  "サウナ本・漫画": "bg-purple-500/20 text-purple-300",
  サウナグッズ: "bg-pink-500/20 text-pink-300",
};

const categoryGradients: Record<string, string> = {
  サウナハット: "linear-gradient(135deg, #f97316 0%, #dc2626 100%)",
  タオル: "linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)",
  サウナマット: "linear-gradient(135deg, #f59e0b 0%, #b45309 100%)",
  アロマオイル: "linear-gradient(135deg, #10b981 0%, #047857 100%)",
  サウナポンチョ: "linear-gradient(135deg, #8b5cf6 0%, #5b21b6 100%)",
  ドリンク: "linear-gradient(135deg, #eab308 0%, #a16207 100%)",
  "サウナ本・漫画": "linear-gradient(135deg, #ec4899 0%, #9d174d 100%)",
  サウナグッズ: "linear-gradient(135deg, #06b6d4 0%, #0e7490 100%)",
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
  const [selectedCategory, setSelectedCategory] = useState("すべて");

  const filteredProducts =
    selectedCategory === "すべて"
      ? products
      : products.filter((p) => p.category === selectedCategory);

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
          トップに戻る
        </Link>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-5xl font-bold mb-3">
            サウナグッズ
          </h1>
          <p className="text-green-200/70 text-lg">
            サウナをもっと楽しむためのおすすめアイテム{products.length}選
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
            🔥 人気カテゴリで検索
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {[
              { label: "サウナドリンク", k: "サウナドリンク オロポ", id: "drink" },
              { label: "サウナポンチョ", k: "サウナポンチョ", id: "poncho" },
              { label: "サウナタオル(今治)", k: "サウナタオル 今治", id: "towel-imabari" },
              { label: "サウナウォッチ(耐熱)", k: "サウナウォッチ 耐熱", id: "watch-heatproof" },
              { label: "サウナアロマ(ロウリュ)", k: "サウナアロマ ロウリュ", id: "aroma-loyly" },
              { label: "サウナ本・雑誌", k: "サウナ 本", id: "book" },
            ].map((item) => (
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
          <p className="text-xs text-white/40 mt-3">※ Amazonアソシエイト・プログラムによるリンクです</p>
        </div>

        {/* Category filter */}
        <div className="mb-8 -mx-4 px-4 overflow-x-auto scrollbar-hide">
          <div className="flex gap-2 pb-2 min-w-max">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? "bg-green-600 text-white"
                    : "bg-green-900/50 text-green-200 hover:bg-green-800/50"
                }`}
              >
                {cat}
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
                  {product.name}
                </span>
              </div>
              <div className="p-5 flex flex-col flex-1">
                <div className="mb-3">
                  <span
                    className={`inline-block text-xs px-2 py-1 rounded-full ${categoryColors[product.category] || "bg-white/10 text-white/70"}`}
                  >
                    {product.category}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">
                  {product.name}
                </h3>
                <p className="text-white/60 text-sm mb-4 flex-1">
                  {product.description}
                </p>
                <div className="flex gap-2">
                  <a
                    href={amazonUrl(product.keyword || product.name)}
                    target="_blank"
                    rel="nofollow sponsored noopener noreferrer"
                    className="flex-1 text-center bg-[#ff9900] text-white font-bold py-2.5 rounded-lg text-sm min-h-[44px] flex items-center justify-center hover:bg-[#e68a00] transition-colors"
                  >
                    Amazonで見る
                  </a>
                  <a
                    href={rakutenUrl(product.keyword || product.name)}
                    target="_blank"
                    rel="nofollow sponsored noopener noreferrer"
                    className="flex-1 text-center bg-red-600 text-white font-bold py-2.5 rounded-lg text-sm min-h-[44px] flex items-center justify-center hover:bg-red-700 transition-colors"
                  >
                    楽天で見る
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
            トップに戻る
          </Link>
        </div>
      </div>
    </main>
  );
}
