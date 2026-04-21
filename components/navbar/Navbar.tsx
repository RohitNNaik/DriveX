"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, Zap, MapPin, ChevronDown, Check } from "lucide-react";
import { useCompare } from "@/context/CompareContext";
import { useCity, CITIES } from "@/context/CityContext";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/cars",           label: "Browse Cars" },
  { href: "/compare",        label: "Compare" },
  { href: "/used-cars",      label: "Used Cars" },
  { href: "/offers",         label: "Offers" },
  { href: "/upcoming-cars",  label: "Upcoming" },
  { href: "/loan-calculator",label: "Finance" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { selected } = useCompare();
  const { city, setCity } = useCity();
  const [mobileOpen,  setMobileOpen]  = useState(false);
  const [cityOpen,    setCityOpen]    = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full glass border-b border-slate-200/60 shadow-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group shrink-0">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-800 shadow-lg shadow-blue-500/30 group-hover:shadow-blue-500/50 transition-shadow">
            <span className="text-white text-lg font-black">D</span>
          </div>
          <span className="text-xl font-black tracking-tight">
            <span className="text-slate-900">Drive</span>
            <span className="text-blue-600">X</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-0.5">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "relative px-3 py-2 rounded-lg text-sm font-medium transition-all",
                pathname === l.href
                  ? "text-blue-700 bg-blue-50"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              )}
            >
              {l.label}
              {l.href === "/offers" && (
                <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500" />
                </span>
              )}
              {pathname === l.href && (
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 h-0.5 w-4 rounded-full bg-blue-600" />
              )}
            </Link>
          ))}
        </nav>

        {/* Right actions */}
        <div className="hidden lg:flex items-center gap-2">

          {/* City selector */}
          <div className="relative">
            <button
              onClick={() => setCityOpen((v) => !v)}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:border-blue-300 hover:text-blue-600 transition-all"
            >
              <MapPin className="h-3.5 w-3.5 text-blue-500" />
              <span>{city.emoji} {city.name}</span>
              <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", cityOpen && "rotate-180")} />
            </button>

            {cityOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setCityOpen(false)} />
                <div className="absolute right-0 top-full mt-1.5 z-20 w-56 rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-900/10 overflow-hidden">
                  <div className="px-3 py-2 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">Select City</p>
                  </div>
                  <div className="py-1">
                    {CITIES.map((c) => (
                      <button
                        key={c.name}
                        onClick={() => { setCity(c); setCityOpen(false); }}
                        className="flex w-full items-center justify-between px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        <span className="flex items-center gap-2">
                          <span>{c.emoji}</span>
                          <span className="font-medium">{c.name}</span>
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

          {selected.length > 0 && (
            <Link
              href="/compare"
              className="flex items-center gap-1.5 rounded-full bg-emerald-500 px-3.5 py-1.5 text-xs font-bold text-white shadow-md shadow-emerald-500/30 hover:bg-emerald-600 transition-all"
            >
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-white/30 text-[10px] font-black">
                {selected.length}
              </span>
              Compare
            </Link>
          )}

          <Link
            href="/ai-advisor"
            className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-2 text-sm font-bold text-white shadow-md shadow-blue-500/30 hover:from-blue-700 hover:to-blue-800 transition-all"
          >
            <Zap className="h-3.5 w-3.5" />
            AI Advisor
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="lg:hidden flex items-center justify-center h-9 w-9 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-slate-100 bg-white/95 backdrop-blur px-4 pb-5">

          {/* City row */}
          <div className="pt-3 pb-2 border-b border-slate-100 mb-2">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-2">City</p>
            <div className="flex flex-wrap gap-2">
              {CITIES.map((c) => (
                <button
                  key={c.name}
                  onClick={() => setCity(c)}
                  className={cn(
                    "flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold transition-all",
                    city.name === c.name
                      ? "border-blue-500 bg-blue-500 text-white"
                      : "border-slate-200 text-slate-600"
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
                  "px-4 py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center justify-between",
                  pathname === l.href
                    ? "bg-blue-50 text-blue-700 font-semibold"
                    : "text-slate-700 hover:bg-slate-50"
                )}
              >
                {l.label}
                {l.href === "/offers" && (
                  <span className="rounded-full bg-orange-500 px-2 py-0.5 text-[10px] font-black text-white">
                    New
                  </span>
                )}
              </Link>
            ))}
            <div className="mt-3 pt-3 border-t border-slate-100 flex flex-col gap-2">
              {selected.length > 0 && (
                <Link
                  href="/compare"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center gap-2 rounded-xl bg-emerald-500 py-2.5 text-sm font-bold text-white"
                >
                  Compare {selected.length} Cars
                </Link>
              )}
              <Link
                href="/ai-advisor"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 py-2.5 text-sm font-bold text-white"
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
