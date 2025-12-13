import "./globals.css";
import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react"; // ★ 追加

// メタデータの設定
export const metadata: Metadata = {
  title: "人生や仕事の選択に違和感を感じている人へ｜対話で整理する時間｜ナカイマ伴走舎",
  description:
    "人生や仕事の選択に、言葉にできない違和感を感じている方へ。すぐに答えを出すのではなく、対話を通して本音や判断基準を整理し、自分で納得して選び直すための時間を提供しています。",
  icons: {
    icon: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>
        {children}
        <Analytics /> {/* ★ これを追加するだけ */}
      </body>
    </html>
  );
}
