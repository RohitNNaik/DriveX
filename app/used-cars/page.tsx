import { USED_CARS } from "@/lib/data";
import CarCard from "@/components/car-card/CarCard";
import type { Car } from "@/lib/types";
import { Shield, CheckCircle, FileText, RefreshCw } from "lucide-react";

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

const TRUST_BADGES = [
  { icon: CheckCircle, label: "Verified Owners", color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200" },
  { icon: Shield, label: "100-point Inspection", color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200" },
  { icon: FileText, label: "Full Service History", color: "text-violet-600", bg: "bg-violet-50", border: "border-violet-200" },
  { icon: RefreshCw, label: "Easy Returns", color: "text-orange-600", bg: "bg-orange-50", border: "border-orange-200" },
];

export default async function UsedCarsPage() {
  const cars = await fetchUsedCars();

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero banner */}
      <div className="bg-gradient-to-r from-orange-500 via-orange-600 to-rose-600">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-bold text-white mb-3">
                🏷️ Certified Pre-Owned
              </span>
              <h1 className="text-3xl sm:text-4xl font-black text-white leading-tight">
                Used Cars
              </h1>
              <p className="text-orange-100 mt-1 text-sm">
                {cars.length} certified pre-owned cars at great prices
              </p>
            </div>
            <div className="text-5xl">🚗</div>
          </div>
        </div>
      </div>

      {/* Trust badges */}
      <div className="bg-white border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-4">
          <div className="flex flex-wrap gap-3">
            {TRUST_BADGES.map((b) => {
              const Icon = b.icon;
              return (
                <div
                  key={b.label}
                  className={`flex items-center gap-2 rounded-full border ${b.border} ${b.bg} px-4 py-2`}
                >
                  <Icon className={`h-4 w-4 ${b.color}`} />
                  <span className={`text-xs font-bold ${b.color}`}>{b.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Cars grid */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
        {cars.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
            <div className="text-6xl">🔍</div>
            <p className="text-lg font-bold text-slate-700">No used cars available right now.</p>
            <p className="text-sm text-slate-500">Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {cars.map((car) => (
              <CarCard key={(car as Car & { _id?: string })._id ?? car.id} car={car} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
