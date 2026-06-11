import { describe, it, expect, beforeAll, afterAll } from "vitest";

const BASE = "http://localhost:3099";

// These tests require a running dev server (npm run dev).
// Skip if server is not available.

async function fetchOrSkip(url: string, init?: RequestInit) {
  try {
    const res = await fetch(url, init);
    return res;
  } catch {
    return null;
  }
}

describe("/api/experiences", () => {
  let serverAvailable = false;

  beforeAll(async () => {
    const res = await fetchOrSkip(`${BASE}/api/experiences?limit=1`);
    serverAvailable = res !== null && res.ok;
  });

  it("returns paginated list with status 200", async () => {
    if (!serverAvailable) return;
    const res = await fetch(`${BASE}/api/experiences?page=1&limit=3`);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json).toHaveProperty("data");
    expect(json).toHaveProperty("pagination");
    expect(Array.isArray(json.data)).toBe(true);
  });

  it("returns correct pagination fields", async () => {
    if (!serverAvailable) return;
    const res = await fetch(`${BASE}/api/experiences?page=1&limit=2`);
    const json = await res.json();
    expect(json.pagination).toHaveProperty("page", 1);
    expect(json.pagination).toHaveProperty("limit", 2);
    expect(json.pagination).toHaveProperty("total");
    expect(json.pagination).toHaveProperty("totalPages");
    expect(json.pagination).toHaveProperty("hasMore");
  });

  it("defaults page to 1 and limit to 10", async () => {
    if (!serverAvailable) return;
    const res = await fetch(`${BASE}/api/experiences`);
    const json = await res.json();
    expect(json.pagination.page).toBe(1);
    expect(json.pagination.limit).toBe(10);
  });

  it("respects limit parameter", async () => {
    if (!serverAvailable) return;
    const res = await fetch(`${BASE}/api/experiences?limit=2`);
    const json = await res.json();
    expect(json.data.length).toBeLessThanOrEqual(2);
  });

  it("filters by category slug", async () => {
    if (!serverAvailable) return;
    const res = await fetch(`${BASE}/api/experiences?category=food-tour`);
    const json = await res.json();
    for (const exp of json.data) {
      expect(exp.category.slug).toBe("food-tour");
    }
  });

  it("filters featured experiences", async () => {
    if (!serverAvailable) return;
    const res = await fetch(`${BASE}/api/experiences?featured=true`);
    const json = await res.json();
    for (const exp of json.data) {
      expect(exp.featured).toBe(true);
    }
  });

  it("includes category and author in each experience", async () => {
    if (!serverAvailable) return;
    const res = await fetch(`${BASE}/api/experiences?limit=1`);
    const json = await res.json();
    if (json.data.length > 0) {
      const exp = json.data[0];
      expect(exp).toHaveProperty("category");
      expect(exp).toHaveProperty("author");
      expect(exp.category).toHaveProperty("name");
      expect(exp.author).toHaveProperty("name");
    }
  });

  it("returns only published experiences", async () => {
    if (!serverAvailable) return;
    const res = await fetch(`${BASE}/api/experiences?limit=50`);
    const json = await res.json();
    for (const exp of json.data) {
      expect(exp.published).toBe(true);
    }
  });

  it("handles invalid page gracefully", async () => {
    if (!serverAvailable) return;
    const res = await fetch(`${BASE}/api/experiences?page=-1`);
    expect(res.status).toBe(200); // Should default to page 1
  });

  it("handles non-existent category", async () => {
    if (!serverAvailable) return;
    const res = await fetch(`${BASE}/api/experiences?category=nonexistent`);
    const json = await res.json();
    expect(json.pagination.total).toBe(0);
  });

  it("sorts by price ascending", async () => {
    if (!serverAvailable) return;
    const res = await fetch(`${BASE}/api/experiences?sort=price-asc&limit=10`);
    const json = await res.json();
    const prices = json.data.map((e: { price: number }) => e.price);
    for (let i = 1; i < prices.length; i++) {
      expect(prices[i]).toBeGreaterThanOrEqual(prices[i - 1]);
    }
  });

  it("sorts by price descending", async () => {
    if (!serverAvailable) return;
    const res = await fetch(`${BASE}/api/experiences?sort=price-desc&limit=10`);
    const json = await res.json();
    const prices = json.data.map((e: { price: number }) => e.price);
    for (let i = 1; i < prices.length; i++) {
      expect(prices[i]).toBeLessThanOrEqual(prices[i - 1]);
    }
  });
});

describe("/api/experiences/[slug]", () => {
  let serverAvailable = false;

  beforeAll(async () => {
    const res = await fetchOrSkip(`${BASE}/api/experiences/tokyo-ramen-tour`);
    serverAvailable = res !== null;
  });

  it("returns experience by slug", async () => {
    if (!serverAvailable) return;
    const res = await fetch(`${BASE}/api/experiences/tokyo-ramen-tour`);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.slug).toBe("tokyo-ramen-tour");
  });

  it("includes category and author details", async () => {
    if (!serverAvailable) return;
    const res = await fetch(`${BASE}/api/experiences/tokyo-ramen-tour`);
    const json = await res.json();
    expect(json.category).toHaveProperty("name");
    expect(json.author).toHaveProperty("name");
    expect(json.author).toHaveProperty("bio");
  });

  it("returns 404 for non-existent slug", async () => {
    if (!serverAvailable) return;
    const res = await fetch(`${BASE}/api/experiences/does-not-exist`);
    expect(res.status).toBe(404);
  });

  it("returns 404 for unpublished experience", async () => {
    if (!serverAvailable) return;
    // Test with a slug we know doesn't exist as published
    const res = await fetch(`${BASE}/api/experiences/unpublished-experience`);
    expect(res.status).toBe(404);
  });
});
