"use client";

import { useEffect, useState } from "react";

import type { AccountRole } from "@/lib/auth-session";

type WorkspaceReviewItem = {
  id: number;
  kind: "vehicle" | "driver";
  ownerEmail: string;
  title: string;
  detail: string;
  isVerified: boolean;
};

export default function ManagerWorkspaceReviewPage() {
  const [role, setRole] = useState<AccountRole>("customer");
  const [items, setItems] = useState<WorkspaceReviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  async function loadItems() {
    setLoading(true);

    try {
      const response = await fetch("/api/admin/workspace-review", { cache: "no-store" });
      const payload = (await response.json()) as { items?: WorkspaceReviewItem[]; error?: string };

      if (!response.ok) {
        throw new Error(payload.error || "Unable to load approvals.");
      }

      setItems(payload.items || []);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to load approvals.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    async function loadSession() {
      try {
        const response = await fetch("/api/auth/session?scope=identity", { cache: "no-store" });
        const payload = (await response.json()) as {
          account?: { user?: { role?: AccountRole } };
        };
        const nextRole = payload.account?.user?.role;

        if (nextRole) {
          setRole(nextRole);
        }
      } catch {
        setRole("customer");
      }
    }

    loadSession();
    loadItems();
  }, []);

  async function updateItem(item: WorkspaceReviewItem, isVerified: boolean) {
    setMessage("");

    try {
      const response = await fetch("/api/admin/workspace-review", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind: item.kind, id: item.id, isVerified }),
      });
      const payload = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(payload.error || "Unable to update approval.");
      }

      setItems((current) => current.filter((entry) => entry.id !== item.id || entry.kind !== item.kind));
      setMessage(`${item.kind === "vehicle" ? "Vehicle" : "Driver"} approved.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to update approval.");
    }
  }

  const vehicleItems = items.filter((item) => item.kind === "vehicle");
  const driverItems = items.filter((item) => item.kind === "driver");

  if (role !== "product_manager" && role !== "admin") {
    return (
      <section className="rounded-[28px] border border-[rgba(22,36,58,0.08)] bg-[rgba(255,255,255,0.94)] p-6">
        <h2 className="text-2xl font-semibold text-[var(--ink)]">Manager access required</h2>
        <p className="mt-2 text-sm text-[var(--muted)]">
          This approval workspace is available to product managers and admins.
        </p>
      </section>
    );
  }

  return (
    <div className="space-y-6">
      <section className="rounded-[28px] border border-[rgba(22,36,58,0.08)] bg-[rgba(255,255,255,0.94)] p-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--muted)]">
          Manager
        </p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--ink)]">Approvals</h2>
        <p className="mt-3 text-sm text-[var(--muted)]">
          Review submitted vehicles and drivers from Directus. Approved records are removed from this queue to save space.
        </p>
      </section>

      {message ? (
        <p className="rounded-2xl border border-[rgba(22,36,58,0.08)] bg-white px-4 py-3 text-sm text-[var(--muted)]">
          {message}
        </p>
      ) : null}

      {loading ? (
        <p className="rounded-[22px] border border-[rgba(22,36,58,0.08)] bg-white px-5 py-5 text-sm text-[var(--muted)]">
          Loading approvals...
        </p>
      ) : null}

      {!loading && items.length === 0 ? (
        <p className="rounded-[22px] border border-[rgba(22,36,58,0.08)] bg-white px-5 py-5 text-sm text-[var(--muted)]">
          No pending approvals.
        </p>
      ) : null}

      {!loading ? (
        <section className="space-y-6">
          <article className="rounded-[22px] border border-[rgba(22,36,58,0.08)] bg-white px-5 py-5">
            <h3 className="text-lg font-semibold text-[var(--ink)]">Vehicle approvals</h3>
            {vehicleItems.length === 0 ? (
              <p className="mt-3 text-sm text-[var(--muted)]">No pending vehicle approvals.</p>
            ) : (
              <div className="mt-4 space-y-3">
                {vehicleItems.map((item) => (
                  <article key={`${item.kind}-${item.id}`} className="rounded-[18px] border border-[rgba(22,36,58,0.08)] px-4 py-4">
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                      <div>
                        <p className="font-semibold text-[var(--ink)]">Vehicle: {item.title}</p>
                        <p className="mt-1 text-sm text-[var(--muted)]">Customer: {item.ownerEmail || "Unknown"}</p>
                        <p className="mt-1 text-sm text-[var(--muted)]">{item.detail || "No additional details"}</p>
                      </div>
                      <button
                        onClick={() => updateItem(item, true)}
                        className="rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-[var(--ink)]"
                      >
                        Approve
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </article>

          <article className="rounded-[22px] border border-[rgba(22,36,58,0.08)] bg-white px-5 py-5">
            <h3 className="text-lg font-semibold text-[var(--ink)]">Driver approvals</h3>
            {driverItems.length === 0 ? (
              <p className="mt-3 text-sm text-[var(--muted)]">No pending driver approvals.</p>
            ) : (
              <div className="mt-4 space-y-3">
                {driverItems.map((item) => (
                  <article key={`${item.kind}-${item.id}`} className="rounded-[18px] border border-[rgba(22,36,58,0.08)] px-4 py-4">
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                      <div>
                        <p className="font-semibold text-[var(--ink)]">Driver: {item.title}</p>
                        <p className="mt-1 text-sm text-[var(--muted)]">Customer: {item.ownerEmail || "Unknown"}</p>
                        <p className="mt-1 text-sm text-[var(--muted)]">{item.detail || "No additional details"}</p>
                      </div>
                      <button
                        onClick={() => updateItem(item, true)}
                        className="rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-[var(--ink)]"
                      >
                        Approve
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </article>
        </section>
      ) : null}
    </div>
  );
}
