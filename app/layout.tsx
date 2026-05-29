import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "元素周期表クイズ｜118元素を覚えよう！無料学習アプリ",
  description: "全118元素の記号・名前・特徴を楽しく学べる無料クイズアプリ。4択・入力モードで中学・高校の化学の勉強に最適。元素図鑑としても使えます。",
  keywords: ["元素記号", "周期表", "クイズ", "化学", "勉強", "中学", "高校", "無料" ,"暗記", "単語帳"],
  verification: {
    google: "28craGTNGJ4TOry-EV2hFZZSR0auV_Ax8kyRL4H0LBI",
  },
  openGraph: {
    title: "元素周期表クイズ｜118元素を覚えよう！",
    description: "全118元素を楽しく学べる無料クイズアプリ。中学・高校の化学対策に。",
    url: "https://chem-app-8moc.vercel.app",
    siteName: "元素周期表クイズ",
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "元素周期表クイズ｜118元素を覚えよう！",
    description: "全118元素を楽しく学べる無料クイズアプリ。中学・高校の化学対策に。",
  },
  alternates: {
    canonical: "chem-app-8moc.vercel.app",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}