"use client";

import { useState } from "react";
import { CategoryTabs } from "@/components/home/CategoryTabs";
import { FilterBar } from "@/components/home/FilterBar";
import { ExperienceGrid } from "@/components/home/ExperienceGrid";
import { useExperiences } from "@/hooks/useExperiences";
import { useCategories } from "@/hooks/useCategories";
import { type NicheLevel } from "@/components/ui/NicheLevelBadge";

export function ExperiencesPage() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [visualStyle, setVisualStyle] = useState<string | null>(null);
  const [nicheLevel, setNicheLevel] = useState<NicheLevel | null>(null);
  const [sort, setSort] = useState<"newest" | "price-asc" | "price-desc">("newest");

  const { categories, loading: catLoading } = useCategories();
  const filterCategory = visualStyle ?? activeCategory;

  const { experiences, pagination, loading, loadingMore, error, loadMore, refresh } =
    useExperiences({ category: filterCategory ?? undefined, sort, limit: 12 });

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative py-16 sm:py-20 px-4 text-center overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-neon-cyan/6 rounded-full blur-[150px]" />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-neon-purple/8 rounded-full blur-[150px]" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-display font-bold text-neon-gradient mb-3">
          探索旅行体验
        </h1>
        <p className="text-dark-400 max-w-lg mx-auto">
          浏览全部 {pagination?.total ?? "—"} 种旅行方式，发现你的下一次冒险
        </p>
      </section>

      {/* Category tabs */}
      <CategoryTabs
        categories={categories}
        active={activeCategory}
        onChange={(slug) => { setActiveCategory(slug); setVisualStyle(null); }}
        loading={catLoading}
      />

      {/* Filters + Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <FilterBar
          activeStyle={visualStyle}
          nicheLevel={nicheLevel}
          sort={sort}
          onStyleChange={(style) => { setVisualStyle(style); if (style) setActiveCategory(null); }}
          onNicheLevelChange={setNicheLevel}
          onSortChange={setSort}
        />
      </div>

      <section className="pb-20" aria-label="体验列表">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <ExperienceGrid
            experiences={experiences}
            loading={loading}
            loadingMore={loadingMore}
            error={error}
            hasMore={pagination?.hasMore ?? false}
            onLoadMore={loadMore}
            onRetry={refresh}
          />
        </div>
      </section>
    </div>
  );
}
