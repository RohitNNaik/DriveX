import { NextResponse } from "next/server";
import { dotnet } from "@/lib/dotnet-client";
import { CAR_VARIANTS } from "@/lib/data";

interface ModelVariantGroupDto {
  brand: string;
  model: string;
  variants: unknown[];
}

/**
 * GET /api/cars/variant-models
 * Proxies to .NET GET /api/cars/variant-models.
 * .NET returns { brand, model, variants[] } — we reshape to { brand, model, variantCount }
 * to match the shape the compare page expects.
 */
export async function GET() {
  try {
    const groups = await dotnet.get<ModelVariantGroupDto[]>("/api/cars/variant-models");
    const data = groups.map((g) => ({
      brand: g.brand,
      model: g.model,
      variantCount: g.variants.length,
    }));
    return NextResponse.json({ success: true, data, source: "dotnet" });
  } catch {
    // Static fallback
    const map = new Map<string, number>();
    for (const car of CAR_VARIANTS) {
      const key = `${car.brand}::${car.model}`;
      map.set(key, (map.get(key) ?? 0) + 1);
    }
    const data = Array.from(map.entries())
      .filter(([, count]) => count >= 2)
      .map(([key, count]) => {
        const [brand, model] = key.split("::");
        return { brand, model, variantCount: count };
      });
    return NextResponse.json({ success: true, data, source: "static" });
  }
}
