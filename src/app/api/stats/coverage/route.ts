import { NextRequest, NextResponse } from "next/server";
import { getCoverageRatio } from "@/lib/db";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const months = parseInt(searchParams.get("months") || "6");
  const stats = await getCoverageRatio(months);
  return NextResponse.json(stats);
}
