import Link from "next/link";
import { Calendar, Bell, ChevronRight, Clock, Zap, Star } from "lucide-react";

interface UpcomingCar {
  id:          string;
  name:        string;
  brand:       string;
  bodyType:    string;
  emoji:       string;
  gradient:    string;
  launchDate:  string;
  status:      "Launching Soon" | "Expected" | "Confirmed" | "Launched";
  statusColor: string;
  estimatedPrice: { min: number; max: number };
  highlights:  string[];
  fuelType:    string;
  segment:     string;
  isEV?:       boolean;
}

const UPCOMING: UpcomingCar[] = [
  {
    id:          "mahindra-be6e",
    name:        "Mahindra BE 6e",
    brand:       "Mahindra",
    bodyType:    "Electric SUV",
    emoji:       "⚡",
    gradient:    "from-purple-600 to-violet-800",
    launchDate:  "May 2026",
    status:      "Confirmed",
    statusColor: "bg-emerald-500",
    estimatedPrice: { min: 1899000, max: 2600000 },
    highlights:  ["500+ km range", "ADAS Level 2", "V2L support", "Panoramic sky roof"],
    fuelType:    "Electric",
    segment:     "Premium EV SUV",
    isEV:        true,
  },
  {
    id:          "tata-sierra-ev",
    name:        "Tata Sierra EV",
    brand:       "Tata",
    bodyType:    "Electric SUV",
    emoji:       "🔮",
    gradient:    "from-blue-600 to-cyan-700",
    launchDate:  "June 2026",
    status:      "Confirmed",
    statusColor: "bg-emerald-500",
    estimatedPrice: { min: 2500000, max: 3200000 },
    highlights:  ["Iconic Sierra design", "4WD option", "450 km range", "Connected car"],
    fuelType:    "Electric",
    segment:     "Premium EV SUV",
    isEV:        true,
  },
  {
    id:          "hyundai-creta-ev",
    name:        "Hyundai Creta EV",
    brand:       "Hyundai",
    bodyType:    "Electric SUV",
    emoji:       "💙",
    gradient:    "from-sky-500 to-blue-700",
    launchDate:  "Already Launched",
    status:      "Launched",
    statusColor: "bg-blue-500",
    estimatedPrice: { min: 1799000, max: 2300000 },
    highlights:  ["400+ km range", "V2L feature", "ADAS suite", "Panoramic sunroof"],
    fuelType:    "Electric",
    segment:     "Mass-market EV SUV",
    isEV:        true,
  },
  {
    id:          "maruti-suzuki-e-vitara",
    name:        "Maruti e Vitara",
    brand:       "Maruti Suzuki",
    bodyType:    "Electric SUV",
    emoji:       "🌱",
    gradient:    "from-green-500 to-teal-700",
    launchDate:  "July 2026",
    status:      "Expected",
    statusColor: "bg-amber-500",
    estimatedPrice: { min: 1500000, max: 2000000 },
    highlights:  ["Suzuki-Toyota platform", "ALLGRIP 4WD", "Large battery", "Wide service network"],
    fuelType:    "Electric",
    segment:     "Mass-market EV SUV",
    isEV:        true,
  },
  {
    id:          "kia-syros",
    name:        "Kia Syros",
    brand:       "Kia",
    bodyType:    "Compact SUV",
    emoji:       "🔴",
    gradient:    "from-red-500 to-rose-700",
    launchDate:  "Already Launched",
    status:      "Launched",
    statusColor: "bg-blue-500",
    estimatedPrice: { min: 899000, max: 1600000 },
    highlights:  ["Panoramic curved display", "Level 2 ADAS", "Petrol + diesel", "Strong build"],
    fuelType:    "Petrol / Diesel",
    segment:     "Compact SUV",
  },
  {
    id:          "honda-amaze-2025",
    name:        "Honda Amaze 2025",
    brand:       "Honda",
    bodyType:    "Sedan",
    emoji:       "⚪",
    gradient:    "from-slate-500 to-slate-700",
    launchDate:  "May 2026",
    status:      "Launching Soon",
    statusColor: "bg-orange-500",
    estimatedPrice: { min: 750000, max: 1100000 },
    highlights:  ["New 1.2L petrol", "16-inch alloys", "Digital cluster", "6 airbags standard"],
    fuelType:    "Petrol",
    segment:     "Compact Sedan",
  },
  {
    id:          "volkswagen-tiguan",
    name:        "Volkswagen Tiguan",
    brand:       "Volkswagen",
    bodyType:    "Premium SUV",
    emoji:       "🇩🇪",
    gradient:    "from-slate-600 to-blue-900",
    launchDate:  "Q3 2026",
    status:      "Expected",
    statusColor: "bg-amber-500",
    estimatedPrice: { min: 3200000, max: 3800000 },
    highlights:  ["2.0 TSI engine", "DSG gearbox", "European safety", "IQ.Drive ADAS"],
    fuelType:    "Petrol",
    segment:     "Premium SUV",
  },
  {
    id:          "mahindra-thar-roxx",
    name:        "Mahindra Thar Roxx",
    brand:       "Mahindra",
    bodyType:    "Off-road SUV",
    emoji:       "🏔",
    gradient:    "from-amber-600 to-orange-800",
    launchDate:  "Already Launched",
    status:      "Launched",
    statusColor: "bg-blue-500",
    estimatedPrice: { min: 1299000, max: 2200000 },
    highlights:  ["5-door Thar", "4WD with low range", "ADAS", "Turbo petrol + diesel"],
    fuelType:    "Petrol / Diesel",
    segment:     "Off-road SUV",
  },
];

function fmtPrice(n: number) {
  return `₹${(n / 100000).toFixed(0)}L`;
}

const STATUS_STYLES: Record<string, string> = {
  "Launching Soon": "bg-orange-500",
  "Expected":       "bg-amber-500",
  "Confirmed":      "bg-emerald-500",
  "Launched":       "bg-blue-500",
};

export default function UpcomingCarsPage() {
  const launched  = UPCOMING.filter((c) => c.status === "Launched");
  const upcoming  = UPCOMING.filter((c) => c.status !== "Launched");
  const evCount   = UPCOMING.filter((c) => c.isEV).length;

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Hero */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/20 border border-blue-500/30 px-3 py-1 text-xs font-bold text-blue-300">
                  <Calendar className="h-3 w-3" /> 2026 Launch Calendar
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-white leading-tight">
                Upcoming &amp; Recently<br />Launched Cars
              </h1>
              <p className="text-slate-400 mt-2 text-sm max-w-md">
                {upcoming.length} cars launching soon · {evCount} EVs · Estimated prices &amp; features
              </p>
            </div>
            <div className="text-5xl hidden sm:block">🚀</div>
          </div>

          {/* Quick stats */}
          <div className="flex flex-wrap gap-3 mt-8">
            {[
              { label: "Launching Soon",  color: "bg-orange-500", count: upcoming.filter((c) => c.status === "Launching Soon").length },
              { label: "Confirmed",       color: "bg-emerald-500", count: upcoming.filter((c) => c.status === "Confirmed").length },
              { label: "Expected",        color: "bg-amber-500",  count: upcoming.filter((c) => c.status === "Expected").length },
              { label: "EVs in pipeline", color: "bg-violet-500", count: evCount },
            ].map((s) => (
              <div key={s.label} className="flex items-center gap-2 rounded-full bg-white/10 border border-white/10 px-4 py-2">
                <span className={`h-2 w-2 rounded-full ${s.color}`} />
                <span className="text-sm text-white font-bold">{s.count}</span>
                <span className="text-xs text-slate-400">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 space-y-10">

        {/* Upcoming */}
        <section>
          <div className="flex items-center gap-3 mb-5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-orange-100">
              <Clock className="h-4 w-4 text-orange-600" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900">Coming Soon</h2>
              <p className="text-sm text-slate-500">Confirmed &amp; expected launches in 2026</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {upcoming.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        </section>

        {/* Recently launched */}
        <section>
          <div className="flex items-center gap-3 mb-5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-100">
              <Star className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900">Recently Launched</h2>
              <p className="text-sm text-slate-500">Just arrived — compare and decide</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {launched.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        </section>

        {/* Alert callout */}
        <div className="rounded-3xl bg-gradient-to-r from-blue-600 to-violet-600 p-6 text-white">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20">
                <Bell className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-black text-base">Want price alerts?</h3>
                <p className="text-sm text-blue-200 mt-0.5">
                  Our AI Advisor tracks launches and can tell you the best time to buy.
                </p>
              </div>
            </div>
            <Link
              href="/ai-advisor"
              className="flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-black text-blue-700 hover:bg-blue-50 transition-colors shrink-0"
            >
              <Zap className="h-4 w-4" />
              Ask AI Advisor
            </Link>
          </div>
        </div>

        <p className="text-xs text-slate-400 text-center">
          * Launch dates and prices are estimated. Actual specs may vary at launch. Source: manufacturer announcements.
        </p>
      </div>
    </div>
  );
}

function CarCard({ car }: { car: UpcomingCar }) {
  return (
    <div className="group rounded-3xl bg-white border border-slate-200 shadow-sm overflow-hidden flex flex-col hover:shadow-lg hover:shadow-slate-200/80 hover:-translate-y-1 transition-all duration-300">

      {/* Image area */}
      <div className={`relative h-36 bg-gradient-to-br ${car.gradient} flex items-center justify-center overflow-hidden`}>
        <div className="absolute -top-4 -right-4 h-20 w-20 rounded-full bg-white/10" />
        <div className="absolute -bottom-3 -left-3 h-14 w-14 rounded-full bg-white/10" />
        <span className="relative z-10 text-5xl">{car.emoji}</span>

        {/* Status badge */}
        <div className="absolute top-3 left-3">
          <span className={`rounded-full ${STATUS_STYLES[car.status]} px-2.5 py-1 text-[10px] font-black text-white shadow`}>
            {car.status}
          </span>
        </div>

        {/* EV badge */}
        {car.isEV && (
          <div className="absolute top-3 right-3">
            <span className="rounded-full bg-violet-500 px-2.5 py-1 text-[10px] font-black text-white shadow flex items-center gap-1">
              <Zap className="h-2.5 w-2.5" /> EV
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col flex-1 p-4 gap-2.5">
        <div>
          <p className="text-xs text-slate-500 font-medium">{car.brand} · {car.bodyType}</p>
          <h3 className="font-black text-base text-slate-900 leading-tight mt-0.5">{car.name}</h3>
        </div>

        {/* Price range */}
        <div className="flex items-baseline gap-1">
          <span className="text-lg font-black text-blue-700">{fmtPrice(car.estimatedPrice.min)}</span>
          <span className="text-sm text-slate-400">– {fmtPrice(car.estimatedPrice.max)}</span>
        </div>
        <p className="text-[10px] text-slate-400 -mt-1.5">Estimated ex-showroom</p>

        {/* Launch date */}
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
          <Calendar className="h-3.5 w-3.5 text-slate-400" />
          {car.launchDate}
        </div>

        {/* Highlights */}
        <div className="flex flex-col gap-1 mt-1">
          {car.highlights.slice(0, 3).map((h) => (
            <span key={h} className="flex items-center gap-1.5 text-[11px] text-slate-600">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-400 shrink-0" />
              {h}
            </span>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-auto pt-2">
          {car.status === "Launched" ? (
            <Link
              href={`/cars`}
              className="flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-2.5 text-xs font-bold text-white shadow-md hover:from-blue-700 hover:to-blue-800 transition-all"
            >
              Browse Now <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          ) : (
            <Link
              href="/ai-advisor"
              className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-700 hover:border-blue-300 hover:text-blue-600 transition-all"
            >
              Get Notified <Bell className="h-3.5 w-3.5" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
