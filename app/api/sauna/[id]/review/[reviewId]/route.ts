import { NextRequest, NextResponse } from "next/server";
import { getServiceSupabase as getServiceClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; reviewId: string } }
) {
  const adminKey = request.headers.get("x-admin-key");
  const envKey = process.env.ADMIN_KEY;

  if (!envKey || !adminKey || adminKey !== envKey) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sb = getServiceClient();

  const { error } = await sb
    .from("sauna_reviews")
    .delete()
    .eq("id", params.reviewId)
    .eq("sauna_id", params.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
