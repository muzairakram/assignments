import { NextRequest, NextResponse } from "next/server";
import { getOpportunities, createOpportunity } from "@/lib/db";
import type { Phase, RAGStatus, OpportunityType } from "@/lib/db";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const phase = searchParams.get("phase") as Phase | null;
  const rag = searchParams.get("rag") as RAGStatus | null;
  const type = searchParams.get("type") as OpportunityType | null;

  const filters: { phase?: Phase; rag?: RAGStatus; type?: OpportunityType } = {};
  if (phase) filters.phase = phase;
  if (rag) filters.rag = rag;
  if (type) filters.type = type;

  const data = await getOpportunities(Object.keys(filters).length > 0 ? filters : undefined);
  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const opp = await createOpportunity(body);
  return NextResponse.json(opp, { status: 201 });
}
