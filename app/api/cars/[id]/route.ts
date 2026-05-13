import { NextRequest, NextResponse } from "next/server";
import { dotnet, DotnetApiError } from "@/lib/dotnet-client";

/**
 * GET /api/cars/[id]
 * Proxies to .NET GET /api/cars/{id} (accepts ObjectId or slug).
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await dotnet.get<unknown>(`/api/cars/${id}`);
    return NextResponse.json({ success: true, data });
  } catch (err) {
    if (err instanceof DotnetApiError && err.status === 404)
      return NextResponse.json({ success: false, error: "Car not found" }, { status: 404 });
    const message = err instanceof DotnetApiError ? err.message : "Failed to fetch car";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
