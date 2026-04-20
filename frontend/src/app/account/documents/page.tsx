"use client";

import type { ChangeEvent } from "react";
import { useMemo, useRef, useState } from "react";

type DocumentItem = {
  id: string;
  name: string;
  status: "Uploaded" | "Missing" | "Under review";
  category: string;
  uploadedAt?: string;
};

const initialDocuments: DocumentItem[] = [
  {
    id: "driving-licence",
    name: "Driving licence",
    status: "Uploaded",
    category: "Driver",
    uploadedAt: "12 Aug 2026",
  },
  {
    id: "vehicle-registration",
    name: "Vehicle registration",
    status: "Under review",
    category: "Vehicle",
    uploadedAt: "13 Aug 2026",
  },
  {
    id: "identity-proof",
    name: "Identity proof",
    status: "Missing",
    category: "Account",
  },
];

function DocumentStatusBadge({
  status,
}: {
  status: DocumentItem["status"];
}) {
  const className =
    status === "Uploaded"
      ? "bg-[rgba(248,179,71,0.16)] text-[var(--ink)]"
      : status === "Under review"
        ? "bg-[rgba(255,240,204,1)] text-[var(--ink)]"
        : "bg-[rgba(234,237,241,1)] text-[var(--ink)]";

  return <span className={`rounded-full px-3 py-1.5 text-xs font-semibold ${className}`}>{status}</span>;
}

export default function DocumentsPage() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const replaceInputRef = useRef<HTMLInputElement | null>(null);
  const [documents, setDocuments] = useState<DocumentItem[]>(initialDocuments);
  const [replaceTargetId, setReplaceTargetId] = useState<string | null>(null);

  function handleUploadClick() {
    fileInputRef.current?.click();
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) {
      return;
    }

    const nextDocs = files.map((file, index) => ({
      id: `${file.name}-${Date.now()}-${index}`,
      name: file.name,
      category: "Uploaded file",
      status: "Uploaded" as const,
      uploadedAt: new Intl.DateTimeFormat("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }).format(new Date()),
    }));

    setDocuments((current) => [...nextDocs, ...current]);
    event.target.value = "";
  }

  function handleReplaceClick(id: string) {
    setReplaceTargetId(id);
    replaceInputRef.current?.click();
  }

  function handleReplaceChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file || !replaceTargetId) {
      return;
    }

    const uploadedAt = new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date());

    setDocuments((current) =>
      current.map((doc) =>
        doc.id === replaceTargetId
          ? { ...doc, name: file.name, status: "Uploaded", uploadedAt }
          : doc,
      ),
    );
    setReplaceTargetId(null);
    event.target.value = "";
  }

  function removeDocument(id: string) {
    setDocuments((current) => current.filter((doc) => doc.id !== id));
  }

  const counts = useMemo(
    () => ({
      uploaded: documents.filter((doc) => doc.status === "Uploaded").length,
      review: documents.filter((doc) => doc.status === "Under review").length,
      missing: documents.filter((doc) => doc.status === "Missing").length,
    }),
    [documents],
  );

  return (
    <div className="space-y-6">
      <section className="rounded-[28px] border border-[rgba(22,36,58,0.08)] bg-[rgba(255,255,255,0.94)] p-6 shadow-[0_18px_50px_rgba(22,36,58,0.05)]">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--muted)]">Documents</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--ink)]">Documents</h2>
            <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
              Keep your supporting documents ready for faster policy review.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleUploadClick}
              className="rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-[var(--ink)] shadow-[0_10px_24px_rgba(255,179,71,0.18)] transition hover:translate-y-[-1px]"
            >
              Upload document
            </button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              onChange={handleFileChange}
            />
            <input
              ref={replaceInputRef}
              type="file"
              className="hidden"
              onChange={handleReplaceChange}
            />
          </div>
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-3">
        <article className="rounded-[24px] border border-[rgba(22,36,58,0.08)] bg-[rgba(255,255,255,0.94)] p-5 shadow-[0_14px_36px_rgba(22,36,58,0.04)]">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--muted)]">Uploaded</p>
          <p className="mt-4 text-4xl font-semibold tracking-tight text-[var(--ink)]">{counts.uploaded}</p>
        </article>
        <article className="rounded-[24px] border border-[rgba(22,36,58,0.08)] bg-[rgba(255,255,255,0.94)] p-5 shadow-[0_14px_36px_rgba(22,36,58,0.04)]">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--muted)]">Under Review</p>
          <p className="mt-4 text-4xl font-semibold tracking-tight text-[var(--ink)]">{counts.review}</p>
        </article>
        <article className="rounded-[24px] border border-[rgba(22,36,58,0.08)] bg-[rgba(255,255,255,0.94)] p-5 shadow-[0_14px_36px_rgba(22,36,58,0.04)]">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--muted)]">Missing</p>
          <p className="mt-4 text-4xl font-semibold tracking-tight text-[var(--ink)]">{counts.missing}</p>
        </article>
      </section>

      <section className="rounded-[28px] border border-[rgba(22,36,58,0.08)] bg-[rgba(255,255,255,0.94)] p-6 shadow-[0_18px_50px_rgba(22,36,58,0.05)]">
        <div className="space-y-4">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="flex flex-col gap-4 rounded-[22px] border border-[rgba(22,36,58,0.08)] bg-[rgba(255,255,255,0.82)] px-4 py-4 lg:flex-row lg:items-center lg:justify-between"
            >
              <div>
                <p className="font-semibold text-[var(--ink)]">{doc.name}</p>
                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-sm text-[var(--muted)]">
                  <span>{doc.category}</span>
                  <span>{doc.uploadedAt || "Not uploaded yet"}</span>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <DocumentStatusBadge status={doc.status} />
                <button
                  onClick={() => handleReplaceClick(doc.id)}
                  className="rounded-full border border-[rgba(22,36,58,0.08)] px-4 py-2 text-sm font-medium text-[var(--ink)] transition hover:bg-[rgba(22,36,58,0.03)]"
                >
                  Replace
                </button>
                <button
                  onClick={() => removeDocument(doc.id)}
                  className="rounded-full border border-[rgba(22,36,58,0.08)] px-4 py-2 text-sm font-medium text-[var(--ink)] transition hover:bg-[rgba(22,36,58,0.03)]"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
