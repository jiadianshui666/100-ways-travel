import { describe, it, expect } from "vitest";
import {
  registerSchema,
  loginSchema,
  categorySchema,
  travelExperienceSchema,
} from "@/lib/validations";

// ── registerSchema ──
describe("registerSchema", () => {
  it("accepts valid registration data", () => {
    const result = registerSchema.safeParse({
      name: "测试用户",
      email: "test@example.com",
      password: "123456",
    });
    expect(result.success).toBe(true);
  });

  it("rejects name shorter than 2 chars", () => {
    const result = registerSchema.safeParse({
      name: "A",
      email: "test@example.com",
      password: "123456",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain("name");
    }
  });

  it("rejects name longer than 50 chars", () => {
    const result = registerSchema.safeParse({
      name: "A".repeat(51),
      email: "test@example.com",
      password: "123456",
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid email", () => {
    const result = registerSchema.safeParse({
      name: "测试",
      email: "not-an-email",
      password: "123456",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain("email");
    }
  });

  it("rejects password shorter than 6", () => {
    const result = registerSchema.safeParse({
      name: "测试",
      email: "test@example.com",
      password: "12345",
    });
    expect(result.success).toBe(false);
  });

  it("rejects empty name", () => {
    const result = registerSchema.safeParse({
      name: "",
      email: "test@example.com",
      password: "123456",
    });
    expect(result.success).toBe(false);
  });

  it("rejects empty fields", () => {
    const result = registerSchema.safeParse({ name: "", email: "", password: "" });
    expect(result.success).toBe(false);
  });

  it("rejects missing fields", () => {
    const result = registerSchema.safeParse({});
    expect(result.success).toBe(false);
  });

  it("rejects password over 100 chars", () => {
    const result = registerSchema.safeParse({
      name: "Test",
      email: "a@b.com",
      password: "x".repeat(101),
    });
    expect(result.success).toBe(false);
  });

  it("trims whitespace from email", () => {
    const result = registerSchema.safeParse({
      name: "Test User",
      email: "  test@example.com  ",
      password: "123456",
    });
    // Zod email() rejects whitespace — should fail
    expect(result.success).toBe(false);
  });
});

// ── loginSchema ──
describe("loginSchema", () => {
  it("accepts valid login data", () => {
    const result = loginSchema.safeParse({
      email: "admin@100ways.com",
      password: "admin123",
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid email", () => {
    const result = loginSchema.safeParse({
      email: "not-email",
      password: "admin123",
    });
    expect(result.success).toBe(false);
  });

  it("rejects empty password", () => {
    const result = loginSchema.safeParse({
      email: "admin@100ways.com",
      password: "",
    });
    expect(result.success).toBe(false);
  });

  it("rejects missing email", () => {
    const result = loginSchema.safeParse({ password: "test" });
    expect(result.success).toBe(false);
  });

  it("rejects empty body", () => {
    const result = loginSchema.safeParse({});
    expect(result.success).toBe(false);
  });
});

// ── categorySchema ──
describe("categorySchema", () => {
  it("accepts valid category", () => {
    const result = categorySchema.safeParse({
      name: "城市探索",
      slug: "city-explore",
      description: "城市之旅",
      icon: "🏙️",
    });
    expect(result.success).toBe(true);
  });

  it("accepts minimal category (no optional fields)", () => {
    const result = categorySchema.safeParse({
      name: "自然",
      slug: "nature",
    });
    expect(result.success).toBe(true);
  });

  it("rejects empty name", () => {
    const result = categorySchema.safeParse({ name: "", slug: "test" });
    expect(result.success).toBe(false);
  });

  it("rejects slug with uppercase", () => {
    const result = categorySchema.safeParse({ name: "Test", slug: "UPPER" });
    expect(result.success).toBe(false);
  });

  it("rejects slug with special chars", () => {
    const result = categorySchema.safeParse({ name: "Test", slug: "hello world!" });
    expect(result.success).toBe(false);
  });

  it("rejects slug with Chinese chars", () => {
    const result = categorySchema.safeParse({ name: "Test", slug: "城市" });
    expect(result.success).toBe(false);
  });

  it("accepts valid slug with numbers and hyphens", () => {
    const result = categorySchema.safeParse({
      name: "2024 精选",
      slug: "2024-selection",
    });
    expect(result.success).toBe(true);
  });

  it("rejects description over 500 chars", () => {
    const result = categorySchema.safeParse({
      name: "Test",
      slug: "test",
      description: "x".repeat(501),
    });
    expect(result.success).toBe(false);
  });
});

// ── travelExperienceSchema ──
describe("travelExperienceSchema", () => {
  const validExperience = {
    title: "冰岛极光之旅",
    slug: "iceland-aurora",
    description: "追逐北极光",
    location: "冰岛",
    price: 32800,
    duration: "12 天",
    images: ["https://example.com/img.jpg"],
    featured: false,
    published: true,
    categoryId: "cat123",
  };

  it("accepts valid experience", () => {
    const result = travelExperienceSchema.safeParse(validExperience);
    expect(result.success).toBe(true);
  });

  it("accepts experience with default images array", () => {
    const { images, ...rest } = validExperience;
    const result = travelExperienceSchema.safeParse(rest);
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.images).toEqual([]);
  });

  it("rejects empty title", () => {
    const result = travelExperienceSchema.safeParse({
      ...validExperience,
      title: "",
    });
    expect(result.success).toBe(false);
  });

  it("rejects negative price", () => {
    const result = travelExperienceSchema.safeParse({
      ...validExperience,
      price: -100,
    });
    expect(result.success).toBe(false);
  });

  it("rejects empty description", () => {
    const result = travelExperienceSchema.safeParse({
      ...validExperience,
      description: "",
    });
    expect(result.success).toBe(false);
  });

  it("rejects non-URL image", () => {
    const result = travelExperienceSchema.safeParse({
      ...validExperience,
      images: ["not-a-url"],
    });
    expect(result.success).toBe(false);
  });

  it("rejects empty categoryId", () => {
    const result = travelExperienceSchema.safeParse({
      ...validExperience,
      categoryId: "",
    });
    expect(result.success).toBe(false);
  });

  it("rejects missing location", () => {
    const { location, ...rest } = validExperience;
    const result = travelExperienceSchema.safeParse(rest);
    expect(result.success).toBe(false);
  });

  it("handles zero price", () => {
    const result = travelExperienceSchema.safeParse({
      ...validExperience,
      price: 0,
    });
    expect(result.success).toBe(true);
  });

  it("rejects slug with invalid chars", () => {
    const result = travelExperienceSchema.safeParse({
      ...validExperience,
      slug: "Invalid Slug!",
    });
    expect(result.success).toBe(false);
  });
});
