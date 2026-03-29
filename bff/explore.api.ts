/**
 * BFF: Explore Page Data
 * GET /api/bff/explore-page-data
 *
 * Returns everything the home/explore page needs in one call:
 * featured new cars, latest used cars, catalogue stats, and available filter options.
 */

import { getFeaturedCars, getCarStats, getCars } from "@/modules/car/car.service";
import { getUsedCars } from "@/modules/usedCars/usedCar.service";

export async function getExplorePageData() {
  const [featuredCars, usedCars, stats] = await Promise.all([
    getFeaturedCars(6),
    getUsedCars({ limit: 3 }),
    getCarStats(),
  ]);

  // Derive available filter options from current catalogue
  const allNewCars = await getCars({ limit: 200 });

  const brands = [...new Set(allNewCars.map((c) => c.brand))].sort();
  const bodyTypes = [...new Set(allNewCars.map((c) => c.bodyType))].sort();
  const fuelTypes = [...new Set(allNewCars.map((c) => c.fuelType))].sort();
  const priceRange = {
    min: Math.min(...allNewCars.map((c) => c.price)),
    max: Math.max(...allNewCars.map((c) => c.price)),
  };

  return {
    featuredCars,
    usedCars,
    stats: {
      totalNew: stats.total,
      totalUsed: stats.usedTotal,
      evCount: stats.evCount,
    },
    filters: {
      brands,
      bodyTypes,
      fuelTypes,
      priceRange,
    },
  };
}
