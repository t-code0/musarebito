"use client";

import { useParams } from "next/navigation";
import Link from "next/link";

const steps = [
  { num: 1, title: "水分補給", icon: "💧", desc: "サウナに入る前にコップ1〜2杯の水を飲みましょう。脱水を防ぐために、入浴前の水分補給は必須です。" },
  { num: 2, title: "体を洗う", icon: "🧼", desc: "マナーとして、サウナに入る前に体と頭をしっかり洗いましょう。汚れを落とすことで発汗もスムーズになります。" },
  { num: 3, title: "サウナ室へ", icon: "🔥", desc: "サウナ室に入り、自分のペースで6〜12分ほど過ごします。最初は下段から始めて、慣れたら上段へ。無理は禁物です。" },
  { num: 4, title: "水風呂", icon: "🧊", desc: "サウナを出たら、まず汗をかけ湯で流してから水風呂へ。30秒〜1分ほど浸かります。最初は足だけでもOKです。" },
  { num: 5, title: "外気浴", icon: "🌿", desc: "水風呂の後は、椅子に座って5〜10分ほど外気に当たります。ここが「ととのい」を感じる最も大切な時間です。" },
  { num: 6, title: "繰り返し", icon: "🔄", desc: "サウナ→水風呂→外気浴のサイクルを2〜3回繰り返します。回数を重ねるほど、深いととのいを体験できます。" },
];

const checklist = [
  { item: "タオル2枚", desc: "体用とサウナ室用。サウナマット代わりにも使えます。" },
  { item: "水・スポーツドリンク", desc: "脱水を防ぐため必須。500ml以上は用意しましょう。" },
  { item: "サウナハット", desc: "頭部を熱から守り、のぼせ防止に効果的。なくてもOK。" },
  { item: "サウナマット", desc: "衛生的にベンチに座るため。折りたたみ式が便利。" },
  { item: "着替え", desc: "サウナ後はさっぱりした服に着替えましょう。" },
  { item: "スキンケアグッズ", desc: "サウナ後の肌は乾燥しやすいので、保湿を忘れずに。" },
];

const manners = [
  { rule: "黙浴を心がける", desc: "サウナ室では静かに過ごすのがマナー。会話は控えめに。" },
  { rule: "タオルを絞ってから入る", desc: "サウナ室にビショビショのタオルを持ち込まない。水滴が蒸発して不快な蒸気になります。" },
  { rule: "場所取りをしない", desc: "タオルや荷物で席を確保するのはNG。譲り合いの精神で。" },
  { rule: "水風呂の前に汗を流す", desc: "かけ湯やシャワーで汗を流してから水風呂に入りましょう。これは最も重要なマナーです。" },
  { rule: "サウナ室のドアは素早く開閉", desc: "熱が逃げるので、ドアの開閉は最小限に素早く行いましょう。" },
];

const saunaTypes = [
  { name: "ドライサウナ", desc: "日本で最も一般的。高温（80〜110℃）・低湿度のサウナ。しっかり汗をかきたい人向け。" },
  { name: "スチームサウナ", desc: "蒸気で満たされた低温（40〜60℃）・高湿度のサウナ。肌にやさしく初心者向け。" },
  { name: "薬草サウナ", desc: "よもぎやドクダミなどの薬草の蒸気を浴びるサウナ。香りのリラックス効果も。" },
  { name: "フィンランド式サウナ", desc: "ロウリュ（蒸気）を楽しむ本場スタイル。70〜90℃の柔らかい熱が特徴。" },
  { name: "テントサウナ", desc: "アウトドアで楽しむ携帯式サウナ。川や湖に飛び込む水風呂が最高。" },
  { name: "バレルサウナ", desc: "樽型の木製サウナ。熱効率が良く、グランピング施設で増加中。" },
];

const faqs = [
  {
    q: "サウナは毎日入っても大丈夫？",
    a: "健康な方であれば週2〜3回が推奨されています。毎日入る場合は1セットにするなど、体への負担を調整しましょう。持病のある方は医師に相談してください。",
  },
  {
    q: "サウナに入る時間はどれくらい？",
    a: "一般的には6〜12分が目安です。初心者は5分程度から始めて、慣れてきたら時間を延ばしましょう。無理して長時間入るのは危険です。",
  },
  {
    q: "水風呂が苦手なのですが…",
    a: "最初は足だけ、膝まで、と段階的に慣らしていきましょう。水風呂に入らず、冷水シャワーを浴びるだけでも効果はあります。" ,
  },
  {
    q: "食事はサウナの前と後、どちらがいい？",
    a: "サウナの2時間前までに軽く食事を済ませるのがベスト。満腹状態でのサウナは体に負担がかかります。サウナ後の「サ飯」は格別です。",
  },
  {
    q: "サウナで「ととのう」コツは？",
    a: "サウナ→水風呂→外気浴のサイクルを丁寧に行うことが大切。特に外気浴では目を閉じて深呼吸し、体の感覚に集中しましょう。2〜3セット目で感じやすくなります。",
  },
];

export default function BeginnersPage() {
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
            サウナ初心者ガイド
          </h1>
          <p className="text-green-200/70 text-lg">
            はじめてのサウナを最高の体験に
          </p>
        </div>

        {/* Section 1: サウナとは？ */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <span className="text-green-400">♨</span> サウナとは？
          </h2>
          <div className="rounded-xl p-6" style={{ background: "linear-gradient(160deg, rgba(34,197,94,0.15) 0%, rgba(34,197,94,0.05) 50%, rgba(34,197,94,0.1) 100%)", border: "1px solid rgba(34,197,94,0.25)" }}>
            <p className="text-white/80 leading-relaxed">
              サウナは、高温の室内で体を温め、大量の汗をかく入浴法です。フィンランドが発祥の地とされ、2000年以上の歴史があります。日本では近年「サウナブーム」が到来し、心身をリフレッシュする健康法として幅広い世代に人気を集めています。サウナ→水風呂→外気浴のサイクルを繰り返すことで、「ととのう」と呼ばれる究極のリラックス状態を体験できます。
            </p>
          </div>
        </section>

        {/* Section 2: サウナの入り方 */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <span className="text-green-400">📋</span> サウナの入り方
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {steps.map((step) => (
              <div
                key={step.num}
                className="rounded-xl p-5 hover:scale-[1.01] transition-transform"
                style={{ background: "linear-gradient(160deg, rgba(34,197,94,0.15) 0%, rgba(34,197,94,0.05) 50%, rgba(34,197,94,0.1) 100%)", border: "1px solid rgba(34,197,94,0.25)" }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-green-500/30 text-green-300 flex items-center justify-center font-bold text-sm">
                    {step.num}
                  </span>
                  <span className="text-2xl">{step.icon}</span>
                  <h3 className="font-bold text-lg">{step.title}</h3>
                </div>
                <p className="text-white/70 text-sm leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Section 3: ととのうとは？ */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <span className="text-green-400">🧘</span> 「ととのう」とは？
          </h2>
          <div className="rounded-xl p-6" style={{ background: "linear-gradient(160deg, rgba(34,197,94,0.15) 0%, rgba(34,197,94,0.05) 50%, rgba(34,197,94,0.1) 100%)", border: "1px solid rgba(34,197,94,0.25)" }}>
            <p className="text-white/80 leading-relaxed mb-4">
              「ととのう」とは、サウナ→水風呂→外気浴のサイクルで到達する、心身が深くリラックスした状態のことです。
            </p>
            <p className="text-white/80 leading-relaxed mb-4">
              サウナの高温で交感神経が活発になり、水風呂の冷水でさらに交感神経が刺激されます。その後の外気浴で一気に副交感神経が優位になり、脳内にはエンドルフィンやセロトニンが分泌されます。この急激な切り替わりが、多幸感・浮遊感・深い安らぎをもたらすのが「ととのい」の正体です。
            </p>
            <p className="text-white/70 text-sm">
              ※ 個人差があり、最初の数回では感じにくいこともあります。焦らず、自分のペースでサウナを楽しみましょう。
            </p>
          </div>
        </section>

        {/* Section 4: 持ち物チェックリスト */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <span className="text-green-400">🎒</span> 持ち物チェックリスト
          </h2>
          <div className="rounded-xl p-6" style={{ background: "linear-gradient(160deg, rgba(34,197,94,0.15) 0%, rgba(34,197,94,0.05) 50%, rgba(34,197,94,0.1) 100%)", border: "1px solid rgba(34,197,94,0.25)" }}>
            <div className="space-y-3">
              {checklist.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded border-2 border-green-400/50 mt-0.5" />
                  <div>
                    <span className="font-bold text-white">{item.item}</span>
                    <p className="text-white/60 text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 5: マナーと注意事項 */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <span className="text-green-400">🙏</span> マナーと注意事項
          </h2>
          <div className="space-y-3">
            {manners.map((m, idx) => (
              <div
                key={idx}
                className="rounded-xl p-5"
                style={{ background: "linear-gradient(160deg, rgba(34,197,94,0.15) 0%, rgba(34,197,94,0.05) 50%, rgba(34,197,94,0.1) 100%)", border: "1px solid rgba(34,197,94,0.25)" }}
              >
                <h3 className="font-bold text-white mb-1">{m.rule}</h3>
                <p className="text-white/60 text-sm">{m.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Section 6: サウナの種類 */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <span className="text-green-400">🏠</span> サウナの種類
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {saunaTypes.map((t, idx) => (
              <div
                key={idx}
                className="rounded-xl p-5"
                style={{ background: "linear-gradient(160deg, rgba(34,197,94,0.15) 0%, rgba(34,197,94,0.05) 50%, rgba(34,197,94,0.1) 100%)", border: "1px solid rgba(34,197,94,0.25)" }}
              >
                <h3 className="font-bold text-white mb-2">{t.name}</h3>
                <p className="text-white/60 text-sm">{t.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Section 7: よくある質問 */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <span className="text-green-400">❓</span> よくある質問
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="rounded-xl p-5"
                style={{ background: "linear-gradient(160deg, rgba(34,197,94,0.15) 0%, rgba(34,197,94,0.05) 50%, rgba(34,197,94,0.1) 100%)", border: "1px solid rgba(34,197,94,0.25)" }}
              >
                <h3 className="font-bold text-white mb-2">Q. {faq.q}</h3>
                <p className="text-white/70 text-sm leading-relaxed">
                  A. {faq.a}
                </p>
              </div>
            ))}
          </div>
        </section>

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
