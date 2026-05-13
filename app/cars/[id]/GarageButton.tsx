"use client";

import { Heart } from "lucide-react";
import { Car } from "@/lib/types";
import { useGarage } from "@/context/GarageContext";
import { cn } from "@/lib/utils";

export default function GarageButton({ car }: { car: Car }) {
  const { addToGarage, removeFromGarage, isInGarage } = useGarage();
  const saved = isInGarage(car.id);

  return (
    <button
      onClick={() => saved ? removeFromGarage(car.id) : addToGarage(car)}
      className={cn(
        "flex items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-sm font-bold transition-all",
        saved
          ? "border-rose-300 bg-rose-50 text-rose-600 hover:bg-rose-100"
          : "border-slate-200 text-slate-700 hover:border-rose-300 hover:text-rose-600 hover:bg-rose-50"
      )}
    >
      <Heart className={cn("h-4 w-4", saved && "fill-rose-500 text-rose-500")} />
      {saved ? "Saved to Garage" : "Save to Garage"}
    </button>
  );
}
