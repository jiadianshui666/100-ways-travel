import type { Metadata } from "next";
import { ExperienceDetail } from "@/components/experience/ExperienceDetail";

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const base = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
    const res = await fetch(`${base}/api/experiences/${params.slug}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return { title: "体验不存在 — 百途旅行" };
    const exp = await res.json();
    return {
      title: `${exp.title} — 百途旅行`,
      description: exp.description?.slice(0, 160),
      openGraph: {
        title: exp.title,
        description: exp.description?.slice(0, 160),
        images: exp.images ? [{ url: JSON.parse(exp.images)[0] ?? "", width: 1200, height: 630 }] : [],
        type: "article",
      },
    };
  } catch {
    return { title: "体验详情 — 百途旅行" };
  }
}

export default function Page({ params }: Props) {
  return <ExperienceDetail slug={params.slug} />;
}
