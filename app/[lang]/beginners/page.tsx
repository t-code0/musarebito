"use client";

import { useParams } from "next/navigation";
import Link from "next/link";

const steps = [
  { num: 1, title: { ja: "水分補給", en: "Hydrate" }, icon: "💧", desc: { ja: "サウナに入る前にコップ1〜2杯の水を飲みましょう。脱水を防ぐために、入浴前の水分補給は必須です。", en: "Drink 1–2 glasses of water before entering. Staying hydrated before your session is essential to prevent dehydration." } },
  { num: 2, title: { ja: "体を洗う", en: "Wash your body" }, icon: "🧼", desc: { ja: "マナーとして、サウナに入る前に体と頭をしっかり洗いましょう。汚れを落とすことで発汗もスムーズになります。", en: "Shower thoroughly before the sauna. Washing off dirt and oils is good manners and helps you sweat more efficiently." } },
  { num: 3, title: { ja: "サウナ室へ", en: "Enter the sauna" }, icon: "🔥", desc: { ja: "サウナ室に入り、自分のペースで6〜12分ほど過ごします。最初は下段から始めて、慣れたら上段へ。無理は禁物です。", en: "Spend 6–12 minutes in the sauna at your own pace. Start on the lower bench where it's cooler, and move up as you get comfortable. Don't push yourself." } },
  { num: 4, title: { ja: "水風呂", en: "Cold bath" }, icon: "🧊", desc: { ja: "サウナを出たら、まず汗をかけ湯で流してから水風呂へ。30秒〜1分ほど浸かります。最初は足だけでもOKです。", en: "Rinse your sweat off first, then soak in the cold bath for 30 seconds to 1 minute. Starting with just your feet is perfectly fine." } },
  { num: 5, title: { ja: "外気浴", en: "Outdoor rest" }, icon: "🌿", desc: { ja: "水風呂の後は、椅子に座って5〜10分ほど外気に当たります。ここが「ととのい」を感じる最も大切な時間です。", en: "Sit outside for 5–10 minutes after the cold bath. This is where 'totonou' — the ultimate relaxation — happens." } },
  { num: 6, title: { ja: "繰り返し", en: "Repeat" }, icon: "🔄", desc: { ja: "サウナ→水風呂→外気浴のサイクルを2〜3回繰り返します。回数を重ねるほど、深いととのいを体験できます。", en: "Do 2–3 cycles of sauna → cold bath → outdoor rest for deeper relaxation. The more cycles, the deeper the experience." } },
];

const checklist = [
  { item: { ja: "タオル2枚", en: "2 towels" }, desc: { ja: "体用とサウナ室用。サウナマット代わりにも使えます。", en: "One for your body, one to sit on in the sauna bench." } },
  { item: { ja: "水・スポーツドリンク", en: "Water / sports drink" }, desc: { ja: "脱水を防ぐため必須。500ml以上は用意しましょう。", en: "Essential to prevent dehydration. Bring at least 500ml." } },
  { item: { ja: "サウナハット", en: "Sauna hat" }, desc: { ja: "頭部を熱から守り、のぼせ防止に効果的。なくてもOK。", en: "Protects your head from heat and prevents dizziness. Optional." } },
  { item: { ja: "サウナマット", en: "Sauna mat" }, desc: { ja: "衛生的にベンチに座るため。折りたたみ式が便利。", en: "A foldable mat for sitting on the bench hygienically." } },
  { item: { ja: "着替え", en: "Change of clothes" }, desc: { ja: "サウナ後はさっぱりした服に着替えましょう。", en: "Fresh clothes to change into after your sauna session." } },
  { item: { ja: "スキンケアグッズ", en: "Skincare" }, desc: { ja: "サウナ後の肌は乾燥しやすいので、保湿を忘れずに。", en: "Your skin dries out after sauna, so don't forget to moisturize." } },
];

const manners = [
  { rule: { ja: "黙浴を心がける", en: "Stay quiet" }, desc: { ja: "サウナ室では静かに過ごすのがマナー。会話は控えめに。", en: "Keep conversation to a minimum in the sauna room. Silence is the norm." } },
  { rule: { ja: "タオルを絞ってから入る", en: "Wring your towel" }, desc: { ja: "サウナ室にビショビショのタオルを持ち込まない。水滴が蒸発して不快な蒸気になります。", en: "Don't bring dripping towels into the sauna. Water droplets evaporate into unpleasant steam." } },
  { rule: { ja: "場所取りをしない", en: "Don't reserve seats" }, desc: { ja: "タオルや荷物で席を確保するのはNG。譲り合いの精神で。", en: "Don't save spots with towels or belongings. Share the space courteously." } },
  { rule: { ja: "水風呂の前に汗を流す", en: "Rinse before the cold bath" }, desc: { ja: "かけ湯やシャワーで汗を流してから水風呂に入りましょう。これは最も重要なマナーです。", en: "Rinse off your sweat before entering the cold bath. This is the most important rule." } },
  { rule: { ja: "サウナ室のドアは素早く開閉", en: "Open and close doors quickly" }, desc: { ja: "熱が逃げるので、ドアの開閉は最小限に素早く行いましょう。", en: "Minimize heat loss by opening and closing the sauna door as quickly as possible." } },
];

const saunaTypes = [
  { name: { ja: "ドライサウナ", en: "Dry Sauna" }, desc: { ja: "日本で最も一般的。高温（80〜110℃）・低湿度のサウナ。しっかり汗をかきたい人向け。", en: "The most common type in Japan. High temperature (80–110°C), low humidity. For those who want to sweat hard." } },
  { name: { ja: "スチームサウナ", en: "Steam Sauna" }, desc: { ja: "蒸気で満たされた低温（40〜60℃）・高湿度のサウナ。肌にやさしく初心者向け。", en: "Low temperature (40–60°C), high humidity. Gentle on the skin and great for beginners." } },
  { name: { ja: "薬草サウナ", en: "Medicinal Herb Sauna" }, desc: { ja: "よもぎやドクダミなどの薬草の蒸気を浴びるサウナ。香りのリラックス効果も。", en: "A Japanese herbal steam sauna using mugwort and other medicinal herbs. The aroma adds extra relaxation." } },
  { name: { ja: "フィンランド式サウナ", en: "Finnish Sauna" }, desc: { ja: "ロウリュ（蒸気）を楽しむ本場スタイル。70〜90℃の柔らかい熱が特徴。", en: "The traditional löyly style from Finland. Characterized by gentle heat at 70–90°C." } },
  { name: { ja: "テントサウナ", en: "Tent Sauna" }, desc: { ja: "アウトドアで楽しむ携帯式サウナ。川や湖に飛び込む水風呂が最高。", en: "A portable outdoor sauna. Nothing beats jumping into a river or lake for your cold bath." } },
  { name: { ja: "バレルサウナ", en: "Barrel Sauna" }, desc: { ja: "樽型の木製サウナ。熱効率が良く、グランピング施設で増加中。", en: "A barrel-shaped wooden sauna. Excellent heat efficiency, increasingly popular at glamping sites." } },
];

const faqs = [
  {
    q: { ja: "サウナは毎日入っても大丈夫？", en: "Is it okay to use the sauna every day?" },
    a: { ja: "健康な方であれば週2〜3回が推奨されています。毎日入る場合は1セットにするなど、体への負担を調整しましょう。持病のある方は医師に相談してください。", en: "For healthy individuals, 2–3 times per week is recommended. If you go daily, limit yourself to one cycle to reduce strain on your body. Consult a doctor if you have any medical conditions." },
  },
  {
    q: { ja: "サウナに入る時間はどれくらい？", en: "How long should I stay in the sauna?" },
    a: { ja: "一般的には6〜12分が目安です。初心者は5分程度から始めて、慣れてきたら時間を延ばしましょう。無理して長時間入るのは危険です。", en: "Generally 6–12 minutes is the standard. Beginners should start with about 5 minutes and gradually extend the time. Staying too long can be dangerous." },
  },
  {
    q: { ja: "水風呂が苦手なのですが…", en: "What if I can't handle the cold bath?" },
    a: { ja: "最初は足だけ、膝まで、と段階的に慣らしていきましょう。水風呂に入らず、冷水シャワーを浴びるだけでも効果はあります。", en: "Start gradually — first just your feet, then up to your knees. A cold shower instead of the cold bath also works well." },
  },
  {
    q: { ja: "食事はサウナの前と後、どちらがいい？", en: "Should I eat before or after the sauna?" },
    a: { ja: "サウナの2時間前までに軽く食事を済ませるのがベスト。満腹状態でのサウナは体に負担がかかります。サウナ後の「サ飯」は格別です。", en: "It's best to have a light meal at least 2 hours before. Using the sauna on a full stomach puts strain on your body. A post-sauna meal ('sa-meshi') is a special treat." },
  },
  {
    q: { ja: "サウナで「ととのう」コツは？", en: "Any tips for achieving 'totonou'?" },
    a: { ja: "サウナ→水風呂→外気浴のサイクルを丁寧に行うことが大切。特に外気浴では目を閉じて深呼吸し、体の感覚に集中しましょう。2〜3セット目で感じやすくなります。", en: "The key is to go through each sauna → cold bath → outdoor rest cycle mindfully. During outdoor rest, close your eyes, breathe deeply, and focus on how your body feels. It often kicks in during the 2nd or 3rd cycle." },
  },
];

export default function BeginnersPage() {
  const params = useParams();
  const lang = (params.lang as string) || "ja";
  const isEn = lang === "en";

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
          {isEn ? "Back to Home" : "トップに戻る"}
        </Link>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-5xl font-bold mb-3">
            {isEn ? "Beginner's Guide to Sauna" : "サウナ初心者ガイド"}
          </h1>
          <p className="text-green-200/70 text-lg">
            {isEn ? "Make your first sauna visit unforgettable" : "はじめてのサウナを最高の体験に"}
          </p>
        </div>

        {/* Section 1: サウナとは？ */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <span className="text-green-400">♨</span> {isEn ? "What is a Sauna?" : "サウナとは？"}
          </h2>
          <div className="rounded-xl p-6" style={{ background: "linear-gradient(160deg, rgba(34,197,94,0.15) 0%, rgba(34,197,94,0.05) 50%, rgba(34,197,94,0.1) 100%)", border: "1px solid rgba(34,197,94,0.25)" }}>
            <p className="text-white/80 leading-relaxed">
              {isEn
                ? "A sauna is a bathing method where you heat your body in a high-temperature room and sweat profusely. Originating in Finland over 2,000 years ago, saunas have recently surged in popularity in Japan as a wellness practice for all ages. By repeating the cycle of sauna → cold bath → outdoor rest, you can experience 'totonou' — the ultimate state of mind-body relaxation."
                : "サウナは、高温の室内で体を温め、大量の汗をかく入浴法です。フィンランドが発祥の地とされ、2000年以上の歴史があります。日本では近年「サウナブーム」が到来し、心身をリフレッシュする健康法として幅広い世代に人気を集めています。サウナ→水風呂→外気浴のサイクルを繰り返すことで、「ととのう」と呼ばれる究極のリラックス状態を体験できます。"}
            </p>
          </div>
        </section>

        {/* Section 2: サウナの入り方 */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <span className="text-green-400">📋</span> {isEn ? "How to Sauna: Step by Step" : "サウナの入り方"}
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
                  <h3 className="font-bold text-lg">{isEn ? step.title.en : step.title.ja}</h3>
                </div>
                <p className="text-white/70 text-sm leading-relaxed">
                  {isEn ? step.desc.en : step.desc.ja}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Section 3: ととのうとは？ */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <span className="text-green-400">🧘</span> {isEn ? "What is 'Totonou'?" : "「ととのう」とは？"}
          </h2>
          <div className="rounded-xl p-6" style={{ background: "linear-gradient(160deg, rgba(34,197,94,0.15) 0%, rgba(34,197,94,0.05) 50%, rgba(34,197,94,0.1) 100%)", border: "1px solid rgba(34,197,94,0.25)" }}>
            <p className="text-white/80 leading-relaxed mb-4">
              {isEn
                ? "'Totonou' is the state of deep mind-body relaxation reached through the sauna → cold bath → outdoor rest cycle."
                : "「ととのう」とは、サウナ→水風呂→外気浴のサイクルで到達する、心身が深くリラックスした状態のことです。"}
            </p>
            <p className="text-white/80 leading-relaxed mb-4">
              {isEn
                ? "The high heat of the sauna activates your sympathetic nervous system, and the cold water stimulates it even further. Then during outdoor rest, your parasympathetic nervous system takes over, and your brain releases endorphins and serotonin. This rapid switch is what produces the feelings of euphoria, weightlessness, and deep calm known as 'totonou'."
                : "サウナの高温で交感神経が活発になり、水風呂の冷水でさらに交感神経が刺激されます。その後の外気浴で一気に副交感神経が優位になり、脳内にはエンドルフィンやセロトニンが分泌されます。この急激な切り替わりが、多幸感・浮遊感・深い安らぎをもたらすのが「ととのい」の正体です。"}
            </p>
            <p className="text-white/70 text-sm">
              {isEn
                ? "* Results vary by individual, and you may not feel it during your first few visits. Take your time and enjoy the sauna at your own pace."
                : "※ 個人差があり、最初の数回では感じにくいこともあります。焦らず、自分のペースでサウナを楽しみましょう。"}
            </p>
          </div>
        </section>

        {/* Section 4: 持ち物チェックリスト */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <span className="text-green-400">🎒</span> {isEn ? "What to Bring: Checklist" : "持ち物チェックリスト"}
          </h2>
          <div className="rounded-xl p-6" style={{ background: "linear-gradient(160deg, rgba(34,197,94,0.15) 0%, rgba(34,197,94,0.05) 50%, rgba(34,197,94,0.1) 100%)", border: "1px solid rgba(34,197,94,0.25)" }}>
            <div className="space-y-3">
              {checklist.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded border-2 border-green-400/50 mt-0.5" />
                  <div>
                    <span className="font-bold text-white">{isEn ? item.item.en : item.item.ja}</span>
                    <p className="text-white/60 text-sm">{isEn ? item.desc.en : item.desc.ja}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 5: マナーと注意事項 */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <span className="text-green-400">🙏</span> {isEn ? "Etiquette & Rules" : "マナーと注意事項"}
          </h2>
          <div className="space-y-3">
            {manners.map((m, idx) => (
              <div
                key={idx}
                className="rounded-xl p-5"
                style={{ background: "linear-gradient(160deg, rgba(34,197,94,0.15) 0%, rgba(34,197,94,0.05) 50%, rgba(34,197,94,0.1) 100%)", border: "1px solid rgba(34,197,94,0.25)" }}
              >
                <h3 className="font-bold text-white mb-1">{isEn ? m.rule.en : m.rule.ja}</h3>
                <p className="text-white/60 text-sm">{isEn ? m.desc.en : m.desc.ja}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Section 6: サウナの種類 */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <span className="text-green-400">🏠</span> {isEn ? "Types of Sauna" : "サウナの種類"}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {saunaTypes.map((t, idx) => (
              <div
                key={idx}
                className="rounded-xl p-5"
                style={{ background: "linear-gradient(160deg, rgba(34,197,94,0.15) 0%, rgba(34,197,94,0.05) 50%, rgba(34,197,94,0.1) 100%)", border: "1px solid rgba(34,197,94,0.25)" }}
              >
                <h3 className="font-bold text-white mb-2">{isEn ? t.name.en : t.name.ja}</h3>
                <p className="text-white/60 text-sm">{isEn ? t.desc.en : t.desc.ja}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Section 7: よくある質問 */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <span className="text-green-400">❓</span> {isEn ? "FAQ" : "よくある質問"}
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="rounded-xl p-5"
                style={{ background: "linear-gradient(160deg, rgba(34,197,94,0.15) 0%, rgba(34,197,94,0.05) 50%, rgba(34,197,94,0.1) 100%)", border: "1px solid rgba(34,197,94,0.25)" }}
              >
                <h3 className="font-bold text-white mb-2">Q. {isEn ? faq.q.en : faq.q.ja}</h3>
                <p className="text-white/70 text-sm leading-relaxed">
                  A. {isEn ? faq.a.en : faq.a.ja}
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
            {isEn ? "Back to Home" : "トップに戻る"}
          </Link>
        </div>
      </div>
    </main>
  );
}
