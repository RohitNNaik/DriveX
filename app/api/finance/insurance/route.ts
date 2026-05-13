import { NextRequest, NextResponse } from "next/server";
import { dotnet, DotnetApiError } from "@/lib/dotnet-client";

/**
 * POST /api/finance/insurance
 * Proxies to .NET POST /api/finance/insurance.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { carPrice, carAge, engineCC, isEV } = body;

    if (!carPrice || carAge === undefined || !engineCC) {
      return NextResponse.json(
        { success: false, error: "carPrice, carAge, and engineCC are required" },
        { status: 400 }
      );
    }

    const data = await dotnet.post<unknown>("/api/finance/insurance", {
      carPrice,
      carAge,
      engineCC,
      isEV: isEV ?? false,
    });
    return NextResponse.json({ success: true, data });
  } catch (err) {
    const message = err instanceof DotnetApiError ? err.message : "Insurance fetch failed";
    const status  = err instanceof DotnetApiError ? err.status  : 500;
    return NextResponse.json({ success: false, error: message }, { status });
  }
}
