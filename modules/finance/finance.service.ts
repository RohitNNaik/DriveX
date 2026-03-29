import { getLoanOffers } from "@/lib/loan-engine";
import { getInsuranceRecommendations } from "@/lib/insurance-engine";

export interface LoanInput {
  carPrice: number;
  downPayment: number;
  tenureMonths: number;
  creditScore?: number; // numeric CIBIL score (300-900) — converted to tier internally
}

function numericScoreToTier(score: number): "excellent" | "good" | "fair" {
  if (score >= 750) return "excellent";
  if (score >= 650) return "good";
  return "fair";
}

export interface InsuranceInput {
  carPrice: number;
  carAge: number;
  engineCC: number;
  isEV?: boolean;
}

export function computeLoanOffers(input: LoanInput) {
  const principal = Math.max(0, input.carPrice - input.downPayment);
  const creditTier = numericScoreToTier(input.creditScore ?? 700);
  const offers = getLoanOffers(principal, input.tenureMonths, creditTier);

  const emi = offers[0]?.emi ?? 0;
  const bestRate = offers[0]?.appliedRate ?? 0;

  return {
    principal,
    emi,
    bestRate,
    offers,
  };
}

export function computeInsurance(input: InsuranceInput) {
  return getInsuranceRecommendations(
    input.carPrice,
    input.carAge,
    input.engineCC,
    input.isEV ?? false
  );
}
