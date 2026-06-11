import { NextRequest, NextResponse } from "next/server";
import { prisma, loginSchema, signToken, verifyPassword, badRequest, unauthorized } from "@/lib";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  if (!body) return badRequest("请求体不能为空");

  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return badRequest("输入格式不正确", parsed.error.flatten().fieldErrors);
  }

  const { email, password } = parsed.data;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    return unauthorized("邮箱或密码错误");
  }

  if (user.role !== "ADMIN") return unauthorized("无管理员权限");

  const token = await signToken({ sub: user.id, email: user.email, role: user.role });

  return NextResponse.json({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
    },
  });
}
