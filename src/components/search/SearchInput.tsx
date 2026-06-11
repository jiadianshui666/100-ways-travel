"use client";

import { useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  loading?: boolean;
  className?: string;
  autoFocus?: boolean;
}

export function SearchInput({
  value,
  onChange,
  loading = false,
  className,
  autoFocus = true,
}: SearchInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocus) {
      // Small delay to allow page transition
      const timer = setTimeout(() => inputRef.current?.focus(), 100);
      return () => clearTimeout(timer);
    }
  }, [autoFocus]);

  return (
    <div className={cn("relative", className)}>
      {/* Search icon */}
      <div className="absolute left-5 top-1/2 -translate-y-1/2 pointer-events-none">
        {loading ? (
          <div className="w-6 h-6 border-2 border-neon-cyan/30 border-t-neon-cyan rounded-full animate-spin" />
        ) : (
          <svg
            className="w-6 h-6 text-dark-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        )}
      </div>

      {/* Input */}
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="搜索旅行体验... 试试「冰岛」「美食」「京都」"
        className={cn(
          "w-full pl-14 pr-6 py-5 rounded-2xl glass-strong text-lg text-white placeholder:text-dark-500",
          "border border-white/10 focus:border-neon-cyan/50 focus:shadow-neon-cyan focus:outline-none",
          "transition-all duration-300"
        )}
      />

      {/* Clear button */}
      {value && (
        <button
          onClick={() => onChange("")}
          className="absolute right-5 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-dark-400 hover:text-white hover:bg-white/5 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}
