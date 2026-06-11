import { prisma, notFound, withErrorHandler } from "@/lib";
import { NextRequest, NextResponse } from "next/server";

export const GET = withErrorHandler(async (
  _request: NextRequest,
  { params }: { params: { slug: string } }
) => {
  const experience = await prisma.travelExperience.findUnique({
    where: { slug: params.slug, published: true },
    include: {
      category: { select: { id: true, name: true, slug: true, icon: true } },
      author: { select: { id: true, name: true, avatar: true, bio: true } },
    },
  });

  if (!experience) return notFound("旅行体验不存在");

  return NextResponse.json(experience);
});
