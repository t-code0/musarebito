import { NextRequest, NextResponse } from "next/server";
import { seedSearch } from "@/lib/places";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  const { queries } = await request.json() as { queries: { q: string; prefecture: string }[] };

  if (!queries?.length) {
    return NextResponse.json({ error: "queries required" }, { status: 400 });
  }

  const results: { query: string; count: number }[] = [];
  for (const { q, prefecture } of queries) {
    try {
      const count = await seedSearch(q, prefecture);
      results.push({ query: q, count });
    } catch (e) {
      results.push({ query: q, count: -1 });
      console.error(`Seed error for "${q}":`, e);
    }
  }

  return NextResponse.json({ results });
}
