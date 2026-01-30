"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

type WorkoutLog = {
  id: string;
  date: string;
  attended: boolean;
  startTime: string | null;
  endTime: string | null;
} | null;

export function DashboardCards({
  todayLog,
  weekPapersCount,
}: {
  todayLog: WorkoutLog;
  weekPapersCount: number;
}) {
  const router = useRouter();
  const [log, setLog] = useState(todayLog);
  const [busy, setBusy] = useState(false);
  const [startConfirm, setStartConfirm] = useState(false);

  const toggleAttendance = async () => {
    setBusy(true);
    try {
      const res = await fetch("/api/workouts/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ attended: !log?.attended }),
      });
      const data = await res.json();
      if (res.ok) setLog(data);
      router.refresh();
    } finally {
      setBusy(false);
    }
  };

  const startWorkout = async () => {
    if (log?.startTime) {
      setStartConfirm(true);
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/workouts/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const data = await res.json();
      if (res.ok) setLog(data);
      if (res.status === 409) setStartConfirm(true);
      router.refresh();
    } finally {
      setBusy(false);
    }
  };

  const confirmStartOverwrite = async () => {
    setStartConfirm(false);
    setBusy(true);
    try {
      const res = await fetch("/api/workouts/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const data = await res.json();
      if (res.ok) setLog(data);
      router.refresh();
    } finally {
      setBusy(false);
    }
  };

  const endWorkout = async () => {
    if (!log?.startTime) return;
    setBusy(true);
    try {
      const res = await fetch("/api/workouts/end", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const data = await res.json();
      if (res.ok) setLog(data);
      router.refresh();
    } finally {
      setBusy(false);
    }
  };

  const displayStart = log?.startTime ?? "—";
  const displayEnd = log?.endTime ?? "—";

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        {/* 오늘 운동 카드 */}
        <section className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] p-4 shadow-sm">
          <h2 className="text-base font-semibold mb-3">오늘 운동</h2>
          <dl className="space-y-1 text-sm text-[hsl(var(--muted-foreground))] mb-4">
            <div className="flex justify-between">
              <dt>출석</dt>
              <dd>{log?.attended ? "체크됨" : "미체크"}</dd>
            </div>
            <div className="flex justify-between">
              <dt>시작</dt>
              <dd>{displayStart}</dd>
            </div>
            <div className="flex justify-between">
              <dt>종료</dt>
              <dd>{displayEnd}</dd>
            </div>
          </dl>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={toggleAttendance}
              disabled={busy}
              className="rounded-md border border-[hsl(var(--border))] px-3 py-1.5 text-sm hover:bg-[hsl(var(--muted))] disabled:opacity-50"
            >
              {log?.attended ? "출석 취소" : "출석 체크"}
            </button>
            <button
              type="button"
              onClick={startWorkout}
              disabled={busy}
              className="rounded-md border border-[hsl(var(--border))] px-3 py-1.5 text-sm hover:bg-[hsl(var(--muted))] disabled:opacity-50"
            >
              운동 시작
            </button>
            <button
              type="button"
              onClick={endWorkout}
              disabled={busy || !log?.startTime}
              className="rounded-md border border-[hsl(var(--border))] px-3 py-1.5 text-sm hover:bg-[hsl(var(--muted))] disabled:opacity-50"
            >
              운동 종료
            </button>
          </div>
        </section>

        {/* 논문 스터디 카드 */}
        <section className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] p-4 shadow-sm">
          <h2 className="text-base font-semibold mb-3">논문 스터디</h2>
          <p className="text-sm text-[hsl(var(--muted-foreground))] mb-4">
            이번 주 내가 읽은 논문 <strong className="text-[hsl(var(--foreground))]">{weekPapersCount}</strong>개
          </p>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/papers"
              className="inline-flex rounded-md border border-[hsl(var(--border))] px-3 py-1.5 text-sm hover:bg-[hsl(var(--muted))]"
            >
              내 논문 보기
            </Link>
            <Link
              href="/papers?add=1"
              className="inline-flex rounded-md bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] px-3 py-1.5 text-sm font-medium hover:opacity-90"
            >
              논문 추가 + 리뷰 작성
            </Link>
          </div>
        </section>
      </div>

      {startConfirm && (
        <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/50 p-4" role="dialog" aria-modal="true">
          <div className="rounded-xl border bg-[hsl(var(--background))] p-4 shadow-lg max-w-sm w-full">
            <p className="text-sm mb-4">
              이미 시작 시간이 있습니다({log?.startTime}). 다시 시작하면 현재 시간으로 덮어씁니다. 계속할까요?
            </p>
            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => setStartConfirm(false)}
                className="rounded-md border border-[hsl(var(--border))] px-3 py-1.5 text-sm"
              >
                취소
              </button>
              <button
                type="button"
                onClick={confirmStartOverwrite}
                className="rounded-md bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] px-3 py-1.5 text-sm"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
