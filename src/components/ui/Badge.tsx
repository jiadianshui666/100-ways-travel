import { cn } from "@/lib/utils";

const variants = {
  default: "bg-white/10 text-dark-200 border-white/10",
  cyan: "bg-neon-cyan/10 text-neon-cyan border-neon-cyan/30",
  pink: "bg-neon-pink/10 text-neon-pink border-neon-pink/30",
  purple: "bg-neon-purple/10 text-neon-purple border-neon-purple/30",
  green: "bg-neon-green/10 text-neon-green border-neon-green/30",
  yellow: "bg-neon-yellow/10 text-neon-yellow border-neon-yellow/30",
  orange: "bg-neon-orange/10 text-neon-orange border-neon-orange/30",
} as const;

const sizes = {
  sm: "px-2 py-0.5 text-[10px]",
  md: "px-2.5 py-1 text-xs",
  lg: "px-3 py-1.5 text-sm",
} as const;

interface BadgeProps {
  children: React.ReactNode;
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  className?: string;
}

export function Badge({
  children,
  variant = "default",
  size = "md",
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border font-medium transition-colors",
        variants[variant],
        sizes[size],
        className
      )}
    >
      {children}
    </span>
  );
}
