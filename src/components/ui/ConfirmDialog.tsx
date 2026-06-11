"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "default";
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "确认",
  cancelLabel = "取消",
  variant = "default",
  onConfirm,
  onCancel,
  loading = false,
}: ConfirmDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open && !loading) onCancel();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [open, onCancel, loading]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      dialogRef.current?.focus();
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;

  const confirmColors =
    variant === "danger"
      ? "bg-neon-pink/15 border-neon-pink/30 text-neon-pink hover:bg-neon-pink/25 hover:shadow-neon-pink"
      : "bg-neon-purple/15 border-neon-purple/30 text-neon-purple hover:bg-neon-purple/25 hover:shadow-neon-purple";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={loading ? undefined : onCancel}
        aria-hidden="true"
      />

      {/* Dialog */}
      <div
        ref={dialogRef}
        role="alertdialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        className={cn(
          "relative glass-strong p-6 sm:p-8 max-w-md w-full animate-scale-in shadow-glass",
          "border-white/10"
        )}
      >
        {/* Icon */}
        <div
          className={cn(
            "w-12 h-12 rounded-full flex items-center justify-center mb-4",
            variant === "danger" ? "bg-neon-pink/10" : "bg-neon-purple/10"
          )}
        >
          <svg
            className={cn(
              "w-6 h-6",
              variant === "danger" ? "text-neon-pink" : "text-neon-purple"
            )}
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

        <h3 className="text-lg font-display font-semibold text-white mb-2">
          {title}
        </h3>
        <p className="text-sm text-dark-300 mb-6">{message}</p>

        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            disabled={loading}
            className="px-5 py-2.5 rounded-lg text-sm font-medium text-dark-300 hover:text-white hover:bg-white/5 transition-all disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={cn(
              "px-5 py-2.5 rounded-lg text-sm font-medium border transition-all duration-200 disabled:opacity-50",
              confirmColors
            )}
          >
            {loading ? "处理中..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
