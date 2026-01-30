"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function PaperAddForm({ onDone }: { onDone: () => void }) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [tagsStr, setTagsStr] = useState("");
  const [readAt, setReadAt] = useState(() => new Date().toISOString().slice(0, 10));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<Record<string, string[]>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError({});
    setBusy(true);
    try {
      const res = await fetch("/api/papers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          url: url.trim() || undefined,
          tags: tagsStr.split(",").map((t) => t.trim()).filter(Boolean),
          readAt,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? { _: ["등록 실패"] });
        return;
      }
      router.push(`/papers/${data.id}`);
      router.refresh();
      onDone();
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--muted))] p-4">
      <h2 className="text-base font-semibold mb-3">논문 추가</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-sm font-medium mb-1">제목 *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full rounded-md border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-3 py-2 text-sm"
          />
          {error.title?.[0] && <p className="text-xs text-red-600 mt-1">{error.title[0]}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">링크 (arXiv/DOI/URL)</label>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://..."
            className="w-full rounded-md border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">태그 (쉼표 구분)</label>
          <input
            type="text"
            value={tagsStr}
            onChange={(e) => setTagsStr(e.target.value)}
            placeholder="NLP, BERT"
            className="w-full rounded-md border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">읽은 날짜</label>
          <input
            type="date"
            value={readAt}
            onChange={(e) => setReadAt(e.target.value)}
            className="w-full rounded-md border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-3 py-2 text-sm"
          />
        </div>
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={busy}
            className="rounded-md bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] px-3 py-1.5 text-sm font-medium disabled:opacity-50"
          >
            추가
          </button>
          <button
            type="button"
            onClick={() => router.push("/papers")}
            className="rounded-md border border-[hsl(var(--border))] px-3 py-1.5 text-sm"
          >
            취소
          </button>
        </div>
      </form>
    </section>
  );
}
