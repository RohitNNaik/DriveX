/**
 * BFF: AI Advisor Experience API
 * POST /api/bff/advisor
 *
 * Input: { query: string; city?: string; budget?: number }
 * Output: { text, suggestions (Car[]), source }
 *
 * Uses OpenAI when OPENAI_API_KEY is set; falls back to rule-based engine.
 */

import { processAdvisorQuery } from "@/modules/ai/ai.service";

export async function advisorExperience(input: {
  query: string;
  city?: string;
  budget?: number;
}) {
  if (!input.query?.trim()) {
    throw new Error("query is required");
  }
  return processAdvisorQuery(input);
}
