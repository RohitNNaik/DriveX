"use client";

import Link from "next/link";
import { X, GitCompare, ArrowRight } from "lucide-react";
import { useCompare } from "@/context/CompareContext";

export default function CompareBar() {
  const { selected, removeCar, clearAll } = useCompare();

  if (selected.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      {/* Backdrop blur bar */}
      <div className="border-t border-slate-200/80 bg-white/95 backdrop-blur-md shadow-2xl shadow-slate-900/20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-3 flex items-center gap-3 flex-wrap sm:flex-nowrap">

          {/* Icon + label */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500">
              <GitCompare className="h-4 w-4 text-white" />
            </div>
            <span className="text-xs font-bold text-slate-600 hidden sm:block">Comparing</span>
          </div>

          {/* Selected cars */}
          <div className="flex items-center gap-2 flex-1 flex-wrap">
            {selected.map((car) => (
              <span
                key={car.id}
                className="flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-300 px-3 py-1.5 text-xs font-bold text-emerald-800"
              >
                {car.name}
                <button
                  onClick={() => removeCar(car.id)}
                  aria-label={`Remove ${car.name}`}
                  className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-emerald-200 hover:bg-red-200 hover:text-red-600 transition-colors"
                >
                  <X className="h-2.5 w-2.5" />
                </button>
              </span>
            ))}

            {/* Empty slots */}
            {Array.from({ length: 3 - selected.length }).map((_, i) => (
              <span
                key={i}
                className="rounded-full border-2 border-dashed border-slate-300 px-3 py-1 text-xs text-slate-400 font-medium"
              >
                + Add car
              </span>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 shrink-0 ml-auto">
            <button
              onClick={clearAll}
              className="text-xs font-semibold text-slate-400 hover:text-slate-700 transition-colors"
            >
              Clear all
            </button>
            <Link
              href="/compare"
              className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-bold text-white transition-all ${
                selected.length >= 2
                  ? "bg-gradient-to-r from-emerald-500 to-emerald-600 shadow-md shadow-emerald-500/30 hover:from-emerald-600 hover:to-emerald-700 hover:shadow-emerald-500/50"
                  : "bg-slate-300 cursor-not-allowed pointer-events-none"
              }`}
            >
              Compare Now
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
