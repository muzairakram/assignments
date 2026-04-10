import { NextResponse } from "next/server";
import { getPipelineStats } from "@/lib/db";

export async function GET() {
  const stats = await getPipelineStats();
  return NextResponse.json(stats);
}
