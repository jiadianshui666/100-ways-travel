import { NextRequest, NextResponse } from "next/server";
import { prisma, requireAdmin, badRequest, notFound, noContent, withErrorHandler } from "@/lib";
import { z } from "zod";

// 部分更新 schema
const updateExperienceSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  slug: z.string().min(1).max(200).regex(/^[a-z0-9-]+$/).optional(),
  description: z.string().min(1).optional(),
  location: z.string().min(1).optional(),
  price: z.number().min(0).optional(),
  duration: z.string().min(1).optional(),
  images: z.array(z.string().url()).optional(),
  featured: z.boolean().optional(),
  published: z.boolean().optional(),
  categoryId: z.string().min(1).optional(),
});

// PUT /api/admin/experiences/[id] — 更新体验
export const PUT = withErrorHandler(async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  const auth = await requireAdmin(request);
  if (!("sub" in auth)) return auth;

  const existing = await prisma.travelExperience.findUnique({
    where: { id: params.id },
  });
  if (!existing) return notFound("旅行体验不存在");

  const body = await request.json().catch(() => null);
  if (!body) return badRequest("请求体不能为空");

  const parsed = updateExperienceSchema.safeParse(body);
  if (!parsed.success) {
    return badRequest("输入格式不正确", parsed.error.flatten().fieldErrors);
  }

  const { images, ...rest } = parsed.data;
  const data: Record<string, unknown> = { ...rest };
  if (images !== undefined) data.images = JSON.stringify(images);

  const updated = await prisma.travelExperience.update({
    where: { id: params.id },
    data,
    include: {
      category: { select: { id: true, name: true, slug: true } },
      author: { select: { id: true, name: true } },
    },
  });

  return NextResponse.json(updated);
});

// DELETE /api/admin/experiences/[id] — 删除体验
export const DELETE = withErrorHandler(async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  const auth = await requireAdmin(request);
  if (!("sub" in auth)) return auth;

  const existing = await prisma.travelExperience.findUnique({
    where: { id: params.id },
  });
  if (!existing) return notFound("旅行体验不存在");

  await prisma.travelExperience.delete({ where: { id: params.id } });
  return noContent();
});
