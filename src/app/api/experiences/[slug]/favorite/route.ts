import { NextRequest, NextResponse } from "next/server";
import { prisma, getAuthPayload, withErrorHandler } from "@/lib";

// POST — toggle favorite
export const POST = withErrorHandler(async (
  request: NextRequest,
  { params }: { params: { slug: string } }
) => {
  const auth = await getAuthPayload(request);
  if (!auth) return NextResponse.json({ error: "请先登录" }, { status: 401 });

  const experience = await prisma.travelExperience.findUnique({
    where: { slug: params.slug },
    select: { id: true },
  });
  if (!experience) return NextResponse.json({ error: "体验不存在" }, { status: 404 });

  const existing = await prisma.favorite.findUnique({
    where: { userId_experienceId: { userId: auth.sub, experienceId: experience.id } },
  });

  if (existing) {
    await prisma.favorite.delete({ where: { id: existing.id } });
    return NextResponse.json({ favorited: false });
  }

  await prisma.favorite.create({
    data: { userId: auth.sub, experienceId: experience.id },
  });
  return NextResponse.json({ favorited: true }, { status: 201 });
});

// GET — check if user favorited
export const GET = withErrorHandler(async (
  request: NextRequest,
  { params }: { params: { slug: string } }
) => {
  const auth = await getAuthPayload(request);
  const experience = await prisma.travelExperience.findUnique({
    where: { slug: params.slug },
    select: { id: true },
  });
  if (!experience) return NextResponse.json({ error: "体验不存在" }, { status: 404 });

  const count = await prisma.favorite.count({ where: { experienceId: experience.id } });

  let favorited = false;
  if (auth) {
    const existing = await prisma.favorite.findUnique({
      where: { userId_experienceId: { userId: auth.sub, experienceId: experience.id } },
    });
    favorited = !!existing;
  }

  return NextResponse.json({ favorited, count });
});
