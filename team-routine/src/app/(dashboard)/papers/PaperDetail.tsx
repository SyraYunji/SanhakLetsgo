"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Paper = {
  id: string;
  title: string;
  url: string | null;
  tags: string[];
  readAt: string;
  review: {
    id: string;
    summary: string | null;
    contribution: string | null;
    method: string | null;
    experiment: string | null;
    limitation: string | null;
    idea: string | null;
  } | null;
};

export function PaperDetail({ paper }: { paper: Paper }) {
  const router = useRouter();
  const [editing, setEditing] = useState(!paper.review);
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({
    summary: paper.review?.summary ?? "",
    contribution: paper.review?.contribution ?? "",
    method: paper.review?.method ?? "",
    experiment: paper.review?.experiment ?? "",
    limitation: paper.review?.limitation ?? "",
    idea: paper.review?.idea ?? "",
  });

  const saveReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      const res = await fetch(`/api/papers/${paper.id}/review`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setEditing(false);
        router.refresh();
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <section className="rounded-xl border border-[hsl(var(--border))] p-4 mb-4">
        <h1 className="text-lg font-semibold mb-2">{paper.title}</h1>
        <dl className="text-sm space-y-1 text-[hsl(var(--muted-foreground))]">
          <div>
            <dt className="inline font-medium text-[hsl(var(--foreground))]">링크 </dt>
            <dd className="inline">
              {paper.url ? (
                <a href={paper.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 break-all">
                  {paper.url}
                </a>
              ) : (
                "—"
              )}
            </dd>
          </div>
          <div>
            <dt className="inline font-medium text-[hsl(var(--foreground))]">태그 </dt>
            <dd className="inline">{paper.tags.length ? paper.tags.join(", ") : "—"}</dd>
          </div>
          <div>
            <dt className="inline font-medium text-[hsl(var(--foreground))]">읽은 날짜 </dt>
            <dd className="inline">{paper.readAt}</dd>
          </div>
        </dl>
      </section>

      <section className="rounded-xl border border-[hsl(var(--border))] p-4">
        <h2 className="text-base font-semibold mb-3">내 리뷰</h2>
        {editing ? (
          <form onSubmit={saveReview} className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">한줄요약 (1문장)</label>
              <textarea
                value={form.summary}
                onChange={(e) => setForm((f) => ({ ...f, summary: e.target.value }))}
                rows={2}
                className="w-full rounded-md border border-[hsl(var(--border))] px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">핵심 기여 (3줄 이내)</label>
              <textarea
                value={form.contribution}
                onChange={(e) => setForm((f) => ({ ...f, contribution: e.target.value }))}
                rows={3}
                className="w-full rounded-md border border-[hsl(var(--border))] px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">방법/모델 (자유)</label>
              <textarea
                value={form.method}
                onChange={(e) => setForm((f) => ({ ...f, method: e.target.value }))}
                rows={3}
                className="w-full rounded-md border border-[hsl(var(--border))] px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">실험/결과 (자유)</label>
              <textarea
                value={form.experiment}
                onChange={(e) => setForm((f) => ({ ...f, experiment: e.target.value }))}
                rows={3}
                className="w-full rounded-md border border-[hsl(var(--border))] px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">한계/의문점 (자유)</label>
              <textarea
                value={form.limitation}
                onChange={(e) => setForm((f) => ({ ...f, limitation: e.target.value }))}
                rows={3}
                className="w-full rounded-md border border-[hsl(var(--border))] px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">내 아이디어/후속 실험 (자유)</label>
              <textarea
                value={form.idea}
                onChange={(e) => setForm((f) => ({ ...f, idea: e.target.value }))}
                rows={3}
                className="w-full rounded-md border border-[hsl(var(--border))] px-3 py-2 text-sm"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={busy}
                className="rounded-md bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] px-3 py-1.5 text-sm font-medium disabled:opacity-50"
              >
                저장
              </button>
              {paper.review && (
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="rounded-md border border-[hsl(var(--border))] px-3 py-1.5 text-sm"
                >
                  취소
                </button>
              )}
            </div>
          </form>
        ) : (
          <>
            {paper.review ? (
              <div className="space-y-3 text-sm">
                <div>
                  <h3 className="font-medium text-[hsl(var(--muted-foreground))]">한줄요약</h3>
                  <p className="whitespace-pre-wrap">{paper.review.summary || "—"}</p>
                </div>
                <div>
                  <h3 className="font-medium text-[hsl(var(--muted-foreground))]">핵심 기여</h3>
                  <p className="whitespace-pre-wrap">{paper.review.contribution || "—"}</p>
                </div>
                <div>
                  <h3 className="font-medium text-[hsl(var(--muted-foreground))]">방법/모델</h3>
                  <p className="whitespace-pre-wrap">{paper.review.method || "—"}</p>
                </div>
                <div>
                  <h3 className="font-medium text-[hsl(var(--muted-foreground))]">실험/결과</h3>
                  <p className="whitespace-pre-wrap">{paper.review.experiment || "—"}</p>
                </div>
                <div>
                  <h3 className="font-medium text-[hsl(var(--muted-foreground))]">한계/의문점</h3>
                  <p className="whitespace-pre-wrap">{paper.review.limitation || "—"}</p>
                </div>
                <div>
                  <h3 className="font-medium text-[hsl(var(--muted-foreground))]">내 아이디어/후속 실험</h3>
                  <p className="whitespace-pre-wrap">{paper.review.idea || "—"}</p>
                </div>
              </div>
            ) : null}
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="mt-3 rounded-md border border-[hsl(var(--border))] px-3 py-1.5 text-sm"
            >
              {paper.review ? "수정" : "리뷰 작성"}
            </button>
          </>
        )}
      </section>
    </>
  );
}
