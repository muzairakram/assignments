import { NextRequest, NextResponse } from "next/server";
import { getPipelineForecasts, upsertPipelineForecast } from "@/lib/db";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const months = parseInt(searchParams.get("months") || "6");
  const data = await getPipelineForecasts(months);
  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const forecast = await upsertPipelineForecast(body);
  return NextResponse.json(forecast, { status: 201 });
}
