"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const PARTICIPANT_NAMES = ["신현호", "창민석", "송수현", "강태영", "이윤지", "조수민"];

export function ParticipantSelect() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const select = async (name: string) => {
    setError(null);
    setBusy(true);
    try {
      const res = await fetch("/api/session/select", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        router.push("/dashboard");
        router.refresh();
      } else {
        setError(data.error ?? "선택에 실패했습니다");
      }
    } catch {
      setError("연결에 실패했습니다");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="w-full max-w-sm rounded-xl border bg-[hsl(var(--background))] p-6 shadow-sm">
      <h1 className="text-xl font-semibold text-center mb-6">참여자 선택</h1>
      <p className="text-sm text-[hsl(var(--muted-foreground))] text-center mb-4">
        나는 누구인가요?
      </p>
      <ul className="space-y-2 mb-4">
        {PARTICIPANT_NAMES.map((name) => (
          <li key={name}>
            <button
              type="button"
              onClick={() => select(name)}
              disabled={busy}
              className="w-full rounded-md border border-[hsl(var(--border))] px-4 py-2 text-sm font-medium hover:bg-[hsl(var(--muted))] disabled:opacity-50"
            >
              {name}
            </button>
          </li>
        ))}
      </ul>
      {error && (
        <p className="text-sm text-red-600 text-center" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
