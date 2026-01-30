import { NextResponse } from "next/server";
import { getParticipantId } from "@/lib/participant";
import { prisma } from "@/lib/prisma";

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

export async function GET() {
  const participantId = await getParticipantId();
  if (!participantId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const log = await prisma.workoutLog.findUnique({
    where: {
      userId_date: { userId: participantId, date: todayStr() },
    },
  });
  return NextResponse.json(log ?? null);
}
