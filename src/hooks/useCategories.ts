"use client";

import { useState, useEffect } from "react";

export interface CategoryData {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  createdAt: string;
  updatedAt: string;
  experienceCount: number;
}

export function useCategories() {
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchCategories() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/categories");
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.error || "加载分类失败");
        }
        const data = await res.json();
        if (!cancelled) setCategories(data);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "加载失败");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchCategories();
    return () => { cancelled = true; };
  }, []);

  return { categories, loading, error };
}
