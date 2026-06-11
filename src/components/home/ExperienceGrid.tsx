"use client";

import { ExperienceCard, ExperienceCardSkeleton } from "./ExperienceCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { type ExperienceData } from "@/hooks/useExperiences";

interface ExperienceGridProps {
  experiences: ExperienceData[];
  loading: boolean;
  loadingMore: boolean;
  error: string | null;
  hasMore: boolean;
  onLoadMore: () => void;
  onRetry: () => void;
}

export function ExperienceGrid({
  experiences,
  loading,
  loadingMore,
  error,
  hasMore,
  onLoadMore,
  onRetry,
}: ExperienceGridProps) {
  // Loading state
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <ExperienceCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  // Error state
  if (error) {
    return <ErrorState message={error} onRetry={onRetry} />;
  }

  // Empty state
  if (experiences.length === 0) {
    return (
      <EmptyState
        title="暂无体验"
        description="当前筛选条件下没有找到旅行体验，试试调整筛选条件"
        action={
          <button
            onClick={onRetry}
            className="px-5 py-2.5 rounded-lg bg-neon-cyan/10 border border-neon-cyan/30 text-neon-cyan text-sm font-medium hover:bg-neon-cyan/20 transition-all"
          >
            清除筛选
          </button>
        }
      />
    );
  }

  return (
    <div className="space-y-10">
      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {experiences.map((exp, i) => (
          <div key={exp.id} className="animate-fade-in" style={{ animationDelay: `${(i % 9) * 60}ms` }}>
            <ExperienceCard experience={exp} priority={i < 6} />
          </div>
        ))}

        {/* Loading more skeletons */}
        {loadingMore &&
          Array.from({ length: 3 }).map((_, i) => (
            <ExperienceCardSkeleton key={`more-skel-${i}`} />
          ))}
      </div>

      {/* Load more button */}
      {hasMore && !loadingMore && (
        <div className="flex justify-center">
          <button
            onClick={onLoadMore}
            className="px-8 py-3.5 rounded-xl glass border border-white/10 text-dark-200 font-medium hover:bg-white/8 hover:border-neon-cyan/30 hover:text-neon-cyan hover:shadow-neon-cyan transition-all duration-300"
          >
            加载更多体验
            <span className="ml-2">↓</span>
          </button>
        </div>
      )}

      {/* Loading more indicator */}
      {loadingMore && (
        <div className="flex justify-center">
          <div className="flex items-center gap-3 text-dark-400">
            <div className="w-5 h-5 border-2 border-neon-cyan/30 border-t-neon-cyan rounded-full animate-spin" />
            加载中...
          </div>
        </div>
      )}

      {/* End of list */}
      {!hasMore && experiences.length > 0 && (
        <div className="flex justify-center">
          <p className="text-sm text-dark-500">
            — 已展示全部 {experiences.length} 个体验 —
          </p>
        </div>
      )}
    </div>
  );
}
