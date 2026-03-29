import { USED_CARS } from "@/lib/data";
import CarCard from "@/components/car-card/CarCard";
import type { Car } from "@/lib/types";

async function fetchUsedCars(): Promise<Car[]> {
  try {
    const { getUsedCars } = await import("@/modules/usedCars/usedCar.service");
    const cars = await getUsedCars();
    if (cars.length > 0) return cars as unknown as Car[];
  } catch {
    // MongoDB not available — fall back to static data
  }
  return USED_CARS;
}

export default async function UsedCarsPage() {
  const cars = await fetchUsedCars();

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold mb-1">Used Cars</h1>
        <p className="text-gray-500 text-sm">
          Certified pre-owned cars at great prices
        </p>
      </div>

      {/* Trust badges */}
      <div className="flex flex-wrap gap-3 mb-8">
        {["✅ Verified Owners", "🛡 100-point Inspection", "📋 Full Service History", "🔄 Easy Returns"].map((b) => (
          <span key={b} className="rounded-full bg-green-50 border border-green-200 px-3 py-1 text-xs font-medium text-green-700">
            {b}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {cars.map((car) => (
          <CarCard key={(car as Car & { _id?: string })._id ?? car.id} car={car} />
        ))}
      </div>

      {cars.length === 0 && (
        <div className="text-center text-gray-400 mt-16">
          <p className="text-lg">No used cars available right now.</p>
          <p className="text-sm mt-1">Check back soon!</p>
        </div>
      )}
    </div>
  );
}

