// ── Server-only exports (API routes, server components) ──
// Do NOT import from @/lib in client components — use @/lib/utils instead.
export { prisma } from "./prisma";
export { signToken, verifyToken, type JwtPayload } from "./auth";
export { hashPassword, verifyPassword } from "./password";
export {
  registerSchema,
  loginSchema,
  updateProfileSchema,
  categorySchema,
  travelExperienceSchema,
  travelExperienceFormSchema,
} from "./validations";
export type {
  RegisterInput,
  LoginInput,
  UpdateProfileInput,
  CategoryInput,
  TravelExperienceInput,
  TravelExperienceFormInput,
} from "./validations";
export {
  ok,
  created,
  noContent,
  badRequest,
  unauthorized,
  forbidden,
  notFound,
  serverError,
  withErrorHandler,
  getAuthPayload,
  requireAdmin,
  parsePagination,
  paginatedResponse,
} from "./api-utils";
export type { ApiHandler } from "./api-utils";

// ── Shared utilities (safe for both server & client) ──
export { cn, slugify, formatPrice, parseImages } from "./utils";
