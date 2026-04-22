"use client";

import { GitCompare, Minus } from "lucide-react";
import { useCompare } from "@/context/CompareContext";
import { Car } from "@/lib/types";
import { cn } from "@/lib/utils";

export default function AddToCompareButton({ car }: { car: Car }) {
  const { addCar, removeCar, isSelected, isFull } = useCompare();
  const selected = isSelected(car.id);

  return (
    <button
      onClick={() => (selected ? removeCar(car.id) : addCar(car))}
      disabled={!selected && isFull}
      className={cn(
        "flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-bold transition-all",
        selected
          ? "border border-emerald-400 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
          : isFull
          ? "cursor-not-allowed border border-slate-200 bg-slate-50 text-slate-400"
          : "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-md shadow-emerald-500/30 hover:from-emerald-600 hover:to-emerald-700"
      )}
    >
      {selected ? (
        <><Minus className="h-4 w-4" /> Remove from Compare</>
      ) : (
        <><GitCompare className="h-4 w-4" /> Add to Compare</>
      )}
    </button>
  );
}
