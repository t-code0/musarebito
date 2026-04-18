#!/usr/bin/env node
// Batch score v2: recalculate ALL saunas (version check triggers rescore)
import { readFileSync } from "fs";

// Load env
const envContent = readFileSync(".env.local", "utf8");
const env = {};
envContent.split("\n").forEach((line) => {
  const m = line.match(/^([^#=]+)=(.*)$/);
  if (m) env[m[1].trim()] = m[2].trim();
});

const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = env.SUPABASE_SERVICE_ROLE_KEY;
const BASE_URL = process.argv[2] || "https://musarebito.vercel.app";

async function run() {
  // Get ALL saunas with reviews (v2 version check triggers rescore)
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/saunas?select=id,name&google_reviews=not.is.null&order=rating.desc`,
    {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
      },
    }
  );
  const saunas = await res.json();

  // Filter out saunas with empty reviews
  const targets = [];
  for (const s of saunas) {
    const r2 = await fetch(
      `${SUPABASE_URL}/rest/v1/saunas?select=google_reviews&id=eq.${s.id}`,
      {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
        },
      }
    );
    const data = await r2.json();
    const reviews = data[0]?.google_reviews;
    if (reviews && reviews.length > 0 && reviews.some((r) => r.text)) {
      targets.push(s);
    }
  }

  console.log(`=== Batch Score: ${targets.length} saunas to process ===`);
  let done = 0;
  let failed = 0;

  for (const s of targets) {
    try {
      const t0 = Date.now();
      const r = await fetch(`${BASE_URL}/api/sauna/${s.id}`);
      const d = await r.json();
      const elapsed = ((Date.now() - t0) / 1000).toFixed(1);
      const score = d.sauna?.honmono_score;
      if (score != null) {
        done++;
        console.log(`  [${done}/${targets.length}] ${s.name} → ${score}点 (${elapsed}s)`);
      } else {
        failed++;
        console.log(`  [SKIP] ${s.name} → no score (${elapsed}s)`);
      }
    } catch (e) {
      failed++;
      console.log(`  [ERR] ${s.name}: ${e.message}`);
    }
    // Wait 3s between requests
    await new Promise((r) => setTimeout(r, 3000));
  }

  // Final count
  const countRes = await fetch(
    `${SUPABASE_URL}/rest/v1/saunas?select=id&honmono_score=not.is.null`,
    {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        Prefer: "count=exact",
      },
    }
  );
  const totalScored = countRes.headers.get("content-range")?.split("/")[1] || "?";

  console.log(`\n=== Done: ${done} scored, ${failed} failed ===`);
  console.log(`Total saunas with score: ${totalScored}`);
}

run().catch(console.error);
