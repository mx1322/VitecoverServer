"use client";

import { useEffect, useState, useTransition } from "react";

import type { CustomerWorkspace } from "@/lib/directus-admin";

interface SessionResponse {
  found: boolean;
  workspace: CustomerWorkspace | null;
  error?: string;
}

const localAccountStorageKey = "vitecover-local-account-email";

async function postJson<T>(url: string, body: Record<string, unknown>): Promise<T> {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const payload = (await response.json()) as T & { error?: string };
  if (!response.ok) {
    throw new Error(payload.error ?? "Request failed.");
  }

  return payload;
}

export default function AccountPage() {
  const [isPending, startTransition] = useTransition();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [workspace, setWorkspace] = useState<CustomerWorkspace | null>(null);

  function loadWorkspace(targetEmail: string) {
    if (!targetEmail.trim()) {
      setError("Enter the local account email to open the orders area.");
      return;
    }

    setError("");

    startTransition(async () => {
      try {
        const payload = await postJson<SessionResponse>("/api/checkout/session", {
          email: targetEmail,
          createIfMissing: false,
        });

        if (!payload.found || !payload.workspace) {
          setWorkspace(null);
          setError("No local account was found for this email.");
          return;
        }

        setWorkspace(payload.workspace);
        window.localStorage.setItem(localAccountStorageKey, payload.workspace.customer.email);
      } catch (requestError) {
        setWorkspace(null);
        setError(
          requestError instanceof Error ? requestError.message : "Unable to load this account.",
        );
      }
    });
  }

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const savedEmail = window.localStorage.getItem(localAccountStorageKey) ?? "";
    if (!savedEmail) {
      return;
    }

    setEmail(savedEmail);
    loadWorkspace(savedEmail);
  }, []);

  return (
    <main className="section-wrap py-16">
      <p className="eyebrow">Orders area</p>
      <h1 className="mt-4 text-4xl font-semibold text-[var(--ink)]">
        Review orders, vehicles, and drivers from one place.
      </h1>
      <p className="mt-4 max-w-3xl text-lg leading-8 text-[var(--muted)]">
        This local account page focuses on the practical follow-up after checkout. The customer
        can reopen the saved account, check recent approved orders, and reuse the existing
        vehicle and driver records for the next temporary cover.
      </p>

      <div className="mt-10 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="rounded-[32px] border border-[rgba(22,36,58,0.08)] bg-[rgba(255,255,255,0.92)] p-6 shadow-[0_24px_70px_rgba(22,36,58,0.08)]">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
            Open local account
          </p>
          <label className="mt-5 block text-sm font-medium text-[var(--ink)]">
            Email
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-2 w-full rounded-2xl border border-[rgba(22,36,58,0.12)] bg-white px-4 py-3 text-sm text-[var(--ink)]"
            />
          </label>

          <button
            type="button"
            disabled={isPending}
            onClick={() => loadWorkspace(email)}
            className="mt-5 rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-[var(--ink)] shadow-[0_10px_24px_rgba(255,179,71,0.18)] transition duration-200 ease-out hover:scale-[1.03] hover:bg-[#f2a63a] hover:shadow-[0_16px_32px_rgba(255,179,71,0.28)] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:scale-100 disabled:hover:bg-[var(--accent)]"
          >
            {isPending ? "Opening account..." : "Open orders"}
          </button>

          {error ? (
            <p className="mt-5 rounded-2xl border border-[rgba(234,111,81,0.2)] bg-[rgba(234,111,81,0.08)] px-4 py-3 text-sm text-[var(--danger)]">
              {error}
            </p>
          ) : null}

          <div className="mt-6 rounded-[24px] bg-[var(--surface-2)] p-5 text-sm leading-6 text-[var(--muted)]">
            Recent orders are loaded from the same local account email used during checkout.
          </div>
        </section>

        <section className="space-y-4">
          {workspace ? (
            <>
              <div className="rounded-[32px] border border-[rgba(22,36,58,0.08)] bg-[rgba(255,255,255,0.92)] p-6 shadow-[0_24px_70px_rgba(22,36,58,0.08)]">
                <p className="eyebrow">Account</p>
                <h2 className="mt-3 text-2xl font-semibold text-[var(--ink)]">
                  {workspace.customer.firstName} {workspace.customer.lastName}
                </h2>
                <div className="mt-5 grid gap-3 md:grid-cols-3">
                  <div className="rounded-[24px] bg-[var(--surface-2)] p-4 text-sm text-[var(--ink)]">
                    Vehicles: {workspace.vehicles.length}
                  </div>
                  <div className="rounded-[24px] bg-[var(--surface-2)] p-4 text-sm text-[var(--ink)]">
                    Drivers: {workspace.drivers.length}
                  </div>
                  <div className="rounded-[24px] bg-[var(--surface-2)] p-4 text-sm text-[var(--ink)]">
                    Orders: {workspace.recentOrders.length}
                  </div>
                </div>
              </div>

              <div className="rounded-[32px] border border-[rgba(22,36,58,0.08)] bg-[rgba(255,255,255,0.92)] p-6 shadow-[0_24px_70px_rgba(22,36,58,0.08)]">
                <p className="eyebrow">Recent orders</p>
                <div className="mt-5 grid gap-4">
                  {workspace.recentOrders.length ? (
                    workspace.recentOrders.map((order) => (
                      <article
                        key={order.id}
                        className="rounded-[24px] border border-[rgba(22,36,58,0.08)] bg-white p-5"
                      >
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <h3 className="text-lg font-semibold text-[var(--ink)]">
                              {order.orderNumber}
                            </h3>
                            <p className="mt-1 text-sm text-[var(--muted)]">
                              {order.totalAmount} {order.currency}
                            </p>
                          </div>
                          <div className="rounded-full bg-[rgba(31,183,166,0.12)] px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--accent-2)]">
                            {order.status}
                          </div>
                        </div>
                        <div className="mt-4 grid gap-2 text-sm text-[var(--ink)] md:grid-cols-2">
                          <p>Review: {order.adminReviewStatus}</p>
                          <p>Paid at: {order.paidAt ? new Date(order.paidAt).toLocaleString() : "Pending"}</p>
                          <p>Starts: {new Date(order.coverageStartAt).toLocaleString()}</p>
                          <p>Ends: {new Date(order.coverageEndAt).toLocaleString()}</p>
                        </div>
                      </article>
                    ))
                  ) : (
                    <div className="rounded-[24px] bg-[var(--surface-2)] p-5 text-sm text-[var(--muted)]">
                      No orders yet for this account.
                    </div>
                  )}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-[32px] border border-[rgba(22,36,58,0.08)] bg-[rgba(255,255,255,0.92)] p-6 shadow-[0_24px_70px_rgba(22,36,58,0.08)]">
                  <p className="eyebrow">Vehicles</p>
                  <div className="mt-4 space-y-3">
                    {workspace.vehicles.map((vehicle) => (
                      <div
                        key={vehicle.id}
                        className="rounded-[24px] bg-[var(--surface-2)] p-4 text-sm text-[var(--ink)]"
                      >
                        <p className="font-semibold">{vehicle.registrationNumber}</p>
                        <p className="mt-1 text-[var(--muted)]">
                          {vehicle.manufacturer || "Vehicle"} {vehicle.model || ""} · {vehicle.fiscalPower} CV
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-[32px] border border-[rgba(22,36,58,0.08)] bg-[rgba(255,255,255,0.92)] p-6 shadow-[0_24px_70px_rgba(22,36,58,0.08)]">
                  <p className="eyebrow">Drivers</p>
                  <div className="mt-4 space-y-3">
                    {workspace.drivers.map((driver) => (
                      <div
                        key={driver.id}
                        className="rounded-[24px] bg-[var(--surface-2)] p-4 text-sm text-[var(--ink)]"
                      >
                        <p className="font-semibold">
                          {driver.firstName} {driver.lastName}
                        </p>
                        <p className="mt-1 text-[var(--muted)]">
                          {driver.email || "No email"} · {driver.licenseCountryCode}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="rounded-[32px] border border-[rgba(22,36,58,0.08)] bg-[rgba(255,255,255,0.92)] p-6 shadow-[0_24px_70px_rgba(22,36,58,0.08)]">
              <p className="eyebrow">Orders</p>
              <p className="mt-4 text-sm leading-6 text-[var(--muted)]">
                Open a local account to review the saved orders, vehicles, and drivers.
              </p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
