"use client";

import type { ComponentType } from "react";
import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  BadgeIndianRupee,
  Check,
  Copy,
  Gauge,
  Loader2,
  Shield,
  Smartphone,
  Sparkles,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  ComparableVariant,
  FeatureCategory,
  compareVariantUpgrade,
  enrichComparableVariants,
  getComparableVariantsForModel,
  getFeatureRows,
  getStaticModelGroupBySlug,
  slugifyModel,
  variantHasFeature,
} from "@/lib/variant-compare";

type ModelGroup = {
  brand: string;
  model: string;
  variantCount: number;
};

type CompareSection =
  | {
      id: string;
      title: string;
      type: "spec";
      rows: Array<{ label: string; values: string[]; differing: boolean }>;
      icon: ComponentType<{ className?: string }>;
    }
  | {
      id: string;
      title: string;
      type: "feature";
      category: FeatureCategory;
      rows: Array<{ label: string; values: boolean[]; differing: boolean }>;
      icon: ComponentType<{ className?: string }>;
    };

const MIN_SELECTION = 2;
const MAX_SELECTION = 4;

function formatPrice(price: number) {
  return `₹${price.toLocaleString("en-IN")}`;
}

function formatPriceCompact(price: number) {
  if (price >= 10000000) return `₹${(price / 10000000).toFixed(2)} Cr`;
  return `₹${(price / 100000).toFixed(2)} L`;
}

function formatDelta(value: number) {
  if (value === 0) return "Base";
  return `${value > 0 ? "+" : "-"}${formatPriceCompact(Math.abs(value))}`;
}

function formatMileage(value: number, fuelType: string) {
  if (fuelType === "Electric" || value === 0) return "EV";
  return `${value} kmpl`;
}

function getBadgeTone(score: number) {
  if (score >= 80) return "bg-emerald-50 text-emerald-700 border-emerald-200";
  if (score >= 60) return "bg-amber-50 text-amber-700 border-amber-200";
  return "bg-rose-50 text-rose-700 border-rose-200";
}

function buildCompareSections(selectedVariants: ComparableVariant[], baseVariant: ComparableVariant): CompareSection[] {
  const priceRows = [
    {
      label: "Price",
      values: selectedVariants.map((variant) => formatPrice(variant.price)),
      differing: new Set(selectedVariants.map((variant) => variant.price)).size > 1,
    },
    {
      label: "Price delta from base",
      values: selectedVariants.map((variant) => formatDelta(variant.price - baseVariant.price)),
      differing: selectedVariants.some((variant) => variant.price !== baseVariant.price),
    },
    {
      label: "Upgrade score",
      values: selectedVariants.map((variant) =>
        variant.id === baseVariant.id
          ? "Base"
          : `${compareVariantUpgrade(baseVariant, variant).upgradeScore}/100`
      ),
      differing: selectedVariants.some((variant) => variant.id !== baseVariant.id),
    },
  ];

  const performanceRows = [
    {
      label: "Fuel",
      values: selectedVariants.map((variant) => variant.fuelType),
      differing: new Set(selectedVariants.map((variant) => variant.fuelType)).size > 1,
    },
    {
      label: "Engine",
      values: selectedVariants.map((variant) =>
        variant.engineCC === 0 ? "Electric motor" : `${variant.engineCC} cc`
      ),
      differing: new Set(selectedVariants.map((variant) => variant.engineCC)).size > 1,
    },
    {
      label: "Power",
      values: selectedVariants.map((variant) => `${variant.power} bhp`),
      differing: new Set(selectedVariants.map((variant) => variant.power)).size > 1,
    },
    {
      label: "Torque",
      values: selectedVariants.map((variant) => `${variant.torque} Nm`),
      differing: new Set(selectedVariants.map((variant) => variant.torque)).size > 1,
    },
    {
      label: "Mileage",
      values: selectedVariants.map((variant) => formatMileage(variant.mileage, variant.fuelType)),
      differing:
        new Set(
          selectedVariants.map((variant) => `${variant.mileage}-${variant.fuelType}`)
        ).size > 1,
    },
  ];

  const featureSections: CompareSection[] = [
    {
      id: "safety",
      title: "Safety Features",
      type: "feature",
      category: "safety",
      icon: Shield,
      rows: getFeatureRows(selectedVariants, "safety").map((feature) => {
        const values = selectedVariants.map((variant) => variantHasFeature(variant, "safety", feature));
        return {
          label: feature,
          values,
          differing: new Set(values).size > 1,
        };
      }),
    },
    {
      id: "comfort",
      title: "Comfort Features",
      type: "feature",
      category: "comfort",
      icon: Sparkles,
      rows: getFeatureRows(selectedVariants, "comfort").map((feature) => {
        const values = selectedVariants.map((variant) => variantHasFeature(variant, "comfort", feature));
        return {
          label: feature,
          values,
          differing: new Set(values).size > 1,
        };
      }),
    },
    {
      id: "technology",
      title: "Technology Features",
      type: "feature",
      category: "technology",
      icon: Smartphone,
      rows: getFeatureRows(selectedVariants, "technology").map((feature) => {
        const values = selectedVariants.map((variant) => variantHasFeature(variant, "technology", feature));
        return {
          label: feature,
          values,
          differing: new Set(values).size > 1,
        };
      }),
    },
    {
      id: "exterior",
      title: "Exterior Features",
      type: "feature",
      category: "exterior",
      icon: Gauge,
      rows: getFeatureRows(selectedVariants, "exterior").map((feature) => {
        const values = selectedVariants.map((variant) => variantHasFeature(variant, "exterior", feature));
        return {
          label: feature,
          values,
          differing: new Set(values).size > 1,
        };
      }),
    },
  ];

  return [
    {
      id: "price-value",
      title: "Price & Value",
      type: "spec",
      rows: priceRows,
      icon: BadgeIndianRupee,
    },
    {
      id: "performance",
      title: "Engine & Performance",
      type: "spec",
      rows: performanceRows,
      icon: Gauge,
    },
    ...featureSections,
  ];
}

async function fetchModelGroup(slug: string): Promise<ModelGroup | null> {
  const staticMatch = getStaticModelGroupBySlug(slug);
  if (staticMatch) return staticMatch;

  try {
    const response = await fetch("/api/cars/variant-models");
    const payload = await response.json();
    if (!payload.success || !Array.isArray(payload.data)) return null;

    return (
      payload.data.find((group: ModelGroup) => slugifyModel(group.brand, group.model) === slug) ?? null
    );
  } catch {
    return null;
  }
}

export default function VariantCompareClient({ slug }: { slug: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const initializedSelection = useRef(false);

  const [modelGroup, setModelGroup] = useState<ModelGroup | null>(null);
  const [variants, setVariants] = useState<ComparableVariant[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showDifferencesOnly, setShowDifferencesOnly] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadVariants() {
      setLoading(true);
      setError("");

      const resolvedGroup = await fetchModelGroup(slug);
      if (!active) return;

      if (!resolvedGroup) {
        setError("We could not find that model or its variants.");
        setLoading(false);
        return;
      }

      setModelGroup(resolvedGroup);

      try {
        const response = await fetch(
          `/api/cars/variants?brand=${encodeURIComponent(resolvedGroup.brand)}&model=${encodeURIComponent(resolvedGroup.model)}`
        );
        const payload = await response.json();

        if (payload.success && Array.isArray(payload.data) && payload.data.length >= 2) {
          const enriched = enrichComparableVariants(payload.data);
          if (active) setVariants(enriched);
        } else if (active) {
          setVariants(getComparableVariantsForModel(resolvedGroup.brand, resolvedGroup.model));
        }
      } catch {
        if (active) setVariants(getComparableVariantsForModel(resolvedGroup.brand, resolvedGroup.model));
      } finally {
        if (active) setLoading(false);
      }
    }

    loadVariants();

    return () => {
      active = false;
    };
  }, [slug]);

  useEffect(() => {
    if (loading || variants.length === 0 || initializedSelection.current) return;

    const requested = (searchParams.get("variants") ?? "")
      .split(",")
      .map((value: string) => value.trim())
      .filter((value: string): value is string => value.length > 0);

    const validRequested = requested.filter((id: string) => variants.some((variant) => variant.id === id));
    const fallback = variants.slice(0, MIN_SELECTION).map((variant) => variant.id);

    setSelectedIds(validRequested.length >= MIN_SELECTION ? validRequested.slice(0, MAX_SELECTION) : fallback);
    initializedSelection.current = true;
  }, [loading, searchParams, variants]);

  useEffect(() => {
    if (!initializedSelection.current || selectedIds.length === 0) return;

    const params = new URLSearchParams(searchParams.toString());
    params.set("variants", selectedIds.join(","));
    const nextUrl = `${pathname}?${params.toString()}`;
    const currentUrl = `${pathname}?${searchParams.toString()}`;
    if (nextUrl !== currentUrl) {
      router.replace(nextUrl, { scroll: false });
    }
  }, [pathname, router, searchParams, selectedIds]);

  const selectedVariants = useMemo(() => {
    return variants.filter((variant) => selectedIds.includes(variant.id)).sort((left, right) => left.price - right.price);
  }, [selectedIds, variants]);

  const baseVariant = selectedVariants[0] ?? variants[0];
  const sections = useMemo(
    () => (baseVariant ? buildCompareSections(selectedVariants, baseVariant) : []),
    [baseVariant, selectedVariants]
  );

  const upgradeCards = useMemo(() => {
    return selectedVariants.slice(0, -1).map((variant, index) => ({
      from: variant,
      to: selectedVariants[index + 1],
      details: compareVariantUpgrade(variant, selectedVariants[index + 1]),
    }));
  }, [selectedVariants]);

  function toggleVariant(id: string) {
    setSelectedIds((current) => {
      if (current.includes(id)) {
        if (current.length <= MIN_SELECTION) return current;
        return current.filter((value) => value !== id);
      }

      if (current.length >= MAX_SELECTION) return current;
      return [...current, id];
    });
  }

  async function copyShareUrl() {
    if (typeof window === "undefined") return;
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  }

  if (loading) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-7xl items-center justify-center px-4 py-12 sm:px-6">
        <div className="flex items-center gap-3 rounded-2xl border bg-white px-5 py-4 text-sm text-gray-500 shadow-sm">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading variant comparison...
        </div>
      </div>
    );
  }

  if (error || !modelGroup || variants.length < 2) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <Link href="/compare" className="inline-flex items-center gap-2 text-sm text-blue-700 hover:underline">
          <ArrowLeft className="h-4 w-4" />
          Back to compare
        </Link>
        <div className="mt-6 rounded-3xl border bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-bold text-gray-900">Model compare unavailable</h1>
          <p className="mt-2 text-sm text-gray-500">{error || "This model does not have enough variants to compare yet."}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <Link href="/compare" className="inline-flex items-center gap-2 text-sm text-blue-700 hover:underline">
        <ArrowLeft className="h-4 w-4" />
        Back to compare
      </Link>

      <div className="mt-4 rounded-[2rem] border border-slate-200 bg-[linear-gradient(135deg,#f8fafc_0%,#eff6ff_45%,#ffffff_100%)] p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
              Variant Comparison
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              {modelGroup.brand} {modelGroup.model}
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
              Compare up to four variants side by side, filter the view down to only differences,
              and spot whether each price jump is really worth it.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Badge className="rounded-full bg-white px-3 py-1 text-slate-700 shadow-sm">
              {variants.length} total variants
            </Badge>
            <Button variant="outline" className="gap-2 bg-white" onClick={copyShareUrl}>
              <Copy className="h-4 w-4" />
              {copied ? "Copied" : "Copy share link"}
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-8 rounded-3xl border bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Choose 2 to 4 variants</h2>
            <p className="text-sm text-slate-500">
              Selected {selectedIds.length} of {MAX_SELECTION}. Variants stay in the URL so you can share this exact view.
            </p>
          </div>

          <div className="inline-flex items-center gap-3 rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700">
            <span>Highlight differences only</span>
            <button
              type="button"
              aria-pressed={showDifferencesOnly}
              onClick={() => setShowDifferencesOnly((current) => !current)}
              className={cn(
                "relative h-6 w-11 rounded-full transition-colors",
                showDifferencesOnly ? "bg-blue-600" : "bg-slate-200"
              )}
            >
              <span
                className={cn(
                  "absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform",
                  showDifferencesOnly ? "translate-x-5" : "translate-x-0.5"
                )}
              />
            </button>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {variants.map((variant) => {
            const selected = selectedIds.includes(variant.id);
            const disabled = !selected && selectedIds.length >= MAX_SELECTION;
            const upgradeFromBase =
              baseVariant && variant.id !== baseVariant.id
                ? compareVariantUpgrade(baseVariant, variant).upgradeScore
                : null;

            return (
              <button
                key={variant.id}
                type="button"
                disabled={disabled}
                onClick={() => toggleVariant(variant.id)}
                className={cn(
                  "rounded-2xl border p-4 text-left transition-all",
                  selected
                    ? "border-blue-500 bg-blue-50/80 shadow-sm"
                    : "border-slate-200 bg-white hover:border-blue-300 hover:shadow-sm",
                  disabled && "cursor-not-allowed opacity-50"
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{variant.variant}</p>
                    <p className="mt-1 text-xs text-slate-500">
                      {variant.fuelType} · {variant.transmission}
                    </p>
                  </div>
                  <span
                    className={cn(
                      "flex h-6 w-6 items-center justify-center rounded-full border text-xs",
                      selected
                        ? "border-blue-600 bg-blue-600 text-white"
                        : "border-slate-300 bg-white text-transparent"
                    )}
                  >
                    <Check className="h-3.5 w-3.5" />
                  </span>
                </div>

                <p className="mt-4 text-xl font-bold text-slate-900">{formatPriceCompact(variant.price)}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Badge variant="secondary">{variant.power} bhp</Badge>
                  <Badge variant="secondary">{variant.torque} Nm</Badge>
                  <Badge variant="secondary">{formatMileage(variant.mileage, variant.fuelType)}</Badge>
                </div>

                {upgradeFromBase !== null && (
                  <div className="mt-4">
                    <span
                      className={cn(
                        "inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold",
                        getBadgeTone(upgradeFromBase)
                      )}
                    >
                      Upgrade score {upgradeFromBase}/100
                    </span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="sticky top-0 z-20 mt-8 rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-sm backdrop-blur">
        <div className="flex flex-wrap items-center gap-3">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Selected</p>
          {selectedVariants.map((variant) => (
            <Badge key={variant.id} className="rounded-full bg-slate-900 px-3 py-1 text-white">
              {variant.variant}
            </Badge>
          ))}
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        {upgradeCards.map(({ from, to, details }) => (
          <div key={`${from.id}-${to.id}`} className="rounded-3xl border bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
              <span>{from.variant}</span>
              <ArrowRight className="h-4 w-4 text-slate-400" />
              <span>{to.variant}</span>
            </div>
            <p className="mt-3 text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
              Is it worth upgrading?
            </p>
            <div className="mt-3 flex items-center justify-between">
              <p className="text-2xl font-bold text-slate-900">{formatDelta(details.priceDelta)}</p>
              <span className={cn("rounded-full border px-3 py-1 text-sm font-semibold", getBadgeTone(details.upgradeScore))}>
                {details.upgradeScore}/100
              </span>
            </div>
            <p className="mt-4 text-sm font-semibold text-emerald-700">
              Features gained: {details.gained.length}
            </p>
            <p className="mt-1 text-sm text-slate-600">
              {details.gained.slice(0, 4).join(", ") || "No meaningful additions"}
            </p>
            <p className="mt-4 text-sm font-semibold text-rose-700">
              Features lost: {details.lost.length}
            </p>
            <p className="mt-1 text-sm text-slate-600">
              {details.lost.slice(0, 4).join(", ") || "Nothing lost from the previous step"}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-8 overflow-x-auto rounded-3xl border bg-white shadow-sm">
        <table className="w-full min-w-[860px] border-separate border-spacing-0">
          <thead className="sticky top-[88px] z-10 bg-white">
            <tr>
              <th className="border-b border-slate-200 px-4 py-4 text-left text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                Section / Metric
              </th>
              {selectedVariants.map((variant) => {
                const upgradeScore =
                  variant.id === baseVariant.id ? null : compareVariantUpgrade(baseVariant, variant).upgradeScore;
                return (
                  <th key={variant.id} className="border-b border-slate-200 px-4 py-4 text-left">
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-slate-900">{variant.variant}</p>
                      <p className="text-xs text-slate-500">
                        {variant.fuelType} · {variant.transmission}
                      </p>
                      <p className="text-sm font-bold text-blue-700">{formatPriceCompact(variant.price)}</p>
                      {upgradeScore !== null && (
                        <span className={cn("inline-flex rounded-full border px-2 py-0.5 text-xs font-semibold", getBadgeTone(upgradeScore))}>
                          {upgradeScore}/100
                        </span>
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {sections.map((section) => {
              const visibleRows = showDifferencesOnly
                ? section.rows.filter((row) => row.differing)
                : section.rows;

              if (visibleRows.length === 0) return null;

              return (
                <Fragment key={section.id}>
                  <tr>
                    <td
                      colSpan={selectedVariants.length + 1}
                      className="border-b border-t border-slate-200 bg-slate-50 px-4 py-3"
                    >
                      <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                        <section.icon className="h-4 w-4 text-blue-600" />
                        {section.title}
                      </div>
                    </td>
                  </tr>
                  {section.type === "spec"
                    ? visibleRows.map((row) => (
                        <tr key={`${section.id}-${row.label}`} className="odd:bg-white even:bg-slate-50/60">
                          <td className="border-b border-slate-100 px-4 py-3 text-sm font-medium text-slate-600">
                            {row.label}
                          </td>
                          {(row.values as string[]).map((value, index) => (
                            <td
                              key={`${row.label}-${selectedVariants[index].id}`}
                              className={cn(
                                "border-b border-slate-100 px-4 py-3 text-sm text-slate-900",
                                row.differing && "font-semibold"
                              )}
                            >
                              {row.label === "Upgrade score" && value !== "Base" ? (
                                <span className={cn("inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold", getBadgeTone(Number.parseInt(value, 10) || 0))}>
                                  {value}
                                </span>
                              ) : (
                                value
                              )}
                            </td>
                          ))}
                        </tr>
                      ))
                    : visibleRows.map((row) => (
                        <tr key={`${section.id}-${row.label}`} className="odd:bg-white even:bg-slate-50/60">
                          <td className="border-b border-slate-100 px-4 py-3 text-sm font-medium text-slate-600">
                            {row.label}
                          </td>
                          {(row.values as boolean[]).map((value, index) => (
                            <td
                              key={`${row.label}-${selectedVariants[index].id}`}
                              className={cn(
                                "border-b border-slate-100 px-4 py-3",
                                row.differing && (value ? "bg-emerald-50/80" : "bg-rose-50/70")
                              )}
                            >
                              <span
                                className={cn(
                                  "inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-xs font-semibold",
                                  value ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"
                                )}
                              >
                                {value ? <Check className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5" />}
                                {value ? "Yes" : "No"}
                              </span>
                            </td>
                          ))}
                        </tr>
                      ))}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
