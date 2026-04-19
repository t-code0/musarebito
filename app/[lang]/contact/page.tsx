"use client";
import Link from "next/link";
import { useParams } from "next/navigation";

const CONTENT = {
  ja: {
    back: "トップへ戻る",
    title: "お問い合わせ",
    updated: "最終更新: 2026年4月",
    intro:
      "蒸され人に関するお問い合わせ、苦情、削除依頼、法的請求等は下記の方法でご連絡ください。",
    categories: [
      {
        icon: "📧",
        title: "一般的なお問い合わせ",
        body: "サービスに関するご質問、ご意見、ご要望はこちら。",
        contact: "info@musarebito.com",
      },
      {
        icon: "🗑️",
        title: "コンテンツ削除依頼",
        body: "口コミ、施設情報等の削除をご希望の場合、対象URL・削除理由を明記の上ご連絡ください。正当な理由がある場合、速やかに対応いたします。",
        contact: "info@musarebito.com（件名に「削除依頼」と明記）",
      },
      {
        icon: "⚖️",
        title: "著作権侵害の申立て",
        body: "著作権侵害に関する申立ては、以下の情報を含めてご連絡ください：\n\n• 権利者の氏名・連絡先\n• 侵害されたと思われる著作物の特定\n• 当サイト上の侵害コンテンツのURL\n• 侵害の事実を確認する声明\n• 権利者本人（または正当な代理人）である旨の声明",
        contact: "info@musarebito.com（件名に「著作権申立て」と明記）",
      },
      {
        icon: "🔒",
        title: "個人情報に関する要求",
        body: "個人データの開示・訂正・削除・利用停止の要求（GDPR/CCPA等に基づく権利行使を含む）はこちら。本人確認の上、原則30日以内に対応いたします。",
        contact: "info@musarebito.com（件名に「個人情報要求」と明記）",
      },
      {
        icon: "📋",
        title: "法的請求・苦情",
        body: "法的請求、施設運営者様からのお問い合わせ、その他苦情はこちら。",
        contact: "info@musarebito.com（件名に「法的請求」と明記）",
      },
    ],
    response:
      "通常、3営業日以内にご返信いたします。内容によっては対応にお時間をいただく場合がございます。",
    note: "※ 個別の施設に対する苦情、施設との紛争解決は当サイトの対応範囲外です。施設に直接お問い合わせください。",
  },
  en: {
    back: "Back to Home",
    title: "Contact",
    updated: "Last updated: April 2026",
    intro:
      "For inquiries, complaints, deletion requests, or legal claims regarding Musarebito, please contact us using the methods below.",
    categories: [
      {
        icon: "📧",
        title: "General Inquiries",
        body: "Questions, feedback, and suggestions about our services.",
        contact: "info@musarebito.com",
      },
      {
        icon: "🗑️",
        title: "Content Removal Requests",
        body: "To request removal of reviews or facility information, please include the target URL and reason for removal. Legitimate requests will be handled promptly.",
        contact: 'info@musarebito.com (subject: "Removal Request")',
      },
      {
        icon: "⚖️",
        title: "Copyright Infringement Claims",
        body: "Copyright infringement claims should include:\n\n• Name and contact of the rights holder\n• Identification of the copyrighted work\n• URL of the infringing content on our site\n• Statement confirming the infringement\n• Statement that you are the rights holder or authorized representative",
        contact: 'info@musarebito.com (subject: "Copyright Claim")',
      },
      {
        icon: "🔒",
        title: "Personal Data Requests",
        body: "Requests for access, correction, deletion, or restriction of personal data (including GDPR/CCPA rights). After identity verification, we will respond within 30 days.",
        contact: 'info@musarebito.com (subject: "Data Request")',
      },
      {
        icon: "📋",
        title: "Legal Claims & Complaints",
        body: "Legal claims, inquiries from facility operators, and other complaints.",
        contact: 'info@musarebito.com (subject: "Legal Claim")',
      },
    ],
    response:
      "We typically respond within 3 business days. Some matters may require additional time.",
    note: "Note: Complaints about individual facilities or dispute resolution between users and facilities are outside the scope of our support. Please contact facilities directly.",
  },
};

export default function ContactPage() {
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

        <h1 className="text-3xl font-bold mb-4">{c.title}</h1>
        <p className="text-gray-300 text-sm mb-8 leading-relaxed">{c.intro}</p>

        <div className="space-y-4">
          {c.categories.map((cat, i) => (
            <div key={i} className="bg-white/5 rounded-2xl p-6">
              <h2 className="text-lg font-semibold mb-2">
                {cat.icon} {cat.title}
              </h2>
              <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line mb-3">
                {cat.body}
              </p>
              <p className="text-amber-400 text-sm font-medium">{cat.contact}</p>
            </div>
          ))}
        </div>

        <div className="bg-white/5 rounded-2xl p-6 mt-6">
          <p className="text-gray-300 text-sm leading-relaxed">{c.response}</p>
          <p className="text-gray-500 text-xs mt-3">{c.note}</p>
        </div>

        <p className="text-gray-500 text-xs mt-12">{c.updated}</p>
      </div>
    </div>
  );
}
