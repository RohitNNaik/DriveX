"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Check, X as XIcon, Trophy, Loader2, RefreshCw, Sparkles, ArrowRight } from "lucide-react";
import { useCompare } from "@/context/CompareContext";
import ShareCompareButton from "@/components/share-compare/ShareCompareButton";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Car, VariantSummary } from "@/lib/types";
import { CAR_VARIANTS } from "@/lib/data";
import { slugifyModel } from "@/lib/variant-compare";

// ─── helpers ────────────────────────────────────────────────────────────────

function formatPrice(price: number) {
  if (price >= 10000000) return `₹${(price / 10000000).toFixed(1)}Cr`;
  if (price >= 100000) return `₹${(price / 100000).toFixed(1)}L`;
  return `₹${(price / 1000).toFixed(0)}K`;
}

type CompareMode = "different-cars" | "same-model-variants";

interface ModelGroup {
  brand: string;
  model: string;
  variantCount: number;
}

interface CompareResult {
  mode: "different-cars" | "same-model-variants";
  winner: string;
  insights: string[];
  table: Array<{ label: string; values: (string | number)[]; winner?: number }>;
  cars: Array<{
    name?: string;
    variant?: string;
    brand?: string;
    price: number;
    fuelType?: string;
    transmission?: string;
  }>;
}

// ─── Static spec row definitions ─────────────────────────────────────────────

const STATIC_SPEC_ROWS: Array<{
  label: string;
  field: keyof Car;
  fmt: (v: unknown) => string | number;
  higherIsBetter: boolean;
}> = [
  { label: "Price (₹)", field: "price", fmt: (v) => `₹${Number(v).toLocaleString("en-IN")}`, higherIsBetter: false },
  { label: "Mileage (kmpl)", field: "mileage", fmt: (v) => Number(v) === 0 ? "Electric" : `${v} kmpl`, higherIsBetter: true },
  { label: "Power (bhp)", field: "power", fmt: (v) => `${v} bhp`, higherIsBetter: true },
  { label: "Torque (Nm)", field: "torque", fmt: (v) => `${v} Nm`, higherIsBetter: true },
  { label: "Engine (cc)", field: "engineCC", fmt: (v) => Number(v) === 0 ? "Electric Motor" : `${v} cc`, higherIsBetter: true },
  { label: "Airbags", field: "airbags", fmt: (v) => `${v}`, higherIsBetter: true },
  { label: "Rating", field: "rating", fmt: (v) => `${v}/5`, higherIsBetter: true },
  { label: "Fuel Type", field: "fuelType", fmt: (v) => String(v), higherIsBetter: false },
  { label: "Transmission", field: "transmission", fmt: (v) => String(v), higherIsBetter: false },
];

// ─── Utility: build static variant result ────────────────────────────────────

function buildStaticVariantResult(ids: string[]): CompareResult | null {
  const cars = ids.map((id) => CAR_VARIANTS.find((c) => c.id === id)).filter(Boolean) as Car[];
  if (cars.length < 2) return null;

  const table = STATIC_SPEC_ROWS.map((row) => {
    const rawVals = cars.map((c) => c[row.field]);
    const fmtVals = rawVals.map((v) => row.fmt(v));
    const nums = rawVals.map((v) => (typeof v === "number" ? v : NaN));
    let winner: number | undefined;
    if (!nums.some(isNaN) && !nums.every((n) => n === nums[0])) {
      const target = row.higherIsBetter ? Math.max(...nums) : Math.min(...nums);
      winner = nums.indexOf(target);
    }
    return { label: row.label, values: fmtVals, winner };
  });

  const scores = new Array<number>(cars.length).fill(0);
  for (const row of STATIC_SPEC_ROWS) {
    if (!row.higherIsBetter && row.field !== "price") continue;
    const vals = cars.map((c) => c[row.field] as number);
    if (vals.some((v) => typeof v !== "number")) continue;
    const target = row.higherIsBetter ? Math.max(...vals) : Math.min(...vals);
    const wi = vals.indexOf(target);
    if (!vals.every((v) => v === vals[0])) scores[wi]++;
  }
  const winnerIdx = scores.indexOf(Math.max(...scores));
  const winnerCar = cars[winnerIdx];
  const winnerLabel = winnerCar.variant ?? winnerCar.name;
  const cheapest = cars.reduce((a, b) => (a.price < b.price ? a : b));
  const priceDiff = Math.max(...cars.map((c) => c.price)) - Math.min(...cars.map((c) => c.price));

  return {
    mode: "same-model-variants",
    winner: winnerLabel,
    insights: [
      `${cheapest.variant ?? cheapest.name} is the most affordable variant`,
      `Price gap across variants: ₹${priceDiff.toLocaleString("en-IN")}`,
    ],
    table,
    cars: cars.map((c) => ({
      name: c.name,
      variant: c.variant ?? c.name,
      brand: c.brand,
      price: c.price,
      fuelType: c.fuelType,
      transmission: c.transmission,
    })),
  };
}

// ─── Shared: insight banner ───────────────────────────────────────────────────

function InsightBanner({ winner, insights }: { winner: string; insights: string[] }) {
  return (
    <div className="rounded-2xl border border-yellow-200 bg-yellow-50 p-4 flex gap-3">
      <Trophy className="h-5 w-5 text-yellow-500 mt-0.5 shrink-0" />
      <div>
        <p className="font-bold text-yellow-800 text-sm">Overall Winner: {winner}</p>
        <ul className="mt-1 space-y-0.5">
          {insights.map((s) => (
            <li key={s} className="text-xs text-yellow-700">• {s}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// ─── Shared: comparison table ─────────────────────────────────────────────────

function CompareTable({
  result,
  onRemove,
}: {
  result: CompareResult;
  onRemove?: (idx: number) => void;
}) {
  const colCount = result.cars.length;

  return (
    <div className="overflow-x-auto rounded-2xl border bg-white shadow-sm">
      <table className="w-full text-sm" style={{ minWidth: `${colCount * 160 + 130}px` }}>
        <thead>
          <tr className="border-b bg-gray-50">
            <th className="py-4 px-4 text-left text-xs font-semibold text-gray-500 w-32">Spec</th>
            {result.cars.map((car, idx) => {
              const label =
                result.mode === "same-model-variants"
                  ? (car.variant ?? car.name ?? "—")
                  : (car.name ?? "—");
              const isWinner =
                label === result.winner || car.variant === result.winner || car.name === result.winner;
              return (
                <th key={idx} className="py-4 px-4 text-center">
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-2xl">
                      {result.mode === "same-model-variants" ? "🔄" : "🚗"}
                    </span>
                    <span
                      className={cn(
                        "font-bold text-sm leading-tight text-center",
                        isWinner && "text-yellow-600"
                      )}
                    >
                      {label}
                    </span>
                    {result.mode === "same-model-variants" && car.fuelType && (
                      <Badge variant="secondary" className="text-[10px] px-1.5">
                        {car.fuelType} · {car.transmission}
                      </Badge>
                    )}
                    <span className="text-sm font-bold text-blue-700">
                      {formatPrice(car.price)}
                    </span>
                    {isWinner && (
                      <span className="flex items-center gap-1 text-[10px] font-semibold text-yellow-600 bg-yellow-100 rounded-full px-2 py-0.5">
                        <Trophy className="h-3 w-3" /> Best Value
                      </span>
                    )}
                    {onRemove && (
                      <button
                        onClick={() => onRemove(idx)}
                        className="mt-1 text-gray-300 hover:text-red-500"
                        aria-label="Remove"
                      >
                        <XIcon className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {result.table.map((row, i) => (
            <tr key={row.label} className={i % 2 === 0 ? "bg-white" : "bg-gray-50/60"}>
              <td className="py-3 px-4 font-medium text-gray-500 text-xs">{row.label}</td>
              {row.values.map((val, j) => (
                <td
                  key={j}
                  className={cn(
                    "py-3 px-4 text-center font-semibold text-sm",
                    row.winner === j && "text-green-700 bg-green-50"
                  )}
                >
                  {row.winner === j ? (
                    <span className="inline-flex items-center gap-1">
                      <Check className="h-3.5 w-3.5 text-green-500" />
                      {val}
                    </span>
                  ) : (
                    val
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Variant Compare ──────────────────────────────────────────────────────────

function VariantProsCons({
  pickedIds,
  availableVariants,
}: {
  pickedIds: string[];
  availableVariants: VariantSummary[];
}) {
  const pickedVariants = pickedIds
    .map((id) => availableVariants.find((v) => v.id === id))
    .filter(Boolean) as VariantSummary[];

  const matchedCars = pickedVariants.map((v) =>
    CAR_VARIANTS.find(
      (c) =>
        (c.variant ?? c.name) === v.variant &&
        c.brand.toLowerCase() === v.brand.toLowerCase()
    )
  );

  if (matchedCars.every((c) => !c)) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
      {matchedCars.map((car, idx) => {
        if (!car) return null;
        return (
          <div key={idx} className="rounded-2xl border bg-white p-4 shadow-sm">
            <h3 className="font-bold text-sm mb-2 text-blue-700">{car.variant ?? car.name}</h3>
            <Separator className="mb-2" />
            <p className="text-[11px] font-semibold text-green-600 mb-1">👍 Pros</p>
            <ul className="mb-2 space-y-0.5">
              {car.pros.map((p) => (
                <li key={p} className="flex items-start gap-1.5 text-xs text-gray-700">
                  <Check className="h-3.5 w-3.5 text-green-500 mt-0.5 shrink-0" />
                  {p}
                </li>
              ))}
            </ul>
            <p className="text-[11px] font-semibold text-red-500 mb-1">👎 Cons</p>
            <ul className="space-y-0.5">
              {car.cons.map((c) => (
                <li key={c} className="flex items-start gap-1.5 text-xs text-gray-700">
                  <XIcon className="h-3.5 w-3.5 text-red-400 mt-0.5 shrink-0" />
                  {c}
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}

function getStaticVariants(brand: string, model: string): VariantSummary[] {
  return CAR_VARIANTS.filter(
    (c) =>
      c.brand.toLowerCase() === brand.toLowerCase() &&
      c.model.toLowerCase() === model.toLowerCase()
  ).map((c) => ({
    id: c.id,
    brand: c.brand,
    model: c.model,
    variant: c.variant ?? c.name,
    fuelType: c.fuelType,
    transmission: c.transmission,
    price: c.price,
  }));
}

function VariantComparePicker() {
  const [modelGroups, setModelGroups] = useState<ModelGroup[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<ModelGroup | null>(null);
  const [availableVariants, setAvailableVariants] = useState<VariantSummary[]>([]);
  const [pickedIds, setPickedIds] = useState<string[]>([]);
  const [result, setResult] = useState<CompareResult | null>(null);
  const [loadingModels, setLoadingModels] = useState(true);
  const [loadingVariants, setLoadingVariants] = useState(false);
  const [comparing, setComparing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      setLoadingModels(true);
      try {
        const res = await fetch("/api/cars/variant-models");
        const json = await res.json();
        if (json.success) {
          setModelGroups(json.data);
        } else {
          throw new Error("No data");
        }
      } catch {
        const map = new Map<string, number>();
        for (const car of CAR_VARIANTS) {
          const key = `${car.brand}::${car.model}`;
          map.set(key, (map.get(key) ?? 0) + 1);
        }
        setModelGroups(
          Array.from(map.entries())
            .filter(([, count]) => count >= 2)
            .map(([key, count]) => {
              const [brand, model] = key.split("::");
              return { brand, model, variantCount: count };
            })
        );
      } finally {
        setLoadingModels(false);
      }
    }
    load();
  }, []);

  useEffect(() => {
    if (!selectedGroup) return;
    async function load() {
      if (!selectedGroup) return;
      setLoadingVariants(true);
      setPickedIds([]);
      setResult(null);
      try {
        const res = await fetch(
          `/api/cars/variants?brand=${encodeURIComponent(selectedGroup.brand)}&model=${encodeURIComponent(selectedGroup.model)}`
        );
        const json = await res.json();
        if (json.success && json.data.length >= 2) {
          setAvailableVariants(
            json.data.map((c: Car & { _id?: string }) => ({
              id: String(c._id ?? c.id),
              brand: c.brand,
              model: c.model,
              variant: c.variant ?? c.name,
              fuelType: c.fuelType,
              transmission: c.transmission,
              price: c.price,
            }))
          );
        } else {
          setAvailableVariants(getStaticVariants(selectedGroup.brand, selectedGroup.model));
        }
      } catch {
        setAvailableVariants(getStaticVariants(selectedGroup.brand, selectedGroup.model));
      } finally {
        setLoadingVariants(false);
      }
    }
    load();
  }, [selectedGroup]);

  const toggleVariant = (id: string) => {
    setPickedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : prev.length < 4 ? [...prev, id] : prev
    );
  };

  const runCompare = useCallback(async () => {
    if (pickedIds.length < 2) return;
    setComparing(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch("/api/bff/compare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: "same-model-variants", variantIds: pickedIds }),
      });
      const json = await res.json();
      if (json.success) {
        setResult(json.data);
      } else {
        const fallback = buildStaticVariantResult(pickedIds);
        if (fallback) setResult(fallback);
        else setError(json.error ?? "Comparison failed");
      }
    } catch {
      const fallback = buildStaticVariantResult(pickedIds);
      if (fallback) setResult(fallback);
      else setError("Network error. Please try again.");
    } finally {
      setComparing(false);
    }
  }, [pickedIds]);

  return (
    <div className="space-y-6">
      {/* Step 1 – model selector */}
      <div>
        <p className="text-sm font-semibold text-gray-700 mb-2">1. Choose a car model</p>
        {loadingModels ? (
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading models…
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {modelGroups.map((g) => (
              <button
                key={`${g.brand}-${g.model}`}
                onClick={() => setSelectedGroup(g)}
                className={cn(
                  "rounded-full border px-4 py-1.5 text-sm font-medium transition-all",
                  selectedGroup?.model === g.model
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white hover:border-blue-400 hover:text-blue-600"
                )}
              >
                {g.brand} {g.model}
                <span className="ml-1.5 text-xs opacity-60">{g.variantCount} variants</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Smart Insights CTA — shown as soon as a model is chosen */}
      {selectedGroup && (
        <Link
          href={`/model/${slugifyModel(selectedGroup.brand, selectedGroup.model)}/compare`}
          className="group flex items-center justify-between gap-4 rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600 px-5 py-4 text-white shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/20">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="text-xs font-bold text-blue-200 uppercase tracking-wide">Smart Features</p>
              <p className="text-sm font-black">
                Deep Compare: {selectedGroup.brand} {selectedGroup.model}
              </p>
              <p className="text-xs text-blue-200 mt-0.5">
                Radar chart · Decision Score · 5-yr Cost · Break-even · Trim Advisor
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1 text-sm font-bold shrink-0 group-hover:gap-2 transition-all">
            Open <ArrowRight className="h-4 w-4" />
          </div>
        </Link>
      )}

      {/* Step 2 – variant picker */}
      {selectedGroup && (
        <div>
          <p className="text-sm font-semibold text-gray-700 mb-2">
            2. Pick 2–4 {selectedGroup.model} variants to compare
          </p>
          {loadingVariants ? (
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Loader2 className="h-4 w-4 animate-spin" /> Loading variants…
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {availableVariants.map((v) => {
                const checked = pickedIds.includes(v.id);
                const disabled = !checked && pickedIds.length >= 4;
                return (
                  <button
                    key={v.id}
                    disabled={disabled}
                    onClick={() => toggleVariant(v.id)}
                    className={cn(
                      "flex items-start gap-3 rounded-xl border p-3 text-left transition-all",
                      checked ? "border-green-500 bg-green-50" : "bg-white hover:border-blue-300",
                      disabled && "opacity-40 cursor-not-allowed"
                    )}
                  >
                    <div
                      className={cn(
                        "mt-0.5 h-4 w-4 rounded border flex items-center justify-center shrink-0",
                        checked ? "bg-green-500 border-green-500" : "border-gray-300"
                      )}
                    >
                      {checked && <Check className="h-3 w-3 text-white" />}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-sm leading-tight">{v.variant}</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {v.fuelType} · {v.transmission}
                      </p>
                      <p className="text-sm font-bold text-blue-700 mt-1">
                        {formatPrice(v.price)}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Step 3 – compare button */}
      {pickedIds.length >= 2 && (
        <div className="flex items-center gap-3">
          <Button onClick={runCompare} disabled={comparing} className="gap-2">
            {comparing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            Compare {pickedIds.length} Variants
          </Button>
          <span className="text-xs text-gray-400">{pickedIds.length} selected (max 4)</span>
        </div>
      )}

      {error && <p className="text-sm text-red-500">{error}</p>}

      {/* Results */}
      {result && (
        <div className="space-y-5">
          <InsightBanner winner={result.winner} insights={result.insights} />
          <CompareTable result={result} />
          <VariantProsCons
            pickedIds={pickedIds}
            availableVariants={availableVariants}
          />
        </div>
      )}
    </div>
  );
}

// ─── Different Cars Section ────────────────────────────────────────────────────

function DifferentCarsCompare() {
  const { selected, removeCar, clearAll } = useCompare();
  const [result, setResult] = useState<CompareResult | null>(null);
  const [enhancing, setEnhancing] = useState(false);

  // Build static result whenever selected cars change
  useEffect(() => {
    if (selected.length < 2) {
      setResult(null);
      return;
    }

    const table = STATIC_SPEC_ROWS.map((row) => {
      const rawVals = selected.map((c) => c[row.field as keyof Car]);
      const fmtVals = rawVals.map((v) => row.fmt(v));
      const nums = rawVals.map((v) => (typeof v === "number" ? v : NaN));
      let winner: number | undefined;
      if (!nums.some(isNaN) && !nums.every((n) => n === nums[0])) {
        const target = row.higherIsBetter ? Math.max(...nums) : Math.min(...nums);
        winner = nums.indexOf(target);
      }
      return { label: row.label, values: fmtVals, winner };
    });

    const scores = new Array<number>(selected.length).fill(0);
    for (const row of STATIC_SPEC_ROWS) {
      if (!row.higherIsBetter && row.field !== "price") continue;
      const vals = selected.map((c) => c[row.field as keyof Car] as number);
      if (vals.some((v) => typeof v !== "number")) continue;
      const target = row.higherIsBetter ? Math.max(...vals) : Math.min(...vals);
      const wi = vals.indexOf(target);
      if (!vals.every((v) => v === vals[0])) scores[wi]++;
    }
    const winnerIdx = scores.indexOf(Math.max(...scores));
    const winnerCar = selected[winnerIdx];

    const topMileage = selected.filter((c) => c.mileage > 0).reduce((a, b) => (a.mileage > b.mileage ? a : b), selected[0]);
    const topPower = selected.reduce((a, b) => (a.power > b.power ? a : b));
    const topRating = selected.reduce((a, b) => (a.rating > b.rating ? a : b));

    setResult({
      mode: "different-cars",
      winner: winnerCar.name,
      insights: [
        `${selected.reduce((a, b) => (a.price < b.price ? a : b)).name} is the most affordable`,
        `${topMileage.name} offers the best mileage at ${topMileage.mileage} kmpl`,
        `${topPower.name} is the most powerful at ${topPower.power} bhp`,
        `${topRating.name} has the highest safety rating (${topRating.rating}/5)`,
      ],
      table,
      cars: selected.map((c) => ({
        name: c.name,
        price: c.price,
        fuelType: c.fuelType,
        transmission: c.transmission,
        brand: c.brand,
      })),
    });
  }, [selected]);

  const enhanceViaApi = useCallback(async () => {
    if (selected.length < 2) return;
    setEnhancing(true);
    try {
      const res = await fetch("/api/bff/compare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "different-cars",
          carIds: selected.map((c) => (c as Car & { _id?: string })._id ?? c.id),
        }),
      });
      const json = await res.json();
      if (json.success) setResult(json.data);
    } catch {
      // keep static result
    } finally {
      setEnhancing(false);
    }
  }, [selected]);

  if (selected.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400">
        <p className="text-lg">No cars added yet.</p>
        <p className="text-sm mt-1">
          Go to{" "}
          <Link href="/cars" className="text-blue-600 underline">
            Browse Cars
          </Link>{" "}
          and tap <strong>+ Compare</strong> on any car.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <p className="text-sm text-gray-500">
          {selected.length} car{selected.length > 1 ? "s" : ""} selected (max 3)
        </p>
        <div className="flex gap-2 items-center flex-wrap">
          {selected.length >= 2 && <ShareCompareButton cars={selected} />}
          <Button
            size="sm"
            variant="outline"
            onClick={enhanceViaApi}
            disabled={enhancing || selected.length < 2}
          >
            {enhancing ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" />
            ) : (
              <RefreshCw className="h-3.5 w-3.5 mr-1" />
            )}
            Refresh Analysis
          </Button>
          <button
            onClick={clearAll}
            className="text-xs text-gray-400 hover:text-red-500 underline"
          >
            Clear all
          </button>
        </div>
      </div>

      {result && <InsightBanner winner={result.winner} insights={result.insights} />}

      {result && (
        <CompareTable
          result={result}
          onRemove={(idx) => removeCar(selected[idx].id)}
        />
      )}

      {/* Pros & Cons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
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

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function ComparePage() {
  const [mode, setMode] = useState<CompareMode>("different-cars");
  const { selected, addCar } = useCompare();
  const searchParams = useSearchParams();

  // Hydrate compare list from shared URL (?cars=id1,id2,id3)
  useEffect(() => {
    const param = searchParams.get("cars");
    if (!param || selected.length > 0) return;
    const ids = param.split(",").map((s) => s.trim()).filter(Boolean).slice(0, 3);
    if (ids.length < 2) return;
    async function hydrate() {
      for (const id of ids) {
        try {
          const res = await fetch(`/api/cars/${id}`);
          const json = await res.json();
          if (json.success && json.data) { addCar(json.data); continue; }
        } catch {}
        const { CARS, CAR_VARIANTS } = await import("@/lib/data");
        const found = [...CARS, ...CAR_VARIANTS].find((c) => c.id === id);
        if (found) addCar(found);
      }
    }
    hydrate();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const tabs: { id: CompareMode; label: string; badge?: string }[] = [
    {
      id: "different-cars",
      label: "Compare Different Cars",
      badge: selected.length > 0 ? String(selected.length) : undefined,
    },
    { id: "same-model-variants", label: "Compare Variants of Same Model" },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold">Compare Cars</h1>
        <p className="text-sm text-gray-500 mt-1">
          Compare different cars side-by-side, or compare trims of the same model.
        </p>
      </div>

      {/* Mode toggle */}
      <div className="flex gap-1 rounded-xl bg-gray-100 p-1 mb-8 w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setMode(tab.id)}
            className={cn(
              "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all",
              mode === tab.id
                ? "bg-white shadow text-blue-700"
                : "text-gray-500 hover:text-gray-700"
            )}
          >
            {tab.label}
            {tab.badge && (
              <span className="rounded-full bg-blue-600 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center">
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      {mode === "different-cars" ? <DifferentCarsCompare /> : <VariantComparePicker />}
    </div>
  );
}

