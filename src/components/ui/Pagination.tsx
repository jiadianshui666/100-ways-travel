"use client";

import { cn } from "@/lib/utils";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function Pagination({
  page,
  totalPages,
  onPageChange,
  className,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = getPageNumbers(page, totalPages);

  return (
    <nav
      className={cn("flex items-center justify-center gap-1", className)}
      aria-label="分页导航"
    >
      {/* Prev */}
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className={cn(
          "px-3 py-2 rounded-lg text-sm transition-all duration-200",
          page === 1
            ? "text-dark-500 cursor-not-allowed"
            : "text-dark-300 hover:text-white hover:bg-white/5"
        )}
        aria-label="上一页"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Page numbers */}
      {pages.map((p, i) =>
        p === "..." ? (
          <span key={`dots-${i}`} className="px-2 text-dark-500">
            ...
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p as number)}
            className={cn(
              "w-10 h-10 rounded-lg text-sm font-medium transition-all duration-200",
              p === page
                ? "bg-neon-cyan/15 text-neon-cyan border border-neon-cyan/30 shadow-neon-cyan"
                : "text-dark-300 hover:text-white hover:bg-white/5"
            )}
            aria-label={`第 ${p} 页`}
            aria-current={p === page ? "page" : undefined}
          >
            {p}
          </button>
        )
      )}

      {/* Next */}
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        className={cn(
          "px-3 py-2 rounded-lg text-sm transition-all duration-200",
          page === totalPages
            ? "text-dark-500 cursor-not-allowed"
            : "text-dark-300 hover:text-white hover:bg-white/5"
        )}
        aria-label="下一页"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </nav>
  );
}

function getPageNumbers(current: number, total: number): (number | "...")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  if (current <= 3) return [1, 2, 3, 4, "...", total];
  if (current >= total - 2) return [1, "...", total - 3, total - 2, total - 1, total];
  return [1, "...", current - 1, current, current + 1, "...", total];
}
