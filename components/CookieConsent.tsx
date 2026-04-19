"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const pathname = usePathname();
  const lang = pathname?.startsWith("/en") ? "en" : "ja";

  useEffect(() => {
    const consent = localStorage.getItem("cookie_consent");
    if (!consent) {
      setVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookie_consent", "accepted");
    setVisible(false);
  };

  const handleReject = () => {
    localStorage.setItem("cookie_consent", "rejected");
    setVisible(false);
    // Disable GA and AdSense cookies by removing scripts
    if (typeof window !== "undefined") {
      // Signal to GA to stop tracking
      (window as unknown as Record<string, unknown>)["ga-disable-GA_MEASUREMENT_ID"] = true;
    }
  };

  if (!visible) return null;

  const text =
    lang === "en"
      ? {
          message:
            "This site uses cookies for analytics, advertising, and functionality. You can accept or reject non-essential cookies.",
          accept: "Accept All",
          reject: "Reject Non-Essential",
          link: "Privacy Policy",
        }
      : {
          message:
            "当サイトでは分析、広告、機能提供のためCookieを使用しています。必須でないCookieを受け入れるか拒否するかを選択できます。",
          accept: "すべて受け入れる",
          reject: "必須のみ",
          link: "プライバシーポリシー",
        };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4">
      <div
        className="max-w-3xl mx-auto rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 shadow-2xl"
        style={{
          background: "rgba(10, 26, 10, 0.95)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(34, 197, 94, 0.3)",
        }}
      >
        <div className="flex-1 text-sm text-gray-300 leading-relaxed">
          {text.message}{" "}
          <a
            href={`/${lang}/privacy`}
            className="text-green-400 hover:underline"
          >
            {text.link}
          </a>
        </div>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={handleReject}
            className="px-4 py-2 text-sm rounded-lg border border-white/20 text-white/70 hover:bg-white/10 transition-colors"
          >
            {text.reject}
          </button>
          <button
            onClick={handleAccept}
            className="px-4 py-2 text-sm rounded-lg bg-green-600 text-white font-medium hover:bg-green-500 transition-colors"
          >
            {text.accept}
          </button>
        </div>
      </div>
    </div>
  );
}
