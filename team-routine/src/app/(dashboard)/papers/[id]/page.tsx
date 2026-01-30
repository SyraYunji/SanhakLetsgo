import { getParticipantId } from "@/lib/participant";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { PaperDetail } from "../PaperDetail";

export default async function PaperDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const participantId = await getParticipantId();
  if (!participantId) return null;
  const { id } = await params;
  const paper = await prisma.paper.findFirst({
    where: { id, userId: participantId },
    include: { review: true },
  });
  if (!paper) notFound();
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Link href="/papers" className="text-sm text-[hsl(var(--muted-foreground))] hover:underline">
          ← 목록
        </Link>
      </div>
      <PaperDetail paper={paper} />
    </div>
  );
}
