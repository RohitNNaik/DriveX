/**
 * BFF: Compare Experience API
 * POST /api/bff/compare
 *
 * Input: { carIds: string[] }  – 2 or 3 MongoDB _ids
 * Output: normalized spec table + winner + AI insights
 */

import { compareCarIds } from "@/modules/comparison/comparison.service";

export async function compareExperience(carIds: string[]) {
  if (!Array.isArray(carIds) || carIds.length < 2 || carIds.length > 3) {
    throw new Error("Provide 2 or 3 car IDs");
  }

  const result = await compareCarIds(carIds);
  return result;
}
