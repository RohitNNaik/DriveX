"use client";

import { ComparableVariant } from "@/lib/variant-compare";

const AXES = [
  { key: "value",       label: "Value",       color: "#f59e0b" },
  { key: "performance", label: "Performance", color: "#ef4444" },
  { key: "comfort",     label: "Comfort",     color: "#8b5cf6" },
  { key: "economy",     label: "Economy",     color: "#10b981" },
  { key: "technology",  label: "Technology",  color: "#3b82f6" },
] as const;

type AxisKey = typeof AXES[number]["key"];

const PALETTE = [
  { stroke: "#3b82f6", fill: "#3b82f620" },
  { stroke: "#f97316", fill: "#f9731620" },
  { stroke: "#10b981", fill: "#10b98120" },
  { stroke: "#8b5cf6", fill: "#8b5cf620" },
];

const TOTAL_COMFORT = 11;
const TOTAL_TECH    = 15;
const MAX_MILEAGE   = 30;

function computeScores(variant: ComparableVariant, allVariants: ComparableVariant[]) {
  const prices  = allVariants.map((v) => v.price);
  const powers  = allVariants.map((v) => v.power);
  const torques = allVariants.map((v) => v.torque);

  const minPrice  = Math.min(...prices);
  const maxPrice  = Math.max(...prices);
  const maxPower  = Math.max(...powers);
  const maxTorque = Math.max(...torques);

  // Value: cheap = good, many features = good
  const featureCount =
    variant.features.safety.length +
    variant.features.comfort.length +
    variant.features.technology.length +
    variant.features.exterior.length;
  const maxFeatures = Math.max(
    ...allVariants.map(
      (v) =>
        v.features.safety.length +
        v.features.comfort.length +
        v.features.technology.length +
        v.features.exterior.length
    )
  );
  const priceScore   = maxPrice === minPrice ? 50 : ((maxPrice - variant.price) / (maxPrice - minPrice)) * 100;
  const featureScore = maxFeatures > 0 ? (featureCount / maxFeatures) * 100 : 50;
  const value = Math.round(priceScore * 0.55 + featureScore * 0.45);

  // Performance: power + torque normalised
  const performance = Math.round(
    ((maxPower  > 0 ? variant.power  / maxPower  : 0) * 60 +
     (maxTorque > 0 ? variant.torque / maxTorque : 0) * 40)
  );

  // Comfort: comfort features / total possible
  const comfort = Math.round((variant.features.comfort.length / TOTAL_COMFORT) * 100);

  // Economy: EV = 100, else mileage / MAX_MILEAGE
  const economy =
    variant.fuelType === "Electric"
      ? 100
      : Math.min(100, Math.round((variant.mileage / MAX_MILEAGE) * 100));

  // Technology: tech features / total possible
  const technology = Math.round((variant.features.technology.length / TOTAL_TECH) * 100);

  return { value, performance, comfort, economy, technology } as Record<AxisKey, number>;
}

function polarToXY(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function polygonPoints(cx: number, cy: number, r: number, n: number, offsetDeg = 0) {
  return Array.from({ length: n }, (_, i) => {
    const { x, y } = polarToXY(cx, cy, r, (360 / n) * i + offsetDeg);
    return `${x},${y}`;
  }).join(" ");
}

function variantPolygon(
  cx: number,
  cy: number,
  maxR: number,
  scores: Record<AxisKey, number>
) {
  return AXES.map(({ key }, i) => {
    const r = (scores[key] / 100) * maxR;
    const { x, y } = polarToXY(cx, cy, r, (360 / AXES.length) * i);
    return `${x},${y}`;
  }).join(" ");
}

interface Props {
  variants: ComparableVariant[];
}

export default function VariantDNAChart({ variants }: Props) {
  const CX = 160;
  const CY = 160;
  const MAX_R = 120;
  const LEVELS = 4;
  const N = AXES.length;
  const W = 320;
  const H = 320;

  const allScores = variants.map((v) => computeScores(v, variants));

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-slate-900">Variant DNA</h3>
        <p className="text-sm text-slate-500 mt-0.5">
          Radar chart scoring each variant across 5 dimensions
        </p>
      </div>

      <div className="flex flex-col lg:flex-row items-center gap-8">
        {/* SVG Radar Chart */}
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="w-full max-w-xs shrink-0"
          aria-label="Variant DNA radar chart"
        >
          {/* Grid rings */}
          {Array.from({ length: LEVELS }, (_, lvl) => {
            const r = (MAX_R / LEVELS) * (lvl + 1);
            return (
              <polygon
                key={lvl}
                points={polygonPoints(CX, CY, r, N)}
                fill="none"
                stroke="#e2e8f0"
                strokeWidth={1}
              />
            );
          })}

          {/* Axis lines */}
          {AXES.map(({ color }, i) => {
            const { x, y } = polarToXY(CX, CY, MAX_R, (360 / N) * i);
            return (
              <line
                key={i}
                x1={CX} y1={CY}
                x2={x}  y2={y}
                stroke="#e2e8f0"
                strokeWidth={1}
              />
            );
          })}

          {/* Per-variant filled polygon */}
          {variants.map((v, idx) => {
            const scores = allScores[idx];
            const pts = variantPolygon(CX, CY, MAX_R, scores);
            const c = PALETTE[idx % PALETTE.length];
            return (
              <polygon
                key={v.id}
                points={pts}
                fill={c.fill}
                stroke={c.stroke}
                strokeWidth={2}
                strokeLinejoin="round"
              />
            );
          })}

          {/* Axis labels */}
          {AXES.map(({ label }, i) => {
            const { x, y } = polarToXY(CX, CY, MAX_R + 22, (360 / N) * i);
            return (
              <text
                key={i}
                x={x}
                y={y}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={10}
                fontWeight={600}
                fill="#475569"
              >
                {label}
              </text>
            );
          })}

          {/* Centre dot */}
          <circle cx={CX} cy={CY} r={3} fill="#94a3b8" />
        </svg>

        {/* Legend + scores */}
        <div className="flex-1 w-full space-y-4">
          {variants.map((v, idx) => {
            const scores = allScores[idx];
            const c = PALETTE[idx % PALETTE.length];
            return (
              <div key={v.id} className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
                {/* Header */}
                <div className="flex items-center gap-2 mb-3">
                  <span
                    className="inline-block h-3 w-3 rounded-full"
                    style={{ background: c.stroke }}
                  />
                  <span className="text-sm font-bold text-slate-900">{v.variant}</span>
                  <span className="ml-auto text-xs text-slate-500">
                    ₹{(v.price / 100000).toFixed(2)}L
                  </span>
                </div>

                {/* Score bars */}
                <div className="space-y-2">
                  {AXES.map(({ key, label, color }) => {
                    const score = scores[key];
                    return (
                      <div key={key} className="flex items-center gap-3">
                        <span className="w-20 shrink-0 text-[11px] font-medium text-slate-600">
                          {label}
                        </span>
                        <div className="flex-1 h-2 rounded-full bg-slate-200 overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-700"
                            style={{ width: `${score}%`, background: color }}
                          />
                        </div>
                        <span className="w-8 text-right text-[11px] font-bold text-slate-700">
                          {score}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
