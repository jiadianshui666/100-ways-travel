import { prisma, parsePagination, paginatedResponse } from "@/lib";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const { page, limit, skip } = parsePagination(searchParams);

  const category = searchParams.get("category");
  const featured = searchParams.get("featured");

  const where: Record<string, unknown> = { published: true };
  if (category) where.category = { slug: category };
  if (featured === "true") where.featured = true;

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
}
