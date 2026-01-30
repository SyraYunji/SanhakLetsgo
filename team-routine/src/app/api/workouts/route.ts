import { NextResponse } from "next/server";
import { getParticipantId } from "@/lib/participant";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const participantId = await getParticipantId();
  if (!participantId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const today = new Date();
  const from = new Date(today);
  from.setDate(from.getDate() - 14);
  const fromStr = from.toISOString().slice(0, 10);
  const toStr = today.toISOString().slice(0, 10);
  const logs = await prisma.workoutLog.findMany({
    where: {
      userId: participantId,
      date: { gte: fromStr, lte: toStr },
    },
    orderBy: { date: "desc" },
  });
  return NextResponse.json(logs);
}
