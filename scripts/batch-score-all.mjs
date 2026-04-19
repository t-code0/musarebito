#!/usr/bin/env node
/**
 * Trigger score calculation for all unscored saunas (or outdated scores).
 * Hits /api/sauna/[id] to trigger inline score calculation.
 * Run: node scripts/batch-score-all.mjs
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
const TARGET_VERSION = 3;

async function main() {
  // Fetch all saunas that need scoring
  const { data: saunas, error } = await sb
    .from("saunas")
    .select("id, name, prefecture, honmono_score, score_detail, rating")
    .order("rating", { ascending: false });

  if (error) {
    console.error("Failed to fetch saunas:", error.message);
    process.exit(1);
  }

  // Filter to those needing rescore
  const needScore = saunas.filter(s => {
    if (!s.honmono_score) return true;
    const ver = s.score_detail?.score_version;
    return ver !== TARGET_VERSION;
  });

  console.log(`Total saunas: ${saunas.length}`);
  console.log(`Need scoring: ${needScore.length}`);
  console.log();

  let scored = 0;
  let failed = 0;

  for (let i = 0; i < needScore.length; i++) {
    const s = needScore[i];
    process.stdout.write(`[${i + 1}/${needScore.length}] ${s.name.slice(0, 30)}... `);

    try {
      const res = await fetch(`${BASE}/api/sauna/${s.id}`, {
        headers: { "Accept": "application/json" },
      });

      if (res.ok) {
        const data = await res.json();
        const score = data.sauna?.honmono_score || data.honmono_score;
        console.log(`score=${score || "?"}`);
        scored++;
      } else {
        console.log(`HTTP ${res.status}`);
        failed++;
      }
    } catch (e) {
      console.log(`ERROR: ${e.message}`);
      failed++;
    }

    // Throttle to avoid overwhelming the server
    if (i % 5 === 4) {
      await new Promise(r => setTimeout(r, 2000));
    } else {
      await new Promise(r => setTimeout(r, 500));
    }
  }

  console.log(`\nDone! Scored: ${scored}, Failed: ${failed}`);
}

main().catch(console.error);
