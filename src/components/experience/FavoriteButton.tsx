"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface FavoriteButtonProps {
  slug: string;
  className?: string;
}

export function FavoriteButton({ slug, className }: FavoriteButtonProps) {
  const [favorited, setFavorited] = useState(false);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`/api/experiences/${slug}/favorite`)
      .then((r) => r.json())
      .then((d) => {
        setFavorited(d.favorited);
        setCount(d.count);
      })
      .catch(() => {});
  }, [slug]);

  const toggle = async () => {
    setLoading(true);
    try {
      const auth = localStorage.getItem("auth") || localStorage.getItem("admin-auth");
      const res = await fetch(`/api/experiences/${slug}/favorite`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(auth ? { Authorization: `Bearer ${JSON.parse(auth).token}` } : {}),
        },
      });
      if (res.status === 401) {
        alert("请先登录后再收藏");
        return;
      }
      const data = await res.json();
      setFavorited(data.favorited);
      setCount((c) => (data.favorited ? c + 1 : Math.max(0, c - 1)));
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={cn(
        "flex items-center gap-2 px-4 py-2 rounded-xl border transition-all duration-300",
        favorited
          ? "bg-neon-pink/15 border-neon-pink/40 text-neon-pink shadow-neon-pink"
          : "bg-white/5 border-white/10 text-dark-400 hover:border-neon-pink/30 hover:text-neon-pink",
        className
      )}
      aria-label={favorited ? "取消收藏" : "收藏"}
    >
      <svg
        className="w-5 h-5"
        fill={favorited ? "currentColor" : "none"}
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
      <span className="text-sm font-medium">{count > 0 ? count : "收藏"}</span>
    </button>
  );
}
