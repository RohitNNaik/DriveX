"use client";

import { useState, useEffect, useCallback } from "react";
import { CARS } from "@/lib/data";
import CarCard from "@/components/car-card/CarCard";
import Filters, { FilterState } from "@/components/filters/Filters";
import { Car } from "@/lib/types";
import { Search, SlidersHorizontal } from "lucide-react";

const DEFAULT_FILTERS: FilterState = {
  maxBudget: 2500000,
  fuelType: "All",
  bodyType: "All",
  cityUsage: false,
};

function filterStatic(f: FilterState): Car[] {
  return CARS.filter((car) => {
    if (car.price > f.maxBudget) return false;
    if (f.fuelType !== "All" && car.fuelType !== f.fuelType) return false;
    if (f.bodyType !== "All" && car.bodyType !== f.bodyType) return false;
    if (f.cityUsage && !car.tags.includes("City")) return false;
    return true;
  });
}

export default function CarsPage() {
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(true);

  const fetchCars = useCallback(async (f: FilterState) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ maxPrice: String(f.maxBudget) });
      if (f.fuelType !== "All") params.set("fuelType", f.fuelType);
      if (f.bodyType !== "All") params.set("bodyType", f.bodyType);
      if (f.cityUsage) params.set("cityUsage", "true");

      const res = await fetch(`/api/cars?${params}`);
      const json = await res.json();
      setCars(json.success ? json.data : filterStatic(f));
    } catch {
      setCars(filterStatic(f));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => fetchCars(filters), 300);
    return () => clearTimeout(timer);
  }, [filters, fetchCars]);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Page Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Browse Cars</h1>
              <p className="text-slate-500 text-sm mt-0.5">
                {loading ? (
                  <span className="text-blue-600 animate-pulse">Finding cars…</span>
                ) : (
                  <>
                    <span className="font-bold text-slate-800">{cars.length}</span>
                    {" "}car{cars.length !== 1 ? "s" : ""} match your filters
                  </>
                )}
              </p>
            </div>
            <button
              onClick={() => setShowFilters((v) => !v)}
              className="flex items-center gap-2 self-start sm:self-auto rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:border-blue-300 hover:text-blue-600 transition-all shadow-sm"
            >
              <SlidersHorizontal className="h-4 w-4" />
              {showFilters ? "Hide Filters" : "Show Filters"}
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6">
        <div className="flex flex-col lg:flex-row gap-6">

          {/* Sidebar Filters */}
          {showFilters && (
            <aside className="w-full lg:w-72 shrink-0">
              <div className="sticky top-20">
                <Filters filters={filters} onChange={setFilters} />
              </div>
            </aside>
          )}

          {/* Results */}
          <div className="flex-1 min-w-0">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="rounded-2xl bg-white border border-slate-200 overflow-hidden">
                    <div className="h-44 skeleton" />
                    <div className="p-4 flex flex-col gap-3">
                      <div className="h-4 w-3/4 skeleton rounded-full" />
                      <div className="h-3 w-1/2 skeleton rounded-full" />
                      <div className="h-6 w-1/3 skeleton rounded-full" />
                      <div className="grid grid-cols-3 gap-2">
                        {[1, 2, 3].map((j) => <div key={j} className="h-12 skeleton rounded-xl" />)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : cars.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-100">
                  <Search className="h-8 w-8 text-slate-400" />
                </div>
                <div>
                  <p className="text-lg font-bold text-slate-700">No cars found</p>
                  <p className="text-sm text-slate-500 mt-1">Try increasing your budget or changing filters.</p>
                </div>
                <button
                  onClick={() => setFilters(DEFAULT_FILTERS)}
                  className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-blue-700 transition-colors shadow-md shadow-blue-500/30"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className={`grid gap-5 ${showFilters ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"}`}>
                {cars.map((car) => (
                  <CarCard key={(car as Car & { _id?: string })._id ?? car.id} car={car} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
