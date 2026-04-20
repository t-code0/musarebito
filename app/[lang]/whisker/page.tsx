"use client";

import { useState } from "react";
import { useParams } from "next/navigation";

interface WhiskerProfile {
  name: string;
  subtitle_ja: string;
  subtitle_en: string;
  location_ja: string;
  location_en: string;
  group: string;
  facility_ja?: string;
  facility_en?: string;
  desc_ja: string;
  desc_en: string;
  instagram: { url: string; label: string }[];
  x?: { url: string; label: string };
  website?: { url: string; label_ja: string; label_en: string };
}

const WHISKERS: WhiskerProfile[] = [
  // === Mahārāja ===
  {
    name: "AYAKA",
    subtitle_ja: "伝統療法と蒸気浴でヒトを元気にする人",
    subtitle_en: "Healing through traditional therapy and steam bathing",
    location_ja: "茨城",
    location_en: "Ibaraki",
    group: "Mahārāja",
    desc_ja: "世界最古かつ世界三大医学の一つ「アーユルヴェーダ」と、バルト三国リトアニアより習得したサウナセラピー「ウィスキング」、世界のヒーリング技術を掛け合わせた唯一無二のサウナセラピーを行う。",
    desc_en: 'Combines Ayurveda — one of the world\'s oldest and three great medical traditions — with sauna therapy "whisking" learned in Lithuania, and global healing techniques to deliver a one-of-a-kind sauna therapy experience.',
    instagram: [
      { url: "https://www.instagram.com/zenspa1118/", label: "@zenspa1118" },
      { url: "https://www.instagram.com/maharaja__ritual/", label: "@maharaja__ritual" },
    ],
  },
  {
    name: "鈴木翔",
    subtitle_ja: "85歳が創る茨城極熱サウナ「3un」運営／ウィスキング×アーユルヴェーダセラピー",
    subtitle_en: 'Operator of "3un" — Ibaraki\'s extreme heat sauna / Whisking × Ayurveda therapy',
    location_ja: "茨城",
    location_en: "Ibaraki",
    group: "Mahārāja",
    facility_ja: "3un",
    facility_en: "3un",
    desc_ja: "茨城の極熱サウナ「3un」を運営。ラトビアから直輸入した白樺・オークの若枝を用いたフィンランド式ウィスキングを平日1〜2名限定でパーソナル提供。低温サウナ室での施術・指圧マッサージ・オイルトリートメント・水風呂フローティング・シンギングボウル倍音浴まで含む約50〜60分の極快ウィスキングセッション。",
    desc_en: 'Operates "3un," an extreme heat sauna in Ibaraki. Offers personal Finnish-style whisking sessions limited to 1–2 guests on weekdays, using birch and oak branches imported directly from Latvia. Sessions include shiatsu massage, oil treatment, cold bath floating, and singing bowl overtone bathing — approximately 50–60 minutes of total immersion.',
    instagram: [
      { url: "https://www.instagram.com/3un_sauna/", label: "@3un_sauna" },
      { url: "https://www.instagram.com/maharaja__ritual/", label: "@maharaja__ritual" },
    ],
    website: { url: "https://3un-sauna.com/", label_ja: "公式サイト", label_en: "Official Site" },
  },

  // === Progress ===
  {
    name: "道東サウナ小僧",
    subtitle_ja: "道東をこよなく愛するサウナ小僧／ウィスキングマイスター",
    subtitle_en: "Whisking meister based in Eastern Hokkaido",
    location_ja: "北海道斜里郡斜里町ウトロ",
    location_en: "Utoro, Shari, Hokkaido",
    group: "Progress",
    facility_ja: "KIKI知床ナチュラルリゾート",
    facility_en: "KIKI Shiretoko Natural Resort",
    desc_ja: "北海道・道東を拠点に流氷サウナ等のアウトドアサウナで経験を積み、Progressでウィスキングを習得。サウナシュラン系列のKIKI知床ナチュラルリゾートで、知床産トドマツや地場の植物で自作したヴィヒタによるセッションと、ハーバルアウフグースを提供。知床の自然そのものを浴びる体験が持ち味。",
    desc_en: "Based in eastern Hokkaido, honed his skills in outdoor saunas including drift ice saunas, then mastered whisking at Progress. At KIKI Shiretoko Natural Resort, he provides sessions using self-made vihta from local Shiretoko fir and native plants, plus herbal Aufguss — an experience of bathing in Shiretoko's nature itself.",
    instagram: [{ url: "https://www.instagram.com/doto_saunaboy/", label: "@doto_saunaboy" }],
  },
  {
    name: "キリ",
    subtitle_ja: "14世帯の限界集落を健康ランドに／蒸‐五箇サウナ‐運営",
    subtitle_en: "Turning a 14-household village into a wellness destination",
    location_ja: "京都府京丹後市",
    location_en: "Kyotango, Kyoto",
    group: "Progress",
    facility_ja: "蒸（むす）‐五箇サウナ‐",
    facility_en: "Musu — Goka Sauna",
    desc_ja: "東京の広告代理店勤務から信濃町The Saunaでの修行を経て、京都最北端14世帯の限界集落に移住。姉妹店「ぬかとゆげ」と並ぶ古民家サウナ「蒸‐五箇サウナ‐」を立ち上げ運営。フィンランド視察で磨いた技術と、集落再生への想いを乗せた施術が魅力の実力派マイスター。",
    desc_en: "Left a Tokyo ad agency, trained at The Sauna in Shinano, then relocated to a remote 14-household village at Kyoto's northernmost tip. Founded and operates the renovated farmhouse sauna \"Musu — Goka Sauna.\" A skilled meister whose technique was refined through Finland study tours, infused with a passion for rural revitalization.",
    instagram: [{ url: "https://www.instagram.com/kirikirimy/", label: "@kirikirimy" }],
    x: { url: "https://twitter.com/kirikirimy3", label: "@kirikirimy3" },
    website: { url: "https://musu-sauna.com", label_ja: "施設サイト", label_en: "Facility Site" },
  },
  {
    name: "カジ",
    subtitle_ja: "丹後サウナ／ぬかとゆげ立ち上げメンバー",
    subtitle_en: "Co-founder of Nuka to Yuge sauna, Tango region",
    location_ja: "京都府京丹後市",
    location_en: "Kyotango, Kyoto",
    group: "Progress",
    facility_ja: "ぬかとゆげ",
    facility_en: "Nuka to Yuge",
    desc_ja: "信濃町LAMP（The Sauna）ヘルパーを経て、京丹後の酵素浴＆フィンランドサウナ「ぬかとゆげ」立ち上げの中心メンバーに。フィンランドでの海外サウナ視察経験もあり、独特のキャラクターと丁寧なホスピタリティで来訪者を楽しませる、関西圏を代表する人気ウィスカー。",
    desc_en: "After working as a helper at LAMP (The Sauna) in Shinano, became a key member in launching \"Nuka to Yuge\" — an enzyme bath & Finnish sauna in Kyotango. With Finland study tour experience and warm hospitality, he is one of Kansai's most popular whiskers.",
    instagram: [{ url: "https://www.instagram.com/kajiyama_saikyou/", label: "@kajiyama_saikyou" }],
    x: { url: "https://twitter.com/kenken_28", label: "@kenken_28" },
  },
  {
    name: "ミーチカ",
    subtitle_ja: "Progress女性プロ修了1号生／女性施術のスペシャリスト",
    subtitle_en: "First female Pro graduate of Progress / Women's session specialist",
    location_ja: "東京都",
    location_en: "Tokyo",
    group: "Progress",
    facility_ja: "SAUNA RESET Pint（浅草）／Sauna Therapy（表参道）",
    facility_en: "SAUNA RESET Pint (Asakusa) / Sauna Therapy (Omotesando)",
    desc_ja: "Progressプロフェッショナルコース女性修了1号生。女性への施術数は国内トップクラスで、冷えやむくみなど女性特有の悩みに寄り添う繊細なセッションに定評あり。浅草SAUNA RESET Pintと表参道Sauna Therapyを拠点に、首都圏で最も予約の取れない女性マイスターの一人。",
    desc_en: "First female graduate of the Progress Professional course. Her women's session count ranks among Japan's highest, with a reputation for delicate treatments addressing cold sensitivity and swelling. Based at SAUNA RESET Pint (Asakusa) and Sauna Therapy (Omotesando) — one of Tokyo's hardest-to-book female meisters.",
    instagram: [{ url: "https://www.instagram.com/michka_sauna/", label: "@michka_sauna" }],
    x: { url: "https://x.com/michka_sauna", label: "@michka_sauna" },
  },
  {
    name: "む〜みん",
    subtitle_ja: "Progressプロ男性1号生／シンギングボウル認定プレーヤー",
    subtitle_en: "First male Pro graduate of Progress / Certified singing bowl player",
    location_ja: "茨城県常総市",
    location_en: "Joso, Ibaraki",
    group: "Progress",
    facility_ja: "常総ONSEN&SAUNA お湯むすび（副支配人）",
    facility_en: "Joso ONSEN & SAUNA Oyu-Musubi (Deputy Manager)",
    desc_ja: "Progressプロ男性1号生のウィスキングマイスター。国際シンギングボウル協会認定プレーヤーの資格を活かし、ウィスキング×サウンドヒーリングを融合した独自セッションが話題。2024年11月開業の大型温浴施設「お湯むすび」で副支配人を務め、アウトドアイベントでも活躍。",
    desc_en: "First male graduate of the Progress Professional course. Leveraging his certification as an International Singing Bowl Association player, his unique sessions fusing whisking with sound healing have gained attention. Serves as deputy manager at the large bath facility \"Oyu-Musubi\" (opened Nov 2024), also active at outdoor events.",
    instagram: [{ url: "https://www.instagram.com/moomin_sauna/", label: "@moomin_sauna" }],
    x: { url: "https://x.com/moomin_sauna", label: "@moomin_sauna" },
  },
  {
    name: "はまもん",
    subtitle_ja: "新潟初の女性ウィスキングマイスター",
    subtitle_en: "Niigata's first female whisking meister",
    location_ja: "新潟県",
    location_en: "Niigata",
    group: "Progress",
    facility_ja: "SAUNA KUMORI／じょんのび館／サウナ宝来洲 ほか",
    facility_en: "SAUNA KUMORI / Jon-Nobi-Kan / Sauna Horizon, etc.",
    desc_ja: "新潟初の女性ウィスキングマイスターとして、県内外の施設・イベントで予約枠が即埋まる人気施術者。タキビサウナやNNサウナ、美山プロジェクト等との協業も多く、新潟・信越のウィスキング文化を牽引する存在。",
    desc_en: "As Niigata's first female whisking meister, her reservation slots fill instantly at facilities and events across the prefecture and beyond. Collaborates extensively with Takibi Sauna, NN Sauna, and the Miyama Project, driving whisking culture in the Niigata-Shin'etsu region.",
    instagram: [{ url: "https://www.instagram.com/whiskadope/", label: "@whiskadope" }],
    x: { url: "https://twitter.com/h4mmn_", label: "@h4mmn_" },
  },
  {
    name: "カズ",
    subtitle_ja: "北陸初の常設ウィスキングを目指すマイスター",
    subtitle_en: "Meister pursuing Hokuriku's first permanent whisking venue",
    location_ja: "富山・石川",
    location_en: "Toyama / Ishikawa",
    group: "Progress",
    facility_ja: "一里野高原ホテル ろあん（石川県白山市・不定期）",
    facility_en: "Ichirino Kogen Hotel Roan (Hakusan, Ishikawa — irregular)",
    desc_ja: "北陸初の常設ウィスキングを目指して日夜奮闘中。ウィスキングにWATSU（水中ボディワーク）やシンギングボウルを組み合わせる独自スタイルを追求し、東洋医学の視点から個人の体調に合わせた施術を提供する北陸の実力派。",
    desc_en: "Working toward establishing Hokuriku's first permanent whisking venue. Pursues a unique style combining whisking with WATSU (aquatic bodywork) and singing bowls, providing personalized treatments informed by Eastern medicine — a rising talent in the Hokuriku region.",
    instagram: [{ url: "https://www.instagram.com/whisking_kazu/", label: "@whisking_kazu" }],
    x: { url: "https://twitter.com/whisking_kazu", label: "@whisking_kazu" },
  },
  {
    name: "武内祐美",
    subtitle_ja: "セラピスト／Family Bath Master認定（リトアニア）",
    subtitle_en: "Therapist / Family Bath Master certified (Lithuania)",
    location_ja: "千葉・神奈川",
    location_en: "Chiba / Kanagawa",
    group: "Progress",
    facility_ja: "PRIVATE SAUNA Re:（船橋）／HUBHUB（新百合ヶ丘）",
    facility_en: "PRIVATE SAUNA Re: (Funabashi) / HUBHUB (Shin-Yurigaoka)",
    desc_ja: "セラピスト経験を活かしオイルトリートメントを融合させた施術で男女問わず好評。リトアニアInternational Bath AcademyでFamily Bath Master認定を取得した本格派。Re:やHUBHUBを中心に関東で精力的に活動する。",
    desc_en: "Highly regarded by both men and women for treatments that fuse oil therapy with her therapist expertise. Certified as a Family Bath Master at Lithuania's International Bath Academy. Actively practices across the Kanto region, primarily at Re: and HUBHUB.",
    instagram: [{ url: "https://www.instagram.com/yumi_takeuchi___/", label: "@yumi_takeuchi___" }],
  },

  // === 日本ウィスキングクラブ ===
  {
    name: "松田純子",
    subtitle_ja: "日本ウィスキングクラブ代表／SAUNASウィスキングアドバイザー",
    subtitle_en: "President, Japan Whisking Club / SAUNAS Whisking Advisor",
    location_ja: "東京（渋谷・高輪・神田）",
    location_en: "Tokyo (Shibuya / Takanawa / Kanda)",
    group: "日本ウィスキングクラブ",
    facility_ja: "渋谷SAUNAS／高輪SAUNAS／サウナラボ神田",
    facility_en: "Shibuya SAUNAS / Takanawa SAUNAS / Sauna Lab Kanda",
    desc_ja: "リトアニア・ラトビアで本場のウィスキングを習得し日本へ広めた第一人者。渋谷・高輪SAUNASとサウナラボ神田を拠点に施術を行い、プログラム開発・監修も手掛ける。日本ウィスキングクラブ代表として後進育成にも尽力する、日本ウィスキング界の草分け的存在。",
    desc_en: "A pioneer who learned authentic whisking in Lithuania and Latvia and brought it to Japan. Based at Shibuya and Takanawa SAUNAS and Sauna Lab Kanda, she also develops and supervises programs. As president of the Japan Whisking Club, she is a trailblazer dedicated to nurturing the next generation.",
    instagram: [],
  },

  // === しらかばスポーツ ===
  {
    name: "マグ万平",
    subtitle_ja: "サウナ芸人／しらかばスポーツ所属",
    subtitle_en: "Sauna comedian / Shirakaba Sports member",
    location_ja: "東京／全国",
    location_en: "Tokyo / Nationwide",
    group: "しらかばスポーツ",
    desc_ja: "1984年福岡生まれ、人力舎所属のサウナ芸人。MROラジオ「マグ万平ののちほどサウナで」でサウナの魅力を発信。ロシア人からウィスキングを習得し、日本初のウィスキング集団「しらかばスポーツ」メンバーとして活動する、芸能人系ウィスカーの代表格。",
    desc_en: "Born 1984 in Fukuoka, a comedian under Jinrikisha talent agency. Hosts the radio show \"Magu Manpei no Nochihodo Sauna de\" on MRO Radio. Learned whisking from a Russian master and is a member of \"Shirakaba Sports\" — Japan's first whisking collective — representing the celebrity whisker genre.",
    instagram: [{ url: "https://www.instagram.com/magmanpei37/", label: "@magmanpei37" }],
    x: { url: "https://twitter.com/magmanpei", label: "@magmanpei" },
  },
  {
    name: "くろだっこ",
    subtitle_ja: "天空のウィスキングキャプテン／施術件数日本一",
    subtitle_en: "Whisking Captain of the Sky / Japan's #1 in session count",
    location_ja: "東京（笹塚）",
    location_en: "Tokyo (Sasazuka)",
    group: "しらかばスポーツ",
    facility_ja: "マルシンスパ",
    facility_en: "Marushin Spa",
    desc_ja: "個人施術件数3000件超、おそらく日本一の施術数を誇るベテランウィスカー。旧ジートピアでの常設ウィスキング筆頭施術師を経て、現在は天空のアジト「マルシンスパ」でマルシンスパウィスキングクラブ（MSWC）を主宰。軽妙な語り口とともに繰り出す丁寧な施術が名物。",
    desc_en: "With over 3,000 personal sessions, likely Japan's most prolific veteran whisker. After serving as the lead whisking practitioner at the former G-Topia, he now presides over the Marushin Spa Whisking Club (MSWC) at the sky-high hideout \"Marushin Spa.\" Known for his witty narration and meticulous technique.",
    instagram: [],
    x: { url: "https://twitter.com/sauna_captain", label: "@sauna_captain" },
  },

  // === 施設独立系 ===
  {
    name: "野田クラクションべべー",
    subtitle_ja: "The Sauna支配人／サウナビルダー",
    subtitle_en: "Manager of The Sauna / Sauna builder",
    location_ja: "長野県信濃町",
    location_en: "Shinano, Nagano",
    group: "施設独立系",
    facility_ja: "The Sauna（LAMP野尻湖）",
    facility_en: "The Sauna (LAMP Nojiri-ko)",
    desc_ja: "1994年生まれ、サウナシュラン常連The Sauna支配人でサウナビルダー。長野・野尻湖のアウトドアサウナを運営し、全国でサウナ施設をプロデュース。ロウリュ時にヴィヒタで行うダイナミックなウィスキングで、日本のアウトドアウィスキング文化を牽引する火付け役。",
    desc_en: "Born 1994, manager of The Sauna — a Saunachelin regular — and sauna builder. Operates outdoor saunas at Lake Nojiri in Nagano and produces sauna facilities nationwide. His dynamic whisking during löyly with vihta ignited Japan's outdoor whisking culture.",
    instagram: [{ url: "https://www.instagram.com/the_sauna_bebe/", label: "@the_sauna_bebe" }],
    x: { url: "https://twitter.com/nodaklaxonbebe", label: "@nodaklaxonbebe" },
  },
];

const GROUPS = [
  { key: "all", ja: "全て", en: "All" },
  { key: "Progress", ja: "Progress", en: "Progress" },
  { key: "Mahārāja", ja: "Mahārāja", en: "Mahārāja" },
  { key: "しらかばスポーツ", ja: "しらかばスポーツ", en: "Shirakaba Sports" },
  { key: "日本ウィスキングクラブ", ja: "日本ウィスキングクラブ", en: "Japan Whisking Club" },
  { key: "施設独立系", ja: "施設独立系", en: "Independent" },
] as const;

const GROUP_COLORS: Record<string, string> = {
  "Progress": "bg-blue-500/20 text-blue-300 border-blue-500/30",
  "Mahārāja": "bg-green-500/20 text-green-300 border-green-500/30",
  "しらかばスポーツ": "bg-amber-500/20 text-amber-300 border-amber-500/30",
  "日本ウィスキングクラブ": "bg-purple-500/20 text-purple-300 border-purple-500/30",
  "施設独立系": "bg-gray-500/20 text-gray-300 border-gray-500/30",
};

export default function WhiskerPage() {
  const params = useParams();
  const lang = (params.lang as string) || "ja";
  const isEn = lang === "en";
  const [filter, setFilter] = useState("all");

  const filtered = filter === "all"
    ? WHISKERS
    : WHISKERS.filter((w) => w.group === filter);

  return (
    <main
      className="min-h-screen"
      style={{ background: "linear-gradient(180deg, #0a1a0a 0%, #152d15 30%, #0a1a0a 100%)" }}
    >
      {/* Header */}
      <div className="py-8 px-4 sm:px-6" style={{ background: "linear-gradient(180deg, #152d15 0%, #0a1a0a 100%)" }}>
        <div className="max-w-7xl mx-auto">
          <a href={`/${lang}`} className="text-green-300 hover:text-white text-sm mb-2 inline-block">
            {isEn ? "← Back to Home" : "← トップに戻る"}
          </a>
          <h1 className="text-3xl font-bold text-white">🌿 {isEn ? "Whisker Directory" : "ウィスカー一覧"}</h1>
          <p className="text-green-200/70 text-sm mt-2">
            {isEn ? "Japanese whisking therapists — masters of the birch branch ritual" : "日本のウィスキング施術者たち"}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* What is Whisking — universal intro */}
        <section
          className="rounded-2xl p-6 mb-8"
          style={{
            background: "linear-gradient(135deg, #1a2e1a 0%, #2d4a2d 25%, #1a2e1a 50%, #2d4a2d 75%, #1a2e1a 100%)",
            boxShadow: "0 4px 20px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.15)",
            border: "1px solid rgba(34,197,94,0.3)",
          }}
        >
          <h2 className="text-2xl font-bold text-green-400 mb-3">
            {isEn ? "What is Whisking?" : "ウィスキングとは？"}
          </h2>
          <p className="text-gray-200 text-sm leading-relaxed mb-4">
            {isEn
              ? "Whisking (vihta/venik therapy) is a traditional sauna ritual where the body is gently swept and massaged with bundles of fresh tree branches — typically birch, oak, or herbs. Originating in Finland, Russia, and the Baltic states (Lithuania, Latvia, Estonia), each tradition has its own philosophy and technique. In Japan, whisking culture has blossomed since the early 2020s, with multiple schools and organizations now training practitioners. Today, Japan's whisking scene spans five major lineages: Progress (Japan's first whisking school), Shirakaba Sports (Japan's first whisking collective), Japan Whisking Club, Mahārāja (Ayurveda-infused herbal whisking), and independent facility-based practitioners."
              : "ウィスキングとは、白樺やオークなどの若枝（ヴィヒタ／ヴェーニク）を束ねて体を優しく叩き、撫で、蒸気とともに施術するサウナの伝統的なリチュアルです。フィンランド、ロシア、バルト三国（リトアニア・ラトビア・エストニア）にそれぞれ異なる流派と哲学があり、日本では2020年代前半から急速に広まりました。現在、日本のウィスキング界はProgress（日本初の専門スクール）、しらかばスポーツ（日本初のウィスキング集団）、日本ウィスキングクラブ、Mahārāja（アーユルヴェーダ融合の薬草ウィスキング）、施設独立系の5系統が主要勢力として活動しています。"}
          </p>
          <p className="text-white/40 text-xs">
            {isEn
              ? `${WHISKERS.length} whiskers registered from ${GROUPS.length - 1} organizations`
              : `${GROUPS.length - 1}団体から${WHISKERS.length}名のウィスカーを掲載中`}
          </p>
        </section>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          {GROUPS.map((g) => {
            const count = g.key === "all"
              ? WHISKERS.length
              : WHISKERS.filter((w) => w.group === g.key).length;
            return (
              <button
                key={g.key}
                onClick={() => setFilter(g.key)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  filter === g.key
                    ? "bg-green-600 text-white"
                    : "bg-white/10 text-white/60 hover:bg-white/20"
                }`}
              >
                {isEn ? g.en : g.ja} ({count})
              </button>
            );
          })}
        </div>

        {/* Whisker Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((w) => (
            <div
              key={w.name}
              className="rounded-2xl p-5 flex flex-col"
              style={{
                background: "linear-gradient(160deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.04) 50%, rgba(255,255,255,0.08) 100%)",
                border: "1px solid rgba(255,255,255,0.2)",
                boxShadow: "0 4px 12px rgba(0,0,0,0.4), inset 0 2px 0 rgba(255,255,255,0.1)",
              }}
            >
              {/* Name + Group Badge */}
              <div className="flex items-start justify-between gap-2 mb-1">
                <h3 className="text-lg font-bold text-white">{w.name}</h3>
                <span className={`shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full border ${GROUP_COLORS[w.group] || "bg-gray-500/20 text-gray-300 border-gray-500/30"}`}>
                  {w.group}
                </span>
              </div>

              {/* Subtitle */}
              <p className="text-xs text-green-300/80 mb-1 leading-snug">
                {isEn ? w.subtitle_en : w.subtitle_ja}
              </p>

              {/* Location + Facility */}
              <p className="text-xs text-white/40 mb-1">
                📍 {isEn ? w.location_en : w.location_ja}
              </p>
              {(w.facility_ja || w.facility_en) && (
                <p className="text-xs text-white/30 mb-3">
                  🏠 {isEn ? w.facility_en : w.facility_ja}
                </p>
              )}

              {/* Description */}
              <p className="text-sm text-gray-300 leading-relaxed mb-4 flex-1">
                {isEn ? w.desc_en : w.desc_ja}
              </p>

              {/* Links */}
              <div className="flex flex-wrap items-center gap-2">
                {w.instagram.map((ig) => (
                  <a
                    key={ig.url}
                    href={ig.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-green-300 hover:text-white transition-colors bg-white/5 px-2.5 py-1.5 rounded-lg"
                  >
                    📸 {ig.label}
                  </a>
                ))}
                {w.x && (
                  <a
                    href={w.x.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-white transition-colors bg-white/5 px-2.5 py-1.5 rounded-lg font-bold"
                  >
                    𝕏 {w.x.label}
                  </a>
                )}
                {w.website && (
                  <a
                    href={w.website.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-amber-300 hover:text-white transition-colors bg-white/5 px-2.5 py-1.5 rounded-lg"
                  >
                    🌐 {isEn ? w.website.label_en : w.website.label_ja}
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
