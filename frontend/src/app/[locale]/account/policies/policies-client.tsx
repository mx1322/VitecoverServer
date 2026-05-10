"use client";

import { useEffect, useState } from "react";

import type { Dictionary } from "@/types/i18n";

type AccountOrder = {
  id: number;
  orderNumber: string;
  status: string;
  adminReviewStatus: string;
  totalAmount: string;
  currency: string;
  coverageStartAt: string;
  coverageEndAt: string;
  paidAt?: string | null;
  contractFileUrl?: string;
};

function formatDate(value: string | null | undefined) {
  if (!value) return "-";

  return new Intl.DateTimeFormat("fr", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function getStatusLabel(status: string, labels: Dictionary["account"]["statuses"]): string {
  if (["paid", "approved", "issued"].includes(status)) return labels.active;
  if (["expired", "cancelled", "canceled", "refunded"].includes(status)) return labels.expired;
  return labels.pending;
}

export function PoliciesClient({ dictionary }: { dictionary: Dictionary }) {
  const [orders, setOrders] = useState<AccountOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  async function loadOrders() {
    try {
      const response = await fetch("/api/account/orders", { cache: "no-store" });
      const payload = (await response.json()) as { orders?: AccountOrder[]; error?: string };

      if (!response.ok) {
        throw new Error(payload.error || "Unable to load orders.");
      }

      setOrders(payload.orders || []);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to load orders.");
    } finally {
      setLoading(false);
    }
  }

  async function generatePolicyDocuments() {
    setMessage("");

    try {
      const response = await fetch("/api/account/orders", { method: "POST" });
      const payload = (await response.json()) as { orders?: AccountOrder[]; error?: string };

      if (!response.ok) {
        throw new Error(payload.error || "Unable to generate policy documents.");
      }

      setOrders(payload.orders || []);
      setMessage("Policy documents are up to date.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to generate policy documents.");
    }
  }

  useEffect(() => {
    void loadOrders();
  }, []);

  return (
    <div className="space-y-4">
      {message ? (
        <p className="rounded-2xl border bg-white/90 px-4 py-3 text-sm text-[var(--muted)]">{message}</p>
      ) : null}

      {loading ? (
        <p className="rounded-2xl border bg-white/90 px-5 py-5 text-sm text-[var(--muted)]">Loading orders...</p>
      ) : null}

      {!loading && orders.length === 0 ? (
        <p className="rounded-2xl border bg-white/90 px-5 py-5 text-sm text-[var(--muted)]">No orders yet.</p>
      ) : null}

      {orders.map((order) => (
        <article key={order.id} className="rounded-2xl border bg-white/90 p-5">
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="font-semibold">{order.orderNumber}</p>
              <p className="mt-1 text-sm text-[var(--muted)]">
                {formatDate(order.coverageStartAt)} - {formatDate(order.coverageEndAt)}
              </p>
              <p className="mt-1 text-sm text-[var(--muted)]">
                {order.totalAmount} {order.currency}
              </p>
            </div>
            <span className="rounded-full bg-[rgba(248,179,71,0.16)] px-3 py-1.5 text-xs font-semibold">
              {getStatusLabel(order.status, dictionary.account.statuses)}
            </span>
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            {order.contractFileUrl ? (
              <a className="rounded-full border px-4 py-2 text-sm" href={order.contractFileUrl}>
                {dictionary.cta.downloadPdf}
              </a>
            ) : (
              <button className="rounded-full border px-4 py-2 text-sm" onClick={generatePolicyDocuments}>
                {dictionary.cta.downloadPdf}
              </button>
            )}
          </div>
        </article>
      ))}
    </div>
  );
}
