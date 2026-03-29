import { NextResponse } from "next/server";
import { getExplorePageData } from "@/bff/explore.api";
import { seedCars } from "@/modules/car/car.service";

/**
 * GET /api/bff/explore-page-data
 *
 * Returns featured cars, used cars, catalogue stats, and filter options.
 * On first call (empty DB) auto-seeds from static catalogue.
 */
export async function GET() {
  try {
    let data = await getExplorePageData();

    // Auto-seed if DB is empty
    if (data.stats.totalNew === 0) {
      await seedCars();
      data = await getExplorePageData();
    }

    return NextResponse.json({ success: true, data });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
