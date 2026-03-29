import { NextRequest, NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabase";
import { generateSummary, calculateHonmonoScore } from "@/lib/claude";
import { Sauna } from "@/types/sauna";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = getServiceSupabase();

  try {
    const { data: sauna, error } = await supabase
      .from("saunas")
      .select("*")
      .eq("id", params.id)
      .single();

    if (error || !sauna) {
      return NextResponse.json(
        { error: "サウナが見つかりません" },
        { status: 404 }
      );
    }

    const saunaData = sauna as Sauna;

    // Auto-generate AI summary if missing
    if (!saunaData.ai_summary) {
      const [summary, scoreResult] = await Promise.all([
        generateSummary(
          saunaData.name,
          saunaData.google_reviews,
          saunaData.address
        ),
        calculateHonmonoScore(
          saunaData.name,
          saunaData.google_reviews,
          saunaData.rating
        ),
      ]);

      await supabase
        .from("saunas")
        .update({
          ai_summary: summary,
          honmono_score: scoreResult.score,
          score_detail: scoreResult.detail,
          updated_at: new Date().toISOString(),
        })
        .eq("id", params.id);

      saunaData.ai_summary = summary;
      saunaData.honmono_score = scoreResult.score;
      saunaData.score_detail = scoreResult.detail;
    }

    // Fetch reviews
    const { data: reviews } = await supabase
      .from("sauna_reviews")
      .select("*")
      .eq("sauna_id", params.id)
      .order("created_at", { ascending: false });

    return NextResponse.json({ sauna: saunaData, reviews: reviews || [] });
  } catch (error) {
    console.error("Sauna detail error:", error);
    return NextResponse.json(
      { error: "データの取得中にエラーが発生しました" },
      { status: 500 }
    );
  }
}
