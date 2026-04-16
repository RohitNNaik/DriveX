import { NextRequest, NextResponse } from "next/server";
import { dotnet, DotnetApiError } from "@/lib/dotnet-client";

/**
 * POST /api/bff/advisor
 * Proxies to .NET POST /api/bff/advisor.
 *
 * Body: { query: string; city?: string; budget?: number }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { query, city, budget } = body;

    if (!query?.trim()) {
      return NextResponse.json(
        { success: false, error: "query is required" },
        { status: 400 }
      );
    }

    const data = await dotnet.post<unknown>("/api/bff/advisor", { query, city, budget });
    return NextResponse.json({ success: true, data });
  } catch (err) {
    const message = err instanceof DotnetApiError ? err.message : "Advisor failed";
    const status  = err instanceof DotnetApiError ? err.status  : 500;
    return NextResponse.json({ success: false, error: message }, { status });
  }
}
