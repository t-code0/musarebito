"use client";
import Link from "next/link";
import { useParams } from "next/navigation";

const CONTENT = {
  ja: {
    back: "トップへ戻る",
    title: "特定商取引法に基づく表記",
    updated: "最終更新: 2026年4月",
    rows: [
      { label: "事業者名", value: "HONMONO（個人事業）" },
      { label: "運営責任者", value: "請求があった場合、遅滞なく開示いたします" },
      { label: "所在地", value: "請求があった場合、遅滞なく開示いたします" },
      { label: "連絡先", value: "info@musarebito.com\n※お問い合わせはメールにて承ります" },
      { label: "サービス名", value: "蒸され人（むされびと）" },
      { label: "サービスURL", value: "https://musarebito.vercel.app" },
      { label: "販売価格", value: "各サービスページに表示する価格に準じます\n※現在、有料サービスは提供しておりません" },
      { label: "支払方法", value: "有料サービス提供時に別途記載します" },
      { label: "支払時期", value: "有料サービス提供時に別途記載します" },
      { label: "サービスの提供時期", value: "申込み手続き完了後、速やかに提供します" },
      { label: "返品・キャンセル", value: "デジタルサービスの性質上、サービス提供開始後の返金はいたしません。ただし、サービスが正常に提供されなかった場合は個別に対応いたします。" },
      { label: "動作環境", value: "モダンブラウザ（Chrome, Safari, Firefox, Edge の最新版）を推奨。インターネット接続が必要です。" },
    ],
  },
  en: {
    back: "Back to Home",
    title: "Legal Notice (Specified Commercial Transactions Act)",
    updated: "Last updated: April 2026",
    rows: [
      { label: "Business Name", value: "HONMONO (Sole Proprietorship)" },
      { label: "Responsible Person", value: "Disclosed without delay upon request" },
      { label: "Address", value: "Disclosed without delay upon request" },
      { label: "Contact", value: "info@musarebito.com\n* Inquiries accepted via email" },
      { label: "Service Name", value: "Musarebito" },
      { label: "Service URL", value: "https://musarebito.vercel.app" },
      { label: "Pricing", value: "As displayed on each service page\n* No paid services are currently offered" },
      { label: "Payment Methods", value: "To be specified when paid services are offered" },
      { label: "Payment Timing", value: "To be specified when paid services are offered" },
      { label: "Service Delivery", value: "Provided promptly after application is completed" },
      { label: "Refund / Cancellation", value: "Due to the nature of digital services, refunds are not available after service delivery begins. However, we will handle cases individually if the service was not properly delivered." },
      { label: "System Requirements", value: "Modern browsers recommended (latest Chrome, Safari, Firefox, Edge). Internet connection required." },
    ],
  },
};

export default function LegalPage() {
  const params = useParams();
  const lang = ((params?.lang as string) || "ja") as "ja" | "en";
  const c = CONTENT[lang] || CONTENT.ja;

  return (
    <div
      className="min-h-screen text-white"
      style={{
        background:
          "linear-gradient(180deg, #0a1a0a 0%, #152d15 30%, #0a1a0a 100%)",
      }}
    >
      <div className="max-w-3xl mx-auto px-4 py-12">
        <Link
          href={`/${lang}`}
          className="inline-block mb-8 text-gray-400 hover:text-white text-sm"
        >
          &larr; {c.back}
        </Link>

        <h1 className="text-3xl font-bold mb-8">{c.title}</h1>

        <div className="bg-white/5 rounded-2xl p-6">
          <table className="w-full">
            <tbody>
              {c.rows.map((r, i) => (
                <tr
                  key={i}
                  className="border-b border-white/10 last:border-b-0"
                >
                  <th className="text-left text-sm font-semibold text-white py-4 pr-4 align-top w-1/3 whitespace-nowrap">
                    {r.label}
                  </th>
                  <td className="text-sm text-gray-300 py-4 leading-relaxed whitespace-pre-line">
                    {r.value}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-gray-500 text-xs mt-12">{c.updated}</p>
      </div>
    </div>
  );
}
