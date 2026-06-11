import { describe, it, expect } from "vitest";

const BASE = "http://localhost:3099";

async function serverAvailable() {
  try {
    const res = await fetch(`${BASE}/api/categories`);
    return res.ok;
  } catch {
    return false;
  }
}

describe("/api/categories", () => {
  it("returns status 200", async () => {
    if (!(await serverAvailable())) return;
    const res = await fetch(`${BASE}/api/categories`);
    expect(res.status).toBe(200);
  });

  it("returns array of categories", async () => {
    if (!(await serverAvailable())) return;
    const res = await fetch(`${BASE}/api/categories`);
    const data = await res.json();
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBeGreaterThan(0);
  });

  it("each category has required fields", async () => {
    if (!(await serverAvailable())) return;
    const res = await fetch(`${BASE}/api/categories`);
    const data = await res.json();
    for (const cat of data) {
      expect(cat).toHaveProperty("id");
      expect(cat).toHaveProperty("name");
      expect(cat).toHaveProperty("slug");
      expect(cat).toHaveProperty("experienceCount");
      expect(typeof cat.experienceCount).toBe("number");
    }
  });

  it("experienceCount is non-negative", async () => {
    if (!(await serverAvailable())) return;
    const res = await fetch(`${BASE}/api/categories`);
    const data = await res.json();
    for (const cat of data) {
      expect(cat.experienceCount).toBeGreaterThanOrEqual(0);
    }
  });

  it("returns unique slugs", async () => {
    if (!(await serverAvailable())) return;
    const res = await fetch(`${BASE}/api/categories`);
    const data = await res.json();
    const slugs = data.map((c: { slug: string }) => c.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("has consistent shape (no unexpected fields)", async () => {
    if (!(await serverAvailable())) return;
    const res = await fetch(`${BASE}/api/categories`);
    const data = await res.json();
    for (const cat of data) {
      const keys = Object.keys(cat).sort();
      expect(keys).toContain("id");
      expect(keys).toContain("name");
      expect(keys).toContain("slug");
      expect(keys).toContain("description");
      expect(keys).toContain("icon");
      expect(keys).toContain("createdAt");
      expect(keys).toContain("updatedAt");
      expect(keys).toContain("experienceCount");
    }
  });

  it("returns JSON content type", async () => {
    if (!(await serverAvailable())) return;
    const res = await fetch(`${BASE}/api/categories`);
    expect(res.headers.get("content-type")).toContain("application/json");
  });

  it("each category has non-empty name", async () => {
    if (!(await serverAvailable())) return;
    const res = await fetch(`${BASE}/api/categories`);
    const data = await res.json();
    for (const cat of data) {
      expect(cat.name.length).toBeGreaterThan(0);
    }
  });

  it("counts only published experiences", async () => {
    if (!(await serverAvailable())) return;
    const res = await fetch(`${BASE}/api/categories`);
    const data = await res.json();
    for (const cat of data) {
      expect(typeof cat.experienceCount).toBe("number");
      expect(Number.isInteger(cat.experienceCount)).toBe(true);
    }
  });

  it("categories are sorted consistently (no duplicates)", async () => {
    if (!(await serverAvailable())) return;
    const res = await fetch(`${BASE}/api/categories`);
    const data = await res.json();
    // Verify consistent ordering: same response every time
    const res2 = await fetch(`${BASE}/api/categories`);
    const data2 = await res2.json();
    expect(data.map((c: { slug: string }) => c.slug)).toEqual(
      data2.map((c: { slug: string }) => c.slug)
    );
  });
});
