"use client";

import { useState, useEffect, useCallback } from "react";
import { CARS } from "@/lib/data";
import CarCard from "@/components/car-card/CarCard";
import Filters, { FilterState } from "@/components/filters/Filters";
import { Car } from "@/lib/types";

const DEFAULT_FILTERS: FilterState = {
  maxBudget: 2500000,
  fuelType: "All",
  bodyType: "All",
  cityUsage: false,
};

/** Client-side fallback filter for when the API is unavailable */
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

  // Debounce filter changes by 300ms to avoid hammering the API on slider drag
  useEffect(() => {
    const timer = setTimeout(() => fetchCars(filters), 300);
    return () => clearTimeout(timer);
  }, [filters, fetchCars]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold mb-1">Browse Cars</h1>
        <p className="text-gray-500 text-sm">Find your perfect car with fast filters</p>
      </div>

      <Filters filters={filters} onChange={setFilters} />

      <div className="mt-6 flex items-center justify-between">
        <p className="text-sm text-gray-500">
          {loading ? "Loading…" : `${cars.length} car${cars.length !== 1 ? "s" : ""} found`}
        </p>
        <button
          onClick={() => setFilters(DEFAULT_FILTERS)}
          className="text-xs text-blue-600 hover:underline"
        >
          Reset filters
        </button>
      </div>

      {loading ? (
        <div className="mt-16 text-center text-gray-400 animate-pulse">
          <p className="text-lg">Loading cars…</p>
        </div>
      ) : cars.length === 0 ? (
        <div className="mt-16 text-center text-gray-400">
          <p className="text-lg">No cars match your filters.</p>
          <p className="text-sm mt-1">Try increasing your budget or changing filters.</p>
        </div>
      ) : (
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {cars.map((car) => (
            <CarCard key={(car as Car & { _id?: string })._id ?? car.id} car={car} />
          ))}
        </div>
      )}
    </div>
  );
}

