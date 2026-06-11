"use client";

import { useSearch } from "@/hooks/useSearch";
import { SearchInput } from "./SearchInput";
import { SearchResults } from "./SearchResults";

export function SearchPage() {
  const {
    query,
    setQuery,
    results,
    loading,
    error,
    pagination,
    loadMore,
  } = useSearch({ debounceMs: 400 });

  return (
    <div className="min-h-screen">
      {/* Hero area */}
      <div className="relative py-16 sm:py-24 px-4">
        {/* Background glow */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-neon-cyan/8 rounded-full blur-[180px]" />
        </div>

        <div className="max-w-2xl mx-auto text-center space-y-4 mb-10">
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-neon-gradient">
            搜索旅行体验
          </h1>
          <p className="text-dark-400">
            按标题、地点或描述搜索你感兴趣的旅行方式
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <SearchInput
            value={query}
            onChange={setQuery}
            loading={loading && results.length === 0}
          />
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-20">
        <SearchResults
          query={query}
          results={results}
          loading={loading}
          error={error}
          hasMore={pagination?.hasMore ?? false}
          total={pagination?.total ?? null}
          onLoadMore={loadMore}
          onClear={() => setQuery("")}
        />
      </div>
    </div>
  );
}
