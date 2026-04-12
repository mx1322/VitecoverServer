"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

import type { CustomerWorkspace } from "@/lib/directus-admin";

interface SessionResponse {
  found: boolean;
  workspace: CustomerWorkspace | null;
  error?: string;
}

const localAccountStorageKey = "vitecover-local-account-email";
const primaryButtonClass =
  "inline-flex items-center justify-center rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-[var(--ink)] shadow-[0_10px_24px_rgba(255,179,71,0.18)] transition duration-200 ease-out hover:scale-[1.03] hover:bg-[#f2a63a] hover:shadow-[0_16px_32px_rgba(255,179,71,0.28)] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:scale-100 disabled:hover:bg-[var(--accent)]";
const secondaryButtonClass =
  "inline-flex items-center justify-center rounded-full border border-[rgba(22,36,58,0.12)] bg-white px-5 py-3 text-sm font-semibold text-[var(--ink)] transition duration-200 ease-out hover:scale-[1.03] hover:border-[rgba(22,36,58,0.2)] hover:bg-[rgba(22,36,58,0.04)] active:scale-[0.99]";
const fieldClass =
  "mt-2 w-full rounded-2xl border border-[rgba(22,36,58,0.12)] bg-white px-4 py-3 text-sm text-[var(--ink)] transition duration-200 ease-out hover:border-[rgba(22,36,58,0.22)] focus:border-[rgba(255,179,71,0.8)] focus:outline-none focus:ring-2 focus:ring-[rgba(255,179,71,0.22)]";

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

export function LoginClient({ returnTo }: { returnTo: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const savedEmail = window.localStorage.getItem(localAccountStorageKey) ?? "";
    if (savedEmail) {
      setEmail(savedEmail);
    }
  }, []);

  function handleLogin() {
    if (!email.trim()) {
      setError("Enter the local account email to continue.");
      return;
    }

    setError("");

    startTransition(async () => {
      try {
        const payload = await postJson<SessionResponse>("/api/checkout/session", {
          email,
          createIfMissing: false,
        });

        if (!payload.found || !payload.workspace) {
          setError("No local account was found for this email.");
          return;
        }

        window.localStorage.setItem(localAccountStorageKey, payload.workspace.customer.email);
        router.push(returnTo);
      } catch (requestError) {
        setError(requestError instanceof Error ? requestError.message : "Unable to log in.");
      }
    });
  }

  return (
    <main className="section-wrap py-20">
      <div className="mx-auto max-w-md rounded-[32px] border border-[rgba(22,36,58,0.08)] bg-[rgba(255,255,255,0.94)] p-8 shadow-[0_24px_70px_rgba(22,36,58,0.08)]">
        <p className="eyebrow">Login</p>
        <h1 className="mt-4 text-4xl font-semibold text-[var(--ink)]">Continue your order</h1>
        <p className="mt-4 text-sm leading-6 text-[var(--muted)]">
          Sign in with your local account email to access the protected steps.
        </p>

        <label className="mt-8 block text-sm font-medium text-[var(--ink)]">
          Email
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className={fieldClass}
          />
        </label>

        {error ? (
          <p className="mt-5 rounded-2xl border border-[rgba(234,111,81,0.2)] bg-[rgba(234,111,81,0.08)] px-4 py-3 text-sm text-[var(--danger)]">
            {error}
          </p>
        ) : null}

        <div className="mt-8 flex flex-wrap gap-3">
          <button type="button" onClick={handleLogin} disabled={isPending} className={primaryButtonClass}>
            {isPending ? "Checking account..." : "Sign in"}
          </button>
          <Link href={returnTo} className={secondaryButtonClass}>
            Back to quote
          </Link>
        </div>
      </div>
    </main>
  );
}

