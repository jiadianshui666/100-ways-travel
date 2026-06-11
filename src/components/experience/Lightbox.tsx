"use client";

import { useEffect, useCallback } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface LightboxProps {
  images: string[];
  currentIndex: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

export function Lightbox({
  images,
  currentIndex,
  onClose,
  onPrev,
  onNext,
}: LightboxProps) {
  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    },
    [onClose, onPrev, onNext]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [handleKey]);

  const current = images[currentIndex];

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-md animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="图片灯箱"
    >
      {/* Close button */}
      <button
        className="absolute top-4 right-4 z-10 p-3 rounded-full glass-strong text-white hover:text-neon-pink transition-colors"
        onClick={onClose}
        aria-label="关闭灯箱"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Counter */}
      <div className="absolute top-4 left-4 px-3 py-1.5 rounded-lg glass-strong text-sm text-dark-200">
        {currentIndex + 1} / {images.length}
      </div>

      {/* Prev */}
      {images.length > 1 && (
        <button
          className="absolute left-4 z-10 p-3 rounded-full glass-strong text-white hover:text-neon-cyan transition-colors"
          onClick={(e) => { e.stopPropagation(); onPrev(); }}
          aria-label="上一张"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}

      {/* Image */}
      <div
        className="relative w-full h-full max-w-5xl max-h-[85vh] m-8"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={current}
          alt={`图片 ${currentIndex + 1}`}
          fill
          sizes="90vw"
          className={cn("object-contain animate-scale-in")}
          key={currentIndex}
          priority
        />
      </div>

      {/* Next */}
      {images.length > 1 && (
        <button
          className="absolute right-4 z-10 p-3 rounded-full glass-strong text-white hover:text-neon-cyan transition-colors"
          onClick={(e) => { e.stopPropagation(); onNext(); }}
          aria-label="下一张"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {images.map((img, i) => (
            <button
              key={i}
              className={cn(
                "w-2 h-2 rounded-full transition-all duration-300",
                i === currentIndex
                  ? "bg-neon-cyan w-6 shadow-neon-cyan"
                  : "bg-white/30 hover:bg-white/60"
              )}
              onClick={(e) => {
                e.stopPropagation();
                const diff = i - currentIndex;
                if (diff > 0) for (let j = 0; j < diff; j++) onNext();
                else for (let j = 0; j < -diff; j++) onPrev();
              }}
              aria-label={`查看第 ${i + 1} 张图片`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
