#!/usr/bin/env node
/**
 * Migration: Add facilities column to sauna_performers and link aufgusser to saunas.
 *
 * STEP 1: Run ALTER TABLE manually in Supabase SQL Editor:
 *   ALTER TABLE sauna_performers ADD COLUMN IF NOT EXISTS facilities text[] DEFAULT '{}';
 *
 * STEP 2: Run this script to set facility links:
 *   node scripts/migrate-performers.mjs
 */

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";

const envContent = readFileSync(".env.local", "utf8");
const env = {};
envContent.split("\n").forEach((line) => {
  const m = line.match(/^([^#=]+)=(.*)$/);
  if (m) env[m[1].trim()] = m[2].trim();
});

const sb = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

// Known facility links: performer name → sauna names array
const FACILITY_LINKS = {
  // === SPA & SAUNA オスパー（旭川）熱波隊 13名 ===
  "プレジャー田中": ["SPA&SAUNA オスパー"],
  "アウフグースえもん": ["SPA&SAUNA オスパー"],
  "ウェルカム宮": ["SPA&SAUNA オスパー"],
  "エスエイト純": ["SPA&SAUNA オスパー"],
  "エストレージャ洸": ["SPA&SAUNA オスパー"],
  "ビーチクキラー前田": ["SPA&SAUNA オスパー"],
  "マイケル須藤": ["SPA&SAUNA オスパー"],
  "モンスーン赤野": ["SPA&SAUNA オスパー"],
  "りゅーきイケダ": ["SPA&SAUNA オスパー"],
  "熱ごり": ["SPA&SAUNA オスパー"],
  "レスキューmotto": ["SPA&SAUNA オスパー"],
  "マッソーけいご": ["SPA&SAUNA オスパー"],
  "ゆーま": ["SPA&SAUNA オスパー"],

  // === 朝日湯源泉 ゆいる（川崎）===
  "バイセン大塚": ["朝日湯源泉 ゆいる"],
  "五塔 熱子": ["朝日湯源泉 ゆいる"],

  // === エレガント渡会 → ニコーリフレ（札幌）===
  "エレガント渡会": ["ニコーリフレ"],

  // === その他有名施設 ===
  "井上勝正": ["サウナ&ホテル かるまる池袋店"],
  "鮭山 未菜美": ["渋谷SAUNAS"],
};

async function main() {
  console.log("=== Performer Facility Link Migration ===\n");

  // 1. Fetch all performers
  const { data: performers, error } = await sb
    .from("sauna_performers")
    .select("id,name")
    .eq("type", "aufgusser");

  if (error) {
    console.error("Failed to fetch performers:", error.message);
    process.exit(1);
  }

  console.log(`Total performers: ${performers.length}`);

  let updated = 0;
  let skipped = 0;

  for (const perf of performers) {
    const facilities = FACILITY_LINKS[perf.name];
    if (!facilities) {
      skipped++;
      continue;
    }

    const { error: updateError } = await sb
      .from("sauna_performers")
      .update({ facilities })
      .eq("id", perf.id);

    if (updateError) {
      console.error(`  [ERR] ${perf.name}: ${updateError.message}`);
    } else {
      updated++;
      console.log(`  [OK] ${perf.name} → ${facilities.join(", ")}`);
    }
  }

  console.log(`\nDone: ${updated} linked, ${skipped} skipped (no known facility)`);
}

main().catch(console.error);
