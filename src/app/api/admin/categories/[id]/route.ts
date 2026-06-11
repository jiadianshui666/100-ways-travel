import { NextRequest, NextResponse } from "next/server";
import { prisma, requireAdmin, badRequest, notFound, noContent, withErrorHandler } from "@/lib";
import { z } from "zod";

const updateCategorySchema = z.object({
  name: z.string().min(1).max(50).optional(),
  slug: z.string().min(1).max(50).regex(/^[a-z0-9-]+$/).optional(),
  description: z.string().max(500).optional(),
  icon: z.string().max(50).optional(),
});

// PUT /api/admin/categories/[id] — 更新分类
export const PUT = withErrorHandler(async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  const auth = await requireAdmin(request);
  if (!("sub" in auth)) return auth;

  const existing = await prisma.category.findUnique({
    where: { id: params.id },
  });
  if (!existing) return notFound("分类不存在");

  const body = await request.json().catch(() => null);
  if (!body) return badRequest("请求体不能为空");

  const parsed = updateCategorySchema.safeParse(body);
  if (!parsed.success) {
    return badRequest("输入格式不正确", parsed.error.flatten().fieldErrors);
  }

  const updated = await prisma.category.update({
    where: { id: params.id },
    data: parsed.data,
  });
  return NextResponse.json(updated);
});

// DELETE /api/admin/categories/[id] — 删除分类
export const DELETE = withErrorHandler(async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  const auth = await requireAdmin(request);
  if (!("sub" in auth)) return auth;

  const existing = await prisma.category.findUnique({
    where: { id: params.id },
  });
  if (!existing) return notFound("分类不存在");

  // 检查是否有关联体验
  const count = await prisma.travelExperience.count({
    where: { categoryId: params.id },
  });
  if (count > 0) {
    return badRequest(`该分类下有 ${count} 个旅行体验，无法删除`);
  }

  await prisma.category.delete({ where: { id: params.id } });
  return noContent();
});
