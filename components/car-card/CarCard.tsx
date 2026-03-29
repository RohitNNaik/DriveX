"use client";

import Link from "next/link";
import { Plus, Minus, Star, Fuel, Zap } from "lucide-react";
import { Car } from "@/lib/types";
import { useCompare } from "@/context/CompareContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function formatPrice(price: number) {
  if (price >= 100000) return `₹${(price / 100000).toFixed(1)}L`;
  return `₹${(price / 1000).toFixed(0)}K`;
}

export default function CarCard({ car }: { car: Car }) {
  const { addCar, removeCar, isSelected, isFull } = useCompare();
  const selected = isSelected(car.id);

  return (
    <div
      className={cn(
        "group relative flex flex-col rounded-2xl border bg-white shadow-sm transition-all hover:shadow-md overflow-hidden",
        selected && "ring-2 ring-green-500"
      )}
    >
      {/* Image */}
      <div className="relative h-44 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center overflow-hidden">
        {car.isUsed && (
          <span className="absolute top-3 left-3 rounded-full bg-orange-500 px-2 py-0.5 text-xs font-bold text-white">
            Used
          </span>
        )}
        <span className="text-5xl">🚗</span>
      </div>

      {/* Info */}
      <div className="flex flex-col flex-1 p-4 gap-2">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-bold text-base leading-tight">{car.name}</h3>
            <p className="text-xs text-gray-500">{car.year} • {car.fuelType} • {car.transmission}</p>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
            <span className="text-xs font-semibold">{car.rating}</span>
          </div>
        </div>

        {/* Price */}
        <div className="text-xl font-extrabold text-blue-700">{formatPrice(car.price)}</div>

        {/* Specs row */}
        <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-500">
          {car.fuelType === "Electric" ? (
            <span className="flex items-center gap-1"><Zap className="h-3 w-3 text-green-500" />Battery EV</span>
          ) : (
            <span className="flex items-center gap-1"><Fuel className="h-3 w-3" />{car.mileage} kmpl</span>
          )}
          <span>💺 {car.seating}</span>
          <span>⚙️ {car.power} bhp</span>
          {car.isUsed && car.kmDriven && (
            <span>🛣 {(car.kmDriven / 1000).toFixed(0)}K km</span>
          )}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mt-1">
          {car.tags.map((t) => (
            <Badge key={t} variant="secondary" className="text-xs px-2 py-0">{t}</Badge>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-2">
          <Button
            size="sm"
            variant={selected ? "secondary" : "outline"}
            className={cn(
              "flex-1 text-xs",
              selected ? "border-green-400 text-green-700 bg-green-50" : ""
            )}
            onClick={() => (selected ? removeCar(car.id) : addCar(car))}
            disabled={!selected && isFull}
            title={!selected && isFull ? "Max 3 cars in compare" : ""}
          >
            {selected ? (
              <><Minus className="h-3 w-3 mr-1" />Remove</>
            ) : (
              <><Plus className="h-3 w-3 mr-1" />Compare</>
            )}
          </Button>
          <Button asChild size="sm" className="flex-1 text-xs bg-blue-600 hover:bg-blue-700">
            <Link href={`/cars/${car.id}`}>View Details</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

