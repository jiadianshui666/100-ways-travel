import { SignJWT, jwtVerify } from "jose";

function getSecret(): Uint8Array {
  const raw = process.env.JWT_SECRET;
  if (!raw) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("JWT_SECRET environment variable is required in production");
    }
    // Development fallback — never used in production
    console.warn("[auth] ⚠️  Using dev JWT secret. Set JWT_SECRET in production!");
    return new Uint8Array(Buffer.from("dev-secret-change-in-production-min-32-chars!!", "utf-8"));
  }
  return new Uint8Array(Buffer.from(raw, "utf-8"));
}

const SECRET = getSecret();

export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
}

export async function signToken(payload: JwtPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(SECRET);
}

export async function verifyToken(token: string): Promise<JwtPayload | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload as unknown as JwtPayload;
  } catch {
    return null;
  }
}
