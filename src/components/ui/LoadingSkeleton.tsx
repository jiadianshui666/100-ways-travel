import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
}

function Skeleton({ className }: SkeletonProps) {
  return <div className={cn("skeleton", className)} />;
}

// ── Pre-built skeletons ──

export function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <ExperienceCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function ExperienceCardSkeleton() {
  return (
    <div className="glass p-0 overflow-hidden animate-fade-in">
      {/* Image */}
      <Skeleton className="h-48 w-full rounded-none" />
      <div className="p-5 space-y-3">
        {/* Category badge */}
        <Skeleton className="h-5 w-16 rounded-full" />
        {/* Title */}
        <Skeleton className="h-6 w-3/4" />
        {/* Description */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
        {/* Price row */}
        <div className="flex justify-between items-center pt-2">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-4 w-16" />
        </div>
      </div>
    </div>
  );
}

export function ExperienceDetailSkeleton() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6 animate-fade-in">
      <Skeleton className="h-[400px] w-full rounded-2xl" />
      <Skeleton className="h-5 w-24 rounded-full" />
      <Skeleton className="h-10 w-3/4" />
      <Skeleton className="h-5 w-1/3" />
      <div className="space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-4/6" />
      </div>
    </div>
  );
}

export function CategoryListSkeleton() {
  return (
    <div className="flex flex-wrap gap-2 p-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton key={i} className="h-10 w-24 rounded-full" />
      ))}
    </div>
  );
}

export { Skeleton };
