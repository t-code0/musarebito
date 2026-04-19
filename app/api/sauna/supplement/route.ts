import { NextRequest, NextResponse } from "next/server";
import { scrapeSaunaFacilities } from "@/lib/scrape-sauna-sites";
import { registerMissingSaunas } from "@/lib/places";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const prefecture = searchParams.get("prefecture");

  if (!prefecture) {
    return NextResponse.json({ error: "prefecture required" }, { status: 400 });
  }

  try {
    // 1. Scrape external sites for facility names
    const facilities = await scrapeSaunaFacilities(prefecture);
    console.log(`[supplement] ${prefecture}: found ${facilities.length} facilities from external sites`);

    // 2. Register missing ones via Google Places API
    const result = await registerMissingSaunas(facilities, prefecture);

    return NextResponse.json({
      scraped: facilities.length,
      ...result,
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("Supplement error:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
