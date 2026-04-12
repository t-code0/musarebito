import { getServiceSupabase } from "@/lib/supabase";

const BASE = "https://musarebito.vercel.app";
const LANGS = ["ja", "en"] as const;

export default async function sitemap() {
  const sb = getServiceSupabase();
  const now = new Date();

  const staticPaths = [
    "",
    "/glossary",
    "/health",
    "/goods",
    "/beginners",
    "/aufgusser",
    "/whisker",
    "/sauna-instagram",
    "/premium",
    "/privacy",
    "/terms",
  ];

  const staticPages = LANGS.flatMap((lang) =>
    staticPaths.map((path) => ({
      url: `${BASE}/${lang}${path}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: path === "" ? 1 : 0.7,
    }))
  );

  // Prefecture pages
  const prefectures = [
    "北海道", "青森県", "岩手県", "宮城県", "秋田県", "山形県", "福島県",
    "茨城県", "栃木県", "群馬県", "埼玉県", "千葉県", "東京都", "神奈川県",
    "新潟県", "富山県", "石川県", "福井県", "山梨県", "長野県", "岐阜県", "静岡県", "愛知県",
    "三重県", "滋賀県", "京都府", "大阪府", "兵庫県", "奈良県", "和歌山県",
    "鳥取県", "島根県", "岡山県", "広島県", "山口県",
    "徳島県", "香川県", "愛媛県", "高知県",
    "福岡県", "佐賀県", "長崎県", "熊本県", "大分県", "宮崎県", "鹿児島県", "沖縄県",
  ];
  const prefPages = LANGS.flatMap((lang) =>
    prefectures.map((pref) => ({
      url: `${BASE}/${lang}/sauna/${encodeURIComponent(pref)}`,
      lastModified: now,
      changeFrequency: "daily" as const,
      priority: 0.8,
    }))
  );

  // Facility detail pages
  let facilityPages: {
    url: string;
    lastModified: Date;
    changeFrequency: "weekly";
    priority: number;
  }[] = [];
  try {
    const { data } = await sb.from("saunas").select("id,prefecture,updated_at").limit(1000);
    if (data) {
      facilityPages = data.flatMap((s) =>
        LANGS.map((lang) => ({
          url: `${BASE}/${lang}/sauna/${encodeURIComponent(s.prefecture)}/${s.id}`,
          lastModified: new Date(s.updated_at || Date.now()),
          changeFrequency: "weekly" as const,
          priority: 0.6,
        }))
      );
    }
  } catch {
    // skip facility pages on DB error
  }

  return [...staticPages, ...prefPages, ...facilityPages];
}
