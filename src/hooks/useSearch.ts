"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { type ExperienceData } from "./useExperiences";

interface UseSearchOptions {
  debounceMs?: number;
  limit?: number;
}

interface SearchResults {
  data: ExperienceData[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
  };
}

export function useSearch(options: UseSearchOptions = {}) {
  const { debounceMs = 400, limit = 12 } = options;

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ExperienceData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<SearchResults["pagination"] | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();
  const abortRef = useRef<AbortController>();

  const search = useCallback(
    async (q: string, page = 1) => {
      // Cancel previous request
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      if (!q.trim()) {
        setResults([]);
        setPagination(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams();
        params.set("q", q.trim());
        params.set("page", String(page));
        params.set("limit", String(limit));

        const res = await fetch(`/api/experiences/search?${params.toString()}`, {
          signal: controller.signal,
        });

        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.error || "搜索失败");
        }

        const json: SearchResults = await res.json();
        setResults((prev) => (page === 1 ? json.data : [...prev, ...json.data]));
        setPagination(json.pagination);
      } catch (e) {
        if (e instanceof DOMException && e.name === "AbortError") return;
        setError(e instanceof Error ? e.message : "搜索失败");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    },
    [limit]
  );

  // Debounced search on query change
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!query.trim()) {
      setResults([]);
      setPagination(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    debounceRef.current = setTimeout(() => {
      search(query, 1);
    }, debounceMs);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, debounceMs, search]);

  const loadMore = useCallback(() => {
    if (pagination && pagination.hasMore && query.trim()) {
      search(query, pagination.page + 1);
    }
  }, [pagination, query, search]);

  return {
    query,
    setQuery,
    results,
    loading,
    error,
    pagination,
    loadMore,
  };
}
