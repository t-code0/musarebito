#!/usr/bin/env node
// Prefetch photos for popular prefectures
const BASE_URL = process.argv[2] || "https://musarebito.vercel.app";
const PREFECTURES = ["東京都", "神奈川県", "大阪府"];

async function run() {
  console.log("=== Photo Prefetch ===");
  for (const pref of PREFECTURES) {
    const t0 = Date.now();
    try {
      const res = await fetch(`${BASE_URL}/api/sauna/search?prefecture=${encodeURIComponent(pref)}`);
      const data = await res.json();
      const elapsed = ((Date.now() - t0) / 1000).toFixed(1);
      const total = data.saunas?.length || 0;
      const withPhotos = data.saunas?.filter(s => s.photos?.length > 0).length || 0;
      console.log(`  ${pref}: ${total} saunas, ${withPhotos} with photos (${elapsed}s)`);
    } catch (e) {
      console.log(`  ${pref}: ERROR - ${e.message}`);
    }
  }
  console.log("=== Done ===");
}

run();
