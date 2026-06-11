import { NextRequest, NextResponse } from "next/server";
import {
  prisma,
  requireAdmin,
  categorySchema,
  badRequest,
  withErrorHandler,
} from "@/lib";

// GET /api/admin/categories — 管理员分类列表
export const GET = withErrorHandler(async (request: NextRequest) => {
  const auth = await requireAdmin(request);
  if (!("sub" in auth)) return auth;

  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: {
        select: { travelExperiences: true },
      },
    },
  });

  return NextResponse.json(
    categories.map(({ _count, ...c }) => ({
      ...c,
      experienceCount: _count.travelExperiences,
    }))
  );
});

// POST /api/admin/categories — 创建分类
export const POST = withErrorHandler(async (request: NextRequest) => {
  const auth = await requireAdmin(request);
  if (!("sub" in auth)) return auth;

  const body = await request.json().catch(() => null);
  if (!body) return badRequest("请求体不能为空");

  const parsed = categorySchema.safeParse(body);
  if (!parsed.success) {
    return badRequest("输入格式不正确", parsed.error.flatten().fieldErrors);
  }

  const category = await prisma.category.create({ data: parsed.data });
  return NextResponse.json(category, { status: 201 });
});
