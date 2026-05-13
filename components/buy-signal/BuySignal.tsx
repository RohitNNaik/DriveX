"use client";

import { useMemo } from "react";
import { Car } from "@/lib/types";
import { TrendingUp, Clock, AlertTriangle, CheckCircle2, Zap, ChevronRight } from "lucide-react";
import Link from "next/link";

type Signal = "BUY_NOW" | "WAIT" | "WATCH";

interface SignalResult {
  signal: Signal;
  confidence: number; // 0-100
  headline: string;
  reasons: string[];
  aiTip: string;
}

const UPCOMING_MODEL_KEYWORDS = [
  "sierra", "be 6e", "e vitara", "creta ev", "thar roxx",
];

function computeSignal(car: Car): SignalResult {
  let score = 50; // neutral baseline
  const reasons: string[] = [];

  // — Fuel type signals —
  if (car.fuelType === "Electric") {
    score += 12;
    reasons.push("EV subsidies (FAME II + state) still active");
  }
  if (car.fuelType === "Diesel") {
    score -= 10;
    reasons.push("Diesel preference declining in Indian cities post CAFE norms");
  }

  // — Model freshness (year) —
  const currentYear = 2026;
  const age = currentYear - car.year;
  if (age === 0) {
    score += 18;
    reasons.push("Just launched — earliest buyers get fresh stock & full warranty");
  } else if (age === 1) {
    score += 8;
    reasons.push("Recent model year — no major facelift expected soon");
  } else if (age >= 3) {
    score -= 15;
    reasons.push(`${age}-year-old model — next-gen refresh likely within 12–18 months`);
  }

  // — Check if an upgraded version is in the upcoming list —
  const nameMatch = UPCOMING_MODEL_KEYWORDS.some(
    (kw) => car.name.toLowerCase().includes(kw) || car.model.toLowerCase().includes(kw)
  );
  if (nameMatch) {
    score -= 20;
    reasons.push("Upgraded version confirmed in 2026 launch calendar — consider waiting");
  }

  // — Price segment —
  if (car.price < 700000) {
    score += 8;
    reasons.push("Entry-level segment — value proposition is strong year-round");
  } else if (car.price > 2500000) {
    score -= 8;
    reasons.push("Premium segment prices drop 3–5% post-launch honeymoon (3–4 months)");
  }

  // — Rating —
  if (car.rating >= 4.5) {
    score += 10;
    reasons.push("Highly rated — owner satisfaction is consistently strong");
  } else if (car.rating < 3.8) {
    score -= 8;
    reasons.push("Below-average rating — check recent owner reviews before buying");
  }

  // — Mileage for petrol/diesel —
  if (car.fuelType !== "Electric" && car.mileage >= 20) {
    score += 5;
    reasons.push("Excellent mileage keeps running costs low even with fuel price volatility");
  }

  // — Used car penalty —
  if (car.isUsed) {
    score -= 5;
    reasons.push("Used car — verify service history and get an independent inspection");
  }

  score = Math.max(0, Math.min(100, score));

  let signal: Signal;
  let headline: string;
  let aiTip: string;

  if (score >= 65) {
    signal = "BUY_NOW";
    headline = "Good time to buy";
    aiTip = `The ${car.name} is well-positioned right now. Lock in current offers before month-end — discounts reset after 30th.`;
  } else if (score >= 45) {
    signal = "WATCH";
    headline = "Watch & decide";
    aiTip = `Keep the ${car.name} on your watchlist. Wait for the next dealer discount cycle (usually end of quarter) for a better deal.`;
  } else {
    signal = "WAIT";
    headline = "Consider waiting";
    aiTip = `Better options or a price correction may be coming. Ask AI Advisor for alternatives in the same budget.`;
  }

  return { signal, confidence: score, headline, reasons: reasons.slice(0, 4), aiTip };
}

const SIGNAL_CONFIG = {
  BUY_NOW: {
    bg:       "bg-gradient-to-br from-emerald-50 to-teal-50",
    border:   "border-emerald-200",
    badge:    "bg-emerald-500",
    icon:     CheckCircle2,
    iconColor:"text-emerald-600",
    barColor: "bg-gradient-to-r from-emerald-400 to-teal-500",
    label:    "BUY NOW",
  },
  WATCH: {
    bg:       "bg-gradient-to-br from-amber-50 to-yellow-50",
    border:   "border-amber-200",
    badge:    "bg-amber-500",
    icon:     Clock,
    iconColor:"text-amber-600",
    barColor: "bg-gradient-to-r from-amber-400 to-yellow-500",
    label:    "WATCH",
  },
  WAIT: {
    bg:       "bg-gradient-to-br from-rose-50 to-pink-50",
    border:   "border-rose-200",
    badge:    "bg-rose-500",
    icon:     AlertTriangle,
    iconColor:"text-rose-600",
    barColor: "bg-gradient-to-r from-rose-400 to-pink-500",
    label:    "WAIT",
  },
};

export default function BuySignal({ car }: { car: Car }) {
  const result = useMemo(() => computeSignal(car), [car]);
  const cfg = SIGNAL_CONFIG[result.signal];
  const Icon = cfg.icon;

  return (
    <div className={`rounded-3xl border ${cfg.border} ${cfg.bg} overflow-hidden`}>
      {/* Header */}
      <div className="px-5 py-4 flex items-center justify-between border-b border-current/10">
        <div className="flex items-center gap-2.5">
          <div className={`flex h-9 w-9 items-center justify-center rounded-xl bg-white shadow-sm`}>
            <Icon className={`h-4.5 w-4.5 ${cfg.iconColor}`} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Should I Buy Now?</p>
            <p className="font-black text-slate-900 text-sm leading-tight">{result.headline}</p>
          </div>
        </div>
        <span className={`rounded-full ${cfg.badge} px-3 py-1 text-xs font-black text-white shadow-sm`}>
          {cfg.label}
        </span>
      </div>

      {/* Confidence bar */}
      <div className="px-5 pt-4 pb-1">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Buy confidence</span>
          <span className="text-sm font-black text-slate-800">{result.confidence}%</span>
        </div>
        <div className="h-2 w-full rounded-full bg-slate-200 overflow-hidden">
          <div
            className={`h-full rounded-full ${cfg.barColor} transition-all duration-700`}
            style={{ width: `${result.confidence}%` }}
          />
        </div>
      </div>

      {/* Reasons */}
      <div className="px-5 py-3 space-y-1.5">
        {result.reasons.map((r) => (
          <div key={r} className="flex items-start gap-2 text-xs text-slate-700">
            <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400" />
            {r}
          </div>
        ))}
      </div>

      {/* AI tip */}
      <div className="mx-4 mb-4 rounded-2xl bg-white/70 border border-white px-4 py-3">
        <p className="text-[11px] text-slate-600 leading-relaxed">
          <span className="font-black text-violet-700">✨ AI tip:</span>{" "}
          {result.aiTip}
        </p>
      </div>

      {/* CTA */}
      <div className="px-5 pb-4">
        <Link
          href="/ai-advisor"
          className="flex items-center justify-center gap-1.5 rounded-xl border border-violet-200 bg-violet-50 px-4 py-2.5 text-xs font-bold text-violet-700 hover:bg-violet-100 hover:border-violet-300 transition-all"
        >
          <Zap className="h-3.5 w-3.5" />
          Ask AI Advisor for alternatives
          <ChevronRight className="h-3.5 w-3.5 ml-auto" />
        </Link>
      </div>
    </div>
  );
}
