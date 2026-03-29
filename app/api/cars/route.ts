import { NextRequest, NextResponse } from "next/server";
import { getCars } from "@/modules/car/car.service";
import { seedCars } from "@/modules/car/car.service";
import { CarFilters } from "@/modules/car/car.service";

/**
 * GET /api/cars
 * Query params: isUsed, minPrice, maxPrice, fuelType, bodyType, transmission, brand, limit, skip
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;

    const filters: CarFilters = {
      isUsed: searchParams.get("isUsed") === "true",
      fuelType: searchParams.get("fuelType") ?? undefined,
      bodyType: searchParams.get("bodyType") ?? undefined,
      transmission: searchParams.get("transmission") ?? undefined,
      brand: searchParams.get("brand") ?? undefined,
      minPrice: searchParams.has("minPrice") ? Number(searchParams.get("minPrice")) : undefined,
      maxPrice: searchParams.has("maxPrice") ? Number(searchParams.get("maxPrice")) : undefined,
      limit: searchParams.has("limit") ? Number(searchParams.get("limit")) : 50,
      skip: searchParams.has("skip") ? Number(searchParams.get("skip")) : 0,
    };

    let cars = await getCars(filters);

    // Auto-seed if DB is empty
    if (cars.length === 0) {
      await seedCars();
      cars = await getCars(filters);
    }

    return NextResponse.json({ success: true, data: cars, total: cars.length });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
