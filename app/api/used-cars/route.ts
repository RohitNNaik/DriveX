import { NextRequest, NextResponse } from "next/server";
import { getUsedCars } from "@/modules/usedCars/usedCar.service";
import { seedCars } from "@/modules/car/car.service";
import { UsedCarFilters } from "@/modules/usedCars/usedCar.service";

/**
 * GET /api/used-cars
 * Query params: minPrice, maxPrice, maxKmDriven, fuelType, bodyType, city, maxOwners, limit, skip
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;

    const filters: UsedCarFilters = {
      fuelType: searchParams.get("fuelType") ?? undefined,
      bodyType: searchParams.get("bodyType") ?? undefined,
      city: searchParams.get("city") ?? undefined,
      minPrice: searchParams.has("minPrice") ? Number(searchParams.get("minPrice")) : undefined,
      maxPrice: searchParams.has("maxPrice") ? Number(searchParams.get("maxPrice")) : undefined,
      maxKmDriven: searchParams.has("maxKmDriven") ? Number(searchParams.get("maxKmDriven")) : undefined,
      maxOwners: searchParams.has("maxOwners") ? Number(searchParams.get("maxOwners")) : undefined,
      limit: searchParams.has("limit") ? Number(searchParams.get("limit")) : 50,
      skip: searchParams.has("skip") ? Number(searchParams.get("skip")) : 0,
    };

    let cars = await getUsedCars(filters);

    // Auto-seed if DB is empty
    if (cars.length === 0) {
      await seedCars();
      cars = await getUsedCars(filters);
    }

    return NextResponse.json({ success: true, data: cars, total: cars.length });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
