/**
 * Performer-to-facility mapping.
 *
 * Maps performer names (from sauna_performers table) to the sauna facility
 * names (from saunas.name) where they are known to work.
 *
 * This is a static lookup used by the scoring engine to apply aufgusser bonuses.
 * When the sauna_performers table gains a `facilities` column, this file can be
 * replaced by a DB query.
 */

export interface PerformerFacilityLink {
  performer: string;
  facilities: string[];
  isLeader?: boolean;
}

export const PERFORMER_FACILITY_LINKS: PerformerFacilityLink[] = [
  // === SPA & SAUNA オスパー（旭川）熱波隊 13名 ===
  { performer: "プレジャー田中", facilities: ["SPA & SAUNA オスパー"], isLeader: true },
  { performer: "アウフグースえもん", facilities: ["SPA & SAUNA オスパー"] },
  { performer: "ウェルカム宮", facilities: ["SPA & SAUNA オスパー"] },
  { performer: "エスエイト純", facilities: ["SPA & SAUNA オスパー"] },
  { performer: "エストレージャ洸", facilities: ["SPA & SAUNA オスパー"] },
  { performer: "ビーチクキラー前田", facilities: ["SPA & SAUNA オスパー"] },
  { performer: "マイケル須藤", facilities: ["SPA & SAUNA オスパー"] },
  { performer: "モンスーン赤野", facilities: ["SPA & SAUNA オスパー"] },
  { performer: "りゅーきイケダ", facilities: ["SPA & SAUNA オスパー"] },
  { performer: "熱ごり", facilities: ["SPA & SAUNA オスパー"] },
  { performer: "レスキューmotto", facilities: ["SPA & SAUNA オスパー"] },
  { performer: "マッソーけいご", facilities: ["SPA & SAUNA オスパー"] },
  { performer: "ゆーま", facilities: ["SPA & SAUNA オスパー"] },

  // === 朝日湯源泉 ゆいる（川崎）===
  { performer: "バイセン大塚", facilities: ["朝日湯源泉 ゆいる"] },
  { performer: "五塔 熱子", facilities: ["朝日湯源泉 ゆいる"] },

  // === サウナ&ホテル かるまる池袋 ===
  { performer: "井上勝正", facilities: ["サウナ&ホテル かるまる池袋店", "サウナ&ホテル かるまる池袋"] },
  { performer: "小島", facilities: ["サウナ&ホテル かるまる池袋店", "サウナ&ホテル かるまる池袋"] },
  { performer: "藤次", facilities: ["サウナ&ホテル かるまる池袋店", "サウナ&ホテル かるまる池袋"] },

  // === 渋谷SAUNAS ===
  { performer: "鮭山未菜美", facilities: ["渋谷SAUNAS"] },
  { performer: "スター諸星", facilities: ["渋谷SAUNAS"] },
  { performer: "柴田健太郎", facilities: ["渋谷SAUNAS"] },

  // === ニコーリフレ（札幌）===
  { performer: "エレガント渡会", facilities: ["ニコーリフレ"] },

  // === サウナ東京 ===
  { performer: "箸休めサトシ", facilities: ["サウナ東京", "スカイスパYOKOHAMA"], isLeader: true },
  { performer: "レジェンドゆう", facilities: ["サウナ東京"] },
  { performer: "永井テツヤ", facilities: ["サウナ東京"] },

  // === スカイスパYOKOHAMA ===
  { performer: "井上勝正", facilities: ["スカイスパYOKOHAMA"] },
  { performer: "鈴木りく", facilities: ["スカイスパYOKOHAMA"] },
  { performer: "岡見", facilities: ["スカイスパYOKOHAMA"] },

  // === 北欧（上野）===
  { performer: "鮭山未菜美", facilities: ["北欧"] },

  // === ウェルビー栄・今池（名古屋）WAT ===
  { performer: "黒川優磨", facilities: ["ウェルビー栄", "ウェルビー今池"] },
  { performer: "佐野マユ香", facilities: ["ウェルビー栄", "ウェルビー今池"] },

  // === ウェルビー福岡 ===
  { performer: "黒川優磨", facilities: ["ウェルビー福岡"] },
  { performer: "佐野マユ香", facilities: ["ウェルビー福岡"] },

  // === 大阪サウナDESSE ===
  { performer: "なみきんぐ", facilities: ["大阪サウナDESSE", "サウナDESSE"] },

  // === 湯らっくす（熊本）熱波隊 9名+ ===
  { performer: "ヤマトタケル", facilities: ["湯らっくす"] },
  { performer: "ラブ", facilities: ["湯らっくす"] },
  { performer: "さいき", facilities: ["湯らっくす"] },
  { performer: "まなみん", facilities: ["湯らっくす"] },
  { performer: "よしの", facilities: ["湯らっくす"] },
  { performer: "ずーみん", facilities: ["湯らっくす"] },
  { performer: "おおむら", facilities: ["湯らっくす"] },
  { performer: "さとう", facilities: ["湯らっくす"] },
  { performer: "たかの", facilities: ["湯らっくす"] },
];

/**
 * Get performer count and leader status for a given sauna facility name.
 * Uses fuzzy matching (substring) to handle slight name variations.
 */
export function getPerformerBonus(saunaName: string): {
  count: number;
  hasLeaderOrOwner: boolean;
  performers: string[];
} {
  const matched = PERFORMER_FACILITY_LINKS.filter((link) =>
    link.facilities.some(
      (f) => f === saunaName || saunaName.includes(f) || f.includes(saunaName)
    )
  );

  // Deduplicate by performer name (same performer may have multiple facility entries)
  const uniquePerformers = new Map<string, PerformerFacilityLink>();
  for (const m of matched) {
    if (!uniquePerformers.has(m.performer)) {
      uniquePerformers.set(m.performer, m);
    }
  }
  const unique = Array.from(uniquePerformers.values());

  return {
    count: unique.length,
    hasLeaderOrOwner: unique.some((m) => m.isLeader === true),
    performers: unique.map((m) => m.performer),
  };
}
