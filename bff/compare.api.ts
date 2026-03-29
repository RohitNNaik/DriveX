/**
 * BFF: Compare Experience API
 * POST /api/bff/compare
 *
 * Mode A — Different cars:
 *   { mode: "different-cars", carIds: string[] }  — 2 or 3 MongoDB _ids
 *
 * Mode B — Same model variants:
 *   { mode: "same-model-variants", variantIds: string[] }  — 2–4 variant IDs
 *
 * Output: normalized spec table + winner + AI insights
 */

import { compareCarIds, compareVariantIds } from "@/modules/comparison/comparison.service";

export async function compareExperience(
  payload:
    | { mode?: "different-cars"; carIds: string[] }
    | { mode: "same-model-variants"; variantIds: string[] }
) {
  if (!payload.mode || payload.mode === "different-cars") {
    const { carIds } = payload as { carIds: string[] };
    if (!Array.isArray(carIds) || carIds.length < 2) {
      throw new Error("Provide 2 or 3 car IDs in carIds[]");
    }
    return compareCarIds(carIds);
  }

  // mode === "same-model-variants"
  const { variantIds } = payload as { variantIds: string[] };
  if (!Array.isArray(variantIds) || variantIds.length < 2) {
    throw new Error("Provide 2–4 variant IDs in variantIds[]");
  }
  return compareVariantIds(variantIds);
}
