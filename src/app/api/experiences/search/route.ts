import { prisma, parsePagination, paginatedResponse, withErrorHandler } from "@/lib";
import { NextRequest, NextResponse } from "next/server";

export const GET = withErrorHandler(async (request: NextRequest) => {
  const { searchParams } = request.nextUrl;
  const q = searchParams.get("q")?.trim();
  const { page, limit, skip } = parsePagination(searchParams);

  if (!q) {
    return NextResponse.json(paginatedResponse([], 0, page, limit));
  }

  const where = {
    published: true,
    OR: [
      { title: { contains: q } },
      { description: { contains: q } },
      { location: { contains: q } },
    ],
  };

  const [data, total] = await Promise.all([
    prisma.travelExperience.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        category: { select: { id: true, name: true, slug: true, icon: true } },
        author: { select: { id: true, name: true, avatar: true } },
      },
    }),
    prisma.travelExperience.count({ where }),
  ]);

  return NextResponse.json(paginatedResponse(data, total, page, limit));
});
