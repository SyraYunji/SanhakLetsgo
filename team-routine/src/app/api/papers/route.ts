import { NextResponse } from "next/server";
import { getParticipantId } from "@/lib/participant";
import { prisma } from "@/lib/prisma";
import { paperBody } from "@/lib/validations";

export async function GET() {
  const participantId = await getParticipantId();
  if (!participantId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const papers = await prisma.paper.findMany({
    where: { userId: participantId },
    include: { review: true },
    orderBy: { readAt: "desc" },
  });
  return NextResponse.json(papers);
}

export async function POST(req: Request) {
  const participantId = await getParticipantId();
  if (!participantId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await req.json();
    const parsed = paperBody.safeParse({
      ...body,
      url: body.url && body.url.trim() ? body.url : undefined,
    });
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }
    const { title, url, tags, readAt } = parsed.data;
    const paper = await prisma.paper.create({
      data: {
        userId: participantId,
        title,
        url: url || null,
        tags: tags ?? [],
        readAt,
      },
    });
    return NextResponse.json(paper);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "등록 실패" }, { status: 500 });
  }
}
