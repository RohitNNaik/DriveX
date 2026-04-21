import Link from "next/link";
import {
  ArrowRight,
  Search,
  GitCompare,
  Sparkles,
  Calculator,
  Shield,
  TrendingUp,
  Users,
  Star,
  ChevronRight,
  Zap,
  Car,
  IndianRupee,
  Award,
  Clock,
} from "lucide-react";

const BODY_TYPES = [
  { label: "SUV", emoji: "🚙", color: "from-blue-500 to-blue-700", count: "45+ cars" },
  { label: "Sedan", emoji: "🚗", color: "from-slate-600 to-slate-800", count: "32+ cars" },
  { label: "Hatchback", emoji: "🚘", color: "from-orange-500 to-orange-700", count: "28+ cars" },
  { label: "MPV", emoji: "🚐", color: "from-green-500 to-green-700", count: "18+ cars" },
  { label: "Electric", emoji: "⚡", color: "from-purple-500 to-purple-700", count: "12+ cars" },
  { label: "Used Cars", emoji: "🏷️", color: "from-rose-500 to-rose-700", count: "100+ cars" },
];

const JOURNEYS = [
  {
    icon: Search,
    iconColor: "text-blue-600",
    iconBg: "bg-blue-50",
    title: "Browse & Filter",
    desc: "Filter by budget, fuel type, body style & city usage. Results update instantly.",
    href: "/cars",
    cta: "Browse Cars",
    accentColor: "border-l-blue-500",
  },
  {
    icon: GitCompare,
    iconColor: "text-emerald-600",
    iconBg: "bg-emerald-50",
    title: "Side-by-Side Compare",
    desc: "Stack up to 3 cars. Specs, pros, cons, and expert insights — all in one view.",
    href: "/compare",
    cta: "Compare Now",
    accentColor: "border-l-emerald-500",
  },
  {
    icon: Sparkles,
    iconColor: "text-violet-600",
    iconBg: "bg-violet-50",
    title: "AI Car Advisor",
    desc: `"Best SUV under 10L for Bangalore traffic" — just type it. AI does the rest.`,
    href: "/ai-advisor",
    cta: "Ask AI",
    accentColor: "border-l-violet-500",
  },
  {
    icon: Calculator,
    iconColor: "text-orange-600",
    iconBg: "bg-orange-50",
    title: "EMI & Finance",
    desc: "Compare 7 lenders, calculate EMI, get insurance quotes and dealer deals.",
    href: "/loan-calculator",
    cta: "Calculate EMI",
    accentColor: "border-l-orange-500",
  },
];

const STATS = [
  { value: "50+", label: "Cars Catalogued", icon: Car, color: "text-blue-600" },
  { value: "7", label: "Finance Partners", icon: IndianRupee, color: "text-green-600" },
  { value: "AI", label: "Powered Advisor", icon: Sparkles, color: "text-violet-600" },
  { value: "3", label: "Cars Compared at Once", icon: GitCompare, color: "text-orange-600" },
];

const WHY_US = [
  {
    icon: Zap,
    title: "Instant Results",
    desc: "Filters update in real-time. No page reloads, no waiting.",
    bg: "bg-yellow-50",
    iconColor: "text-yellow-600",
  },
  {
    icon: Shield,
    title: "Unbiased Recommendations",
    desc: "AI-powered, not dealer-sponsored. We help you decide, not sell.",
    bg: "bg-blue-50",
    iconColor: "text-blue-600",
  },
  {
    icon: TrendingUp,
    title: "Best Deals",
    desc: "Compare loan rates from 7 banks. Get the lowest EMI possible.",
    bg: "bg-green-50",
    iconColor: "text-green-600",
  },
  {
    icon: Award,
    title: "Certified Used Cars",
    desc: "100-point inspection. Full service history. Easy returns.",
    bg: "bg-purple-50",
    iconColor: "text-purple-600",
  },
];

const POPULAR_SEARCHES = [
  "SUV under 15L", "Best mileage car", "Electric cars", "Cars under 8L",
  "Automatic transmission", "7 seater MPV", "Petrol sedan", "Family car",
];

export default function HomePage() {
  return (
    <div className="flex flex-col bg-slate-50">

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#0f172a]">
        {/* Background gradient layers */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 via-slate-900 to-slate-950" />
        <div className="absolute top-0 right-0 h-[500px] w-[500px] rounded-full bg-blue-600/20 blur-[120px]" />
        <div className="absolute bottom-0 left-0 h-[400px] w-[400px] rounded-full bg-violet-600/15 blur-[100px]" />

        {/* Dotted grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 py-20 sm:py-28">
          <div className="flex flex-col items-center text-center gap-7">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5">
              <span className="flex h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse" />
              <span className="text-sm font-medium text-blue-300">India&apos;s smartest car decision platform</span>
            </div>

            {/* Headline */}
            <h1 className="text-5xl sm:text-7xl font-black leading-[1.05] tracking-tight max-w-4xl text-white">
              Find your{" "}
              <span className="relative inline-block">
                <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                  perfect car
                </span>
                <span className="absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full opacity-60" />
              </span>
              {" "}in minutes
            </h1>

            <p className="text-lg sm:text-xl text-slate-400 max-w-2xl leading-relaxed">
              AI recommendations. Instant compare. Real-time filters. Cut through the noise
              and drive away with complete confidence.
            </p>

            {/* Popular searches */}
            <div className="flex flex-wrap items-center justify-center gap-2 max-w-2xl">
              <span className="text-xs text-slate-500 mr-1">Popular:</span>
              {POPULAR_SEARCHES.slice(0, 5).map((s) => (
                <Link
                  key={s}
                  href="/cars"
                  className="rounded-full border border-slate-700 bg-slate-800/50 px-3 py-1 text-xs text-slate-300 hover:border-blue-500 hover:text-blue-300 hover:bg-slate-800 transition-all"
                >
                  {s}
                </Link>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 mt-2">
              <Link
                href="/cars"
                className="group flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-500 to-blue-700 px-7 py-3.5 text-base font-bold text-white shadow-xl shadow-blue-500/30 hover:shadow-blue-500/50 hover:from-blue-600 hover:to-blue-800 transition-all"
              >
                <Search className="h-4 w-4" />
                Browse Cars
                <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                href="/ai-advisor"
                className="flex items-center justify-center gap-2 rounded-2xl border border-slate-600 bg-slate-800/60 px-7 py-3.5 text-base font-bold text-white hover:border-violet-500 hover:bg-slate-800 transition-all"
              >
                <Sparkles className="h-4 w-4 text-violet-400" />
                Ask AI Advisor
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-slate-50 to-transparent" />
      </section>

      {/* ── Body Type Quick Picks ─────────────────────────────────── */}
      <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 py-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-black text-slate-900">Browse by type</h2>
            <p className="text-sm text-slate-500 mt-0.5">Pick a category to start exploring</p>
          </div>
          <Link href="/cars" className="hidden sm:flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700">
            View all <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {BODY_TYPES.map((bt) => (
            <Link
              key={bt.label}
              href={bt.label === "Used Cars" ? "/used-cars" : `/cars`}
              className="group flex flex-col items-center gap-2 rounded-2xl bg-white border border-slate-200 p-4 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-500/10 transition-all card-lift"
            >
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${bt.color} shadow-md`}>
                <span className="text-2xl">{bt.emoji}</span>
              </div>
              <span className="text-sm font-bold text-slate-800">{bt.label}</span>
              <span className="text-[10px] text-slate-400">{bt.count}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Journey Cards ─────────────────────────────────────────── */}
      <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 py-4 pb-14">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">Your path to the right car</h2>
          <p className="text-slate-500 mt-1">Four powerful tools. One confident decision.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {JOURNEYS.map((j) => {
            const Icon = j.icon;
            return (
              <Link
                key={j.href}
                href={j.href}
                className={`group relative flex flex-col gap-4 rounded-2xl border-l-4 ${j.accentColor} bg-white border border-l-4 border-slate-200 p-6 hover:shadow-xl hover:shadow-slate-200/80 transition-all card-lift`}
              >
                <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${j.iconBg}`}>
                  <Icon className={`h-5 w-5 ${j.iconColor}`} />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-base text-slate-900 mb-1.5">{j.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{j.desc}</p>
                </div>
                <span className="flex items-center gap-1.5 text-sm font-bold text-slate-700 group-hover:text-blue-600 transition-colors">
                  {j.cta}
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ── Stats Banner ──────────────────────────────────────────── */}
      <section className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 grid grid-cols-2 lg:grid-cols-4 gap-8">
          {STATS.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="flex flex-col items-center gap-2 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/15 mb-1">
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <span className="text-4xl font-black text-white">{s.value}</span>
                <span className="text-sm text-blue-100">{s.label}</span>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Offers This Month ─────────────────────────────────────── */}
      <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 py-14">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="flex h-2 w-2 rounded-full bg-orange-500 animate-pulse" />
              <span className="text-xs font-bold text-orange-600 uppercase tracking-wide">Live Deals</span>
            </div>
            <h2 className="text-2xl font-black text-slate-900">Best offers this month</h2>
            <p className="text-sm text-slate-500 mt-0.5">Verified discounts — updated April 2026</p>
          </div>
          <Link href="/offers" className="hidden sm:flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700">
            All offers <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { brand: "Maruti Suzuki", model: "Swift",     emoji: "🔵", total: "₹65,000",  badge: "🔥 Bestseller", badgeColor: "bg-orange-500", highlight: true,  href: "/cars/maruti-swift-2024" },
            { brand: "Hyundai",       model: "Creta",     emoji: "🔷", total: "₹1,02,000", badge: "🏆 Top Pick",  badgeColor: "bg-yellow-500", highlight: false, href: "/cars/hyundai-creta-2024" },
            { brand: "Tata",          model: "Nexon EV",  emoji: "🟠", total: "₹2,25,000", badge: "⚡ EV Special", badgeColor: "bg-violet-500", highlight: false, href: "/cars/tata-nexon-ev-2024" },
          ].map((o) => (
            <Link
              key={o.model}
              href={o.href}
              className={`group flex items-center justify-between rounded-2xl bg-white border px-5 py-4 hover:shadow-lg transition-all ${o.highlight ? "border-orange-300 shadow-orange-500/10 shadow-md" : "border-slate-200"}`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{o.emoji}</span>
                <div>
                  <p className="text-xs text-slate-500">{o.brand}</p>
                  <p className="font-black text-slate-900">{o.model}</p>
                  <p className="text-xs text-slate-400 mt-0.5">Save up to</p>
                  <p className="text-lg font-black text-green-600">{o.total}</p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className={`rounded-full ${o.badgeColor} px-2.5 py-1 text-[10px] font-black text-white`}>{o.badge}</span>
                <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-4 text-center sm:hidden">
          <Link href="/offers" className="text-sm font-semibold text-blue-600 hover:text-blue-700">
            See all offers →
          </Link>
        </div>
      </section>

      {/* ── Upcoming Launches ─────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-slate-900 to-blue-950 py-14">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Clock className="h-3.5 w-3.5 text-blue-400" />
                <span className="text-xs font-bold text-blue-400 uppercase tracking-wide">2026 Calendar</span>
              </div>
              <h2 className="text-2xl font-black text-white">Upcoming launches</h2>
              <p className="text-sm text-slate-400 mt-0.5">5 cars launching soon · 4 EVs in pipeline</p>
            </div>
            <Link href="/upcoming-cars" className="hidden sm:flex items-center gap-1 text-sm font-semibold text-blue-400 hover:text-blue-300">
              View all <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: "Mahindra BE 6e",     brand: "Mahindra",      emoji: "⚡", gradient: "from-purple-600 to-violet-800", date: "May 2026",  status: "Confirmed",      statusColor: "bg-emerald-500", price: "₹19L – ₹26L", isEV: true },
              { name: "Tata Sierra EV",     brand: "Tata",           emoji: "🔮", gradient: "from-blue-600 to-cyan-700",    date: "June 2026", status: "Confirmed",      statusColor: "bg-emerald-500", price: "₹25L – ₹32L", isEV: true },
              { name: "Maruti e Vitara",    brand: "Maruti Suzuki",  emoji: "🌱", gradient: "from-green-500 to-teal-700",   date: "July 2026", status: "Expected",       statusColor: "bg-amber-500",   price: "₹15L – ₹20L", isEV: true },
              { name: "Honda Amaze 2025",   brand: "Honda",          emoji: "⚪", gradient: "from-slate-500 to-slate-700",  date: "May 2026",  status: "Launching Soon", statusColor: "bg-orange-500",  price: "₹8L – ₹11L",  isEV: false },
            ].map((car) => (
              <div
                key={car.name}
                className="group rounded-2xl overflow-hidden bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all"
              >
                <div className={`relative h-24 bg-gradient-to-br ${car.gradient} flex items-center justify-center overflow-hidden`}>
                  <div className="absolute -top-3 -right-3 h-14 w-14 rounded-full bg-white/10" />
                  <span className="text-4xl relative z-10">{car.emoji}</span>
                  <span className={`absolute top-2 left-2 rounded-full ${car.statusColor} px-2 py-0.5 text-[10px] font-black text-white`}>
                    {car.status}
                  </span>
                  {car.isEV && (
                    <span className="absolute top-2 right-2 rounded-full bg-violet-500 px-2 py-0.5 text-[10px] font-black text-white flex items-center gap-0.5">
                      <Zap className="h-2.5 w-2.5" /> EV
                    </span>
                  )}
                </div>
                <div className="px-4 py-3">
                  <p className="text-[11px] text-slate-400">{car.brand}</p>
                  <p className="font-black text-white text-sm leading-tight">{car.name}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs font-bold text-blue-300">{car.price}</span>
                    <span className="flex items-center gap-1 text-[10px] text-slate-400">
                      <Clock className="h-3 w-3" /> {car.date}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 text-center">
            <Link
              href="/upcoming-cars"
              className="inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-6 py-3 text-sm font-bold text-white hover:bg-white/20 transition-all sm:hidden"
            >
              See all upcoming cars <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Why DriveX ────────────────────────────────────────────── */}
      <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 py-16">
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700 mb-3">
            <Star className="h-3 w-3 fill-blue-600" />
            WHY DRIVEX
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">Built for smart Indian car buyers</h2>
          <p className="text-slate-500 mt-1 max-w-xl mx-auto">No ads. No dealer pressure. Just the right car at the right price.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {WHY_US.map((w) => {
            const Icon = w.icon;
            return (
              <div key={w.title} className="flex flex-col gap-3 rounded-2xl bg-white border border-slate-200 p-6 hover:shadow-lg hover:shadow-slate-200/80 transition-shadow">
                <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${w.bg}`}>
                  <Icon className={`h-5 w-5 ${w.iconColor}`} />
                </div>
                <h3 className="font-bold text-slate-900">{w.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{w.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── CTA Banner ────────────────────────────────────────────── */}
      <section className="mx-4 sm:mx-6 mb-16 rounded-3xl bg-gradient-to-br from-slate-900 to-blue-950 overflow-hidden relative">
        <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-blue-500/20 blur-[80px]" />
        <div className="absolute bottom-0 left-0 h-48 w-48 rounded-full bg-violet-500/20 blur-[60px]" />
        <div className="relative max-w-7xl mx-auto px-6 py-14 flex flex-col sm:flex-row items-center justify-between gap-8">
          <div className="text-center sm:text-left">
            <h2 className="text-3xl font-black text-white leading-tight">
              Not sure where to start?
            </h2>
            <p className="text-slate-400 mt-2 max-w-sm">
              Tell our AI what you need. Budget, city, family size — it handles the rest.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <Link
              href="/ai-advisor"
              className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-violet-500 to-blue-600 px-6 py-3 font-bold text-white shadow-xl shadow-blue-500/30 hover:shadow-blue-500/50 transition-all"
            >
              <Sparkles className="h-4 w-4" />
              Ask AI Advisor
            </Link>
            <Link
              href="/cars"
              className="flex items-center gap-2 rounded-2xl border border-slate-600 px-6 py-3 font-bold text-white hover:border-slate-400 hover:bg-white/5 transition-all"
            >
              Browse Cars
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────────────── */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            {/* Brand */}
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-blue-800">
                <span className="text-white text-sm font-black">D</span>
              </div>
              <span className="font-black text-lg">
                <span className="text-slate-900">Drive</span>
                <span className="text-blue-600">X</span>
              </span>
            </div>

            {/* Links */}
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-slate-500">
              {[
                { href: "/cars", label: "Browse" },
                { href: "/compare", label: "Compare" },
                { href: "/used-cars", label: "Used Cars" },
                { href: "/ai-advisor", label: "AI Advisor" },
                { href: "/loan-calculator", label: "Finance" },
              ].map((l) => (
                <Link key={l.href} href={l.href} className="hover:text-blue-600 transition-colors">
                  {l.label}
                </Link>
              ))}
            </div>

            <p className="text-xs text-slate-400">
              © {new Date().getFullYear()} DriveX. Built for smart car buyers.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
