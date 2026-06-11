"use client";

import { useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";

/* ── Floating orb data ── */
const ORBS = [
  { cx: "15%", cy: "20%", r: 120, color: "rgba(124,58,237,0.25)", speed: 0.3 },
  { cx: "85%", cy: "30%", r: 80, color: "rgba(0,240,255,0.2)", speed: -0.4 },
  { cx: "25%", cy: "70%", r: 100, color: "rgba(255,45,149,0.18)", speed: 0.25 },
  { cx: "70%", cy: "75%", r: 140, color: "rgba(124,58,237,0.15)", speed: -0.35 },
  { cx: "50%", cy: "50%", r: 60, color: "rgba(0,240,255,0.22)", speed: 0.5 },
];

export function HeroSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  /* ── Canvas mesh gradient ── */
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = canvas.offsetWidth * dpr;
    canvas.height = canvas.offsetHeight * dpr;
    ctx.scale(dpr, dpr);

    const w = canvas.offsetWidth;
    const h = canvas.offsetHeight;
    const t = performance.now() / 1000;

    ctx.clearRect(0, 0, w, h);

    // Draw orbs
    for (const orb of ORBS) {
      const x = (parseFloat(orb.cx) / 100) * w + Math.sin(t * orb.speed) * 30;
      const y =
        (parseFloat(orb.cy) / 100) * h + Math.cos(t * orb.speed * 0.7) * 40;
      const r = orb.r;

      const gradient = ctx.createRadialGradient(x, y, 0, x, y, r);
      gradient.addColorStop(0, orb.color);
      gradient.addColorStop(0.5, orb.color.replace(/[\d.]+\)$/, "0.08)"));
      gradient.addColorStop(1, "transparent");

      ctx.beginPath();
      ctx.arc(x, y, r * 2, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();
    }

    rafRef.current = requestAnimationFrame(draw);
  }, []);

  useEffect(() => {
    draw();
    return () => cancelAnimationFrame(rafRef.current);
  }, [draw]);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden">
      {/* Canvas mesh background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 -z-10 w-full h-full"
        aria-hidden="true"
      />

      {/* Additional static gradient overlay */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-dark-900/0 via-dark-900/50 to-dark-900 pointer-events-none" />

      {/* Content */}
      <div
        className="space-y-8 max-w-3xl text-center animate-fade-in"
        style={{ transform: "translateZ(0)" }}
      >
        <Badge variant="purple" size="lg">
          ✈️ 100 种旅行方式
        </Badge>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-display font-bold tracking-tight leading-tight">
          <span className="text-neon-gradient">探索世界</span>
          <br />
          <span className="text-white">的每一种可能</span>
        </h1>

        <p className="text-lg sm:text-xl text-dark-300 max-w-xl mx-auto leading-relaxed">
          从热闹都市到无人荒野，从街头小吃到米其林餐桌
          <br />
          你的下一次冒险，从这里开始
        </p>

        <div className="flex flex-wrap gap-3 justify-center pt-4">
          <Link
            href="#experiences"
            className="px-8 py-3.5 rounded-xl bg-neon-purple/15 border border-neon-purple/40 text-neon-purple font-semibold hover:bg-neon-purple/25 hover:shadow-neon-purple transition-all duration-300"
          >
            开始探索 →
          </Link>
          <Link
            href="#categories"
            className="px-8 py-3.5 rounded-xl bg-white/5 border border-white/10 text-dark-200 font-semibold hover:bg-white/10 hover:border-white/20 transition-all duration-300"
          >
            浏览分类
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-8 sm:gap-16 pt-8">
          {[
            { value: "100+", label: "旅行方式" },
            { value: "50+", label: "目的地" },
            { value: "∞", label: "灵感" },
          ].map((s) => (
            <div key={s.label} className="text-center space-y-1">
              <div className="text-3xl sm:text-4xl font-display font-bold text-neon-green text-glow-cyan">
                {s.value}
              </div>
              <div className="text-xs sm:text-sm text-dark-400 uppercase tracking-widest">
                {s.label}
              </div>
            </div>
          ))}
        </div>
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
  );
}
