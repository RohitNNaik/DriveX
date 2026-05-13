import { NextRequest, NextResponse } from "next/server";
import { dotnet, DotnetApiError } from "@/lib/dotnet-client";

/**
 * POST /api/finance/loan-offers
 * Proxies to .NET POST /api/finance/loan-offers.
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

    const data = await dotnet.post<unknown>("/api/finance/loan-offers", {
      carPrice,
      downPayment,
      tenureMonths,
      creditScore: creditScore ?? "good",
    });
    return NextResponse.json({ success: true, data });
  } catch (err) {
    const message = err instanceof DotnetApiError ? err.message : "Loan offers failed";
    const status  = err instanceof DotnetApiError ? err.status  : 500;
    return NextResponse.json({ success: false, error: message }, { status });
  }
}
