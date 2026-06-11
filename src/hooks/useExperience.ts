"use client";

import { useState, useEffect } from "react";
import { type ExperienceData } from "./useExperiences";

interface ExperienceDetail extends ExperienceData {
  author: ExperienceData["author"] & { bio?: string | null };
}

export function useExperience(slug: string) {
  const [experience, setExperience] = useState<ExperienceDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetch(`/api/experiences/${slug}`)
      .then((res) => {
        if (!res.ok) throw new Error("体验不存在");
        return res.json();
      })
      .then((data) => {
        if (!cancelled) setExperience(data);
      })
      .catch((e) => {
        if (!cancelled) setError(e.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [slug]);

  return { experience, loading, error };
}
