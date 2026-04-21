import Link from "next/link";
import { notFound } from "next/navigation";
import { CARS, CAR_VARIANTS } from "@/lib/data";
import { Car } from "@/lib/types";
import OnRoadPrice from "@/components/onroad-price/OnRoadPrice";
import {
  ArrowLeft,
  Star,
  Fuel,
  Zap,
  Users,
  Settings,
  Shield,
  CheckCircle,
  XCircle,
  GitCompare,
  Calculator,
  ChevronRight,
} from "lucide-react";
import { slugifyModel } from "@/lib/variant-compare";
import AddToCompareButton from "./AddToCompareButton";

function formatPrice(price: number) {
  if (price >= 100000) return `₹${(price / 100000).toFixed(2)}L`;
  return `₹${(price / 1000).toFixed(0)}K`;
}

async function getCar(id: string): Promise<Car | null> {
  // Try API first, fall back to static data
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000"}/api/cars/${id}`, {
      cache: "no-store",
    });
    const json = await res.json();
    if (json.success && json.data) return json.data as Car;
  } catch {
    // fall through
  }
  return (
    [...CARS, ...CAR_VARIANTS].find((c) => c.id === id) ?? null
  );
}

function hasVariants(car: Car) {
  return CAR_VARIANTS.some(
    (v) =>
      v.brand.toLowerCase() === car.brand.toLowerCase() &&
      v.model.toLowerCase() === car.model.toLowerCase()
  );
}

const BODY_GRADIENT: Record<string, string> = {
  SUV:      "from-blue-500 to-blue-700",
  Sedan:    "from-slate-500 to-slate-700",
  Hatchback:"from-orange-400 to-orange-600",
  MPV:      "from-teal-500 to-teal-700",
  Coupe:    "from-rose-500 to-rose-700",
};

const TAG_COLOR: Record<string, string> = {
  City:    "bg-blue-50 text-blue-700 border-blue-200",
  Highway: "bg-green-50 text-green-700 border-green-200",
  Family:  "bg-orange-50 text-orange-700 border-orange-200",
  "Top Pick":"bg-yellow-50 text-yellow-700 border-yellow-200",
  Budget:  "bg-slate-50 text-slate-600 border-slate-200",
  "Off-road":"bg-amber-50 text-amber-700 border-amber-200",
};

export default async function CarDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const car = await getCar(id);

  if (!car) notFound();

  const gradient = BODY_GRADIENT[car.bodyType] ?? "from-slate-500 to-slate-700";
  const variantsExist = hasVariants(car);
  const variantSlug = slugifyModel(car.brand, car.model);

  const SPECS = [
    { icon: Fuel,     label: "Fuel Type",     value: car.fuelType },
    { icon: Settings, label: "Transmission",  value: car.transmission },
    { icon: Zap,      label: "Power",         value: `${car.power} bhp` },
    { icon: Zap,      label: "Torque",        value: `${car.torque} Nm` },
    { icon: Fuel,     label: "Mileage",
      value: car.fuelType === "Electric" ? "Electric" : `${car.mileage} kmpl` },
    { icon: Settings, label: "Engine",
      value: car.engineCC === 0 ? "Electric Motor" : `${car.engineCC} cc` },
    { icon: Users,    label: "Seating",       value: `${car.seating} seats` },
    { icon: Shield,   label: "Airbags",       value: `${car.airbags} airbags` },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Back */}
      <div className="bg-white border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-3">
          <Link
            href="/cars"
            className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Browse
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

          {/* ── Left column ─────────────────────────────────── */}
          <div className="lg:col-span-3 flex flex-col gap-5">

            {/* Hero card */}
            <div className="rounded-3xl bg-white border border-slate-200 shadow-sm overflow-hidden">
              {/* Image area */}
              <div className={`relative h-56 sm:h-72 bg-gradient-to-br ${gradient} flex items-center justify-center overflow-hidden`}>
                <div className="absolute -top-8 -right-8 h-40 w-40 rounded-full bg-white/10" />
                <div className="absolute -bottom-6 -left-6 h-28 w-28 rounded-full bg-white/10" />
                <span className="relative z-10 text-8xl drop-shadow-xl">
                  {car.fuelType === "Electric" ? "⚡🚗" : "🚗"}
                </span>

                {/* Badges */}
                {car.isUsed && (
                  <span className="absolute top-4 left-4 rounded-full bg-orange-500 px-3 py-1 text-xs font-bold text-white shadow">
                    Used
                  </span>
                )}
                <div className="absolute top-4 right-4 flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1.5 shadow-md">
                  <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-black text-slate-800">{car.rating}</span>
                </div>
                <div className="absolute bottom-4 left-4 rounded-full bg-black/30 backdrop-blur-sm px-3 py-1 text-xs font-semibold text-white">
                  {car.bodyType}
                </div>
              </div>

              {/* Name + price */}
              <div className="p-6">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div>
                    <p className="text-xs text-slate-500 font-medium mb-0.5">
                      {car.brand} · {car.year}
                    </p>
                    <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
                      {car.name}
                      {car.variant && (
                        <span className="ml-2 text-lg font-semibold text-slate-500">
                          {car.variant}
                        </span>
                      )}
                    </h1>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-black text-blue-700">
                      {formatPrice(car.price)}
                    </p>
                    <p className="text-xs text-slate-400">ex-showroom</p>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mt-4">
                  {car.tags.map((t) => (
                    <span
                      key={t}
                      className={`rounded-full border px-3 py-1 text-xs font-bold ${TAG_COLOR[t] ?? "bg-slate-50 text-slate-600 border-slate-200"}`}
                    >
                      {t}
                    </span>
                  ))}
                  {car.isUsed && car.kmDriven && (
                    <span className="rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-xs font-bold text-orange-700">
                      🛣 {(car.kmDriven / 1000).toFixed(0)}K km
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Specs grid */}
            <div className="rounded-3xl bg-white border border-slate-200 shadow-sm p-6">
              <h2 className="text-base font-black text-slate-900 mb-4">Key Specifications</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {SPECS.map((s) => {
                  const Icon = s.icon;
                  return (
                    <div
                      key={s.label}
                      className="flex flex-col items-center gap-1.5 rounded-2xl bg-slate-50 border border-slate-200 p-3 text-center"
                    >
                      <Icon className="h-4 w-4 text-blue-600" />
                      <span className="text-[10px] text-slate-500 font-medium">{s.label}</span>
                      <span className="text-sm font-black text-slate-800">{s.value}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Pros & Cons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-5">
                <h3 className="text-sm font-black text-emerald-800 mb-3 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" /> Pros
                </h3>
                <ul className="space-y-2">
                  {car.pros.map((p) => (
                    <li key={p} className="flex items-start gap-2 text-sm text-emerald-700">
                      <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl bg-rose-50 border border-rose-200 p-5">
                <h3 className="text-sm font-black text-rose-800 mb-3 flex items-center gap-2">
                  <XCircle className="h-4 w-4" /> Cons
                </h3>
                <ul className="space-y-2">
                  {car.cons.map((c) => (
                    <li key={c} className="flex items-start gap-2 text-sm text-rose-700">
                      <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-rose-400" />
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* ── Right column ─────────────────────────────────── */}
          <div className="lg:col-span-2 flex flex-col gap-4">

            {/* Actions */}
            <div className="rounded-3xl bg-white border border-slate-200 shadow-sm p-5 flex flex-col gap-3">
              <h3 className="text-sm font-black text-slate-700 uppercase tracking-wide">Actions</h3>

              <AddToCompareButton car={car} />

              <Link
                href="/compare"
                className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-700 hover:border-blue-300 hover:text-blue-600 transition-all"
              >
                <GitCompare className="h-4 w-4" />
                Go to Compare Page
                <ChevronRight className="h-4 w-4 ml-auto" />
              </Link>

              <Link
                href="/loan-calculator"
                className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-700 hover:border-blue-300 hover:text-blue-600 transition-all"
              >
                <Calculator className="h-4 w-4" />
                Calculate EMI
                <ChevronRight className="h-4 w-4 ml-auto" />
              </Link>

              <Link
                href="/ai-advisor"
                className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-500 to-blue-600 px-4 py-3 text-sm font-bold text-white shadow-md hover:opacity-90 transition-opacity"
              >
                ✨ Ask AI about this car
              </Link>
            </div>

            {/* Variant compare CTA */}
            {variantsExist && (
              <Link
                href={`/model/${variantSlug}/compare`}
                className="group rounded-3xl bg-gradient-to-br from-blue-600 to-blue-800 p-5 text-white shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <p className="text-xs font-bold text-blue-200 uppercase tracking-wide mb-1">
                      Phase 2 Smart Features
                    </p>
                    <h3 className="text-base font-black">
                      Compare {car.model} Variants
                    </h3>
                  </div>
                  <GitCompare className="h-5 w-5 text-blue-300 shrink-0 mt-0.5" />
                </div>
                <p className="text-sm text-blue-200 leading-relaxed mb-4">
                  Radar chart · Decision Score · 5-yr cost · Break-even · Trim Advisor
                </p>
                <div className="flex items-center gap-1.5 text-sm font-bold text-white group-hover:gap-2.5 transition-all">
                  Open Variant Compare
                  <ChevronRight className="h-4 w-4" />
                </div>
              </Link>
            )}

            {/* On-road price breakdown */}
            <OnRoadPrice price={car.price} />
          </div>
        </div>
      </div>
    </div>
  );
}
