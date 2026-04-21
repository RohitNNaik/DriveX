"use client";

import Link from "next/link";
import { Minus, Star, Fuel, Zap, GitCompare, Eye, Gauge, Heart } from "lucide-react";
import { Car } from "@/lib/types";
import { useCompare } from "@/context/CompareContext";
import { useGarage } from "@/context/GarageContext";
import { cn } from "@/lib/utils";

function formatPrice(price: number) {
  if (price >= 100000) return `₹${(price / 100000).toFixed(1)}L`;
  return `₹${(price / 1000).toFixed(0)}K`;
}

const BODY_GRADIENTS: Record<string, string> = {
  SUV:       "from-blue-500 via-blue-600 to-indigo-700",
  Sedan:     "from-slate-500 via-slate-600 to-slate-800",
  Hatchback: "from-orange-400 via-orange-500 to-amber-600",
  MPV:       "from-teal-500 via-teal-600 to-cyan-700",
  Coupe:     "from-rose-500 via-rose-600 to-pink-700",
  Electric:  "from-violet-500 via-purple-600 to-indigo-700",
};

const SHADOW_COLORS: Record<string, string> = {
  SUV:       "hover:shadow-blue-500/20",
  Sedan:     "hover:shadow-slate-500/20",
  Hatchback: "hover:shadow-orange-500/20",
  MPV:       "hover:shadow-teal-500/20",
  Coupe:     "hover:shadow-rose-500/20",
  Electric:  "hover:shadow-violet-500/20",
};

const TAG_COLORS: Record<string, string> = {
  City:        "bg-blue-50 text-blue-700 border-blue-200",
  Highway:     "bg-green-50 text-green-700 border-green-200",
  Family:      "bg-orange-50 text-orange-700 border-orange-200",
  "Top Pick":  "bg-yellow-50 text-yellow-700 border-yellow-200",
  "Best Value":"bg-emerald-50 text-emerald-700 border-emerald-200",
  EV:          "bg-violet-50 text-violet-700 border-violet-200",
};

export default function CarCard({ car }: { car: Car }) {
  const { addCar, removeCar, isSelected, isFull } = useCompare();
  const { addToGarage, removeFromGarage, isInGarage } = useGarage();
  const selected  = isSelected(car.id);
  const saved     = isInGarage(car.id);
  const gradient  = BODY_GRADIENTS[car.bodyType]  ?? "from-slate-500 to-slate-700";
  const shadowCls = SHADOW_COLORS[car.bodyType]   ?? "hover:shadow-slate-500/20";

  return (
    <div
      className={cn(
        "group relative flex flex-col rounded-2xl bg-white border transition-all duration-300 overflow-hidden",
        "hover:-translate-y-1.5 hover:shadow-2xl shine-on-hover",
        shadowCls,
        selected
          ? "border-emerald-400 ring-2 ring-emerald-400/30 shadow-lg shadow-emerald-200/50"
          : "border-slate-200 shadow-sm"
      )}
    >
      {/* Selected top bar */}
      {selected && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500 z-10" />
      )}

      {/* Image area */}
      <div className={`relative h-44 bg-gradient-to-br ${gradient} flex items-center justify-center overflow-hidden`}>
        {/* Decorative blobs */}
        <div className="absolute -top-8 -right-8 h-28 w-28 rounded-full bg-white/10 group-hover:scale-110 transition-transform duration-500" />
        <div className="absolute -bottom-5 -left-5 h-20 w-20 rounded-full bg-white/10 group-hover:scale-110 transition-transform duration-500" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-32 w-32 rounded-full bg-white/5" />

        {/* Car emoji */}
        <span className="relative z-10 text-6xl drop-shadow-lg group-hover:scale-115 group-hover:-translate-y-1 transition-all duration-300">
          {car.fuelType === "Electric" ? "⚡🚗" : "🚗"}
        </span>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {car.isUsed && (
            <span className="rounded-full bg-orange-500 px-2.5 py-0.5 text-xs font-bold text-white shadow-md shadow-orange-500/40">
              Used
            </span>
          )}
          {(car.tags as string[]).includes("Top Pick") && (
            <span className="rounded-full bg-gradient-to-r from-yellow-400 to-amber-400 px-2.5 py-0.5 text-xs font-bold text-yellow-900 shadow-md shadow-yellow-500/30">
              ⭐ Top Pick
            </span>
          )}
        </div>

        {/* Rating + Heart */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5">
          <button
            onClick={(e) => { e.preventDefault(); saved ? removeFromGarage(car.id) : addToGarage(car); }}
            className={cn(
              "flex h-7 w-7 items-center justify-center rounded-full shadow-md transition-all duration-200",
              saved
                ? "bg-rose-500 text-white scale-110"
                : "bg-white/95 text-slate-400 hover:text-rose-500 hover:scale-110"
            )}
            title={saved ? "Remove from garage" : "Save to garage"}
          >
            <Heart className={cn("h-3.5 w-3.5", saved && "fill-white")} />
          </button>
          <div className="flex items-center gap-1 rounded-full bg-white/95 backdrop-blur-sm px-2 py-1 shadow-lg">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            <span className="text-xs font-black text-slate-800">{car.rating}</span>
          </div>
        </div>

        {/* Body type pill */}
        <div className="absolute bottom-3 left-3">
          <span className="rounded-full bg-black/35 backdrop-blur-sm px-2.5 py-0.5 text-xs font-semibold text-white">
            {car.bodyType}
          </span>
        </div>

        {/* EV glow ring */}
        {car.fuelType === "Electric" && (
          <div className="absolute inset-0 bg-gradient-to-t from-violet-900/20 to-transparent" />
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col flex-1 p-4 gap-2.5">
        {/* Name */}
        <div>
          <h3 className="font-black text-base text-slate-900 leading-tight group-hover:text-blue-700 transition-colors duration-200">
            {car.name}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {car.year} · {car.fuelType} · {car.transmission}
          </p>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl font-black text-blue-700">{formatPrice(car.price)}</span>
          <span className="text-xs text-slate-400 font-medium">ex-showroom</span>
        </div>

        {/* Specs chips */}
        <div className="grid grid-cols-3 gap-1.5">
          <div className="flex flex-col items-center gap-0.5 rounded-xl bg-slate-50 border border-slate-100 p-2 group-hover:bg-blue-50/50 group-hover:border-blue-100 transition-colors duration-200">
            {car.fuelType === "Electric" ? (
              <Zap className="h-3.5 w-3.5 text-violet-500" />
            ) : (
              <Fuel className="h-3.5 w-3.5 text-green-500" />
            )}
            <span className="text-[10px] font-bold text-slate-700">
              {car.fuelType === "Electric" ? "EV" : `${car.mileage} km/l`}
            </span>
          </div>
          <div className="flex flex-col items-center gap-0.5 rounded-xl bg-slate-50 border border-slate-100 p-2 group-hover:bg-blue-50/50 group-hover:border-blue-100 transition-colors duration-200">
            <span className="text-sm">💺</span>
            <span className="text-[10px] font-bold text-slate-700">{car.seating} seats</span>
          </div>
          <div className="flex flex-col items-center gap-0.5 rounded-xl bg-slate-50 border border-slate-100 p-2 group-hover:bg-blue-50/50 group-hover:border-blue-100 transition-colors duration-200">
            <Gauge className="h-3.5 w-3.5 text-orange-500" />
            <span className="text-[10px] font-bold text-slate-700">{car.power} bhp</span>
          </div>
        </div>

        {/* km driven (used) */}
        {car.isUsed && car.kmDriven && (
          <div className="flex items-center gap-1.5 rounded-lg bg-orange-50 border border-orange-100 px-2.5 py-1.5 text-xs text-orange-700 font-semibold">
            🛣 {(car.kmDriven / 1000).toFixed(0)}K km driven
          </div>
        )}

        {/* Tags */}
        <div className="flex flex-wrap gap-1">
          {(car.tags as string[]).filter((t) => t !== "Top Pick").slice(0, 3).map((t) => (
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
              "flex flex-1 items-center justify-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-bold transition-all duration-200",
              selected
                ? "border-emerald-400 bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700 hover:from-emerald-100 hover:to-teal-100"
                : isFull
                ? "cursor-not-allowed border-slate-200 bg-slate-50 text-slate-400"
                : "border-slate-200 text-slate-600 hover:border-blue-300 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-700"
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
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-3 py-2 text-xs font-bold text-white shadow-md shadow-blue-500/25 hover:from-blue-700 hover:to-indigo-700 hover:shadow-blue-500/45 hover:-translate-y-0.5 transition-all duration-200"
          >
            <Eye className="h-3 w-3" />
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}
