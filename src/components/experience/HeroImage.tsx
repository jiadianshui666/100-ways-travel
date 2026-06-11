"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { parseImages } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";

interface HeroImageProps {
  title: string;
  images: string;
  category: { name: string; icon?: string | null };
  featured: boolean;
}

export function HeroImage({ title, images, category, featured }: HeroImageProps) {
  const [offset, setOffset] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  const parsed = parseImages(images);
  const heroUrl = parsed[0] ?? "/placeholder.svg";

  useEffect(() => {
    const handleScroll = () => {
      if (!heroRef.current) return;
      const rect = heroRef.current.getBoundingClientRect();
      // Parallax: shift bg by scroll position relative to viewport
      if (rect.bottom > 0 && rect.top < window.innerHeight) {
        setOffset((window.innerHeight - rect.top) * 0.15);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      ref={heroRef}
      className="relative w-full h-[50vh] sm:h-[65vh] overflow-hidden"
    >
      {/* Parallax image */}
      <div
        className="absolute inset-0 w-full"
        style={{ transform: `translateY(${offset}px)`, height: "120%" }}
      >
        {!loaded && !imgError && (
          <div className="absolute inset-0 skeleton rounded-none" />
        )}
        {!imgError ? (
          <Image
            src={heroUrl}
            alt={title}
            fill
            priority
            sizes="100vw"
            className="object-cover transition-opacity duration-700"
            style={{ opacity: loaded ? 1 : 0 }}
            onLoad={() => setLoaded(true)}
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="absolute inset-0 bg-dark-800 flex items-center justify-center">
            <span className="text-7xl">{category.icon ?? "✈️"}</span>
          </div>
        )}
      </div>

      {/* Overlay gradients */}
      <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/30 to-dark-900/50" />
      <div className="absolute inset-0 bg-gradient-to-r from-dark-900/60 via-transparent to-dark-900/60" />

      {/* Title overlay */}
      <div className="absolute bottom-0 inset-x-0 p-6 sm:p-10 lg:p-16 max-w-5xl mx-auto">
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge variant="purple" size="md">
            {category.icon} {category.name}
          </Badge>
          {featured && (
            <Badge variant="cyan" size="md">
              精选体验
            </Badge>
          )}
        </div>
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-display font-bold text-white text-glow-cyan leading-tight">
          {title}
        </h1>
      </div>
    </div>
  );
}
