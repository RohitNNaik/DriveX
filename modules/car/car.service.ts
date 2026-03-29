import { connectDB } from "@/lib/db/mongoose";
import { CarModel } from "./car.schema";
import { CARS, USED_CARS } from "@/lib/data";

export interface CarFilters {
  isUsed?: boolean;
  minPrice?: number;
  maxPrice?: number;
  fuelType?: string;
  bodyType?: string;
  transmission?: string;
  cityUsage?: boolean;
  brand?: string;
  limit?: number;
  skip?: number;
}

export async function getCars(filters: CarFilters = {}) {
  await connectDB();

  const query: Record<string, unknown> = {
    isUsed: filters.isUsed ?? false,
  };

  if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
    query.price = {};
    if (filters.minPrice !== undefined) (query.price as Record<string, number>).$gte = filters.minPrice;
    if (filters.maxPrice !== undefined) (query.price as Record<string, number>).$lte = filters.maxPrice;
  }
  if (filters.fuelType) query.fuelType = filters.fuelType;
  if (filters.bodyType) query.bodyType = filters.bodyType;
  if (filters.transmission) query.transmission = filters.transmission;
  if (filters.brand) query.brand = new RegExp(filters.brand, "i");
  if (filters.cityUsage) query.tags = { $in: ["City"] };

  return CarModel.find(query)
    .sort({ rating: -1 })
    .skip(filters.skip ?? 0)
    .limit(filters.limit ?? 50)
    .lean();
}

export async function getCarById(carId: string) {
  await connectDB();
  return CarModel.findById(carId).lean();
}

export async function getCarsByIds(ids: string[]) {
  await connectDB();
  return CarModel.find({ _id: { $in: ids } }).lean();
}

export async function getFeaturedCars(limit = 4) {
  await connectDB();
  return CarModel.find({ isUsed: false })
    .sort({ rating: -1 })
    .limit(limit)
    .lean();
}

export async function getCarStats() {
  await connectDB();
  const [total, usedTotal, evCount] = await Promise.all([
    CarModel.countDocuments({ isUsed: false }),
    CarModel.countDocuments({ isUsed: true }),
    CarModel.countDocuments({ fuelType: "Electric", isUsed: false }),
  ]);
  return { total, usedTotal, evCount };
}

/**
 * Seeds the MongoDB collection from the static lib/data.ts catalogue.
 * Safe to call repeatedly — uses upsert to avoid duplicates.
 */
export async function seedCars() {
  await connectDB();

  const allCars = [...CARS, ...USED_CARS];

  const ops = allCars.map((car) => ({
    updateOne: {
      filter: { name: car.name, year: car.year, isUsed: car.isUsed ?? false },
      update: { $setOnInsert: { ...car, isUsed: car.isUsed ?? false } },
      upsert: true,
    },
  }));

  return CarModel.bulkWrite(ops);
}
