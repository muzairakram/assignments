import { NextRequest, NextResponse } from "next/server";
import { toggleMilestone } from "@/lib/db";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { milestoneId } = await request.json();
  const ms = await toggleMilestone(params.id, milestoneId);
  return NextResponse.json(ms);
}
