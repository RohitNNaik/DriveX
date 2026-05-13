"use client";

import { useState } from "react";
import { ComparableVariant } from "@/lib/variant-compare";
import { cn } from "@/lib/utils";
import { Trophy, Star } from "lucide-react";

const USE_CASES = [
  {
    id: "city",
    label: "Daily City Driver",
    emoji: "🏙",
    desc: "Short commutes, stop-go traffic, parking ease",
    weights: { mileage: 0.30, comfort: 0.20, price: 0.25, safety: 0.15, tech: 0.10 },
  },
  {
    id: "highway",
    label: "Highway Traveller",
    emoji: "🛣",
    desc: "Long drives, stability, power, cruise control",
    weights: { mileage: 0.20, comfort: 0.25, price: 0.10, safety: 0.20, tech: 0.25 },
  },
  {
    id: "family",
    label: "Family Car",
    emoji: "👨‍👩‍👧",
    desc: "Comfort, safety, space, reliability first",
    weights: { mileage: 0.10, comfort: 0.30, price: 0.15, safety: 0.35, tech: 0.10 },
  },
  {
    id: "performance",
    label: "Performance Seeker",
    emoji: "🏎",
    desc: "Max power, torque, sporty driving feel",
    weights: { mileage: 0.05, comfort: 0.15, price: 0.10, safety: 0.20, tech: 0.50 },
  },
  {
    id: "budget",
    label: "Budget Conscious",
    emoji: "💰",
    desc: "Best value per rupee, low running cost",
    weights: { mileage: 0.35, comfort: 0.10, price: 0.40, safety: 0.10, tech: 0.05 },
  },
] as const;

type UseCaseId = typeof USE_CASES[number]["id"];

interface ScoreWeights {
  mileage: number;
  comfort: number;
  price: number;
  safety: number;
  tech: number;
}

const TOTAL_COMFORT = 11;
const TOTAL_TECH    = 15;

function computeDecisionScore(
  variant: ComparableVariant,
  allVariants: ComparableVariant[],
  weights: ScoreWeights
): number {
  const prices = allVariants.map((v) => v.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const maxMileage = Math.max(...allVariants.map((v) => v.mileage).filter(Boolean));
  const maxPower   = Math.max(...allVariants.map((v) => v.power));

  // 0–100 sub-scores
  const mileageScore =
    variant.fuelType === "Electric"
      ? 100
      : maxMileage > 0
      ? (variant.mileage / maxMileage) * 100
      : 50;

  const comfortScore = (variant.features.comfort.length / TOTAL_COMFORT) * 100;

  const priceScore =
    maxPrice === minPrice ? 50 : ((maxPrice - variant.price) / (maxPrice - minPrice)) * 100;

  const safetyScore = Math.min(100, (variant.airbags / 8) * 60 + (variant.rating / 5) * 40);

  const techScore = (variant.features.technology.length / TOTAL_TECH) * 100;

  const raw =
    mileageScore * weights.mileage +
    comfortScore  * weights.comfort +
    priceScore    * weights.price +
    safetyScore   * weights.safety +
    techScore     * weights.tech;

  return Math.round(Math.min(100, Math.max(0, raw)));
}

function scoreBadge(score: number) {
  if (score >= 80) return { label: "Excellent", color: "bg-emerald-500", text: "text-emerald-700", bg: "bg-emerald-50 border-emerald-200" };
  if (score >= 65) return { label: "Good",      color: "bg-blue-500",    text: "text-blue-700",    bg: "bg-blue-50 border-blue-200" };
  if (score >= 50) return { label: "Average",   color: "bg-amber-400",   text: "text-amber-700",   bg: "bg-amber-50 border-amber-200" };
  return              { label: "Low",       color: "bg-rose-400",    text: "text-rose-700",    bg: "bg-rose-50 border-rose-200" };
}

interface Props {
  variants: ComparableVariant[];
}

export default function VariantDecisionScore({ variants }: Props) {
  const [activeCase, setActiveCase] = useState<UseCaseId>("city");

  const useCase = USE_CASES.find((u) => u.id === activeCase)!;

  const scored = variants
    .map((v) => ({
      variant: v,
      score: computeDecisionScore(v, variants, useCase.weights),
    }))
    .sort((a, b) => b.score - a.score);

  const winner = scored[0];

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="mb-5">
        <h3 className="text-lg font-bold text-slate-900">Variant Decision Score</h3>
        <p className="text-sm text-slate-500 mt-0.5">
          Pick your use-case — we score each variant for your specific needs
        </p>
      </div>

      {/* Use-case chips */}
      <div className="flex flex-wrap gap-2 mb-6">
        {USE_CASES.map((uc) => (
          <button
            key={uc.id}
            onClick={() => setActiveCase(uc.id)}
            className={cn(
              "flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-sm font-semibold transition-all",
              activeCase === uc.id
                ? "border-blue-500 bg-blue-500 text-white shadow-md shadow-blue-500/30"
                : "border-slate-200 bg-white text-slate-600 hover:border-blue-200 hover:text-blue-600"
            )}
          >
            <span>{uc.emoji}</span>
            {uc.label}
          </button>
        ))}
      </div>

      {/* Use-case description */}
      <div className="mb-5 rounded-xl bg-slate-50 border border-slate-200 px-4 py-3">
        <p className="text-sm text-slate-600">
          <span className="font-semibold text-slate-800">Scoring for: </span>
          {useCase.desc}
        </p>
      </div>

      {/* Winner callout */}
      <div className="mb-5 flex items-center gap-3 rounded-2xl bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 px-5 py-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-yellow-400 shadow-md">
          <Trophy className="h-5 w-5 text-white" />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">Best pick for your use-case</p>
          <p className="text-base font-black text-slate-900 mt-0.5">
            {winner.variant.variant}
            <span className="ml-2 text-sm font-semibold text-amber-600">
              {winner.score}/100
            </span>
          </p>
        </div>
      </div>

      {/* All variant scores */}
      <div className="space-y-3">
        {scored.map(({ variant, score }, rank) => {
          const badge = scoreBadge(score);
          const isWinner = rank === 0;
          return (
            <div
              key={variant.id}
              className={cn(
                "flex items-center gap-4 rounded-2xl border p-4 transition-all",
                isWinner ? "border-yellow-300 bg-yellow-50/50" : "border-slate-200 bg-white"
              )}
            >
              {/* Rank */}
              <div className={cn(
                "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-black",
                isWinner ? "bg-yellow-400 text-white" : "bg-slate-100 text-slate-500"
              )}>
                {isWinner ? <Star className="h-3.5 w-3.5" /> : rank + 1}
              </div>

              {/* Name */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-900 truncate">{variant.variant}</p>
                <p className="text-xs text-slate-500">{variant.fuelType} · {variant.transmission}</p>
              </div>

              {/* Score bar */}
              <div className="w-32 hidden sm:block">
                <div className="h-2.5 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className={cn("h-full rounded-full transition-all duration-700", badge.color)}
                    style={{ width: `${score}%` }}
                  />
                </div>
              </div>

              {/* Score chip */}
              <div className={cn("shrink-0 rounded-full border px-3 py-1 text-sm font-black", badge.bg, badge.text)}>
                {score}
                <span className="text-[10px] font-semibold opacity-60">/100</span>
              </div>

              {/* Badge label */}
              <span className={cn("hidden md:inline text-xs font-semibold", badge.text)}>
                {badge.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Weight breakdown */}
      <details className="mt-4">
        <summary className="cursor-pointer text-xs text-slate-400 hover:text-slate-600 select-none">
          How is this score calculated?
        </summary>
        <div className="mt-2 grid grid-cols-2 sm:grid-cols-5 gap-2">
          {Object.entries(useCase.weights).map(([key, w]) => (
            <div key={key} className="rounded-xl bg-slate-50 border border-slate-100 px-3 py-2 text-center">
              <p className="text-[10px] text-slate-500 capitalize">{key}</p>
              <p className="text-sm font-black text-slate-800">{Math.round(w * 100)}%</p>
            </div>
          ))}
        </div>
      </details>
    </div>
  );
}
