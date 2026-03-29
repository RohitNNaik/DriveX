"use client";

import { useMemo } from "react";
import { Check, TrendingDown, Zap, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getLoanOffers, LoanOffer } from "@/lib/loan-engine";
import { cn } from "@/lib/utils";

function formatINR(n: number) {
  return `₹${n.toLocaleString("en-IN")}`;
}

interface LoanComparisonProps {
  principal: number;
  tenure: number;
  creditScore: "excellent" | "good" | "fair";
}

function ScoreDots({ score, max }: { score: number; max: number }) {
  const filled = Math.round((score / max) * 5);
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "h-2 w-2 rounded-full",
            i < filled ? "bg-green-500" : "bg-gray-200"
          )}
        />
      ))}
    </div>
  );
}

export default function LoanComparison({ principal, tenure, creditScore }: LoanComparisonProps) {
  const offers: LoanOffer[] = useMemo(
    () => getLoanOffers(principal, tenure, creditScore),
    [principal, tenure, creditScore]
  );

  const maxScore = Math.max(...offers.map((o) => o.score), 1);

  if (offers.length === 0) {
    return (
      <div className="rounded-2xl border bg-white p-8 text-center text-gray-400">
        <p>No loan offers available for this amount & tenure. Try adjusting the parameters.</p>
      </div>
    );
  }

  const bestEMI = Math.min(...offers.map((o) => o.emi));
  const bestCost = Math.min(...offers.map((o) => o.effectiveCost));

  return (
    <div className="space-y-4">
      {/* Legend */}
      <div className="flex flex-wrap gap-3 text-xs text-gray-500">
        <span className="flex items-center gap-1"><TrendingDown className="h-3.5 w-3.5 text-green-500" /> Lowest EMI highlighted</span>
        <span className="flex items-center gap-1"><Star className="h-3.5 w-3.5 text-yellow-500" /> Best overall deal</span>
        <span className="flex items-center gap-1"><Zap className="h-3.5 w-3.5 text-blue-500" /> Fastest approval</span>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {offers.map((offer) => {
          const isLowest = offer.emi === bestEMI;
          const isBestCost = offer.effectiveCost === bestCost;

          return (
            <div
              key={offer.provider.id}
              className={cn(
                "relative flex flex-col rounded-2xl border bg-white p-5 shadow-sm transition-all hover:shadow-md",
                offer.badge === "Best Deal" && "ring-2 ring-green-500"
              )}
            >
              {/* Badge */}
              {offer.badge && (
                <span
                  className={cn(
                    "absolute -top-3 left-4 rounded-full px-3 py-1 text-xs font-bold text-white",
                    offer.badge === "Best Deal" ? "bg-green-600" : "bg-blue-500"
                  )}
                >
                  {offer.badge === "Best Deal" ? "⭐ " : ""}{offer.badge}
                </span>
              )}

              {/* Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{offer.provider.logo}</span>
                  <div>
                    <p className="font-bold text-sm">{offer.provider.name}</p>
                    <Badge variant="secondary" className="text-xs py-0 px-1.5">{offer.provider.type}</Badge>
                  </div>
                </div>
                <ScoreDots score={offer.score} max={maxScore} />
              </div>

              <Separator className="mb-3" />

              {/* Key numbers */}
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div className={cn("rounded-lg p-2.5", isLowest ? "bg-green-50 border border-green-200" : "bg-gray-50")}>
                  <p className="text-xs text-gray-500">Monthly EMI</p>
                  <p className={cn("font-extrabold text-lg leading-tight", isLowest ? "text-green-700" : "text-gray-800")}>
                    {formatINR(offer.emi)}
                  </p>
                  {isLowest && <p className="text-xs text-green-600 font-medium mt-0.5">Lowest ✓</p>}
                </div>
                <div className="bg-gray-50 rounded-lg p-2.5">
                  <p className="text-xs text-gray-500">Interest Rate</p>
                  <p className="font-extrabold text-lg leading-tight">{offer.appliedRate}%</p>
                  <p className="text-xs text-gray-400">p.a.</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-2.5">
                  <p className="text-xs text-gray-500">Total Interest</p>
                  <p className="font-bold text-orange-600">{formatINR(offer.totalInterest)}</p>
                </div>
                <div className={cn("rounded-lg p-2.5", isBestCost ? "bg-blue-50 border border-blue-200" : "bg-gray-50")}>
                  <p className="text-xs text-gray-500">Total Cost</p>
                  <p className={cn("font-bold", isBestCost ? "text-blue-700" : "text-gray-800")}>
                    {formatINR(offer.effectiveCost)}
                  </p>
                  {isBestCost && <p className="text-xs text-blue-600 font-medium mt-0.5">Cheapest overall ✓</p>}
                </div>
              </div>

              {/* Processing fee */}
              <p className="text-xs text-gray-500 mb-3">
                Processing fee: <span className="font-semibold text-gray-700">{formatINR(offer.processingFeeAmount)}</span>
                <span className="text-gray-400"> ({offer.provider.processingFee}% of loan)</span>
              </p>

              {/* Features */}
              <ul className="space-y-1 mb-3">
                {offer.provider.features.slice(0, 3).map((f) => (
                  <li key={f} className="flex items-start gap-1.5 text-xs text-gray-600">
                    <Check className="h-3.5 w-3.5 text-green-500 mt-0.5 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>

              {/* Footer */}
              <div className="mt-auto rounded-lg bg-gray-50 p-2 flex justify-between items-center">
                <span className="text-xs text-gray-500">
                  {offer.provider.preApprovalTime.includes("min") && <Zap className="inline h-3 w-3 text-blue-500 mr-0.5" />}
                  Approval: <span className="font-medium text-gray-700">{offer.provider.preApprovalTime}</span>
                </span>
                <span className="text-xs text-gray-500">LTV: <span className="font-medium">{offer.provider.maxLTV}%</span></span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary Table (compact) */}
      <div className="rounded-2xl border bg-white overflow-x-auto shadow-sm">
        <table className="w-full min-w-[580px] text-sm">
          <thead>
            <tr className="border-b bg-gray-50 text-xs text-gray-500">
              <th className="py-3 px-4 text-left">Lender</th>
              <th className="py-3 px-4 text-right">Rate</th>
              <th className="py-3 px-4 text-right">EMI/mo</th>
              <th className="py-3 px-4 text-right">Total Interest</th>
              <th className="py-3 px-4 text-right">Processing Fee</th>
              <th className="py-3 px-4 text-right">Total Cost</th>
            </tr>
          </thead>
          <tbody>
            {offers.map((offer, i) => (
              <tr
                key={offer.provider.id}
                className={cn(
                  "border-b last:border-0",
                  offer.badge === "Best Deal" ? "bg-green-50" : i % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                )}
              >
                <td className="py-3 px-4 font-medium">
                  {offer.provider.logo} {offer.provider.name}
                  {offer.badge && (
                    <span className="ml-2 text-xs text-green-700 font-semibold">({offer.badge})</span>
                  )}
                </td>
                <td className="py-3 px-4 text-right font-semibold">{offer.appliedRate}%</td>
                <td className={cn("py-3 px-4 text-right font-bold", offer.emi === bestEMI ? "text-green-700" : "")}>
                  {formatINR(offer.emi)}
                </td>
                <td className="py-3 px-4 text-right text-orange-600">{formatINR(offer.totalInterest)}</td>
                <td className="py-3 px-4 text-right text-gray-500">{formatINR(offer.processingFeeAmount)}</td>
                <td className={cn("py-3 px-4 text-right font-semibold", offer.effectiveCost === bestCost ? "text-blue-700" : "")}>
                  {formatINR(offer.effectiveCost)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-gray-400 text-center">
        * Rates are indicative based on credit profile. Actual rates depend on your CIBIL score, income, and bank discretion.
      </p>
    </div>
  );
}
