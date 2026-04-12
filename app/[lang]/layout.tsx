import type { Metadata } from "next";
import Footer from "@/components/Footer";

const META: Record<string, Metadata> = {
  ja: {
    title: "蒸され人 | 全国サウナランキング・本物スコアで探す",
    description:
      "蒸され人（むされびと）は全国のサウナ施設をGoogleデータに基づいて評価・ランキング。口コミ数・評価・サウナ設備の充実度など複数の指標で「本物スコア」を算出。北海道・東京・神奈川・大阪のサウナ情報を網羅。",
    openGraph: {
      title: "蒸され人 | 全国サウナランキング",
      description:
        "本物のサウナだけを、あなたに。全国600以上のサウナ施設を本物スコアで評価・ランキング。",
      url: "https://musarebito.vercel.app/ja",
      siteName: "蒸され人",
      locale: "ja_JP",
      type: "website",
    },
    alternates: {
      canonical: "https://musarebito.vercel.app/ja",
      languages: {
        ja: "https://musarebito.vercel.app/ja",
        en: "https://musarebito.vercel.app/en",
        "x-default": "https://musarebito.vercel.app/ja",
      },
    },
  },
  en: {
    title: "Musarebito | Japan Sauna Guide & HONMONO Score Ranking",
    description:
      "Musarebito ranks every sauna in Japan using real Google data. Discover the best authentic Japanese saunas in Tokyo, Hokkaido, Osaka, Kanagawa and beyond — sorted by our HONMONO Score.",
    openGraph: {
      title: "Musarebito | Japan Sauna Guide",
      description:
        "Only the real saunas, hand-picked for you. 600+ Japanese saunas ranked by HONMONO Score.",
      url: "https://musarebito.vercel.app/en",
      siteName: "Musarebito",
      locale: "en_US",
      type: "website",
    },
    alternates: {
      canonical: "https://musarebito.vercel.app/en",
      languages: {
        ja: "https://musarebito.vercel.app/ja",
        en: "https://musarebito.vercel.app/en",
        "x-default": "https://musarebito.vercel.app/ja",
      },
    },
  },
};

export async function generateMetadata({
  params,
}: {
  params: { lang: string };
}): Promise<Metadata> {
  return META[params.lang] || META.ja;
}

export default function LangLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <Footer />
    </>
  );
}
