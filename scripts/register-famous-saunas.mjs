#!/usr/bin/env node
/**
 * Register famous saunas from all 47 prefectures via the seed API.
 * Run: node scripts/register-famous-saunas.mjs
 */

const BASE = process.env.BASE_URL || "http://localhost:3004";

const FAMOUS_SAUNAS = [
  // 北海道
  { q: "SPA & SAUNA オスパー 旭川", prefecture: "北海道" },
  { q: "森林公園温泉きよら 札幌", prefecture: "北海道" },
  { q: "ニコーリフレ 札幌", prefecture: "北海道" },
  // 青森
  { q: "まちなか温泉 青森センターホテル", prefecture: "青森県" },
  { q: "サウナ東京八戸", prefecture: "青森県" },
  // 岩手
  { q: "喜盛の湯 盛岡", prefecture: "岩手県" },
  // 宮城
  { q: "スパメッツァ仙台 竜泉寺の湯", prefecture: "宮城県" },
  // 秋田
  { q: "ユーランドホテル八橋 秋田", prefecture: "秋田県" },
  // 山形
  { q: "高源ゆ 上山", prefecture: "山形県" },
  // 福島
  { q: "レイクサイドホテルみなとや 猪苗代", prefecture: "福島県" },
  // 茨城
  { q: "ゆるうむ 水戸", prefecture: "茨城県" },
  // 栃木
  { q: "ザ・グランドスパ南大門 宇都宮", prefecture: "栃木県" },
  // 群馬
  { q: "白井屋ホテル SHIROIYA 前橋", prefecture: "群馬県" },
  // 埼玉
  { q: "おふろcafe utatane さいたま", prefecture: "埼玉県" },
  // 千葉
  { q: "スパメッツァおおたか 竜泉寺の湯 流山", prefecture: "千葉県" },
  // 東京
  { q: "サウナ&ホテル かるまる池袋", prefecture: "東京都" },
  { q: "渋谷SAUNAS", prefecture: "東京都" },
  { q: "サウナ東京 歌舞伎町", prefecture: "東京都" },
  { q: "サウナラボ神田", prefecture: "東京都" },
  { q: "北欧 上野 サウナ", prefecture: "東京都" },
  { q: "黄金湯 錦糸町", prefecture: "東京都" },
  { q: "ドシー五反田", prefecture: "東京都" },
  { q: "ドシー恵比寿", prefecture: "東京都" },
  { q: "ニューウイング 錦糸町", prefecture: "東京都" },
  { q: "松本湯 中野 サウナ", prefecture: "東京都" },
  { q: "ROOFTOP 西荻窪 サウナ", prefecture: "東京都" },
  // 神奈川
  { q: "朝日湯源泉 ゆいる 川崎", prefecture: "神奈川県" },
  { q: "スカイスパYOKOHAMA 横浜", prefecture: "神奈川県" },
  // 新潟
  { q: "サウナ宝来洲 柏崎", prefecture: "新潟県" },
  // 長野
  { q: "The Sauna 野尻湖", prefecture: "長野県" },
  // 富山
  { q: "The Hive SAUNA 立山", prefecture: "富山県" },
  // 石川
  { q: "LINNAS Kanazawa 金沢", prefecture: "石川県" },
  // 福井
  { q: "ゆけむり温泉 ゆ〜遊 福井", prefecture: "福井県" },
  // 山梨
  { q: "ふじやま温泉 富士吉田", prefecture: "山梨県" },
  // 岐阜
  { q: "大垣サウナ 大垣", prefecture: "岐阜県" },
  // 静岡
  { q: "サウナしきじ 静岡", prefecture: "静岡県" },
  // 愛知
  { q: "サウナラボ名古屋", prefecture: "愛知県" },
  { q: "ウェルビー栄 名古屋", prefecture: "愛知県" },
  { q: "ウェルビー今池 名古屋", prefecture: "愛知県" },
  { q: "IE:SAUNA AICHI", prefecture: "愛知県" },
  // 三重
  { q: "玉の湯 四日市 サウナ", prefecture: "三重県" },
  // 滋賀
  { q: "草津湯元 水春 草津", prefecture: "滋賀県" },
  // 京都
  { q: "ルーマプラザ 京都 サウナ", prefecture: "京都府" },
  { q: "白山湯 高辻 京都", prefecture: "京都府" },
  // 大阪
  { q: "大阪サウナDESSE 心斎橋", prefecture: "大阪府" },
  { q: "延羽の湯 羽曳野", prefecture: "大阪府" },
  { q: "水春 松井山手", prefecture: "京都府" },
  // 兵庫
  { q: "神戸クアハウス", prefecture: "兵庫県" },
  { q: "神戸サウナ&スパ 三宮", prefecture: "兵庫県" },
  // 奈良
  { q: "奈良健康ランド 天理", prefecture: "奈良県" },
  // 和歌山
  { q: "ふくろうの湯 和歌山", prefecture: "和歌山県" },
  // 鳥取
  { q: "ラピスパ 米子", prefecture: "鳥取県" },
  // 島根
  { q: "四季荘 出雲 サウナ", prefecture: "島根県" },
  // 岡山
  { q: "後楽温泉ほのかの湯 岡山", prefecture: "岡山県" },
  // 広島
  { q: "ニュージャパンEX 広島 サウナ", prefecture: "広島県" },
  // 山口
  { q: "くだまつ健康パーク 下松", prefecture: "山口県" },
  // 徳島
  { q: "あらたえの湯 徳島", prefecture: "徳島県" },
  // 香川
  { q: "琴弾廻廊 観音寺", prefecture: "香川県" },
  // 愛媛
  { q: "喜助の湯 松山", prefecture: "愛媛県" },
  // 高知
  { q: "SAUNAグリンピア 高知", prefecture: "高知県" },
  // 福岡
  { q: "ウェルビー福岡 博多", prefecture: "福岡県" },
  { q: "ROUTE 8 sauna 福岡", prefecture: "福岡県" },
  { q: "らかんの湯 御船山楽園 武雄", prefecture: "佐賀県" },
  // 長崎
  { q: "MINATO SAUNA 長崎", prefecture: "長崎県" },
  // 熊本
  { q: "湯らっくす 熊本", prefecture: "熊本県" },
  // 大分
  { q: "寒の地獄旅館 九重", prefecture: "大分県" },
  // 宮崎
  { q: "サウナMIYAZAKI 宮崎", prefecture: "宮崎県" },
  // 鹿児島
  { q: "ニューニシノサウナ 鹿児島", prefecture: "鹿児島県" },
  // 沖縄
  { q: "琉球温泉 龍神の湯 瀬長島", prefecture: "沖縄県" },
  { q: "KIELO SAUNA 沖縄", prefecture: "沖縄県" },
];

async function main() {
  console.log(`Registering ${FAMOUS_SAUNAS.length} famous saunas...`);

  // Process in batches of 5 to avoid overloading
  const BATCH_SIZE = 5;
  let total = 0;

  for (let i = 0; i < FAMOUS_SAUNAS.length; i += BATCH_SIZE) {
    const batch = FAMOUS_SAUNAS.slice(i, i + BATCH_SIZE);
    console.log(`\nBatch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(FAMOUS_SAUNAS.length / BATCH_SIZE)}:`);

    try {
      const res = await fetch(`${BASE}/api/sauna/seed`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ queries: batch }),
      });

      if (!res.ok) {
        console.error(`  HTTP ${res.status}: ${await res.text()}`);
        continue;
      }

      const data = await res.json();
      for (const r of data.results) {
        const status = r.count >= 0 ? `${r.count} found` : "ERROR";
        console.log(`  ${r.query}: ${status}`);
        if (r.count > 0) total += r.count;
      }
    } catch (e) {
      console.error(`  Batch error:`, e.message);
    }

    // Wait between batches to avoid rate limiting
    if (i + BATCH_SIZE < FAMOUS_SAUNAS.length) {
      await new Promise(r => setTimeout(r, 3000));
    }
  }

  console.log(`\nDone! Total saunas registered: ${total}`);
}

main().catch(console.error);
