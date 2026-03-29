"use client";

import { useState, useMemo } from "react";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import DealerForm from "@/components/dealer-form/DealerForm";
import LoanComparison from "@/components/loan-comparison/LoanComparison";
import InsuranceRecommendation from "@/components/insurance-recommendation/InsuranceRecommendation";

function formatINR(n: number) {
  return `₹${n.toLocaleString("en-IN")}`;
}

function calcEMI(principal: number, rate: number, months: number) {
  const r = rate / 12 / 100;
  if (r === 0) return principal / months;
  return (principal * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
}

export default function LoanCalculatorPage() {
  // EMI Calculator state
  const [carPrice, setCarPrice] = useState(1000000);
  const [downPayment, setDownPayment] = useState(200000);
  const [interestRate, setInterestRate] = useState(9);
  const [tenure, setTenure] = useState(60);

  // Loan comparison state
  const [creditScore, setCreditScore] = useState<"excellent" | "good" | "fair">("good");

  // Insurance state
  const [carAge, setCarAge] = useState(0);
  const [engineCC, setEngineCC] = useState(1500);
  const [isEV, setIsEV] = useState(false);

  const principal = Math.max(0, carPrice - downPayment);

  const { emi, totalInterest, totalPayable } = useMemo(() => {
    const emi = calcEMI(principal, interestRate, tenure);
    const totalPayable = emi * tenure;
    const totalInterest = totalPayable - principal;
    return {
      emi: Math.round(emi),
      totalInterest: Math.round(totalInterest),
      totalPayable: Math.round(totalPayable),
    };
  }, [principal, interestRate, tenure]);

  // Shared sliders panel
  const InputPanel = (
    <div className="bg-white rounded-2xl border shadow-sm p-6 space-y-6">
      <h3 className="font-semibold text-base">Your Loan Parameters</h3>

      {/* Car Price */}
      <div className="space-y-2">
        <div className="flex justify-between">
          <Label>Car Price</Label>
          <span className="text-sm font-bold text-blue-700">{formatINR(carPrice)}</span>
        </div>
        <Slider min={200000} max={5000000} step={50000} value={[carPrice]}
          onValueChange={([v]) => {
            setCarPrice(v);
            if (downPayment > v * 0.8) setDownPayment(Math.round(v * 0.2));
          }} />
        <div className="flex justify-between text-xs text-gray-400"><span>₹2L</span><span>₹50L</span></div>
      </div>

      {/* Down Payment */}
      <div className="space-y-2">
        <div className="flex justify-between">
          <Label>Down Payment</Label>
          <span className="text-sm font-bold text-green-700">{formatINR(downPayment)}</span>
        </div>
        <Slider min={0} max={Math.round(carPrice * 0.8)} step={10000} value={[downPayment]}
          onValueChange={([v]) => setDownPayment(v)} />
        <div className="flex justify-between text-xs text-gray-400"><span>₹0</span><span>80%</span></div>
      </div>

      {/* Interest Rate */}
      <div className="space-y-2">
        <div className="flex justify-between">
          <Label>Interest Rate</Label>
          <span className="text-sm font-bold text-orange-600">{interestRate}% p.a.</span>
        </div>
        <Slider min={6} max={18} step={0.5} value={[interestRate]}
          onValueChange={([v]) => setInterestRate(v)} />
        <div className="flex justify-between text-xs text-gray-400"><span>6%</span><span>18%</span></div>
      </div>

      {/* Tenure */}
      <div className="space-y-2">
        <div className="flex justify-between">
          <Label>Loan Tenure</Label>
          <span className="text-sm font-bold text-purple-600">{tenure / 12} yrs ({tenure} mo)</span>
        </div>
        <Slider min={12} max={84} step={12} value={[tenure]}
          onValueChange={([v]) => setTenure(v)} />
        <div className="flex justify-between text-xs text-gray-400"><span>1 yr</span><span>7 yrs</span></div>
      </div>

      {/* Credit Score (used by comparison tab) */}
      <div className="space-y-2">
        <Label>Credit Profile (CIBIL)</Label>
        <Select value={creditScore} onValueChange={(v) => setCreditScore(v as typeof creditScore)}>
          <SelectTrigger className="h-9 text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="excellent">Excellent (750+)</SelectItem>
            <SelectItem value="good">Good (650–749)</SelectItem>
            <SelectItem value="fair">Fair (550–649)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Car Age (insurance) */}
      <div className="space-y-2">
        <div className="flex justify-between">
          <Label>Car Age (years)</Label>
          <span className="text-sm font-bold text-gray-700">{carAge === 0 ? "New" : `${carAge} yr`}</span>
        </div>
        <Slider min={0} max={15} step={1} value={[carAge]}
          onValueChange={([v]) => setCarAge(v)} />
        <div className="flex justify-between text-xs text-gray-400"><span>New</span><span>15 yrs</span></div>
      </div>

      {/* Engine CC */}
      <div className="space-y-2">
        <Label>Engine Displacement</Label>
        <Select
          value={String(engineCC)}
          onValueChange={(v) => {
            const val = parseInt(v);
            setEngineCC(val);
            setIsEV(val === 0);
          }}
        >
          <SelectTrigger className="h-9 text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0">Electric Vehicle (EV)</SelectItem>
            <SelectItem value="800">Under 1000 cc</SelectItem>
            <SelectItem value="1200">1000–1500 cc</SelectItem>
            <SelectItem value="1500">1000–1500 cc (mid)</SelectItem>
            <SelectItem value="2000">Above 1500 cc</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold mb-1">Loan & Insurance Centre</h1>
        <p className="text-gray-500 text-sm">
          Calculate EMI · Compare 7 lenders · Get insurance recommendations
        </p>
      </div>

      <Tabs defaultValue="emi" className="space-y-6">
        <TabsList className="bg-white border rounded-xl h-auto p-1 flex-wrap gap-1">
          <TabsTrigger value="emi" className="rounded-lg text-sm">🧮 EMI Calculator</TabsTrigger>
          <TabsTrigger value="compare" className="rounded-lg text-sm">🏦 Loan Comparison</TabsTrigger>
          <TabsTrigger value="insurance" className="rounded-lg text-sm">🛡 Insurance</TabsTrigger>
          <TabsTrigger value="deal" className="rounded-lg text-sm">🤝 Get Best Deal</TabsTrigger>
        </TabsList>

        {/* ── TAB 1: EMI Calculator ── */}
        <TabsContent value="emi">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {InputPanel}

            {/* Result Card */}
            <div className="flex flex-col gap-4">
              <div className="bg-gradient-to-br from-blue-700 to-blue-900 text-white rounded-2xl p-6 shadow-lg">
                <p className="text-sm text-blue-200 mb-1">Monthly EMI</p>
                <p className="text-5xl font-extrabold">{formatINR(emi)}</p>
                <p className="text-xs text-blue-300 mt-1">per month for {tenure / 12} years</p>

                <Separator className="my-4 bg-white/20" />

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-blue-200 text-xs">Loan Amount</p>
                    <p className="font-bold">{formatINR(principal)}</p>
                  </div>
                  <div>
                    <p className="text-blue-200 text-xs">Total Interest</p>
                    <p className="font-bold text-yellow-300">{formatINR(totalInterest)}</p>
                  </div>
                  <div>
                    <p className="text-blue-200 text-xs">Total Payable</p>
                    <p className="font-bold">{formatINR(totalPayable)}</p>
                  </div>
                  <div>
                    <p className="text-blue-200 text-xs">Down Payment</p>
                    <p className="font-bold text-green-300">{formatINR(downPayment)}</p>
                  </div>
                </div>
              </div>

              {/* Cost breakdown bar */}
              <div className="bg-white rounded-2xl border shadow-sm p-5">
                <p className="font-semibold text-sm mb-3">Cost Breakdown</p>
                <div className="flex rounded-full overflow-hidden h-5 mb-2">
                  <div
                    className="bg-blue-600 transition-all"
                    style={{ width: `${(principal / totalPayable) * 100}%` }}
                    title="Principal"
                  />
                  <div
                    className="bg-orange-400"
                    style={{ width: `${(totalInterest / totalPayable) * 100}%` }}
                    title="Interest"
                  />
                </div>
                <div className="flex gap-4 text-xs">
                  <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-blue-600 inline-block" />Principal ({Math.round((principal / totalPayable) * 100)}%)</span>
                  <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-orange-400 inline-block" />Interest ({Math.round((totalInterest / totalPayable) * 100)}%)</span>
                </div>
              </div>

              {/* Affordability tip */}
              <div className="rounded-2xl bg-green-50 border border-green-200 p-4">
                <p className="text-sm font-semibold text-green-800 mb-1">💡 Affordability Guide</p>
                <p className="text-xs text-green-700">
                  Your EMI of <strong>{formatINR(emi)}</strong> should ideally be ≤ 15% of your monthly income.
                  That means a minimum monthly income of{" "}
                  <strong>{formatINR(Math.round(emi / 0.15))}</strong> is recommended.
                </p>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* ── TAB 2: Loan Comparison ── */}
        <TabsContent value="compare">
          <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6">
            <div className="space-y-4">
              {InputPanel}
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 text-xs text-blue-700 space-y-1">
                <p className="font-semibold">How we compare</p>
                <p>We compute EMI, total interest, processing fees and total cost for 7 lenders — sorted by best overall value for your credit profile.</p>
              </div>
            </div>
            <LoanComparison principal={principal} tenure={tenure} creditScore={creditScore} />
          </div>
        </TabsContent>

        {/* ── TAB 3: Insurance ── */}
        <TabsContent value="insurance">
          <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6">
            <div className="space-y-4">
              {InputPanel}
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs text-amber-700 space-y-1">
                <p className="font-semibold">How we recommend</p>
                <p>Based on your car&apos;s age, engine size, and EV status, we rank 6 insurers by claim settlement ratio, IDV coverage and estimated premium.</p>
              </div>
            </div>
            <InsuranceRecommendation
              carPrice={carPrice}
              carAge={carAge}
              engineCC={engineCC}
              isEV={isEV}
            />
          </div>
        </TabsContent>

        {/* ── TAB 4: Get Best Deal ── */}
        <TabsContent value="deal">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {InputPanel}
            <div className="bg-white rounded-2xl border shadow-sm p-6">
              <p className="text-xl font-bold mb-1">🤝 Get Best Price from Dealer</p>
              <p className="text-sm text-gray-500 mb-5">
                Submit your details and a verified dealer will contact you with the best on-road price, finance options, and accessories bundle.
              </p>

              {/* Summary */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                {[
                  { label: "Car Price", value: formatINR(carPrice), color: "text-blue-700" },
                  { label: "Your Down Payment", value: formatINR(downPayment), color: "text-green-700" },
                  { label: "Loan Amount", value: formatINR(principal), color: "text-gray-800" },
                  { label: "Monthly EMI", value: formatINR(emi), color: "text-purple-700" },
                ].map((item) => (
                  <div key={item.label} className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs text-gray-500">{item.label}</p>
                    <p className={`font-bold ${item.color}`}>{item.value}</p>
                  </div>
                ))}
              </div>

              <DealerForm />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}


