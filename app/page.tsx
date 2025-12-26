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
  const [agreedPrivacy, setAgreedPrivacy] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false); 


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
              <span className="inline-phrase">止めているのは</span>
              <br />
              <span className="inline-phrase">迷いじゃない</span>
              <br />
              <span className="inline-phrase">本音だ</span>
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
              <br />
              正論も、責任も、ちゃんと分かっている。それでも足が止まる。軽い決断をしたくない感覚が、そこにある。
              </span>
              <br className="hidden md:inline" />
              <span className="inline-block">
               
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
            alt=""
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
                  迷いを解消するだけの時間ではありません。
                </span>
              </p>
              <p className="mt-4">
                <span className="inline-block">あなたの中に眠っていた</span>
                <span className="inline-block">“ほんとうの声”が動き出し、</span>
                <br className="hidden md:inline" />
                <span className="inline-block">選択の質が変わっていくプロセスです。</span>
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

            <div className="md:col-span-7 md:col-start-1 md:row-start-1 z-20">
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
                  IT業界にて、海外拠点（中国）の組織立ち上げや、
                  100名規模のチームを率いる立場も経験し、
                  15年以上、マネージャーとして組織とビジネスの判断に携わってきました。
                  現在も判断と責任の現場に立ち続けています。
                </p>

                <p>
                  重責を負うほど、
                  一人で抱え込む時間は増えるもの。
                  ここには利害関係も、社内の思惑もありません。
                  ただの一人の人間として、
                  思考を整理し、自分を取り戻すための場所を。
                </p>

                <p>
                  同じように判断と責任の現場を知る立場として、
                  CTIの対話とCliftonStrengths®の知見を活かし、
                  思考の行き止まりに、前へ進む原動力が戻る場を提供します。
                </p>
              </div>

              {/* --- Credentials (quiet / footnote style) --- */}
              <div className="mt-10 border-t border-white/20 pt-6 max-w-2xl space-y-2">
                <p className="text-base text-white/70 leading-relaxed">
                  ICF認定コーチ（ACC）/ CTI認定プロコーチ（CPCC）/ Gallup® 認定ストレングスコーチ
                </p>
                <p className="text-sm text-white/50">
                  Top 5: 親密性 / 自我 / 未来志向 / 戦略性 / 分析思考
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* --- Recommends (Target) --- */}
      <section className="py-24 px-6 md:px-20 bg-[var(--color-paper-dark)]">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <span className="font-display text-[#223a5e] text-lg tracking-widest uppercase mb-4 block opacity-60">
            03 ― At This Point
          </span>
          <h2 className="font-serif text-2xl md:text-3xl text-[#223a5e] mb-4">
            その迷いは、次へ進む準備が始まっているサイン
          </h2>
            <p className="text-gray-500 mb-4">
              いま感じている迷いは、あなたが次のステージへ向かうための“揺れ”です。
              <br className="hidden md:inline" />
              まだ言葉になっていなくても、対話を通じて少しずつ輪郭が見えてきます。
            </p>
        </div>

        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
          {[
            "正論で説明しているはずなのに、現場が動いていく実感がない",
            "組織の成果を背負う立場で、メンバーの強みをどう活かせば前に進めるのか、判断に迷っている",
            "役職や立場上、判断に迷っていることを、誰にも相談できない",
            "決めたいとは思っているのに、最後の一手で、判断を先送りしてしまう",
            "今の働き方に大きな不満はないのに、このままでいいのかという違和感が残っている",
            "自分の考えで進みたいのに、周囲への影響を考えて、踏み出せずにいる",
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
                判断の前で立ち止まったとき、「自分は何を基準に選びたいのか」を取り戻すための対話です。正解のない問いに対して、あなたの内側にある願いを探求します。
                仕事、人間関係、ライフワーク。人生のあらゆる局面で、納得感のある選択をするための土台をつくります。
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
                <span className="inline-phrase">判断やマネジメントが重くなる理由を、</span>
                <span className="inline-phrase">自分の“強みの使い方”から整理していくコーチングです。</span>
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
                  資質プロファイルの徹底分析（強みの構造化）
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
                text: "まずは30分の無料体験セッションにお申し込みください。簡単なアンケートにご記入いただいた後、日程調整のご連絡を差し上げます。",
                icon: MessageSquare,
              },
              {
                step: "02",
                title: "体験セッション (30分)",
                text: "オンライン（Zoom）にて、実際のコーチングを体験いただきます。現状の課題や、コーチとの相性をご確認ください。無理な勧誘は一切いたしません。この場が「安全基地」になり得るかだけを確認してください。",
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
    text: "最初は不安でしたが、同じ立場で肯定的に関わってもらえて安心できました。気づけばたくさん話していて、内容が散らかっていても、最後にはすっと整理されていました。",
    user: "30代男性 / サービス業",
  },
  {
    text: "自分自身を知る良い機会になりました。セッションを重ねるうちに、自分の軸がはっきりしてきた実感があります。日々の選択に迷う時間が以前より減りました。",
    user: "30代女性 / フリーランス",
  },
  {
    text: "悩んだり困った時にセッションを思い出すと、気持ちを上げられるようになりました。問題の根本にあった前提に気づけたことも大きく、仕事や生活の中で自分を整えやすくなりました。",
    user: "40代男性 / IT企画職",
  },
  {
    text: "自分の声の聴き方や物事の見方を深めることができました。セッションを通して、どんな状態でいたいのかに気づけたことが印象に残っています。としろうさんとの出会いに感謝しています。",
    user: "30代男性 / 広告業界",
  },
]
.map((item, i) => (
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


{/* --- Pricing --- */}
<section
  id="pricing"
  className="py-32 px-6 md:px-20 bg-[var(--color-paper-light)]"
>
  <SectionHeader en="07 ― Pricing" jp="料金について" />

  <div className="max-w-5xl mx-auto -mt-16">

    {/* Intro */}
    <div className="max-w-4xl mx-auto text-center mb-16">
      <p className="text-gray-500 leading-relaxed">
        <span className="block mb-3 text-slate-600 font-medium">
          本セッションは、<br className="hidden md:inline" />
          判断と責任を一人で引き受けてきた方のための、個別伴走です。
        </span>

        ライフコーチングは扱うテーマの性質上、
        <span className="font-semibold text-slate-700">
          3ヶ月〜（全7回以上）の継続
        </span>
        でのみ承っています。
        <br className="hidden md:inline" />

        ストレングスコーチングは、
        単発でのご利用と継続のどちらにも対応しています。
        <br className="hidden md:inline" />
      </p>
    </div>

    {/* Pricing cards */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">

      {/* Life Coaching */}
      <div className="bg-white p-8 md:p-10 shadow-sm border border-slate-100 rounded-xl flex flex-col h-full">
        <h3 className="text-lg font-semibold tracking-wide text-[#223a5e] mb-3">
          ライフコーチング
        </h3>
        <p className="text-sm uppercase tracking-widest text-slate-400 mb-4">
          LIFE COACHING
        </p>
        <p className="text-2xl font-semibold text-[#223a5e] mb-2">
          3ヶ月伴走（全7回） ¥105,000
        </p>
        <p className="text-xs text-slate-400 mb-6">
          ※初回導入セッション120分＋継続セッション60分×6回
        </p>
        <ul className="space-y-3 text-sm text-slate-700 flex-grow">
          <li>・判断の前に立ち止まり、本音と向き合う対話を行います。</li>
          <li>・思考のクセに気づき、「自分の基準」で選べる状態を整えます。</li>
          <li>・日常の判断や行動に、変化が静かに積み重なっていきます。</li>
          <li>・ご契約の安心保証（下記参照）</li>
        </ul>
      </div>

      {/* Strengths Coaching */}


      <div className="bg-white p-8 md:p-10 shadow-sm border border-slate-100 rounded-xl flex flex-col h-full">
        <h3 className="text-lg font-semibold tracking-wide text-[#223a5e] mb-3">
          ストレングスコーチング
        </h3>

        {/* Header（左カードと階層を揃える） */}
        <h3 className="text-sm uppercase tracking-widest text-slate-400 mb-3">
          STRENGTHS REFRAMING
        </h3>

        <p className="text-2xl font-semibold text-[#223a5e] mb-2">
          強みの再定義と実務適用　¥115,000
        </p>

        <p className="text-xs text-slate-400 mb-6">
          マネージャーとしての意思決定を扱います
        </p>


{/* Breakdown */}
<div className="space-y-2 text-sm text-slate-700 mb-6">
  <div className="flex justify-between">
    <span>
      資質プロファイリング
      <span className="text-xs text-slate-400 ml-1">（90分）</span>
    </span>
    <span className="font-semibold text-[#223a5e]">¥15,000</span>
  </div>

  <div className="flex justify-between">
    <span>
      ストレングス再定義セッション
      <span className="text-xs text-slate-400 ml-1">（60分 × 5回）</span>
    </span>
    <span className="font-semibold text-[#223a5e]">¥100,000</span>
  </div>

  <p className="text-xs text-slate-500 mt-2">
    ※プロファイリングを土台として進めます
  </p>
</div>


        {/* Short Description */}
        <p className="text-sm text-slate-600 leading-relaxed mb-6">
          判断の背景にある思考と行動のつながりを捉え直し、<br />
          チームを動かす一手を、自分の確信で選び直すための対話です。
        </p>

        {/* Details */}
        <details className="group mt-auto">
          <summary className="text-sm text-[#223a5e] font-medium underline cursor-pointer list-none mb-4">
            この対話で扱うことを見る ▸
          </summary>

          <p className="text-sm text-slate-600 leading-relaxed">
            マネージャーとしての判断軸と、<br />
            意思決定が鈍る「ボトルネック」はどこにあるのか。<br /><br />

            CliftonStrengths®を一つの指標として、<br />
            無意識に起きている思考と行動のつながりを捉え直していきます。
            <br /><br />

            自分の行動原理がロジカルに腹落ちすることで、<br />
            迷いや躊躇がほどけ、<br />
            <strong>次の一手を「自分の確信」で選び、行動に移せる軸</strong>が整っていきます。
            <br /><br />

            その変化は、マネージャー自身だけでなく、<br />
            <strong>
              メンバーとの関わり方や、チームの動きにも波及していきます。
            </strong>
          </p>
        </details>

      </div>
    </div>



{/* Guarantee Section */}
          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-8 md:p-12 relative overflow-hidden group">
            
            {/* Decoration Background (Subtle & Elegant) */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#223a5e]/5 rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-105 duration-700 pointer-events-none" />

            <div className="relative z-10">
              <h4 className="font-serif text-xl md:text-2xl font-bold text-[#223a5e] mb-10 flex items-center gap-4">
                <div className="p-2 bg-white rounded-lg shadow-sm text-[#223a5e]">
                  <ShieldCheck size={28} strokeWidth={1.5} />
                </div>
                <span>ご契約の安心保証（ライフコーチング限定）</span>
              </h4>

              <div className="grid md:grid-cols-2 gap-10 items-center">
                
                {/* Left Column: Description */}
                <div>
                  <div className="space-y-6 text-slate-600 text-sm md:text-base leading-loose">
                    <p>
                      ライフコーチングをご契約いただいた日から30日間は、
                      <br className="hidden md:inline" />
                      安心して変化のプロセスに向き合っていただく
                      <br className="hidden md:inline" />
                      期間としています。
                    </p>
                    <p>
                      この期間の中で、セッションではその方の状況に応じて、
                      <br className="hidden md:inline" />
                     次のような 「変化の入口」となるテーマを扱います：
                    </p>
                  </div>

                  <ul className="mt-8 space-y-4">
                    {[
                      "今向き合うテーマが一つに定まる",
                      "それを止めている無意識のパターンが見えてくる",
                      "「次の一歩」が仮でも言葉になる",
                    ].map((text, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-3 text-sm md:text-base text-slate-700"
                      >
                        <div className="mt-1 w-6 h-6 rounded-full bg-[#223a5e]/10 flex items-center justify-center flex-shrink-0 text-[#223a5e]">
                          <Check size={14} strokeWidth={3} />
                        </div>
                        <span className="leading-relaxed pt-[2px]">{text}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Right Column: Promise Card */}
                <div className="flex flex-col">
                  <div className="bg-white rounded-xl p-8 shadow-md border-l-4 border-[#223a5e] relative">
                    {/* "Guarantee" Label */}
                    <span className="absolute -top-3 right-6 bg-[#223a5e] text-white text-[10px] font-bold px-3 py-1 rounded-full tracking-widest uppercase">
                      Guarantee
                    </span>
                    
                    <p className="text-slate-700 text-sm md:text-base leading-relaxed">
                      30日間の中で
                      <span className="block my-4 font-bold text-lg text-[#223a5e]">
                        “前に進む方向性の手応えが<br/>まったくない”
                      </span>
                      と感じ、継続を望まれない場合は、
                    </p>
                    <div className="mt-4 pt-4 border-t border-slate-100">
                      <p className="font-semibold text-slate-800">
                        その月のセッション料金はいただきません。
                      </p>
                      <p className="text-sm text-slate-500 mt-1">
                        契約もその場で終了できます。
                      </p>
                    </div>
                  </div>
                  
                  <p className="text-xs text-slate-400 mt-5 text-center leading-relaxed px-4">
                    ※この保証は、ご自身の人生に主体的に向き合う方が、<br className="hidden md:inline"/>
                    安心して最初の一歩を踏み出すための仕組みです。
                  </p>
                </div>

              </div>
            </div>
          </div>

        </div>
      </section>



      {/* --- FAQ --- */}
      <section id="faq" className="py-32 px-6 md:px-20 bg-white">
        <SectionHeader en="08 ― Q&A" jp="よくある質問" />

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
              思考の荷物を下ろし、 胸の奥で眠っていた“願いの輪郭”に触れてみてください。
              <br className="hidden md:inline" />
              まずは30分の無料体験セッションでお待ちしています。
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

              {/* 3. メッセージ ＋ プライバシーポリシー同意 */}
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

                {/* プライバシーポリシー同意（おしゃれ版） */}
                <label className="group flex items-start gap-3 cursor-pointer select-none mt-1">
                  {/* 機能用の隠しチェックボックス */}
                  <input
                    type="checkbox"
                    name="privacyConsent"
                    required
                    checked={agreedPrivacy}
                    onChange={(e) => setAgreedPrivacy(e.target.checked)}
                    className="peer sr-only"
                  />

                  {/* 見た目用カスタムチェックボックス */}
                  <div
                    className="
                      relative mt-[2px] flex-shrink-0 w-5 h-5
                      border border-white/30 rounded
                      bg-white/5 transition-all duration-300
                      group-hover:border-white/70 group-hover:bg-white/10
                      peer-checked:bg-white peer-checked:border-white
                      peer-focus:ring-2 peer-focus:ring-white/30
                    "
                  >
                    <svg
                      className="w-full h-full text-[#223a5e] transition-transform duration-200 scale-0 peer-checked:scale-100"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>

                  {/* 説明テキスト＋リンク */}
                  <span className="text-[11px] md:text-xs text-white/50 leading-relaxed group-hover:text-white/80 transition-colors">
                    お申し込み内容の管理および返信のために、入力いただいた情報を利用することに同意します。
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        setIsPrivacyOpen(true);
                      }}
                      className="ml-2 underline underline-offset-2 decoration-white/40 text-white/60 hover:text-white/90 hover:decoration-white transition-all"
                    >
                      プライバシーポリシーを表示
                    </button>
                  </span>
                </label>
              </div>



              {/* Submit Button */}
              <div className="mt-6">
                <button
                  type="submit"
                  disabled={!agreedPrivacy}
                  className="group relative w-full inline-flex h-14 items-center justify-center overflow-hidden rounded-full bg-white font-bold text-[#223a5e] transition-all duration-300 hover:bg-[#e6e6e6] shadow-lg hover:shadow-white/20 hover:scale-[1.01] disabled:opacity-60 disabled:hover:scale-100 disabled:hover:shadow-none"
                >
                  <span className="mr-2 text-lg">
                    対話を予約する（無料）
                  </span>
                  <ArrowUpRight className="w-5 h-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                </button>
                
                <p className="text-center text-white/40 text-xs mt-3">
                  ※ 日時は、後ほどメールで調整します。今はざっくりでOKです。
                </p>
              </div>



            </div>
          </form>
        </div>
      </section>

      {/* --- Privacy Policy Modal --- */}
      <AnimatePresence>
        {isPrivacyOpen && (
          <motion.div
            className="fixed inset-0 z-[80] flex items-center justify-center bg-black/60 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsPrivacyOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative max-w-3xl w-full max-h-[80vh] overflow-y-auto bg-white text-slate-800 rounded-2xl p-8 md:p-10 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* 閉じるボタン */}
              <button
                type="button"
                onClick={() => setIsPrivacyOpen(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>

              <h2 className="text-center text-base md:text-lg tracking-[0.3em] font-semibold mb-8">
                PRIVACY POLICY
              </h2>

              <div className="space-y-6 text-sm leading-relaxed text-slate-800">

                <div>
                  <h3 className="text-base font-semibold mb-2">プライバシーポリシー（簡易版）</h3>
                  <p>
                    ナカイマ伴走舎では、お問い合わせフォームでお預かりした個人情報を、
                    <strong>「ご連絡・日程調整・サービス提供のため」</strong>
                    に利用します。
                  </p>
                </div>

                <div>
                  <h3 className="text-base font-semibold mb-2">第三者提供について</h3>
                  <p>
                    法令で必要な場合を除き、第三者に提供することはありません。
                  </p>
                </div>

                <div>
                  <h3 className="text-base font-semibold mb-2">情報の管理について</h3>
                  <p>
                    取得した情報は、必要な期間のみ安全に管理し、不要になったものは適切に削除します。
                  </p>
                </div>

                <div>
                  <h3 className="text-base font-semibold mb-2">開示・訂正・削除のご請求</h3>
                  <p>
                    ご自身の情報の <strong>開示・訂正・削除</strong> を希望される場合は、
                    お問い合わせフォームよりご連絡ください。
                  </p>
                </div>

              </div>


            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>


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
