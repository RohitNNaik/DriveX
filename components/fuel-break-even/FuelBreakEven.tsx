"use client";

import { useState, useMemo } from "react";
import { ComparableVariant } from "@/lib/variant-compare";
import { cn } from "@/lib/utils";
import { Fuel, Zap, Clock, TrendingDown } from "lucide-react";

interface FuelVariant {
  variant: ComparableVariant;
  label: string;
  fuelCostPerKm: number;
  color: string;
  bg: string;
  icon: React.ComponentType<{ className?: string }>;
}

const FUEL_PRICE_DEFAULTS: Record<string, number> = {
  Petrol:   104,
  Diesel:    92,
  Electric:   2, // ₹2/km approx home charging
  Hybrid:    80,
  CNG:       80,
};

function fuelCostPerKm(variant: ComparableVariant, customPrices: Record<string, number>): number {
  if (variant.fuelType === "Electric") {
    return customPrices["Electric"] ?? 2;
  }
  const price = customPrices[variant.fuelType] ?? FUEL_PRICE_DEFAULTS[variant.fuelType] ?? 100;
  const kmpl  = variant.mileage || 15;
  return price / kmpl;
}

interface Props {
  variants: ComparableVariant[];
}

export default function FuelBreakEven({ variants }: Props) {
  const [monthlyKm,       setMonthlyKm]    = useState(1200);
  const [petrolPrice,     setPetrolPrice]  = useState(104);
  const [dieselPrice,     setDieselPrice]  = useState(92);
  const [evCostPerKm,     setEvCostPerKm]  = useState(2);

  const customPrices = useMemo(() => ({
    Petrol:   petrolPrice,
    Diesel:   dieselPrice,
    Electric: evCostPerKm,
    Hybrid:   dieselPrice - 5,
    CNG:      50,
  }), [petrolPrice, dieselPrice, evCostPerKm]);

  // Only show variants that differ in fuel type or mileage meaningfully
  const fuelVariants: FuelVariant[] = variants.map((v, idx) => {
    const colorSets = [
      { color: "text-blue-600",   bg: "bg-blue-50",   border: "#3b82f6" },
      { color: "text-orange-600", bg: "bg-orange-50", border: "#f97316" },
      { color: "text-green-600",  bg: "bg-green-50",  border: "#10b981" },
      { color: "text-violet-600", bg: "bg-violet-50", border: "#8b5cf6" },
    ];
    const cs = colorSets[idx % colorSets.length];
    return {
      variant: v,
      label: v.variant,
      fuelCostPerKm: fuelCostPerKm(v, customPrices),
      color: cs.color,
      bg: cs.bg,
      icon: v.fuelType === "Electric" ? Zap : Fuel,
    };
  });

  // Sort cheapest to run first
  const sorted = [...fuelVariants].sort((a, b) => a.fuelCostPerKm - b.fuelCostPerKm);
  const cheapestRunner = sorted[0];

  // Break-even: For each pair, months until cheaper-to-run variant recoups price premium
  const pairs = useMemo(() => {
    const result: Array<{
      expensive: FuelVariant;
      cheap: FuelVariant;
      priceDiff: number;
      monthlySaving: number;
      breakEvenMonths: number | null;
      breakEvenKm: number | null;
    }> = [];

    for (let i = 0; i < fuelVariants.length; i++) {
      for (let j = i + 1; j < fuelVariants.length; j++) {
        const a = fuelVariants[i];
        const b = fuelVariants[j];

        const expensiveVariant  = a.variant.price >= b.variant.price ? a : b;
        const cheaperVariant    = a.variant.price >= b.variant.price ? b : a;
        const priceDiff         = expensiveVariant.variant.price - cheaperVariant.variant.price;

        const expRunCost = expensiveVariant.fuelCostPerKm * monthlyKm;
        const chpRunCost = cheaperVariant.fuelCostPerKm * monthlyKm;
        const monthlySaving = expRunCost - chpRunCost;

        if (priceDiff <= 0) continue; // same price, no break-even needed

        const breakEvenMonths =
          monthlySaving > 0 ? Math.ceil(priceDiff / monthlySaving) : null;
        const breakEvenKm =
          breakEvenMonths !== null ? breakEvenMonths * monthlyKm : null;

        result.push({
          expensive: expensiveVariant,
          cheap: cheaperVariant,
          priceDiff,
          monthlySaving,
          breakEvenMonths,
          breakEvenKm,
        });
      }
    }

    return result;
  }, [fuelVariants, monthlyKm]);

  // Build SVG bar chart of cumulative cost over 60 months
  const months = Array.from({ length: 61 }, (_, i) => i);
  const MAX_MONTHS = 60;

  function cumulativeCost(fv: FuelVariant, m: number) {
    return fv.variant.price + fv.fuelCostPerKm * monthlyKm * m;
  }

  const allCosts = months.flatMap((m) => fuelVariants.map((fv) => cumulativeCost(fv, m)));
  const maxCost  = Math.max(...allCosts);
  const minCost  = Math.min(...allCosts.filter((_, i) => i < fuelVariants.length)); // month 0 = purchase prices

  const SVG_W = 420;
  const SVG_H = 200;
  const PAD_L = 48;
  const PAD_B = 28;
  const PAD_T = 12;
  const PAD_R = 12;
  const chartW = SVG_W - PAD_L - PAD_R;
  const chartH = SVG_H - PAD_B - PAD_T;

  function xPx(m: number)   { return PAD_L + (m / MAX_MONTHS) * chartW; }
  function yPx(cost: number){ return PAD_T + chartH - ((cost - minCost) / (maxCost - minCost + 1)) * chartH; }

  const lineColors = ["#3b82f6", "#f97316", "#10b981", "#8b5cf6"];

  function polylinePoints(fv: FuelVariant) {
    return months
      .map((m) => `${xPx(m).toFixed(1)},${yPx(cumulativeCost(fv, m)).toFixed(1)}`)
      .join(" ");
  }

  function fmtL(n: number) {
    return `₹${(n / 100000).toFixed(1)}L`;
  }

  const hasFuelDifference = new Set(variants.map((v) => v.fuelType)).size > 1
    || new Set(variants.map((v) => v.mileage)).size > 1;

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="mb-5">
        <h3 className="text-lg font-bold text-slate-900">Fuel Break-Even Calculator</h3>
        <p className="text-sm text-slate-500 mt-0.5">
          When does a costlier variant pay back through fuel savings?
        </p>
      </div>

      {!hasFuelDifference ? (
        <div className="rounded-2xl bg-slate-50 border border-slate-200 px-5 py-8 text-center">
          <Fuel className="h-8 w-8 text-slate-400 mx-auto mb-2" />
          <p className="text-sm font-semibold text-slate-600">All selected variants use the same fuel type and similar mileage.</p>
          <p className="text-xs text-slate-400 mt-1">Select variants with different fuel types to see break-even analysis.</p>
        </div>
      ) : (
        <>
          {/* Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">Monthly km</label>
                <span className="text-xs font-black text-blue-600">{monthlyKm.toLocaleString()}</span>
              </div>
              <input type="range" min={500} max={4000} step={100}
                value={monthlyKm} onChange={(e) => setMonthlyKm(Number(e.target.value))}
                className="w-full accent-blue-600"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">Petrol ₹/L</label>
                <span className="text-xs font-black text-orange-600">₹{petrolPrice}</span>
              </div>
              <input type="range" min={90} max={130} step={1}
                value={petrolPrice} onChange={(e) => setPetrolPrice(Number(e.target.value))}
                className="w-full accent-orange-500"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">Diesel ₹/L</label>
                <span className="text-xs font-black text-slate-600">₹{dieselPrice}</span>
              </div>
              <input type="range" min={80} max={120} step={1}
                value={dieselPrice} onChange={(e) => setDieselPrice(Number(e.target.value))}
                className="w-full accent-slate-500"
              />
            </div>
          </div>

          {/* Running cost chips */}
          <div className="flex flex-wrap gap-3 mb-6">
            {fuelVariants.map((fv) => {
              const Icon = fv.icon;
              const isCheapest = fv.variant.id === cheapestRunner.variant.id;
              return (
                <div
                  key={fv.variant.id}
                  className={cn(
                    "flex items-center gap-2 rounded-xl border px-4 py-2.5",
                    isCheapest ? "border-emerald-300 bg-emerald-50" : "border-slate-200 bg-white"
                  )}
                >
                  <Icon className={cn("h-4 w-4", fv.color)} />
                  <div>
                    <p className="text-xs font-bold text-slate-800">{fv.label}</p>
                    <p className={cn("text-sm font-black", fv.color)}>
                      ₹{fv.fuelCostPerKm.toFixed(1)}/km
                    </p>
                  </div>
                  {isCheapest && (
                    <span className="rounded-full bg-emerald-500 px-2 py-0.5 text-[10px] font-black text-white ml-1">
                      Cheapest
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Break-even cards */}
          {pairs.length > 0 && (
            <div className="grid gap-4 sm:grid-cols-2 mb-6">
              {pairs.map(({ expensive, cheap, priceDiff, monthlySaving, breakEvenMonths, breakEvenKm }) => (
                <div
                  key={`${expensive.variant.id}-${cheap.variant.id}`}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                >
                  <div className="flex items-center gap-2 mb-3 text-sm font-semibold text-slate-700">
                    <span className={cn("font-bold", expensive.color)}>{expensive.label}</span>
                    <span className="text-slate-400">vs</span>
                    <span className={cn("font-bold", cheap.color)}>{cheap.label}</span>
                  </div>

                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="rounded-xl bg-white border border-slate-200 px-2 py-3">
                      <TrendingDown className="h-4 w-4 text-rose-500 mx-auto mb-1" />
                      <p className="text-[10px] text-slate-500">Price premium</p>
                      <p className="text-sm font-black text-rose-600">{fmtL(priceDiff)}</p>
                    </div>
                    <div className="rounded-xl bg-white border border-slate-200 px-2 py-3">
                      <Fuel className="h-4 w-4 text-green-500 mx-auto mb-1" />
                      <p className="text-[10px] text-slate-500">Monthly saving</p>
                      <p className={cn("text-sm font-black", monthlySaving > 0 ? "text-green-600" : "text-slate-400")}>
                        {monthlySaving > 0 ? `₹${Math.round(monthlySaving).toLocaleString()}` : "None"}
                      </p>
                    </div>
                    <div className={cn(
                      "rounded-xl border px-2 py-3",
                      breakEvenMonths !== null && breakEvenMonths <= 36
                        ? "bg-emerald-50 border-emerald-200"
                        : breakEvenMonths !== null && breakEvenMonths <= 60
                        ? "bg-amber-50 border-amber-200"
                        : "bg-slate-50 border-slate-200"
                    )}>
                      <Clock className={cn(
                        "h-4 w-4 mx-auto mb-1",
                        breakEvenMonths !== null && breakEvenMonths <= 36 ? "text-emerald-500"
                        : breakEvenMonths !== null ? "text-amber-500" : "text-slate-400"
                      )} />
                      <p className="text-[10px] text-slate-500">Break-even</p>
                      <p className={cn(
                        "text-sm font-black",
                        breakEvenMonths !== null && breakEvenMonths <= 36 ? "text-emerald-600"
                        : breakEvenMonths !== null ? "text-amber-600" : "text-slate-400"
                      )}>
                        {breakEvenMonths !== null
                          ? breakEvenMonths > 120
                            ? "10+ yrs"
                            : `${breakEvenMonths} mo`
                          : "Never"}
                      </p>
                    </div>
                  </div>

                  {breakEvenMonths !== null && breakEvenMonths <= 84 && (
                    <p className="mt-3 text-xs text-slate-500 leading-relaxed">
                      At <strong>{monthlyKm.toLocaleString()} km/month</strong>, the{" "}
                      <span className={cn("font-bold", expensive.color)}>{expensive.label}</span>{" "}
                      recoups its extra cost in{" "}
                      <strong className="text-slate-800">{breakEvenMonths} months</strong>{" "}
                      ({breakEvenKm ? `${(breakEvenKm / 1000).toFixed(0)}K km` : ""}).
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Cumulative cost SVG line chart */}
          <div>
            <p className="text-sm font-bold text-slate-700 mb-3">Cumulative cost over 5 years</p>
            <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-slate-50 p-3">
              <svg
                viewBox={`0 0 ${SVG_W} ${SVG_H}`}
                className="w-full min-w-[320px]"
                style={{ maxHeight: 220 }}
                aria-label="Cumulative cost chart"
              >
                {/* Y grid lines */}
                {[0, 0.25, 0.5, 0.75, 1].map((t) => {
                  const cost = minCost + t * (maxCost - minCost);
                  const y = yPx(cost);
                  return (
                    <g key={t}>
                      <line x1={PAD_L} y1={y} x2={SVG_W - PAD_R} y2={y}
                        stroke="#e2e8f0" strokeWidth={1} strokeDasharray="4 3" />
                      <text x={PAD_L - 4} y={y + 4} textAnchor="end"
                        fontSize={8} fill="#94a3b8">
                        {fmtL(cost)}
                      </text>
                    </g>
                  );
                })}

                {/* X axis labels */}
                {[0, 12, 24, 36, 48, 60].map((m) => (
                  <text key={m} x={xPx(m)} y={SVG_H - 6}
                    textAnchor="middle" fontSize={8} fill="#94a3b8">
                    {m === 0 ? "Now" : `${m}m`}
                  </text>
                ))}

                {/* Lines per variant */}
                {fuelVariants.map((fv, idx) => (
                  <polyline
                    key={fv.variant.id}
                    points={polylinePoints(fv)}
                    fill="none"
                    stroke={lineColors[idx % lineColors.length]}
                    strokeWidth={2.5}
                    strokeLinejoin="round"
                    strokeLinecap="round"
                  />
                ))}

                {/* End-of-line labels */}
                {fuelVariants.map((fv, idx) => {
                  const endCost = cumulativeCost(fv, MAX_MONTHS);
                  return (
                    <text
                      key={fv.variant.id}
                      x={xPx(MAX_MONTHS) + 4}
                      y={yPx(endCost) + 4}
                      fontSize={8}
                      fill={lineColors[idx % lineColors.length]}
                      fontWeight={700}
                    >
                      {fmtL(endCost)}
                    </text>
                  );
                })}
              </svg>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-3 mt-3">
              {fuelVariants.map((fv, idx) => (
                <div key={fv.variant.id} className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full"
                    style={{ background: lineColors[idx % lineColors.length] }} />
                  <span className="text-xs text-slate-600 font-medium">{fv.label}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
