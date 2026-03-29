"use client";

import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { FuelType, BodyType } from "@/lib/types";

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

export default function Filters({ filters, onChange }: FiltersProps) {
  return (
    <div className="bg-white rounded-2xl border p-4 sm:p-5 flex flex-col sm:flex-row flex-wrap gap-4 items-start sm:items-end shadow-sm">

      {/* Budget Slider */}
      <div className="flex flex-col gap-2 min-w-[160px] flex-1">
        <Label className="text-sm font-medium">
          Budget: <span className="text-blue-700 font-bold">{formatBudget(filters.maxBudget)}</span>
        </Label>
        <Slider
          min={300000}
          max={2500000}
          step={50000}
          value={[filters.maxBudget]}
          onValueChange={([val]) => onChange({ ...filters, maxBudget: val })}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-gray-400">
          <span>₹3L</span>
          <span>₹25L+</span>
        </div>
      </div>

      {/* Fuel Type */}
      <div className="flex flex-col gap-2 min-w-[130px]">
        <Label className="text-sm font-medium">Fuel Type</Label>
        <Select
          value={filters.fuelType}
          onValueChange={(v) => onChange({ ...filters, fuelType: v as FuelType | "All" })}
        >
          <SelectTrigger className="h-9 text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Fuels</SelectItem>
            <SelectItem value="Petrol">Petrol</SelectItem>
            <SelectItem value="Diesel">Diesel</SelectItem>
            <SelectItem value="Electric">Electric</SelectItem>
            <SelectItem value="Hybrid">Hybrid</SelectItem>
            <SelectItem value="CNG">CNG</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Body Type */}
      <div className="flex flex-col gap-2 min-w-[130px]">
        <Label className="text-sm font-medium">Body Type</Label>
        <Select
          value={filters.bodyType}
          onValueChange={(v) => onChange({ ...filters, bodyType: v as BodyType | "All" })}
        >
          <SelectTrigger className="h-9 text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Types</SelectItem>
            <SelectItem value="SUV">SUV</SelectItem>
            <SelectItem value="Sedan">Sedan</SelectItem>
            <SelectItem value="Hatchback">Hatchback</SelectItem>
            <SelectItem value="MPV">MPV</SelectItem>
            <SelectItem value="Coupe">Coupe</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* City Usage Toggle */}
      <div className="flex flex-col gap-2">
        <Label className="text-sm font-medium">Usage</Label>
        <Button
          size="sm"
          variant={filters.cityUsage ? "default" : "outline"}
          onClick={() => onChange({ ...filters, cityUsage: !filters.cityUsage })}
          className="h-9"
        >
          {filters.cityUsage ? "🏙 City Cars" : "All"}
        </Button>
      </div>
    </div>
  );
}

