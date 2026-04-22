import { NextRequest, NextResponse } from "next/server";
import { dotnet, DotnetApiError } from "@/lib/dotnet-client";

/**
 * POST /api/leads  — create a lead
 * GET  /api/leads  — list all leads (internal)
 *
 * Both proxy to the .NET API.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    // .NET CreateLeadDto requires: name, phone, city (+ optional carId, carName, intent)
    // DealerForm sends: name, phone, email (ignored), city, carId?, carName?, intent
    const { name, phone, city, carId, carName, intent } = body;

    if (!name || !phone || !city) {
      return NextResponse.json(
        { success: false, error: "name, phone and city are required" },
        { status: 400 }
      );
    }

    const lead = await dotnet.post<{ id: string }>("/api/leads", {
      name,
      phone,
      city,
      carId:   carId   ?? null,
      carName: carName ?? null,
      intent:  intent  ?? "general",
    });

    return NextResponse.json({ success: true, data: { id: lead.id } }, { status: 201 });
  } catch (err) {
    const message = err instanceof DotnetApiError ? err.message : "Failed to create lead";
    const status  = err instanceof DotnetApiError ? err.status  : 400;
    return NextResponse.json({ success: false, error: message }, { status });
  }
}

export async function GET() {
  try {
    const data = await dotnet.get<unknown[]>("/api/leads");
    return NextResponse.json({ success: true, data });
  } catch (err) {
    const message = err instanceof DotnetApiError ? err.message : "Failed to fetch leads";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
