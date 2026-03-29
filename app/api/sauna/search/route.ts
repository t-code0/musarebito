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
    console.error("Search error:", error);
    return NextResponse.json(
      { error: "検索中にエラーが発生しました" },
      { status: 500 }
    );
  }
}
