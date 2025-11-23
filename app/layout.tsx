// Geistフォントのimportを削除するため、このファイル全体を修正します

import './globals.css';
import React from 'react';
// import { Inter } from 'next/font/google'; // デフォルトのInterも使用しない

// export const metadata = { ... } は一旦そのまま残すか、削除して問題ありません。

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      {/* <body>のクラスから、フォントのクラス指定（例: className={inter.className}）を削除します */}
      <body>{children}</body> 
    </html>
  );
}