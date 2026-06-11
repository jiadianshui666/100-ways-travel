import "@testing-library/jest-dom/vitest";

// Polyfill Uint8Array for jose in jsdom
// jose's webapi build checks instanceof Uint8Array, which fails in jsdom
// because jsdom creates a separate realm. Force the right reference.
import { TextEncoder, TextDecoder } from "util";
if (typeof globalThis.TextEncoder === "undefined") {
  (globalThis as Record<string, unknown>).TextEncoder = TextEncoder;
}
if (typeof globalThis.TextDecoder === "undefined") {
  (globalThis as Record<string, unknown>).TextDecoder = TextDecoder;
}
