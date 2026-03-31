import { NextRequest, NextResponse } from "next/server";
import { searchSaunas } from "@/lib/places";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") || "";
  const prefecture = searchParams.get("prefecture") || undefined;

  if (!query && !prefecture) {
    return NextResponse.json(
      { error: "検索キーワードまたは都道府県を指定してください" },
      { status: 400 }
    );
  }

  try {
    const saunas = await searchSaunas(query, prefecture);
    return NextResponse.json({ saunas });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("Search error:", msg, error);
    return NextResponse.json(
      { error: "検索中にエラーが発生しました", detail: msg },
      { status: 500 }
    );
  }
}
