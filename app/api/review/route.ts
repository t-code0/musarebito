import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sauna_id, user_id, rating, body: reviewBody, photo_url } = body;

    // Validation
    if (!sauna_id || !user_id || !rating || !reviewBody) {
      return NextResponse.json(
        { error: "sauna_id, user_id, rating, bodyは必須です" },
        { status: 400 }
      );
    }

    if (typeof rating !== "number" || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "ratingは1〜5の数値で指定してください" },
        { status: 400 }
      );
    }

    if (typeof reviewBody !== "string" || reviewBody.trim().length === 0) {
      return NextResponse.json(
        { error: "口コミ本文を入力してください" },
        { status: 400 }
      );
    }

    if (reviewBody.length > 1000) {
      return NextResponse.json(
        { error: "口コミは1000文字以内で入力してください" },
        { status: 400 }
      );
    }

    const { data, error } = await getSupabase()
      .from("reviews")
      .insert({
        sauna_id,
        user_id,
        rating,
        body: reviewBody.trim(),
        photo_url: photo_url || null,
      })
      .select()
      .single();

    if (error) {
      console.error("Review insert error:", error);
      return NextResponse.json(
        { error: "口コミの投稿に失敗しました" },
        { status: 500 }
      );
    }

    return NextResponse.json({ review: data }, { status: 201 });
  } catch (error) {
    console.error("Review error:", error);
    return NextResponse.json(
      { error: "口コミの投稿中にエラーが発生しました" },
      { status: 500 }
    );
  }
}
