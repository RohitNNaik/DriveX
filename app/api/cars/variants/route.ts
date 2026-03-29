import { NextRequest, NextResponse } from "next/server";
import { getVariantsByModel, seedCars } from "@/modules/car/car.service";
import { CAR_VARIANTS } from "@/lib/data";
import { Car } from "@/lib/types";

/**
 * GET /api/cars/variants?brand=Hyundai&model=Creta
 *
 * Returns all variants for the given brand + model combination.
 * Falls back to static CAR_VARIANTS if MongoDB is unavailable.
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const brand = searchParams.get("brand");
    const model = searchParams.get("model");

    if (!brand || !model) {
      return NextResponse.json(
        { success: false, error: "brand and model query params are required" },
        { status: 400 }
      );
    }

    let variants = await getVariantsByModel(brand, model);

    // Auto-seed if empty
    if (variants.length === 0) {
      await seedCars();
      variants = await getVariantsByModel(brand, model);
    }

    // Final fallback: filter static data
    if (variants.length === 0) {
      const staticFallback = CAR_VARIANTS.filter(
        (c: Car) =>
          c.brand.toLowerCase() === brand.toLowerCase() &&
          c.model.toLowerCase() === model.toLowerCase()
      );
      return NextResponse.json({ success: true, data: staticFallback, source: "static" });
    }

    return NextResponse.json({ success: true, data: variants, source: "db" });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
