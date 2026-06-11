import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="text-center space-y-6 animate-fade-in">
        <span className="text-8xl block">🗺️</span>
        <h1 className="text-4xl font-display font-bold text-neon-gradient">404</h1>
        <p className="text-lg text-dark-300">
          这片旅行地图还没有被绘制...<br />
          <span className="text-sm text-dark-500">页面不存在或已被移除</span>
        </p>
        <div className="flex gap-4 justify-center pt-4">
          <Link
            href="/"
            className="px-6 py-3 rounded-xl bg-neon-cyan/15 border border-neon-cyan/30 text-neon-cyan font-semibold hover:bg-neon-cyan/25 hover:shadow-neon-cyan transition-all"
          >
            回到首页
          </Link>
          <Link
            href="/experiences"
            className="px-6 py-3 rounded-xl bg-neon-purple/15 border border-neon-purple/30 text-neon-purple font-semibold hover:bg-neon-purple/25 hover:shadow-neon-purple transition-all"
          >
            浏览体验
          </Link>
        </div>
      </div>
    </div>
  );
}
