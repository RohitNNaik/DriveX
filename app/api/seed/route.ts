import { NextResponse } from "next/server";
import { dotnet, DotnetApiError } from "@/lib/dotnet-client";

/**
 * POST /api/seed
 * Proxies to .NET POST /api/seed.
 * Safe to call multiple times — skips if data already exists.
 */
export async function POST() {
  try {
    const data = await dotnet.post<{ message: string }>("/api/seed");
    return NextResponse.json({ success: true, message: data.message });
  } catch (err) {
    const message = err instanceof DotnetApiError ? err.message : "Seed failed";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
