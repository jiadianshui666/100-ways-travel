import { describe, it, expect } from "vitest";
import { cn, slugify, formatPrice, parseImages } from "./utils";

describe("cn", () => {
  it("merges class names", () => {
    expect(cn("foo", "bar")).toBe("foo bar");
  });

  it("filters falsy values", () => {
    expect(cn("foo", false, undefined, "bar")).toBe("foo bar");
  });
});

describe("slugify", () => {
  it("converts text to slug", () => {
    expect(slugify("Hello World")).toBe("hello-world");
  });

  it("handles Chinese characters", () => {
    expect(slugify("北京 三日游")).toBe("北京-三日游");
  });

  it("removes special characters", () => {
    expect(slugify("Hello! @World #2024")).toBe("hello-world-2024");
  });
});

describe("formatPrice", () => {
  it("formats CNY price", () => {
    const result = formatPrice(2999);
    expect(result).toContain("2,999");
  });

  it("formats zero", () => {
    const result = formatPrice(0);
    expect(result).toContain("0");
  });
});

describe("parseImages", () => {
  it("parses valid JSON array", () => {
    expect(parseImages('["a.jpg","b.jpg"]')).toEqual(["a.jpg", "b.jpg"]);
  });

  it("returns empty array on invalid JSON", () => {
    expect(parseImages("not-json")).toEqual([]);
  });

  it("returns empty array on non-array JSON", () => {
    expect(parseImages('{"key":"val"}')).toEqual([]);
  });
});
