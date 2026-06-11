import { cn } from "@/lib/utils";

type NicheLevel = "mainstream" | "popular" | "rising" | "niche" | "hidden-gem";

const config: Record<
  NicheLevel,
  { label: string; variant: "cyan" | "green" | "yellow" | "purple" | "pink" }
> = {
  mainstream: { label: "大众热门", variant: "cyan" },
  popular: { label: "人气推荐", variant: "green" },
  rising: { label: "新兴玩法", variant: "yellow" },
  niche: { label: "小众精选", variant: "purple" },
  "hidden-gem": { label: "隐藏宝藏", variant: "pink" },
};

const variantClasses = {
  cyan: "bg-neon-cyan/10 text-neon-cyan border-neon-cyan/30",
  green: "bg-neon-green/10 text-neon-green border-neon-green/30",
  yellow: "bg-neon-yellow/10 text-neon-yellow border-neon-yellow/30",
  purple: "bg-neon-purple/10 text-neon-purple border-neon-purple/30",
  pink: "bg-neon-pink/10 text-neon-pink border-neon-pink/30",
};

interface NicheLevelBadgeProps {
  level: NicheLevel;
  className?: string;
}

export function NicheLevelBadge({ level, className }: NicheLevelBadgeProps) {
  const { label, variant } = config[level];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium",
        variantClasses[variant],
        className
      )}
    >
      <span
        className={cn(
          "w-1.5 h-1.5 rounded-full",
          variant === "cyan" && "bg-neon-cyan",
          variant === "green" && "bg-neon-green",
          variant === "yellow" && "bg-neon-yellow",
          variant === "purple" && "bg-neon-purple",
          variant === "pink" && "bg-neon-pink"
        )}
      />
      {label}
    </span>
  );
}

export type { NicheLevel };
