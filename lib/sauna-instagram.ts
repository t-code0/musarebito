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
 *   - https://find-model.jp/insta-lab/instagram-account-sauna-company/
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
  // ===== Category 1: サウナレビュー系インフルエンサー (10) =====
  {
    handle: "totonoeoyakata",
    name: "松尾大 ととのえ親方",
    description: "TTNE代表、Harvia公認グローバルアンバサダーのプロサウナー",
    category: "review",
  },
  {
    handle: "saunashisho",
    name: "サウナ師匠 秋山大輔",
    description: "TTNE所属のプロサウナー、HARVIAグローバルサウナアンバサダー",
    category: "review",
  },
  {
    handle: "magmanpei37",
    name: "マグ万平",
    description: "「のちほどサウナで」MCの世界中のサウナを巡る芸人サウナー",
    category: "review",
  },
  {
    handle: "sauna_ao",
    name: "あおサウナ",
    description: "ショート動画でサウナ施設やサウナ飯を紹介する看護師サウナー",
    category: "review",
  },
  {
    handle: "yuu_saunner",
    name: "ゆう｜関東サウナ",
    description: "1分で行きたくなる関東サウナを発信、年間100施設巡るリール投稿者",
    category: "review",
  },
  {
    handle: "kencho0113",
    name: "さとーけんちょ",
    description: "全47都道府県・462施設を巡るフォトグラファー系サウナレビュアー",
    category: "review",
  },
  {
    handle: "takeru19950801",
    name: "伊藤猛",
    description: "プロマジシャン兼サウナ・旅行・グルメ系インフルエンサー",
    category: "review",
  },
  {
    handle: "saunaboys_official",
    name: "サウナ男子｜チル・サ活",
    description: "年間300日以上サウナに通い毎日18時にサウナ情報を発信",
    category: "review",
  },
  {
    handle: "sauna_matome",
    name: "厳選サウナ紹介",
    description: "全国の厳選サウナを写真付きで紹介するまとめアカウント",
    category: "review",
  },
  {
    handle: "sauna_sisu_",
    name: "サウナまとめ日誌 SISU",
    description: "温度・席数・混雑度を紹介する国内最大級サウナ情報メディア",
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
    handle: "weekly_sauna_boy",
    name: "サウナボーイ",
    description: "2018年結成の匿名クリエイティブ集団によるサウナカルチャーブランド",
    category: "brand",
  },
  {
    handle: "saunachelin_official",
    name: "SAUNACHELIN",
    description: "毎年11月11日に発表される国内最大のサウナアワード",
    category: "brand",
  },
  {
    handle: "and_sauna",
    name: "アンドサウナ",
    description: "YouTubeとInstagramでサウナ文化を発信するサウナメディア",
    category: "brand",
  },
  {
    handle: "saunaselect",
    name: "サウナセレクト by TTNE",
    description: "世界中のサウナグッズを厳選して紹介するTTNE運営のECサイト",
    category: "brand",
  },

  // ===== Category 3: サウナ女子系 (8) =====
  {
    handle: "saunajoshi",
    name: "サウナ女子（サ女子）",
    description: "世界18か国約300施設を巡るフィンランドサウナアンバサダー",
    category: "female",
  },
  {
    handle: "rui_chillsauna",
    name: "るい｜サウナと旅の記録",
    description: "女性向けサウナメディアchillsauna運営のサウナスパプロフェッショナル",
    category: "female",
  },
  {
    handle: "moka_030n",
    name: "野添百華",
    description: "Netflix出演経験もあるサウナタレント・フリーランスモデル",
    category: "female",
  },
  {
    handle: "manatmnt0116",
    name: "真奈",
    description: "チバテレ「むちむちサウナ」出演のサウナタレント",
    category: "female",
  },
  {
    handle: "saori.kurosu",
    name: "さおり｜サウナゴルフ女子",
    description: "サウナスパプロフェッショナル資格を持つサウナ＆ゴルフ女子",
    category: "female",
  },
  {
    handle: "mirai_sauna",
    name: "Mirai｜サウナ女子＆熱波師",
    description: "サウナ女子かつ熱波師として活動する女性サウナインフルエンサー",
    category: "female",
  },
  {
    handle: "saunacollection_girls",
    name: "サウコレ！女子",
    description: "女性向けサウナ情報を発信するサウナコレクション姉妹アカウント",
    category: "female",
  },
  {
    handle: "yun__saunatime",
    name: "ゆん｜大人女子のサウナ探し",
    description: "都内中心に本音レビューを発信、サウナアパレルyunikka運営",
    category: "female",
  },

  // ===== Category 4: サウナグッズ系 (8) =====
  {
    handle: "tokio_sauvenir",
    name: "SAUVENIR（サウベニア）",
    description: "サウナ室でもおしゃれしたい人向けサウナグッズ専業ブランド",
    category: "goods",
  },
  {
    handle: "totonoi_japan",
    name: "Totonoi Japan",
    description: "日本初バケットハット型タオルサウナハットを販売するブランド",
    category: "goods",
  },
  {
    handle: "saunanova_japan",
    name: "SAUNA NOVA",
    description: "累計2万個突破のサウナハットブランド、ととのえ先生監修",
    category: "goods",
  },
  {
    handle: "abil_japan",
    name: "ABiL（アビル）",
    description: "新潟発のサウナブランド、kontexコラボのサウナハットも人気",
    category: "goods",
  },
  {
    handle: "kontex_official",
    name: "コンテックス",
    description: "MOKUタオルで知られる1934年創業の今治タオルメーカー",
    category: "goods",
  },
  {
    handle: "samomo_omotesando",
    name: "samomo 表参道",
    description: "日本初のサウナグッズ専門セレクトショップ",
    category: "goods",
  },
  {
    handle: "saunaandco",
    name: "SAUNA&co.",
    description: "サウナグッズ製作・サウナライフ提案ブランド（大阪発）",
    category: "goods",
  },
  {
    handle: "saunacamp",
    name: "Sauna Camp.",
    description: "MORZH正規代理店、テントサウナ・アウトドアサウナグッズ販売",
    category: "goods",
  },
];

export function instagramUrl(handle: string): string {
  return `https://www.instagram.com/${handle}/`;
}
