import { NextRequest, NextResponse } from "next/server";
import { compareExperience } from "@/bff/compare.api";

/**
 * POST /api/bff/compare
 * Body: { carIds: string[] }
 *
 * Returns normalized comparison table, winner, and insights.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { carIds } = body;

    if (!Array.isArray(carIds) || carIds.length < 2) {
      return NextResponse.json(
        { success: false, error: "Provide 2 or 3 car IDs in carIds[]" },
        { status: 400 }
      );
    }

    const data = await compareExperience(carIds);
    return NextResponse.json({ success: true, data });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
