"use client";

import { useParams } from "next/navigation";
import Link from "next/link";

type Term = {
  term_ja: string;
  term_en: string;
  reading: string;
  desc_ja: string;
  desc_en: string;
};

const glossaryTerms: Term[] = [
  { term_ja: "あまみ", term_en: "Amami", reading: "あまみ", desc_ja: "サウナと水風呂を繰り返した後に皮膚に現れる赤と白のまだら模様。毛細血管の収縮・拡張によって起こる現象で、ととのいのサインとされる。", desc_en: "Red-and-white mottled skin pattern from alternating sauna and cold bath. Caused by capillary contraction and dilation, considered a sign of totonou." },
  { term_ja: "アウフグース", term_en: "Aufguss", reading: "あうふぐーす", desc_ja: "ドイツ発祥のサウナパフォーマンス。熱波師がサウナストーンに水やアロマ水をかけ、タオルで蒸気を仰いで体感温度を上げる。", desc_en: "German sauna performance where a master (Aufgusser) pours water or aromatic water on sauna stones and fans the steam with a towel to raise the perceived temperature." },
  { term_ja: "アロマロウリュ", term_en: "Aroma Löyly", reading: "あろまろうりゅ", desc_ja: "アロマオイルを混ぜた水をサウナストーンにかけるロウリュ。ユーカリやミント、白樺など様々な香りが楽しめる。", desc_en: "Löyly using aromatic oil-infused water poured on sauna stones. Enjoy various scents like eucalyptus, mint, and birch." },
  { term_ja: "イオンウォーター", term_en: "Ion Water", reading: "いおんうぉーたー", desc_ja: "大塚製薬のポカリスエットの低カロリー版。サウナ後の水分・電解質補給に人気の飲料。", desc_en: "Low-calorie sports drink by Otsuka Pharmaceutical (Pocari Sweat variant). Popular for post-sauna hydration and electrolyte replenishment." },
  { term_ja: "インフィニティチェア", term_en: "Infinity Chair", reading: "いんふぃにてぃちぇあ", desc_ja: "無段階リクライニングが可能なアウトドアチェア。外気浴で空を見上げながらととのうのに最適として、サウナーに大人気。", desc_en: "Reclining outdoor chair with infinite angle adjustment. Hugely popular among saunners for gazing at the sky while achieving totonou during outdoor air bathing." },
  { term_ja: "ウィスキング", term_en: "Whisking", reading: "うぃすきんぐ", desc_ja: "白樺やオークの葉の束（ヴィヒタ）で体を叩いたり撫でたりするフィンランド伝統のサウナ施術。血行促進やリラックス効果がある。", desc_en: "Finnish tradition of sweeping the body with bundles of birch or oak branches (vihta). Promotes blood circulation and relaxation." },
  { term_ja: "ヴィヒタ", term_en: "Vihta", reading: "ゔぃひた", desc_ja: "白樺の若枝を束ねたもの。フィンランドのサウナで体を叩いて使う伝統的な入浴用具で、芳香と血行促進効果がある。", desc_en: "Bundle of young birch branches used in Finnish saunas to gently strike the body. Provides pleasant aroma and promotes blood circulation." },
  { term_ja: "オートロウリュ", term_en: "Auto-Löyly", reading: "おーとろうりゅ", desc_ja: "タイマーや機械によって自動的にサウナストーンに水をかけるシステム。定期的に蒸気が発生し、一定の湿度を保つ。", desc_en: "Automatic water-pouring system on sauna stones using a timer or machine. Generates steam at regular intervals to maintain consistent humidity." },
  { term_ja: "オロポ", term_en: "Oropo", reading: "おろぽ", desc_ja: "オロナミンCとポカリスエットを混ぜた飲み物。サウナ後のご褒美ドリンクとして定番。ビタミンと電解質を同時に補給できる。", desc_en: "Mix of Oronamin C and Pocari Sweat, the classic post-sauna reward drink. Replenishes both vitamins and electrolytes simultaneously." },
  { term_ja: "温冷交代浴", term_en: "Hot-Cold Alternating Bath", reading: "おんれいこうたいよく", desc_ja: "温かいサウナや風呂と冷たい水風呂を交互に入る入浴法。自律神経を整え、血行を促進する効果があるとされる。", desc_en: "Bathing method of alternating between hot sauna/bath and cold water plunge. Said to regulate the autonomic nervous system and promote blood circulation." },
  { term_ja: "外気浴", term_en: "Outdoor Air Bath (Gaikiyoku)", reading: "がいきよく", desc_ja: "サウナと水風呂の後に外の空気に当たりながら休憩すること。ととのいを感じるための重要なステップ。", desc_en: "Resting outdoors after sauna and cold bath, letting the open air cool your body. A crucial step for experiencing totonou." },
  { term_ja: "岩盤浴", term_en: "Bedrock Bath (Ganbanyoku)", reading: "がんばんよく", desc_ja: "温めた天然石の上に横たわって体を温める入浴法。遠赤外線効果でじっくりと発汗を促す。サウナより低温で長時間利用できる。", desc_en: "Lying on heated natural stones to warm the body. Uses far-infrared heat to promote gradual sweating. Lower temperature than sauna, suitable for extended sessions." },
  { term_ja: "回数券", term_en: "Multi-Visit Pass", reading: "かいすうけん", desc_ja: "サウナ施設で複数回分の入場料を割引価格で購入できるチケット。常連サウナーの必需品。", desc_en: "Discounted ticket book for purchasing multiple admissions at a sauna facility. An essential item for regular visitors." },
  { term_ja: "汗蒸幕", term_en: "Hanjeungmak", reading: "かんじゅうまく", desc_ja: "韓国式の伝統的なサウナ。ドーム型の窯の中で高温（80〜100℃）の熱気を浴びる。麻布をかぶって入るのが特徴。", desc_en: "Traditional Korean dome-style sauna. Bathers experience intense heat (80-100°C) inside a dome-shaped kiln, characteristically wearing hemp cloth." },
  { term_ja: "グルシン", term_en: "Gurushin", reading: "ぐるしん", desc_ja: "水風呂の温度がシングル（10℃未満）よりさらに低いこと。一般的に5℃以下を指す。上級者向けの極冷水風呂。", desc_en: "Water bath below 5°C — even colder than 'single' temperatures. An extreme cold plunge for advanced bathers only." },
  { term_ja: "ケロサウナ", term_en: "Kelo Sauna", reading: "けろさうな", desc_ja: "フィンランドのケロ材（立ち枯れ木）で作られたサウナ。数百年かけて乾燥した木材は銀灰色で、独特の香りと最高級の雰囲気を持つ。", desc_en: "Sauna built from century-old standing deadwood (kelo) from Finland. The silver-grey timber, dried over centuries, produces a unique aroma and premium atmosphere." },
  { term_ja: "サ活", term_en: "Sa-katsu", reading: "さかつ", desc_ja: "サウナ活動の略。サウナに行くこと、またはサウナに関する活動全般を指すサウナー用語。", desc_en: "'Sauna activity' — the act of going to saunas or engaging in sauna-related activities. A common saunner slang term." },
  { term_ja: "サ飯", term_en: "Sa-meshi", reading: "さめし", desc_ja: "サウナ後に食べるご飯のこと。サウナで代謝が上がった後の食事は格別に美味しく感じられる。", desc_en: "Post-sauna meal. Food tastes extraordinarily delicious after a sauna session due to heightened metabolism." },
  { term_ja: "サウナ室", term_en: "Sauna Room", reading: "さうなしつ", desc_ja: "サウナストーブが設置された高温の部屋。温度は80〜110℃程度が一般的。上段ほど高温になる。", desc_en: "The heated room with a sauna stove, typically 80-110°C. Higher benches are hotter due to rising heat." },
  { term_ja: "サウナー", term_en: "Saunner", reading: "さうなー", desc_ja: "サウナを愛好する人を指す俗称。定期的にサウナに通い、サウナの魅力を追求する人々。", desc_en: "A sauna enthusiast. Someone who regularly visits saunas and pursues the art of bathing." },
  { term_ja: "サウナストーン", term_en: "Sauna Stones", reading: "さうなすとーん", desc_ja: "サウナストーブの上に置かれる耐熱性の石。ロウリュで水をかけると蒸気を発生させる。香花石やカンラン石が一般的。", desc_en: "Heat-resistant stones placed on the sauna stove. When water is poured on them (löyly), they produce steam. Common types include peridotite and olivine." },
  { term_ja: "サウナハット", term_en: "Sauna Hat", reading: "さうなはっと", desc_ja: "サウナ室でかぶる帽子。頭部を熱から守り、のぼせを防止する。フェルト製やタオル地が主流。", desc_en: "Hat worn in the sauna to protect the head from heat and prevent dizziness. Typically made from felt or towel fabric." },
  { term_ja: "サウナマット", term_en: "Sauna Mat", reading: "さうなまっと", desc_ja: "サウナ室のベンチに敷いて座る個人用マット。衛生面と熱さ対策のために使用する。折りたたみ式が持ち運びに便利。", desc_en: "Personal mat for hygienic and comfortable seating on sauna benches. Foldable versions are convenient for carrying." },
  { term_ja: "下茹で", term_en: "Shitayude (Pre-warming)", reading: "したゆで", desc_ja: "サウナに入る前に温かい湯船に浸かって体を温めておくこと。体が温まった状態でサウナに入ると発汗が早くなる。", desc_en: "Warming up in hot water before entering the sauna. Pre-warming the body helps you start sweating more quickly once inside." },
  { term_ja: "シングル", term_en: "Single", reading: "しんぐる", desc_ja: "水風呂の温度が一桁台（10℃未満）であること。キリッとした冷たさで、ととのい効果が高いとされる上級者向け。", desc_en: "Water bath temperature in single digits (below 10°C). The crisp coldness is said to enhance totonou. For advanced bathers." },
  { term_ja: "スチームサウナ", term_en: "Steam Sauna", reading: "すちーむさうな", desc_ja: "蒸気で室内を満たすタイプのサウナ。温度は40〜60℃程度だが湿度が高い。肌への負担が少なく、初心者にも入りやすい。", desc_en: "Low-temperature (40-60°C) high-humidity sauna filled with steam. Gentle on the skin and beginner-friendly." },
  { term_ja: "スモークサウナ", term_en: "Smoke Sauna", reading: "すもーくさうな", desc_ja: "フィンランド最古のサウナ形式。煙突のない部屋で薪を燃やして温め、煙を排出してから入る。柔らかい熱とスモーキーな香りが特徴。", desc_en: "Finland's oldest sauna type. A chimneyless room heated by woodfire; smoke is ventilated out before bathing. Known for its soft heat and smoky aroma." },
  { term_ja: "整う (ととのう)", term_en: "Totonou", reading: "ととのう", desc_ja: "サウナ→水風呂→外気浴のサイクルで得られる深いリラックス状態。副交感神経が優位になり、多幸感や瞑想的な感覚を味わえる。", desc_en: "Deep relaxation state achieved through the sauna→cold bath→rest cycle. The parasympathetic nervous system becomes dominant, producing euphoria and meditative calm." },
  { term_ja: "セルフロウリュ", term_en: "Self-Löyly", reading: "せるふろうりゅ", desc_ja: "利用者が自分でサウナストーンに水をかけて蒸気を発生させるスタイル。好みのタイミングと量で湿度を調整できる。", desc_en: "Self-service water pouring on sauna stones. Bathers can adjust humidity to their preference by controlling timing and amount." },
  { term_ja: "塩サウナ", term_en: "Salt Sauna", reading: "しおさうな", desc_ja: "体に塩を塗ってから入るサウナ。汗で塩が溶け、古い角質を落とす効果がある。美肌効果が期待できる。", desc_en: "Sauna where salt is applied to the body before entering. The salt dissolves with sweat to exfoliate dead skin, promoting smooth skin." },
  { term_ja: "チムジルバン", term_en: "Jjimjilbang", reading: "ちむじるばん", desc_ja: "韓国式の大型温浴施設。様々な温度の部屋やサウナ、岩盤浴などが楽しめる複合リラクゼーション施設。", desc_en: "Korean-style large bath complex with rooms at various temperatures, saunas, and bedrock baths. A comprehensive relaxation facility." },
  { term_ja: "ととのう", term_en: "Totonou", reading: "ととのう", desc_ja: "サウナ→水風呂→外気浴のサイクルで到達する究極のリラックス状態。心身が調和し、深い恍惚感と多幸感に包まれる体験。", desc_en: "Ultimate relaxation from the sauna→cold bath→rest cycle. A transcendent experience where mind and body harmonize in deep euphoria." },
  { term_ja: "テントサウナ", term_en: "Tent Sauna", reading: "てんとさうな", desc_ja: "テント内にサウナストーブを設置した携帯式サウナ。キャンプ場や川辺など、自然の中でサウナを楽しめる。", desc_en: "Portable sauna with a stove set up inside a tent. Enjoy sauna in nature — at campsites, riverbanks, and more." },
  { term_ja: "デッキチェア", term_en: "Deck Chair", reading: "でっきちぇあ", desc_ja: "外気浴スペースに設置されたリクライニングチェア。サウナと水風呂の後、横になってととのいを堪能する。", desc_en: "Reclining chair placed in the outdoor rest area. Lie back after sauna and cold bath to fully enjoy totonou." },
  { term_ja: "ドイツ式", term_en: "German Style", reading: "どいつしき", desc_ja: "アウフグースを中心としたドイツスタイルのサウナ文化。熱波師によるパフォーマンスが特徴で、イベント性が高い。", desc_en: "Aufguss-centered German sauna culture. Characterized by dramatic performances from Aufguss masters, with a strong event atmosphere." },
  { term_ja: "導線", term_en: "Flow Line (Dousen)", reading: "どうせん", desc_ja: "サウナ室→水風呂→外気浴への移動経路のこと。動線が短いほどスムーズにととのいやすく、施設の評価ポイントになる。", desc_en: "The path from sauna→cold bath→rest area. Shorter flow lines make it easier to achieve totonou and are a key evaluation point for facilities." },
  { term_ja: "ドライサウナ", term_en: "Dry Sauna", reading: "どらいさうな", desc_ja: "湿度が低く高温（80〜110℃）のサウナ。日本の銭湯やスーパー銭湯で最も一般的なタイプ。", desc_en: "High-temperature (80-110°C) low-humidity sauna. The most common type found in Japanese bathhouses and super sento." },
  { term_ja: "寝転び湯", term_en: "Nekorobi-yu", reading: "ねころびゆ", desc_ja: "浅い湯に寝転んで入る温浴設備。サウナ後の休憩として、温かい湯に包まれながらリラックスできる。", desc_en: "Shallow lying-down bath for relaxation. A soothing way to rest after sauna, enveloped in warm water." },
  { term_ja: "熱波師", term_en: "Neppa-shi (Aufgusser)", reading: "ねっぱし", desc_ja: "アウフグースを行う専門のスタッフ。大きなタオルを使って蒸気を客に送る技術を持つ。プロの熱波師による施術は大人気。", desc_en: "Professional sauna steam master who performs Aufguss. Uses large towels to fan steam toward guests. Pro Aufgussers are extremely popular." },
  { term_ja: "羽衣", term_en: "Hagoromo", reading: "はごろも", desc_ja: "水風呂に浸かった際、体の周りにできる薄い温水の層。動かずにいると体温で温められた水が体を包み、冷たさが和らぐ。", desc_en: "Thin layer of warm water forming around your body in the cold bath. Staying still allows body heat to warm a cocoon of water, softening the cold." },
  { term_ja: "ハーバルサウナ", term_en: "Herbal Sauna", reading: "はーばるさうな", desc_ja: "ハーブや薬草を蒸気に混ぜて楽しむサウナ。タイのハーバルスチームが有名で、呼吸器やリラックス効果がある。", desc_en: "Sauna infused with herb and medicinal plant steam. Thai herbal steam is famous. Benefits include respiratory relief and relaxation." },
  { term_ja: "バレルサウナ", term_en: "Barrel Sauna", reading: "ばれるさうな", desc_ja: "樽（バレル）型の木製サウナ。丸みを帯びた形状が熱効率に優れ、屋外に設置されることが多い。近年グランピング施設で人気。", desc_en: "Barrel-shaped wooden sauna. The rounded shape provides excellent heat efficiency, often installed outdoors. Popular at glamping facilities." },
  { term_ja: "フィンランド式", term_en: "Finnish Style", reading: "ふぃんらんどしき", desc_ja: "本場フィンランドの伝統的なサウナスタイル。ロウリュで蒸気を発生させ、70〜90℃の柔らかな熱を楽しむ。ヴィヒタを使うことも。", desc_en: "Traditional löyly-based Finnish sauna style at 70-90°C with soft, gentle heat. May also incorporate vihta (birch whisks)." },
  { term_ja: "深さ", term_en: "Depth (Fukasa)", reading: "ふかさ", desc_ja: "水風呂の深さのこと。深い水風呂ほど全身をしっかり冷やすことができ、サウナーから高く評価される。", desc_en: "Depth of the cold water bath. Deeper baths cool the entire body more effectively and are highly rated by saunners." },
  { term_ja: "不感温度", term_en: "Neutral Temperature", reading: "ふかんおんど", desc_ja: "体温に近い温度（35〜36℃程度）で、熱くも冷たくも感じない温度帯。不感温度の湯に浸かると深いリラックスが得られる。", desc_en: "Body-temperature water (~35-36°C) that feels neither hot nor cold. Bathing at neutral temperature induces deep relaxation." },
  { term_ja: "水風呂", term_en: "Cold Bath (Mizuburo)", reading: "みずぶろ", desc_ja: "サウナ後に入る冷水の浴槽。温度は15〜20℃が一般的。サウナで温まった体を急速に冷やし、ととのいへ導く重要な要素。", desc_en: "Cold water plunge after sauna, typically 15-20°C. Rapidly cools the heated body and is a crucial element for achieving totonou." },
  { term_ja: "水通し", term_en: "Mizutooshi", reading: "みずとおし", desc_ja: "サウナに入る前に水風呂にさっと浸かること。体表面を冷やしておくことで、サウナ室での体感温度が上がる上級テクニック。", desc_en: "Quick cold bath dip before entering the sauna. Cooling the skin surface first enhances the perceived heat inside. An advanced technique." },
  { term_ja: "ミストサウナ", term_en: "Mist Sauna", reading: "みすとさうな", desc_ja: "細かい霧状の水滴で室内を満たすサウナ。温度40〜50℃程度で、肌にやさしく潤いを与える。自宅の浴室に設置できるタイプもある。", desc_en: "Fine-mist gentle sauna at 40-50°C. Moisturizes and is kind to the skin. Some models can be installed in home bathrooms." },
  { term_ja: "休憩", term_en: "Rest (Kyukei)", reading: "きゅうけい", desc_ja: "サウナと水風呂の後に体を休める時間。椅子に座ったり横になったりして、ととのいを感じる最も重要なステップ。", desc_en: "Rest period after sauna and cold bath. Sit or lie down to experience totonou — the most important step in the cycle." },
  { term_ja: "薬草サウナ", term_en: "Medicinal Herb Sauna", reading: "やくそうさうな", desc_ja: "よもぎやドクダミなどの薬草を蒸して、その蒸気を浴びるサウナ。和のハーバルサウナとして日本独自の発展を遂げている。", desc_en: "Japanese herbal steam sauna using medicinal plants like mugwort and dokudami. A uniquely Japanese evolution of the herbal sauna tradition." },
  { term_ja: "ロウリュ", term_en: "Löyly", reading: "ろうりゅ", desc_ja: "フィンランド語で「蒸気」の意。サウナストーンに水をかけて蒸気を発生させ、体感温度と湿度を上げる行為。サウナの醍醐味。", desc_en: "Finnish word for 'steam'. The act of pouring water on sauna stones to generate steam, raising perceived temperature and humidity. The essence of sauna." },
];

function getSortedTerms(lang: string): Term[] {
  if (lang === "en") {
    return [...glossaryTerms].sort((a, b) =>
      a.term_en.localeCompare(b.term_en, "en")
    );
  }
  return [...glossaryTerms].sort((a, b) =>
    a.reading.localeCompare(b.reading, "ja")
  );
}

export default function GlossaryPage() {
  const params = useParams();
  const lang = (params.lang as string) || "ja";
  const isEn = lang === "en";
  const sortedTerms = getSortedTerms(lang);

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
          {isEn ? "Back to Top" : "トップに戻る"}
        </Link>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-5xl font-bold mb-3">
            {isEn ? "Sauna Glossary" : "サウナ用語集"}
          </h1>
          <p className="text-green-200/70 text-lg">
            {isEn
              ? `${sortedTerms.length} essential terms every saunner should know`
              : `サウナーなら知っておきたい${sortedTerms.length}の用語`}
          </p>
        </div>

        {/* Terms grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sortedTerms.map((item, idx) => (
            <div
              key={idx}
              className="rounded-xl p-5 hover:scale-[1.01] transition-transform"
              style={{
                background:
                  "linear-gradient(160deg, rgba(34,197,94,0.15) 0%, rgba(34,197,94,0.05) 50%, rgba(34,197,94,0.1) 100%)",
                border: "1px solid rgba(34,197,94,0.25)",
              }}
            >
              {isEn ? (
                <div className="flex items-baseline gap-3 mb-2 flex-wrap">
                  <h3 className="text-xl font-bold text-white">
                    {item.term_en}
                  </h3>
                  <span className="text-sm text-green-300/70">
                    {item.term_ja}
                  </span>
                </div>
              ) : (
                <div className="flex items-baseline gap-3 mb-2">
                  <h3 className="text-xl font-bold text-white">
                    {item.term_ja}
                  </h3>
                  <span className="text-sm text-green-300/70">
                    {item.reading}
                  </span>
                </div>
              )}
              <p className="text-white/70 text-sm leading-relaxed">
                {isEn ? item.desc_en : item.desc_ja}
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
            {isEn ? "Back to Top" : "トップに戻る"}
          </Link>
        </div>
      </div>
    </main>
  );
}
