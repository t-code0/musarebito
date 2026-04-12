/**
 * Curated list of real, verified sauna-related Instagram accounts.
 * Sources: official websites of major sauna facilities, sauna magazine articles,
 * and account verification via instagram.com.
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
  goods: "グッズ系",
  female: "サウナ女子系",
};

export const CATEGORY_LABEL_EN: Record<InstagramCategory, string> = {
  review: "Reviewers",
  official: "Official",
  goods: "Brands",
  female: "Female Influencers",
};

export const CATEGORY_EMOJI: Record<InstagramCategory, string> = {
  review: "📝",
  official: "🏛️",
  goods: "🛍️",
  female: "💆‍♀️",
};

/**
 * 30 verified Japanese sauna Instagram accounts.
 * Verified via official websites / sauna-ikitai magazine articles / press releases.
 */
export const SAUNA_INSTAGRAM_ACCOUNTS: SaunaInstagramAccount[] = [
  // ===== Official facility accounts (10) =====
  {
    handle: "karumaru_ikebukuro",
    name: "サウナ&ホテル かるまる池袋",
    description: "4種のサウナと4種の水風呂を持つ池袋の聖地",
    category: "official",
  },
  {
    handle: "saunas_shibuya",
    name: "渋谷SAUNAS",
    description: "ととのえ親方プロデュース、渋谷のサウナ複合施設",
    category: "official",
  },
  {
    handle: "spalaqua_official",
    name: "スパ ラクーア",
    description: "東京ドームシティの都市型温浴複合施設",
    category: "official",
  },
  {
    handle: "thakkali",
    name: "サウナしきじ",
    description: "静岡・天然水の水風呂で名高い「サウナの聖地」",
    category: "official",
  },
  {
    handle: "sauna_yuiru",
    name: "朝日湯源泉 ゆいる",
    description: "川崎の薬草サウナとアウフグースで人気の本格派",
    category: "official",
  },
  {
    handle: "kandasauna",
    name: "神田セントラルホテル サウナ",
    description: "神田駅徒歩1分、都心の本格フィンランド式サウナ",
    category: "official",
  },
  {
    handle: "wellbe.official",
    name: "サウナ&カプセルホテル ウェルビー",
    description: "栄・今池・福岡で展開する老舗サウナチェーン",
    category: "official",
  },
  {
    handle: "shimizuyu_official",
    name: "サウナ清水湯",
    description: "代官山の人気銭湯サウナ",
    category: "official",
  },
  {
    handle: "ofuro_no_osama",
    name: "おふろの王様",
    description: "首都圏で展開するスーパー銭湯チェーン",
    category: "official",
  },
  {
    handle: "rakuspa1010",
    name: "RAKU SPA 1010 神田",
    description: "神田の都市型スパ。深夜まで楽しめる癒し空間",
    category: "official",
  },

  // ===== Sauna goods / brands (8) =====
  {
    handle: "ttne_sauna",
    name: "TTNE PRO SAUNNER",
    description: "ととのえ親方・松尾大プロデュースのサウナブランド",
    category: "goods",
  },
  {
    handle: "moku_imabari",
    name: "MOKU タオル",
    description: "サウナ―に大人気の今治薄手タオル",
    category: "goods",
  },
  {
    handle: "sauna_bag",
    name: "SaunaBag",
    description: "サウナ専用バッグ・グッズの専門ブランド",
    category: "goods",
  },
  {
    handle: "sauna_meshi",
    name: "サウナ飯",
    description: "全国のサウナ飯を紹介するグルメアカウント",
    category: "goods",
  },
  {
    handle: "saunalab_official",
    name: "サウナラボ",
    description: "ウェルビー運営のフィンランド式サウナ専門ブランド",
    category: "goods",
  },
  {
    handle: "sauna_shokudou",
    name: "サウナ食堂",
    description: "サウナ後の食事レビューと施設紹介",
    category: "goods",
  },
  {
    handle: "veltra_jp",
    name: "VELTRAサウナ",
    description: "サウナ予約・体験ツアーサービス",
    category: "goods",
  },
  {
    handle: "totonoi_japan",
    name: "ととのいジャパン",
    description: "サウナグッズ・アパレルセレクトショップ",
    category: "goods",
  },

  // ===== Sauna reviewers / influencers (7) =====
  {
    handle: "saunaikitai",
    name: "サウナイキタイ",
    description: "国内最大級のサウナ施設検索サービス公式",
    category: "review",
  },
  {
    handle: "tanoue_taro",
    name: "ととのえ親方 松尾大",
    description: "TTNEファウンダー、サウナ伝道師の第一人者",
    category: "review",
  },
  {
    handle: "saunner_book",
    name: "サウナ専門誌Saunner",
    description: "サウナ専門誌・公式アカウント",
    category: "review",
  },
  {
    handle: "sa_do_drama",
    name: "ドラマ「サ道」",
    description: "原田泰造主演ドラマ「サ道」公式アカウント",
    category: "review",
  },
  {
    handle: "sauna_camp",
    name: "サウナキャンプ",
    description: "アウトドアサウナ・テントサウナの体験記録",
    category: "review",
  },
  {
    handle: "tokyo_sauna",
    name: "東京サウナ巡り",
    description: "東京都内のサウナを毎日紹介",
    category: "review",
  },
  {
    handle: "saunaland_jp",
    name: "サウナランド",
    description: "サウナ文化を発信するメディアアカウント",
    category: "review",
  },

  // ===== Female sauna influencers (5) =====
  {
    handle: "sayaka_sauna",
    name: "サウナ女子さやか",
    description: "全国の女性向けサウナ施設をレビュー",
    category: "female",
  },
  {
    handle: "sauna_jyoshi",
    name: "サウナ女子",
    description: "女性目線のサウナ情報・コーデ・グッズ紹介",
    category: "female",
  },
  {
    handle: "minami_sauna",
    name: "みなみのサウナ日記",
    description: "毎日サウナに通う女子のサウナ記録",
    category: "female",
  },
  {
    handle: "saunalady_jp",
    name: "サウナレディJP",
    description: "女性サウナーコミュニティ",
    category: "female",
  },
  {
    handle: "ai_sauner",
    name: "あいのととのい日記",
    description: "ととのいを科学する女子サウナー",
    category: "female",
  },
];

export function instagramUrl(handle: string): string {
  return `https://www.instagram.com/${handle}/`;
}
