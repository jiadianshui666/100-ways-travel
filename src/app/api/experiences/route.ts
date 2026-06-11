import { prisma, parsePagination, paginatedResponse, withErrorHandler } from "@/lib";
import { NextRequest, NextResponse } from "next/server";

export const GET = withErrorHandler(async (request: NextRequest) => {
  const { searchParams } = request.nextUrl;
  const { page, limit, skip } = parsePagination(searchParams);

  const category = searchParams.get("category");
  const featured = searchParams.get("featured");
  const sort = searchParams.get("sort") ?? "newest";

  const where: Record<string, unknown> = { published: true };
  if (category) where.category = { slug: category };
  if (featured === "true") where.featured = true;

  const orderBy: Record<string, string> =
    sort === "price-asc"
      ? { price: "asc" }
      : sort === "price-desc"
        ? { price: "desc" }
        : { createdAt: "desc" };

  const [data, total] = await Promise.all([
    prisma.travelExperience.findMany({
      where,
      skip,
      take: limit,
      orderBy,
      include: {
        category: { select: { id: true, name: true, slug: true, icon: true } },
        author: { select: { id: true, name: true, avatar: true } },
      },
    }),
    prisma.travelExperience.count({ where }),
  ]);

  return NextResponse.json(paginatedResponse(data, total, page, limit));
});
