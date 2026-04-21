import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import CookieConsent from "@/components/CookieConsent";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: {
    default: "蒸され人 | 全国サウナランキング・本物スコアで探す",
    template: "%s | Musarebito",
  },
  description:
    "蒸され人（むされびと）は全国のサウナ施設をGoogleデータに基づいて評価・ランキング。口コミ数・評価・サウナ設備の充実度など複数の指標で「本物スコア」を算出。北海道・東京・神奈川・大阪のサウナ情報を網羅。",
  keywords: [
    "サウナ",
    "サウナランキング",
    "本物スコア",
    "蒸され人",
    "むされびと",
    "サウナ検索",
    "全国サウナ",
    "ととのう",
    "熱波師",
    "アウフグース",
  ],
  metadataBase: new URL("https://musarebito.vercel.app"),
  alternates: {
    canonical: "https://musarebito.vercel.app",
    languages: {
      ja: "https://musarebito.vercel.app/ja",
      en: "https://musarebito.vercel.app/en",
      "x-default": "https://musarebito.vercel.app/ja",
    },
  },
  openGraph: {
    title: "蒸され人 | 全国サウナランキング",
    description:
      "本物のサウナだけを、あなたに。全国600以上のサウナ施設を本物スコアで評価・ランキング。",
    url: "https://musarebito.vercel.app",
    siteName: "蒸され人",
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "蒸され人 | 全国サウナランキング",
    description: "本物のサウナだけを、あなたに。",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "d6SmdYwCK1K17pNWJtHSL0AUXBWEJ2NgCDBomfwSYe0",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8285912744304653"
          crossOrigin="anonymous"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <CookieConsent />
      </body>
    </html>
  );
}
