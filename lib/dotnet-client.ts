/**
 * Thin fetch wrapper for the .NET DriveX API.
 *
 * All calls use server-side fetch (Next.js App Router).
 * The base URL comes from DOTNET_API_URL (env var, server-only).
 *
 * When the API runs on https://localhost (dev self-signed cert), Node rejects
 * the cert by default.  Setting NODE_TLS_REJECT_UNAUTHORIZED=0 in .env.local
 * suppresses that — dev only, never do this in production.
 */

const BASE = process.env.DOTNET_API_URL ?? "https://localhost:60173";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export class DotnetApiError extends Error {
  constructor(
    message: string,
    public status: number
  ) {
    super(message);
    this.name = "DotnetApiError";
  }
}

async function request<T>(
  method: HttpMethod,
  path: string,
  body?: unknown
): Promise<T> {
  const url = `${BASE}${path}`;

  const init: RequestInit = {
    method,
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    // disable Next.js cache for all backend calls so data is always fresh
    cache: "no-store",
  };

  if (body !== undefined) {
    init.body = JSON.stringify(body);
  }

  const res = await fetch(url, init);

  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    throw new DotnetApiError(text || `Request failed: ${res.status}`, res.status);
  }

  // 204 No Content
  if (res.status === 204) return undefined as T;

  return res.json() as Promise<T>;
}

export const dotnet = {
  get: <T>(path: string) => request<T>("GET", path),
  post: <T>(path: string, body?: unknown) => request<T>("POST", path, body),
  patch: <T>(path: string, body?: unknown) => request<T>("PATCH", path, body),
};
