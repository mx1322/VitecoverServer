"use client";

import { useEffect, useState } from "react";

import type { AccountRole } from "@/lib/auth-session";
import { useCurrentLocale } from "@/lib/i18n/client";
import { t } from "@/lib/i18n/translations";

type WorkspaceReviewItem = {
  id: number;
  kind: "vehicle" | "driver";
  ownerName: string;
  ownerEmail: string;
  title: string;
  detail: string;
  details: Array<{ label: string; value: string }>;
  isVerified: boolean;
};

export default function ManagerWorkspaceReviewPage() {
  const locale = useCurrentLocale();
  const [role, setRole] = useState<AccountRole | null>(null);
  const [items, setItems] = useState<WorkspaceReviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  async function loadItems() {
    setLoading(true);

    try {
      const response = await fetch("/api/admin/workspace-review", { cache: "no-store" });
      const payload = (await response.json()) as { items?: WorkspaceReviewItem[]; error?: string };

      if (!response.ok) {
        throw new Error(payload.error || t(locale, "Unable to load approvals."));
      }

      setItems(payload.items || []);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : t(locale, "Unable to load approvals."));
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
        } else {
          setRole("customer");
        }
      } catch {
        setRole("customer");
      }
    }

    loadSession();
    loadItems();
  }, [locale]);

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
        throw new Error(payload.error || t(locale, "Unable to update approval."));
      }

      setItems((current) => current.filter((entry) => entry.id !== item.id || entry.kind !== item.kind));
      setMessage(t(locale, item.kind === "vehicle" ? "Vehicle approved." : "Driver approved."));
    } catch (error) {
      setMessage(error instanceof Error ? error.message : t(locale, "Unable to update approval."));
    }
  }

  const vehicleItems = items.filter((item) => item.kind === "vehicle");
  const driverItems = items.filter((item) => item.kind === "driver");

  if (role === null) {
    return (
      <p className="rounded-[22px] border border-[rgba(22,36,58,0.08)] bg-white px-5 py-5 text-sm text-[var(--muted)]">
        {t(locale, "Loading manager access...")}
      </p>
    );
  }

  if (role !== "product_manager" && role !== "admin") {
    return (
      <section className="rounded-[28px] border border-[rgba(22,36,58,0.08)] bg-[rgba(255,255,255,0.94)] p-6">
        <h2 className="text-2xl font-semibold text-[var(--ink)]">{t(locale, "Manager access required")}</h2>
        <p className="mt-2 text-sm text-[var(--muted)]">
          {t(locale, "This approval workspace is available to product managers and admins.")}
        </p>
      </section>
    );
  }

  return (
    <div className="space-y-6">
      <section className="rounded-[28px] border border-[rgba(22,36,58,0.08)] bg-[rgba(255,255,255,0.94)] p-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--muted)]">
          {t(locale, "Manager")}
        </p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--ink)]">{t(locale, "Approvals")}</h2>
        <p className="mt-3 text-sm text-[var(--muted)]">
          {t(locale, "Review submitted vehicles and drivers from Directus. Approved records are removed from this queue to save space.")}
        </p>
      </section>

      {message ? (
        <p className="rounded-2xl border border-[rgba(22,36,58,0.08)] bg-white px-4 py-3 text-sm text-[var(--muted)]">
          {message}
        </p>
      ) : null}

      {loading ? (
        <p className="rounded-[22px] border border-[rgba(22,36,58,0.08)] bg-white px-5 py-5 text-sm text-[var(--muted)]">
          {t(locale, "Loading approvals...")}
        </p>
      ) : null}

      {!loading && items.length === 0 ? (
        <p className="rounded-[22px] border border-[rgba(22,36,58,0.08)] bg-white px-5 py-5 text-sm text-[var(--muted)]">
          {t(locale, "No pending approvals.")}
        </p>
      ) : null}

      {!loading ? (
        <section className="space-y-6">
          <article className="rounded-[22px] border border-[rgba(22,36,58,0.08)] bg-white px-5 py-5">
            <h3 className="text-lg font-semibold text-[var(--ink)]">{t(locale, "Vehicle approvals")}</h3>
            {vehicleItems.length === 0 ? (
              <p className="mt-3 text-sm text-[var(--muted)]">{t(locale, "No pending vehicle approvals.")}</p>
            ) : (
              <div className="mt-4 space-y-3">
                {vehicleItems.map((item) => (
                  <article key={`${item.kind}-${item.id}`} className="rounded-[18px] border border-[rgba(22,36,58,0.08)] px-4 py-4">
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                      <div className="min-w-0">
                        <p className="font-semibold text-[var(--ink)]">{t(locale, "Vehicle")}: {item.title}</p>
                        <p className="mt-1 text-sm text-[var(--muted)]">
                          {t(locale, "Customer")}: {[item.ownerName, item.ownerEmail].filter(Boolean).join(" · ") || t(locale, "Unknown")}
                        </p>
                        <p className="mt-2 text-sm text-[var(--ink)]">{item.detail || t(locale, "No additional details")}</p>
                        <dl className="mt-3 grid gap-2 sm:grid-cols-2">
                          {item.details.map((detail) => (
                            <div key={`${item.id}-${detail.label}`} className="rounded-[14px] bg-[rgba(22,36,58,0.03)] px-3 py-2">
                              <dt className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
                                {detail.label}
                              </dt>
                              <dd className="mt-1 text-sm text-[var(--ink)]">{detail.value}</dd>
                            </div>
                          ))}
                        </dl>
                      </div>
                      <button
                        onClick={() => updateItem(item, true)}
                        className="rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-[var(--ink)]"
                      >
                        {t(locale, "Approve")}
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </article>

          <article className="rounded-[22px] border border-[rgba(22,36,58,0.08)] bg-white px-5 py-5">
            <h3 className="text-lg font-semibold text-[var(--ink)]">{t(locale, "Driver approvals")}</h3>
            {driverItems.length === 0 ? (
              <p className="mt-3 text-sm text-[var(--muted)]">{t(locale, "No pending driver approvals.")}</p>
            ) : (
              <div className="mt-4 space-y-3">
                {driverItems.map((item) => (
                  <article key={`${item.kind}-${item.id}`} className="rounded-[18px] border border-[rgba(22,36,58,0.08)] px-4 py-4">
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                      <div className="min-w-0">
                        <p className="font-semibold text-[var(--ink)]">{t(locale, "Driver")}: {item.title}</p>
                        <p className="mt-1 text-sm text-[var(--muted)]">
                          {t(locale, "Customer")}: {[item.ownerName, item.ownerEmail].filter(Boolean).join(" · ") || t(locale, "Unknown")}
                        </p>
                        <p className="mt-2 text-sm text-[var(--ink)]">{item.detail || t(locale, "No additional details")}</p>
                        <dl className="mt-3 grid gap-2 sm:grid-cols-2">
                          {item.details.map((detail) => (
                            <div key={`${item.id}-${detail.label}`} className="rounded-[14px] bg-[rgba(22,36,58,0.03)] px-3 py-2">
                              <dt className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
                                {detail.label}
                              </dt>
                              <dd className="mt-1 text-sm text-[var(--ink)]">{detail.value}</dd>
                            </div>
                          ))}
                        </dl>
                      </div>
                      <button
                        onClick={() => updateItem(item, true)}
                        className="rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-[var(--ink)]"
                      >
                        {t(locale, "Approve")}
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
