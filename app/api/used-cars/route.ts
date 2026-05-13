import { NextRequest, NextResponse } from "next/server";
import { dotnet, DotnetApiError } from "@/lib/dotnet-client";

/**
 * GET /api/used-cars
 * Proxies to .NET GET /api/used-cars.
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const params = new URLSearchParams();

    if (searchParams.get("city"))        params.set("city",        searchParams.get("city")!);
    if (searchParams.get("maxKmDriven")) params.set("maxKmDriven", searchParams.get("maxKmDriven")!);
    if (searchParams.get("maxOwners"))   params.set("maxOwners",   searchParams.get("maxOwners")!);

    const qs = params.toString();
    const data = await dotnet.get<unknown[]>(`/api/used-cars${qs ? `?${qs}` : ""}`);
    return NextResponse.json({ success: true, data, total: data.length });
  } catch (err) {
    const message = err instanceof DotnetApiError ? err.message : "Failed to fetch used cars";
    const status  = err instanceof DotnetApiError ? err.status  : 500;
    return NextResponse.json({ success: false, error: message }, { status });
  }
}
