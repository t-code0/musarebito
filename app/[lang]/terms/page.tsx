"use client";
import Link from "next/link";
import { useParams } from "next/navigation";

const CONTENT = {
  ja: {
    back: "トップへ戻る",
    title: "利用規約",
    updated: "最終更新: 2026年4月",
    sections: [
      {
        title: "第1条（適用）",
        body: "本利用規約（以下「本規約」）は、蒸され人（以下「当サイト」）が提供するすべてのサービスの利用条件を定めるものです。ユーザーは当サイトにアクセスした時点で本規約に同意したものとみなします。本規約に同意いただけない場合、当サイトの利用をお控えください。",
      },
      {
        title: "第2条（サービス内容と変更）",
        body: "当サイトは、全国のサウナ施設に関する情報提供、AI要約、本物スコア算出、口コミ投稿機能等のサービスを提供します。当サイトは、ユーザーへの事前通知なくサービスの内容を変更、追加、または廃止できるものとします。これにより生じた損害について、当サイトは一切の責任を負いません。",
      },
      {
        title: "第3条（年齢制限）",
        body: "当サイトのご利用は13歳以上の方に限ります。13歳未満の方は、保護者の同意がある場合でも、当サイトをご利用いただけません（米国COPPA法への準拠）。当サイトは、13歳未満であると判明したユーザーの情報を速やかに削除します。",
      },
      {
        title: "第4条（投稿コンテンツ）",
        body: "ユーザーが投稿した口コミ、写真、評価等のコンテンツ（以下「投稿コンテンツ」）の著作権はユーザーに帰属します。ただし、ユーザーは投稿と同時に、当サイトに対し、投稿コンテンツを無償・非独占的・地域無制限・サブライセンス可能な形で複製、翻案、公衆送信、表示する権利を許諾するものとします。この許諾は投稿の削除後も、既にサービス上で利用された範囲において存続します。投稿コンテンツの内容に関する責任は投稿者自身が負うものとします。",
      },
      {
        title: "第5条（禁止事項）",
        body: "ユーザーは以下の行為を行ってはなりません：\n\n• 不正アクセス、サーバーへの過度な負荷をかける行為\n• 自動化ツール等によるスクレイピング、データ収集\n• 虚偽の口コミ、評価操作、なりすまし投稿\n• 施設、個人に対する誹謗中傷、名誉毀損\n• 他者の著作権、商標権等の知的財産権を侵害する行為\n• 営業妨害、スパム行為\n• 法令または公序良俗に反する行為\n• 当サイトの運営を妨害する一切の行為\n\n当サイトは、上記に違反する投稿を事前通知なく削除し、違反ユーザーのアクセスを制限する権利を有します。",
      },
      {
        title: "第6条（本物スコア）",
        body: "本物スコアは、Google口コミデータ・施設情報・AI分析・独自アルゴリズム等に基づき自動算出された独自指標です。施設の絶対的な品質・安全性を保証するものではなく、あくまで参考情報としてご利用ください。スコアの算出基準は予告なく変更される場合があります。",
      },
      {
        title: "第7条（知的財産権）",
        body: "当サイトに掲載されたテキスト、画像、デザイン、ロゴ、ソフトウェア等の著作権その他の知的財産権は、当サイトまたは正当な権利者に帰属します。施設の写真・名称に関する権利は各権利者に帰属します。当サイトのコンテンツの無断転載、複製、商用利用を禁止します。",
      },
      {
        title: "第8条（サービスの停止・終了）",
        body: "当サイトは、以下の場合にサービスの全部または一部を一時停止または終了できるものとします：\n\n• システムの保守・点検・更新\n• 天災、停電等の不可抗力\n• その他当サイトが必要と判断した場合\n\nサービスの停止・終了によりユーザーに生じた損害について、当サイトは一切の責任を負いません。",
      },
      {
        title: "第9条（免責事項）",
        body: "当サイトの情報は、正確性・完全性・最新性を保証するものではありません。当サイトの利用により生じた損害について、当サイトの故意または重過失による場合を除き、当サイトは一切の責任を負いません。詳細は免責事項ページをご参照ください。",
      },
      {
        title: "第10条（準拠法・管轄裁判所）",
        body: "本規約の解釈および適用は日本法に準拠します。本規約に関連する紛争については、東京地方裁判所を第一審の専属的合意管轄裁判所とします。",
      },
      {
        title: "第11条（規約の変更）",
        body: "当サイトは、必要に応じて本規約を変更できるものとします。変更後の規約は当サイト上に掲載した時点で効力を生じます。重大な変更の場合、合理的な方法で事前に通知するよう努めます。変更後も当サイトを利用した場合、変更後の規約に同意したものとみなします。",
      },
    ],
  },
  en: {
    back: "Back to Home",
    title: "Terms of Service",
    updated: "Last updated: April 2026",
    sections: [
      {
        title: "Article 1 (Application)",
        body: 'These Terms of Service ("Terms") set forth the conditions for using all services provided by Musarebito ("the Site"). By accessing the Site, you are deemed to have agreed to these Terms. If you do not agree to these Terms, please refrain from using the Site.',
      },
      {
        title: "Article 2 (Service Content and Changes)",
        body: "The Site provides information about sauna facilities across Japan, including AI summaries, HONMONO Score calculations, and user review features. The Site reserves the right to modify, add, or discontinue any part of its services without prior notice to users. The Site shall not be liable for any damages arising from such changes.",
      },
      {
        title: "Article 3 (Age Restriction)",
        body: "Use of the Site is restricted to individuals aged 13 and older. Individuals under 13 may not use the Site, even with parental consent (in compliance with the US COPPA Act). The Site will promptly delete any information found to belong to users under 13.",
      },
      {
        title: "Article 4 (User-Generated Content)",
        body: "Copyright in reviews, photos, ratings, and other content submitted by users (\"User Content\") remains with the user. However, by submitting content, users grant the Site a free, non-exclusive, worldwide, sublicensable license to reproduce, adapt, publicly transmit, and display such User Content. This license survives deletion of the content to the extent it has already been used in the service. Users bear full responsibility for the content of their submissions.",
      },
      {
        title: "Article 5 (Prohibited Activities)",
        body: "Users shall not engage in the following:\n\n• Unauthorized access or placing excessive load on servers\n• Scraping or data collection using automated tools\n• Posting false reviews, rating manipulation, or impersonation\n• Defamation or libel against facilities or individuals\n• Infringement of intellectual property rights including copyrights and trademarks\n• Business interference or spamming\n• Any act that violates laws or public order\n• Any act that interferes with the operation of the Site\n\nThe Site reserves the right to remove content that violates these terms without prior notice and to restrict access for offending users.",
      },
      {
        title: "Article 6 (HONMONO Score)",
        body: "The HONMONO Score is a proprietary metric automatically calculated based on Google review data, facility information, AI analysis, and proprietary algorithms. It does not guarantee the absolute quality or safety of a facility and should be used as reference information only. The scoring criteria may be changed without notice.",
      },
      {
        title: "Article 7 (Intellectual Property)",
        body: "Copyrights and other intellectual property rights in text, images, designs, logos, and software on the Site belong to the Site or their rightful owners. Rights to facility photos and names belong to their respective rights holders. Unauthorized reproduction, copying, or commercial use of the Site's content is prohibited.",
      },
      {
        title: "Article 8 (Service Suspension and Termination)",
        body: "The Site may suspend or terminate all or part of its services in the following cases:\n\n• System maintenance, inspection, or updates\n• Force majeure events such as natural disasters or power outages\n• Other cases deemed necessary by the Site\n\nThe Site shall not be liable for any damages caused by service suspension or termination.",
      },
      {
        title: "Article 9 (Disclaimer)",
        body: "Information on the Site is not guaranteed to be accurate, complete, or up-to-date. Except in cases of willful misconduct or gross negligence, the Site shall not be liable for any damages arising from use of the Site. Please refer to the Disclaimer page for details.",
      },
      {
        title: "Article 10 (Governing Law and Jurisdiction)",
        body: "These Terms shall be governed by and construed in accordance with the laws of Japan. Any disputes arising in connection with these Terms shall be subject to the exclusive jurisdiction of the Tokyo District Court as the court of first instance.",
      },
      {
        title: "Article 11 (Amendments)",
        body: "The Site may amend these Terms as necessary. Amended Terms shall take effect upon posting on the Site. For material changes, the Site will endeavor to provide advance notice by reasonable means. Continued use of the Site after changes constitutes acceptance of the amended Terms.",
      },
    ],
  },
};

export default function TermsPage() {
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
