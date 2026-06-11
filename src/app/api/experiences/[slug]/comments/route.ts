import { NextRequest, NextResponse } from "next/server";
import { prisma, getAuthPayload, withErrorHandler } from "@/lib";
import { z } from "zod";

const commentSchema = z.object({ content: z.string().min(1).max(1000) });

// Helper to sanitize user content — strips HTML tags
function sanitizeContent(content: string): string {
  return content.replace(/<[^>]*>/g, "").trim();
}

// GET — list comments
export const GET = withErrorHandler(async (
  _request: NextRequest,
  { params }: { params: { slug: string } }
) => {
  const experience = await prisma.travelExperience.findUnique({
    where: { slug: params.slug },
    select: { id: true },
  });
  if (!experience) return NextResponse.json({ error: "体验不存在" }, { status: 404 });

  const comments = await prisma.comment.findMany({
    where: { experienceId: experience.id },
    orderBy: { createdAt: "desc" },
    include: { user: { select: { id: true, name: true, avatar: true } } },
  });

  return NextResponse.json(comments);
});

// POST — create comment
export const POST = withErrorHandler(async (
  request: NextRequest,
  { params }: { params: { slug: string } }
) => {
  const auth = await getAuthPayload(request);
  if (!auth) return NextResponse.json({ error: "请先登录" }, { status: 401 });

  const body = await request.json().catch(() => null);
  const parsed = commentSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "请输入评论内容" }, { status: 400 });

  const experience = await prisma.travelExperience.findUnique({
    where: { slug: params.slug },
    select: { id: true },
  });
  if (!experience) return NextResponse.json({ error: "体验不存在" }, { status: 404 });

  const comment = await prisma.comment.create({
    data: {
      content: sanitizeContent(parsed.data.content),
      userId: auth.sub,
      experienceId: experience.id,
    },
    include: { user: { select: { id: true, name: true, avatar: true } } },
  });

  return NextResponse.json(comment, { status: 201 });
});
