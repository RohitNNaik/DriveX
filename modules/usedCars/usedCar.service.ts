import { connectDB } from "@/lib/db/mongoose";
import { CarModel } from "@/modules/car/car.schema";

export interface UsedCarFilters {
  minPrice?: number;
  maxPrice?: number;
  maxKmDriven?: number;
  fuelType?: string;
  bodyType?: string;
  city?: string;
  maxOwners?: number;
  limit?: number;
  skip?: number;
}

export async function getUsedCars(filters: UsedCarFilters = {}) {
  await connectDB();

  const query: Record<string, unknown> = { isUsed: true };

  if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
    query.price = {};
    if (filters.minPrice) (query.price as Record<string, number>).$gte = filters.minPrice;
    if (filters.maxPrice) (query.price as Record<string, number>).$lte = filters.maxPrice;
  }
  if (filters.maxKmDriven) query.kmDriven = { $lte: filters.maxKmDriven };
  if (filters.fuelType) query.fuelType = filters.fuelType;
  if (filters.bodyType) query.bodyType = filters.bodyType;
  if (filters.city) query.city = new RegExp(filters.city, "i");
  if (filters.maxOwners) query.owners = { $lte: filters.maxOwners };

  return CarModel.find(query)
    .sort({ rating: -1, price: 1 })
    .skip(filters.skip ?? 0)
    .limit(filters.limit ?? 50)
    .lean();
}
