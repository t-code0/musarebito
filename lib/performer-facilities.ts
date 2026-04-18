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
  { performer: "井上勝正", facilities: ["サウナ&ホテル かるまる池袋店"] },

  // === 渋谷SAUNAS ===
  { performer: "鮭山 未菜美", facilities: ["渋谷SAUNAS"] },

  // === ニコーリフレ（札幌）===
  { performer: "エレガント渡会", facilities: ["ニコーリフレ"] },

  // === サウナ東京 ===
  { performer: "レジェンドゆう", facilities: ["サウナ東京"] },
  { performer: "永井テツヤ", facilities: ["サウナ東京"] },

  // === スカイスパYOKOHAMA ===
  { performer: "井上勝正", facilities: ["スカイスパYOKOHAMA"] },
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

  return {
    count: matched.length,
    hasLeaderOrOwner: matched.some((m) => m.isLeader === true),
    performers: matched.map((m) => m.performer),
  };
}
