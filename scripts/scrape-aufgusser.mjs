/**
 * Scrape aufgusser names from:
 * 1. https://saunassa.net/aufgusser-list/
 * 2. https://onsen.nifty.com/rank/sauna/department/aufgusser.html
 *
 * Then insert into sauna_performers table with type='aufgusser'
 */

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";

// Load env manually
const envContent = readFileSync(".env.local", "utf8");
const env = {};
envContent.split("\n").forEach((line) => {
  const m = line.match(/^([^#=]+)=(.*)$/);
  if (m) env[m[1].trim()] = m[2].trim();
});

const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const sb = createClient(SUPABASE_URL, SUPABASE_KEY);

const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

async function fetchHTML(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 15000);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { "User-Agent": UA },
    });
    clearTimeout(timer);
    if (!res.ok) {
      console.error(`Failed to fetch ${url}: ${res.status}`);
      return "";
    }
    return await res.text();
  } catch (e) {
    clearTimeout(timer);
    console.error(`Error fetching ${url}:`, e.message);
    return "";
  }
}

/** Parse saunassa.net aufgusser list */
function parseSaunassa(html) {
  const names = [];
  // Look for names in heading tags, list items, table cells, etc.
  // Typical patterns: <h2>, <h3>, <h4>, <td>, <li> containing performer names
  // Also try common WordPress patterns with entry-card or post titles

  // Pattern 1: h2/h3/h4 tags with names
  const headingRegex = /<h[2-4][^>]*>([^<]+)<\/h[2-4]>/gi;
  let m;
  while ((m = headingRegex.exec(html)) !== null) {
    const text = m[1].trim().replace(/&amp;/g, "&").replace(/&nbsp;/g, " ");
    // Filter out navigation/common headings
    if (text.length >= 2 && text.length <= 30 && !text.includes("メニュー") && !text.includes("目次") && !text.includes("アウフグーサー一覧") && !text.includes("コメント") && !text.includes("関連") && !text.includes("おすすめ") && !text.includes("カテゴリ") && !text.includes("アーカイブ") && !text.includes("サイト") && !text.includes("最新") && !text.includes("人気") && !text.includes("ランキング") && !text.includes("プロフィール")) {
      names.push(text);
    }
  }

  // Pattern 2: strong tags within paragraphs (common for name highlights)
  const strongRegex = /<strong>([^<]+)<\/strong>/gi;
  while ((m = strongRegex.exec(html)) !== null) {
    const text = m[1].trim().replace(/&amp;/g, "&").replace(/&nbsp;/g, " ");
    if (text.length >= 2 && text.length <= 30 && !names.includes(text) && !/[a-zA-Z]{5,}/.test(text) && !text.includes("目次") && !text.includes("一覧")) {
      names.push(text);
    }
  }

  // Pattern 3: list items that look like names
  const liRegex = /<li[^>]*>([^<]{2,30})<\/li>/gi;
  while ((m = liRegex.exec(html)) !== null) {
    const text = m[1].trim().replace(/&amp;/g, "&");
    if (text.length >= 2 && text.length <= 30 && !names.includes(text) && /[\u3000-\u9FFF]/.test(text)) {
      names.push(text);
    }
  }

  return names;
}

/** Parse nifty onsen aufgusser ranking page */
function parseNifty(html) {
  const names = [];
  // Nifty uses structured ranking pages
  // Common patterns: <span class="name">, <h3>, <a> with performer names
  // Also: ranking cards with name inside

  // Pattern 1: Look for name-like content in ranking entries
  const nameRegex = /<(?:h[2-4]|span|a|div)[^>]*class="[^"]*(?:name|title|heading)[^"]*"[^>]*>([^<]+)</gi;
  let m;
  while ((m = nameRegex.exec(html)) !== null) {
    const text = m[1].trim().replace(/&amp;/g, "&").replace(/&nbsp;/g, " ");
    if (text.length >= 2 && text.length <= 30 && /[\u3000-\u9FFF]/.test(text)) {
      names.push(text);
    }
  }

  // Pattern 2: td cells in ranking tables
  const tdRegex = /<td[^>]*>([^<]{2,30})<\/td>/gi;
  while ((m = tdRegex.exec(html)) !== null) {
    const text = m[1].trim().replace(/&amp;/g, "&");
    if (text.length >= 2 && text.length <= 30 && /[\u3000-\u9FFF]/.test(text) && !names.includes(text) && !/^\d+$/.test(text)) {
      names.push(text);
    }
  }

  // Pattern 3: Links with Japanese names
  const linkRegex = /<a[^>]*>([^<]{2,30})<\/a>/gi;
  while ((m = linkRegex.exec(html)) !== null) {
    const text = m[1].trim().replace(/&amp;/g, "&");
    if (text.length >= 2 && text.length <= 30 && /[\u3000-\u9FFF]/.test(text) && !names.includes(text) && !text.includes("ページ") && !text.includes("トップ") && !text.includes("一覧") && !text.includes("ランキング")) {
      names.push(text);
    }
  }

  // Pattern 4: h3 tags (aufgusser names in ranking)
  const h3Regex = /<h3[^>]*>([^<]+)<\/h3>/gi;
  while ((m = h3Regex.exec(html)) !== null) {
    const text = m[1].trim().replace(/&amp;/g, "&").replace(/&nbsp;/g, " ").replace(/^\d+[\.\s位]+/, "");
    if (text.length >= 2 && text.length <= 30 && !names.includes(text) && /[\u3000-\u9FFF]/.test(text)) {
      names.push(text);
    }
  }

  return names;
}

async function main() {
  console.log("=== Aufgusser Scraping Start ===\n");

  // 1. Fetch existing performers to check duplicates
  const { data: existing } = await sb.from("sauna_performers").select("name").eq("type", "aufgusser");
  const existingNames = new Set((existing || []).map((p) => p.name));
  console.log(`Existing aufgusser count: ${existingNames.size}`);

  const allNewNames = [];

  // 2. Scrape saunassa.net
  console.log("\nFetching saunassa.net...");
  const html1 = await fetchHTML("https://saunassa.net/aufgusser-list/");
  if (html1) {
    const names1 = parseSaunassa(html1);
    console.log(`saunassa.net: found ${names1.length} names`);
    names1.forEach((n) => console.log(`  - ${n}`));
    allNewNames.push(...names1);
  } else {
    console.log("saunassa.net: failed to fetch");
  }

  // 3. Scrape nifty onsen
  console.log("\nFetching onsen.nifty.com...");
  const html2 = await fetchHTML("https://onsen.nifty.com/rank/sauna/department/aufgusser.html");
  if (html2) {
    const names2 = parseNifty(html2);
    console.log(`onsen.nifty.com: found ${names2.length} names`);
    names2.forEach((n) => console.log(`  - ${n}`));
    allNewNames.push(...names2);
  } else {
    console.log("onsen.nifty.com: failed to fetch");
  }

  // 4. Deduplicate
  const seen = new Set();
  const uniqueNew = [];
  for (const name of allNewNames) {
    const normalized = name.replace(/[\s　]+/g, "");
    if (!seen.has(normalized) && !existingNames.has(name)) {
      seen.add(normalized);
      uniqueNew.push(name);
    }
  }

  console.log(`\nNew unique names to add: ${uniqueNew.length}`);

  if (uniqueNew.length === 0) {
    console.log("No new aufgusser to add.");
    return;
  }

  // 5. Insert into DB
  const rows = uniqueNew.map((name) => ({
    name,
    type: "aufgusser",
    description: "熱波師",
  }));

  const { error } = await sb.from("sauna_performers").insert(rows);
  if (error) {
    console.error("Insert error:", error.message);
  } else {
    console.log(`\nSuccessfully added ${uniqueNew.length} aufgusser:`);
    uniqueNew.forEach((n) => console.log(`  + ${n}`));
  }

  console.log("\n=== Done ===");
}

main().catch(console.error);
