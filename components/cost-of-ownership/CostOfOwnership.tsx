"use client";

import { useState } from "react";
import { ComparableVariant } from "@/lib/variant-compare";
import { cn } from "@/lib/utils";
import { IndianRupee, Fuel, Wrench, Shield, TrendingDown } from "lucide-react";

const FUEL_PRICE: Record<string, number> = {
  Petrol:   104,
  Diesel:    92,
  Electric:   5, // ₹5 per kWh equivalent per km normalised
  Hybrid:    90,
  CNG:       80,
};

const ANNUAL_MAINTENANCE: Record<string, number> = {
  Petrol:   10000,
  Diesel:   14000,
  Electric:  5000,
  Hybrid:    9000,
  CNG:      12000,
};

const INTEREST_RATE  = 0.085;
const LOAN_YEARS     = 5;
const DEPRECIATION   = [0, 0.20, 0.10, 0.10, 0.05, 0.05]; // year 0 = purchase

function calcEMI(principal: number, annualRate: number, tenureMonths: number) {
  const r = annualRate / 12;
  const emi = (principal * r * Math.pow(1 + r, tenureMonths)) /
              (Math.pow(1 + r, tenureMonths) - 1);
  return emi;
}

interface CostBreakdown {
  totalEMI: number;
  fuelCost: number;
  insurance: number;
  maintenance: number;
  depreciation: number;
  total: number;
}

function computeCost(
  variant: ComparableVariant,
  monthlyKm: number,
  years: number,
  downPaymentPct: number
): CostBreakdown {
  const downPayment = variant.price * (downPaymentPct / 100);
  const loanAmt     = variant.price - downPayment;
  const emi         = calcEMI(loanAmt, INTEREST_RATE, LOAN_YEARS * 12);
  const totalEMI    = emi * (Math.min(years, LOAN_YEARS) * 12) + downPayment;

  // Fuel
  const annualKm    = monthlyKm * 12;
  const kmpl        = variant.fuelType === "Electric" ? 6 : (variant.mileage || 15);
  const pricePerUnit = FUEL_PRICE[variant.fuelType] ?? 100;
  const fuelCost    = (annualKm / kmpl) * pricePerUnit * years;

  // Insurance (declining premium)
  let insurance = 0;
  for (let y = 1; y <= years; y++) {
    const pct = y === 1 ? 0.035 : y <= 3 ? 0.022 : 0.015;
    insurance += variant.price * pct;
  }

  // Maintenance
  const maintenance = (ANNUAL_MAINTENANCE[variant.fuelType] ?? 10000) * years;

  // Depreciation (market value lost)
  let depRate = 0;
  for (let y = 1; y <= Math.min(years, DEPRECIATION.length - 1); y++) {
    depRate += DEPRECIATION[y];
  }
  const depreciation = variant.price * depRate;

  const total = totalEMI + fuelCost + insurance + maintenance;

  return { totalEMI, fuelCost, insurance, maintenance, depreciation, total };
}

function fmt(n: number) {
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`;
  return `₹${Math.round(n / 1000)}K`;
}

const COST_ROWS: Array<{
  key: keyof CostBreakdown;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bg: string;
}> = [
  { key: "totalEMI",     label: "EMI / Loan",       icon: IndianRupee,  color: "text-blue-600",   bg: "bg-blue-50"   },
  { key: "fuelCost",     label: "Fuel / Charging",  icon: Fuel,         color: "text-orange-600", bg: "bg-orange-50" },
  { key: "insurance",    label: "Insurance",         icon: Shield,       color: "text-violet-600", bg: "bg-violet-50" },
  { key: "maintenance",  label: "Maintenance",       icon: Wrench,       color: "text-green-600",  bg: "bg-green-50"  },
  { key: "depreciation", label: "Depreciation",      icon: TrendingDown, color: "text-rose-600",   bg: "bg-rose-50"   },
];

const PALETTE = ["#3b82f6", "#f97316", "#10b981", "#8b5cf6"];

interface Props {
  variants: ComparableVariant[];
}

export default function CostOfOwnership({ variants }: Props) {
  const [monthlyKm,       setMonthlyKm]       = useState(1200);
  const [years,           setYears]           = useState(5);
  const [downPaymentPct,  setDownPaymentPct]  = useState(20);

  const breakdowns = variants.map((v) =>
    computeCost(v, monthlyKm, years, downPaymentPct)
  );

  const cheapest = Math.min(...breakdowns.map((b) => b.total));

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="mb-5">
        <h3 className="text-lg font-bold text-slate-900">
          {years}-Year Cost of Ownership
        </h3>
        <p className="text-sm text-slate-500 mt-0.5">
          Real total cost including EMI, fuel, insurance and maintenance
        </p>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 p-4 rounded-2xl bg-slate-50 border border-slate-200">
        {/* Monthly KM */}
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between">
            <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">
              Monthly km
            </label>
            <span className="text-xs font-black text-blue-600">{monthlyKm.toLocaleString()} km</span>
          </div>
          <input
            type="range"
            min={500} max={4000} step={100}
            value={monthlyKm}
            onChange={(e) => setMonthlyKm(Number(e.target.value))}
            className="w-full accent-blue-600"
          />
          <div className="flex justify-between text-[10px] text-slate-400">
            <span>500</span><span>4,000</span>
          </div>
        </div>

        {/* Ownership period */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">
            Ownership period
          </label>
          <div className="flex gap-2">
            {[3, 5, 7].map((y) => (
              <button
                key={y}
                onClick={() => setYears(y)}
                className={cn(
                  "flex-1 rounded-xl border py-2 text-sm font-bold transition-all",
                  years === y
                    ? "border-blue-500 bg-blue-500 text-white shadow-sm"
                    : "border-slate-200 text-slate-600 hover:border-blue-300"
                )}
              >
                {y} yr
              </button>
            ))}
          </div>
        </div>

        {/* Down payment */}
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between">
            <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">
              Down payment
            </label>
            <span className="text-xs font-black text-blue-600">{downPaymentPct}%</span>
          </div>
          <input
            type="range"
            min={10} max={50} step={5}
            value={downPaymentPct}
            onChange={(e) => setDownPaymentPct(Number(e.target.value))}
            className="w-full accent-blue-600"
          />
          <div className="flex justify-between text-[10px] text-slate-400">
            <span>10%</span><span>50%</span>
          </div>
        </div>
      </div>

      {/* Variant cost cards */}
      <div className={`grid gap-4 ${variants.length <= 2 ? "sm:grid-cols-2" : "sm:grid-cols-2 xl:grid-cols-4"}`}>
        {variants.map((v, idx) => {
          const bd = breakdowns[idx];
          const isCheapest = bd.total === cheapest;
          const color = PALETTE[idx % PALETTE.length];

          return (
            <div
              key={v.id}
              className={cn(
                "rounded-2xl border p-4 transition-all",
                isCheapest
                  ? "border-emerald-400 bg-emerald-50/50 shadow-md shadow-emerald-500/10"
                  : "border-slate-200 bg-white"
              )}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span
                    className="h-3 w-3 rounded-full shrink-0"
                    style={{ background: color }}
                  />
                  <span className="text-sm font-bold text-slate-900 truncate max-w-[120px]">
                    {v.variant}
                  </span>
                </div>
                {isCheapest && (
                  <span className="rounded-full bg-emerald-500 px-2 py-0.5 text-[10px] font-black text-white">
                    Cheapest
                  </span>
                )}
              </div>

              {/* Total */}
              <div className="mb-3">
                <p className="text-2xl font-black text-slate-900">{fmt(bd.total)}</p>
                <p className="text-xs text-slate-500">total over {years} years</p>
              </div>

              {/* Stacked bar */}
              <div className="h-3 w-full rounded-full overflow-hidden flex mb-3">
                {COST_ROWS.filter((r) => r.key !== "depreciation").map((row, i) => {
                  const val = bd[row.key] as number;
                  const pct = (val / bd.total) * 100;
                  const barColors = ["#3b82f6", "#f97316", "#8b5cf6", "#10b981"];
                  return (
                    <div
                      key={row.key}
                      style={{ width: `${pct}%`, background: barColors[i] }}
                      title={`${row.label}: ${fmt(val)}`}
                    />
                  );
                })}
              </div>

              {/* Cost breakdown rows */}
              <div className="space-y-1.5">
                {COST_ROWS.filter((r) => r.key !== "depreciation").map((row) => {
                  const Icon = row.icon;
                  const val = bd[row.key] as number;
                  return (
                    <div key={row.key} className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <div className={cn("flex h-5 w-5 items-center justify-center rounded-md", row.bg)}>
                          <Icon className={cn("h-3 w-3", row.color)} />
                        </div>
                        <span className="text-xs text-slate-600">{row.label}</span>
                      </div>
                      <span className="text-xs font-bold text-slate-800">{fmt(val)}</span>
                    </div>
                  );
                })}
                <div className="pt-1 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <div className="flex h-5 w-5 items-center justify-center rounded-md bg-rose-50">
                      <TrendingDown className="h-3 w-3 text-rose-600" />
                    </div>
                    <span className="text-xs text-slate-600">Resale loss</span>
                  </div>
                  <span className="text-xs font-bold text-rose-600">-{fmt(bd.depreciation)}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <p className="mt-4 text-[11px] text-slate-400">
        * EMI at 8.5% p.a. Fuel prices: Petrol ₹104/L, Diesel ₹92/L, EV ₹5/km. Estimates only.
      </p>
    </div>
  );
}
