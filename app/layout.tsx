import "./globals.css";
import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react"; // ★ 追加

// メタデータの設定
export const metadata: Metadata = {
  title: "止めているのは迷いじゃない。本音だ｜ナカイマ伴走舎",
  description:
    "頭では分かっているのに、足が止まる。その違和感を「迷い」で終わらせないために。本音に触れ、自分の基準で選び直すための対話の場。",
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
