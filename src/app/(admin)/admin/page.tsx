"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";

interface Stats {
  total: number;
  published: number;
  featured: number;
  categories: number;
  favorites: number;
}

export default function AdminDashboardPage() {
  const { token } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    async function load() {
      try {
        const [expRes, catRes] = await Promise.all([
          fetch("/api/admin/experiences?limit=100", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("/api/admin/categories", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const expData = expRes.ok ? await expRes.json() : null;
        const catData = catRes.ok ? await catRes.json() : null;

        if (expData) {
          const experiences = expData.data || [];
          // Count total favorites across all experiences from the admin list
          const favoritesCount = experiences.reduce(
            (sum: number, e: { _count?: { favorites?: number } }) =>
              sum + (e._count?.favorites ?? 0),
            0
          );
          setStats({
            total: expData.pagination?.total ?? experiences.length,
            published: experiences.filter((e: { published: boolean }) => e.published).length,
            featured: experiences.filter((e: { featured: boolean }) => e.featured).length,
            categories: catData?.length ?? 0,
            favorites: favoritesCount,
          });
        }
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [token]);

  const cards = [
    { label: "总体验数", value: stats?.total ?? "-", icon: "✈️", color: "cyan" as const },
    { label: "已发布", value: stats?.published ?? "-", icon: "📝", color: "green" as const },
    { label: "精选体验", value: stats?.featured ?? "-", icon: "⭐", color: "yellow" as const },
    { label: "收藏总数", value: stats?.favorites?.toLocaleString() ?? "-", icon: "❤️", color: "purple" as const },
    { label: "分类数", value: stats?.categories ?? "-", icon: "📂", color: "pink" as const },
  ];

  const colorClasses = {
    cyan: "border-neon-cyan/20 bg-neon-cyan/5",
    green: "border-neon-green/20 bg-neon-green/5",
    yellow: "border-neon-yellow/20 bg-neon-yellow/5",
    purple: "border-neon-purple/20 bg-neon-purple/5",
    pink: "border-neon-pink/20 bg-neon-pink/5",
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-display font-bold text-white">仪表盘</h1>
        <p className="text-sm text-dark-400 mt-1">欢迎回来，管理员 👋</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="glass p-5 rounded-2xl">
              <div className="skeleton h-4 w-12 mb-3" />
              <div className="skeleton h-8 w-16" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {cards.map((card) => (
            <div
              key={card.label}
              className={`glass p-5 rounded-2xl border ${colorClasses[card.color]} transition-all duration-300 hover:-translate-y-1`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-dark-400 uppercase tracking-wider">{card.label}</span>
                <span className="text-xl">{card.icon}</span>
              </div>
              <p className="text-3xl font-display font-bold text-white">{card.value}</p>
            </div>
          ))}
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-4">
        <a
          href="/admin/experiences/new"
          className="glass p-6 rounded-2xl border border-neon-cyan/10 hover:border-neon-cyan/30 hover:shadow-neon-cyan transition-all duration-300 group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-neon-cyan/10 flex items-center justify-center text-2xl">➕</div>
            <div>
              <h3 className="font-display font-semibold text-white group-hover:text-neon-cyan transition-colors">创建新体验</h3>
              <p className="text-sm text-dark-400 mt-0.5">添加新的旅行体验</p>
            </div>
          </div>
        </a>
        <a
          href="/admin/categories"
          className="glass p-6 rounded-2xl border border-neon-purple/10 hover:border-neon-purple/30 hover:shadow-neon-purple transition-all duration-300 group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-neon-purple/10 flex items-center justify-center text-2xl">📂</div>
            <div>
              <h3 className="font-display font-semibold text-white group-hover:text-neon-purple transition-colors">管理分类</h3>
              <p className="text-sm text-dark-400 mt-0.5">编辑旅行分类</p>
            </div>
          </div>
        </a>
      </div>
    </div>
  );
}
