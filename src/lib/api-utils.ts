import { NextRequest, NextResponse } from "next/server";
import { verifyToken, type JwtPayload } from "./auth";

// ── Response helpers ──

export function ok<T>(data: T, status = 200) {
  return NextResponse.json(data, { status });
}

export function created<T>(data: T) {
  return NextResponse.json(data, { status: 201 });
}

export function noContent() {
  return new NextResponse(null, { status: 204 });
}

export function badRequest(message: string, errors?: unknown) {
  return NextResponse.json({ error: message, details: errors }, { status: 400 });
}

export function unauthorized(message = "请先登录") {
  return NextResponse.json({ error: message }, { status: 401 });
}

export function forbidden(message = "权限不足") {
  return NextResponse.json({ error: message }, { status: 403 });
}

export function notFound(message = "资源不存在") {
  return NextResponse.json({ error: message }, { status: 404 });
}

export function serverError(message = "服务器内部错误") {
  return NextResponse.json({ error: message }, { status: 500 });
}

// ── API route error handler wrapper ──
// Wraps a route handler with try/catch so unhandled errors return JSON 500
// instead of an HTML error page.

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ApiHandler<P = any> = (
  request: NextRequest,
  context: { params: P }
) => Promise<NextResponse>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function withErrorHandler<P = any>(handler: ApiHandler<P>): ApiHandler<P> {
  return async (request, context) => {
    try {
      return await handler(request, context);
    } catch (error) {
      console.error("[api] Unhandled error:", error);
      const message =
        process.env.NODE_ENV === "production"
          ? "服务器内部错误"
          : `服务器错误: ${error instanceof Error ? error.message : "未知错误"}`;
      return serverError(message);
    }
  };
}

// ── Auth helpers ──

export async function getAuthPayload(
  request: NextRequest
): Promise<JwtPayload | null> {
  const header = request.headers.get("authorization");
  if (!header?.startsWith("Bearer ")) return null;
  const token = header.slice(7);
  return verifyToken(token);
}

export async function requireAdmin(
  request: NextRequest
): Promise<JwtPayload | NextResponse> {
  const payload = await getAuthPayload(request);
  if (!payload) return unauthorized();
  if (payload.role !== "ADMIN") return forbidden();
  return payload;
}

// ── Pagination ──

export function parsePagination(searchParams: URLSearchParams) {
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10) || 1);
  const limit = Math.min(
    50,
    Math.max(1, parseInt(searchParams.get("limit") ?? "10", 10) || 10)
  );
  return { page, limit, skip: (page - 1) * limit };
}

export function paginatedResponse<T>(data: T[], total: number, page: number, limit: number) {
  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasMore: page * limit < total,
    },
  };
}
