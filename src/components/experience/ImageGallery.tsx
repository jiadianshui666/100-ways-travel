"use client";

import { useState } from "react";
import Image from "next/image";
import { parseImages } from "@/lib/utils";
import { Lightbox } from "./Lightbox";

interface ImageGalleryProps {
  images: string;
  title: string;
}

export function ImageGallery({ images, title }: ImageGalleryProps) {
  const parsed = parseImages(images);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  if (parsed.length === 0) return null;

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
  };

  return (
    <>
      <section>
        <h2 className="text-2xl font-display font-bold text-white mb-8 flex items-center gap-3">
          <span className="w-1 h-8 rounded-full bg-neon-gradient" />
          图片画廊
          <span className="text-sm font-normal text-dark-500 ml-2">
            {parsed.length} 张
          </span>
        </h2>

        <div
          className={`grid gap-3 ${
            parsed.length === 1
              ? "grid-cols-1"
              : parsed.length === 2
                ? "grid-cols-2"
                : parsed.length === 3
                  ? "grid-cols-2 [&>*:first-child]:col-span-2"
                  : "grid-cols-2 lg:grid-cols-4"
          }`}
        >
          {parsed.map((src, i) => (
            <button
              key={i}
              onClick={() => openLightbox(i)}
              className={`relative overflow-hidden rounded-2xl glass group ${
                parsed.length === 3 && i === 0 ? "h-80" : "h-56 sm:h-64"
              }`}
            >
              <Image
                src={src}
                alt={`${title} - 图片 ${i + 1}`}
                fill
                sizes={
                  parsed.length <= 2
                    ? "80vw"
                    : parsed.length === 3 && i === 0
                      ? "80vw"
                      : "(max-width: 1024px) 50vw, 25vw"
                }
                className="object-cover transition-all duration-500 group-hover:scale-105"
              />
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-3 rounded-full glass-strong">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                  </svg>
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Lightbox */}
      {lightboxOpen && (
        <Lightbox
          images={parsed}
          currentIndex={currentIndex}
          onClose={() => setLightboxOpen(false)}
          onPrev={() => setCurrentIndex((prev) => (prev === 0 ? parsed.length - 1 : prev - 1))}
          onNext={() => setCurrentIndex((prev) => (prev === parsed.length - 1 ? 0 : prev + 1))}
        />
      )}
    </>
  );
}
