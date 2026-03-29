import { NextRequest, NextResponse } from "next/server";
import { computeLoanOffers } from "@/modules/finance/finance.service";

/**
 * POST /api/finance/loan-offers
 * Body: { carPrice, downPayment, tenureMonths, creditScore? }
 *
 * Returns ranked loan offers from 7 lenders.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { carPrice, downPayment, tenureMonths, creditScore } = body;

    if (!carPrice || !downPayment || !tenureMonths) {
      return NextResponse.json(
        { success: false, error: "carPrice, downPayment, and tenureMonths are required" },
        { status: 400 }
      );
    }

    const data = computeLoanOffers({ carPrice, downPayment, tenureMonths, creditScore });
    return NextResponse.json({ success: true, data });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
