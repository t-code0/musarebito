#!/usr/bin/env node
/**
 * Batch refresh photos for all facilities with <5 photos.
 * Uses the local dev server's refresh API.
 * Run: node scripts/batch-refresh-photos.mjs
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
const BASE = process.env.BASE_URL || "http://localhost:3005";

async function main() {
  // Get all facilities with <5 photos that have a place_id
  const { data, error } = await sb
    .from("saunas")
    .select("id, name, photos, place_id")
    .not("place_id", "is", null)
    .order("name");

  if (error) { console.error(error); process.exit(1); }

  const needRefresh = data.filter(s => {
    const count = Array.isArray(s.photos) ? s.photos.length : 0;
    return count < 5;
  });

  console.log(`Total: ${data.length}, Need refresh (<5 photos): ${needRefresh.length}`);

  let success = 0, fail = 0;
  for (let i = 0; i < needRefresh.length; i++) {
    const s = needRefresh[i];
    const oldCount = Array.isArray(s.photos) ? s.photos.length : 0;
    process.stdout.write(`[${i+1}/${needRefresh.length}] ${s.name.slice(0,25).padEnd(25)} (${oldCount})... `);

    try {
      const res = await fetch(`${BASE}/api/sauna/refresh/${s.id}`, { method: "POST" });
      if (res.ok) {
        success++;
        process.stdout.write("OK\n");
      } else {
        fail++;
        process.stdout.write(`HTTP ${res.status}\n`);
      }
    } catch (e) {
      fail++;
      process.stdout.write(`ERR\n`);
    }

    // Throttle: 1s between requests, 3s every 10
    if (i % 10 === 9) await new Promise(r => setTimeout(r, 3000));
    else await new Promise(r => setTimeout(r, 1000));
  }

  console.log(`\nDone! Success: ${success}, Failed: ${fail}`);

  // Verify
  const { data: after } = await sb
    .from("saunas")
    .select("id, photos")
    .not("place_id", "is", null);

  let under5 = 0;
  for (const s of after) {
    const c = Array.isArray(s.photos) ? s.photos.length : 0;
    if (c < 5) under5++;
  }
  console.log(`After refresh: ${under5}/${after.length} still have <5 photos`);
}

main().catch(console.error);
