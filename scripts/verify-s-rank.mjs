#!/usr/bin/env node
/**
 * Verify that all 47 prefectures have at least one S-rank (75+) sauna.
 * Run: node scripts/verify-s-rank.mjs
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
const BASE = process.env.BASE_URL || "http://localhost:3004";

const ALL_PREFECTURES = [
  "北海道", "青森県", "岩手県", "宮城県", "秋田県", "山形県", "福島県",
  "茨城県", "栃木県", "群馬県", "埼玉県", "千葉県", "東京都", "神奈川県",
  "新潟県", "富山県", "石川県", "福井県", "山梨県", "長野県",
  "岐阜県", "静岡県", "愛知県", "三重県",
  "滋賀県", "京都府", "大阪府", "兵庫県", "奈良県", "和歌山県",
  "鳥取県", "島根県", "岡山県", "広島県", "山口県",
  "徳島県", "香川県", "愛媛県", "高知県",
  "福岡県", "佐賀県", "長崎県", "熊本県", "大分県", "宮崎県", "鹿児島県", "沖縄県",
];

async function main() {
  console.log("=== S-Rank Verification: All 47 Prefectures ===\n");

  const missing = [];
  const results = [];

  for (const pref of ALL_PREFECTURES) {
    // Get top-scoring sauna in this prefecture
    const { data, error } = await sb
      .from("saunas")
      .select("id, name, honmono_score, rating, score_detail")
      .eq("prefecture", pref)
      .not("honmono_score", "is", null)
      .order("honmono_score", { ascending: false })
      .limit(3);

    if (error || !data?.length) {
      // Try without honmono_score filter - get any facility
      const { data: anyData } = await sb
        .from("saunas")
        .select("id, name, rating")
        .eq("prefecture", pref)
        .order("rating", { ascending: false })
        .limit(1);

      if (anyData?.length) {
        missing.push({ pref, top: anyData[0], reason: "no scored facility" });
      } else {
        missing.push({ pref, top: null, reason: "no facility at all" });
      }
      continue;
    }

    const top = data[0];
    const scoreVersion = top.score_detail?.score_version;

    // Check if score needs recalculation (version < 3)
    if (scoreVersion !== 3) {
      // Trigger recalculation via score-debug
      try {
        const res = await fetch(`${BASE}/api/sauna/${top.id}/score-debug`);
        if (res.ok) {
          const debug = await res.json();
          results.push({
            pref,
            name: top.name,
            score: debug.result.overall,
            rank: debug.result.rank,
            id: top.id,
            recalculated: true,
          });
          continue;
        }
      } catch (e) {
        // Fall through to use cached score
      }
    }

    results.push({
      pref,
      name: top.name,
      score: top.honmono_score,
      rank: top.honmono_score >= 75 ? "S" : top.honmono_score >= 60 ? "A" : top.honmono_score >= 45 ? "B" : "C",
      id: top.id,
      recalculated: false,
    });
  }

  // Print results
  console.log("Prefecture | Top Facility | Score | Rank");
  console.log("-".repeat(80));

  let sRankCount = 0;
  for (const r of results) {
    const marker = r.rank === "S" ? "✓" : "✗";
    if (r.rank === "S") sRankCount++;
    console.log(`${marker} ${r.pref.padEnd(6)} | ${r.name.slice(0, 30).padEnd(30)} | ${String(r.score).padStart(3)} | ${r.rank}${r.recalculated ? " (v3)" : ""}`);
  }

  console.log("-".repeat(80));
  console.log(`\nS-Rank: ${sRankCount}/${results.length} prefectures`);

  if (missing.length > 0) {
    console.log("\n=== Missing Prefectures ===");
    for (const m of missing) {
      console.log(`  ${m.pref}: ${m.reason}${m.top ? ` (best: ${m.top.name})` : ""}`);
    }
  }

  // List non-S-rank prefectures
  const nonS = results.filter(r => r.rank !== "S");
  if (nonS.length > 0) {
    console.log("\n=== Non-S-Rank (need attention) ===");
    for (const r of nonS) {
      console.log(`  ${r.pref} | ${r.name} | ${r.score} (${r.rank}) | /api/sauna/${r.id}/score-debug`);
    }
  }

  console.log(`\n=== Summary ===`);
  console.log(`Total prefectures with scored facilities: ${results.length}/47`);
  console.log(`S-Rank coverage: ${sRankCount}/47`);
  console.log(`Missing: ${missing.length + nonS.length} prefectures need work`);
}

main().catch(console.error);
