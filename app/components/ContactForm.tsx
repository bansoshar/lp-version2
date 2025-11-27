// components/ContactForm.tsx
'use client';

export default function ContactForm() {

  return (
    <form
      action="https://formspree.io/f/mwpjpyrj"
      method="POST"
      className="flex flex-col gap-4 max-w-md mx-auto"
    >
     
      {/* 送信後に /thanks に飛ばすための魔法の1行 */}
      <input 
        type="hidden" 
        name="_next" 
        value="https://bansoshar.com/thanks" 
      />

      <label className="flex flex-col">
        <span className="text-sm text-gray-600 mb-1">お名前</span>
        <input type="text" name="name" required className="border border-gray-300 p-2 rounded" />
      </label>
      
      <label className="flex flex-col">
        <span className="text-sm text-gray-600 mb-1">メールアドレス</span>
        <input type="email" name="email" required className="border border-gray-300 p-2 rounded" />
      </label>
      
      <label className="flex flex-col">
        <span className="text-sm text-gray-600 mb-1">ご相談内容（任意）</span>
        <textarea name="message" rows={4} className="border border-gray-300 p-2 rounded"></textarea>
      </label>

      <button type="submit" className="bg-[#223a5e] text-white py-3 rounded font-bold hover:opacity-90 transition-opacity">
        体験セッションに申し込む
      </button>
    </form>
  );
}