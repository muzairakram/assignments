import { NextRequest, NextResponse } from "next/server";
import { getOpportunityById, updateOpportunity, deleteOpportunity } from "@/lib/db";

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const opp = await getOpportunityById(params.id);
  if (!opp) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(opp);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await request.json();
  const opp = await updateOpportunity(params.id, body);
  return NextResponse.json(opp);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  await deleteOpportunity(params.id);
  return NextResponse.json({ success: true });
}
