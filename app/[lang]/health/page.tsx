"use client";

import { useParams } from "next/navigation";
import Link from "next/link";

type HealthCategory = {
  title: string;
  icon: string;
  effects: string;
  study: string;
  authors: string;
  year: number;
  journal: string;
};

const healthCategories: HealthCategory[] = [
  {
    title: "心血管系",
    icon: "🫀",
    effects:
      "フィンランドの長期追跡研究により、サウナに頻繁に入る人は心血管疾患による死亡リスクが大幅に低下することが明らかになりました。週に4〜7回サウナに入る人は、週1回の人と比較して、心臓突然死のリスクが63%低下しました。サウナによる体温上昇は血管を拡張させ、血圧を低下させる効果があり、定期的な利用は心臓の健康維持に寄与すると考えられています。",
    study: "Association Between Sauna Bathing and Fatal Cardiovascular and All-Cause Mortality Events",
    authors: "Laukkanen T, Khan H, Zaccardi F, Laukkanen JA",
    year: 2015,
    journal: "JAMA Internal Medicine",
  },
  {
    title: "メンタルヘルス",
    icon: "🧠",
    effects:
      "サウナの定期的な利用は、精神的な健康にも良い影響を与えることが研究で示されています。フィンランドの大規模コホート研究では、サウナの頻繁な利用が精神病性障害のリスク低下と関連していることが報告されました。熱ストレスによるエンドルフィンの分泌促進や、リラクゼーション効果が、精神的な安定に寄与すると考えられています。サウナ後の「ととのう」体験は、瞑想に近い心理的効果をもたらします。",
    study: "Sauna bathing and risk of psychotic disorders",
    authors: "Laukkanen T, Laukkanen JA, Kunutsor SK",
    year: 2018,
    journal: "Medical Principles and Practice",
  },
  {
    title: "免疫力",
    icon: "🛡️",
    effects:
      "サウナによる熱ストレスは、免疫系の活性化を促すことが研究で確認されています。サウナ入浴後、白血球数が有意に増加し、特にリンパ球やナチュラルキラー細胞の活性が高まることが報告されています。定期的なサウナ利用は、風邪やインフルエンザにかかるリスクの低下と関連しており、体の防御機能を高める自然な方法として注目されています。",
    study: "Effect of regular sauna on epidermal barrier function and stratum corneum water-holding capacity in vivo in humans",
    authors: "Pilch W, Pokora I, Szyguła Z, et al.",
    year: 2013,
    journal: "Annals of Dermatology",
  },
  {
    title: "睡眠の質",
    icon: "😴",
    effects:
      "サウナ入浴は睡眠の質を改善する効果があることが複数の研究で示されています。就寝前のサウナ利用は、深い睡眠（徐波睡眠）の時間を増加させ、入眠までの時間を短縮します。体温の一時的な上昇とその後の低下が、自然な眠気を誘発するメカニズムとして働きます。不眠に悩む方にとって、薬に頼らない自然なアプローチとして効果が期待できます。",
    study: "A Hot Topic for Health: Results of the Global Sauna Survey",
    authors: "Hussain J, Cohen M",
    year: 2018,
    journal: "Complementary Therapies in Medicine",
  },
  {
    title: "美肌・デトックス",
    icon: "✨",
    effects:
      "サウナでの発汗は、体内に蓄積された重金属や化学物質の排出を促進することが研究で確認されています。汗を通じて鉛、カドミウム、ヒ素、水銀などの有害物質が排出されることが報告されており、現代社会における環境毒素への対策として注目されています。また、大量の発汗は毛穴の洗浄効果があり、肌のターンオーバーを促進して美肌効果も期待できます。",
    study: "Arsenic, Cadmium, Lead, and Mercury in Sweat: A Systematic Review",
    authors: "Sears ME, Kerr KJ, Bray RI",
    year: 2012,
    journal: "Journal of Environmental and Public Health",
  },
];

export default function HealthPage() {
  const params = useParams();
  const lang = (params.lang as string) || "ja";

  return (
    <main
      className="min-h-screen text-white"
      style={{
        background:
          "linear-gradient(180deg, #0a1a0a 0%, #152d15 30%, #0a1a0a 100%)",
      }}
    >
      <div className="max-w-4xl mx-auto px-4 py-8">
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
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-5xl font-bold mb-3">
            サウナの健康効果
          </h1>
          <p className="text-green-200/70 text-lg">
            科学的研究に基づくサウナの健康メリット
          </p>
        </div>

        {/* Categories */}
        <div className="space-y-6">
          {healthCategories.map((cat, idx) => (
            <div
              key={idx}
              className="rounded-xl p-6"
              style={{
                background: "linear-gradient(160deg, rgba(34,197,94,0.15) 0%, rgba(34,197,94,0.05) 50%, rgba(34,197,94,0.1) 100%)",
                border: "1px solid rgba(34,197,94,0.25)",
              }}
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">{cat.icon}</span>
                <h2 className="text-2xl font-bold text-white">{cat.title}</h2>
              </div>
              <p className="text-white/80 leading-relaxed mb-5">
                {cat.effects}
              </p>
              <div className="bg-white/5 rounded-lg p-4 border border-green-500/20">
                <p className="text-sm text-green-300 font-semibold mb-1">
                  参考論文
                </p>
                <p className="text-sm text-white/70">
                  {cat.authors} ({cat.year}). &ldquo;{cat.study}&rdquo;.{" "}
                  <span className="italic text-green-200/60">{cat.journal}</span>
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Disclaimer */}
        <div className="mt-10 bg-green-900/20 border border-green-500/30 rounded-xl p-5 text-center">
          <p className="text-green-200/80 text-sm">
            ⚠️
            この情報は一般的な健康情報であり、医学的アドバイスではありません。健康上の懸念がある場合は、医療専門家にご相談ください。
          </p>
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
