import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { parseImages } from "@/lib/utils";
import { HeroImage } from "@/components/experience/HeroImage";
import { MetaBar } from "@/components/experience/MetaBar";
import { InfoCards } from "@/components/experience/InfoCards";
import { StorySection } from "@/components/experience/StorySection";
import { ImageGallery } from "@/components/experience/ImageGallery";
import { RelatedExperiences } from "@/components/experience/RelatedExperiences";

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const exp = await prisma.travelExperience.findUnique({
    where: { slug: params.slug, published: true },
    select: { title: true, description: true, images: true },
  });

  if (!exp) return { title: "体验不存在 — 百途旅行" };

  const images = parseImages(exp.images);
  return {
    title: `${exp.title} — 百途旅行`,
    description: exp.description.slice(0, 160),
    openGraph: {
      title: exp.title,
      description: exp.description.slice(0, 160),
      images: images.length > 0 ? [{ url: images[0], width: 1200, height: 630 }] : [],
      type: "article",
    },
  };
}

export default async function ExperienceDetailPage({ params }: Props) {
  const experience = await prisma.travelExperience.findUnique({
    where: { slug: params.slug, published: true },
    include: {
      category: { select: { id: true, name: true, slug: true, icon: true } },
      author: { select: { id: true, name: true, avatar: true, bio: true } },
    },
  });

  if (!experience) notFound();

  // Fetch 3 related experiences from same category (excluding current)
  const related = await prisma.travelExperience.findMany({
    where: {
      categoryId: experience.categoryId,
      id: { not: experience.id },
      published: true,
    },
    take: 3,
    orderBy: { createdAt: "desc" },
    include: {
      category: { select: { id: true, name: true, slug: true, icon: true } },
      author: { select: { id: true, name: true, avatar: true } },
    },
  });

  return (
    <div className="min-h-screen">
      {/* 1. Hero with parallax */}
      <HeroImage
        title={experience.title}
        images={experience.images}
        category={experience.category}
        featured={experience.featured}
      />

      {/* 2. Meta bar */}
      <MetaBar
        location={experience.location}
        price={experience.price}
        duration={experience.duration}
        author={experience.author}
        createdAt={experience.createdAt.toISOString()}
      />

      {/* Content area */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-16">
        {/* 3. Info cards */}
        <InfoCards
          duration={experience.duration}
          price={experience.price}
          location={experience.location}
        />

        {/* 4. Story section */}
        <StorySection description={experience.description} />

        {/* 5. Image gallery */}
        {parseImages(experience.images).length > 1 && (
          <ImageGallery images={experience.images} title={experience.title} />
        )}

        {/* Divider */}
        <hr className="divider-neon" />

        {/* 6. Related experiences */}
        <RelatedExperiences
          experiences={related.map((r) => ({
            ...r,
            createdAt: r.createdAt.toISOString(),
            updatedAt: r.updatedAt.toISOString(),
          }))}
        />
      </div>
    </div>
  );
}
