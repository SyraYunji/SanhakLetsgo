import { NextResponse } from "next/server";
import { getParticipantId } from "@/lib/participant";
import { prisma } from "@/lib/prisma";
import { workoutLogBody } from "@/lib/validations";

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
    const parsed = workoutLogBody.safeParse({ ...body, date: body.date ?? todayStr() });
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }
    const { date, attended } = parsed.data;
    const log = await prisma.workoutLog.upsert({
      where: { userId_date: { userId: participantId, date } },
      create: { userId: participantId, date, attended: attended ?? true },
      update: { attended: attended ?? true },
    });
    return NextResponse.json(log);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "처리 실패" }, { status: 500 });
  }
}
