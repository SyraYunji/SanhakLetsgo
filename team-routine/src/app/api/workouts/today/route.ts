import { NextResponse } from "next/server";
import { getParticipantId } from "@/lib/participant";
import { prisma } from "@/lib/prisma";

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

export async function GET() {
  const participantId = await getParticipantId();
  if (!participantId) {
    return NextResponse.json({ error: "참여자를 선택해 주세요." }, { status: 401 });
  }
  const sessions = await prisma.workoutLog.findMany({
    where: { userId: participantId, date: todayStr() },
  });
  sessions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return NextResponse.json(sessions);
}
