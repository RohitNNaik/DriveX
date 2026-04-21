"use client";

import { useState } from "react";
import Link from "next/link";
import { CARS } from "@/lib/data";
import { Car } from "@/lib/types";
import {
  ChevronRight, ChevronLeft, ArrowRight, RotateCcw,
  Star, Fuel, Zap, Gauge, Heart, GitCompare, Sparkles,
  CheckCircle2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useGarage } from "@/context/GarageContext";
import { useCompare } from "@/context/CompareContext";

// ── Types ────────────────────────────────────────────────────────────────────

interface WizardState {
  budget:    [number, number];
  fuelType:  string;
  bodyType:  string;
  useCase:   string;
  features:  string[];
}

const INITIAL: WizardState = {
  budget:   [300000, 2000000],
  fuelType:  "",
  bodyType:  "",
  useCase:   "",
  features:  [],
};

// ── Step data ────────────────────────────────────────────────────────────────

const BUDGETS = [
  { label: "Under ₹5L",   min: 0,       max: 500000  },
  { label: "₹5L – ₹8L",  min: 500000,  max: 800000  },
  { label: "₹8L – ₹12L", min: 800000,  max: 1200000 },
  { label: "₹12L – ₹20L",min: 1200000, max: 2000000 },
  { label: "₹20L – ₹40L",min: 2000000, max: 4000000 },
  { label: "Above ₹40L",  min: 4000000, max: 99999999},
];

const FUEL_TYPES = [
  { value: "Petrol",   emoji: "⛽", desc: "Widely available, lower upfront cost" },
  { value: "Diesel",   emoji: "🛢️", desc: "Better highway mileage, higher torque" },
  { value: "Electric", emoji: "⚡", desc: "Zero emissions, lower running cost" },
  { value: "Hybrid",   emoji: "🌿", desc: "Best of both worlds" },
  { value: "Any",      emoji: "🔄", desc: "Open to any fuel type" },
];

const BODY_TYPES = [
  { value: "SUV",       emoji: "🚙", desc: "High ground clearance, spacious" },
  { value: "Sedan",     emoji: "🚗", desc: "Comfortable, great highway car" },
  { value: "Hatchback", emoji: "🚘", desc: "Compact, easy to park in cities" },
  { value: "MPV",       emoji: "🚐", desc: "Maximum space, 7+ seater" },
  { value: "Any",       emoji: "🔄", desc: "No preference" },
];

const USE_CASES = [
  { value: "City",        emoji: "🏙️", desc: "Daily commute, stop-and-go traffic" },
  { value: "Highway",     emoji: "🛣️", desc: "Long drives, road trips" },
  { value: "Family",      emoji: "👨‍👩‍👧", desc: "Safe, spacious, practical" },
  { value: "Performance", emoji: "🏎️", desc: "Sporty, powerful, fun to drive" },
  { value: "Budget",      emoji: "💰", desc: "Best value for money" },
];

const FEATURE_OPTIONS = [
  { value: "sunroof",    label: "Sunroof / Moonroof",   emoji: "🌤️" },
  { value: "automatic",  label: "Automatic gearbox",    emoji: "⚙️" },
  { value: "adas",       label: "ADAS / Safety suite",  emoji: "🛡️" },
  { value: "ev",         label: "Electric / EV only",   emoji: "⚡" },
  { value: "7seater",    label: "7 seats",               emoji: "💺" },
  { value: "alloy",      label: "Alloy wheels",          emoji: "⭕" },
  { value: "wireless",   label: "Wireless Android/Apple",emoji: "📱" },
  { value: "ventilated", label: "Ventilated seats",      emoji: "❄️" },
];

const STEPS = [
  { title: "What's your budget?",       subtitle: "We'll filter out-of-range options" },
  { title: "Preferred fuel type?",      subtitle: "Pick what suits your lifestyle" },
  { title: "Which body style?",         subtitle: "Choose the shape that fits your life" },
  { title: "Primary use case?",         subtitle: "We'll weight the right specs for you" },
  { title: "Must-have features?",       subtitle: "Select any deal-breakers (optional)" },
];

// ── Matching engine ──────────────────────────────────────────────────────────

function matchScore(car: Car, state: WizardState): number {
  let score = 0;

  // Budget (0-30 pts)
  if (car.price >= state.budget[0] && car.price <= state.budget[1]) {
    score += 30;
    // Bonus for being well within budget
    const rangeSize = state.budget[1] - state.budget[0];
    const mid = (state.budget[0] + state.budget[1]) / 2;
    const distFromMid = Math.abs(car.price - mid);
    if (rangeSize > 0) score += Math.round(10 * (1 - distFromMid / rangeSize));
  }

  // Fuel type (0-20 pts)
  if (state.fuelType === "Any" || !state.fuelType) {
    score += 15;
  } else if (car.fuelType === state.fuelType) {
    score += 20;
  }

  // Body type (0-20 pts)
  if (state.bodyType === "Any" || !state.bodyType) {
    score += 15;
  } else if (car.bodyType === state.bodyType) {
    score += 20;
  }

  // Use case / tags (0-20 pts)
  if (state.useCase) {
    if ((car.tags as string[]).includes(state.useCase)) score += 20;
    else if (state.useCase === "Budget" && car.price < 1000000) score += 12;
    else if (state.useCase === "Performance" && car.power > 130) score += 12;
  } else {
    score += 10;
  }

  // Features (0-20 pts, ~4 pts each)
  for (const feat of state.features) {
    if (feat === "ev"         && car.fuelType === "Electric")   score += 5;
    if (feat === "automatic"  && car.transmission === "Automatic") score += 4;
    if (feat === "7seater"    && car.seating >= 7)              score += 5;
    if (feat === "adas"       && car.airbags >= 6)              score += 4;
  }

  // Rating bonus
  score += Math.round((car.rating - 3) * 4);

  return Math.max(0, Math.min(100, score));
}

function getResults(state: WizardState): Array<{ car: Car; score: number }> {
  return CARS
    .map((car) => ({ car, score: matchScore(car, state) }))
    .filter(({ score }) => score >= 35)
    .sort((a, b) => b.score - a.score)
    .slice(0, 6);
}

function formatPrice(p: number) {
  return p >= 100000 ? `₹${(p / 100000).toFixed(1)}L` : `₹${(p / 1000).toFixed(0)}K`;
}

const BODY_GRADIENTS: Record<string, string> = {
  SUV:       "from-blue-500 to-indigo-700",
  Sedan:     "from-slate-500 to-slate-700",
  Hatchback: "from-orange-400 to-amber-600",
  MPV:       "from-teal-500 to-cyan-700",
  Electric:  "from-violet-500 to-indigo-700",
};

// ── Step components ──────────────────────────────────────────────────────────

function StepBudget({ state, update }: { state: WizardState; update: (s: Partial<WizardState>) => void }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {BUDGETS.map((b) => {
        const active = state.budget[0] === b.min && state.budget[1] === b.max;
        return (
          <button
            key={b.label}
            onClick={() => update({ budget: [b.min, b.max] })}
            className={cn(
              "flex flex-col items-center gap-1 rounded-2xl border-2 px-4 py-4 font-bold text-sm transition-all",
              active
                ? "border-blue-500 bg-blue-50 text-blue-700 shadow-md shadow-blue-500/20"
                : "border-slate-200 bg-white text-slate-700 hover:border-blue-300 hover:bg-blue-50/50"
            )}
          >
            <span className="text-2xl">💰</span>
            {b.label}
            {active && <CheckCircle2 className="h-4 w-4 text-blue-500 mt-0.5" />}
          </button>
        );
      })}
    </div>
  );
}

function StepFuel({ state, update }: { state: WizardState; update: (s: Partial<WizardState>) => void }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {FUEL_TYPES.map((f) => {
        const active = state.fuelType === f.value;
        return (
          <button
            key={f.value}
            onClick={() => update({ fuelType: f.value })}
            className={cn(
              "flex items-center gap-3 rounded-2xl border-2 px-4 py-3.5 text-left transition-all",
              active
                ? "border-blue-500 bg-blue-50 shadow-md shadow-blue-500/20"
                : "border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/50"
            )}
          >
            <span className="text-3xl">{f.emoji}</span>
            <div>
              <p className={cn("font-bold text-sm", active ? "text-blue-700" : "text-slate-800")}>{f.value}</p>
              <p className="text-xs text-slate-500">{f.desc}</p>
            </div>
            {active && <CheckCircle2 className="h-4 w-4 text-blue-500 ml-auto shrink-0" />}
          </button>
        );
      })}
    </div>
  );
}

function StepBodyType({ state, update }: { state: WizardState; update: (s: Partial<WizardState>) => void }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {BODY_TYPES.map((b) => {
        const active = state.bodyType === b.value;
        return (
          <button
            key={b.value}
            onClick={() => update({ bodyType: b.value })}
            className={cn(
              "flex items-center gap-3 rounded-2xl border-2 px-4 py-3.5 text-left transition-all",
              active
                ? "border-blue-500 bg-blue-50 shadow-md shadow-blue-500/20"
                : "border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/50"
            )}
          >
            <span className="text-3xl">{b.emoji}</span>
            <div>
              <p className={cn("font-bold text-sm", active ? "text-blue-700" : "text-slate-800")}>{b.value}</p>
              <p className="text-xs text-slate-500">{b.desc}</p>
            </div>
            {active && <CheckCircle2 className="h-4 w-4 text-blue-500 ml-auto shrink-0" />}
          </button>
        );
      })}
    </div>
  );
}

function StepUseCase({ state, update }: { state: WizardState; update: (s: Partial<WizardState>) => void }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {USE_CASES.map((u) => {
        const active = state.useCase === u.value;
        return (
          <button
            key={u.value}
            onClick={() => update({ useCase: u.value })}
            className={cn(
              "flex items-center gap-3 rounded-2xl border-2 px-4 py-3.5 text-left transition-all",
              active
                ? "border-blue-500 bg-blue-50 shadow-md shadow-blue-500/20"
                : "border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/50"
            )}
          >
            <span className="text-3xl">{u.emoji}</span>
            <div>
              <p className={cn("font-bold text-sm", active ? "text-blue-700" : "text-slate-800")}>{u.value}</p>
              <p className="text-xs text-slate-500">{u.desc}</p>
            </div>
            {active && <CheckCircle2 className="h-4 w-4 text-blue-500 ml-auto shrink-0" />}
          </button>
        );
      })}
    </div>
  );
}

function StepFeatures({ state, update }: { state: WizardState; update: (s: Partial<WizardState>) => void }) {
  function toggle(v: string) {
    update({
      features: state.features.includes(v)
        ? state.features.filter((f) => f !== v)
        : [...state.features, v],
    });
  }
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {FEATURE_OPTIONS.map((f) => {
        const active = state.features.includes(f.value);
        return (
          <button
            key={f.value}
            onClick={() => toggle(f.value)}
            className={cn(
              "flex flex-col items-center gap-1.5 rounded-2xl border-2 px-3 py-4 text-center text-xs font-bold transition-all",
              active
                ? "border-blue-500 bg-blue-50 text-blue-700 shadow-md shadow-blue-500/20"
                : "border-slate-200 bg-white text-slate-700 hover:border-blue-300 hover:bg-blue-50/50"
            )}
          >
            <span className="text-2xl">{f.emoji}</span>
            {f.label}
            {active && <CheckCircle2 className="h-3.5 w-3.5 text-blue-500" />}
          </button>
        );
      })}
    </div>
  );
}

// ── Result card ───────────────────────────────────────────────────────────────

function ResultCard({ car, score }: { car: Car; score: number }) {
  const { addToGarage, removeFromGarage, isInGarage } = useGarage();
  const { addCar, removeCar, isSelected, isFull } = useCompare();
  const saved    = isInGarage(car.id);
  const selected = isSelected(car.id);
  const gradient = BODY_GRADIENTS[car.bodyType] ?? "from-slate-500 to-slate-700";

  const matchLabel = score >= 80 ? "Perfect match" : score >= 65 ? "Great match" : "Good match";
  const matchColor = score >= 80 ? "bg-emerald-500" : score >= 65 ? "bg-blue-500" : "bg-amber-500";

  return (
    <div className="group relative flex flex-col rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
      {/* Match score bar */}
      <div className="h-1.5 w-full bg-slate-100">
        <div className={`h-full ${matchColor} transition-all duration-700`} style={{ width: `${score}%` }} />
      </div>

      {/* Image */}
      <div className={`relative h-32 bg-gradient-to-br ${gradient} flex items-center justify-center overflow-hidden`}>
        <div className="absolute -top-5 -right-5 h-20 w-20 rounded-full bg-white/10" />
        <span className="relative z-10 text-5xl group-hover:scale-110 transition-transform duration-300">
          {car.fuelType === "Electric" ? "⚡🚗" : "🚗"}
        </span>
        <span className={`absolute top-2 left-2 rounded-full ${matchColor} px-2.5 py-0.5 text-[10px] font-black text-white`}>
          {matchLabel} · {score}%
        </span>
        <button
          onClick={() => saved ? removeFromGarage(car.id) : addToGarage(car)}
          className={cn(
            "absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-full shadow-md transition-all",
            saved ? "bg-rose-500 text-white" : "bg-white/90 text-slate-400 hover:text-rose-500"
          )}
        >
          <Heart className={cn("h-3.5 w-3.5", saved && "fill-white")} />
        </button>
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col gap-2 flex-1">
        <div>
          <p className="text-xs text-slate-500">{car.brand}</p>
          <h3 className="font-black text-slate-900 leading-tight">{car.name}</h3>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-xl font-black text-blue-700">{formatPrice(car.price)}</span>
          <span className="text-xs text-slate-400">ex-showroom</span>
        </div>
        <div className="flex gap-1.5 flex-wrap">
          <span className="flex items-center gap-1 rounded-lg bg-slate-50 border border-slate-100 px-2 py-1 text-[10px] font-bold text-slate-600">
            {car.fuelType === "Electric" ? <Zap className="h-3 w-3 text-violet-500" /> : <Fuel className="h-3 w-3 text-green-500" />}
            {car.fuelType === "Electric" ? "EV" : `${car.mileage} kmpl`}
          </span>
          <span className="flex items-center gap-1 rounded-lg bg-slate-50 border border-slate-100 px-2 py-1 text-[10px] font-bold text-slate-600">
            <Gauge className="h-3 w-3 text-orange-500" /> {car.power} bhp
          </span>
          <span className="flex items-center gap-1 rounded-lg bg-slate-50 border border-slate-100 px-2 py-1 text-[10px] font-bold text-slate-600">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" /> {car.rating}
          </span>
        </div>
        <div className="flex gap-2 mt-auto pt-1">
          <button
            onClick={() => selected ? removeCar(car.id) : addCar(car)}
            disabled={!selected && isFull}
            className={cn(
              "flex flex-1 items-center justify-center gap-1 rounded-xl border px-3 py-2 text-xs font-bold transition-all",
              selected
                ? "border-emerald-400 bg-emerald-50 text-emerald-700"
                : isFull
                ? "cursor-not-allowed border-slate-200 bg-slate-50 text-slate-400"
                : "border-slate-200 text-slate-600 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
            )}
          >
            <GitCompare className="h-3 w-3" />
            {selected ? "Added" : "Compare"}
          </button>
          <Link
            href={`/cars/${car.id}`}
            className="flex flex-1 items-center justify-center gap-1 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-3 py-2 text-xs font-bold text-white shadow-sm hover:from-blue-700 hover:to-indigo-700 transition-all"
          >
            View <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function ShortlisterPage() {
  const [step, setStep] = useState(0);
  const [state, setState] = useState<WizardState>(INITIAL);
  const [done, setDone] = useState(false);

  function update(partial: Partial<WizardState>) {
    setState((prev) => ({ ...prev, ...partial }));
  }

  function next() {
    if (step < STEPS.length - 1) setStep((s) => s + 1);
    else setDone(true);
  }

  function back() {
    if (done) { setDone(false); return; }
    setStep((s) => Math.max(0, s - 1));
  }

  function reset() {
    setState(INITIAL);
    setStep(0);
    setDone(false);
  }

  const canNext =
    (step === 0 && state.budget[1] > 0) ||
    (step === 1 && !!state.fuelType) ||
    (step === 2 && !!state.bodyType) ||
    (step === 3 && !!state.useCase) ||
    step === 4;

  const results = done ? getResults(state) : [];

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Hero */}
      <div className="bg-gradient-to-r from-slate-900 via-violet-950 to-slate-900">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 py-12">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-500/20 border border-violet-500/30 px-3 py-1 text-xs font-bold text-violet-300">
                  <Sparkles className="h-3 w-3" /> Smart My Car Pick
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-white">
                {done ? "Your shortlist is ready!" : "Find your perfect car"}
              </h1>
              <p className="text-slate-400 mt-1.5 text-sm">
                {done
                  ? `${results.length} car${results.length !== 1 ? "s" : ""} matched your preferences`
                  : "Answer 5 quick questions. We'll find the best matches."}
              </p>
            </div>
            <div className="text-5xl hidden sm:block">{done ? "🎯" : "🧠"}</div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-8">
        {!done ? (
          <div className="space-y-6">
            {/* Progress bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                  Step {step + 1} of {STEPS.length}
                </span>
                <span className="text-xs text-slate-400">
                  {Math.round(((step + 1) / STEPS.length) * 100)}% complete
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-200 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-violet-500 to-blue-500 rounded-full transition-all duration-500"
                  style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
                />
              </div>
              {/* Step dots */}
              <div className="flex justify-between">
                {STEPS.map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      "h-2 w-2 rounded-full transition-all duration-300",
                      i < step ? "bg-violet-500 scale-100" :
                      i === step ? "bg-blue-500 scale-125" :
                      "bg-slate-300"
                    )}
                  />
                ))}
              </div>
            </div>

            {/* Step card */}
            <div className="rounded-3xl bg-white border border-slate-200 shadow-sm p-6">
              <h2 className="text-xl font-black text-slate-900 mb-1">{STEPS[step].title}</h2>
              <p className="text-sm text-slate-500 mb-5">{STEPS[step].subtitle}</p>

              {step === 0 && <StepBudget state={state} update={update} />}
              {step === 1 && <StepFuel state={state} update={update} />}
              {step === 2 && <StepBodyType state={state} update={update} />}
              {step === 3 && <StepUseCase state={state} update={update} />}
              {step === 4 && <StepFeatures state={state} update={update} />}
            </div>

            {/* Nav */}
            <div className="flex items-center justify-between">
              <button
                onClick={back}
                disabled={step === 0}
                className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-600 hover:border-slate-300 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft className="h-4 w-4" /> Back
              </button>
              <button
                onClick={next}
                disabled={!canNext}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 to-blue-600 px-6 py-2.5 text-sm font-bold text-white shadow-md shadow-violet-500/30 hover:shadow-violet-500/50 hover:-translate-y-0.5 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0 transition-all btn-glow-violet"
              >
                {step === STEPS.length - 1 ? "Find my cars 🎯" : "Next"}
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Criteria summary */}
            <div className="rounded-2xl bg-white border border-slate-200 p-4 flex flex-wrap gap-2">
              <span className="text-xs font-bold text-slate-500 self-center mr-1">Your criteria:</span>
              {[
                `💰 ${BUDGETS.find(b => b.min === state.budget[0])?.label ?? "Any budget"}`,
                state.fuelType && state.fuelType !== "Any" ? `⛽ ${state.fuelType}` : null,
                state.bodyType && state.bodyType !== "Any" ? `🚗 ${state.bodyType}` : null,
                state.useCase ? `🎯 ${state.useCase}` : null,
                ...state.features.map((f) => FEATURE_OPTIONS.find(o => o.value === f)?.label ?? f),
              ].filter(Boolean).map((c) => (
                <span key={c} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                  {c}
                </span>
              ))}
            </div>

            {results.length === 0 ? (
              <div className="rounded-3xl bg-white border border-slate-200 p-10 text-center">
                <p className="text-4xl mb-3">😕</p>
                <h3 className="font-black text-slate-900 text-lg mb-1">No exact matches</h3>
                <p className="text-sm text-slate-500 mb-4">Try relaxing your criteria — especially budget or fuel type.</p>
                <button onClick={reset} className="flex items-center gap-2 mx-auto rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white">
                  <RotateCcw className="h-4 w-4" /> Start over
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {results.map(({ car, score }) => (
                    <ResultCard key={car.id} car={car} score={score} />
                  ))}
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-3 pt-2">
                  <button
                    onClick={reset}
                    className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all"
                  >
                    <RotateCcw className="h-4 w-4" /> Refine criteria
                  </button>
                  <Link
                    href="/compare"
                    className="flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm font-semibold text-blue-700 hover:bg-blue-100 transition-all"
                  >
                    <GitCompare className="h-4 w-4" /> Compare selected
                  </Link>
                  <Link
                    href="/ai-advisor"
                    className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 to-blue-600 px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-violet-500/30 hover:shadow-violet-500/50 transition-all"
                  >
                    <Sparkles className="h-4 w-4" /> Ask AI for deeper advice
                  </Link>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
