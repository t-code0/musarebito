"use client";

import { useParams } from "next/navigation";

export default function WhiskerPage() {
  const params = useParams();
  const lang = params.lang as string;

  return (
    <main
      className="min-h-screen"
      style={{ background: "linear-gradient(180deg, #1a0a0a 0%, #2d1515 30%, #1a0a0a 100%)" }}
    >
      <div className="py-8 px-4 sm:px-6" style={{ background: "linear-gradient(180deg, #2d1515 0%, #1a0a0a 100%)" }}>
        <a href={`/${lang}`} className="text-red-300 hover:text-white text-sm mb-2 inline-block">
          ← トップに戻る
        </a>
        <h1 className="text-3xl font-bold text-white">🌿 ウィスカー一覧</h1>
        <p className="text-red-200/70 text-sm mt-2">日本のウィスキング施術者たち</p>
      </div>

      <div className="px-4 sm:px-6 py-8">
        <div className="text-center py-20">
          <p className="text-2xl text-red-300 mb-4">Coming Soon</p>
          <p className="text-red-200/70">ウィスカー情報を準備中です</p>
        </div>
      </div>
    </main>
  );
}
