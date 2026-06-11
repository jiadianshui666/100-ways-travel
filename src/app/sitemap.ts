import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${baseUrl}/experiences`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/search`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
  ];

  let dynamicRoutes: MetadataRoute.Sitemap = [];
  try {
    const experiences = await prisma.travelExperience.findMany({
      where: { published: true },
      select: { slug: true, updatedAt: true },
    });
    dynamicRoutes = experiences.map((exp) => ({
      url: `${baseUrl}/experiences/${exp.slug}`,
      lastModified: exp.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));
  } catch {
    // Prisma may not be available at build time — skip dynamic routes
  }

  return [...staticRoutes, ...dynamicRoutes];
}
