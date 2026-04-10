import { NextRequest, NextResponse } from "next/server";
import { getTeamMembers, upsertTeamMember } from "@/lib/db";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const month = searchParams.get("month") || "2026-03";
  const data = await getTeamMembers(month);
  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const member = await upsertTeamMember(body);
  return NextResponse.json(member, { status: 201 });
}
