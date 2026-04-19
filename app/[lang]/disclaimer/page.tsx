"use client";
import Link from "next/link";
import { useParams } from "next/navigation";

const CONTENT = {
  ja: {
    back: "トップへ戻る",
    title: "免責事項",
    updated: "最終更新: 2026年4月",
    sections: [
      {
        title: "1. 施設情報の正確性について",
        body: "当サイトに掲載されるサウナ施設の情報（営業時間、料金、設備、住所、電話番号等）は、Google Places API等の公開情報およびAIによる自動生成に基づいています。\n\n• 情報の正確性、完全性、最新性を保証するものではありません\n• 営業時間・料金・設備等が実際と異なる場合があります\n• 施設の臨時休業、改装、閉業等を即座に反映できない場合があります\n• 施設のご利用前に必ず公式サイトや施設へ直接ご確認ください",
      },
      {
        title: "2. 本物スコアについて",
        body: "本物スコア（HONMONOスコア）は、Google口コミ・施設データ・AI分析等に基づき当サイト独自のア��ゴリズムで算出した参考指標です。\n\n• 施設の絶対的な品質、安全性、衛生状態を保証するものではありません\n• スコアは定期的に更新され、予告なく変動する場合があります\n• スコアを施設選びの唯一の判断基準とすることは推奨しません\n• 公的な認証・格付けではありません",
      },
      {
        title: "3. 健康リスクについて",
        body: "サウナの利用には健康上のリスクが伴います。当サイトは、サウナ利用に起因する以下の健康被害について一切の責任を負いません：\n\n�� 心疾患（心筋梗塞、不整脈、心不全等）\n• 脳血管障害（脳卒中、脳出血等）\n• 熱中症、脱水症状\n• 失神、意識障害\n• 低血圧によるめまい・転倒\n• 火傷\n• アレルギー反応（アロマオイル、ハーブ、ヴィヒタ（白樺）、薬草等による）\n• その他のサウナ利用に起因する傷害・疾病\n\n以下に該当する方は、医師に相談の上でサウナを���利用ください：\n\n• 心臓疾患、高血圧、低血圧のある方\n• 妊娠中の方\n• 高齢者の方\n• 持病・慢性疾患をお持ちの方\n• 飲酒後の方\n• 体調不良の方\n\n当サイトに掲載される健康効果に関する情報は一般的な参考情報であり、医学的助言ではあ��ません。",
      },
      {
        title: "4. 施設利用に関するトラブル",
        body: "当サイトは施設の紹介・情報提供を行うプラットフォームであり、施設の運営者ではありません。\n\n• 施設とユーザー間のトラブル（料金紛争、サービス内容の相違、マナー問題等）について、当サイトは一切関与せず、責任を負いません\n• 施設内での事故、盗難、紛失について責任を負いません\n• 施設の閉業、移転、営業停止による損害について責任を負いません\n• 施設の予約、支払い等に関する紛争は、施設と直接解決してください",
      },
      {
        title: "5. 第三者コンテンツ・外部リンク",
        body: "当サイトには第三者が提供するコンテンツおよび外部サイトへのリンクが含まれます。\n\n• アフィリエイトリンク先（Amazon.co.jp、楽天市場等）の商品・サービスの品質、安全性、配送等について責任を負いません\n• 外部サイト（Instagram、Google Maps等）の内容、正確性、安全性について責任を負いません\n• ユーザーが投稿した口コミ・写真の正確性、適法性について責任を負いません\n• 外部サイトのプライバシーポリシーは当サイトとは異なります。外部サイトのご利用は各サイトの規約に従ってください",
      },
      {
        title: "6. 知的財産権",
        body: "• 施設の写真、名称、ロゴ等の権利は各施設および各権利者に帰属します\n• Google口コミの引用はGoogleの利用規約に基づき行っています\n• 当サイトのオリジナルコンテンツ（AI要約、本物スコア、デザイン等）の無断転載・商用利用を禁止します\n\n著作権侵害に関する申立ては、お問い合わせページ（/ja/contact）またはinfo@musarebito.comまでご連絡ください。正当な申立てに対しては速やかに対応いたします。",
      },
      {
        title: "7. 投稿・口コミについて",
        body: "• 投稿された口コミ・評価の内容に関する責任は投稿者自身が負います\n• 当サイトは投稿内容の事前審査を行いませんが、以下の投稿は発見次第削除します：\n  - 誹謗中傷、名誉毀損にあたる内容\n  - 営業妨害を目的とした虚偽の投稿\n  - 個人情報を含む投稿\n  - わいせつ・暴力的な内容\n  - 法令に違反する内容\n• 削除依頼はお問い合わせページ（/ja/contact）より受け付けています\n• 当サイトは独自の判断で投稿を削除する権利を有します",
      },
      {
        title: "8. AI生成コンテンツについて",
        body: "当サイトではClaude AI（Anthropic社）を用いて施設の要約やスコア算出を行っています。AI生成コンテンツには以下の限界があります：\n\n• AIの判断・要約が常に正確とは限りません\n• 入力データ（口コミ等）の偏りがAI出力に影響する場合があります\n• AI生成コンテンツは人間による編集を経ていない場合があります\n• AIの技術的制約により、不適切な内容が含まれる可能性があります\n\nAI生成コンテンツは参考情報としてご利用ください。",
      },
      {
        title: "9. 損害賠償の制限",
        body: "当サイトの利用に起因するいかなる損害（直接損害、間接損害、逸失利益、データ損失等を含む）についても、当サイトの故意または重過失による場合を除き、当サイトは一切の賠償責任を負いません。当サイトに責任が認められる場合でも、賠償額は当該ユーザーが当サイトに支払った金額を上限とします。",
      },
    ],
  },
  en: {
    back: "Back to Home",
    title: "Disclaimer",
    updated: "Last updated: April 2026",
    sections: [
      {
        title: "1. Accuracy of Facility Information",
        body: "Information about sauna facilities on this site (business hours, prices, amenities, addresses, phone numbers, etc.) is based on publicly available data from Google Places API and AI-generated content.\n\n• We do not guarantee the accuracy, completeness, or currency of this information\n• Business hours, prices, and amenities may differ from actual conditions\n• Temporary closures, renovations, or permanent closures may not be reflected immediately\n• Please verify information with the official website or the facility directly before visiting",
      },
      {
        title: "2. About HONMONO Score",
        body: "The HONMONO Score is a reference metric calculated by our proprietary algorithm based on Google reviews, facility data, and AI analysis.\n\n• It does not guarantee the absolute quality, safety, or hygiene standards of any facility\n• Scores are periodically updated and may change without notice\n• We do not recommend using the score as the sole criterion for choosing a facility\n• It is not an official certification or rating",
      },
      {
        title: "3. Health Risks",
        body: "Sauna use involves health risks. This site assumes no responsibility for the following health issues arising from sauna use:\n\n• Cardiovascular events (heart attack, arrhythmia, heart failure, etc.)\n• Cerebrovascular events (stroke, cerebral hemorrhage, etc.)\n• Heat stroke and dehydration\n• Fainting and loss of consciousness\n• Dizziness and falls due to low blood pressure\n• Burns\n• Allergic reactions (from essential oils, herbs, vihta/birch whisks, medicinal herbs, etc.)\n• Other injuries or illnesses related to sauna use\n\nPlease consult a physician before using saunas if you:\n\n• Have heart disease, high blood pressure, or low blood pressure\n• Are pregnant\n• Are elderly\n• Have chronic illnesses or pre-existing conditions\n• Have consumed alcohol\n• Are feeling unwell\n\nHealth benefit information on this site is general reference information and does not constitute medical advice.",
      },
      {
        title: "4. Facility-Related Disputes",
        body: "This site is an information platform and is not the operator of any listed facility.\n\n• We do not intervene in or bear responsibility for disputes between facilities and users (pricing disputes, service discrepancies, manner issues, etc.)\n• We are not liable for accidents, theft, or loss at facilities\n• We are not liable for damages caused by facility closures, relocations, or business suspensions\n• Reservation and payment disputes should be resolved directly with the facility",
      },
      {
        title: "5. Third-Party Content & External Links",
        body: "This site contains third-party content and links to external websites.\n\n• We are not responsible for the quality, safety, or delivery of products/services on affiliate link destinations (Amazon.co.jp, Rakuten, etc.)\n• We are not responsible for the content, accuracy, or safety of external sites (Instagram, Google Maps, etc.)\n• We are not responsible for the accuracy or legality of user-submitted reviews and photos\n• External sites have their own privacy policies. Use of external sites is subject to their respective terms",
      },
      {
        title: "6. Intellectual Property",
        body: "• Rights to facility photos, names, and logos belong to respective facilities and rights holders\n• Google review citations are made in accordance with Google's Terms of Service\n• Unauthorized reproduction or commercial use of original content (AI summaries, HONMONO Scores, designs, etc.) is prohibited\n\nCopyright infringement claims should be directed to the Contact page (/en/contact) or info@musarebito.com. Legitimate claims will be addressed promptly.",
      },
      {
        title: "7. User Reviews and Submissions",
        body: "�� Users bear full responsibility for the content of their reviews and ratings\n• While we do not pre-screen submissions, the following content will be removed upon discovery:\n  - Defamation or libel\n  - False submissions intended to interfere with business\n  - Submissions containing personal information\n  - Obscene or violent content\n  - Content that violates laws or regulations\n• Removal requests are accepted via the Contact page (/en/contact)\n• The site reserves the right to remove submissions at its own discretion",
      },
      {
        title: "8. AI-Generated Content",
        body: "This site uses Claude AI (by Anthropic) to generate facility summaries and calculate scores. AI-generated content has the following limitations:\n\n• AI judgments and summaries may not always be accurate\n• Bias in input data (reviews, etc.) may affect AI output\n• AI-generated content may not have undergone human editing\n• Technical limitations of AI may result in inappropriate content\n\nPlease treat AI-generated content as reference information.",
      },
      {
        title: "9. Limitation of Liability",
        body: "Except in cases of willful misconduct or gross negligence, the site shall not be liable for any damages (including direct damages, indirect damages, lost profits, data loss, etc.) arising from use of the site. In cases where liability is found, compensation shall be limited to the amount paid by the user to the site.",
      },
    ],
  },
};

export default function DisclaimerPage() {
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
