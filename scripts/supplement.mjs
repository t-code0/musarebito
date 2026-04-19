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
const BASE_URL = process.argv[3] || "https://musarebito.vercel.app";
const prefecture = process.argv[2];

if (!prefecture) {
  console.log("Usage: node scripts/supplement.mjs 神奈川県");
  process.exit(1);
}

async function countDB(pref) {
  const r = await fetch(`${SUPABASE_URL}/rest/v1/saunas?select=id&prefecture=eq.${encodeURIComponent(pref)}`, {
    headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, Prefer: "count=exact" }
  });
  return r.headers.get("content-range")?.split("/")[1] || "?";
}

async function run() {
  console.log(`=== Supplement: ${prefecture} ===`);
  console.log("Before:", await countDB(prefecture), "facilities");

  let totalRegistered = 0;
  let totalExisting = 0;
  let round = 0;

  while (round < 15) {
    round++;
    console.log(`\n--- Round ${round} ---`);
    try {
      const r = await fetch(`${BASE_URL}/api/sauna/supplement?prefecture=${encodeURIComponent(prefecture)}`);
      const d = await r.json();
      if (d.error) { console.log("Error:", d.error); break; }

      console.log(`Scraped: ${d.scraped}, Registered: ${d.registered?.length}, Existing: ${d.existing?.length}`);
      if (d.registered?.length) console.log("New:", d.registered.join(", "));

      totalRegistered += d.registered?.length || 0;
      totalExisting += d.existing?.length || 0;

      // If no new registrations, we're done
      if (!d.registered?.length) {
        console.log("No new facilities to register. Done.");
        break;
      }
    } catch (e) {
      console.log("Request failed (timeout?), retrying...");
    }

    // Wait 5s between rounds
    await new Promise(r => setTimeout(r, 5000));
  }

  console.log(`\n=== Summary ===`);
  console.log(`Total registered: ${totalRegistered}`);
  console.log(`Total existing: ${totalExisting}`);
  console.log("After:", await countDB(prefecture), "facilities");
}

run().catch(console.error);
