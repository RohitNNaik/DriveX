"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, Car } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCompare } from "@/context/CompareContext";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/cars", label: "Browse" },
  { href: "/compare", label: "Compare" },
  { href: "/ai-advisor", label: "AI Advisor" },
  { href: "/used-cars", label: "Used Cars" },
  { href: "/loan-calculator", label: "Loan Calc" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { selected } = useCompare();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-blue-700">
          <Car className="h-6 w-6" />
          DriveX
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "px-4 py-2 rounded-md text-sm font-medium transition-colors",
                pathname === l.href
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-600 hover:text-blue-700 hover:bg-gray-100"
              )}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Compare badge + CTA */}
        <div className="hidden md:flex items-center gap-3">
          {selected.length > 0 && (
            <Link
              href="/compare"
              className="flex items-center gap-1 rounded-full bg-green-600 px-3 py-1 text-xs font-semibold text-white hover:bg-green-700 transition"
            >
              Compare {selected.length}
            </Link>
          )}
          <Button asChild size="sm">
            <Link href="/ai-advisor">🤖 Ask AI</Link>
          </Button>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t bg-white px-4 pb-4">
          <nav className="flex flex-col gap-1 pt-2">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "px-4 py-2 rounded-md text-sm font-medium",
                  pathname === l.href
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-600"
                )}
              >
                {l.label}
              </Link>
            ))}
            <Button asChild size="sm" className="mt-2">
              <Link href="/ai-advisor" onClick={() => setMobileOpen(false)}>
                🤖 Ask AI
              </Link>
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}
