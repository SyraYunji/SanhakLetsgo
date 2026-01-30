import { getParticipantId } from "@/lib/participant";
import { prisma } from "@/lib/prisma";
import { WorkoutsView } from "./WorkoutsView";

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

export default async function WorkoutsPage() {
  const participantId = await getParticipantId();
  if (!participantId) return null;
  const today = todayStr();
  const from = new Date();
  from.setDate(from.getDate() - 14);
  const fromStr = from.toISOString().slice(0, 10);
  const [todayLog, logs] = await Promise.all([
    prisma.workoutLog.findUnique({
      where: { userId_date: { userId: participantId, date: today } },
    }),
    prisma.workoutLog.findMany({
      where: {
        userId: participantId,
        date: { gte: fromStr, lte: today },
      },
      orderBy: { date: "desc" },
    }),
  ]);
  return (
    <div className="space-y-4">
      <h1 className="text-lg font-semibold">운동 기록</h1>
      <WorkoutsView todayLog={todayLog} logs={logs} />
    </div>
  );
}
