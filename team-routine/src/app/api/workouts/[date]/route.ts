import { NextResponse } from "next/server";
import { getParticipantId } from "@/lib/participant";
import { prisma } from "@/lib/prisma";
import { workoutLogBody } from "@/lib/validations";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ date: string }> }
) {
  const participantId = await getParticipantId();
  if (!participantId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { date } = await params;
  try {
    const body = await req.json();
    const parsed = workoutLogBody.safeParse({ ...body, date });
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }
    const { attended, startTime, endTime } = parsed.data;
    const existing = await prisma.workoutLog.findUnique({
      where: { userId_date: { userId: participantId, date } },
    });
    const s = startTime ?? existing?.startTime ?? null;
    const e = endTime ?? existing?.endTime ?? null;
    if (s && e) {
      const [sh, sm] = s.split(":").map(Number);
      const [eh, em] = e.split(":").map(Number);
      if (eh < sh || (eh === sh && em <= sm)) {
        return NextResponse.json(
          { error: "종료 시간은 시작 시간보다 이후여야 합니다" },
          { status: 400 }
        );
      }
    }
    const log = await prisma.workoutLog.upsert({
      where: { userId_date: { userId: participantId, date } },
      create: {
        userId: participantId,
        date,
        attended: attended ?? false,
        startTime: s,
        endTime: e,
      },
      update: {
        ...(attended !== undefined && { attended }),
        ...(startTime !== undefined && { startTime: startTime ?? null }),
        ...(endTime !== undefined && { endTime: endTime ?? null }),
      },
    });
    return NextResponse.json(log);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "처리 실패" }, { status: 500 });
  }
}
