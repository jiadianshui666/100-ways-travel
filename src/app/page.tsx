export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-purple/20 rounded-full blur-[128px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-cyan/20 rounded-full blur-[128px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-neon-pink/10 rounded-full blur-[160px]" />
      </div>

      {/* Content */}
      <div className="text-center space-y-8 max-w-2xl">
        <h1 className="text-5xl sm:text-7xl font-bold tracking-tight">
          <span className="gradient-neon">100 Ways Travel</span>
        </h1>
        <p className="text-xl sm:text-2xl text-dark-200 font-light">
          探索 100 种旅行方式，发现世界之美
        </p>
        <p className="text-dark-400 text-sm sm:text-base">
          Explore a hundred ways to travel. From bustling cities to quiet
          mountains, from street food tours to luxury escapes — your next
          adventure starts here.
        </p>

        <div className="flex gap-4 justify-center pt-4">
          <button className="px-8 py-3 rounded-lg bg-neon-purple/20 border border-neon-purple/50 text-neon-purple font-medium hover:bg-neon-purple/30 hover:shadow-neon-purple transition-all duration-300">
            开始探索
          </button>
          <button className="px-8 py-3 rounded-lg bg-neon-cyan/20 border border-neon-cyan/50 text-neon-cyan font-medium hover:bg-neon-cyan/30 hover:shadow-neon-cyan transition-all duration-300">
            Learn More
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-8 pt-12 text-center">
          {[
            { value: "100+", label: "旅行方式" },
            { value: "50+", label: "目的地" },
            { value: "∞", label: "灵感" },
          ].map((stat) => (
            <div key={stat.label} className="space-y-1">
              <div className="text-3xl font-bold text-neon-green text-glow-neon">
                {stat.value}
              </div>
              <div className="text-xs text-dark-400 uppercase tracking-widest">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-4 text-dark-500 text-xs">
        Built with Next.js 14 · Dark Neon Edition
      </footer>
    </main>
  );
}
