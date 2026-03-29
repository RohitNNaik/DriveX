"use client";

import Link from "next/link";
import { X, GitCompare } from "lucide-react";
import { useCompare } from "@/context/CompareContext";
import { Button } from "@/components/ui/button";

export default function CompareBar() {
  const { selected, removeCar, clearAll } = useCompare();

  if (selected.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t shadow-2xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-3 flex items-center justify-between gap-3 flex-wrap sm:flex-nowrap">
        {/* Cars selected */}
        <div className="flex items-center gap-2 flex-wrap flex-1">
          <GitCompare className="h-4 w-4 text-green-600 shrink-0" />
          <span className="text-xs text-gray-500 font-medium shrink-0">Comparing:</span>
          {selected.map((car) => (
            <span
              key={car.id}
              className="flex items-center gap-1 rounded-full bg-green-50 border border-green-200 px-3 py-1 text-xs font-semibold text-green-800"
            >
              {car.name}
              <button
                onClick={() => removeCar(car.id)}
                aria-label={`Remove ${car.name}`}
                className="ml-1 hover:text-red-500"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
          {/* Empty slots */}
          {Array.from({ length: 3 - selected.length }).map((_, i) => (
            <span
              key={i}
              className="rounded-full border-2 border-dashed border-gray-200 px-3 py-1 text-xs text-gray-300"
            >
              + Add car
            </span>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button onClick={clearAll} className="text-xs text-gray-400 hover:text-gray-700 underline">
            Clear all
          </button>
          <Button asChild size="sm" className="bg-green-600 hover:bg-green-700 text-white" disabled={selected.length < 2}>
            <Link href="/compare">Compare Now →</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

