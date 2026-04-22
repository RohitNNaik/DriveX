"use client";

import { useGarage } from "@/context/GarageContext";
import { useCompare } from "@/context/CompareContext";
import Link from "next/link";
import {
  Heart, Trash2, GitCompare, Car as CarIcon, ArrowRight,
  Star, Fuel, Zap, Gauge, BookmarkX, Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Car } from "@/lib/types";

function formatPrice(p: number) {
  return p >= 100000 ? `₹${(p / 100000).toFixed(1)}L` : `₹${(p / 1000).toFixed(0)}K`;
}

const BODY_GRADIENTS: Record<string, string> = {
  SUV:       "from-blue-500 via-blue-600 to-indigo-700",
  Sedan:     "from-slate-500 via-slate-600 to-slate-800",
  Hatchback: "from-orange-400 via-orange-500 to-amber-600",
  MPV:       "from-teal-500 via-teal-600 to-cyan-700",
  Coupe:     "from-rose-500 via-rose-600 to-pink-700",
  Electric:  "from-violet-500 via-purple-600 to-indigo-700",
};

function GarageCarCard({ car }: { car: Car }) {
  const { removeFromGarage } = useGarage();
  const { addCar, removeCar, isSelected, isFull } = useCompare();
  const selected  = isSelected(car.id);
  const gradient  = BODY_GRADIENTS[car.bodyType] ?? "from-slate-500 to-slate-700";

  return (
    <div className="group relative flex flex-col rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/80 transition-all duration-300 shine-on-hover">

      {/* Remove from garage */}
      <button
        onClick={() => removeFromGarage(car.id)}
        className="absolute top-3 right-3 z-20 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-rose-400 hover:bg-rose-50 hover:text-rose-600 shadow-md transition-all opacity-0 group-hover:opacity-100"
        title="Remove from garage"
      >
        <BookmarkX className="h-3.5 w-3.5" />
      </button>

      {/* Image */}
      <div className={`relative h-36 bg-gradient-to-br ${gradient} flex items-center justify-center overflow-hidden`}>
        <div className="absolute -top-6 -right-6 h-24 w-24 rounded-full bg-white/10" />
        <div className="absolute -bottom-4 -left-4 h-16 w-16 rounded-full bg-white/10" />
        <span className="relative z-10 text-5xl drop-shadow-lg group-hover:scale-110 transition-transform duration-300">
          {car.fuelType === "Electric" ? "⚡🚗" : "🚗"}
        </span>
        <div className="absolute top-3 left-3 flex items-center gap-1 rounded-full bg-white/95 px-2 py-0.5 shadow-md">
          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
          <span className="text-xs font-black text-slate-800">{car.rating}</span>
        </div>
        <div className="absolute bottom-3 left-3">
          <span className="rounded-full bg-black/30 backdrop-blur-sm px-2.5 py-0.5 text-xs font-semibold text-white">
            {car.bodyType}
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="flex flex-col flex-1 p-4 gap-2">
        <div>
          <p className="text-xs text-slate-500">{car.brand} · {car.year}</p>
          <h3 className="font-black text-slate-900 leading-tight group-hover:text-blue-700 transition-colors">{car.name}</h3>
        </div>

        <div className="flex items-baseline gap-1">
          <span className="text-xl font-black text-blue-700">{formatPrice(car.price)}</span>
          <span className="text-xs text-slate-400">ex-showroom</span>
        </div>

        <div className="flex gap-1.5 text-xs">
          <span className="flex items-center gap-1 rounded-lg bg-slate-50 border border-slate-100 px-2 py-1 font-semibold text-slate-600">
            {car.fuelType === "Electric" ? <Zap className="h-3 w-3 text-violet-500" /> : <Fuel className="h-3 w-3 text-green-500" />}
            {car.fuelType === "Electric" ? "EV" : `${car.mileage} kmpl`}
          </span>
          <span className="flex items-center gap-1 rounded-lg bg-slate-50 border border-slate-100 px-2 py-1 font-semibold text-slate-600">
            <Gauge className="h-3 w-3 text-orange-500" />
            {car.power} bhp
          </span>
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-auto pt-1">
          <button
            onClick={() => selected ? removeCar(car.id) : addCar(car)}
            disabled={!selected && isFull}
            className={cn(
              "flex flex-1 items-center justify-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-bold transition-all",
              selected
                ? "border-emerald-400 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                : isFull
                ? "cursor-not-allowed border-slate-200 bg-slate-50 text-slate-400"
                : "border-slate-200 text-slate-600 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
            )}
          >
            <GitCompare className="h-3 w-3" />
            {selected ? "Added" : "Compare"}
          </button>
          <Link
            href={`/cars/${car.id}`}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-3 py-2 text-xs font-bold text-white shadow-sm hover:from-blue-700 hover:to-indigo-700 transition-all"
          >
            View
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function GaragePage() {
  const { saved, clearGarage } = useGarage();
  const { selected } = useCompare();

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Hero */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/20 border border-rose-500/30 px-3 py-1 text-xs font-bold text-rose-300">
                  <Heart className="h-3 w-3 fill-rose-400" /> My Garage
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-white">
                Your Saved Cars
              </h1>
              <p className="text-slate-400 mt-1.5 text-sm">
                {saved.length === 0
                  ? "You haven't saved any cars yet."
                  : `${saved.length} car${saved.length > 1 ? "s" : ""} saved · Tap heart on any car to save`}
              </p>
            </div>
            <div className="text-5xl hidden sm:block">🏎️</div>
          </div>

          {saved.length > 0 && (
            <div className="flex items-center gap-3 mt-6 flex-wrap">
              {selected.length > 0 && (
                <Link
                  href="/compare"
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-2 text-sm font-bold text-white shadow-md shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-all"
                >
                  <GitCompare className="h-4 w-4" />
                  Compare {selected.length} selected
                </Link>
              )}
              <button
                onClick={clearGarage}
                className="flex items-center gap-2 rounded-xl border border-slate-600 bg-white/10 px-4 py-2 text-sm font-semibold text-slate-300 hover:bg-white/20 hover:text-white transition-all"
              >
                <Trash2 className="h-4 w-4" />
                Clear all
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
        {saved.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-5">
            <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-rose-100 to-pink-100 border border-rose-200">
              <Heart className="h-10 w-10 text-rose-400" />
            </div>
            <div className="text-center">
              <h2 className="text-xl font-black text-slate-900">Your garage is empty</h2>
              <p className="text-slate-500 mt-1 text-sm max-w-sm">
                Tap the heart icon on any car card or detail page to save it here for later.
              </p>
            </div>
            <div className="flex gap-3">
              <Link
                href="/cars"
                className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-md shadow-blue-500/30 hover:shadow-blue-500/50 transition-all"
              >
                <CarIcon className="h-4 w-4" />
                Browse Cars
              </Link>
              <Link
                href="/ai-advisor"
                className="flex items-center gap-2 rounded-2xl border border-slate-200 px-6 py-3 text-sm font-bold text-slate-700 hover:border-blue-300 hover:text-blue-600 transition-all"
              >
                <Sparkles className="h-4 w-4" />
                Ask AI
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {saved.map((car) => (
              <GarageCarCard key={car.id} car={car} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
