"use client";

import { Slider } from "@/components/ui/slider";
import { FuelType, BodyType } from "@/lib/types";
import { cn } from "@/lib/utils";
import { SlidersHorizontal, RotateCcw } from "lucide-react";

export interface FilterState {
  maxBudget: number;
  fuelType: FuelType | "All";
  bodyType: BodyType | "All";
  cityUsage: boolean;
}

interface FiltersProps {
  filters: FilterState;
  onChange: (f: FilterState) => void;
}

function formatBudget(val: number) {
  if (val >= 100000) return `₹${(val / 100000).toFixed(1)}L`;
  return `₹${(val / 1000).toFixed(0)}K`;
}

const FUEL_OPTIONS: Array<{ value: FuelType | "All"; label: string; emoji: string }> = [
  { value: "All", label: "All", emoji: "🔍" },
  { value: "Petrol", label: "Petrol", emoji: "⛽" },
  { value: "Diesel", label: "Diesel", emoji: "🛢️" },
  { value: "Electric", label: "Electric", emoji: "⚡" },
  { value: "Hybrid", label: "Hybrid", emoji: "🌿" },
  { value: "CNG", label: "CNG", emoji: "🔵" },
];

const BODY_OPTIONS: Array<{ value: BodyType | "All"; label: string; emoji: string }> = [
  { value: "All", label: "All Types", emoji: "🚗" },
  { value: "SUV", label: "SUV", emoji: "🚙" },
  { value: "Sedan", label: "Sedan", emoji: "🚘" },
  { value: "Hatchback", label: "Hatchback", emoji: "🚖" },
  { value: "MPV", label: "MPV", emoji: "🚐" },
  { value: "Coupe", label: "Coupe", emoji: "🏎️" },
];

export default function Filters({ filters, onChange }: FiltersProps) {
  const isDefault =
    filters.maxBudget === 2500000 &&
    filters.fuelType === "All" &&
    filters.bodyType === "All" &&
    !filters.cityUsage;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-slate-500" />
          <span className="text-sm font-bold text-slate-700">Filters</span>
        </div>
        {!isDefault && (
          <button
            onClick={() =>
              onChange({ maxBudget: 2500000, fuelType: "All", bodyType: "All", cityUsage: false })
            }
            className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
          >
            <RotateCcw className="h-3 w-3" />
            Reset all
          </button>
        )}
      </div>

      <div className="p-5 flex flex-col gap-5">
        {/* Budget Slider */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">Budget</span>
            <span className="rounded-full bg-blue-50 border border-blue-200 px-3 py-0.5 text-sm font-black text-blue-700">
              {formatBudget(filters.maxBudget)}
            </span>
          </div>
          <div className="px-1">
            <Slider
              min={300000}
              max={2500000}
              step={50000}
              value={[filters.maxBudget]}
              onValueChange={([val]) => onChange({ ...filters, maxBudget: val })}
              className="w-full"
            />
          </div>
          <div className="flex justify-between text-xs text-slate-400 font-medium">
            <span>₹3L</span>
            <span>₹25L+</span>
          </div>
        </div>

        {/* Fuel Type — pill chips */}
        <div className="flex flex-col gap-2.5">
          <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">Fuel Type</span>
          <div className="flex flex-wrap gap-2">
            {FUEL_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => onChange({ ...filters, fuelType: opt.value })}
                className={cn(
                  "flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-all",
                  filters.fuelType === opt.value
                    ? "border-blue-500 bg-blue-500 text-white shadow-md shadow-blue-500/30"
                    : "border-slate-200 bg-white text-slate-600 hover:border-blue-300 hover:text-blue-600"
                )}
              >
                <span className="text-sm leading-none">{opt.emoji}</span>
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Body Type — pill chips */}
        <div className="flex flex-col gap-2.5">
          <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">Body Type</span>
          <div className="flex flex-wrap gap-2">
            {BODY_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => onChange({ ...filters, bodyType: opt.value })}
                className={cn(
                  "flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-all",
                  filters.bodyType === opt.value
                    ? "border-blue-500 bg-blue-500 text-white shadow-md shadow-blue-500/30"
                    : "border-slate-200 bg-white text-slate-600 hover:border-blue-300 hover:text-blue-600"
                )}
              >
                <span className="text-sm leading-none">{opt.emoji}</span>
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* City Usage toggle */}
        <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
          <div className="flex flex-col gap-0.5">
            <span className="text-sm font-bold text-slate-800">🏙 City-optimised Cars</span>
            <span className="text-xs text-slate-500">Show only cars ideal for city driving</span>
          </div>
          <button
            role="switch"
            aria-checked={filters.cityUsage}
            onClick={() => onChange({ ...filters, cityUsage: !filters.cityUsage })}
            className={cn(
              "relative inline-flex h-6 w-11 items-center rounded-full border-2 transition-colors focus:outline-none",
              filters.cityUsage
                ? "bg-blue-600 border-blue-600"
                : "bg-slate-200 border-slate-200"
            )}
          >
            <span
              className={cn(
                "inline-block h-4 w-4 rounded-full bg-white shadow-md transition-transform",
                filters.cityUsage ? "translate-x-5" : "translate-x-0.5"
              )}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
