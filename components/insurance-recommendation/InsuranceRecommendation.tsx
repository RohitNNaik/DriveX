"use client";

import { useMemo } from "react";
import { Check, X as XIcon, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getInsuranceRecommendations } from "@/lib/insurance-engine";
import { cn } from "@/lib/utils";

function formatINR(n: number) {
  if (n === 0) return "As per govt. rates";
  return `₹${n.toLocaleString("en-IN")}`;
}

const PLAN_COLORS: Record<string, string> = {
  "Third-Party": "bg-gray-100 text-gray-700",
  "Comprehensive": "bg-blue-100 text-blue-700",
  "Zero Depreciation": "bg-green-100 text-green-700",
  "Bundled": "bg-purple-100 text-purple-700",
};

interface InsuranceRecommendationProps {
  carPrice: number;
  carAge: number;
  engineCC: number;
  isEV: boolean;
}

export default function InsuranceRecommendation({
  carPrice,
  carAge,
  engineCC,
  isEV,
}: InsuranceRecommendationProps) {
  const recommendations = useMemo(
    () => getInsuranceRecommendations(carPrice, carAge, engineCC, isEV),
    [carPrice, carAge, engineCC, isEV]
  );

  return (
    <div className="space-y-5">
      {/* Header insight */}
      <div className="rounded-2xl bg-amber-50 border border-amber-200 p-4 flex gap-3 items-start">
        <Shield className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
        <div className="text-sm">
          <p className="font-semibold text-amber-800 mb-0.5">Insurance Insight</p>
          <p className="text-amber-700">
            {carAge === 0
              ? "For a brand new car, Zero Depreciation or a Bundled plan saves you the most in the long run — full part replacement without deductions."
              : carAge <= 3
              ? "For cars under 3 years old, Comprehensive or Zero Depreciation cover is strongly recommended."
              : carAge <= 7
              ? "A standard Comprehensive plan gives good value for your car's age."
              : "For cars over 7 years old, Third-Party cover is legally required and may be all you need cost-effectively."}
          </p>
        </div>
      </div>

      {/* Plan cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {recommendations.map((rec) => (
          <div
            key={rec.provider.id}
            className={cn(
              "relative flex flex-col rounded-2xl border bg-white p-5 shadow-sm transition-all hover:shadow-md",
              rec.badge === "Top Pick" && "ring-2 ring-green-500"
            )}
          >
            {/* Badge */}
            {rec.badge && (
              <span
                className={cn(
                  "absolute -top-3 left-4 rounded-full px-3 py-1 text-xs font-bold text-white",
                  rec.badge === "Top Pick" ? "bg-green-600" : "bg-blue-500"
                )}
              >
                {rec.badge === "Top Pick" ? "🏆 " : "🥈 "}{rec.badge}
              </span>
            )}

            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{rec.provider.logo}</span>
                <div>
                  <p className="font-bold text-sm">{rec.provider.name}</p>
                  <span className={cn("inline-block rounded-full px-2 py-0 text-xs font-semibold mt-0.5", PLAN_COLORS[rec.provider.planType])}>
                    {rec.provider.planType}
                  </span>
                </div>
              </div>
            </div>

            {/* Tag */}
            {rec.tag && (
              <p className="text-xs font-semibold text-blue-600 mb-2">💡 {rec.tag}</p>
            )}

            <Separator className="mb-3" />

            {/* Key numbers */}
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="bg-gray-50 rounded-lg p-2.5">
                <p className="text-xs text-gray-500">Est. Annual Premium</p>
                <p className="font-extrabold text-lg text-blue-700 leading-tight">
                  {formatINR(rec.estimatedPremium)}
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-2.5">
                <p className="text-xs text-gray-500">IDV (Sum Insured)</p>
                <p className="font-bold text-gray-800">
                  {rec.estimatedIDV > 0 ? formatINR(rec.estimatedIDV) : "N/A"}
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="flex gap-3 mb-3 text-xs">
              <div className="flex-1 bg-green-50 rounded-lg p-2 text-center">
                <p className="text-gray-500">Claim Settlement</p>
                <p className="font-bold text-green-700">{rec.provider.claimSettlementRatio}%</p>
              </div>
              <div className="flex-1 bg-blue-50 rounded-lg p-2 text-center">
                <p className="text-gray-500">Network Garages</p>
                <p className="font-bold text-blue-700">{rec.provider.networkGarages.toLocaleString()}+</p>
              </div>
            </div>

            {/* Features */}
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Covered</p>
            <ul className="space-y-1 mb-3">
              {rec.provider.keyFeatures.slice(0, 3).map((f) => (
                <li key={f} className="flex items-start gap-1.5 text-xs text-gray-700">
                  <Check className="h-3.5 w-3.5 text-green-500 mt-0.5 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>

            {/* Not covered */}
            {rec.provider.notCovered.length > 0 && (
              <>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Not Covered</p>
                <ul className="space-y-1 mb-3">
                  {rec.provider.notCovered.slice(0, 2).map((nc) => (
                    <li key={nc} className="flex items-start gap-1.5 text-xs text-gray-500">
                      <XIcon className="h-3.5 w-3.5 text-red-400 mt-0.5 shrink-0" />
                      {nc}
                    </li>
                  ))}
                </ul>
              </>
            )}

            {/* Add-ons */}
            {rec.provider.addOns.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-auto">
                {rec.provider.addOns.slice(0, 3).map((a) => (
                  <Badge key={a} variant="outline" className="text-xs px-1.5 py-0">+ {a}</Badge>
                ))}
              </div>
            )}

            {/* Best for */}
            <div className="mt-3 rounded-lg bg-gray-50 p-2">
              <p className="text-xs text-gray-500">Best for: <span className="font-medium text-gray-700">{rec.provider.bestFor}</span></p>
            </div>
          </div>
        ))}
      </div>

      {/* Comparison summary table */}
      <div className="rounded-2xl border bg-white overflow-x-auto shadow-sm">
        <table className="w-full min-w-[520px] text-sm">
          <thead>
            <tr className="border-b bg-gray-50 text-xs text-gray-500">
              <th className="py-3 px-4 text-left">Insurer</th>
              <th className="py-3 px-4 text-left">Plan</th>
              <th className="py-3 px-4 text-right">Premium/yr</th>
              <th className="py-3 px-4 text-right">IDV</th>
              <th className="py-3 px-4 text-right">Claim Ratio</th>
              <th className="py-3 px-4 text-right">Garages</th>
            </tr>
          </thead>
          <tbody>
            {recommendations.map((rec, i) => (
              <tr key={rec.provider.id} className={cn("border-b last:border-0", i % 2 === 0 ? "bg-white" : "bg-gray-50/50", rec.badge === "Top Pick" ? "bg-green-50" : "")}>
                <td className="py-3 px-4 font-medium">
                  {rec.provider.logo} {rec.provider.name}
                  {rec.badge && <span className="ml-2 text-xs text-green-700 font-semibold">({rec.badge})</span>}
                </td>
                <td className="py-3 px-4">
                  <span className={cn("rounded-full px-2 py-0.5 text-xs font-semibold", PLAN_COLORS[rec.provider.planType])}>
                    {rec.provider.planType}
                  </span>
                </td>
                <td className="py-3 px-4 text-right font-bold text-blue-700">{formatINR(rec.estimatedPremium)}</td>
                <td className="py-3 px-4 text-right text-gray-700">
                  {rec.estimatedIDV > 0 ? formatINR(rec.estimatedIDV) : "—"}
                </td>
                <td className="py-3 px-4 text-right font-semibold text-green-700">{rec.provider.claimSettlementRatio}%</td>
                <td className="py-3 px-4 text-right text-gray-600">{rec.provider.networkGarages.toLocaleString()}+</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-gray-400 text-center">
        * Premiums are indicative estimates. Actual premiums vary by city, RTO zone, NCAP rating & insurer discretion. Third-party premium as per IRDAI tariff.
      </p>
    </div>
  );
}
