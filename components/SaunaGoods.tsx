"use client";

const TAG = "trustcheck-22";

const GOODS = [
  {
    id: "hat",
    emoji: "🎩",
    label: "サウナハット",
    desc: "熱から頭を守る必需品",
    keyword: "サウナハット",
  },
  {
    id: "mat",
    emoji: "🧘",
    label: "サウナマット",
    desc: "ベンチを快適にする折りたたみマット",
    keyword: "サウナマット",
  },
  {
    id: "totonoi",
    emoji: "🌀",
    label: "ととのいグッズ",
    desc: "ロウリュオイル・ヴィヒタ・タオルなど",
    keyword: "サウナグッズ",
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
  const handleClick = (productId: string, keyword: string) => {
    // Fire-and-forget click tracking. Failures must not block navigation.
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
      <h2 className="text-xl font-bold text-[#1B4332] mb-1">サウナグッズを探す</h2>
      <p className="text-xs text-gray-500 mb-4">
        ととのい体験を格上げするおすすめアイテム。Amazonで人気のサウナグッズを探せます。
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {GOODS.map((g) => (
          <a
            key={g.id}
            href={buildAmazonUrl(g.keyword)}
            target="_blank"
            rel="nofollow sponsored noopener noreferrer"
            onClick={() => handleClick(g.id, g.keyword)}
            className="border border-gray-200 rounded-lg p-4 flex flex-col items-center text-center hover:border-amber-400 hover:shadow transition"
          >
            <div className="text-3xl mb-2">{g.emoji}</div>
            <h3 className="font-bold text-sm text-[#1B4332] mb-1">{g.label}</h3>
            <p className="text-xs text-gray-500 mb-3 flex-1">{g.desc}</p>
            <span
              className="w-full text-center text-xs py-2 rounded-lg font-medium text-white"
              style={{ background: "#ff9900" }}
            >
              Amazonで探す
            </span>
          </a>
        ))}
      </div>
      <p className="text-[10px] text-gray-400 mt-3 text-center">
        ※ Amazonアソシエイト・プログラムによるリンクです
      </p>
    </section>
  );
}
