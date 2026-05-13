import { NextRequest, NextResponse } from "next/server";
import { dotnet, DotnetApiError } from "@/lib/dotnet-client";
import { CAR_VARIANTS } from "@/lib/data";
import { Car } from "@/lib/types";

/**
 * GET /api/cars/variants?brand=Hyundai&model=Creta
 * Proxies to .NET GET /api/cars/variants.
 * Falls back to static CAR_VARIANTS if the .NET API is unavailable.
 */
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const brand = searchParams.get("brand");
  const model = searchParams.get("model");

  if (!brand || !model) {
    return NextResponse.json(
      { success: false, error: "brand and model query params are required" },
      { status: 400 }
    );
  }

  try {
    const data = await dotnet.get<unknown[]>(
      `/api/cars/variants?brand=${encodeURIComponent(brand)}&model=${encodeURIComponent(model)}`
    );
    return NextResponse.json({ success: true, data, source: "dotnet" });
  } catch {
    // Static fallback
    const fallback = CAR_VARIANTS.filter(
      (c: Car) =>
        c.brand.toLowerCase() === brand.toLowerCase() &&
        c.model.toLowerCase() === model.toLowerCase()
    );
    return NextResponse.json({ success: true, data: fallback, source: "static" });
  }
}
