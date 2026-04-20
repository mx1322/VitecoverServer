"use client";

import { useEffect, useMemo, useState } from "react";

type AccountOrder = {
  id: number;
  orderNumber?: string;
  status?: string | null;
  coverageStartAt?: string | null;
  paidAt?: string | null;
  contractFileUrl?: string;
};

type OrdersResponse = {
  orders?: AccountOrder[];
  generated?: number;
  skipped?: number;
  error?: string;
};

function formatDate(value?: string | null) {
  if (!value) {
    return "—";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function StatusBadge({ status }: { status?: string | null }) {
  const normalized = (status || "Unknown").toLowerCase();
  const className =
    normalized === "approved" || normalized === "issued"
      ? "bg-[rgba(248,179,71,0.16)] text-[var(--ink)]"
      : normalized.includes("pending") || normalized.includes("review")
        ? "bg-[rgba(255,240,204,1)] text-[var(--ink)]"
        : normalized === "expired"
          ? "bg-[rgba(234,237,241,1)] text-[var(--ink)]"
          : "bg-[rgba(234,237,241,1)] text-[var(--ink)]";

  return <span className={`rounded-full px-3 py-1.5 text-xs font-semibold ${className}`}>{status || "Unknown"}</span>;
}

export default function PoliciesPage() {
  const [orders, setOrders] = useState<AccountOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);

  async function loadOrders() {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("/api/account/orders", {
        method: "GET",
        cache: "no-store",
      });
      const data: OrdersResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to load policies.");
      }

      setOrders(data.orders || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load policies.");
    } finally {
      setLoading(false);
    }
  }

  async function generateMissingPdfs() {
    try {
      setGenerating(true);
      setError(null);

      const response = await fetch("/api/account/orders", {
        method: "POST",
      });
      const data: OrdersResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to generate policy PDFs.");
      }

      setOrders(data.orders || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to generate policy PDFs.");
    } finally {
      setGenerating(false);
    }
  }

  useEffect(() => {
    void loadOrders();
  }, []);

  const hasOrders = useMemo(() => orders.length > 0, [orders]);

  return (
    <div className="space-y-6">
      <section className="rounded-[28px] border border-[rgba(22,36,58,0.08)] bg-[rgba(255,255,255,0.94)] p-6 shadow-[0_18px_50px_rgba(22,36,58,0.05)]">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--muted)]">My Policies</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--ink)]">Policies</h2>
            <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
              View your recent orders and download policy PDFs when available.
            </p>
          </div>
          <button
            onClick={generateMissingPdfs}
            disabled={generating}
            className="rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-[var(--ink)] shadow-[0_10px_24px_rgba(255,179,71,0.18)] transition hover:translate-y-[-1px] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {generating ? "Generating..." : "Generate missing PDFs"}
          </button>
        </div>
      </section>

      <section className="rounded-[28px] border border-[rgba(22,36,58,0.08)] bg-[rgba(255,255,255,0.94)] p-6 shadow-[0_18px_50px_rgba(22,36,58,0.05)]">
        {loading ? (
          <p className="text-sm text-[var(--muted)]">Loading policies...</p>
        ) : error ? (
          <p className="text-sm text-[var(--muted)]">{error}</p>
        ) : !hasOrders ? (
          <p className="text-sm text-[var(--muted)]">No policies found for this account yet.</p>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="flex flex-col gap-4 rounded-[22px] border border-[rgba(22,36,58,0.08)] bg-[rgba(255,255,255,0.82)] px-4 py-4 lg:flex-row lg:items-center lg:justify-between"
              >
                <div className="min-w-0">
                  <p className="font-semibold text-[var(--ink)]">{order.orderNumber || `Order #${order.id}`}</p>
                  <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-sm text-[var(--muted)]">
                    <span>Order #{order.id}</span>
                    <span>Starts {formatDate(order.coverageStartAt)}</span>
                    <span>Paid {formatDate(order.paidAt)}</span>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <StatusBadge status={order.status} />
                  <a
                    href={`/api/account/orders/${order.id}/pdf`}
                    className="rounded-full border border-[rgba(22,36,58,0.08)] px-4 py-2 text-sm font-medium text-[var(--ink)] transition hover:bg-[rgba(22,36,58,0.03)]"
                  >
                    Download PDF
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
