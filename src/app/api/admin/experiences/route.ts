import { NextRequest, NextResponse } from "next/server";
import {
  prisma,
  requireAdmin,
  travelExperienceSchema,
  badRequest,
  parsePagination,
  paginatedResponse,
} from "@/lib";
import { JwtPayload } from "@/lib/auth";

// GET /api/admin/experiences — 管理员列表（含未发布）
export async function GET(request: NextRequest) {
  const auth = await requireAdmin(request);
  if (!("sub" in auth)) return auth;

  const { searchParams } = request.nextUrl;
  const { page, limit, skip } = parsePagination(searchParams);

  const where: Record<string, unknown> = {};
  const category = searchParams.get("category");
  if (category) where.category = { slug: category };

  const [data, total] = await Promise.all([
    prisma.travelExperience.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        category: { select: { id: true, name: true, slug: true } },
        author: { select: { id: true, name: true, email: true } },
      },
    }),
    prisma.travelExperience.count({ where }),
  ]);

  return NextResponse.json(paginatedResponse(data, total, page, limit));
}

// POST /api/admin/experiences — 创建体验
export async function POST(request: NextRequest) {
  const auth = await requireAdmin(request);
  if (!("sub" in auth)) return auth;

  const body = await request.json().catch(() => null);
  if (!body) return badRequest("请求体不能为空");

  const parsed = travelExperienceSchema.safeParse(body);
  if (!parsed.success) {
    return badRequest("输入格式不正确", parsed.error.flatten().fieldErrors);
  }

  const { images, ...rest } = parsed.data;
  const experience = await prisma.travelExperience.create({
    data: {
      ...rest,
      images: JSON.stringify(images),
      authorId: (auth as JwtPayload).sub,
    },
    include: {
      category: { select: { id: true, name: true, slug: true } },
      author: { select: { id: true, name: true } },
    },
  });

  return NextResponse.json(experience, { status: 201 });
}
