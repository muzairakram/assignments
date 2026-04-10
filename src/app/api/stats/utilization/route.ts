import { NextRequest, NextResponse } from "next/server";
import { getUtilizationStats } from "@/lib/db";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const month = searchParams.get("month") || "2026-03";
  const stats = await getUtilizationStats(month);
  return NextResponse.json(stats);
}
