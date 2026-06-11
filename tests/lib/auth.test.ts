// @vitest-environment node
import { describe, it, expect } from "vitest";
import { signToken, verifyToken } from "@/lib/auth";
import type { JwtPayload } from "@/lib/auth";

// Set JWT_SECRET for tests
process.env.JWT_SECRET = "test-secret-min-32-chars-long-key!!";

const payload: JwtPayload = {
  sub: "user-123",
  email: "test@example.com",
  role: "USER",
};

describe("signToken", () => {
  it("returns a string token", async () => {
    const token = await signToken(payload);
    expect(token).toBeTruthy();
    expect(typeof token).toBe("string");
  });

  it("returns different tokens for different payloads", async () => {
    const t1 = await signToken(payload);
    const t2 = await signToken({ ...payload, sub: "user-456" });
    expect(t1).not.toBe(t2);
  });

  it("returns different tokens for same payload (due to iat)", async () => {
    const t1 = await signToken(payload);
    // JWT iat has second precision — wait >1s to ensure different timestamp
    await new Promise((r) => setTimeout(r, 1100));
    const t2 = await signToken(payload);
    expect(t1).not.toBe(t2);
  }, 5000);

  it("signs with HS256 algorithm", async () => {
    const token = await signToken(payload);
    const parts = token.split(".");
    expect(parts).toHaveLength(3);
    // Decode header
    const header = JSON.parse(Buffer.from(parts[0], "base64").toString());
    expect(header.alg).toBe("HS256");
  });
});

describe("verifyToken", () => {
  it("verifies a valid token and returns payload", async () => {
    const token = await signToken(payload);
    const result = await verifyToken(token);
    expect(result).not.toBeNull();
    expect(result!.sub).toBe(payload.sub);
    expect(result!.email).toBe(payload.email);
    expect(result!.role).toBe(payload.role);
  });

  it("returns null for an empty string", async () => {
    const result = await verifyToken("");
    expect(result).toBeNull();
  });

  it("returns null for a malformed token", async () => {
    const result = await verifyToken("not.a.valid.token");
    expect(result).toBeNull();
  });

  it("returns null for a random string", async () => {
    const result = await verifyToken("random-string");
    expect(result).toBeNull();
  });

  it("returns null for a token signed with different secret", async () => {
    // The SECRET constant is evaluated at module load time from JWT_SECRET env.
    // Sign with the default test secret (already set), then verify with a
    // manually-constructed tampered token to test cross-secret rejection.
    const token = await signToken(payload);
    // Tamper the signature to simulate a different secret
    const parts = token.split(".");
    parts[2] = parts[2].replace(/[a-zA-Z0-9_-]/g, "X");
    const tampered = parts.join(".");
    const result = await verifyToken(tampered);
    expect(result).toBeNull();
  });

  it("verifies admin role payload", async () => {
    const adminPayload: JwtPayload = {
      sub: "admin-1",
      email: "admin@test.com",
      role: "ADMIN",
    };
    const token = await signToken(adminPayload);
    const result = await verifyToken(token);
    expect(result).not.toBeNull();
    expect(result!.role).toBe("ADMIN");
  });

  it("includes iat claim in token", async () => {
    const token = await signToken(payload);
    const parts = token.split(".");
    const decoded = JSON.parse(Buffer.from(parts[1], "base64").toString());
    expect(decoded.iat).toBeTruthy();
    expect(typeof decoded.iat).toBe("number");
  });

  it("includes exp claim in token", async () => {
    const token = await signToken(payload);
    const parts = token.split(".");
    const decoded = JSON.parse(Buffer.from(parts[1], "base64").toString());
    expect(decoded.exp).toBeTruthy();
    expect(typeof decoded.exp).toBe("number");
    // Exp should be ~7 days after iat
    expect(decoded.exp - decoded.iat).toBe(7 * 24 * 60 * 60);
  });

  it("returns null for tampered token payload", async () => {
    const token = await signToken(payload);
    const parts = token.split(".");
    // Tamper with payload
    parts[1] = Buffer.from(
      JSON.stringify({ sub: "hacked", email: "hack@evil.com", role: "ADMIN" })
    ).toString("base64url");
    const result = await verifyToken(parts.join("."));
    expect(result).toBeNull();
  });

  it("returns null for token with no signature", async () => {
    const token = await signToken(payload);
    const parts = token.split(".");
    const result = await verifyToken(parts[0] + "." + parts[1] + ".");
    expect(result).toBeNull();
  });

  it("handles various payload edge cases", async () => {
    const edgePayload: JwtPayload = {
      sub: "a".repeat(100),
      email: "very.long.email.address@really.long.domain.example.com",
      role: "USER",
    };
    const token = await signToken(edgePayload);
    const result = await verifyToken(token);
    expect(result).not.toBeNull();
    expect(result!.sub).toBe(edgePayload.sub);
  });
});
