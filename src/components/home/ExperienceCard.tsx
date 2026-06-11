"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { cn, formatPrice, parseImages } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { type ExperienceData } from "@/hooks/useExperiences";

interface ExperienceCardProps {
  experience: ExperienceData;
  className?: string;
  priority?: boolean;
}

export function ExperienceCard({
  experience,
  className,
  priority = false,
}: ExperienceCardProps) {
  const [imgError, setImgError] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const images = parseImages(experience.images);
  const heroImage = images[0] ?? "/placeholder.svg";

  return (
    <Link
      href={`/experiences/${experience.slug}`}
      className={cn(
        "group block glass rounded-2xl overflow-hidden transition-all duration-500",
        "hover:-translate-y-2 hover:shadow-card",
        "hover:border-neon-purple/30",
        className
      )}
    >
      {/* Image */}
      <div className="relative h-52 sm:h-56 overflow-hidden">
        {/* Skeleton placeholder */}
        {!loaded && !imgError && (
          <div className="absolute inset-0 skeleton rounded-none" />
        )}

        {!imgError ? (
          <Image
            src={heroImage}
            alt={experience.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className={cn(
              "object-cover transition-all duration-700",
              "group-hover:scale-110",
              loaded ? "opacity-100" : "opacity-0"
            )}
            onLoad={() => setLoaded(true)}
            onError={() => setImgError(true)}
            priority={priority}
          />
        ) : (
          <div className="absolute inset-0 bg-dark-700 flex items-center justify-center">
            <span className="text-4xl">{experience.category?.icon ?? "✈️"}</span>
          </div>
        )}

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-dark-900/90 via-transparent to-transparent" />

        {/* Price badge */}
        <div className="absolute top-3 right-3 px-3 py-1.5 rounded-lg bg-dark-900/80 backdrop-blur-sm border border-white/10">
          <span className="text-sm font-display font-bold text-neon-green">
            {formatPrice(experience.price)}
          </span>
        </div>

        {/* Category + featured badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {experience.category && (
            <Badge variant="purple" size="sm">
              {experience.category.icon} {experience.category.name}
            </Badge>
          )}
          {experience.featured && (
            <Badge variant="cyan" size="sm">
              精选
            </Badge>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 space-y-3">
        <h3 className="text-lg font-display font-semibold text-white line-clamp-2 group-hover:text-neon-cyan transition-colors duration-300">
          {experience.title}
        </h3>

        <p className="text-sm text-dark-400 line-clamp-2 leading-relaxed">
          {experience.description}
        </p>

        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2 text-xs text-dark-400">
            <svg
              className="w-4 h-4 text-neon-pink"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            {experience.location}
          </div>
          <span className="text-xs text-dark-500">{experience.duration}</span>
        </div>
      </div>
    </Link>
  );
}

/* ── Skeleton variant ── */
export function ExperienceCardSkeleton() {
  return (
    <div className="glass rounded-2xl overflow-hidden animate-fade-in">
      <div className="h-52 sm:h-56 skeleton rounded-none" />
      <div className="p-5 space-y-3">
        <div className="flex gap-2">
          <div className="skeleton h-5 w-16 rounded-full" />
          <div className="skeleton h-5 w-12 rounded-full" />
        </div>
        <div className="skeleton h-6 w-3/4" />
        <div className="space-y-2">
          <div className="skeleton h-4 w-full" />
          <div className="skeleton h-4 w-5/6" />
        </div>
        <div className="flex justify-between items-center pt-2">
          <div className="skeleton h-5 w-24" />
          <div className="skeleton h-4 w-16" />
        </div>
      </div>
    </div>
  );
}
