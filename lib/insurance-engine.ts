export type InsurancePlanType = "Third-Party" | "Comprehensive" | "Zero Depreciation" | "Bundled";

export interface InsuranceProvider {
  id: string;
  name: string;
  logo: string;
  planType: InsurancePlanType;
  annualPremiumRate: number; // % of IDV
  basePremium: number; // flat addition in ₹
  claimSettlementRatio: number; // %
  networkGarages: number;
  keyFeatures: string[];
  notCovered: string[];
  addOns: string[];
  bestFor: string;
  idvCoverage: number; // % of car's current market value they cover as IDV
}

export interface InsuranceRecommendation {
  provider: InsuranceProvider;
  estimatedIDV: number;
  estimatedPremium: number;
  score: number;
  badge?: string;
  tag?: string;
}

export const INSURANCE_PROVIDERS: InsuranceProvider[] = [
  {
    id: "hdfc-ergo",
    name: "HDFC ERGO",
    logo: "🛡",
    planType: "Zero Depreciation",
    annualPremiumRate: 2.8,
    basePremium: 3000,
    claimSettlementRatio: 98.0,
    networkGarages: 6800,
    keyFeatures: [
      "Zero depreciation on parts",
      "Cashless at 6800+ garages",
      "24/7 roadside assistance",
      "Engine protection included",
    ],
    notCovered: ["Drunk driving", "Mechanical breakdown"],
    addOns: ["Key replacement", "Return to invoice", "Tyre protection"],
    bestFor: "New cars (0–3 years)",
    idvCoverage: 95,
  },
  {
    id: "bajaj-allianz",
    name: "Bajaj Allianz",
    logo: "🔵",
    planType: "Comprehensive",
    annualPremiumRate: 2.4,
    basePremium: 2500,
    claimSettlementRatio: 97.0,
    networkGarages: 4000,
    keyFeatures: [
      "Own damage coverage",
      "Third-party liability",
      "Personal accident cover",
      "Natural calamity cover",
    ],
    notCovered: ["Depreciation losses", "Electrical/mechanical breakdown"],
    addOns: ["Zero dep", "Engine guard", "24/7 assistance"],
    bestFor: "Best value comprehensive plan",
    idvCoverage: 90,
  },
  {
    id: "icici-lombard",
    name: "ICICI Lombard",
    logo: "🟠",
    planType: "Comprehensive",
    annualPremiumRate: 2.6,
    basePremium: 2800,
    claimSettlementRatio: 96.4,
    networkGarages: 5600,
    keyFeatures: [
      "InstaSpect — photo-based claims",
      "Spot claim settlement",
      "Wide network garages",
      "Electric vehicle cover",
    ],
    notCovered: ["Consequential loss", "Racing accidents"],
    addOns: ["Zero dep", "Consumables", "Return to invoice"],
    bestFor: "Tech-savvy & EV owners",
    idvCoverage: 92,
  },
  {
    id: "go-digit",
    name: "Go Digit",
    logo: "🟢",
    planType: "Comprehensive",
    annualPremiumRate: 2.1,
    basePremium: 2000,
    claimSettlementRatio: 95.8,
    networkGarages: 1400,
    keyFeatures: [
      "100% online, paperless",
      "Fastest claim process (self-inspection)",
      "Flexible IDV",
      "Door-to-door pickup",
    ],
    notCovered: ["Drunk driving", "Wear & tear"],
    addOns: ["Zero dep", "Engine protection", "Key loss"],
    bestFor: "Budget-conscious buyers",
    idvCoverage: 88,
  },
  {
    id: "new-india",
    name: "New India Assurance",
    logo: "🏛",
    planType: "Third-Party",
    annualPremiumRate: 0.0,
    basePremium: 0,
    claimSettlementRatio: 93.5,
    networkGarages: 3000,
    keyFeatures: [
      "Government-backed insurer",
      "Mandatory third-party cover",
      "Low fixed premium",
      "Wide branch network",
    ],
    notCovered: ["Own damage", "Theft of car", "Natural disasters"],
    addOns: [],
    bestFor: "Old cars (7+ years) or minimal coverage",
    idvCoverage: 0,
  },
  {
    id: "tata-aig",
    name: "Tata AIG",
    logo: "⭐",
    planType: "Bundled",
    annualPremiumRate: 3.0,
    basePremium: 3500,
    claimSettlementRatio: 97.5,
    networkGarages: 5500,
    keyFeatures: [
      "1+3 year bundled plan",
      "Zero dep included (1st year)",
      "Engine & gearbox cover",
      "Roadside assistance across India",
    ],
    notCovered: ["Pre-existing damage", "Racing"],
    addOns: ["EMI protection", "Hospital cash", "Return to invoice"],
    bestFor: "Brand new cars — best long-term value",
    idvCoverage: 100,
  },
];

// RTO third-party premium table (approx statutory rates — cubic capacity based)
const TP_PREMIUM: Record<string, number> = {
  "< 1000cc": 2094,
  "1000–1500cc": 3416,
  "> 1500cc": 7897,
};

function getTPPremium(engineCC: number): number {
  if (engineCC === 0) return 3416; // EV flat
  if (engineCC < 1000) return TP_PREMIUM["< 1000cc"];
  if (engineCC <= 1500) return TP_PREMIUM["1000–1500cc"];
  return TP_PREMIUM["> 1500cc"];
}

export function getInsuranceRecommendations(
  carPrice: number,
  carAge: number = 0, // years
  engineCC: number = 1500,
  isEV: boolean = false
): InsuranceRecommendation[] {
  const depreciationRate = [0, 0.05, 0.10, 0.15, 0.20, 0.25, 0.35, 0.40, 0.45, 0.50];
  const dep = depreciationRate[Math.min(carAge, 9)];
  const currentValue = carPrice * (1 - dep);

  const tpPremium = isEV ? 3416 : getTPPremium(engineCC);

  return INSURANCE_PROVIDERS.map((p) => {
    const estimatedIDV = Math.round(currentValue * (p.idvCoverage / 100));

    let estimatedPremium: number;
    if (p.planType === "Third-Party") {
      estimatedPremium = tpPremium;
    } else {
      estimatedPremium = Math.round(
        estimatedIDV * (p.annualPremiumRate / 100) + p.basePremium + tpPremium
      );
    }

    // Score: settlement ratio matters most; less premium is good; zero dep adds value
    let score = p.claimSettlementRatio * 10;
    score -= estimatedPremium / 5000;
    if (p.planType === "Zero Depreciation") score += 15;
    if (p.planType === "Bundled") score += 10;
    if (carAge <= 3 && p.planType === "Third-Party") score -= 50;
    if (carAge >= 7 && p.planType === "Third-Party") score += 30;

    let tag: string | undefined;
    if (carAge === 0 && p.planType === "Zero Depreciation") tag = "Recommended for new car";
    if (carAge === 0 && p.planType === "Bundled") tag = "Best long-term value";
    if (p.planType === "Third-Party" && carAge >= 7) tag = "Best for older cars";
    if (p.id === "go-digit") tag = "Most affordable";

    return {
      provider: p,
      estimatedIDV,
      estimatedPremium,
      score,
      tag,
    } satisfies InsuranceRecommendation;
  })
    .sort((a, b) => b.score - a.score)
    .map((rec, i) => ({
      ...rec,
      badge: i === 0 ? "Top Pick" : i === 1 ? "2nd Choice" : undefined,
    }));
}
