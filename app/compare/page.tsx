"use client";

import Link from "next/link";
import { Check, X as XIcon } from "lucide-react";
import { useCompare } from "@/context/CompareContext";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

function formatPrice(price: number) {
  if (price >= 100000) return `₹${(price / 100000).toFixed(1)}L`;
  return `₹${(price / 1000).toFixed(0)}K`;
}

const SPEC_ROWS = [
  { label: "Price", fn: (c: { price: number }) => formatPrice(c.price) },
  { label: "Fuel Type", fn: (c: { fuelType: string }) => c.fuelType },
  { label: "Transmission", fn: (c: { transmission: string }) => c.transmission },
  { label: "Body Type", fn: (c: { bodyType: string }) => c.bodyType },
  { label: "Mileage", fn: (c: { fuelType: string; mileage: number }) => c.fuelType === "Electric" ? "EV" : `${c.mileage} kmpl` },
  { label: "Power", fn: (c: { power: number }) => `${c.power} bhp` },
  { label: "Torque", fn: (c: { torque: number }) => `${c.torque} Nm` },
  { label: "Engine CC", fn: (c: { fuelType: string; engineCC: number }) => c.fuelType === "Electric" ? "—" : `${c.engineCC} cc` },
  { label: "Seating", fn: (c: { seating: number }) => `${c.seating} seater` },
  { label: "Airbags", fn: (c: { airbags: number }) => c.airbags },
  { label: "Safety Rating", fn: (c: { rating: number }) => `${c.rating} / 5` },
] as const;

export default function ComparePage() {
  const { selected, removeCar, clearAll } = useCompare();

  if (selected.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center px-4">
        <p className="text-3xl">⚖️</p>
        <h2 className="text-2xl font-bold">No cars added to compare</h2>
        <p className="text-gray-500">Go to Browse cars and tap &quot;+ Compare&quot; on any car.</p>
        <Button asChild>
          <Link href="/cars">Browse Cars</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Compare Cars</h1>
          <p className="text-sm text-gray-500 mt-1">Side-by-side view of specs, pros & cons</p>
        </div>
        <button onClick={clearAll} className="text-sm text-gray-400 hover:text-red-500 underline">
          Clear all
        </button>
      </div>

      <div className="overflow-x-auto rounded-2xl border bg-white shadow-sm">
        <table className="w-full min-w-[600px] text-sm">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="py-4 px-4 text-left text-xs font-semibold text-gray-500 w-32">Spec</th>
              {selected.map((car) => (
                <th key={car.id} className="py-4 px-4 text-center">
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-2xl">🚗</span>
                    <span className="font-bold text-sm leading-tight">{car.name}</span>
                    <span className="text-xs text-gray-400">{car.year}</span>
                    <button
                      onClick={() => removeCar(car.id)}
                      className="mt-1 text-gray-300 hover:text-red-500"
                      aria-label={`Remove ${car.name}`}
                    >
                      <XIcon className="h-4 w-4" />
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {SPEC_ROWS.map((row, i) => (
              <tr key={row.label} className={i % 2 === 0 ? "bg-white" : "bg-gray-50/60"}>
                <td className="py-3 px-4 font-medium text-gray-500 text-xs">{row.label}</td>
                {selected.map((car) => {
                  const val = (row.fn as (c: typeof car) => string | number)(car);
                  return (
                    <td key={car.id} className="py-3 px-4 text-center font-semibold">
                      {val}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pros & Cons */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {selected.map((car) => (
          <div key={car.id} className="rounded-2xl border bg-white p-5 shadow-sm">
            <h3 className="font-bold text-base mb-3">🚗 {car.name}</h3>
            <Separator className="mb-3" />
            <p className="text-xs font-semibold text-green-600 mb-1">👍 Pros</p>
            <ul className="mb-3 space-y-1">
              {car.pros.map((p) => (
                <li key={p} className="flex items-start gap-2 text-sm text-gray-700">
                  <Check className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                  {p}
                </li>
              ))}
            </ul>
            <p className="text-xs font-semibold text-red-500 mb-1">👎 Cons</p>
            <ul className="space-y-1">
              {car.cons.map((c) => (
                <li key={c} className="flex items-start gap-2 text-sm text-gray-700">
                  <XIcon className="h-4 w-4 text-red-400 mt-0.5 shrink-0" />
                  {c}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

