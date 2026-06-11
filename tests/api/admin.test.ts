import { describe, it, expect, beforeAll } from "vitest";

const BASE = "http://localhost:3099";

let adminToken = "";

async function serverAvailable() {
  try {
    const res = await fetch(`${BASE}/api/categories`);
    return res.ok;
  } catch {
    return false;
  }
}

describe("Admin API", () => {
  beforeAll(async () => {
    // Login to get admin token
    try {
      const res = await fetch(`${BASE}/api/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "admin@100ways.com", password: "admin123" }),
      });
      if (res.ok) {
        const data = await res.json();
        adminToken = data.token;
      }
    } catch {
      // Server not available — tests will be skipped
    }
  });

  // ── Login ──
  describe("POST /api/admin/login", () => {
    it("returns 400 for empty body", async () => {
      if (!(await serverAvailable())) return;
      const res = await fetch(`${BASE}/api/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      expect(res.status).toBe(400);
    });

    it("returns 401 for wrong password", async () => {
      if (!(await serverAvailable())) return;
      const res = await fetch(`${BASE}/api/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "admin@100ways.com", password: "wrong" }),
      });
      expect(res.status).toBe(401);
    });

    it("returns 401 for non-existent user", async () => {
      if (!(await serverAvailable())) return;
      const res = await fetch(`${BASE}/api/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "nobody@nowhere.com", password: "test" }),
      });
      expect(res.status).toBe(401);
    });

    it("returns 400 for invalid email format", async () => {
      if (!(await serverAvailable())) return;
      const res = await fetch(`${BASE}/api/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "not-email", password: "admin123" }),
      });
      expect(res.status).toBe(400);
    });

    it("returns token and user on success", async () => {
      if (!(await serverAvailable())) return;
      expect(adminToken).toBeTruthy();
    });

    it("login response includes user fields", async () => {
      if (!(await serverAvailable())) return;
      const res = await fetch(`${BASE}/api/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "admin@100ways.com", password: "admin123" }),
      });
      const data = await res.json();
      expect(data.user).toHaveProperty("id");
      expect(data.user).toHaveProperty("name");
      expect(data.user).toHaveProperty("email");
      expect(data.user).toHaveProperty("role");
    });

    it("returns 400 for missing fields", async () => {
      if (!(await serverAvailable())) return;
      const res = await fetch(`${BASE}/api/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "admin@100ways.com" }),
      });
      expect(res.status).toBe(400);
    });
  });

  // ── Auth guard ──
  describe("Auth guard", () => {
    it("returns 401 without token", async () => {
      if (!(await serverAvailable())) return;
      const res = await fetch(`${BASE}/api/admin/experiences`);
      expect(res.status).toBe(401);
    });

    it("returns 401 with invalid token", async () => {
      if (!(await serverAvailable())) return;
      const res = await fetch(`${BASE}/api/admin/experiences`, {
        headers: { Authorization: "Bearer invalid-token-here" },
      });
      expect(res.status).toBe(401);
    });

    it("returns 401 with malformed authorization header", async () => {
      if (!(await serverAvailable())) return;
      const res = await fetch(`${BASE}/api/admin/experiences`, {
        headers: { Authorization: "NotBearer token" },
      });
      expect(res.status).toBe(401);
    });
  });

  // ── Admin experiences CRUD ──
  describe("Admin experiences", () => {
    it("lists experiences with valid token", async () => {
      if (!adminToken) return;
      const res = await fetch(`${BASE}/api/admin/experiences?limit=5`, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json).toHaveProperty("data");
      expect(json).toHaveProperty("pagination");
    });

    it("rejects create with invalid data", async () => {
      if (!adminToken) return;
      const res = await fetch(`${BASE}/api/admin/experiences`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({ title: "Missing fields" }),
      });
      expect(res.status).toBe(400);
    });
  });

  // ── Admin categories ──
  describe("Admin categories", () => {
    it("lists categories with valid token", async () => {
      if (!adminToken) return;
      const res = await fetch(`${BASE}/api/admin/categories`, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(Array.isArray(data)).toBe(true);
    });

    it("rejects create with invalid data", async () => {
      if (!adminToken) return;
      const res = await fetch(`${BASE}/api/admin/categories`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({}),
      });
      expect(res.status).toBe(400);
    });

    it("returns 401 without token for admin categories", async () => {
      if (!(await serverAvailable())) return;
      const res = await fetch(`${BASE}/api/admin/categories`);
      expect(res.status).toBe(401);
    });
  });
});
