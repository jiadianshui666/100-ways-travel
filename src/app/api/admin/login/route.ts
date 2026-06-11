import { NextRequest, NextResponse } from "next/server";
import { prisma, loginSchema, signToken, verifyPassword, badRequest, unauthorized, withErrorHandler } from "@/lib";
import { checkRateLimit } from "@/lib/rate-limiter";

export const POST = withErrorHandler(async (request: NextRequest) => {
  const body = await request.json().catch(() => null);
  if (!body) return badRequest("请求体不能为空");

  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return badRequest("输入格式不正确", parsed.error.flatten().fieldErrors);
  }

  const { email, password } = parsed.data;

  // Rate limiting: check before credential verification (only on valid input)
  const ip = request.headers.get("x-forwarded-for") ?? request.headers.get("x-real-ip") ?? "unknown";
  const rateLimit = checkRateLimit(`login:${ip}`, { maxRequests: 5, windowMs: 60_000 });
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "登录尝试过于频繁，请稍后再试" },
      { status: 429, headers: { "Retry-After": String(Math.ceil((rateLimit.resetAt - Date.now()) / 1000)) } }
    );
  }

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
});
