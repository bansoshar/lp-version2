import "./globals.css";
import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react"; // ★ 追加

// メタデータの設定
export const metadata: Metadata = {
  title: "願いを諦めない人のライフコーチング｜ナカイマ伴走舎",
  description:
    "願いがあるのに動けなくなっているあなたへ。対話とストレングスファインダーを通じて、迷いを「納得の一歩」に変えるサポートをします。周囲の期待ではなく、自分の本音で決断したい方へ。まずは無料体験セッションから。",
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
