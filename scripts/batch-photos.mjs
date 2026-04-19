#!/usr/bin/env node
import { readFileSync } from "fs";

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
  // Get saunas with no photos
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/saunas?select=id,name,place_id,website&or=(photos.is.null,photos.eq.[])&place_id=not.is.null&order=rating.desc`,
    { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } }
  );
  const saunas = await res.json();
  console.log(`=== Batch Photos: ${saunas.length} saunas to process ===`);

  let done = 0, failed = 0;

  for (const s of saunas) {
    try {
      const t0 = Date.now();
      const r = await fetch(`${BASE_URL}/api/sauna/${s.id}`);
      const d = await r.json();
      const elapsed = ((Date.now() - t0) / 1000).toFixed(1);
      const count = d.sauna?.photos?.length || 0;
      if (count > 0) {
        done++;
        console.log(`  [${done + failed}/${saunas.length}] ${s.name} → ${count} photos (${elapsed}s)`);
      } else {
        failed++;
        console.log(`  [${done + failed}/${saunas.length}] ${s.name} → 0 photos (${elapsed}s)`);
      }
    } catch (e) {
      failed++;
      console.log(`  [ERR] ${s.name}: ${e.message}`);
    }
    await new Promise((r) => setTimeout(r, 5000));
  }

  // Final count
  const countRes = await fetch(
    `${SUPABASE_URL}/rest/v1/saunas?select=id&photos=not.is.null&photos=neq.[]`,
    { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, Prefer: "count=exact" } }
  );
  const total = countRes.headers.get("content-range")?.split("/")[1] || "?";

  console.log(`\n=== Done: ${done} with photos, ${failed} without ===`);
  console.log(`Total saunas with photos: ${total}`);
}

run().catch(console.error);
