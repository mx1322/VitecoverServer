"use client";

import { useEffect, useState } from "react";

import type { AccountRole } from "@/lib/auth-session";

type ManagerOrder = {
  id: string;
  orderNo: string;
  paymentStatus: "paid" | "pending";
  reviewStatus: "pending_confirmation" | "approved" | "cancelled";
  vehicleVerified: boolean;
  driverVerified: boolean;
  product: string;
  customer: string;
};

const initialOrders: ManagerOrder[] = [
  {
    id: "ord-1",
    orderNo: "ORD-20260420-001",
    paymentStatus: "paid",
    reviewStatus: "pending_confirmation",
    vehicleVerified: false,
    driverVerified: false,
    product: "Passenger Car",
    customer: "max@example.com",
  },
  {
    id: "ord-2",
    orderNo: "ORD-20260420-002",
    paymentStatus: "paid",
    reviewStatus: "approved",
    vehicleVerified: true,
    driverVerified: true,
    product: "Van",
    customer: "luc@example.com",
  },
];

export default function ManagerOrdersPage() {
  const [role, setRole] = useState<AccountRole>("customer");
  const [orders, setOrders] = useState(initialOrders);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadRole() {
      try {
        const response = await fetch("/api/auth/session", { cache: "no-store" });
        const payload = (await response.json()) as {
          account?: { user?: { role?: AccountRole } };
        };
        if (payload.account?.user?.role) {
          setRole(payload.account.user.role);
        }
      } catch {
        // keep fallback
      }
    }

    loadRole();
  }, []);

  if (role !== "product_manager" && role !== "admin") {
    return (
      <section className="rounded-[28px] border border-[rgba(22,36,58,0.08)] bg-[rgba(255,255,255,0.94)] p-6">
        <h2 className="text-2xl font-semibold text-[var(--ink)]">Product managers only</h2>
      </section>
    );
  }

  function updateOrder(id: string, patch: Partial<ManagerOrder>) {
    setOrders((current) =>
      current.map((order) => {
        if (order.id !== id) {
          return order;
        }

        if ((order.vehicleVerified || order.driverVerified) && patch.reviewStatus !== undefined) {
          setMessage("The review state is locked for orders with verified documents. An administrator must change it.");
          return order;
        }

        const next = { ...order, ...patch };

        if (next.reviewStatus === "pending_confirmation" && next.paymentStatus !== "paid") {
          setMessage("All orders waiting for confirmation must already be paid. This change was blocked.");
          return order;
        }

        setMessage("");
        return next;
      }),
    );
  }

  return (
    <div className="space-y-6">
      <section className="rounded-[28px] border border-[rgba(22,36,58,0.08)] bg-[rgba(255,255,255,0.94)] p-6">
        <h2 className="text-3xl font-semibold tracking-tight text-[var(--ink)]">Product manager order review</h2>
        <p className="mt-3 text-sm text-[var(--muted)]">
          Rules: orders waiting for confirmation must already be paid. Managers can cancel or edit orders. If either the driver or vehicle documents have been verified, the order is locked and can only be changed by an administrator.
        </p>
      </section>

      {message ? (
        <p className="rounded-2xl border border-[rgba(234,111,81,0.2)] bg-[rgba(234,111,81,0.08)] px-4 py-3 text-sm text-[var(--danger)]">{message}</p>
      ) : null}

      {orders.map((order) => {
        const locked = order.vehicleVerified || order.driverVerified;

        return (
          <article key={order.id} className="rounded-[22px] border border-[rgba(22,36,58,0.08)] bg-white px-5 py-5">
            <div className="grid gap-3 md:grid-cols-2">
              <label className="text-sm">
                Order number
                <input
                  value={order.orderNo}
                  disabled={locked}
                  onChange={(event) => updateOrder(order.id, { orderNo: event.target.value })}
                  className="mt-2 w-full rounded-xl border px-3 py-2 text-sm disabled:bg-[rgba(235,235,235,0.6)]"
                />
              </label>
              <label className="text-sm">
                Product
                <input
                  value={order.product}
                  disabled={locked}
                  onChange={(event) => updateOrder(order.id, { product: event.target.value })}
                  className="mt-2 w-full rounded-xl border px-3 py-2 text-sm disabled:bg-[rgba(235,235,235,0.6)]"
                />
              </label>
              <label className="text-sm">
                Payment status
                <select
                  value={order.paymentStatus}
                  disabled={locked}
                  onChange={(event) => updateOrder(order.id, { paymentStatus: event.target.value as ManagerOrder["paymentStatus"] })}
                  className="mt-2 w-full rounded-xl border px-3 py-2 text-sm disabled:bg-[rgba(235,235,235,0.6)]"
                >
                  <option value="paid">paid</option>
                  <option value="pending">pending</option>
                </select>
              </label>
              <label className="text-sm">
                Review status
                <select
                  value={order.reviewStatus}
                  disabled={locked}
                  onChange={(event) => updateOrder(order.id, { reviewStatus: event.target.value as ManagerOrder["reviewStatus"] })}
                  className="mt-2 w-full rounded-xl border px-3 py-2 text-sm disabled:bg-[rgba(235,235,235,0.6)]"
                >
                  <option value="pending_confirmation">pending_confirmation</option>
                  <option value="approved">approved</option>
                  <option value="cancelled">cancelled</option>
                </select>
              </label>
            </div>

            <div className="mt-4 flex flex-wrap gap-3">
              <button
                disabled={locked}
                onClick={() => updateOrder(order.id, { reviewStatus: "cancelled" })}
                className="rounded-full border border-[rgba(22,36,58,0.12)] px-4 py-2 text-sm disabled:cursor-not-allowed disabled:bg-[rgba(235,235,235,0.6)] disabled:text-[var(--muted)]"
              >
                Cancel order
              </button>
              <span className="text-xs text-[var(--muted)]">
                Document lock: {locked ? "Locked (administrator required)" : "Unlocked"}
              </span>
            </div>
          </article>
        );
      })}
    </div>
  );
}
