"use client";

import { useEffect } from "react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[app-error]", error);
  }, [error]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="text-center space-y-6 animate-fade-in">
        <span className="text-6xl block">⚠️</span>
        <h1 className="text-2xl font-display font-bold text-white">页面出错了</h1>
        <p className="text-sm text-dark-400 max-w-md">
          {error.message || "发生了一个意外错误，请稍后再试。"}
        </p>
        <button
          onClick={reset}
          className="px-6 py-3 rounded-xl bg-neon-purple/15 border border-neon-purple/30 text-neon-purple font-semibold hover:bg-neon-purple/25 hover:shadow-neon-purple transition-all"
        >
          重试
        </button>
      </div>
    </div>
  );
}
