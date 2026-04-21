import Link from "next/link";
import { Tag, RefreshCw, Building2, Users, ChevronRight, Clock, Star } from "lucide-react";

const MONTH = "April 2026";

const OFFERS = [
  {
    brand: "Maruti Suzuki",
    emoji: "🔵",
    model: "Swift",
    carId: "maruti-swift-2024",
    badge: "🔥 Bestseller",
    badgeColor: "bg-orange-500",
    offers: [
      { type: "Cash Discount",       amount: "₹35,000",  icon: "💵", color: "text-green-600",  bg: "bg-green-50",  border: "border-green-200" },
      { type: "Exchange Bonus",      amount: "₹20,000",  icon: "🔄", color: "text-blue-600",   bg: "bg-blue-50",   border: "border-blue-200" },
      { type: "Corporate Discount",  amount: "₹10,000",  icon: "🏢", color: "text-violet-600", bg: "bg-violet-50", border: "border-violet-200" },
    ],
    total: "₹65,000",
    valid: `Till 30 ${MONTH}`,
    highlight: true,
  },
  {
    brand: "Hyundai",
    emoji: "🔷",
    model: "Creta",
    carId: "hyundai-creta-2024",
    badge: "🏆 Top Pick",
    badgeColor: "bg-yellow-500",
    offers: [
      { type: "Cash Discount",       amount: "₹50,000",  icon: "💵", color: "text-green-600",  bg: "bg-green-50",  border: "border-green-200" },
      { type: "Exchange Bonus",      amount: "₹30,000",  icon: "🔄", color: "text-blue-600",   bg: "bg-blue-50",   border: "border-blue-200" },
      { type: "Free Insurance",      amount: "₹22,000",  icon: "🛡", color: "text-rose-600",   bg: "bg-rose-50",   border: "border-rose-200" },
    ],
    total: "₹1,02,000",
    valid: `Till 30 ${MONTH}`,
    highlight: false,
  },
  {
    brand: "Tata",
    emoji: "🟠",
    model: "Nexon EV",
    carId: "tata-nexon-ev-2024",
    badge: "⚡ EV Special",
    badgeColor: "bg-violet-500",
    offers: [
      { type: "FAME II Subsidy",     amount: "₹1,50,000", icon: "⚡", color: "text-violet-600", bg: "bg-violet-50", border: "border-violet-200" },
      { type: "State EV Incentive",  amount: "₹50,000",   icon: "🌿", color: "text-green-600",  bg: "bg-green-50",  border: "border-green-200" },
      { type: "Exchange Bonus",      amount: "₹25,000",   icon: "🔄", color: "text-blue-600",   bg: "bg-blue-50",   border: "border-blue-200" },
    ],
    total: "₹2,25,000",
    valid: `Till 30 ${MONTH}`,
    highlight: false,
  },
  {
    brand: "Maruti Suzuki",
    emoji: "🔵",
    model: "Brezza",
    carId: "maruti-brezza-2024",
    badge: null,
    badgeColor: "",
    offers: [
      { type: "Cash Discount",       amount: "₹30,000",  icon: "💵", color: "text-green-600",  bg: "bg-green-50",  border: "border-green-200" },
      { type: "Exchange Bonus",      amount: "₹15,000",  icon: "🔄", color: "text-blue-600",   bg: "bg-blue-50",   border: "border-blue-200" },
      { type: "Loyalty Bonus",       amount: "₹10,000",  icon: "⭐", color: "text-amber-600",  bg: "bg-amber-50",  border: "border-amber-200" },
    ],
    total: "₹55,000",
    valid: `Till 30 ${MONTH}`,
    highlight: false,
  },
  {
    brand: "Kia",
    emoji: "🔴",
    model: "Seltos",
    carId: "kia-seltos-2024",
    badge: null,
    badgeColor: "",
    offers: [
      { type: "Cash Discount",       amount: "₹45,000",  icon: "💵", color: "text-green-600",  bg: "bg-green-50",  border: "border-green-200" },
      { type: "5-yr Free Service",   amount: "₹30,000",  icon: "🔧", color: "text-slate-600",  bg: "bg-slate-50",  border: "border-slate-200" },
    ],
    total: "₹75,000",
    valid: `Till 30 ${MONTH}`,
    highlight: false,
  },
  {
    brand: "Honda",
    emoji: "⚪",
    model: "City",
    carId: "honda-city-2024",
    badge: null,
    badgeColor: "",
    offers: [
      { type: "Cash Discount",       amount: "₹60,000",  icon: "💵", color: "text-green-600",  bg: "bg-green-50",  border: "border-green-200" },
      { type: "Exchange Bonus",      amount: "₹25,000",  icon: "🔄", color: "text-blue-600",   bg: "bg-blue-50",   border: "border-blue-200" },
    ],
    total: "₹85,000",
    valid: `Till 30 ${MONTH}`,
    highlight: false,
  },
];

const OFFER_TYPES = [
  { icon: Tag,      label: "Cash Discount",      desc: "Direct reduction in car price",           color: "text-green-600",  bg: "bg-green-50"  },
  { icon: RefreshCw, label: "Exchange Bonus",    desc: "Extra money when trading your old car",   color: "text-blue-600",   bg: "bg-blue-50"   },
  { icon: Building2, label: "Corporate Offer",  desc: "For employees of select companies",       color: "text-violet-600", bg: "bg-violet-50" },
  { icon: Users,     label: "Loyalty Bonus",    desc: "Existing customer of the same brand",     color: "text-amber-600",  bg: "bg-amber-50"  },
];

export default function OffersPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero */}
      <div className="bg-gradient-to-r from-orange-500 via-rose-500 to-pink-600">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-bold text-white">
                  <Clock className="h-3 w-3" /> {MONTH} Offers
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-white leading-tight">
                Best Car Deals<br />This Month
              </h1>
              <p className="text-orange-100 mt-2 text-sm max-w-md">
                Verified cash discounts, exchange bonuses, corporate offers and EMI schemes. Updated monthly.
              </p>
            </div>
            <div className="text-6xl hidden sm:block">🏷️</div>
          </div>
        </div>
      </div>

      {/* Offer types legend */}
      <div className="bg-white border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-4">
          <div className="flex flex-wrap gap-3">
            {OFFER_TYPES.map((t) => {
              const Icon = t.icon;
              return (
                <div key={t.label} className={`flex items-center gap-2 rounded-full border px-4 py-2 ${t.bg}`}>
                  <Icon className={`h-3.5 w-3.5 ${t.color}`} />
                  <span className={`text-xs font-bold ${t.color}`}>{t.label}</span>
                  <span className="text-xs text-slate-500 hidden sm:inline">— {t.desc}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Offers grid */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-black text-slate-900">
              {OFFERS.length} models with active offers
            </h2>
            <p className="text-sm text-slate-500 mt-0.5">Valid till end of {MONTH}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {OFFERS.map((offer) => (
            <div
              key={offer.carId}
              className={`rounded-3xl bg-white border shadow-sm overflow-hidden flex flex-col ${
                offer.highlight ? "border-orange-300 shadow-orange-500/10 shadow-md" : "border-slate-200"
              }`}
            >
              {/* Card header */}
              <div className={`px-5 py-4 flex items-center justify-between ${
                offer.highlight ? "bg-gradient-to-r from-orange-50 to-rose-50" : "bg-slate-50"
              } border-b border-slate-100`}>
                <div className="flex items-center gap-2">
                  <span className="text-xl">{offer.emoji}</span>
                  <div>
                    <p className="text-xs text-slate-500 font-medium">{offer.brand}</p>
                    <p className="text-base font-black text-slate-900">{offer.model}</p>
                  </div>
                </div>
                {offer.badge && (
                  <span className={`rounded-full ${offer.badgeColor} px-2.5 py-1 text-xs font-black text-white`}>
                    {offer.badge}
                  </span>
                )}
              </div>

              {/* Offer rows */}
              <div className="p-5 flex flex-col gap-2 flex-1">
                {offer.offers.map((o) => (
                  <div
                    key={o.type}
                    className={`flex items-center justify-between rounded-xl border ${o.border} ${o.bg} px-4 py-2.5`}
                  >
                    <span className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                      <span className="text-base">{o.icon}</span>
                      {o.type}
                    </span>
                    <span className={`text-sm font-black ${o.color}`}>{o.amount}</span>
                  </div>
                ))}

                {/* Total savings */}
                <div className="mt-2 flex items-center justify-between rounded-2xl bg-slate-900 px-4 py-3">
                  <span className="text-sm font-bold text-slate-300">Total savings</span>
                  <span className="text-lg font-black text-yellow-400">{offer.total}</span>
                </div>

                {/* Valid until + CTA */}
                <div className="flex items-center justify-between mt-2">
                  <span className="flex items-center gap-1.5 text-xs text-slate-500">
                    <Clock className="h-3 w-3" /> {offer.valid}
                  </span>
                  <Link
                    href={`/cars/${offer.carId}`}
                    className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700"
                  >
                    View car <ChevronRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Disclaimer */}
        <div className="mt-8 rounded-2xl bg-amber-50 border border-amber-200 px-5 py-4">
          <p className="text-xs text-amber-700 leading-relaxed">
            <span className="font-bold">⚠️ Disclaimer:</span> Offers are indicative and subject to change without notice.
            Actual discounts depend on variant, city, dealer stock, and eligibility. Always confirm with your local dealer
            before visiting. Offers valid till end of {MONTH}.
          </p>
        </div>
      </div>
    </div>
  );
}
