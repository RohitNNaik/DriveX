import { NextRequest, NextResponse } from "next/server";
import { dotnet, DotnetApiError } from "@/lib/dotnet-client";

/**
 * GET /api/cars
 * Proxies to .NET GET /api/cars with the same query params.
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const params = new URLSearchParams();

    if (searchParams.get("fuelType"))    params.set("fuelType",  searchParams.get("fuelType")!);
    if (searchParams.get("bodyType"))    params.set("bodyType",  searchParams.get("bodyType")!);
    if (searchParams.get("brand"))       params.set("brand",     searchParams.get("brand")!);
    if (searchParams.get("minPrice"))    params.set("minPrice",  searchParams.get("minPrice")!);
    if (searchParams.get("maxPrice"))    params.set("maxPrice",  searchParams.get("maxPrice")!);
    if (searchParams.get("cityUsage") === "true") params.set("usageTag", "City");

    const qs = params.toString();
    const data = await dotnet.get<unknown[]>(`/api/cars${qs ? `?${qs}` : ""}`);
    return NextResponse.json({ success: true, data, total: data.length });
  } catch (err) {
    const message = err instanceof DotnetApiError ? err.message : "Failed to fetch cars";
    const status  = err instanceof DotnetApiError ? err.status  : 500;
    return NextResponse.json({ success: false, error: message }, { status });
  }
}
