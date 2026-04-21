"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, Zap, MapPin, ChevronDown, Check, Sparkles, Heart } from "lucide-react";
import { useCompare } from "@/context/CompareContext";
import { useCity, CITIES } from "@/context/CityContext";
import { useGarage } from "@/context/GarageContext";
import { cn } from "@/lib/utils";
import { Tooltip } from "@/components/ui/tooltip";

const LINKS = [
  { href: "/cars",            label: "Browse Cars",  icon: "🚗" },
  { href: "/compare",         label: "Compare",      icon: "⚖️" },
  { href: "/shortlister",     label: "My Car Pick",  icon: "🎯" },
  { href: "/used-cars",       label: "Used Cars",    icon: "🏷️" },
  { href: "/offers",          label: "Offers",       icon: "🔥", hot: true },
  { href: "/upcoming-cars",   label: "Upcoming",     icon: "🚀" },
  { href: "/loan-calculator", label: "Finance",      icon: "💰" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { selected } = useCompare();
  const { city, setCity } = useCity();
  const { saved } = useGarage();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cityOpen,   setCityOpen]   = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full glass border-b border-slate-200/60 shadow-sm neon-top">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group shrink-0">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 shadow-lg shadow-blue-500/40 group-hover:shadow-blue-500/60 transition-all duration-300 group-hover:scale-105">
            <span className="text-white text-lg font-black">D</span>
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/20 to-transparent" />
          </div>
          <span className="text-xl font-black tracking-tight">
            <span className="text-slate-900">Drive</span>
            <span className="gradient-text-animated">X</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-0.5">
          {LINKS.map((l) => {
            const active = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  "relative px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 group",
                  active
                    ? "text-blue-700 bg-blue-50"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
                )}
              >
                {l.label}

                {/* Live offer dot */}
                {l.hot && (
                  <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500" />
                  </span>
                )}

                {/* Active indicator bar */}
                {active && (
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 h-0.5 w-5 rounded-full bg-gradient-to-r from-blue-500 to-blue-700" />
                )}

                {/* Hover underline */}
                {!active && (
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 h-0.5 w-0 group-hover:w-5 rounded-full bg-slate-400 transition-all duration-200" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right actions */}
        <div className="hidden lg:flex items-center gap-2">

          {/* City selector */}
          <div className="relative">
            <button
              onClick={() => setCityOpen((v) => !v)}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white/80 px-3 py-2 text-sm font-semibold text-slate-700 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50/50 transition-all duration-200 shadow-sm"
            >
              <MapPin className="h-3.5 w-3.5 text-blue-500" />
              <span>{city.emoji} {city.name}</span>
              <ChevronDown className={cn("h-3.5 w-3.5 transition-transform duration-200", cityOpen && "rotate-180")} />
            </button>

            {cityOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setCityOpen(false)} />
                <div className="absolute right-0 top-full mt-1.5 z-20 w-56 rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/15 overflow-hidden animate-slide-up">
                  <div className="px-3 py-2.5 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-blue-50/50">
                    <p className="text-xs font-black text-slate-500 uppercase tracking-widest">Select City</p>
                  </div>
                  <div className="py-1">
                    {CITIES.map((c) => (
                      <button
                        key={c.name}
                        onClick={() => { setCity(c); setCityOpen(false); }}
                        className="flex w-full items-center justify-between px-4 py-2.5 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                      >
                        <span className="flex items-center gap-2">
                          <span className="text-base">{c.emoji}</span>
                          <span className="font-semibold">{c.name}</span>
                          <span className="text-xs text-slate-400">{c.state}</span>
                        </span>
                        {city.name === c.name && (
                          <Check className="h-3.5 w-3.5 text-blue-600" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Garage icon */}
          <Tooltip
            content={
              saved.length > 0 ? (
                <div className="text-left">
                  <p className="font-bold mb-1.5">My Garage ({saved.length})</p>
                  <div className="space-y-1 max-h-48 overflow-y-auto">
                    {saved.slice(0, 5).map((car) => (
                      <div key={car.id} className="text-[11px] text-gray-200">
                        <p className="font-semibold">{car.brand} {car.model}</p>
                        <p className="text-gray-300">{car.variant}</p>
                      </div>
                    ))}
                    {saved.length > 5 && (
                      <p className="text-[11px] text-gray-300 italic">+{saved.length - 5} more...</p>
                    )}
                  </div>
                </div>
              ) : (
                "No cars in garage"
              )
            }
            side="bottom"
          >
            <Link
              href="/garage"
              className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white/80 text-slate-600 hover:border-rose-300 hover:text-rose-500 hover:bg-rose-50 transition-all cursor-pointer"
              title="My Garage"
            >
              <Heart className={cn("h-4 w-4", saved.length > 0 && "fill-rose-500 text-rose-500")} />
              {saved.length > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-black text-white">
                  {saved.length}
                </span>
              )}
            </Link>
          </Tooltip>

          {/* Compare pill */}
          {selected.length > 0 && (
            <Link
              href="/compare"
              className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 px-3.5 py-1.5 text-xs font-bold text-white shadow-md shadow-emerald-500/40 hover:shadow-emerald-500/60 hover:from-emerald-600 hover:to-teal-600 transition-all animate-badge-pop"
            >
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-white/30 text-[10px] font-black">
                {selected.length}
              </span>
              Compare
            </Link>
          )}

          {/* AI Advisor — animated gradient */}
          <Link
            href="/ai-advisor"
            className="relative flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-bold text-white overflow-hidden btn-glow-violet shine-on-hover"
            style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6, #7c3aed)" }}
          >
            <Sparkles className="h-3.5 w-3.5" />
            AI Advisor
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="lg:hidden flex items-center justify-center h-9 w-9 rounded-xl border border-slate-200 bg-white/80 text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-slate-100 bg-white/95 backdrop-blur-xl px-4 pb-5 animate-slide-up">

          {/* City row */}
          <div className="pt-3 pb-2 border-b border-slate-100 mb-2">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Your City</p>
            <div className="flex flex-wrap gap-1.5">
              {CITIES.map((c) => (
                <button
                  key={c.name}
                  onClick={() => setCity(c)}
                  className={cn(
                    "flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold transition-all",
                    city.name === c.name
                      ? "border-blue-500 bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md shadow-blue-500/30"
                      : "border-slate-200 text-slate-600 hover:border-blue-300 hover:text-blue-600"
                  )}
                >
                  {c.emoji} {c.name}
                </button>
              ))}
            </div>
          </div>

          <nav className="flex flex-col gap-1 pt-1">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "px-4 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center justify-between",
                  pathname === l.href
                    ? "bg-gradient-to-r from-blue-50 to-blue-100/50 text-blue-700 border border-blue-200/50"
                    : "text-slate-700 hover:bg-slate-50"
                )}
              >
                <span className="flex items-center gap-2.5">
                  <span className="text-base">{l.icon}</span>
                  {l.label}
                </span>
                {l.hot && (
                  <span className="rounded-full bg-gradient-to-r from-orange-500 to-red-500 px-2 py-0.5 text-[10px] font-black text-white">
                    LIVE
                  </span>
                )}
              </Link>
            ))}
            <div className="mt-3 pt-3 border-t border-slate-100 flex flex-col gap-2">
              {selected.length > 0 && (
                <Link
                  href="/compare"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 py-2.5 text-sm font-bold text-white shadow-md shadow-emerald-500/30"
                >
                  Compare {selected.length} Cars
                </Link>
              )}
              <Link
                href="/ai-advisor"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-bold text-white btn-glow-violet"
                style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6, #7c3aed)" }}
              >
                <Zap className="h-4 w-4" /> AI Advisor
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
