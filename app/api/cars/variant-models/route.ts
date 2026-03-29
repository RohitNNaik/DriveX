import { NextResponse } from "next/server";
import { getModelsWithVariants, seedCars } from "@/modules/car/car.service";
import { CAR_VARIANTS } from "@/lib/data";

/**
 * GET /api/cars/variant-models
 *
 * Returns a list of {brand, model, variantCount} for models that have
 * at least 2 variants — used to populate the variant comparison picker.
 */
export async function GET() {
  try {
    let models = await getModelsWithVariants();

    if (models.length === 0) {
      await seedCars();
      models = await getModelsWithVariants();
    }

    // Fallback: derive from static data
    if (models.length === 0) {
      const map = new Map<string, number>();
      for (const car of CAR_VARIANTS) {
        const key = `${car.brand}::${car.model}`;
        map.set(key, (map.get(key) ?? 0) + 1);
      }
      const fallback = Array.from(map.entries())
        .filter(([, count]) => count >= 2)
        .map(([key, count]) => {
          const [brand, model] = key.split("::");
          return { brand, model, variantCount: count };
        });
      return NextResponse.json({ success: true, data: fallback, source: "static" });
    }

    return NextResponse.json({ success: true, data: models, source: "db" });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
