import { NextRequest, NextResponse } from "next/server";
import { getCars } from "@/modules/car/car.service";
import { seedCars } from "@/modules/car/car.service";

/**
 * GET /api/cars/[id]
 * Returns a single car by MongoDB _id
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { connectDB } = await import("@/lib/db/mongoose");
    const { CarModel } = await import("@/modules/car/car.schema");

    await connectDB();
    let car = await CarModel.findById(id).lean();

    if (!car) {
      // Try seeding and retrying once
      await seedCars();
      car = await CarModel.findById(id).lean();
    }

    if (!car) {
      return NextResponse.json({ success: false, error: "Car not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: car });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
