import { NextResponse } from "next/server";
import { dotnet, DotnetApiError } from "@/lib/dotnet-client";

interface ExplorePageDataDto {
  featuredCars: unknown[];
  usedCars: unknown[];
  stats: {
    totalCars: number;
    totalBrands: number;
    totalUsedCars: number;
    totalLeads: number;
  };
  filterOptions: {
    fuelTypes: string[];
    bodyTypes: string[];
    brands: string[];
    minPrice: number;
    maxPrice: number;
  };
}

/**
 * GET /api/bff/explore-page-data
 * Proxies to .NET GET /api/bff/explore-page-data and reshapes the response
 * to match the shape the UI expects.
 */
export async function GET() {
  try {
    const dto = await dotnet.get<ExplorePageDataDto>("/api/bff/explore-page-data");
    return NextResponse.json({
      success: true,
      data: {
        featuredCars: dto.featuredCars,
        usedCars:     dto.usedCars,
        stats: {
          totalNew:  dto.stats.totalCars,
          totalUsed: dto.stats.totalUsedCars,
          evCount:   0,
        },
        filters: {
          brands:    dto.filterOptions.brands,
          bodyTypes: dto.filterOptions.bodyTypes,
          fuelTypes: dto.filterOptions.fuelTypes,
          priceRange: {
            min: dto.filterOptions.minPrice,
            max: dto.filterOptions.maxPrice,
          },
        },
      },
    });
  } catch (err) {
    const message = err instanceof DotnetApiError ? err.message : "Failed to load page data";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
