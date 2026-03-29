import { NextRequest, NextResponse } from "next/server";
import { advisorExperience } from "@/bff/advisor.api";

/**
 * POST /api/bff/advisor
 * Body: { query: string; city?: string; budget?: number }
 *
 * Returns AI-recommended cars with explanation text.
 * Uses OpenAI when OPENAI_API_KEY is set; falls back to rule-based engine.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { query, city, budget } = body;

    if (!query?.trim()) {
      return NextResponse.json(
        { success: false, error: "query is required" },
        { status: 400 }
      );
    }

    const data = await advisorExperience({ query, city, budget });
    return NextResponse.json({ success: true, data });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
