"use client";

import { cn } from "@/lib/utils";
import { FilterChip } from "@/components/ui/FilterChip";
import { type NicheLevel } from "@/components/ui/NicheLevelBadge";

interface FilterBarProps {
  activeStyle: string | null;
  nicheLevel: NicheLevel | null;
  sort: "newest" | "price-asc" | "price-desc";
  onStyleChange: (style: string | null) => void;
  onNicheLevelChange: (level: NicheLevel | null) => void;
  onSortChange: (sort: "newest" | "price-asc" | "price-desc") => void;
  className?: string;
}

const STYLES = [
  { key: "adventure", label: "🧗 极限冒险" },
  { key: "nature", label: "🏔️ 自然风光" },
  { key: "food-tour", label: "🍜 美食之旅" },
  { key: "culture", label: "🎭 文化体验" },
  { key: "city-explore", label: "🏙️ 城市探索" },
];

const NICHE_LEVELS: { key: NicheLevel; label: string }[] = [
  { key: "mainstream", label: "大众" },
  { key: "popular", label: "人气" },
  { key: "rising", label: "新兴" },
  { key: "niche", label: "小众" },
  { key: "hidden-gem", label: "宝藏" },
];

const SORT_OPTIONS = [
  { value: "newest" as const, label: "最新发布" },
  { value: "price-asc" as const, label: "价格 ↑" },
  { value: "price-desc" as const, label: "价格 ↓" },
];

export function FilterBar({
  activeStyle,
  nicheLevel,
  sort,
  onStyleChange,
  onNicheLevelChange,
  onSortChange,
  className,
}: FilterBarProps) {
  return (
    <div className={cn("space-y-4", className)}>
      {/* Visual style chips */}
      <div>
        <p className="text-xs text-dark-400 uppercase tracking-wider mb-2 px-1">
          视觉风格
        </p>
        <div className="flex flex-wrap gap-2">
          {STYLES.map((s) => (
            <FilterChip
              key={s.key}
              label={s.label}
              active={activeStyle === s.key}
              onClick={() =>
                onStyleChange(activeStyle === s.key ? null : s.key)
              }
            />
          ))}
        </div>
      </div>

      {/* Niche level + Sort */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        {/* Niche level */}
        <div className="flex-1">
          <p className="text-xs text-dark-400 uppercase tracking-wider mb-2 px-1">
            小众指数
          </p>
          <div className="flex flex-wrap gap-2">
            {NICHE_LEVELS.map((n) => (
              <FilterChip
                key={n.key}
                label={n.label}
                active={nicheLevel === n.key}
                onClick={() =>
                  onNicheLevelChange(nicheLevel === n.key ? null : n.key)
                }
              />
            ))}
          </div>
        </div>

        {/* Sort */}
        <div className="sm:ml-auto">
          <p className="text-xs text-dark-400 uppercase tracking-wider mb-2 px-1">
            排序
          </p>
          <div className="flex gap-1">
            {SORT_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => onSortChange(opt.value)}
                className={cn(
                  "px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200",
                  sort === opt.value
                    ? "bg-neon-cyan/15 text-neon-cyan border border-neon-cyan/30"
                    : "text-dark-400 hover:text-dark-200 hover:bg-white/5"
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
