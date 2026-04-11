import { NextRequest, NextResponse } from "next/server";
import { getServiceSupabase as getServiceClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";

const VOTE_USER_PREFIX = "__vote__:";

/** GET — return vote tallies for a sauna */
export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const sb = getServiceClient();
  const { data, error } = await sb
    .from("sauna_reviews")
    .select("user_id")
    .eq("sauna_id", params.id)
    .like("user_id", `${VOTE_USER_PREFIX}%`);

  if (error) {
    return NextResponse.json({ up: 0, down: 0, total: 0, percentage: 0 });
  }

  let up = 0;
  let down = 0;
  for (const row of data || []) {
    if (row.user_id?.endsWith(":up")) up++;
    else if (row.user_id?.endsWith(":down")) down++;
  }
  const total = up + down;
  const percentage = total === 0 ? 0 : Math.round((up / total) * 100);
  return NextResponse.json({ up, down, total, percentage });
}

/** POST — record a single vote */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  let body: { type?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const type = body.type;
  if (type !== "up" && type !== "down") {
    return NextResponse.json(
      { error: "type must be 'up' or 'down'" },
      { status: 400 }
    );
  }

  const sb = getServiceClient();
  const { error } = await sb.from("sauna_reviews").insert({
    sauna_id: params.id,
    user_id: `${VOTE_USER_PREFIX}${type}`,
    rating: type === "up" ? 5 : 1,
    body: "",
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Return updated counts
  const { data: tally } = await sb
    .from("sauna_reviews")
    .select("user_id")
    .eq("sauna_id", params.id)
    .like("user_id", `${VOTE_USER_PREFIX}%`);

  let up = 0;
  let down = 0;
  for (const row of tally || []) {
    if (row.user_id?.endsWith(":up")) up++;
    else if (row.user_id?.endsWith(":down")) down++;
  }
  const total = up + down;
  const percentage = total === 0 ? 0 : Math.round((up / total) * 100);
  return NextResponse.json({ up, down, total, percentage });
}
