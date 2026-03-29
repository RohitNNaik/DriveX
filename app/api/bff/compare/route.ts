import { NextRequest, NextResponse } from "next/server";
import { compareExperience } from "@/bff/compare.api";

/**
 * POST /api/bff/compare
 *
 * Mode A — different cars:
 *   Body: { mode?: "different-cars", carIds: string[] }
 *
 * Mode B — same model variants:
 *   Body: { mode: "same-model-variants", variantIds: string[] }
 *
 * Returns normalized comparison table, winner, and insights.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { mode, carIds, variantIds } = body;

    if (mode === "same-model-variants") {
      if (!Array.isArray(variantIds) || variantIds.length < 2) {
        return NextResponse.json(
          { success: false, error: "Provide 2–4 variant IDs in variantIds[]" },
          { status: 400 }
        );
      }
      const data = await compareExperience({ mode: "same-model-variants", variantIds });
      return NextResponse.json({ success: true, data });
    }

    // default: different-cars
    if (!Array.isArray(carIds) || carIds.length < 2) {
      return NextResponse.json(
        { success: false, error: "Provide 2 or 3 car IDs in carIds[]" },
        { status: 400 }
      );
    }
    const data = await compareExperience({ mode: "different-cars", carIds });
    return NextResponse.json({ success: true, data });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
