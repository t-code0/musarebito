"use client";
import Link from "next/link";
import { useParams } from "next/navigation";

const CONTENT = {
  ja: {
    back: "トップへ戻る",
    title: "プライバシーポリシー",
    updated: "最終更新: 2026年4月",
    sections: [
      {
        title: "1. 収集する情報",
        body: "当サイトでは以下の情報を収集する場合があります：\n\n• IPアドレス、ブラウザ情報、アクセス日時等のアクセスログ\n• Cookie およびローカルストレージに保存される設定情報\n• ユーザーが投稿した口コミ、評価、写真\n• お問い合わせフォーム経由で送信された情報（メールアドレス等）\n• 検索クエリおよびサイト内での操作履歴\n\n当サイトでは、アカウント登録機能を提供しない限り、氏名・住所・電話番号等の個人を直接特定する情報は収集しません。",
      },
      {
        title: "2. Cookieの使用",
        body: "当サイトでは以下の目的でCookieを使用します：\n\n• サイト機能の提供（言語設定、Cookie同意状態の保存）\n• アクセス解析（Google Analytics）\n• 広告表示（Google AdSense）\n• アフィリエイトトラッキング\n\nブラウザの設定によりCookieを無効化できますが、一部の機能が正常に動作しなくなる場合があります。Cookie同意バナーにて「拒否」を選択した場合、分析・広告目的のCookieは設定されません。",
      },
      {
        title: "3. Google AdSense・Google Analytics",
        body: "当サイトではGoogle AdSenseおよびGoogle Analyticsを使用しています。\n\nGoogleはCookieを使用してユーザーの過去のアクセス情報に基づいた広告を表示する場合があります。Google広告のCookieは、ユーザーがGoogleの広告設定ページ（https://adssettings.google.com）で無効化できます。\n\nGoogle Analyticsでは匿名化されたアクセスデータを収集し、サイトの改善に利用しています。詳しくはGoogleのプライバシーポリシー（https://policies.google.com/privacy）をご参照ください。",
      },
      {
        title: "4. アフィリエイトプログラム",
        body: "当サイトはAmazon.co.jpアソシエイト、楽天アフィリエイト等のアフィリエイトプログラムに参加しています。これらのプログラムではCookieを使用して紹介実績をトラッキングします。アフィリエイトリンク経由での購入により、当サイトに紹介料が発生する場合があります。",
      },
      {
        title: "5. 第三者サービスへのデータ送信",
        body: "当サイトでは以下の第三者サービスを利用しており、サービス提供に必要な範囲でデータが送信されます：\n\n• Supabase（データベース・認証基盤）: 投稿データ、サイトデータの保存\n• Vercel（ホスティング）: アクセスログの処理\n• Google Places API: サウナ施設情報・口コミの取得\n• Claude API（Anthropic社）: AI要約・本物スコア算出のためのテキスト分析\n\n各サービスのプライバシーポリシーに従ってデータが処理されます。",
      },
      {
        title: "6. 情報の利用目的",
        body: "収集した情報は以下の目的で利用します：\n\n• サービスの提供・運営・改善\n• サウナ施設情報の充実・スコア算出\n• ユーザーサポート・お問い合わせ対応\n• 不正利用の防止\n• 統計データの作成（個人を特定しない形式）",
      },
      {
        title: "7. 個人情報の保存期間",
        body: "• アクセスログ: 最大12ヶ月\n• 投稿コンテンツ: ユーザーの削除要求または当サイト判断による削除まで\n• お問い合わせ情報: 対応完了後6ヶ月\n• Cookie同意記録: 同意日から13ヶ月\n\n保存期間経過後、情報は安全に削除または匿名化されます。",
      },
      {
        title: "8. GDPR対応（EU/EEA居住者の権利）",
        body: "EU/EEA居住者は、一般データ保護規則（GDPR）に基づき以下の権利を有します：\n\n• 自己の個人データへのアクセス権\n• 個人データの訂正権\n• 個人データの削除権（忘れられる権利）\n• 処理の制限権\n• データポータビリティ権\n• 処理に対する異議申立権\n\nこれらの権利を行使する場合は、お問い合わせページまたは下記連絡先までご連絡ください。原則として30日以内に対応いたします。",
      },
      {
        title: "9. カリフォルニア州居住者の権利（CCPA）",
        body: "カリフォルニア州居住者は、カリフォルニア消費者プライバシー法（CCPA）に基づき、収集された個人情報の開示、削除、およびデータ販売のオプトアウトを要求する権利を有します。当サイトは個人情報の販売を行いません。",
      },
      {
        title: "10. 第三者への提供",
        body: "以下の場合を除き、個人情報を第三者に提供しません：\n\n• ユーザーの同意がある場合\n• 法令に基づく開示要求がある場合\n• 人の生命、身体または財産の保護のために必要がある場合\n• サービス提供に必要な業務委託先（前述の第三者サービス）への提供",
      },
      {
        title: "11. お問い合わせ",
        body: "プライバシーに関するご質問・データ削除要求は以下までご連絡ください：\n\nメール: info@musarebito.com\nお問い合わせページ: /ja/contact",
      },
      {
        title: "12. ポリシーの変更",
        body: "当サイトは、必要に応じてプライバシーポリシーを変更します。変更後のポリシーは当サイト上に掲載した時点で効力を生じます。重大な変更の場合、合理的な方法で通知するよう努めます。",
      },
    ],
  },
  en: {
    back: "Back to Home",
    title: "Privacy Policy",
    updated: "Last updated: April 2026",
    sections: [
      {
        title: "1. Information We Collect",
        body: "We may collect the following information:\n\n• Access logs including IP addresses, browser information, and access timestamps\n• Settings stored in cookies and local storage\n• Reviews, ratings, and photos submitted by users\n• Information sent through the contact form (e.g., email addresses)\n• Search queries and on-site browsing activity\n\nUnless account registration is provided, we do not collect personally identifiable information such as names, addresses, or phone numbers.",
      },
      {
        title: "2. Use of Cookies",
        body: "We use cookies for the following purposes:\n\n• Providing site functionality (language settings, cookie consent state)\n• Analytics (Google Analytics)\n• Advertising (Google AdSense)\n• Affiliate tracking\n\nYou can disable cookies through your browser settings, though some features may not function properly. If you select \"Reject\" on the cookie consent banner, analytics and advertising cookies will not be set.",
      },
      {
        title: "3. Google AdSense & Google Analytics",
        body: "This site uses Google AdSense and Google Analytics.\n\nGoogle may use cookies to display ads based on your past browsing history. You can opt out of Google's ad cookies at the Google Ads Settings page (https://adssettings.google.com).\n\nGoogle Analytics collects anonymized access data used to improve the site. For details, see Google's Privacy Policy (https://policies.google.com/privacy).",
      },
      {
        title: "4. Affiliate Programs",
        body: "This site participates in affiliate programs including Amazon Associates and Rakuten Affiliate. These programs use cookies to track referrals. Purchases made through affiliate links may generate referral fees for this site.",
      },
      {
        title: "5. Data Transmission to Third-Party Services",
        body: "We use the following third-party services, and data is transmitted as necessary for service provision:\n\n• Supabase (database/auth): Storage of submissions and site data\n• Vercel (hosting): Access log processing\n• Google Places API: Retrieval of sauna facility information and reviews\n• Claude API (Anthropic): Text analysis for AI summaries and HONMONO Score calculation\n\nData is processed in accordance with each service's privacy policy.",
      },
      {
        title: "6. Purpose of Information Use",
        body: "Collected information is used for:\n\n• Providing, operating, and improving our services\n• Enriching sauna facility information and calculating scores\n• User support and responding to inquiries\n• Preventing fraudulent use\n• Creating statistical data (in non-personally identifiable form)",
      },
      {
        title: "7. Data Retention Period",
        body: "• Access logs: Up to 12 months\n• User-generated content: Until deletion by user request or site decision\n• Contact form data: 6 months after resolution\n• Cookie consent records: 13 months from consent date\n\nAfter the retention period, information is securely deleted or anonymized.",
      },
      {
        title: "8. GDPR Compliance (Rights of EU/EEA Residents)",
        body: "EU/EEA residents have the following rights under the General Data Protection Regulation (GDPR):\n\n• Right of access to personal data\n• Right to rectification\n• Right to erasure (right to be forgotten)\n• Right to restriction of processing\n• Right to data portability\n• Right to object to processing\n\nTo exercise these rights, please contact us via the Contact page or at the address below. We will respond within 30 days.",
      },
      {
        title: "9. California Residents' Rights (CCPA)",
        body: "California residents have the right under the California Consumer Privacy Act (CCPA) to request disclosure, deletion of personal information collected, and to opt out of data sales. This site does not sell personal information.",
      },
      {
        title: "10. Disclosure to Third Parties",
        body: "We do not provide personal information to third parties except in the following cases:\n\n• With user consent\n• When required by law\n• When necessary to protect life, body, or property\n• To service providers necessary for service delivery (the third-party services listed above)",
      },
      {
        title: "11. Contact",
        body: "For privacy inquiries or data deletion requests:\n\nEmail: info@musarebito.com\nContact page: /en/contact",
      },
      {
        title: "12. Policy Changes",
        body: "We may update this Privacy Policy as necessary. Updated policies take effect upon posting on the site. For material changes, we will endeavor to provide notice by reasonable means.",
      },
    ],
  },
};

export default function PrivacyPage() {
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

        <div className="space-y-6">
          {c.sections.map((s, i) => (
            <div key={i} className="bg-white/5 rounded-2xl p-6">
              <h2 className="text-lg font-semibold mb-2">{s.title}</h2>
              <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">
                {s.body}
              </p>
            </div>
          ))}
        </div>

        <p className="text-gray-500 text-xs mt-12">{c.updated}</p>
      </div>
    </div>
  );
}
