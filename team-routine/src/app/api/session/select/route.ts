import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { participantCookieHeader } from "@/lib/participant";

const bodySchema = z.object({
  name: z.string().min(1, "이름을 선택하세요"),
});

const ALLOWED_NAMES = ["신현호", "창민석", "송수현", "강태영", "이윤지", "조수민"];

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = bodySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid" }, { status: 400 });
    }
    const name = parsed.data.name.trim();
    if (!ALLOWED_NAMES.includes(name)) {
      return NextResponse.json({ error: "허용된 참여자가 아닙니다" }, { status: 400 });
    }
    let user = await prisma.user.findFirst({ where: { name } });
    if (!user) {
      user = await prisma.user.create({ data: { name } });
    }
    const res = NextResponse.json({ ok: true });
    Object.entries(participantCookieHeader(user.id)).forEach(([key, value]) => {
      res.headers.append(key, value);
    });
    return res;
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "실패" }, { status: 500 });
  }
}
