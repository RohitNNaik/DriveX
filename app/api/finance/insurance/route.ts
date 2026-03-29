import { NextRequest, NextResponse } from "next/server";
import { computeInsurance } from "@/modules/finance/finance.service";

/**
 * POST /api/finance/insurance
 * Body: { carPrice, carAge, engineCC, isEV? }
 *
 * Returns ranked insurance recommendations from 6 insurers.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { carPrice, carAge, engineCC, isEV } = body;

    if (!carPrice || carAge === undefined || !engineCC) {
      return NextResponse.json(
        { success: false, error: "carPrice, carAge, and engineCC are required" },
        { status: 400 }
      );
    }

    const data = computeInsurance({ carPrice, carAge, engineCC, isEV: isEV ?? false });
    return NextResponse.json({ success: true, data });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
