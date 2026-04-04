#!/usr/bin/env node
// Post-deploy smoke test
const BASE_URL = process.argv[2] || "https://musarebito.vercel.app";
let pass = 0, fail = 0;

function check(name, ok) {
  if (ok) { console.log(`  PASS: ${name}`); pass++; }
  else { console.log(`  FAIL: ${name}`); fail++; }
}

async function run() {
  console.log(`=== Smoke Test: ${BASE_URL} ===`);

  // Test 1: Search API
  console.log("[1] Search API (神奈川県)");
  let searchData;
  try {
    const res = await fetch(`${BASE_URL}/api/sauna/search?prefecture=神奈川県`);
    searchData = await res.json();
    check("HTTP 200 & has saunas", res.ok && searchData.saunas?.length > 0);
    check(`${searchData.saunas?.filter(s => s.photos?.length > 0).length} saunas with photos`,
      searchData.saunas?.some(s => s.photos?.length > 0));
  } catch (e) {
    check("Search API reachable", false);
    console.error("  ", e.message);
  }

  // Test 2: Detail API
  const saunaId = searchData?.saunas?.[0]?.id;
  if (saunaId) {
    console.log(`[2] Detail API (${saunaId})`);
    const t0 = Date.now();
    try {
      const res = await fetch(`${BASE_URL}/api/sauna/${saunaId}`);
      const elapsed = (Date.now() - t0) / 1000;
      const data = await res.json();
      check("Has sauna data", !!data.sauna?.name);
      check(`Response under 2s (was ${elapsed.toFixed(2)}s)`, elapsed < 2.0);
      check("Has reviews array", Array.isArray(data.reviews));
    } catch (e) {
      check("Detail API reachable", false);
      console.error("  ", e.message);
    }
  } else {
    console.log("[2] SKIP: No sauna ID");
    fail++;
  }

  // Test 3: Homepage (follows language redirect)
  console.log("[3] Homepage");
  try {
    const res = await fetch(`${BASE_URL}/ja`, { redirect: "follow" });
    check(`Homepage returns 200 (got ${res.status})`, res.ok);
  } catch (e) {
    check("Homepage reachable", false);
  }

  console.log(`\n=== Results: ${pass} passed, ${fail} failed ===`);
  process.exit(fail);
}

run();
