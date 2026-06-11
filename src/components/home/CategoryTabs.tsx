"use client";

import { useRef, useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { type CategoryData } from "@/hooks/useCategories";

interface CategoryTabsProps {
  categories: CategoryData[];
  active: string | null;
  onChange: (slug: string | null) => void;
  loading?: boolean;
}

export function CategoryTabs({
  categories,
  active,
  onChange,
  loading = false,
}: CategoryTabsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  };

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (el) {
      el.addEventListener("scroll", checkScroll, { passive: true });
      window.addEventListener("resize", checkScroll);
      return () => {
        el.removeEventListener("scroll", checkScroll);
        window.removeEventListener("resize", checkScroll);
      };
    }
  }, [categories]);

  const scroll = (direction: -1 | 1) => {
    scrollRef.current?.scrollBy({ left: direction * 280, behavior: "smooth" });
  };

  if (loading) {
    return (
      <div className="flex gap-2 px-4 overflow-hidden" id="categories">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="skeleton h-12 w-28 rounded-full flex-shrink-0" />
        ))}
      </div>
    );
  }

  return (
    <div className="relative max-w-7xl mx-auto" id="categories">
      {/* Left arrow */}
      {canScrollLeft && (
        <button
          onClick={() => scroll(-1)}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full glass-strong flex items-center justify-center text-dark-300 hover:text-white transition-colors"
          aria-label="向左滚动"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}

      {/* Scrollable tabs */}
      <div
        ref={scrollRef}
        className="flex gap-2 overflow-x-auto scrollbar-hide px-4 sm:px-6 py-4 snap-x"
      >
        {/* All tab */}
        <button
          onClick={() => onChange(null)}
          className={cn(
            "flex-shrink-0 px-5 py-2.5 rounded-full text-sm font-medium border transition-all duration-200 snap-start",
            active === null
              ? "bg-neon-cyan/15 text-neon-cyan border-neon-cyan/40 shadow-neon-cyan"
              : "bg-white/5 text-dark-300 border-white/10 hover:bg-white/10 hover:text-dark-100"
          )}
        >
          全部
          <span className="ml-1.5 text-xs opacity-60">
            {categories.reduce((sum, c) => sum + c.experienceCount, 0)}
          </span>
        </button>

        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onChange(cat.slug)}
            className={cn(
              "flex-shrink-0 inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full text-sm font-medium border transition-all duration-200 snap-start",
              active === cat.slug
                ? "bg-neon-purple/15 text-neon-purple border-neon-purple/40 shadow-neon-purple"
                : "bg-white/5 text-dark-300 border-white/10 hover:bg-white/10 hover:text-dark-100"
            )}
          >
            <span>{cat.icon}</span>
            {cat.name}
            <span className="ml-1 text-xs opacity-60">{cat.experienceCount}</span>
          </button>
        ))}
      </div>

      {/* Right arrow */}
      {canScrollRight && (
        <button
          onClick={() => scroll(1)}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full glass-strong flex items-center justify-center text-dark-300 hover:text-white transition-colors"
          aria-label="向右滚动"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}
    </div>
  );
}
