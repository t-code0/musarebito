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
  name_en: string;
  description: string;
  description_en: string;
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
  // ===== Category 1: Sauna Reviewers (10) =====
  { handle: "totonoeoyakata", name: "松尾大 ととのえ親方", name_en: "Dai Matsuo (Totonoe Oyakata)", description: "TTNE代表、Harvia公認グローバルアンバサダーのプロサウナー", description_en: "CEO of TTNE, Harvia-certified Global Ambassador, professional saunner", category: "review" },
  { handle: "saunashisho", name: "サウナ師匠 秋山大輔", name_en: "Daisuke Akiyama (Sauna Shisho)", description: "TTNE所属のプロサウナー、HARVIAグローバルサウナアンバサダー", description_en: "Professional saunner at TTNE, HARVIA Global Sauna Ambassador", category: "review" },
  { handle: "magmanpei37", name: "マグ万平", name_en: "Mag Manpei", description: "「のちほどサウナで」MCの世界中のサウナを巡る芸人サウナー", description_en: "Comedian-saunner who hosts 'Nochihodo Sauna de' and visits saunas worldwide", category: "review" },
  { handle: "sauna_ao", name: "あおサウナ", name_en: "Ao Sauna", description: "ショート動画でサウナ施設やサウナ飯を紹介する看護師サウナー", description_en: "Nurse-saunner who reviews facilities and sauna meals via short videos", category: "review" },
  { handle: "yuu_saunner", name: "ゆう｜関東サウナ", name_en: "Yuu | Kanto Sauna", description: "1分で行きたくなる関東サウナを発信、年間100施設巡るリール投稿者", description_en: "Reels creator visiting 100+ saunas/year, showcasing Kanto saunas in 1 min", category: "review" },
  { handle: "kencho0113", name: "さとーけんちょ", name_en: "Sato Kencho", description: "全47都道府県・462施設を巡るフォトグラファー系サウナレビュアー", description_en: "Photographer-reviewer who has visited 462 facilities across all 47 prefectures", category: "review" },
  { handle: "takeru19950801", name: "伊藤猛", name_en: "Takeru Ito", description: "プロマジシャン兼サウナ・旅行・グルメ系インフルエンサー", description_en: "Professional magician and sauna/travel/food influencer", category: "review" },
  { handle: "saunacrazy_official", name: "クレイジーサウナ", name_en: "Crazy Sauna", description: "全国のサウナを独自目線でレビューするサウナ情報アカウント", description_en: "Sauna information account reviewing saunas nationwide with a unique perspective", category: "review" },
  { handle: "sauna_matome", name: "厳選サウナ紹介", name_en: "Curated Sauna Picks", description: "全国の厳選サウナを写真付きで紹介するまとめアカウント", description_en: "Curated sauna roundup with photos from across Japan", category: "review" },
  { handle: "sauna_sisu_", name: "サウナまとめ日誌 SISU", name_en: "Sauna Diary SISU", description: "温度・席数・混雑度を紹介する国内最大級サウナ情報メディア", description_en: "Japan's largest sauna info media covering temps, capacity, and crowd levels", category: "review" },
  // ===== Category 2: Brands & Media (8) =====
  { handle: "ttne_official", name: "TTNE", name_en: "TTNE", description: "ととのえ親方率いるサウナクリエイティブチーム", description_en: "Sauna creative team led by Totonoe Oyakata", category: "brand" },
  { handle: "sauna_ikitai", name: "サウナイキタイ", name_en: "Sauna Ikitai", description: "日本最大のサウナ検索サイト公式アカウント", description_en: "Official account of Japan's largest sauna search site", category: "brand" },
  { handle: "saunabros", name: "SAUNA BROS.", name_en: "SAUNA BROS.", description: "東京ニュース通信社発行のサウナ専門雑誌公式", description_en: "Official account of the dedicated sauna magazine by Tokyo News Service", category: "brand" },
  { handle: "saunacollection", name: "サウナコレクション", name_en: "Sauna Collection", description: "国内最大級のサウナInstagramメディア「サウコレ！」", description_en: "One of Japan's largest sauna Instagram media outlets", category: "brand" },
  { handle: "weekly_sauna_boy", name: "サウナボーイ", name_en: "Sauna Boy", description: "2018年結成の匿名クリエイティブ集団によるサウナカルチャーブランド", description_en: "Sauna culture brand by an anonymous creative collective formed in 2018", category: "brand" },
  { handle: "saunachelin_official", name: "SAUNACHELIN", name_en: "SAUNACHELIN", description: "毎年11月11日に発表される国内最大のサウナアワード", description_en: "Japan's biggest sauna award, announced every Nov 11", category: "brand" },
  { handle: "and_sauna", name: "アンドサウナ", name_en: "And Sauna", description: "YouTubeとInstagramでサウナ文化を発信するサウナメディア", description_en: "Sauna media sharing sauna culture on YouTube and Instagram", category: "brand" },
  { handle: "saunaselect", name: "サウナセレクト by TTNE", name_en: "Sauna Select by TTNE", description: "世界中のサウナグッズを厳選して紹介するTTNE運営のECサイト", description_en: "TTNE's curated EC site featuring handpicked sauna goods from around the world", category: "brand" },
  // ===== Category 3: Female Sauna Influencers (8) =====
  { handle: "saunajoshi", name: "サウナ女子（サ女子）", name_en: "Sauna Joshi", description: "世界18か国約300施設を巡るフィンランドサウナアンバサダー", description_en: "Finland Sauna Ambassador who has visited ~300 facilities in 18 countries", category: "female" },
  { handle: "rui_chillsauna", name: "るい｜サウナと旅の記録", name_en: "Rui | Sauna & Travel", description: "女性向けサウナメディアchillsauna運営のサウナスパプロフェッショナル", description_en: "Sauna Spa Professional running chillsauna, a women's sauna media outlet", category: "female" },
  { handle: "moka_030n", name: "野添百華", name_en: "Momoka Nozoe", description: "Netflix出演経験もあるサウナタレント・フリーランスモデル", description_en: "Sauna talent and freelance model with Netflix appearance experience", category: "female" },
  { handle: "manatmnt0116", name: "真奈", name_en: "Mana", description: "チバテレ「むちむちサウナ」出演のサウナタレント", description_en: "Sauna talent featured on Chiba TV's 'Muchimuchi Sauna'", category: "female" },
  { handle: "saori.kurosu", name: "さおり｜サウナゴルフ女子", name_en: "Saori | Sauna & Golf", description: "サウナスパプロフェッショナル資格を持つサウナ＆ゴルフ女子", description_en: "Certified Sauna Spa Professional who combines sauna and golf lifestyles", category: "female" },
  { handle: "mirai_sauna", name: "Mirai｜サウナ女子＆熱波師", name_en: "Mirai | Saunner & Aufgusser", description: "サウナ女子かつ熱波師として活動する女性サウナインフルエンサー", description_en: "Female sauna influencer active as both a saunner and an aufgusser", category: "female" },
  { handle: "saunacollection_girls", name: "サウコレ！女子", name_en: "Sauna Collection Girls", description: "女性向けサウナ情報を発信するサウナコレクション姉妹アカウント", description_en: "Sister account of Sauna Collection, sharing sauna info for women", category: "female" },
  { handle: "yun__saunatime", name: "ゆん｜大人女子のサウナ探し", name_en: "Yun | Sauna for Women", description: "都内中心に本音レビューを発信、サウナアパレルyunikka運営", description_en: "Honest reviewer focused on Tokyo saunas, runs sauna apparel brand yunikka", category: "female" },
  // ===== Category 4: Sauna Goods & Apparel (8) =====
  { handle: "tokio_sauvenir", name: "SAUVENIR（サウベニア）", name_en: "SAUVENIR", description: "サウナ室でもおしゃれしたい人向けサウナグッズ専業ブランド", description_en: "Sauna goods brand for those who want to look stylish even in the sauna room", category: "goods" },
  { handle: "totonoi_japan", name: "Totonoi Japan", name_en: "Totonoi Japan", description: "日本初バケットハット型タオルサウナハットを販売するブランド", description_en: "Brand selling Japan's first bucket-hat-style towel sauna hat", category: "goods" },
  { handle: "saunanova_japan", name: "SAUNA NOVA", name_en: "SAUNA NOVA", description: "累計2万個突破のサウナハットブランド、ととのえ先生監修", description_en: "Sauna hat brand with 20,000+ units sold, supervised by Totonoe-sensei", category: "goods" },
  { handle: "abil_japan", name: "ABiL（アビル）", name_en: "ABiL", description: "新潟発のサウナブランド、kontexコラボのサウナハットも人気", description_en: "Niigata-born sauna brand, popular for kontex collab sauna hats", category: "goods" },
  { handle: "kontex_official", name: "コンテックス", name_en: "Kontex", description: "MOKUタオルで知られる1934年創業の今治タオルメーカー", description_en: "Imabari towel maker since 1934, known for the MOKU towel series", category: "goods" },
  { handle: "samomo_omotesando", name: "samomo 表参道", name_en: "samomo Omotesando", description: "日本初のサウナグッズ専門セレクトショップ", description_en: "Japan's first sauna goods specialty select shop", category: "goods" },
  { handle: "saunaandco", name: "SAUNA&co.", name_en: "SAUNA&co.", description: "サウナグッズ製作・サウナライフ提案ブランド（大阪発）", description_en: "Osaka-based brand crafting sauna goods and proposing sauna lifestyles", category: "goods" },
  { handle: "saunacamp", name: "Sauna Camp.", name_en: "Sauna Camp.", description: "MORZH正規代理店、テントサウナ・アウトドアサウナグッズ販売", description_en: "Official MORZH dealer, selling tent saunas and outdoor sauna gear", category: "goods" },
];

export function instagramUrl(handle: string): string {
  return `https://www.instagram.com/${handle}/`;
}
