"use client";

import { useParams } from "next/navigation";
import Link from "next/link";

type Term = {
  term: string;
  reading: string;
  description: string;
};

const glossaryTerms: Term[] = [
  { term: "あまみ", reading: "あまみ", description: "サウナと水風呂を繰り返した後に皮膚に現れる赤と白のまだら模様。毛細血管の収縮・拡張によって起こる現象で、ととのいのサインとされる。" },
  { term: "アウフグース", reading: "あうふぐーす", description: "ドイツ発祥のサウナパフォーマンス。熱波師がサウナストーンに水やアロマ水をかけ、タオルで蒸気を仰いで体感温度を上げる。" },
  { term: "アロマロウリュ", reading: "あろまろうりゅ", description: "アロマオイルを混ぜた水をサウナストーンにかけるロウリュ。ユーカリやミント、白樺など様々な香りが楽しめる。" },
  { term: "イオンウォーター", reading: "いおんうぉーたー", description: "大塚製薬のポカリスエットの低カロリー版。サウナ後の水分・電解質補給に人気の飲料。" },
  { term: "インフィニティチェア", reading: "いんふぃにてぃちぇあ", description: "無段階リクライニングが可能なアウトドアチェア。外気浴で空を見上げながらととのうのに最適として、サウナーに大人気。" },
  { term: "ウィスキング", reading: "うぃすきんぐ", description: "白樺やオークの葉の束（ヴィヒタ）で体を叩いたり撫でたりするフィンランド伝統のサウナ施術。血行促進やリラックス効果がある。" },
  { term: "ヴィヒタ", reading: "ゔぃひた", description: "白樺の若枝を束ねたもの。フィンランドのサウナで体を叩いて使う伝統的な入浴用具で、芳香と血行促進効果がある。" },
  { term: "オートロウリュ", reading: "おーとろうりゅ", description: "タイマーや機械によって自動的にサウナストーンに水をかけるシステム。定期的に蒸気が発生し、一定の湿度を保つ。" },
  { term: "オロポ", reading: "おろぽ", description: "オロナミンCとポカリスエットを混ぜた飲み物。サウナ後のご褒美ドリンクとして定番。ビタミンと電解質を同時に補給できる。" },
  { term: "温冷交代浴", reading: "おんれいこうたいよく", description: "温かいサウナや風呂と冷たい水風呂を交互に入る入浴法。自律神経を整え、血行を促進する効果があるとされる。" },
  { term: "外気浴", reading: "がいきよく", description: "サウナと水風呂の後に外の空気に当たりながら休憩すること。ととのいを感じるための重要なステップ。" },
  { term: "岩盤浴", reading: "がんばんよく", description: "温めた天然石の上に横たわって体を温める入浴法。遠赤外線効果でじっくりと発汗を促す。サウナより低温で長時間利用できる。" },
  { term: "回数券", reading: "かいすうけん", description: "サウナ施設で複数回分の入場料を割引価格で購入できるチケット。常連サウナーの必需品。" },
  { term: "汗蒸幕", reading: "かんじゅうまく", description: "韓国式の伝統的なサウナ。ドーム型の窯の中で高温（80〜100℃）の熱気を浴びる。麻布をかぶって入るのが特徴。" },
  { term: "グルシン", reading: "ぐるしん", description: "水風呂の温度がシングル（10℃未満）よりさらに低いこと。一般的に5℃以下を指す。上級者向けの極冷水風呂。" },
  { term: "ケロサウナ", reading: "けろさうな", description: "フィンランドのケロ材（立ち枯れ木）で作られたサウナ。数百年かけて乾燥した木材は銀灰色で、独特の香りと最高級の雰囲気を持つ。" },
  { term: "サ活", reading: "さかつ", description: "サウナ活動の略。サウナに行くこと、またはサウナに関する活動全般を指すサウナー用語。" },
  { term: "サ飯", reading: "さめし", description: "サウナ後に食べるご飯のこと。サウナで代謝が上がった後の食事は格別に美味しく感じられる。" },
  { term: "サウナ室", reading: "さうなしつ", description: "サウナストーブが設置された高温の部屋。温度は80〜110℃程度が一般的。上段ほど高温になる。" },
  { term: "サウナー", reading: "さうなー", description: "サウナを愛好する人を指す俗称。定期的にサウナに通い、サウナの魅力を追求する人々。" },
  { term: "サウナストーン", reading: "さうなすとーん", description: "サウナストーブの上に置かれる耐熱性の石。ロウリュで水をかけると蒸気を発生させる。香花石やカンラン石が一般的。" },
  { term: "サウナハット", reading: "さうなはっと", description: "サウナ室でかぶる帽子。頭部を熱から守り、のぼせを防止する。フェルト製やタオル地が主流。" },
  { term: "サウナマット", reading: "さうなまっと", description: "サウナ室のベンチに敷いて座る個人用マット。衛生面と熱さ対策のために使用する。折りたたみ式が持ち運びに便利。" },
  { term: "下茹で", reading: "したゆで", description: "サウナに入る前に温かい湯船に浸かって体を温めておくこと。体が温まった状態でサウナに入ると発汗が早くなる。" },
  { term: "シングル", reading: "しんぐる", description: "水風呂の温度が一桁台（10℃未満）であること。キリッとした冷たさで、ととのい効果が高いとされる上級者向け。" },
  { term: "スチームサウナ", reading: "すちーむさうな", description: "蒸気で室内を満たすタイプのサウナ。温度は40〜60℃程度だが湿度が高い。肌への負担が少なく、初心者にも入りやすい。" },
  { term: "スモークサウナ", reading: "すもーくさうな", description: "フィンランド最古のサウナ形式。煙突のない部屋で薪を燃やして温め、煙を排出してから入る。柔らかい熱とスモーキーな香りが特徴。" },
  { term: "整う", reading: "ととのう", description: "サウナ→水風呂→外気浴のサイクルで得られる深いリラックス状態。副交感神経が優位になり、多幸感や瞑想的な感覚を味わえる。" },
  { term: "セルフロウリュ", reading: "せるふろうりゅ", description: "利用者が自分でサウナストーンに水をかけて蒸気を発生させるスタイル。好みのタイミングと量で湿度を調整できる。" },
  { term: "塩サウナ", reading: "しおさうな", description: "体に塩を塗ってから入るサウナ。汗で塩が溶け、古い角質を落とす効果がある。美肌効果が期待できる。" },
  { term: "チムジルバン", reading: "ちむじるばん", description: "韓国式の大型温浴施設。様々な温度の部屋やサウナ、岩盤浴などが楽しめる複合リラクゼーション施設。" },
  { term: "ととのう", reading: "ととのう", description: "サウナ→水風呂→外気浴のサイクルで到達する究極のリラックス状態。心身が調和し、深い恍惚感と多幸感に包まれる体験。" },
  { term: "テントサウナ", reading: "てんとさうな", description: "テント内にサウナストーブを設置した携帯式サウナ。キャンプ場や川辺など、自然の中でサウナを楽しめる。" },
  { term: "デッキチェア", reading: "でっきちぇあ", description: "外気浴スペースに設置されたリクライニングチェア。サウナと水風呂の後、横になってととのいを堪能する。" },
  { term: "ドイツ式", reading: "どいつしき", description: "アウフグースを中心としたドイツスタイルのサウナ文化。熱波師によるパフォーマンスが特徴で、イベント性が高い。" },
  { term: "導線", reading: "どうせん", description: "サウナ室→水風呂→外気浴への移動経路のこと。動線が短いほどスムーズにととのいやすく、施設の評価ポイントになる。" },
  { term: "ドライサウナ", reading: "どらいさうな", description: "湿度が低く高温（80〜110℃）のサウナ。日本の銭湯やスーパー銭湯で最も一般的なタイプ。" },
  { term: "寝転び湯", reading: "ねころびゆ", description: "浅い湯に寝転んで入る温浴設備。サウナ後の休憩として、温かい湯に包まれながらリラックスできる。" },
  { term: "熱波師", reading: "ねっぱし", description: "アウフグースを行う専門のスタッフ。大きなタオルを使って蒸気を客に送る技術を持つ。プロの熱波師による施術は大人気。" },
  { term: "羽衣", reading: "はごろも", description: "水風呂に浸かった際、体の周りにできる薄い温水の層。動かずにいると体温で温められた水が体を包み、冷たさが和らぐ。" },
  { term: "ハーバルサウナ", reading: "はーばるさうな", description: "ハーブや薬草を蒸気に混ぜて楽しむサウナ。タイのハーバルスチームが有名で、呼吸器やリラックス効果がある。" },
  { term: "バレルサウナ", reading: "ばれるさうな", description: "樽（バレル）型の木製サウナ。丸みを帯びた形状が熱効率に優れ、屋外に設置されることが多い。近年グランピング施設で人気。" },
  { term: "フィンランド式", reading: "ふぃんらんどしき", description: "本場フィンランドの伝統的なサウナスタイル。ロウリュで蒸気を発生させ、70〜90℃の柔らかな熱を楽しむ。ヴィヒタを使うことも。" },
  { term: "深さ", reading: "ふかさ", description: "水風呂の深さのこと。深い水風呂ほど全身をしっかり冷やすことができ、サウナーから高く評価される。" },
  { term: "不感温度", reading: "ふかんおんど", description: "体温に近い温度（35〜36℃程度）で、熱くも冷たくも感じない温度帯。不感温度の湯に浸かると深いリラックスが得られる。" },
  { term: "水風呂", reading: "みずぶろ", description: "サウナ後に入る冷水の浴槽。温度は15〜20℃が一般的。サウナで温まった体を急速に冷やし、ととのいへ導く重要な要素。" },
  { term: "水通し", reading: "みずとおし", description: "サウナに入る前に水風呂にさっと浸かること。体表面を冷やしておくことで、サウナ室での体感温度が上がる上級テクニック。" },
  { term: "ミストサウナ", reading: "みすとさうな", description: "細かい霧状の水滴で室内を満たすサウナ。温度40〜50℃程度で、肌にやさしく潤いを与える。自宅の浴室に設置できるタイプもある。" },
  { term: "休憩", reading: "やすけい", description: "サウナと水風呂の後に体を休める時間。椅子に座ったり横になったりして、ととのいを感じる最も重要なステップ。" },
  { term: "薬草サウナ", reading: "やくそうさうな", description: "よもぎやドクダミなどの薬草を蒸して、その蒸気を浴びるサウナ。和のハーバルサウナとして日本独自の発展を遂げている。" },
  { term: "ロウリュ", reading: "ろうりゅ", description: "フィンランド語で「蒸気」の意。サウナストーンに水をかけて蒸気を発生させ、体感温度と湿度を上げる行為。サウナの醍醐味。" },
];

// Sort by reading (あいうえお順)
const sortedTerms = [...glossaryTerms].sort((a, b) =>
  a.reading.localeCompare(b.reading, "ja")
);

export default function GlossaryPage() {
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
            サウナ用語集
          </h1>
          <p className="text-green-200/70 text-lg">
            サウナーなら知っておきたい{sortedTerms.length}の用語
          </p>
        </div>

        {/* Terms grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sortedTerms.map((item, idx) => (
            <div
              key={idx}
              className="rounded-xl p-5 hover:scale-[1.01] transition-transform"
              style={{
                background: "linear-gradient(160deg, rgba(34,197,94,0.15) 0%, rgba(34,197,94,0.05) 50%, rgba(34,197,94,0.1) 100%)",
                border: "1px solid rgba(34,197,94,0.25)",
              }}
            >
              <div className="flex items-baseline gap-3 mb-2">
                <h3 className="text-xl font-bold text-white">{item.term}</h3>
                <span className="text-sm text-green-300/70">{item.reading}</span>
              </div>
              <p className="text-white/70 text-sm leading-relaxed">
                {item.description}
              </p>
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
