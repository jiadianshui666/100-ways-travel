"use client";

import { cn } from "@/lib/utils";

interface FilterChipProps {
  label: string;
  active?: boolean;
  onClick?: () => void;
  className?: string;
  count?: number;
}

export function FilterChip({
  label,
  active = false,
  onClick,
  className,
  count,
}: FilterChipProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200",
        active
          ? "bg-neon-cyan/15 text-neon-cyan border-neon-cyan/50 shadow-neon-cyan"
          : "bg-white/5 text-dark-300 border-white/10 hover:bg-white/10 hover:text-dark-100 hover:border-white/20",
        className
      )}
    >
      {label}
      {count !== undefined && (
        <span
          className={cn(
            "inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-[10px] font-bold",
            active ? "bg-neon-cyan/20 text-neon-cyan" : "bg-white/10 text-dark-400"
          )}
        >
          {count}
        </span>
      )}
    </button>
  );
}
