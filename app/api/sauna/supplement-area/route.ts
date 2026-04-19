import { NextRequest, NextResponse } from "next/server";
import { seedSearch } from "@/lib/places";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const keywords = searchParams.get("keywords")?.split(",").filter(Boolean);
  const prefecture = searchParams.get("prefecture");

  if (!keywords?.length || !prefecture) {
    return NextResponse.json({ error: "keywords and prefecture required" }, { status: 400 });
  }

  const results: { keyword: string; count: number }[] = [];
  for (const kw of keywords.slice(0, 10)) {
    try {
      const c1 = await seedSearch(`サウナ ${kw}`, prefecture);
      const c2 = await seedSearch(`温泉 ${kw}`, prefecture);
      results.push({ keyword: kw, count: c1 + c2 });
    } catch {
      results.push({ keyword: kw, count: 0 });
    }
  }

  return NextResponse.json({ results });
}
