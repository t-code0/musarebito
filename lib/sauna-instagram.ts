/**
 * Curated list of real, verified sauna-related Instagram accounts.
 *
 * All handles below have been cross-checked against the official
 * instagram.com profile URL or against authoritative source material
 * (sauna magazines, facility websites, press releases, influencer directories).
 *
 * NO facility/official accounts are included — this list focuses on
 * individuals, brands, media, and goods creators.
 *
 * Sources:
 *   - https://find-model.jp/insta-lab/sns-sauna-influencer/
 *   - https://beaus.net/note/2602/
 *   - https://news.infrect.com/saunakei/
 *   - https://saunaandco.com/2022/01/19/sauna-goods-brand/
 *   - Direct creator instagram.com profile pages
 */

export type InstagramCategory = "review" | "brand" | "female" | "goods";

export interface SaunaInstagramAccount {
  handle: string;
  name: string;
  description: string;
  category: InstagramCategory;
}

export const CATEGORY_LABEL_JA: Record<InstagramCategory, string> = {
  review: "サウナレビュー系インフルエンサー",
  brand: "サウナブランド・メディア",
  female: "サウナ女子系",
  goods: "サウナグッズ系",
};

export const CATEGORY_LABEL_EN: Record<InstagramCategory, string> = {
  review: "Sauna Reviewers",
  brand: "Brands & Media",
  female: "Female Sauna Influencers",
  goods: "Sauna Goods & Apparel",
};

export const CATEGORY_EMOJI: Record<InstagramCategory, string> = {
  review: "📝",
  brand: "📺",
  female: "💆‍♀️",
  goods: "🛍️",
};

/**
 * 34 verified Japanese sauna Instagram accounts (no facility accounts).
 */
export const SAUNA_INSTAGRAM_ACCOUNTS: SaunaInstagramAccount[] = [
  // ===== Category 1: サウナレビュー系インフルエンサー (9) =====
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
  {
    handle: "sauna_sisu_",
    name: "サウナまとめ日誌 SISU",
    description: "国内最大級のサウナ情報メディア、厳選施設をまとめて紹介",
    category: "review",
  },
  {
    handle: "kencho0113",
    name: "佐藤健長｜サウナインフルエンサー",
    description: "サウナ・旅行・グルメを発信する人気インフルエンサー",
    category: "review",
  },
  {
    handle: "takeru19950801",
    name: "伊藤猛｜サウナ×マジシャン",
    description: "プロマジシャン×サウナ好き、旅とサウナとグルメを発信",
    category: "review",
  },

  // ===== Category 2: サウナブランド・メディア (8) =====
  {
    handle: "ttne_official",
    name: "TTNE",
    description: "ととのえ親方率いるサウナクリエイティブチーム",
    category: "brand",
  },
  {
    handle: "sauna_ikitai",
    name: "サウナイキタイ",
    description: "日本最大のサウナ検索サイト公式アカウント",
    category: "brand",
  },
  {
    handle: "saunabros",
    name: "SAUNA BROS.",
    description: "東京ニュース通信社発行のサウナ専門雑誌公式",
    category: "brand",
  },
  {
    handle: "saunacollection",
    name: "サウナコレクション",
    description: "国内最大級のサウナInstagramメディア「サウコレ！」",
    category: "brand",
  },
  {
    handle: "saunachelin_official",
    name: "SAUNACHELIN",
    description: "毎年11月11日に発表される国内最大のサウナアワード",
    category: "brand",
  },
  {
    handle: "saunacamp",
    name: "Sauna Camp.",
    description: "MORZH正規代理店、日本アウトドアサウナの先駆者",
    category: "brand",
  },
  {
    handle: "weekly_sauna_boy",
    name: "サウナボーイ",
    description: "裸の付き合いをテーマにしたサウナカルチャーブランド",
    category: "brand",
  },
  {
    handle: "sauna.totonou",
    name: "サウナトトノウ",
    description: "月間200万人が閲覧するオリジナルサウナメディア",
    category: "brand",
  },

  // ===== Category 3: サウナ女子系 (9) =====
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
    description: "フォロワー6万超、Netflix出演歴もあるサウナタレント・モデル",
    category: "female",
  },
  {
    handle: "saori.kurosu",
    name: "Saori｜サウナ&ゴルフ女子",
    description: "サウナ・スパプロフェッショナル資格保持、フォロワー3万超の人気サウナ女子",
    category: "female",
  },
  {
    handle: "mirai_sauna",
    name: "Mirai｜サウナ女子×熱波師",
    description: "サウナ女子でありながら熱波師としても活動するインフルエンサー",
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

  // ===== Category 4: サウナグッズ系 (8) =====
  {
    handle: "tokio_sauvenir",
    name: "SAUVENIR（サウベニア）",
    description: "サウナ土産をコンセプトにしたサウナグッズ専業ブランド",
    category: "goods",
  },
  {
    handle: "harinezumi_official",
    name: "HARINEZUMI",
    description: "現役サウナーが作るサウナ＆アウトドア向けアパレルブランド",
    category: "goods",
  },
  {
    handle: "abil_japan",
    name: "ABiL（アビル）",
    description: "サウナハット・サウナウェアを手がけるサウナ特化アパレルブランド",
    category: "goods",
  },
  {
    handle: "totonoi_japan",
    name: "Totonoi Japan",
    description: "日本初のバケットハット型タオルサウナハットを販売するブランド",
    category: "goods",
  },
  {
    handle: "totonou_jp",
    name: "totonoü（トトノウ）",
    description: "エストニア発の北欧サウナ文化を日本に届けるサウナブランド",
    category: "goods",
  },
  {
    handle: "saunizm696",
    name: "saunizm（サウニズム）",
    description: "サウナ好きによるサウナ好きのためのサウナグッズ専門ブランド",
    category: "goods",
  },
  {
    handle: "saunival",
    name: "SAUNIVAL",
    description: "サウナ好きママ向けサウナアパレルブランド",
    category: "goods",
  },
  {
    handle: "sauna_brand",
    name: "SAUNA（サウナブランド）",
    description: "サウナライフスタイルをテーマにしたアパレル・グッズブランド",
    category: "goods",
  },
];

export function instagramUrl(handle: string): string {
  return `https://www.instagram.com/${handle}/`;
}
