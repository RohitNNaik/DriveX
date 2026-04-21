"use client";

import Link from "next/link";
import { Plus, Minus, Star, Fuel, Zap, GitCompare, Eye } from "lucide-react";
import { Car } from "@/lib/types";
import { useCompare } from "@/context/CompareContext";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

function formatPrice(price: number) {
  if (price >= 100000) return `₹${(price / 100000).toFixed(1)}L`;
  return `₹${(price / 1000).toFixed(0)}K`;
}

const BODY_GRADIENTS: Record<string, string> = {
  SUV: "from-blue-500 to-blue-700",
  Sedan: "from-slate-500 to-slate-700",
  Hatchback: "from-orange-400 to-orange-600",
  MPV: "from-teal-500 to-teal-700",
  Coupe: "from-rose-500 to-rose-700",
  Electric: "from-violet-500 to-violet-700",
};

const TAG_COLORS: Record<string, string> = {
  City: "bg-blue-50 text-blue-700 border-blue-200",
  Highway: "bg-green-50 text-green-700 border-green-200",
  Family: "bg-orange-50 text-orange-700 border-orange-200",
  "Top Pick": "bg-yellow-50 text-yellow-700 border-yellow-200",
  "Best Value": "bg-emerald-50 text-emerald-700 border-emerald-200",
  EV: "bg-violet-50 text-violet-700 border-violet-200",
};

export default function CarCard({ car }: { car: Car }) {
  const { addCar, removeCar, isSelected, isFull } = useCompare();
  const selected = isSelected(car.id);
  const gradient = BODY_GRADIENTS[car.bodyType] ?? "from-slate-500 to-slate-700";

  return (
    <div
      className={cn(
        "group relative flex flex-col rounded-2xl bg-white shadow-sm border transition-all duration-300 overflow-hidden hover:shadow-xl hover:shadow-slate-200/80 hover:-translate-y-1",
        selected
          ? "border-emerald-400 ring-2 ring-emerald-400/30 shadow-md shadow-emerald-200/50"
          : "border-slate-200"
      )}
    >
      {/* Selected indicator */}
      {selected && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 to-emerald-600 z-10" />
      )}

      {/* Image area */}
      <div className={`relative h-44 bg-gradient-to-br ${gradient} flex items-center justify-center overflow-hidden`}>
        {/* Decorative circles */}
        <div className="absolute -top-6 -right-6 h-24 w-24 rounded-full bg-white/10" />
        <div className="absolute -bottom-4 -left-4 h-16 w-16 rounded-full bg-white/10" />

        {/* Car emoji */}
        <span className="relative z-10 text-6xl drop-shadow-lg group-hover:scale-110 transition-transform duration-300">
          {car.fuelType === "Electric" ? "⚡🚗" : "🚗"}
        </span>

        {/* Badges over image */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {car.isUsed && (
            <span className="rounded-full bg-orange-500 px-2.5 py-0.5 text-xs font-bold text-white shadow-md">
              Used
            </span>
          )}
          {car.tags.includes("Top Pick") && (
            <span className="rounded-full bg-yellow-400 px-2.5 py-0.5 text-xs font-bold text-yellow-900 shadow-md">
              ⭐ Top Pick
            </span>
          )}
        </div>

        {/* Rating chip */}
        <div className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-white/95 px-2 py-1 shadow-md">
          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
          <span className="text-xs font-bold text-slate-800">{car.rating}</span>
        </div>

        {/* Body type chip */}
        <div className="absolute bottom-3 left-3">
          <span className="rounded-full bg-black/30 backdrop-blur-sm px-2.5 py-0.5 text-xs font-semibold text-white">
            {car.bodyType}
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="flex flex-col flex-1 p-4 gap-2.5">
        {/* Name & year/fuel */}
        <div>
          <h3 className="font-bold text-base text-slate-900 leading-tight">{car.name}</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {car.year} · {car.fuelType} · {car.transmission}
          </p>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-black text-blue-700">{formatPrice(car.price)}</span>
          <span className="text-xs text-slate-400 font-medium">ex-showroom</span>
        </div>

        {/* Specs row */}
        <div className="grid grid-cols-3 gap-1.5">
          <div className="flex flex-col items-center gap-0.5 rounded-lg bg-slate-50 p-2">
            {car.fuelType === "Electric" ? (
              <Zap className="h-3.5 w-3.5 text-violet-500" />
            ) : (
              <Fuel className="h-3.5 w-3.5 text-slate-500" />
            )}
            <span className="text-[10px] font-semibold text-slate-700">
              {car.fuelType === "Electric" ? "EV" : `${car.mileage} km/l`}
            </span>
          </div>
          <div className="flex flex-col items-center gap-0.5 rounded-lg bg-slate-50 p-2">
            <span className="text-sm">💺</span>
            <span className="text-[10px] font-semibold text-slate-700">{car.seating} seats</span>
          </div>
          <div className="flex flex-col items-center gap-0.5 rounded-lg bg-slate-50 p-2">
            <span className="text-sm">⚡</span>
            <span className="text-[10px] font-semibold text-slate-700">{car.power} bhp</span>
          </div>
        </div>

        {/* km driven (used cars) */}
        {car.isUsed && car.kmDriven && (
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <span>🛣</span>
            <span className="font-medium">{(car.kmDriven / 1000).toFixed(0)}K km driven</span>
          </div>
        )}

        {/* Tags */}
        <div className="flex flex-wrap gap-1">
          {car.tags.filter((t) => t !== "Top Pick").slice(0, 3).map((t) => (
            <span
              key={t}
              className={cn(
                "rounded-full border px-2 py-0.5 text-[10px] font-semibold",
                TAG_COLORS[t] ?? "bg-slate-50 text-slate-600 border-slate-200"
              )}
            >
              {t}
            </span>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-auto pt-1">
          <button
            className={cn(
              "flex flex-1 items-center justify-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-bold transition-all",
              selected
                ? "border-emerald-400 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                : isFull
                ? "cursor-not-allowed border-slate-200 bg-slate-50 text-slate-400"
                : "border-slate-200 text-slate-600 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
            )}
            onClick={() => (selected ? removeCar(car.id) : addCar(car))}
            disabled={!selected && isFull}
            title={!selected && isFull ? "Max 3 cars in compare" : ""}
          >
            {selected ? (
              <><Minus className="h-3 w-3" />Remove</>
            ) : (
              <><GitCompare className="h-3 w-3" />Compare</>
            )}
          </button>

          <Link
            href={`/cars/${car.id}`}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-3 py-2 text-xs font-bold text-white shadow-md shadow-blue-500/20 hover:from-blue-700 hover:to-blue-800 hover:shadow-blue-500/40 transition-all"
          >
            <Eye className="h-3 w-3" />
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}
