import { NextRequest, NextResponse } from "next/server";
import { getServiceSupabase as getServiceClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";

/**
 * Affiliate click tracking endpoint.
 *
 * Logs into the shared `affiliate_clicks` table (used by multiple HONMONO
 * projects). To distinguish musarebito clicks from other apps, every row is
 * tagged with `genre = 'musarebito:<source>'` and `shop_place_id` is prefixed
 * with `musarebito:`. Navigation is never blocked: if the insert fails for
 * any reason the endpoint still responds with 200.
 *
 * Existing shared schema:
 *   id, shop_place_id TEXT, shop_name TEXT, genre TEXT,
 *   link_type TEXT, clicked_at TIMESTAMPTZ
 */
export async function POST(request: NextRequest) {
  let body: { product_id?: string; keyword?: string; source?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid body" }, { status: 400 });
  }

  const product_id = (body.product_id || "").slice(0, 64);
  const keyword = (body.keyword || "").slice(0, 200);
  const source = (body.source || "unknown").slice(0, 64);
  if (!product_id) {
    return NextResponse.json({ error: "product_id required" }, { status: 400 });
  }

  const sb = getServiceClient();

  const insert = await sb.from("affiliate_clicks").insert({
    shop_place_id: `musarebito:${product_id}`,
    shop_name: keyword,
    genre: `musarebito:${source}`,
    link_type: "amazon",
  });

  if (insert.error) {
    console.warn("[affiliate/click] insert failed:", insert.error.message);
    return NextResponse.json({ ok: true, persisted: false });
  }
  return NextResponse.json({ ok: true, persisted: true });
}

/** GET — return aggregate click counts for musarebito-tagged rows. */
export async function GET() {
  const sb = getServiceClient();
  const { data, error } = await sb
    .from("affiliate_clicks")
    .select("shop_place_id, genre")
    .like("shop_place_id", "musarebito:%");

  if (error) {
    return NextResponse.json({ counts: {}, error: error.message });
  }

  const counts: Record<string, number> = {};
  for (const r of data || []) {
    const id = (r as { shop_place_id?: string }).shop_place_id || "";
    const product = id.replace(/^musarebito:/, "") || "unknown";
    counts[product] = (counts[product] || 0) + 1;
  }
  return NextResponse.json({ counts });
}
