import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { FilterChip } from "@/components/ui/FilterChip";
import { NicheLevelBadge } from "@/components/ui/NicheLevelBadge";

export default function Home() {
  return (
    <div className="relative overflow-hidden">
      {/* ── Hero ── */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center px-4 text-center">
        {/* Background glows */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-neon-purple/20 rounded-full blur-[180px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-neon-cyan/15 rounded-full blur-[180px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-neon-pink/8 rounded-full blur-[200px]" />
        </div>

        <div className="space-y-6 max-w-3xl animate-fade-in">
          <Badge variant="purple" size="lg">
            ✈️ 100 种旅行方式
          </Badge>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-display font-bold tracking-tight leading-tight">
            <span className="text-neon-gradient">探索世界</span>
            <br />
            <span className="text-white">的每一种可能</span>
          </h1>

          <p className="text-lg sm:text-xl text-dark-300 max-w-xl mx-auto">
            从热闹都市到无人荒野，从街头小吃到米其林餐桌——你的下一次冒险，从这里开始。
          </p>

          <div className="flex flex-wrap gap-3 justify-center pt-4">
            <Link
              href="/experiences"
              className="px-8 py-3.5 rounded-xl bg-neon-purple/15 border border-neon-purple/40 text-neon-purple font-semibold hover:bg-neon-purple/25 hover:shadow-neon-purple transition-all duration-300"
            >
              开始探索 →
            </Link>
            <Link
              href="/categories"
              className="px-8 py-3.5 rounded-xl bg-white/5 border border-white/10 text-dark-200 font-semibold hover:bg-white/10 hover:border-white/20 transition-all duration-300"
            >
              浏览分类
            </Link>
          </div>
        </div>

        {/* Niche level examples */}
        <div className="flex flex-wrap gap-3 justify-center mt-12 animate-slide-up">
          <NicheLevelBadge level="mainstream" />
          <NicheLevelBadge level="popular" />
          <NicheLevelBadge level="rising" />
          <NicheLevelBadge level="niche" />
          <NicheLevelBadge level="hidden-gem" />
        </div>

        {/* Filter chips */}
        <div className="flex flex-wrap gap-2 justify-center mt-6 animate-slide-up">
          <FilterChip label="城市探索" active count={12} />
          <FilterChip label="自然风光" count={8} />
          <FilterChip label="美食之旅" count={15} />
          <FilterChip label="极限冒险" count={6} />
          <FilterChip label="文化体验" count={10} />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-8 sm:gap-16 mt-16 animate-slide-up">
          {[
            { value: "100+", label: "旅行方式" },
            { value: "50+", label: "目的地" },
            { value: "∞", label: "灵感" },
          ].map((stat) => (
            <div key={stat.label} className="text-center space-y-1">
              <div className="text-3xl sm:text-4xl font-display font-bold text-neon-green text-glow-cyan">
                {stat.value}
              </div>
              <div className="text-xs sm:text-sm text-dark-400 uppercase tracking-widest">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 animate-bounce">
          <svg
            className="w-6 h-6 text-dark-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
      </section>

      {/* ── Features section ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-white mb-4">
            为什么选择百途旅行
          </h2>
          <p className="text-dark-400 max-w-xl mx-auto">
            我们精心策划每一种旅行体验，让你的每一次出发都与众不同
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              icon: "🎯",
              title: "精选体验",
              desc: "每一种旅行方式都经过实地考察和精选，确保品质与独特性",
              accent: "cyan" as const,
            },
            {
              icon: "💎",
              title: "小众路线",
              desc: "避开人潮，发现不为人知的隐藏宝藏和本地人推荐的秘密地点",
              accent: "purple" as const,
            },
            {
              icon: "⚡",
              title: "即刻出发",
              desc: "从灵感发现到行程预订，一站式服务让你快速成行",
              accent: "pink" as const,
            },
          ].map((feat) => (
            <div
              key={feat.title}
              className={`card-glass-${feat.accent} p-8 group`}
            >
              <div className="text-3xl mb-4">{feat.icon}</div>
              <h3 className="text-lg font-display font-semibold text-white mb-2">
                {feat.title}
              </h3>
              <p className="text-sm text-dark-400 leading-relaxed">
                {feat.desc}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
