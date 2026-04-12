/**
 * Lightweight i18n for musarebito.
 *
 * Adds English support without pulling in a heavyweight i18n library.
 * Look up via `t(key, lang)`. Unknown keys fall back to the Japanese value.
 */

export type Lang = "ja" | "en";

export function isLang(value: string | undefined | null): value is Lang {
  return value === "ja" || value === "en";
}

export function normalizeLang(value: string | undefined | null): Lang {
  return value === "en" ? "en" : "ja";
}

type Dict = Record<string, { ja: string; en: string }>;

const STRINGS: Dict = {
  // ----- site-wide -----
  site_name: { ja: "蒸され人", en: "Musarebito" },
  site_subtitle: { ja: "むされびと", en: "Japan Sauna Guide" },
  site_tagline: {
    ja: "── 本物のサウナだけを、あなたに。",
    en: "── Only the real saunas, hand-picked for you.",
  },
  back_to_top: { ja: "🏠 トップに戻る", en: "🏠 Back to home" },
  search_placeholder: {
    ja: "サウナ名・エリアで検索...",
    en: "Search by sauna name or area...",
  },
  search_button: { ja: "検索", en: "Search" },
  language_japanese: { ja: "日本語", en: "Japanese" },
  language_english: { ja: "英語", en: "English" },

  // ----- home sections -----
  home_about_title: { ja: "🔍 蒸され人とは？", en: "🔍 What is Musarebito?" },
  home_about_body: {
    ja: "蒸され人は、全国のサウナ施設をGoogleの実データに基づいて評価・ランキングするサービスです。口コミ数・評価・サウナ設備の充実度など、複数の指標を組み合わせた独自の「本物スコア」で、本当に価値のあるサウナ施設を見つけることができます。",
    en: "Musarebito ranks every sauna in Japan using real Google data. Reviews, ratings and facility quality are blended into our proprietary HONMONO Score so visitors can spot the saunas truly worth their time.",
  },
  home_score_title: { ja: "🏆 本物スコアとは？", en: "🏆 What is the HONMONO Score?" },
  home_score_axis_heat: { ja: "熱の質", en: "Heat Quality" },
  home_score_axis_water: { ja: "水風呂", en: "Cold Bath" },
  home_score_axis_outside: { ja: "外気浴", en: "Outdoor Air" },
  home_score_axis_clean: { ja: "清潔感", en: "Cleanliness" },
  home_score_axis_aroma: { ja: "アロマ", en: "Aroma & Löyly" },
  home_score_axis_focus: { ja: "サウナ特化度", en: "Sauna Focus" },
  home_score_desc_heat: {
    ja: "サウナ室の温度・ロウリュ・アウフグースの充実度。",
    en: "Sauna room temperature, löyly and aufguss quality.",
  },
  home_score_desc_water: { ja: "水風呂の温度・深さ・水質。", en: "Cold bath temperature, depth and water quality." },
  home_score_desc_outside: { ja: "外気浴スペースの充実度・眺望。", en: "Outdoor cool-down area and view." },
  home_score_desc_clean: { ja: "施設全体の清潔さ・アメニティ。", en: "Overall cleanliness and amenities." },
  home_score_desc_aroma: {
    ja: "アロマロウリュ・ヴィヒタ・薬草・ウィスキング。",
    en: "Aroma löyly, vihta, herbal sauna, whisking.",
  },
  home_score_desc_focus: { ja: "サウナの充実度・専門性。", en: "Depth and specialisation of sauna offerings." },
  home_rank_s: { ja: "(75〜) 🌟🌟🌟 本物", en: "(75+) 🌟🌟🌟 The real deal" },
  home_rank_a: { ja: "(60〜74) 🌟🌟 信頼できる", en: "(60–74) 🌟🌟 Trusted" },
  home_rank_b: { ja: "(45〜59) 🌟 普通", en: "(45–59) 🌟 Average" },
  home_rank_c: { ja: "(〜44) 📈 発展に期待", en: "(–44) 📈 Room to grow" },
  home_prefs_title: { ja: "都道府県から探す", en: "Browse by prefecture" },
  home_content_title: { ja: "コンテンツ", en: "More content" },
  home_featured_title: { ja: "🔥 注目のサウナ", en: "🔥 Featured saunas" },

  // ----- detail page -----
  detail_back_to_list: { ja: "← {{pref}}のサウナ一覧", en: "← All saunas in {{pref}}" },
  detail_features: { ja: "この施設の特徴", en: "About this facility" },
  detail_features_loading: { ja: "要約を生成中...", en: "Generating summary..." },
  detail_features_empty: {
    ja: "口コミが集まり次第、AI要約が自動生成されます。",
    en: "An AI summary will appear once enough reviews are collected.",
  },
  detail_vote_title: { ja: "この施設は本物？", en: "Is this place the real deal?" },
  detail_vote_yes: { ja: "👍 本物だと思う", en: "👍 Yes, the real deal" },
  detail_vote_no: { ja: "👎 そうでもない", en: "👎 Not really" },
  detail_vote_thanks: { ja: "投票ありがとうございました", en: "Thanks for your vote!" },
  detail_vote_label: { ja: "が「本物」と評価", en: "say it's the real deal" },
  detail_vote_count: { ja: "票", en: "votes" },
  detail_photos: { ja: "写真", en: "Photos" },
  detail_food: { ja: "グルメ＆周辺情報", en: "Food & nearby" },
  detail_food_restaurant: { ja: "施設内の名物メニュー", en: "Signature menu inside" },
  detail_food_local: { ja: "周辺ご当地グルメ", en: "Local specialties nearby" },
  detail_food_spots: { ja: "近くの観光スポット", en: "Tourist spots nearby" },
  detail_food_explore_more: {
    ja: "この周辺のお店をもっと探す",
    en: "Find more restaurants nearby",
  },
  detail_facts: { ja: "サウナ・水風呂スペック", en: "Sauna & cold bath specs" },
  detail_facts_sauna_temp: { ja: "サウナ室温度", en: "Sauna room temp" },
  detail_facts_water_temp: { ja: "水風呂温度", en: "Cold bath temp" },
  detail_facts_outside_air: { ja: "外気浴", en: "Outdoor cool-down" },
  detail_facts_loyly: { ja: "ロウリュ", en: "Löyly" },
  detail_facts_yes: { ja: "あり", en: "Yes" },
  detail_facts_no: { ja: "なし", en: "No" },
  detail_access: { ja: "アクセス", en: "How to get there" },
  detail_open_in_maps: { ja: "Google マップで開く", en: "Open in Google Maps" },
  detail_info: { ja: "施設情報", en: "Facility information" },
  detail_info_phone: { ja: "電話", en: "Phone" },
  detail_info_web: { ja: "Web", en: "Website" },
  detail_info_instagram: { ja: "Instagram", en: "Instagram" },
  detail_info_rating: { ja: "Google評価", en: "Google rating" },
  detail_info_hours: { ja: "営業時間", en: "Hours" },
  detail_reviews: { ja: "口コミ", en: "Reviews" },
  detail_write_review: { ja: "口コミを書く", en: "Write a review" },
  detail_no_reviews: { ja: "まだ口コミはありません", en: "No reviews yet" },
  detail_loading: { ja: "読み込み中...", en: "Loading..." },
  detail_not_found: { ja: "サウナが見つかりませんでした", en: "Sauna not found" },
  detail_score_label: { ja: "本物スコア", en: "HONMONO Score" },

  // ----- prefecture list -----
  list_title_suffix: { ja: "のサウナ", en: " saunas" },
  list_loading: { ja: "サウナを検索中...", en: "Searching for saunas..." },
  list_empty: { ja: "サウナが見つかりませんでした", en: "No saunas found" },
  list_empty_hint: {
    ja: "別のキーワードで検索してみてください",
    en: "Try a different search keyword.",
  },
  list_count: { ja: "件", en: " results" },
  sort_score: { ja: "本物スコア順", en: "HONMONO Score" },
  sort_rating: { ja: "Google評価順", en: "Google rating" },
  sort_newest: { ja: "新着順", en: "Newest" },
  see_more: { ja: "もっと見る", en: "Show more" },

  // ----- sauna goods -----
  goods_title: { ja: "サウナグッズを探す", en: "Find sauna goods" },
  goods_subtitle: {
    ja: "ととのい体験を格上げするおすすめアイテム。Amazonで人気のサウナグッズを探せます。",
    en: "Upgrade your totonou experience. Browse popular sauna gear on Amazon.",
  },
  goods_amazon_button: { ja: "Amazonで探す", en: "Find on Amazon" },
  goods_disclosure: {
    ja: "※ Amazonアソシエイト・プログラムによるリンクです",
    en: "* As an Amazon Associate we earn from qualifying purchases.",
  },
};

/**
 * Translate a key. Use {{var}} placeholders for interpolation.
 */
export function t(
  key: keyof typeof STRINGS | string,
  lang: Lang = "ja",
  vars?: Record<string, string>
): string {
  const entry = (STRINGS as Dict)[key];
  if (!entry) return key;
  let str = entry[lang] ?? entry.ja;
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      str = str.replace(new RegExp(`{{${k}}}`, "g"), v);
    }
  }
  return str;
}

/**
 * Build a URL keeping the current language.
 */
export function withLang(lang: Lang, path: string): string {
  const trimmed = path.startsWith("/") ? path.slice(1) : path;
  return `/${lang}/${trimmed}`;
}
