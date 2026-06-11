"use client";

import { ExperienceCard, ExperienceCardSkeleton } from "@/components/home/ExperienceCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { type ExperienceData } from "@/hooks/useExperiences";

interface SearchResultsProps {
  query: string;
  results: ExperienceData[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  total: number | null;
  onLoadMore: () => void;
  onClear: () => void;
}

export function SearchResults({
  query,
  results,
  loading,
  error,
  hasMore,
  total,
  onLoadMore,
  onClear,
}: SearchResultsProps) {
  // Initial state — no query entered
  if (!query.trim()) {
    return (
      <EmptyState
        icon={
          <svg className="w-12 h-12 text-dark-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        }
        title="搜索旅行体验"
        description="输入关键词，发现你感兴趣的旅行方式"
      />
    );
  }

  // Error state
  if (error) {
    return <ErrorState message={error} onRetry={onClear} />;
  }

  // Loading (first search)
  if (loading && results.length === 0) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <ExperienceCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  // Empty results
  if (!loading && results.length === 0) {
    return (
      <EmptyState
        title="未找到相关体验"
        description={`没有找到与「${query}」相关的旅行体验，试试其他关键词`}
        action={
          <button
            onClick={onClear}
            className="px-5 py-2.5 rounded-lg bg-neon-cyan/10 border border-neon-cyan/30 text-neon-cyan text-sm font-medium hover:bg-neon-cyan/20 transition-all"
          >
            清除搜索
          </button>
        }
      />
    );
  }

  return (
    <div className="space-y-10">
      {/* Results count */}
      {total !== null && (
        <p className="text-sm text-dark-400">
          找到 <span className="text-neon-cyan font-semibold">{total}</span> 个相关体验
        </p>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {results.map((exp, i) => (
          <div key={exp.id} className="animate-fade-in" style={{ animationDelay: `${(i % 9) * 60}ms` }}>
            <ExperienceCard experience={exp} priority={i < 6} />
          </div>
        ))}

        {/* Loading more skeletons */}
        {loading && results.length > 0 &&
          Array.from({ length: 3 }).map((_, i) => (
            <ExperienceCardSkeleton key={`skel-${i}`} />
          ))}
      </div>

      {/* Load more */}
      {hasMore && !loading && (
        <div className="flex justify-center">
          <button
            onClick={onLoadMore}
            className="px-8 py-3.5 rounded-xl glass border border-white/10 text-dark-200 font-medium hover:bg-white/8 hover:border-neon-cyan/30 hover:text-neon-cyan hover:shadow-neon-cyan transition-all duration-300"
          >
            加载更多结果 ↓
          </button>
        </div>
      )}

      {/* Loading spinner */}
      {loading && results.length > 0 && (
        <div className="flex justify-center">
          <div className="flex items-center gap-3 text-dark-400">
            <div className="w-5 h-5 border-2 border-neon-cyan/30 border-t-neon-cyan rounded-full animate-spin" />
            搜索中...
          </div>
        </div>
      )}
    </div>
  );
}
