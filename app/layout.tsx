import './globals.css';
import type { Metadata } from 'next';

// メタデータの設定
export const metadata: Metadata = {
  title: 'ナカイマ伴走舎｜ライフ＆ストレングス コーチング',
  description: 'あなたの「強み」と「願い」に光をあて、迷いのない決断をつくるコーチング。',
  icons: {
    icon: '/icon.png', // または '/icon.png'
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