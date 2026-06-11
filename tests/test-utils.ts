/**
 * Shared test utilities.
 * Import from this file instead of duplicating helpers across test files.
 */

const BASE_URL = process.env.TEST_BASE_URL ?? "http://localhost:3099";

let serverAvailableCache: boolean | null = null;

export async function serverAvailable(): Promise<boolean> {
  if (serverAvailableCache !== null) return serverAvailableCache;
  try {
    const res = await fetch(`${BASE_URL}/api/categories`, { signal: AbortSignal.timeout(3000) });
    serverAvailableCache = res.ok;
  } catch {
    serverAvailableCache = false;
  }
  return serverAvailableCache;
}

export function apiUrl(path: string): string {
  return `${BASE_URL}${path}`;
}
