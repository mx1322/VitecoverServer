import { mockDocuments } from "@/lib/account/mock-data";

function getDocumentStatusClass(status: string): string {
  if (status === "Uploaded") {
    return "rounded-full bg-[rgba(31,183,166,0.12)] px-3 py-1.5 text-xs font-semibold text-[var(--accent-2)]";
  }

  if (status === "Under review") {
    return "rounded-full bg-[rgba(255,179,71,0.16)] px-3 py-1.5 text-xs font-semibold text-[var(--ink)]";
  }

  return "rounded-full bg-[rgba(234,111,81,0.1)] px-3 py-1.5 text-xs font-semibold text-[var(--danger)]";
}

export default function AccountDocumentsPage() {
  return (
    <>
      <div className="rounded-[28px] border border-[rgba(22,36,58,0.08)] bg-[rgba(255,255,255,0.94)] p-6 shadow-[0_18px_50px_rgba(22,36,58,0.05)]">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--muted)]">
          Documents
        </p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--ink)]">
          Supporting files
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--muted)]">
          Track which documents are already submitted and which ones still need your attention.
        </p>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        {mockDocuments.map((document) => (
          <article
            key={document.id}
            className="rounded-[28px] border border-[rgba(22,36,58,0.08)] bg-[rgba(255,255,255,0.94)] p-6 shadow-[0_18px_50px_rgba(22,36,58,0.05)]"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--muted)]">
                  {document.category}
                </p>
                <h3 className="mt-3 text-xl font-semibold tracking-tight text-[var(--ink)]">
                  {document.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{document.updatedAt}</p>
              </div>
              <span className={getDocumentStatusClass(document.status)}>{document.status}</span>
            </div>
          </article>
        ))}
      </div>

      <div className="rounded-[28px] border border-[rgba(22,36,58,0.08)] bg-[rgba(255,255,255,0.94)] p-6 shadow-[0_18px_50px_rgba(22,36,58,0.05)]">
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-[var(--ink)] shadow-[0_10px_24px_rgba(255,179,71,0.18)] transition hover:scale-[1.02]"
        >
          Upload document
        </button>
      </div>
    </>
  );
}
