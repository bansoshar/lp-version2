"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";

import {
  ArrowRight,
  X,
  ArrowUpRight,
  Quote,
  Check,
  ChevronDown,
  MessageSquare,
  Clock,
  Calendar,
  ShieldCheck, // Process内の保証ブロックで使用
} from "lucide-react";

// --- Components ---

const SectionHeader = ({
  en,
  jp,
  align = "center",
}: {
  en: string;
  jp: string;
  align?: "left" | "center" | "right";
}) => (
  <div
    className={`mb-20 flex flex-col ${
      align === "left"
        ? "items-start"
        : align === "right"
        ? "items-end"
        : "items-center"
    }`}
  >
    <motion.span
      initial={{ y: 20, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="font-display text-lg tracking-widest uppercase mb-4 block text-[#223a5e]"
    >
      ― {en}
    </motion.span>
    <motion.h2
      initial={{ y: 30, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.1 }}
      className="font-serif text-3xl md:text-4xl lg:text-5xl leading-tight font-medium inline-block text-[#223a5e]"
    >
      {jp}
    </motion.h2>
  </div>
);

const ParallaxImage = ({
  src,
  alt,
  className = "",
  speed = 1,
}: {
  src: string;
  alt: string;
  className?: string;
  speed?: number;
}) => {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  return (
    <div ref={ref} className="overflow-hidden w-full h-full">
      <motion.img
        style={{ y: speed === 0 ? 0 : y, scale: 1.1 }}
        src={src}
        alt={alt}
        className={`w-full h-full object-cover ${className}`}
      />
    </div>
  );
};

const MagneticButton = ({
  children,
  onClick,
  dark = true,
}: {
  children: React.ReactNode;
  onClick: () => void;
  dark?: boolean;
}) => (
  <button
    onClick={onClick}
    className={`
      group relative px-8 py-4 overflow-hidden rounded-none transition-all duration-300 border
      ${
        dark
          ? "bg-[#223a5e] border-[#223a5e] text-white hover:bg-white hover:text-[#223a5e]"
          : "bg-transparent border-[#223a5e] text-[#223a5e] hover:bg-[#223a5e] hover:text-white"
      }
    `}
  >
    <span className="relative z-10 flex items-center gap-4 font-medium tracking-wide">
      {children}
      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
    </span>
  </button>
);

const FAQItem = ({ q, a }: { q: string; a: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-slate-200">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-6 flex justify-between items-center text-left hover:text-[#223a5e] transition-colors"
      >
        <span className="font-serif text-lg font-medium pr-8 text-left leading-relaxed">
          {q}
        </span>
        <ChevronDown
          className={`w-5 h-5 transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          } flex-shrink-0 ml-4`}
        />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <p className="pb-8 text-gray-600 leading-relaxed pl-4 border-l-2 border-[#223a5e] ml-1">
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- Main App ---

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const formRef = useRef<HTMLFormElement | null>(null);

  const scrollToForm = () => {
    document
      .getElementById("contact-form")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // --- Formspree 送信用のハンドラー ---
  const handleFormSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();

    const form = e.currentTarget;

    // FormData を生成
    const formData = new FormData(form);

    // チェックされた service_option をまとめる
    const selectedServices = Array.from(
      form.querySelectorAll<HTMLInputElement>(
        "input[name='service_option']:checked"
      )
    ).map((el) => el.value);

    const joinedServices = selectedServices.join(", ");

    // Formspree に送る用の「service」フィールドとしてセット
    formData.set("service", joinedServices);

    // （必要なら元の service_option を消したい場合）
    // formData.delete("service_option");

    try {
      const res = await fetch("https://formspree.io/f/mwpjpyrj", {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
        body: formData,
      });

      if (res.ok) {
        // 送信成功 → /thanks にリダイレクト
        window.location.href = "https://bansoshar.com/thanks";
      } else {
        alert(
          "送信に失敗しました。時間をおいて再試行してください。"
        );
      }
    } catch (error) {
      console.error(error);
      alert(
        "送信時にエラーが発生しました。通信環境をご確認のうえ、再度お試しください。"
      );
    }
  };

  return (
    <div className="relative w-full">
      {/* --- Navigation --- */}
      <nav
        className={`fixed top-0 left-0 w-full p-6 md:p-10 flex justify-between items-center z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/90 backdrop-blur-sm shadow-sm py-4"
            : "bg-transparent"
        }`}
      >
        {/* ロゴ部分 */}
        <div
          className={`flex items-center gap-3 font-serif text-xl font-bold tracking-widest transition-colors duration-300 ${
            scrolled ? "text-[#223a5e]" : "text-white"
          }`}
        >
          <span>NAKAIMA BANSOSHAR</span>
          <img
            src="/logo.png"
            alt="Logo"
            className={`h-8 w-auto ml-[-10px] transition-opacity duration-300 ${
              scrolled ? "opacity-100" : "opacity-0"
            }`}
          />
        </div>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className={`group flex items-center gap-3 text-sm tracking-widest uppercase hover:opacity-70 transition-opacity ${
            scrolled ? "text-[#223a5e]" : "text-white"
          }`}
        >
          <span className="hidden md:block">Menu</span>
          <div
            className={`w-8 h-[1px] transition-all duration-300 group-hover:w-12 ${
              scrolled ? "bg-[#223a5e]" : "bg-white"
            }`}
          />
        </button>
      </nav>

      {/* Full Screen Menu Overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{
              type: "tween",
              ease: [0.76, 0, 0.24, 1],
              duration: 0.8,
            }}
            className="fixed inset-0 z-[60] bg-[#1e293b] text-white flex flex-col justify-center items-center"
          >
            <button
              onClick={() => setMenuOpen(false)}
              className="absolute top-6 right-6 md:top-10 md:right-10 p-4 hover:rotate-90 transition-transform duration-500"
            >
              <X size={32} />
            </button>
            <ul className="space-y-8 text-center font-serif text-3xl md:text-5xl">
              {["Impact", "Profile", "Services", "Process", "Voices", "FAQ"].map(
                (item, i) => (
                  <motion.li
                    key={item}
                    initial={{ y: 40, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 + i * 0.1 }}
                  >
                    <a
                      href={`#${item.toLowerCase()}`}
                      onClick={() => setMenuOpen(false)}
                      className="hover:text-[var(--color-paper)] transition-colors"
                    >
                      {item}
                    </a>
                  </motion.li>
                )
              )}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- Hero Section --- */}
      <header className="relative h-screen min-h-[800px] w-full flex flex-col md:flex-row overflow-hidden">
        {/* 左：テキストエリア */}
        <div className="w-full md:w-1/2 h-full relative flex items-center justify-center p-10 md:p-20 bg-[var(--color-paper)] z-10">
          <div className="relative w-full max-w-lg">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="
                font-serif
                text-4xl
                sm:text-3xl
                md:text-4xl
                lg:text-7xl
                font-bold
                leading-tight
                tracking-wide
                text-[#223a5e]
                mb-8
              "
            >
              <span className="inline-phrase">迷いのない決断は、</span>
              <br />
              <span className="inline-phrase">もっと自然に、</span>
              <br />
              <span className="inline-phrase">自分らしく。</span>
            </motion.h1>

            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.5, duration: 1, ease: "circOut" }}
              className="w-24 h-1 bg-[#223a5e] mb-10 origin-left"
            />

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 1 }}
              className="text-base md:text-lg lg:text-xl text-gray-600 leading-loose tracking-widest mb-12"
            >
              <span className="inline-block">
                「誰かの期待」より、「自分の本音」を。
              </span>
              <br className="hidden md:inline" />
              <span className="inline-block">
                強みと願いを軸に、納得の一歩へ。
              </span>
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
            >
              <MagneticButton onClick={scrollToForm}>
                Experience Session
              </MagneticButton>
            </motion.div>
          </div>
        </div>

        {/* 右：画像エリア */}
        <div className="w-full md:w-1/2 h-[50vh] md:h-full relative">
          <ParallaxImage
            src="/hero.jpg"
            alt="Calm Ocean"
            className="object-[80%_center]"
            speed={0.5}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-paper)] md:from-transparent to-transparent opacity-90" />
        </div>
      </header>

      {/* --- Impact (The 3 Cards) --- */}
      <section id="impact" className="py-32 px-6 md:px-20 relative bg-white">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-16 items-start">
          <div className="md:w-1/3 relative md:sticky md:top-32">
            <span className="font-display text-6xl text-slate-100 absolute -top-10 -left-10 -z-10">
              01
            </span>
            <h2 className="font-serif text-3xl font-bold mb-6 text-[#223a5e]">
              あなたを待つ変化
            </h2>
            <div className="leading-loose text-gray-600 mb-8">
              <p>
                <span className="inline-block">
                  ナカイマ伴走舎のコーチングは、
                </span>
                <br className="hidden md:inline" />
                <span className="inline-block">
                  単なる悩み相談ではありません。
                </span>
              </p>
              <p className="mt-4">
                <span className="inline-block">自己理解を深め、</span>
                <span className="inline-block">視座を高めることで、</span>
                <br className="hidden md:inline" />
                <span className="inline-block">あなたの内側と現実に</span>
                <span className="inline-block">確かな変化をもたらします。</span>
              </p>
            </div>
          </div>

          <div className="md:w-2/3 grid gap-8">
            {[
              {
                en: "Authenticity",
                title: "“自分らしさ”が、選択の軸になる",
                text: "強みと価値観が輪郭を持ち、『誰かの期待』ではなく『自分の本質』から選択できるようになります。",
              },
              {
                en: "Clarity",
                title: "迷いは消え、決断は前進へ。",
                text: "堂々巡りだった思考が整理され、決断が自信と推進力を伴うものに変わります。",
              },
              {
                en: "Sustainable",
                title: "続けられるから、成果になる。",
                text: "セッションでの気づきが実生活に根づき、小さな一歩が持続し、確かな成果へと積み上がっていきます。",
              },
            ].map((card, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.2 }}
                className="bg-[var(--color-paper-dark)] p-10 border-l-2 border-[#223a5e] hover:shadow-lg transition-all duration-300 group"
              >
                <span className="font-display text-xl text-[#223a5e] block mb-3 opacity-60 group-hover:opacity-100 transition-opacity">
                  {card.en}
                </span>
                <h3 className="font-serif text-2xl font-bold mb-4 leading-normal text-[#223a5e]">
                  {card.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">{card.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Profile --- */}
      <section
        id="profile"
        className="py-32 px-6 md:px-20 bg-[#223a5e] text-white overflow-hidden"
      >
        <div className="max-w-7xl mx-auto relative">
          <div className="mb-20">
            <span className="font-display text-white/60 text-lg tracking-widest uppercase mb-4 block">
              02 ― The Coach
            </span>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl leading-tight font-medium inline-block text-white">
              伴走者について
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
            <div className="md:col-span-5 md:col-start-8 relative z-10">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1 }}
              >
                <img
                  src="/profile.jpg"
                  alt="Ishikawa Toshiro"
                  className="w-full aspect-[3/4] object-cover grayscale contrast-125"
                />
              </motion.div>
              <div className="absolute -top-6 -right-6 w-full h-full border border-white/30 z-[-1]" />
            </div>

            <div className="md:col-span-7 md:col-start-1 md:row-start-1 z-20 mix-blend-lighten">
              <div className="mb-6">
                <p className="text-sm tracking-widest text-white/60 mb-2 font-display">
                  Representative / Coach
                </p>
                <h3 className="text-2xl md:text-3xl font-bold font-serif tracking-wide">
                  石川 登志郎
                  <span className="text-lg font-normal opacity-70 ml-2 font-display">
                    Toshiro Ishikawa
                  </span>
                </h3>
              </div>

              <h3 className="font-serif text-3xl md:text-4xl lg:text-5xl mb-8 leading-tight">
                <span className="inline-phrase">孤高なリーダーの</span>
                <br />
                <span className="text-white/70 inline-phrase">良き理解者</span>
                <span className="inline-phrase">であり続ける。</span>
              </h3>
              <div className="space-y-6 text-lg text-gray-300 leading-relaxed max-w-2xl">
                <p>
                  IT業界における大規模組織のマネジメント経験から得た知見と、
                  CTI認定プロコーチとしての「人」への深い洞察。
                  物事の本質を射抜く視点と、 人間味あふれる対話の両輪で、
                  あなたの抱える孤独や迷いに寄り添います。
                </p>
                <p className="text-base text-gray-400 mt-4">
                  Gallup® 認定ストレングスコーチ ／ CTI認定プロコーチ（CPCC）
                  <br />
                  Top 5: 親密性 / 自我 / 未来志向 / 戦略性 / 分析思考
                </p>
              </div>

              <div className="mt-12 flex flex-wrap gap-x-12 gap-y-6 border-t border-white/20 pt-8">
                <div>
                  <div className="text-white font-display text-4xl">165+</div>
                  <div className="text-sm tracking-wider opacity-60 mt-1 uppercase">
                    Life Coaching Hours
                  </div>
                </div>

                <div>
                  <div className="text-white font-display text-4xl">180+</div>
                  <div className="text-sm tracking-wider opacity-60 mt-1 uppercase">
                    Strengths Hours
                  </div>
                </div>

                <div>
                  <div className="text-white font-display text-4xl">
                    Certified
                  </div>
                  <div className="text-sm tracking-wider opacity-60 mt-1 uppercase">
                    Global Standard
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- Recommends (Target) --- */}
      <section className="py-24 px-6 md:px-20 bg-[var(--color-paper-dark)]">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <span className="font-display text-[#223a5e] text-lg tracking-widest uppercase mb-4 block opacity-60">
            03 ― Target
          </span>
          <h2 className="font-serif text-2xl md:text-3xl text-[#223a5e] mb-4">
            訪れる変化のサイン
          </h2>
          <p className="text-gray-500">
            これらの「迷い」は、あなたが次のステージへ進む準備が整ったサインです。
            <br className="hidden md:inline" />
            まだ言葉になっていなくても、対話を通じて少しずつ道筋が見えていきます。
          </p>
        </div>

        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
          {[
            "周囲の期待に応えてばかりで、自分の本当の願いがわからない",
            "大事な決断の前に、自信が揺らぎ、足がすくんでしまう",
            "今の働き方や生き方に説明しづらい違和感がある",
            "マネージャーとして孤立し、本音を話せる相手がいない",
            "「強み」と言われてもピンとこず、どう活かせばいいかわからない",
            "もっと自分らしく生きたいのに、わがままになるのではと怖い",
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-start gap-4 p-6 bg-white border border-slate-100 shadow-sm rounded-sm"
            >
              <div className="w-6 h-6 mt-1 border border-[#223a5e] rounded-full flex items-center justify-center shrink-0 text-[#223a5e]">
                <Check size={14} />
              </div>
              <p className="text-gray-700 leading-relaxed font-medium">
                {item}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* --- Services --- */}
      <section
        id="services"
        className="py-32 px-6 md:px-20 bg-[var(--color-paper)]"
      >
        <SectionHeader en="04 ― Offerings" jp="提供するサービス" />

        <div className="max-w-7xl mx-auto space-y-32">
          {/* Service 01 */}
          <div className="flex flex-col md:flex-row gap-12 md:gap-24 items-center group">
            <div className="md:w-1/2 relative">
              <div className="overflow-hidden">
                <img
                  src="/service1.jpg"
                  alt="Life Coaching"
                  className="w-full aspect-video object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              <div className="absolute -bottom-8 -right-8 bg-white p-6 shadow-xl hidden md:block">
                <span className="font-display text-5xl text-slate-200">01</span>
              </div>
            </div>
            <div className="w-full md:w-1/2">
              <h3 className="font-serif text-3xl font-bold mb-6 text-[#223a5e] group-hover:opacity-80 transition-opacity">
                ライフコーチング
                <br />
                <span className="text-lg font-normal font-sans text-gray-500 mt-2 block">
                  (Co-Active®)
                </span>
              </h3>
              <p className="text-gray-600 leading-loose mb-8">
                「どうすべきか」ではなく「どう在りたいか」。正解のない問いに対して、あなたの内側にある願いを探求します。
                仕事、人間関係、ライフワーク。人生のあらゆる局面で、納得感のある選択をするための土台を作ります。
              </p>
              <ul className="space-y-2 mb-8 font-serif text-gray-700">
                <li className="flex items-center gap-3">
                  <Check size={16} className="text-[#223a5e]" />{" "}
                  真の願いと価値観の言語化
                </li>
                <li className="flex items-center gap-3">
                  <Check size={16} className="text-[#223a5e]" />{" "}
                  メンタルブロックの解消
                </li>
                <li className="flex items-center gap-3">
                  <Check size={16} className="text-[#223a5e]" />{" "}
                  願いを行動へ、確かな一歩を
                </li>
              </ul>
              <MagneticButton dark={false} onClick={scrollToForm}>
                View Details
              </MagneticButton>
            </div>
          </div>

          {/* Service 02 */}
          <div className="flex flex-col md:flex-row-reverse gap-12 md:gap-24 items-center group">
            <div className="md:w-1/2 relative">
              <div className="overflow-hidden">
                <img
                  src="/service2.jpg"
                  alt="Strengths Coaching"
                  className="w-full aspect-video object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              <div className="absolute -top-8 -left-8 bg-white p-6 shadow-xl hidden md:block">
                <span className="font-display text-5xl text-slate-200">02</span>
              </div>
            </div>
            <div className="w-full md:w-1/2">
              <h3 className="font-serif text-3xl font-bold mb-6 text-[#223a5e] group-hover:opacity-80 transition-opacity">
                ストレングスコーチング
                <br />
                <span className="text-lg font-normal font-sans text-gray-500 mt-2 block">
                  (CliftonStrengths®)
                </span>
              </h3>
              <p className="text-gray-600 leading-loose mb-8">
                <span className="inline-phrase">「才能」は、磨かなければ</span>
                <span className="inline-phrase">ただの「癖」です。</span>
                <br />
                <span className="inline-phrase">
                  Gallup社の診断ツールを用いて、あなたの才能を客観的に分析。
                </span>
                <br className="hidden md:inline" />
                <span className="inline-phrase">
                  無意識の行動パターンを戦略的な「強み」へと昇華させ、
                </span>
                <br className="hidden md:inline" />
                <span className="inline-phrase">
                  パフォーマンスを最大化します。
                </span>
              </p>
              <ul className="space-y-2 mb-8 font-serif text-gray-700">
                <li className="flex items-center gap-3">
                  <Check size={16} className="text-[#223a5e]" />{" "}
                  資質プロファイルの徹底分析
                </li>
                <li className="flex items-center gap-3">
                  <Check size={16} className="text-[#223a5e]" />{" "}
                  卓越した成果を生む「勝ちパターン」の活用
                </li>
                <li className="flex items-center gap-3">
                  <Check size={16} className="text-[#223a5e]" />{" "}
                  強みを活かしたマネジメント
                </li>
              </ul>
              <MagneticButton dark={false} onClick={scrollToForm}>
                View Details
              </MagneticButton>
            </div>
          </div>
        </div>
      </section>

      {/* --- Process Flow --- */}
      <section id="process" className="py-32 px-6 md:px-20 bg-white">
        <SectionHeader en="05 ― Process" jp="導入までの流れ" />

        <div className="max-w-4xl mx-auto">
          <div className="relative border-l-2 border-slate-200 pl-10 md:pl-20 py-4 space-y-20">
            {[
              {
                step: "01",
                title: "フォームからお申し込み",
                text: "まずは無料体験セッションにお申し込みください。簡単なアンケートにご記入いただき、日程調整のご連絡を差し上げます。",
                icon: MessageSquare,
              },
              {
                step: "02",
                title: "体験セッション (30分)",
                text: "オンライン（Zoom）にて、実際のコーチングを体験いただきます。現状の課題や、コーチとの相性をご確認ください。無理な勧誘は一切いたしません。",
                icon: Clock,
              },
              {
                step: "03",
                title: "プランのご提案",
                text: "あなたの目標や状況に合わせて、最適な継続プラン（月1回〜、3ヶ月〜など）をご提案します。",
                icon: Calendar,
              },
              {
                step: "04",
                title: "継続セッション開始",
                text: "合意いただけましたら、契約を結び、本セッションを開始します。ここからが本当の変化の始まりです。",
                icon: ArrowUpRight,
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="relative"
              >
                <div className="absolute -left-[calc(2.5rem+1px)] md:-left-[calc(5rem+1px)] top-0 w-5 h-5 rounded-full bg-white border-4 border-[#223a5e]" />

                <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-start">
                  <div className="font-display text-4xl text-slate-200 shrink-0">
                    {item.step}
                  </div>

                  <div className="flex-1">
                    <h3 className="font-serif text-xl font-bold text-[#223a5e] mb-3 flex items-center gap-3">
                      {item.title}
                    </h3>

                    <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                      {item.text}
                    </p>

                    {item.step === "04" && (
                      <div className="mt-8 bg-slate-50 rounded-xl border border-slate-200 p-6 md:p-8 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-[#223a5e]/5 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110 duration-500" />

                        <div className="relative z-10">
                          <h4 className="font-serif text-lg md:text-xl font-bold text-[#223a5e] mb-4 flex items-center gap-3">
                            <ShieldCheck
                              size={24}
                              className="text-[#223a5e]"
                              strokeWidth={1.5}
                            />
                            <span>ご契約の安心保証（ライフコーチング契約時）</span>
                          </h4>

                          <p className="text-slate-600 text-sm md:text-base leading-relaxed mb-6">
                            ライフコーチングをご契約いただいた日から30日間は、
                            <br />
                            安心して変化のプロセスを試していただける期間としています。
                          </p>

                          <p className="text-slate-600 text-sm md:text-base leading-relaxed mb-3">
                            セッションでは、その方の状況に応じて
                            <br />
                            次のような「変化の入口」となるテーマを扱います：
                          </p>

                          <ul className="space-y-3 mb-6">
                            {[
                              "今向き合うテーマが一つに定まる",
                              "それを止めている無意識のパターンが見えてくる",
                              "「次の一歩」が仮でも言葉になる",
                            ].map((text, idx) => (
                              <li
                                key={idx}
                                className="flex items-start gap-3 text-sm md:text-base text-slate-700"
                              >
                                <div className="mt-1 w-5 h-5 rounded-full bg-[#223a5e]/10 flex items-center justify-center flex-shrink-0">
                                  <Check
                                    size={12}
                                    className="text-[#223a5e]"
                                    strokeWidth={3}
                                  />
                                </div>
                                <span>{text}</span>
                              </li>
                            ))}
                          </ul>

                          <div className="bg-white rounded-lg p-4 border border-slate-100 shadow-sm">
                            <p className="text-slate-700 text-sm leading-relaxed">
                              30日間の中で
                              <span className="font-bold text-[#223a5e]">
                                “前に進む方向性の手応えがまったくない”
                              </span>
                              と感じ、継続を望まれない場合は、
                              <br />
                              <span className="underline decoration-slate-300 underline-offset-4">
                                その月のセッション料金はいただきません。
                              </span>
                              契約もその場で終了できます。
                            </p>
                          </div>

                          <p className="text-xs text-slate-400 mt-4 text-center md:text-left">
                            ※この保証は、ご自身の人生に主体的に向き合う方が、安心して一歩を踏み出すための仕組みです。
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Voices --- */}
      <section
        id="voices"
        className="py-32 px-6 md:px-20 bg-[var(--color-paper-dark)]"
      >
        <SectionHeader en="06 ― Voices" jp="クライアントの声" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            {
              text: "最初は不安でしたが、同じ立場で肯定的に関わってもらえて安心できました。気づけばたくさん話していて、最後にはきれいに整理されていました。",
              user: "30代男性 / サービス業",
            },
            {
              text: "自分を知る良い機会でした。数回のセッションを経て、日々の選択に迷いが減り、自信を持って行動できるようになりました。",
              user: "30代女性 / フリーランス",
            },
            {
              text: "悩んだ時にセッションを思い出すことで気持ちを切り替えられるようになりました。普段の仕事や生活でも、自分を整える支えになっています。",
              user: "40代男性 / IT企画職",
            },
            {
              text: "自分の声の聴き方とモノの見方を深めることができました。どんな状態で居たいのかに気づけて、本当に感謝しています。",
              user: "30代男性 / 広告業界",
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -5 }}
              className="bg-white p-10 md:p-14 relative shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100"
            >
              <Quote className="absolute top-8 right-8 text-slate-100 w-12 h-12" />
              <p className="font-serif text-lg leading-loose text-gray-700 mb-8">
                {item.text}
              </p>
              <div className="flex items-center gap-4">
                <div className="w-10 h-[1px] bg-[#223a5e]" />
                <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">
                  {item.user}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* --- FAQ --- */}
      <section id="faq" className="py-32 px-6 md:px-20 bg-white">
        <SectionHeader en="07 ― Q&A" jp="よくある質問" />

        <div className="max-w-3xl mx-auto">
          {[
            {
              q: "コーチングを受けるのが初めてで不安です。",
              a: "ご安心ください。多くのクライアント様が初めての方です。まずは対話を通じてリラックスしていただき、無理なく思考を整理できるようガイドいたします。",
            },
            {
              q: "まだ明確な目標がないのですが、受けても大丈夫ですか？",
              a: "はい、大丈夫です。「何がしたいかわからない」「モヤモヤしている」という状態こそ、コーチングが役立ちます。対話の中で本当の願いや目標を見つけていきましょう。",
            },
            {
              q: "準備するものはありますか？",
              a: "特別な準備は必要ありませんが、静かで話しやすい環境（通信環境含む）をご用意ください。もし話したいテーマがあれば、事前にメモしておくとスムーズです。",
            },
            {
              q: "ストレングスファインダー（CliftonStrengths）の診断結果は必須ですか？",
              a: "ライフコーチングの場合は必須ではありません。ストレングスコーチングをご希望の場合は、事前に診断（Top5または34資質）を受けていただき、結果レポートをお手元にご用意ください。",
            },
            {
              q: "初回のライフコーチングが合わなかった場合、料金はどうなりますか？",
              a: "ご契約から30日以内のセッションで、前に進む手応えがまったく得られず、継続を希望されない場合は、料金はいただきません。契約もその場でいったん終了となります。この安心保証は、安心して一歩を踏み出していただくために設けています。",
            },
          ].map((item, i) => (
            <FAQItem key={i} q={item.q} a={item.a} />
          ))}
        </div>
      </section>

      {/* --- Contact Form --- */}
      <section
        id="contact-form"
        className="py-24 px-6 md:px-20 bg-[#223a5e] text-white relative overflow-hidden scroll-mt-32"
      >
        <div className="max-w-2xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="font-serif text-4xl md:text-6xl font-bold mb-6 leading-tight"
            >
              <span className="inline-block">すべての可能性は、</span>
              <span className="inline-block">この瞬間に。</span>
            </motion.h2>
            <p className="text-white/70 text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
              まずは30分の無料体験セッションで、
              <br className="hidden md:inline" />
              あなたの中に眠る「答え」に触れてみてください。
            </p>
          </div>

          {/* Formspree Form */}
          <form
            ref={formRef}
            onSubmit={handleFormSubmit}
            className="bg-[#223a5e] p-6 md:p-10 rounded-3xl border border-white/20 shadow-2xl"
          >
            <div className="space-y-8">
              {/* 1. 基本情報（縦並び） */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <label
                    htmlFor="name"
                    className="text-sm font-medium text-white/90"
                  >
                    お名前（ニックネーム可）
                    <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    required
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-white/50 focus:bg-white/20 transition-all"
                    placeholder="山田 太郎"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="text-sm font-medium text-white/90"
                  >
                    ご連絡先（メールアドレス）
                    <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    required
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-white/50 focus:bg-white/20 transition-all"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <hr className="border-white/10" />

              {/* 2. ご希望の内容（チップ選択式） */}
              <div className="space-y-3">
                <p className="text-sm font-medium text-white/90">
                  ご希望の内容（複数選択可）
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    "話だけ聞いてみたい",
                    "ライフコーチング",
                    "ストレングスコーチング",
                  ].map((item) => (
                    <label key={item} className="cursor-pointer group relative">
                      <input
                        type="checkbox"
                        name="service_option"
                        value={item}
                        className="peer sr-only"
                      />

                      <div
                        className="
                          w-full
                          text-center
                          px-3 py-2
                          rounded-full
                          border border-white/20
                          bg-white/5
                          text-white/80 text-sm
                          transition-all duration-300
                          peer-checked:bg-white
                          peer-checked:text-[#223a5e]
                          peer-checked:font-bold
                          hover:bg-white/10
                        "
                      >
                        {item}
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* 3. メッセージ */}
              <div className="space-y-2">
                <label
                  htmlFor="message"
                  className="text-sm font-medium text-white/90"
                >
                  今感じていること・話してみたいこと（任意）
                </label>
                <textarea
                  name="message"
                  id="message"
                  rows={3}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-white/50 focus:bg-white/20 transition-all resize-none"
                  placeholder="ざっくりで大丈夫です。書ける範囲でどうぞ。"
                ></textarea>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  className="group relative w-full inline-flex h-14 items-center justify-center overflow-hidden rounded-full bg-white font-bold text-[#223a5e] transition-all duration-300 hover:bg-[#e6e6e6] shadow-lg hover:shadow-white/20 hover:scale-[1.01]"
                >
                  <span className="mr-2 text-lg">
                    無料で体験セッションを申し込む
                  </span>
                  <ArrowUpRight className="w-5 h-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                </button>
                <p className="text-center text-white/40 text-xs mt-4">
                  ※ 日時は、後ほどメールで調整します。今はざっくりでOKです。
                </p>
              </div>
            </div>
          </form>
        </div>
      </section>

      {/* --- Footer --- */}
      <footer
        id="footer"
        className="bg-[#223a5e] text-white pt-4 pb-8 px-6 md:px-20 overflow-hidden relative"
      >
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="flex flex-col items-center gap-4 text-sm text-white/50">
            <div className="h-16 w-auto">
              <img
                src="/logo2.png"
                alt="NAKAIMA"
                className="h-10 w-auto object-contain opacity-80 hover:opacity-100 transition-opacity"
              />
            </div>
            <p>&copy; 2025 NAKAIMA BANSOSHAR</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
