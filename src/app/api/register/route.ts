import { NextRequest, NextResponse } from "next/server";
import { prisma, registerSchema, hashPassword, badRequest, signToken } from "@/lib";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  if (!body) return badRequest("请求体不能为空");

  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) {
    return badRequest("输入格式不正确", parsed.error.flatten().fieldErrors);
  }

  const { name, email, password } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return badRequest("该邮箱已被注册");

  const passwordHash = await hashPassword(password);
  const user = await prisma.user.create({
    data: { name, email, passwordHash, role: "USER" },
  });

  const token = await signToken({ sub: user.id, email: user.email, role: user.role });

  return NextResponse.json(
    {
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    },
    { status: 201 }
  );
}
