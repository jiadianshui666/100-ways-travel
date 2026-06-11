import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-16 px-4 text-center animate-fade-in",
        className
      )}
    >
      {icon ? (
        <div className="mb-6 text-dark-500">{icon}</div>
      ) : (
        <div className="mb-6 w-20 h-20 rounded-full bg-white/5 flex items-center justify-center">
          <svg
            className="w-10 h-10 text-dark-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
        </div>
      )}
      <h3 className="text-lg font-display font-semibold text-dark-200 mb-2">
        {title}
      </h3>
      {description && (
        <p className="text-sm text-dark-400 max-w-sm">{description}</p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
