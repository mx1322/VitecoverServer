"use client";

import { useEffect, useState } from "react";

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
  if (!value) {
    return "Not set";
  }

  return new Intl.DateTimeFormat("en", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<AccountOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
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

    loadOrders();
  }, []);

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

  return (
    <div className="space-y-6">
      <section className="rounded-[28px] border border-[rgba(22,36,58,0.08)] bg-[rgba(255,255,255,0.94)] p-6 shadow-[0_18px_50px_rgba(22,36,58,0.05)]">
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--muted)]">
          Orders
        </p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--ink)]">Order history</h2>
        <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
          Review your orders, payment status, and generated policy contracts.
        </p>
      </section>

      {message ? (
        <p className="rounded-2xl border border-[rgba(22,36,58,0.08)] bg-[rgba(255,255,255,0.86)] px-4 py-3 text-sm text-[var(--muted)]">
          {message}
        </p>
      ) : null}

      <section className="space-y-4">
        {loading ? (
          <p className="rounded-[22px] border border-[rgba(22,36,58,0.08)] bg-white px-5 py-5 text-sm text-[var(--muted)]">
            Loading orders...
          </p>
        ) : null}

        {!loading && orders.length === 0 ? (
          <p className="rounded-[22px] border border-[rgba(22,36,58,0.08)] bg-white px-5 py-5 text-sm text-[var(--muted)]">
            No orders yet.
          </p>
        ) : null}

        {orders.map((order) => (
          <article
            key={order.id}
            className="rounded-[22px] border border-[rgba(22,36,58,0.08)] bg-[rgba(255,255,255,0.94)] px-5 py-5 shadow-[0_14px_36px_rgba(22,36,58,0.04)]"
          >
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="font-semibold text-[var(--ink)]">{order.orderNumber}</p>
                <p className="mt-1 text-sm text-[var(--muted)]">
                  Coverage: {formatDate(order.coverageStartAt)} to {formatDate(order.coverageEndAt)}
                </p>
                <p className="mt-1 text-sm text-[var(--muted)]">
                  Total: {order.totalAmount} {order.currency}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-[rgba(248,179,71,0.16)] px-3 py-1.5 text-xs font-semibold text-[var(--ink)]">
                  {order.status || "pending"}
                </span>
                {order.adminReviewStatus ? (
                  <span className="rounded-full border border-[rgba(22,36,58,0.08)] px-3 py-1.5 text-xs font-semibold text-[var(--muted)]">
                    Review: {order.adminReviewStatus}
                  </span>
                ) : null}
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-3">
              {order.contractFileUrl ? (
                <a
                  href={order.contractFileUrl}
                  className="rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-[var(--ink)]"
                >
                  Download policy
                </a>
              ) : (
                <button
                  onClick={generatePolicyDocuments}
                  className="rounded-full border border-[rgba(22,36,58,0.12)] px-4 py-2 text-sm font-medium text-[var(--ink)]"
                >
                  Generate policy document
                </button>
              )}
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
