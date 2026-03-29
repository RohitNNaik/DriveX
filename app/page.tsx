import Link from "next/link";
import { ArrowRight, Search, GitCompare, Sparkles, Tags } from "lucide-react";
import { Button } from "@/components/ui/button";

const JOURNEYS = [
  {
    icon: <Search className="h-7 w-7 text-blue-600" />,
    title: "Browse Cars",
    desc: "Filter by budget, fuel type & usage. Find cars that fit your life.",
    href: "/cars",
    cta: "Explore",
    color: "bg-blue-50 border-blue-100",
  },
  {
    icon: <GitCompare className="h-7 w-7 text-green-600" />,
    title: "Compare Side-by-Side",
    desc: "Add up to 3 cars and compare specs, pros & cons in one view.",
    href: "/compare",
    cta: "Compare",
    color: "bg-green-50 border-green-100",
  },
  {
    icon: <Sparkles className="h-7 w-7 text-purple-600" />,
    title: "AI Car Advisor",
    desc: '"Best SUV under 10L" or "Car for Bangalore traffic" – just ask.',
    href: "/ai-advisor",
    cta: "Ask AI",
    color: "bg-purple-50 border-purple-100",
  },
  {
    icon: <Tags className="h-7 w-7 text-orange-600" />,
    title: "Best Deal + Loan",
    desc: "Calculate EMI, browse used cars, and connect with dealers.",
    href: "/loan-calculator",
    cta: "Calculate EMI",
    color: "bg-orange-50 border-orange-100",
  },
];

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-blue-700 to-blue-900 text-white overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-20 sm:py-28 flex flex-col items-center text-center gap-6">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-sm font-medium">
            🚗 India&apos;s smartest car decision platform
          </span>
          <h1 className="text-4xl sm:text-6xl font-extrabold leading-tight max-w-3xl">
            Stop browsing.{" "}
            <span className="text-yellow-300">Start deciding.</span>
          </h1>
          <p className="text-lg sm:text-xl text-blue-100 max-w-xl">
            Come confused, leave with a decision. DriveX cuts through the noise
            with AI recommendations, instant compare, and fast filters.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 mt-2">
            <Button asChild size="lg" className="bg-yellow-400 text-blue-900 font-bold hover:bg-yellow-300">
              <Link href="/cars">Browse Cars</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white text-white bg-transparent hover:bg-white/10">
              <Link href="/ai-advisor">🤖 Ask AI Advisor</Link>
            </Button>
          </div>
        </div>
        <div className="absolute -top-16 -right-16 h-64 w-64 rounded-full bg-white/5" />
        <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-yellow-400/10" />
      </section>

      {/* Journey Cards */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-16">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-2">Your path to the right car</h2>
        <p className="text-center text-gray-500 mb-10">Four simple steps. One confident decision.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {JOURNEYS.map((j) => (
            <Link
              key={j.href}
              href={j.href}
              className={`group flex flex-col gap-4 rounded-2xl border p-6 transition-all hover:shadow-lg hover:-translate-y-1 ${j.color}`}
            >
              <div>{j.icon}</div>
              <div>
                <h3 className="font-bold text-lg mb-1">{j.title}</h3>
                <p className="text-sm text-gray-600">{j.desc}</p>
              </div>
              <span className="mt-auto flex items-center gap-1 text-sm font-semibold text-gray-800 group-hover:gap-2 transition-all">
                {j.cta} <ArrowRight className="h-4 w-4" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-t border-b">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-14 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          <div className="flex flex-col items-center gap-2">
            <span className="text-3xl font-extrabold text-blue-700">10+</span>
            <span className="text-sm text-gray-500">Cars in catalogue</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <span className="text-3xl font-extrabold text-green-600">AI</span>
            <span className="text-sm text-gray-500">Powered recommendations</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <span className="text-3xl font-extrabold text-purple-600">3</span>
            <span className="text-sm text-gray-500">Cars compared at once</span>
          </div>
        </div>
      </section>

      <footer className="py-6 text-center text-xs text-gray-400">
        © {new Date().getFullYear()} DriveX. Built for smart car buyers.
      </footer>
    </div>
  );
}
