"use client";

import { useState, useMemo } from "react";
import { CARS } from "@/lib/data";
import CarCard from "@/components/car-card/CarCard";
import Filters, { FilterState } from "@/components/filters/Filters";

const DEFAULT_FILTERS: FilterState = {
  maxBudget: 2500000,
  fuelType: "All",
  bodyType: "All",
  cityUsage: false,
};

export default function CarsPage() {
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);

  const filtered = useMemo(() => {
    return CARS.filter((car) => {
      if (car.price > filters.maxBudget) return false;
      if (filters.fuelType !== "All" && car.fuelType !== filters.fuelType) return false;
      if (filters.bodyType !== "All" && car.bodyType !== filters.bodyType) return false;
      if (filters.cityUsage && !car.tags.includes("City")) return false;
      return true;
    });
  }, [filters]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold mb-1">Browse Cars</h1>
        <p className="text-gray-500 text-sm">Find your perfect car with fast filters</p>
      </div>

      <Filters filters={filters} onChange={setFilters} />

      <div className="mt-6 flex items-center justify-between">
        <p className="text-sm text-gray-500">
          {filtered.length} car{filtered.length !== 1 ? "s" : ""} found
        </p>
        <button
          onClick={() => setFilters(DEFAULT_FILTERS)}
          className="text-xs text-blue-600 hover:underline"
        >
          Reset filters
        </button>
      </div>

      {filtered.length === 0 ? (
        <div className="mt-16 text-center text-gray-400">
          <p className="text-lg">No cars match your filters.</p>
          <p className="text-sm mt-1">Try increasing your budget or changing filters.</p>
        </div>
      ) : (
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((car) => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>
      )}
    </div>
  );
}

