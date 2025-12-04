"use client";

import React from 'react';
import { ArrowRight, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function Thanks() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8fafc] p-6 text-center">
      
      {/* ▼▼▼ この行を修正 ▼▼▼ */}
      {/* max-w-md (448px) から max-w-lg (512px) へ幅を広げます */}
      <div className="bg-white p-12 md:p-16 rounded-2xl shadow-lg max-w-lg w-full border border-slate-100">
        
        <div className="flex justify-center mb-8">
          <CheckCircle size={64} className="text-[#223a5e]" />
        </div>
        
        {/* H1とPタグの内容はそのまま（手動改行を信じる） */}
        <h1 className="font-serif text-2xl md:text-3xl font-bold text-[#223a5e] mb-8">
          その「一歩」を、<br />大切に受け取りました。
        </h1>

        <p className="text-gray-600 mb-12 leading-relaxed tracking-wide">
          お申し込みありがとうございます。<br />
          メッセージは無事に届いております。<br /><br />
          内容を確認の上、<br />通常48時間以内にメールにて<br />ご連絡差し上げます。<br />
        </p>

        {/* ▼ 注意書きとボタンの間隔を広げる（mb-12を追加） ▼ */}
        <p className="text-sm text-gray-400 mb-12">
          ※数日経っても返信がない場合は、<br className="md:hidden" />迷惑メールフォルダをご確認いただくか、お手数ですが再度ご連絡ください。
        </p>
        
        <Link
          href="/"
          className="group inline-flex items-center justify-center gap-2 bg-[#223a5e] text-white px-8 py-3 rounded-full font-medium transition-all hover:bg-[#1a2b46] hover:shadow-lg"
        >
          トップページへ戻る
          <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  );
}