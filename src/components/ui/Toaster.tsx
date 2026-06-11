"use client";

import { useEffect, useState, useCallback } from "react";
import { cn } from "@/lib/utils";

type ToastType = "success" | "error" | "info";

interface Toast {
  id: string;
  type: ToastType;
  message: string;
  exiting?: boolean;
}

let addToastExternal: ((type: ToastType, message: string) => void) | null = null;

export function toast(type: ToastType, message: string) {
  addToastExternal?.(type, message);
}

export function Toaster() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, exiting: true } : t)));
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 300);
  }, []);

  useEffect(() => {
    addToastExternal = (type: ToastType, message: string) => {
      const id = Math.random().toString(36).slice(2, 9);
      setToasts((prev) => [...prev, { id, type, message }]);
      setTimeout(() => removeToast(id), 4000);
    };
    return () => { addToastExternal = null; };
  }, [removeToast]);

  if (toasts.length === 0) return null;

  const iconMap: Record<ToastType, React.ReactNode> = {
    success: (
      <svg className="w-5 h-5 text-neon-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    ),
    error: (
      <svg className="w-5 h-5 text-neon-pink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    ),
    info: (
      <svg className="w-5 h-5 text-neon-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  };

  return (
    <div className="fixed bottom-4 right-4 z-[200] flex flex-col gap-2 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={cn(
            "pointer-events-auto glass-strong px-4 py-3 rounded-xl flex items-center gap-3 min-w-[280px] max-w-sm shadow-glass transition-all duration-300",
            t.exiting ? "opacity-0 translate-x-4" : "animate-slide-up"
          )}
        >
          {iconMap[t.type]}
          <p className="text-sm text-dark-100">{t.message}</p>
        </div>
      ))}
    </div>
  );
}
