import { NextRequest, NextResponse } from "next/server";
import { getUtilizationHistory, upsertUtilizationSnapshot } from "@/lib/db";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const months = parseInt(searchParams.get("months") || "6");
  const data = await getUtilizationHistory(months);
  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const snap = await upsertUtilizationSnapshot(body);
  return NextResponse.json(snap, { status: 201 });
}
