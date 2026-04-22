"use client";

import { ComparableVariant, compareVariantUpgrade } from "@/lib/variant-compare";
import { cn } from "@/lib/utils";
import { ArrowRight, CheckCircle2, XCircle, TrendingUp, IndianRupee } from "lucide-react";

const CATEGORY_ICONS: Record<string, string> = {
  safety:     "🛡",
  comfort:    "✨",
  technology: "📱",
  exterior:   "🎨",
};

function formatPrice(n: number) {
  if (Math.abs(n) >= 100000) return `₹${(n / 100000).toFixed(2)}L`;
  return `₹${Math.abs(n / 1000).toFixed(0)}K`;
}

function getScoreProps(score: number) {
  if (score >= 80) return {
    label: "Highly Worth It",
    color: "text-emerald-700",
    bg:    "bg-emerald-50 border-emerald-300",
    bar:   "bg-emerald-500",
    dot:   "bg-emerald-500",
  };
  if (score >= 60) return {
    label: "Worth Considering",
    color: "text-blue-700",
    bg:    "bg-blue-50 border-blue-300",
    bar:   "bg-blue-500",
    dot:   "bg-blue-500",
  };
  if (score >= 40) return {
    label: "Marginal Upgrade",
    color: "text-amber-700",
    bg:    "bg-amber-50 border-amber-300",
    bar:   "bg-amber-400",
    dot:   "bg-amber-400",
  };
  return {
    label: "Not Worth It",
    color: "text-rose-700",
    bg:    "bg-rose-50 border-rose-300",
    bar:   "bg-rose-400",
    dot:   "bg-rose-400",
  };
}

interface Props {
  variants: ComparableVariant[];
}

export default function TrimUpgradeAdvisor({ variants }: Props) {
  // Build sequential upgrade steps: base → next → next
  const sorted   = [...variants].sort((a, b) => a.price - b.price);
  const upgrades = sorted.slice(0, -1).map((from, i) => {
    const to      = sorted[i + 1];
    const details = compareVariantUpgrade(from, to);
    return { from, to, details };
  });

  if (upgrades.length === 0) return null;

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="mb-5">
        <h3 className="text-lg font-bold text-slate-900">Trim Upgrade Advisor</h3>
        <p className="text-sm text-slate-500 mt-0.5">
          For each price step, is the upgrade actually worth it?
        </p>
      </div>

      <div className="space-y-5">
        {upgrades.map(({ from, to, details }) => {
          const props = getScoreProps(details.upgradeScore);

          // Group gained features by category
          const gainedByCategory: Record<string, string[]> = {};
          for (const [cat, features] of Object.entries(to.features)) {
            const fromFeatures = new Set((from.features as Record<string, string[]>)[cat] ?? []);
            const gained = features.filter((f) => !fromFeatures.has(f));
            if (gained.length > 0) gainedByCategory[cat] = gained;
          }

          return (
            <div
              key={`${from.id}-${to.id}`}
              className="rounded-2xl border border-slate-200 overflow-hidden"
            >
              {/* Step header */}
              <div className="flex items-center justify-between gap-4 px-5 py-4 bg-slate-50 border-b border-slate-200">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-bold text-slate-900 truncate">{from.variant}</span>
                    <span className="text-xs text-slate-500">{formatPrice(from.price)}</span>
                  </div>
                  <ArrowRight className="h-4 w-4 text-slate-400 shrink-0" />
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-bold text-slate-900 truncate">{to.variant}</span>
                    <span className="text-xs text-slate-500">{formatPrice(to.price)}</span>
                  </div>
                </div>

                {/* Score badge */}
                <div className={cn("shrink-0 rounded-xl border px-4 py-2 text-center", props.bg)}>
                  <p className="text-xl font-black leading-none text-slate-900">
                    {details.upgradeScore}
                    <span className="text-sm font-semibold text-slate-500">/100</span>
                  </p>
                  <p className={cn("text-[10px] font-bold mt-0.5", props.color)}>{props.label}</p>
                </div>
              </div>

              <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Left: Price delta + score bar */}
                <div className="flex flex-col gap-4">
                  {/* Price delta */}
                  <div className="flex items-center gap-3 rounded-xl bg-slate-50 border border-slate-200 px-4 py-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50">
                      <IndianRupee className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">You pay extra</p>
                      <p className="text-lg font-black text-blue-700">
                        +{formatPrice(details.priceDelta)}
                      </p>
                    </div>
                  </div>

                  {/* Score bar */}
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between text-xs text-slate-600 font-medium">
                      <span>Upgrade value score</span>
                      <span className={props.color}>{details.upgradeScore}/100</span>
                    </div>
                    <div className="h-3 w-full rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className={cn("h-full rounded-full transition-all duration-700", props.bar)}
                        style={{ width: `${details.upgradeScore}%` }}
                      />
                    </div>
                  </div>

                  {/* Quick stats */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="rounded-xl bg-emerald-50 border border-emerald-200 px-3 py-2 text-center">
                      <p className="text-xs text-emerald-600 font-semibold">Features gained</p>
                      <p className="text-2xl font-black text-emerald-700">{details.gained.length}</p>
                    </div>
                    <div className={cn(
                      "rounded-xl border px-3 py-2 text-center",
                      details.lost.length > 0 ? "bg-rose-50 border-rose-200" : "bg-slate-50 border-slate-200"
                    )}>
                      <p className={cn("text-xs font-semibold", details.lost.length > 0 ? "text-rose-600" : "text-slate-500")}>
                        Features lost
                      </p>
                      <p className={cn("text-2xl font-black", details.lost.length > 0 ? "text-rose-700" : "text-slate-400")}>
                        {details.lost.length}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right: Feature lists */}
                <div className="flex flex-col gap-3">
                  {/* Gained by category */}
                  {Object.keys(gainedByCategory).length > 0 && (
                    <div>
                      <p className="text-xs font-bold text-emerald-700 uppercase tracking-wide mb-2 flex items-center gap-1">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        What you gain
                      </p>
                      <div className="flex flex-col gap-2">
                        {Object.entries(gainedByCategory).map(([cat, feats]) => (
                          <div key={cat}>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wide mb-1">
                              {CATEGORY_ICONS[cat]} {cat}
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {feats.map((f) => (
                                <span
                                  key={f}
                                  className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[11px] font-semibold text-emerald-700"
                                >
                                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                                  {f}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Lost features */}
                  {details.lost.length > 0 && (
                    <div>
                      <p className="text-xs font-bold text-rose-700 uppercase tracking-wide mb-2 flex items-center gap-1">
                        <XCircle className="h-3.5 w-3.5" />
                        What you lose
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {details.lost.map((f) => (
                          <span
                            key={f}
                            className="inline-flex items-center gap-1 rounded-full bg-rose-50 border border-rose-200 px-2 py-0.5 text-[11px] font-semibold text-rose-700"
                          >
                            <span className="h-1.5 w-1.5 rounded-full bg-rose-400 shrink-0" />
                            {f}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Verdict */}
                  <div className={cn("rounded-xl border px-4 py-3 mt-auto", props.bg)}>
                    <div className="flex items-center gap-2">
                      <TrendingUp className={cn("h-4 w-4 shrink-0", props.color)} />
                      <p className={cn("text-sm font-bold", props.color)}>Verdict</p>
                    </div>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {details.upgradeScore >= 80
                        ? `Strong upgrade. ${details.gained.length} new features for +${formatPrice(details.priceDelta)} is excellent value.`
                        : details.upgradeScore >= 60
                        ? `Reasonable step-up. The key additions justify the extra cost for most buyers.`
                        : details.upgradeScore >= 40
                        ? `Borderline upgrade. Consider only if the specific features gained are important to you.`
                        : `Hard to justify. You're paying +${formatPrice(details.priceDelta)} for minimal real-world benefit.`}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
