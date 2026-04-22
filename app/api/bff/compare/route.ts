import { NextRequest, NextResponse } from "next/server";
import { dotnet, DotnetApiError } from "@/lib/dotnet-client";

/**
 * POST /api/bff/compare
 * Proxies to .NET POST /api/bff/compare.
 *
 * Body: { mode?, carIds? } | { mode: "same-model-variants", variantIds? }
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
    } else {
      if (!Array.isArray(carIds) || carIds.length < 2) {
        return NextResponse.json(
          { success: false, error: "Provide 2 or 3 car IDs in carIds[]" },
          { status: 400 }
        );
      }
    }

    const data = await dotnet.post<unknown>("/api/bff/compare", body);
    return NextResponse.json({ success: true, data });
  } catch (err) {
    const message = err instanceof DotnetApiError ? err.message : "Comparison failed";
    const status  = err instanceof DotnetApiError ? err.status  : 500;
    return NextResponse.json({ success: false, error: message }, { status });
  }
}
