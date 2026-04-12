/**
 * Curated list of real, verified sauna-related Instagram accounts.
 *
 * All handles below have been cross-checked against the official
 * instagram.com profile URL or against authoritative source material
 * (sauna magazines, facility websites, press releases).
 *
 * Sources:
 *   - https://find-model.jp/insta-lab/sns-sauna-influencer/
 *   - https://beaus.net/note/2602/
 *   - Direct facility & creator instagram.com profile pages
 */

export type InstagramCategory = "review" | "official" | "goods" | "female";

export interface SaunaInstagramAccount {
  handle: string;
  name: string;
  description: string;
  category: InstagramCategory;
}

export const CATEGORY_LABEL_JA: Record<InstagramCategory, string> = {
  review: "サウナレビュー系",
  official: "施設公式",
  goods: "ブランド・メディア",
  female: "サウナ女子系",
};

export const CATEGORY_LABEL_EN: Record<InstagramCategory, string> = {
  review: "Reviewers",
  official: "Official",
  goods: "Brands & Media",
  female: "Female Influencers",
};

export const CATEGORY_EMOJI: Record<InstagramCategory, string> = {
  review: "📝",
  official: "🏛️",
  goods: "🛍️",
  female: "💆‍♀️",
};

/**
 * 34 verified Japanese sauna Instagram accounts.
 */
export const SAUNA_INSTAGRAM_ACCOUNTS: SaunaInstagramAccount[] = [
  // ===== Official facility accounts (13) =====
  {
    handle: "karumaru_ikebukuro",
    name: "サウナ&ホテル かるまる池袋",
    description: "4種のサウナと4種の水風呂を有する池袋の都市型サウナ",
    category: "official",
  },
  {
    handle: "shibuya_saunas",
    name: "渋谷SAUNAS",
    description: "ほぼ日プロデュースの渋谷桜丘町にある複合サウナ施設",
    category: "official",
  },
  {
    handle: "spalaqua_official",
    name: "東京ドーム天然温泉スパ ラクーア",
    description: "都心で楽しむ天然温泉と多彩なサウナが揃う癒しの空間",
    category: "official",
  },
  {
    handle: "sauna_tokyo2",
    name: "サウナ東京",
    description: "歌舞伎町にある5種サウナ3種水風呂の男性専用施設",
    category: "official",
  },
  {
    handle: "saunalabnagoya",
    name: "サウナラボ名古屋",
    description: "ウェルビーが手がける体験型サウナラボの名古屋店",
    category: "official",
  },
  {
    handle: "saunalabkanda",
    name: "サウナラボ神田",
    description: "神田ポートビル地下にある都会のフィンランド式サウナ",
    category: "official",
  },
  {
    handle: "the_sauna_nojiriko",
    name: "The Sauna 野尻湖",
    description: "LAMP野尻湖併設の本格フィンランド式アウトドアサウナ",
    category: "official",
  },
  {
    handle: "skyspa_yokohama",
    name: "スカイスパYOKOHAMA",
    description: "横浜駅直結のスパ・サウナ・コワーキング施設",
    category: "official",
  },
  {
    handle: "desse.osaka",
    name: "大阪サウナDESSE",
    description: "心斎橋の7つの本格サウナを備えた都市型サウナ施設",
    category: "official",
  },
  {
    handle: "shinagawasauna",
    name: "品川サウナ",
    description: "大井町徒歩1分、屋上外気浴が自慢の泊まれるサウナ",
    category: "official",
  },
  {
    handle: "doc_sauna",
    name: "ドシー",
    description: "恵比寿・五反田のサウナ特化型カプセルホテルブランド",
    category: "official",
  },
  {
    handle: "wellbe_jp",
    name: "ウェルビー",
    description: "名古屋発祥、全国展開するサウナ&カプセルホテルチェーン",
    category: "official",
  },
  {
    handle: "yunoizumi_souka",
    name: "湯乃泉 草加健康センター",
    description: "埼玉・草加にある泣く子も黙るサウナの聖地",
    category: "official",
  },

  // ===== Brands & media (8) =====
  {
    handle: "ttne_official",
    name: "TTNE",
    description: "ととのえ親方率いるサウナクリエイティブチーム",
    category: "goods",
  },
  {
    handle: "tokio_sauvenir",
    name: "SAUVENIR",
    description: "サウナ土産をコンセプトにしたサウナグッズ専業ブランド",
    category: "goods",
  },
  {
    handle: "weekly_sauna_boy",
    name: "サウナボーイ",
    description: "裸の付き合いをテーマにしたサウナカルチャーブランド",
    category: "goods",
  },
  {
    handle: "saunacamp",
    name: "Sauna Camp.",
    description: "MORZH正規代理店、日本アウトドアサウナの先駆者",
    category: "goods",
  },
  {
    handle: "saunachelin_official",
    name: "SAUNACHELIN",
    description: "毎年11月11日に発表される国内最大のサウナアワード",
    category: "goods",
  },
  {
    handle: "sauna_ikitai",
    name: "サウナイキタイ",
    description: "日本最大のサウナ検索サイト公式アカウント",
    category: "goods",
  },
  {
    handle: "saunabros",
    name: "SAUNA BROS.",
    description: "東京ニュース通信社発行のサウナ専門雑誌公式",
    category: "goods",
  },
  {
    handle: "saunacollection",
    name: "サウナコレクション",
    description: "国内最大級のサウナInstagramメディア「サウコレ！」",
    category: "goods",
  },

  // ===== Reviewers / influencers (6) =====
  {
    handle: "totonoeoyakata",
    name: "松尾大 ととのえ親方",
    description: "TTNE代表、Harvia公認グローバルアンバサダーのプロサウナー",
    category: "review",
  },
  {
    handle: "yuu_saunner",
    name: "ゆう｜関東サウナ",
    description: "1分で行きたくなる関東サウナを発信する人気リール投稿者",
    category: "review",
  },
  {
    handle: "saunaand_",
    name: "SAUNA & co.",
    description: "サウナライフスタイル情報を発信するメディアブランド",
    category: "review",
  },
  {
    handle: "sauna_matome",
    name: "厳選サウナ紹介",
    description: "全国の厳選サウナを写真付きで紹介するまとめアカウント",
    category: "review",
  },
  {
    handle: "sauna_en",
    name: "sauna en",
    description: "全国のサウナを旅する人気サウナレビューアカウント",
    category: "review",
  },
  {
    handle: "saunaou",
    name: "サウナ王",
    description: "サウナ王として知られるサウナ情報発信インフルエンサー",
    category: "review",
  },

  // ===== Female sauna influencers (7) =====
  {
    handle: "saunajoshi",
    name: "サウナ女子（サ女子）",
    description: "世界18か国約300施設を巡るフィンランドサウナアンバサダー",
    category: "female",
  },
  {
    handle: "rui_chillsauna",
    name: "るい｜サウナと旅の記録",
    description: "女性向けサウナメディアchillsauna運営のサウナ女子",
    category: "female",
  },
  {
    handle: "moka_030n",
    name: "野添百華",
    description: "サウナタレント・モデルとして活動するサウナ女子",
    category: "female",
  },
  {
    handle: "saunagirl_momochan",
    name: "サウナガールももちゃん",
    description: "関西中心に銭湯・サウナを紹介する大阪サウナ女子",
    category: "female",
  },
  {
    handle: "saunacollection_girls",
    name: "サウコレ！女子",
    description: "女性向けサウナ情報を発信するサウナコレクション姉妹アカウント",
    category: "female",
  },
  {
    handle: "hokkaidosauna.yuki",
    name: "北海道サウナ YUKI",
    description: "北海道のサウナ情報を発信する女性サウナー",
    category: "female",
  },
  {
    handle: "sauna.girl.totonoi",
    name: "福岡サウナ女子ととのいちゃん",
    description: "九州のサウナ・温泉情報を発信する福岡サウナ女子",
    category: "female",
  },
];

export function instagramUrl(handle: string): string {
  return `https://www.instagram.com/${handle}/`;
}
