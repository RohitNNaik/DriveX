export interface LoanProvider {
  id: string;
  name: string;
  logo: string; // emoji fallback
  type: "Bank" | "NBFC" | "Fintech";
  minRate: number; // % p.a.
  maxRate: number;
  processingFee: number; // % of loan amount
  processingFeeMin: number; // minimum ₹ cap
  processingFeeMax: number; // maximum ₹ cap
  maxLTV: number; // % of car on-road price
  maxTenureMonths: number;
  minLoanAmount: number;
  maxLoanAmount: number;
  features: string[];
  bestFor: string;
  preApprovalTime: string;
}

export interface LoanOffer {
  provider: LoanProvider;
  appliedRate: number;
  emi: number;
  totalInterest: number;
  totalPayable: number;
  processingFeeAmount: number;
  effectiveCost: number; // total payable + processing fee
  score: number; // recommendation score
  badge?: string;
}

export const LOAN_PROVIDERS: LoanProvider[] = [
  {
    id: "sbi",
    name: "SBI Car Loan",
    logo: "🏦",
    type: "Bank",
    minRate: 8.75,
    maxRate: 10.75,
    processingFee: 0.5,
    processingFeeMin: 1000,
    processingFeeMax: 10000,
    maxLTV: 85,
    maxTenureMonths: 84,
    minLoanAmount: 100000,
    maxLoanAmount: 50000000,
    features: ["No prepayment charges", "Doorstep service", "Online tracking"],
    bestFor: "Salaried with salary account",
    preApprovalTime: "2–3 days",
  },
  {
    id: "hdfc",
    name: "HDFC Bank",
    logo: "🏛",
    type: "Bank",
    minRate: 8.9,
    maxRate: 11.5,
    processingFee: 0.5,
    processingFeeMin: 3000,
    processingFeeMax: 15000,
    maxLTV: 100,
    maxTenureMonths: 84,
    minLoanAmount: 200000,
    maxLoanAmount: 150000000,
    features: ["100% on-road funding", "Pre-approved in 10 min", "Flexible tenure"],
    bestFor: "HDFC account holders & salaried",
    preApprovalTime: "10 minutes",
  },
  {
    id: "icici",
    name: "ICICI Bank",
    logo: "🏢",
    type: "Bank",
    minRate: 9.0,
    maxRate: 12.0,
    processingFee: 0.5,
    processingFeeMin: 2500,
    processingFeeMax: 15000,
    maxLTV: 100,
    maxTenureMonths: 84,
    minLoanAmount: 200000,
    maxLoanAmount: 150000000,
    features: ["Instant in-principle approval", "Online account management", "Part-payment allowed"],
    bestFor: "Existing ICICI customers",
    preApprovalTime: "30 minutes",
  },
  {
    id: "axis",
    name: "Axis Bank",
    logo: "🔷",
    type: "Bank",
    minRate: 9.25,
    maxRate: 13.0,
    processingFee: 1.0,
    processingFeeMin: 3500,
    processingFeeMax: 20000,
    maxLTV: 95,
    maxTenureMonths: 84,
    minLoanAmount: 100000,
    maxLoanAmount: 150000000,
    features: ["Up to 95% funding", "Flexible repayment", "Balance transfer available"],
    bestFor: "High credit score applicants",
    preApprovalTime: "1–2 days",
  },
  {
    id: "kotak",
    name: "Kotak Mahindra",
    logo: "🔴",
    type: "Bank",
    minRate: 8.99,
    maxRate: 14.0,
    processingFee: 0.5,
    processingFeeMin: 5000,
    processingFeeMax: 10000,
    maxLTV: 100,
    maxTenureMonths: 60,
    minLoanAmount: 250000,
    maxLoanAmount: 100000000,
    features: ["100% on-road price", "Quick disbursal", "Door-step service"],
    bestFor: "Business owners & self-employed",
    preApprovalTime: "1–2 days",
  },
  {
    id: "bajaj",
    name: "Bajaj Finserv",
    logo: "🅱️",
    type: "NBFC",
    minRate: 9.5,
    maxRate: 15.0,
    processingFee: 2.0,
    processingFeeMin: 3999,
    processingFeeMax: 25000,
    maxLTV: 95,
    maxTenureMonths: 84,
    minLoanAmount: 100000,
    maxLoanAmount: 80000000,
    features: ["Minimal documentation", "Pre-approved offers", "Flexi loan option"],
    bestFor: "Self-employed & low CIBIL",
    preApprovalTime: "Same day",
  },
  {
    id: "tata-capital",
    name: "Tata Capital",
    logo: "🌟",
    type: "NBFC",
    minRate: 9.25,
    maxRate: 14.0,
    processingFee: 1.0,
    processingFeeMin: 5000,
    processingFeeMax: 20000,
    maxLTV: 90,
    maxTenureMonths: 72,
    minLoanAmount: 200000,
    maxLoanAmount: 100000000,
    features: ["Zero foreclosure charges", "Custom tenure", "Balance transfer"],
    bestFor: "Tata car buyers",
    preApprovalTime: "2–3 days",
  },
];

function calcEMI(principal: number, rate: number, months: number): number {
  const r = rate / 12 / 100;
  if (r === 0) return principal / months;
  return (principal * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
}

function clamp(val: number, min: number, max: number) {
  return Math.min(Math.max(val, min), max);
}

export function getLoanOffers(
  principal: number,
  tenure: number,
  creditScore: "excellent" | "good" | "fair" = "good"
): LoanOffer[] {
  const rateMultiplier = creditScore === "excellent" ? 0 : creditScore === "good" ? 0.5 : 1.0;

  return LOAN_PROVIDERS.map((p) => {
    if (principal < p.minLoanAmount || principal > p.maxLoanAmount) return null;
    if (tenure > p.maxTenureMonths) return null;

    // Apply rate based on credit score (excellent → min rate, fair → max rate)
    const appliedRate = p.minRate + (p.maxRate - p.minRate) * rateMultiplier * 0.6;
    const roundedRate = Math.round(appliedRate * 100) / 100;

    const emi = Math.round(calcEMI(principal, roundedRate, tenure));
    const totalPayable = emi * tenure;
    const totalInterest = totalPayable - principal;

    const rawFee = principal * (p.processingFee / 100);
    const processingFeeAmount = Math.round(
      clamp(rawFee, p.processingFeeMin, p.processingFeeMax)
    );
    const effectiveCost = totalPayable + processingFeeAmount;

    // Score: lower effective cost = better; bonus for fast approval & high LTV
    let score = 1000000 / effectiveCost;
    if (p.preApprovalTime.includes("min")) score += 5;
    if (p.maxLTV >= 100) score += 3;
    if (p.type === "Bank") score += 2;

    return {
      provider: p,
      appliedRate: roundedRate,
      emi,
      totalInterest: Math.round(totalInterest),
      totalPayable: Math.round(totalPayable),
      processingFeeAmount,
      effectiveCost: Math.round(effectiveCost),
      score,
    } satisfies LoanOffer;
  })
    .filter(Boolean)
    .sort((a, b) => b!.score - a!.score)
    .map((offer, i) => ({
      ...offer!,
      badge: i === 0 ? "Best Deal" : i === 1 ? "Runner Up" : undefined,
    }));
}
