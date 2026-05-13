import { NextRequest, NextResponse } from "next/server";
import { getAIAdvisorResponse } from "@/lib/gemini-ai-engine";

/**
 * POST /api/bff/advisor
 * Agentic AI advisor using Gemini API
 *
 * Body: { query: string; city?: string; budget?: number }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { query } = body;

    if (!query?.trim()) {
      return NextResponse.json(
        { success: false, error: "query is required" },
        { status: 400 }
      );
    }

    // Use Gemini-powered AI advisor
    const data = await getAIAdvisorResponse(query);
    return NextResponse.json({ success: true, data });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Advisor failed";
    console.error("Advisor error:", err);
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
