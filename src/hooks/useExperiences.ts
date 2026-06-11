"use client";

import { useState, useEffect, useCallback } from "react";

export interface ExperienceData {
  id: string;
  title: string;
  slug: string;
  description: string;
  location: string;
  price: number;
  duration: string;
  images: string;
  featured: boolean;
  published: boolean;
  authorId: string;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
  category: {
    id: string;
    name: string;
    slug: string;
    icon?: string | null;
  };
  author: {
    id: string;
    name: string;
    avatar?: string | null;
  };
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasMore: boolean;
}

interface UseExperiencesOptions {
  category?: string;
  featured?: boolean;
  sort?: "newest" | "price-asc" | "price-desc";
  limit?: number;
}

export function useExperiences(options: UseExperiencesOptions = {}) {
  const { category, featured, sort = "newest", limit = 9 } = options;

  const [experiences, setExperiences] = useState<ExperienceData[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchExperiences = useCallback(
    async (page = 1, append = false) => {
      if (append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }
      setError(null);

      try {
        const params = new URLSearchParams();
        params.set("page", String(page));
        params.set("limit", String(limit));
        if (category) params.set("category", category);
        if (featured !== undefined) params.set("featured", String(featured));
        if (sort && sort !== "newest") params.set("sort", sort);

        const res = await fetch(`/api/experiences?${params.toString()}`);
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.error || "加载失败");
        }

        const json = await res.json();
        const rawData = json.data as ExperienceData[];

        // Sort client-side if API doesn't support it
        let sorted = rawData;
        if (sort === "price-asc") {
          sorted = [...rawData].sort((a, b) => a.price - b.price);
        } else if (sort === "price-desc") {
          sorted = [...rawData].sort((a, b) => b.price - a.price);
        }

        setExperiences((prev) => (append ? [...prev, ...sorted] : sorted));
        setPagination(json.pagination);
      } catch (e) {
        setError(e instanceof Error ? e.message : "加载失败");
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [category, featured, sort, limit]
  );

  useEffect(() => {
    fetchExperiences(1, false);
  }, [fetchExperiences]);

  const loadMore = useCallback(() => {
    if (pagination && pagination.hasMore) {
      fetchExperiences(pagination.page + 1, true);
    }
  }, [pagination, fetchExperiences]);

  const refresh = useCallback(() => {
    fetchExperiences(1, false);
  }, [fetchExperiences]);

  return {
    experiences,
    pagination,
    loading,
    loadingMore,
    error,
    loadMore,
    refresh,
  };
}
