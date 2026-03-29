import { NextRequest, NextResponse } from "next/server";
import { createLead, getLeads } from "@/modules/leads/lead.service";

/**
 * POST /api/leads
 * Body: { carId?, carName?, name, phone, email?, city, message?, intent? }
 * Creates a new dealer/sales lead.
 *
 * GET /api/leads
 * Returns recent leads (internal use only — add auth middleware for production).
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const lead = await createLead(body);
    return NextResponse.json({ success: true, data: { id: lead._id } }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const status = searchParams.get("status") as "new" | "contacted" | "closed" | null;
    const leads = await getLeads(status ?? undefined);
    return NextResponse.json({ success: true, data: leads });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
