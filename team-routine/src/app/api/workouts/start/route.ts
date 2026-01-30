import { NextResponse } from "next/server";
import { getParticipantId } from "@/lib/participant";
import { prisma } from "@/lib/prisma";
import { workoutStartBody } from "@/lib/validations";

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

export async function POST(req: Request) {
  const participantId = await getParticipantId();
  if (!participantId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await req.json();
    const parsed = workoutStartBody.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }
    const { date } = parsed.data;
    if (date !== todayStr()) {
      return NextResponse.json(
        { error: "오늘 날짜에만 시작할 수 있습니다" },
        { status: 400 }
      );
    }
    const existing = await prisma.workoutLog.findUnique({
      where: { userId_date: { userId: participantId, date } },
    });
    if (existing?.startTime) {
      return NextResponse.json(
        { error: "already_started", startTime: existing.startTime },
        { status: 409 }
      );
    }
    const now = new Date();
    const startTime = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
    const log = await prisma.workoutLog.upsert({
      where: { userId_date: { userId: participantId, date } },
      create: { userId: participantId, date, attended: true, startTime },
      update: { startTime, attended: true },
    });
    return NextResponse.json(log);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "처리 실패" }, { status: 500 });
  }
}
