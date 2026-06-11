"use client";

import { cn } from "@/lib/utils";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  title = "加载失败",
  message = "抱歉，数据加载出现了问题。请检查网络后重试。",
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-16 px-4 text-center animate-fade-in",
        className
      )}
      role="alert"
    >
      {/* Error icon */}
      <div className="mb-6 w-20 h-20 rounded-full bg-neon-pink/10 border border-neon-pink/20 flex items-center justify-center">
        <svg
          className="w-10 h-10 text-neon-pink"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </div>

      <h3 className="text-lg font-display font-semibold text-dark-200 mb-2">
        {title}
      </h3>
      <p className="text-sm text-dark-400 max-w-sm mb-6">{message}</p>

      {onRetry && (
        <button
          onClick={onRetry}
          className="px-6 py-2.5 rounded-lg bg-neon-pink/10 border border-neon-pink/30 text-neon-pink font-medium hover:bg-neon-pink/20 hover:shadow-neon-pink transition-all duration-300"
        >
          重新加载
        </button>
      )}
    </div>
  );
}
