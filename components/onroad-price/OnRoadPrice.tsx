"use client";

import { useState } from "react";
import { useCity, CITIES, City } from "@/context/CityContext";
import { MapPin, ChevronDown, Check, Info } from "lucide-react";
import { cn } from "@/lib/utils";

function fmt(n: number) {
  if (n >= 100000) return `₹${(n / 100000).toFixed(2)}L`;
  return `₹${Math.round(n / 1000)}K`;
}

interface Row {
  label:    string;
  amount:   number;
  note?:    string;
  highlight?: boolean;
  isTotal?: boolean;
}

function buildRows(price: number, city: City): Row[] {
  const roadTax    = Math.round(city.roadTax(price));
  const tcs        = price >= 1000000 ? Math.round(price * 0.01) : 0; // 1% TCS above 10L
  const insurance  = Math.round(price * 0.035);
  const handling   = city.handling;
  const fastag     = 500;
  const total      = price + roadTax + tcs + insurance + handling + fastag;
  const roadTaxPct = ((roadTax / price) * 100).toFixed(1);

  return [
    {
      label:  "Ex-showroom price",
      amount: price,
      note:   "Manufacturer's price before any state charges",
    },
    {
      label:  `Road tax / Registration (${roadTaxPct}%)`,
      amount: roadTax,
      note:   `${city.state} road tax rate`,
    },
    ...(tcs > 0
      ? [{ label: "TCS (1% on cars above ₹10L)", amount: tcs, note: "Tax Collected at Source" }]
      : []),
    {
      label:  "1st year insurance (est.)",
      amount: insurance,
      note:   "Comprehensive cover — varies by insurer",
    },
    {
      label:  "Handling & logistics",
      amount: handling,
      note:   "Dealer delivery & documentation charges",
    },
    {
      label:  "FASTag",
      amount: fastag,
    },
    {
      label:    `On-road price — ${city.name}`,
      amount:   total,
      isTotal:  true,
      highlight: true,
    },
  ];
}

interface Props {
  price: number;
}

export default function OnRoadPrice({ price }: Props) {
  const { city, setCity } = useCity();
  const [pickerOpen, setPickerOpen] = useState(false);
  const [showNote,   setShowNote]   = useState<string | null>(null);

  const rows = buildRows(price, city);
  const total = rows.find((r) => r.isTotal)!.amount;

  return (
    <div className="rounded-3xl bg-white border border-slate-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50/50">
        <div>
          <h3 className="text-sm font-black text-slate-900">On-road Price Breakdown</h3>
          <p className="text-xs text-slate-500 mt-0.5">All charges included</p>
        </div>

        {/* City picker */}
        <div className="relative">
          <button
            onClick={() => setPickerOpen((v) => !v)}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:border-blue-300 hover:text-blue-600 transition-all shadow-sm"
          >
            <MapPin className="h-3 w-3 text-blue-500" />
            {city.emoji} {city.name}
            <ChevronDown className={cn("h-3 w-3 transition-transform", pickerOpen && "rotate-180")} />
          </button>

          {pickerOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setPickerOpen(false)} />
              <div className="absolute right-0 top-full mt-1.5 z-20 w-52 rounded-2xl border border-slate-200 bg-white shadow-xl overflow-hidden">
                <div className="px-3 py-2 border-b border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                    Change city
                  </p>
                </div>
                {CITIES.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => { setCity(c); setPickerOpen(false); }}
                    className="flex w-full items-center justify-between px-4 py-2.5 text-sm hover:bg-slate-50 transition-colors"
                  >
                    <span className="flex items-center gap-2 text-slate-700 font-medium">
                      {c.emoji} {c.name}
                      <span className="text-xs text-slate-400">{c.state}</span>
                    </span>
                    {city.name === c.name && <Check className="h-3.5 w-3.5 text-blue-600" />}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Rows */}
      <div className="divide-y divide-slate-100">
        {rows.map((row) => (
          <div
            key={row.label}
            className={cn(
              "flex items-center justify-between px-5 py-3.5 gap-3",
              row.isTotal && "bg-blue-50"
            )}
          >
            <div className="flex items-center gap-2 min-w-0">
              <p className={cn(
                "text-sm truncate",
                row.isTotal ? "font-black text-slate-900" : "font-medium text-slate-700"
              )}>
                {row.label}
              </p>
              {row.note && (
                <button
                  onMouseEnter={() => setShowNote(row.label)}
                  onMouseLeave={() => setShowNote(null)}
                  onClick={() => setShowNote(showNote === row.label ? null : row.label)}
                  className="shrink-0 relative"
                >
                  <Info className="h-3.5 w-3.5 text-slate-400 hover:text-slate-600" />
                  {showNote === row.label && (
                    <div className="absolute left-5 top-0 z-10 w-44 rounded-xl bg-slate-900 px-3 py-2 text-[11px] text-slate-100 shadow-xl leading-relaxed">
                      {row.note}
                    </div>
                  )}
                </button>
              )}
            </div>
            <span className={cn(
              "shrink-0 text-sm",
              row.isTotal ? "text-lg font-black text-blue-700" : "font-bold text-slate-800"
            )}>
              {fmt(row.amount)}
            </span>
          </div>
        ))}
      </div>

      {/* Savings callout */}
      <div className="px-5 py-3 bg-amber-50 border-t border-amber-100">
        <p className="text-xs text-amber-700">
          <span className="font-bold">💡 Tip:</span>{" "}
          Road tax in {city.name} adds{" "}
          <span className="font-bold">
            {fmt(Math.round(city.roadTax(price)))}
          </span>{" "}
          to ex-showroom. Check current offers to reduce on-road cost.
        </p>
      </div>
    </div>
  );
}
