"use client";

import { useState, useMemo } from "react";
import { HeroSection } from "./HeroSection";
import { CategoryTabs } from "./CategoryTabs";
import { FeaturedScroll } from "./FeaturedScroll";
import { FilterBar } from "./FilterBar";
import { ExperienceGrid } from "./ExperienceGrid";
import { ScrollReveal } from "./ScrollReveal";
import { useExperiences } from "@/hooks/useExperiences";
import { useCategories } from "@/hooks/useCategories";
import { type NicheLevel } from "@/components/ui/NicheLevelBadge";

export function HomePage() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [visualStyle, setVisualStyle] = useState<string | null>(null);
  const [nicheLevel, setNicheLevel] = useState<NicheLevel | null>(null);
  const [sort, setSort] = useState<"newest" | "price-asc" | "price-desc">("newest");

  const { categories, loading: catLoading } = useCategories();
  const activeCategoryFilter = visualStyle ?? activeCategory;

  const {
    experiences,
    pagination,
    loading,
    loadingMore,
    error,
    loadMore,
    refresh,
  } = useExperiences({ category: activeCategoryFilter ?? undefined, sort, limit: 9 });

  const { experiences: featuredExperiences, loading: featuredLoading } = useExperiences({
    featured: true,
    sort: "newest",
    limit: 8,
  });

  const featured = useMemo(() => featuredExperiences, [featuredExperiences]);

  return (
    <div className="relative">
      {/* 1. Hero */}
      <HeroSection />

      {/* 2. Category Tabs */}
      <ScrollReveal>
        <section className="py-8" aria-labelledby="categories-heading">
          <div className="max-w-7xl mx-auto">
            <h2 id="categories-heading" className="px-4 sm:px-6 mb-2 text-lg font-display font-semibold text-white">
              探索分类
            </h2>
          </div>
          <CategoryTabs
            categories={categories}
            active={activeCategory}
            onChange={(slug) => { setActiveCategory(slug); setVisualStyle(null); }}
            loading={catLoading}
          />
        </section>
      </ScrollReveal>

      {/* 3. Featured Scroll */}
      <ScrollReveal>
        <section className="py-8" aria-labelledby="featured-heading">
          <div className="max-w-7xl mx-auto mb-6 px-4 sm:px-6 flex items-center justify-between">
            <div>
              <h2 id="featured-heading" className="text-lg font-display font-semibold text-white">
                精选体验
              </h2>
              <p className="text-sm text-dark-400 mt-1">不可错过的旅行灵感</p>
            </div>
            <span className="hidden sm:inline text-xs text-dark-500 px-3 py-1 rounded-full border border-white/5" aria-hidden="true">
              左右滑动
            </span>
          </div>
          <FeaturedScroll experiences={featured} loading={featuredLoading} />
        </section>
      </ScrollReveal>

      {/* Divider */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6" aria-hidden="true">
        <hr className="divider-neon" />
      </div>

      {/* 4. Filter + Grid */}
      <ScrollReveal>
        <section className="py-8" id="experiences" aria-labelledby="experiences-heading">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <h2 id="experiences-heading" className="text-lg font-display font-semibold text-white mb-4">
              {activeCategory
                ? `${categories.find((c) => c.slug === activeCategory)?.name ?? "筛选"} · ${pagination?.total ?? 0} 个体验`
                : `全部体验 · ${pagination?.total ?? 0} 个`}
            </h2>
            <FilterBar
              activeStyle={visualStyle}
              nicheLevel={nicheLevel}
              sort={sort}
              onStyleChange={(style) => { setVisualStyle(style); if (style) setActiveCategory(null); }}
              onNicheLevelChange={setNicheLevel}
              onSortChange={setSort}
            />
          </div>
        </section>
      </ScrollReveal>

      {/* 5. Experience Grid */}
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
