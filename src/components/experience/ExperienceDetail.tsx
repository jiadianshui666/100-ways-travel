"use client";

import { useExperience } from "@/hooks/useExperience";
import { useExperiences } from "@/hooks/useExperiences";
import { parseImages } from "@/lib/utils";
import { HeroImage } from "./HeroImage";
import { MetaBar } from "./MetaBar";
import { InfoCards } from "./InfoCards";
import { StorySection } from "./StorySection";
import { ImageGallery } from "./ImageGallery";
import { RelatedExperiences } from "./RelatedExperiences";


interface Props {
  slug: string;
}

export function ExperienceDetail({ slug }: Props) {
  const { experience, loading, error } = useExperience(slug);

  const { experiences: related } = useExperiences({
    category: experience?.category?.slug ?? undefined,
    limit: 4,
  });

  if (loading) {
    return (
      <div className="min-h-screen">
        <div className="h-[50vh] skeleton rounded-none" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-8">
          <div className="skeleton h-8 w-48" />
          <div className="skeleton h-40 w-full" />
          <div className="skeleton h-40 w-full" />
        </div>
      </div>
    );
  }

  if (error || !experience) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-xl text-dark-300">{error ?? "体验不存在"}</p>
          <a href="/experiences" className="text-neon-cyan hover:underline">
            ← 返回体验列表
          </a>
        </div>
      </div>
    );
  }

  // Filter out the current experience from related
  const filtered = related.filter((r) => r.id !== experience.id).slice(0, 3);

  return (
    <div className="min-h-screen">
      <HeroImage
        title={experience.title}
        images={experience.images}
        category={experience.category}
        featured={experience.featured}
      />

      <MetaBar
        location={experience.location}
        price={experience.price}
        duration={experience.duration}
        author={experience.author}
        createdAt={experience.createdAt}
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-16">
        <InfoCards
          duration={experience.duration}
          price={experience.price}
          location={experience.location}
        />

        <StorySection description={experience.description} />

        {parseImages(experience.images).length > 1 && (
          <ImageGallery images={experience.images} title={experience.title} />
        )}

        {filtered.length > 0 && (
          <>
            <hr className="divider-neon" />
            <RelatedExperiences experiences={filtered} />
          </>
        )}
      </div>
    </div>
  );
}
