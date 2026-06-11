"use client";

import { useRef, useState, useEffect } from "react";
import { ExperienceCard, ExperienceCardSkeleton } from "./ExperienceCard";
import { type ExperienceData } from "@/hooks/useExperiences";

interface FeaturedScrollProps {
  experiences: ExperienceData[];
  loading?: boolean;
}

export function FeaturedScroll({ experiences, loading = false }: FeaturedScrollProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 8);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 8);
  };

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (el) {
      el.addEventListener("scroll", checkScroll, { passive: true });
      return () => el.removeEventListener("scroll", checkScroll);
    }
  }, [experiences]);

  const scroll = (direction: -1 | 1) => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = 340;
    el.scrollBy({ left: direction * (cardWidth + 16), behavior: "smooth" });
  };

  if (loading) {
    return (
      <div className="flex gap-4 px-4 sm:px-6 overflow-hidden">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="w-[320px] flex-shrink-0">
            <ExperienceCardSkeleton />
          </div>
        ))}
      </div>
    );
  }

  if (experiences.length === 0) return null;

  return (
    <div className="relative">
      {/* Left arrow */}
      {canScrollLeft && (
        <button
          onClick={() => scroll(-1)}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full glass-strong flex items-center justify-center text-dark-200 hover:text-white hover:shadow-neon-purple transition-all"
          aria-label="向左滚动"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}

      {/* Cards */}
      <div
        ref={scrollRef}
        className="flex gap-4 px-4 sm:px-6 pb-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory"
      >
        {experiences.map((exp, i) => (
          <div key={exp.id} className="w-[300px] sm:w-[340px] flex-shrink-0 snap-start">
            <ExperienceCard experience={exp} priority={i < 2} />
          </div>
        ))}
      </div>

      {/* Right arrow */}
      {canScrollRight && (
        <button
          onClick={() => scroll(1)}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full glass-strong flex items-center justify-center text-dark-200 hover:text-white hover:shadow-neon-purple transition-all"
          aria-label="向右滚动"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}

      {/* Gradient fades on edges */}
      <div className="absolute left-0 top-0 bottom-4 w-12 bg-gradient-to-r from-dark-900 to-transparent pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-4 w-12 bg-gradient-to-l from-dark-900 to-transparent pointer-events-none" />
    </div>
  );
}
