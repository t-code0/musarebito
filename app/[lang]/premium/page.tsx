"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";

export default function PremiumPage() {
  const params = useParams();
  const lang = (params?.lang as string) || "ja";
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");
    try {
      const res = await fetch("/api/premium-waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || "エラーが発生しました");
        setStatus("error");
        return;
      }
      setStatus("success");
    } catch {
      setErrorMsg("通信エラーが発生しました");
      setStatus("error");
    }
  };

  const features = [
    { icon: "\uD83D\uDCCA", title: "混雑データ", desc: "時間帯別の混雑状況がわかる" },
    { icon: "\uD83D\uDCC8", title: "詳細分析", desc: "サウナ室の温度推移・水風呂データ" },
    { icon: "\uD83D\uDEAB", title: "広告非表示", desc: "快適な閲覧体験" },
  ];

  return (
    <div
      className="min-h-screen text-white"
      style={{
        background: "linear-gradient(180deg, #1a0a0a 0%, #2d1515 30%, #1a0a0a 100%)",
      }}
    >
      <div className="max-w-3xl mx-auto px-4 py-12">
        <Link
          href={`/${lang}`}
          className="inline-block mb-8 text-gray-400 hover:text-white text-sm"
        >
          &larr; トップへ戻る
        </Link>

        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-3">蒸され人プレミアム</h1>
          <p className="text-gray-300 text-lg">もっと深く、サウナを知る。</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-3 mb-12">
          {features.map((f, i) => (
            <div
              key={i}
              className="rounded-2xl p-6 text-center"
              style={{
                background: "rgba(255,255,255,0.05)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              <div className="text-4xl mb-3">{f.icon}</div>
              <h2 className="font-semibold text-lg mb-2">{f.title}</h2>
              <p className="text-gray-300 text-sm">{f.desc}</p>
            </div>
          ))}
        </div>

        <div className="text-center mb-8">
          <p className="text-2xl font-bold mb-1">
            月額<span className="text-amber-500">480</span>円
          </p>
          <p className="text-gray-400 text-sm">（税込）</p>
        </div>

        <div
          className="max-w-md mx-auto rounded-2xl p-8"
          style={{
            background: "rgba(255,255,255,0.05)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          {status === "success" ? (
            <p className="text-center text-green-400 font-semibold">
              登録しました！リリース時にお知らせします。
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <p className="text-center font-semibold mb-2">リリース時に通知を受け取る</p>
              <input
                type="email"
                placeholder="メールアドレス"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-amber-500"
              />
              {status === "error" && (
                <p className="text-red-400 text-sm">{errorMsg}</p>
              )}
              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full py-3 rounded-xl font-semibold text-white transition-colors"
                style={{ background: "#D97706" }}
              >
                {status === "loading" ? "送信中..." : "通知を受け取る"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
