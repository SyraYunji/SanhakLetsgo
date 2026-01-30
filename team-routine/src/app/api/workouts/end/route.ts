import { NextResponse } from "next/server";
import { getParticipantId } from "@/lib/participant";
import { prisma } from "@/lib/prisma";
import { workoutEndBody } from "@/lib/validations";

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
    const parsed = workoutEndBody.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }
    const { date } = parsed.data;
    if (date !== todayStr()) {
      return NextResponse.json(
        { error: "오늘 날짜에만 종료할 수 있습니다" },
        { status: 400 }
      );
    }
    const existing = await prisma.workoutLog.findUnique({
      where: { userId_date: { userId: participantId, date } },
    });
    if (!existing?.startTime) {
      return NextResponse.json(
        { error: "시작 시간을 먼저 기록하세요" },
        { status: 400 }
      );
    }
    const now = new Date();
    const endTime = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
    const [sh, sm] = existing.startTime.split(":").map(Number);
    const [eh, em] = endTime.split(":").map(Number);
    if (eh < sh || (eh === sh && em <= sm)) {
      return NextResponse.json(
        { error: "종료 시간은 시작 시간보다 이후여야 합니다" },
        { status: 400 }
      );
    }
    const log = await prisma.workoutLog.update({
      where: { userId_date: { userId: participantId, date } },
      data: { endTime },
    });
    return NextResponse.json(log);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "처리 실패" }, { status: 500 });
  }
}
