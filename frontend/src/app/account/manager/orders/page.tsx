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
        <h2 className="text-2xl font-semibold text-[var(--ink)]">仅产品经理可访问</h2>
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
          setMessage("资料已确认的订单审核状态已锁定，需管理员后台更改。");
          return order;
        }

        const next = { ...order, ...patch };

        if (next.reviewStatus === "pending_confirmation" && next.paymentStatus !== "paid") {
          setMessage("所有等待确认订单必须是已付款状态，修改已拦截。");
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
        <h2 className="text-3xl font-semibold tracking-tight text-[var(--ink)]">产品经理订单管理</h2>
        <p className="mt-3 text-sm text-[var(--muted)]">
          规则：排队等待确认的订单必须已付款。经理可取消订单或修改订单。若驾驶员/车辆任一资料已确认，则订单信息锁定，只允许管理员后台更改。
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
                订单号
                <input
                  value={order.orderNo}
                  disabled={locked}
                  onChange={(event) => updateOrder(order.id, { orderNo: event.target.value })}
                  className="mt-2 w-full rounded-xl border px-3 py-2 text-sm disabled:bg-[rgba(235,235,235,0.6)]"
                />
              </label>
              <label className="text-sm">
                产品
                <input
                  value={order.product}
                  disabled={locked}
                  onChange={(event) => updateOrder(order.id, { product: event.target.value })}
                  className="mt-2 w-full rounded-xl border px-3 py-2 text-sm disabled:bg-[rgba(235,235,235,0.6)]"
                />
              </label>
              <label className="text-sm">
                支付状态
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
                审核状态
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
                取消订单
              </button>
              <span className="text-xs text-[var(--muted)]">
                资料锁定：{locked ? "已锁定（需管理员后台更改）" : "未锁定"}
              </span>
            </div>
          </article>
        );
      })}
    </div>
  );
}
