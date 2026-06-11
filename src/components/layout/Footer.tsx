import Link from "next/link";

const FOOTER_LINKS = {
  探索: [
    { href: "/experiences", label: "旅行体验" },
    { href: "/search", label: "搜索体验" },
    { href: "/about", label: "关于我们" },
  ],
  管理: [
    { href: "/admin", label: "后台仪表盘" },
    { href: "/admin/experiences/new", label: "创建体验" },
    { href: "/admin/categories", label: "管理分类" },
  ],
  法律: [
    { href: "/privacy", label: "隐私政策" },
    { href: "/terms", label: "服务条款" },
  ],
};

export function Footer() {
  return (
    <footer role="contentinfo" className="relative mt-auto border-t border-white/5 bg-dark-900">
      <div className="absolute top-0 inset-x-0 divider-neon" aria-hidden="true" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 lg:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1 space-y-4">
            <Link href="/" className="flex items-center gap-2" aria-label="100 Ways Travel 首页">
              <span className="text-2xl" aria-hidden="true">✈️</span>
              <span className="font-display text-lg font-bold text-neon-gradient">
                100 Ways Travel
              </span>
            </Link>
            <p className="text-sm text-dark-400 leading-relaxed">
              探索 100 种旅行方式，
              <br />
              发现世界之美。
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <div key={title} className="space-y-3">
              <h3 className="font-display text-xs font-semibold uppercase tracking-widest text-dark-300">
                {title}
              </h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-dark-400 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-dark-500">
            &copy; {new Date().getFullYear()} 100 Ways Travel. Built with ❤️ and Next.js.
          </p>
          <div className="flex items-center gap-4" aria-hidden="true">
            <span className="w-2 h-2 rounded-full bg-neon-cyan animate-glow-pulse" />
            <span className="w-2 h-2 rounded-full bg-neon-pink animate-glow-pulse" style={{ animationDelay: "0.5s" }} />
            <span className="w-2 h-2 rounded-full bg-neon-purple animate-glow-pulse" style={{ animationDelay: "1s" }} />
          </div>
        </div>
      </div>
    </footer>
  );
}
