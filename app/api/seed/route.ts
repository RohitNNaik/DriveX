import { NextResponse } from "next/server";
import { seedCars } from "@/modules/car/car.service";

/**
 * POST /api/seed
 * One-time seed route to populate MongoDB from static catalogue.
 * Safe to call multiple times (uses upsert).
 */
export async function POST() {
  try {
    const result = await seedCars();
    return NextResponse.json({
      success: true,
      message: "Database seeded successfully",
      upserted: result.upsertedCount,
      matched: result.matchedCount,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
