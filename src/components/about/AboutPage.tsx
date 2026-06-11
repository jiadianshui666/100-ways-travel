"use client";

import { ScrollReveal } from "@/components/home/ScrollReveal";

const VALUES = [
  {
    icon: "🌍",
    title: "深度探索",
    desc: "我们相信旅行不只是打卡，而是沉浸式的文化体验。每一种旅行方式都经过实地考察，确保深度与真实。",
    color: "cyan" as const,
  },
  {
    icon: "💡",
    title: "灵感驱动",
    desc: "从街头小吃到极限冒险，从禅修静心到城市夜游——我们不断寻找让人眼前一亮的旅行灵感。",
    color: "purple" as const,
  },
  {
    icon: "🤝",
    title: "社区共创",
    desc: "每一位旅行者都是故事的主角。我们汇聚全球旅行者的真实体验，让推荐不再千篇一律。",
    color: "pink" as const,
  },
];

const colorMap = {
  cyan: { border: "border-neon-cyan/20 hover:border-neon-cyan/40", shadow: "hover:shadow-neon-cyan", bg: "bg-neon-cyan/5" },
  purple: { border: "border-neon-purple/20 hover:border-neon-purple/40", shadow: "hover:shadow-neon-purple", bg: "bg-neon-purple/5" },
  pink: { border: "border-neon-pink/20 hover:border-neon-pink/40", shadow: "hover:shadow-neon-pink", bg: "bg-neon-pink/5" },
};

export function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* ── Hero ── */}
      <section className="relative py-24 sm:py-32 lg:py-40 px-4 text-center overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-neon-cyan/8 rounded-full blur-[150px]" />
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-neon-purple/10 rounded-full blur-[180px]" />
        </div>

        <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-display font-bold">
            <span className="text-neon-gradient">关于百途旅行</span>
          </h1>
          <p className="text-lg sm:text-xl text-dark-300 leading-relaxed max-w-2xl mx-auto">
            我们相信，旅行有 100 种打开方式
          </p>
          <p className="text-dark-400 max-w-xl mx-auto leading-relaxed">
            从热闹都市的深夜街头，到无人荒野的星空营地；从米其林餐桌的精致一口，
            到路边摊的一碗人间烟火——每一种体验都值得被记录、被分享、被珍藏。
          </p>
        </div>
      </section>

      {/* ── Values ── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
        <ScrollReveal>
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-white text-center mb-4">
            我们的价值主张
          </h2>
          <p className="text-dark-400 text-center mb-12 max-w-lg mx-auto">
            三个核心理念，驱动我们不断寻找更好的旅行方式
          </p>
        </ScrollReveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {VALUES.map((v, i) => {
            const c = colorMap[v.color];
            return (
              <ScrollReveal key={v.title} delay={i * 150} direction="up">
                <div
                  className={`glass p-8 rounded-2xl border ${c.border} ${c.shadow} ${c.bg} transition-all duration-500 group`}
                >
                  <div className="text-4xl mb-5">{v.icon}</div>
                  <h3 className="text-lg font-display font-semibold text-white mb-3 group-hover:text-neon-gradient transition-colors">
                    {v.title}
                  </h3>
                  <p className="text-sm text-dark-400 leading-relaxed">{v.desc}</p>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-4">
          <ScrollReveal>
            <div className="glass-strong rounded-3xl p-8 sm:p-12 grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
              {[
                { value: "100+", label: "旅行方式" },
                { value: "50+", label: "目的地" },
                { value: "10K+", label: "旅行者" },
                { value: "2024", label: "创始年份" },
              ].map((s) => (
                <div key={s.label} className="space-y-2">
                  <div className="text-3xl sm:text-4xl font-display font-bold text-neon-green text-glow-cyan">
                    {s.value}
                  </div>
                  <div className="text-xs text-dark-400 uppercase tracking-widest">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── Story ── */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
        <ScrollReveal>
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-white mb-8 flex items-center gap-3">
            <span className="w-1 h-8 rounded-full bg-neon-gradient" />
            我们的故事
          </h2>
        </ScrollReveal>

        <div className="space-y-6 text-dark-300 leading-relaxed text-sm sm:text-base">
          <ScrollReveal delay={100}>
            <p>
              2024 年，一群热爱旅行的人在东京深夜的一家拉面馆里相遇。从酱油拉面聊到冰岛极光，
              从成都苍蝇馆子聊到安纳普尔纳的星空——我们忽然意识到：世界上的旅行方式，远比想象中丰富得多。
            </p>
          </ScrollReveal>
          <ScrollReveal delay={200}>
            <p>
              主流的旅行攻略总是告诉你&ldquo;必去的 10 个景点&rdquo;，但我们发现，真正让旅行变得难忘的，
              往往是那些不按常理出牌的体验：凌晨 4 点去岚山竹林打坐、在曼谷水上市场学做冬阴功、
              跟着本地老饕钻进只有三张桌子的小馆子……
            </p>
          </ScrollReveal>
          <ScrollReveal delay={300}>
            <p>
              于是，<strong className="text-white">百途旅行</strong>诞生了。我们立志收集
              100 种独特的旅行方式，让每一位旅行者都能找到属于自己的那一种。
            </p>
          </ScrollReveal>
          <ScrollReveal delay={400}>
            <p className="text-dark-400 italic border-l-2 border-neon-purple/50 pl-4 py-1">
              &ldquo;旅行不是打卡，是发现。不是逃离，是抵达。我们相信，世界上总有一种旅行方式，能与你灵魂共振。&rdquo;
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-16 sm:py-24 text-center px-4">
        <ScrollReveal>
          <div className="glass max-w-xl mx-auto p-10 sm:p-14 rounded-3xl border border-neon-purple/10">
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-white mb-4">
              准备好出发了吗？
            </h2>
            <p className="text-dark-400 mb-8">
              发现属于你的那一种旅行方式
            </p>
            <a
              href="/experiences"
              className="inline-flex px-8 py-3.5 rounded-xl bg-neon-purple/15 border border-neon-purple/40 text-neon-purple font-semibold hover:bg-neon-purple/25 hover:shadow-neon-purple transition-all duration-300"
            >
              开始探索 →
            </a>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}
