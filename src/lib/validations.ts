import { z } from "zod";

// ── User ──
export const registerSchema = z.object({
  name: z.string().min(2, "姓名至少 2 个字符").max(50),
  email: z.string().email("请输入有效的邮箱"),
  password: z.string().min(6, "密码至少 6 位").max(100),
});

export const loginSchema = z.object({
  email: z.string().email("请输入有效的邮箱"),
  password: z.string().min(1, "请输入密码"),
});

export const updateProfileSchema = z.object({
  name: z.string().min(2).max(50).optional(),
  avatar: z.string().url().optional().or(z.literal("")),
  bio: z.string().max(500).optional(),
});

// ── Category ──
export const categorySchema = z.object({
  name: z.string().min(1, "请输入分类名称").max(50),
  slug: z
    .string()
    .min(1)
    .max(50)
    .regex(/^[a-z0-9-]+$/, "slug 只能包含小写字母、数字和连字符"),
  description: z.string().max(500).optional(),
  icon: z.string().max(50).optional(),
});

// ── TravelExperience ──
export const travelExperienceSchema = z.object({
  title: z.string().min(1, "请输入标题").max(200),
  slug: z
    .string()
    .min(1)
    .max(200)
    .regex(/^[a-z0-9-]+$/, "slug 只能包含小写字母、数字和连字符"),
  description: z.string().min(1, "请输入描述"),
  location: z.string().min(1, "请输入地点"),
  price: z.number().min(0, "价格不能为负数"),
  duration: z.string().min(1, "请输入时长"),
  images: z.array(z.string().url()).default([]),
  featured: z.boolean().default(false),
  published: z.boolean().default(false),
  categoryId: z.string().min(1, "请选择分类"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type CategoryInput = z.infer<typeof categorySchema>;
export type TravelExperienceInput = z.infer<typeof travelExperienceSchema>;
