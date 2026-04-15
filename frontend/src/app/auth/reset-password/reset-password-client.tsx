"use client";

import Link from "next/link";
import { useState, useTransition } from "react";

async function resetPassword(token: string, password: string): Promise<void> {
  const response = await fetch("/api/auth/password/reset", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ token, password }),
  });

  const payload = (await response.json()) as { error?: string };
  if (!response.ok) {
    throw new Error(payload.error ?? "Unable to reset the password.");
  }
}

export function ResetPasswordClient({ token }: { token: string }) {
  const [isPending, startTransition] = useTransition();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  function handleSubmit() {
    setError("");
    setNotice("");

    startTransition(async () => {
      try {
        if (!token) {
          throw new Error("Missing reset token.");
        }

        if (!password || password.length < 8) {
          throw new Error("Password must be at least 8 characters long.");
        }

        if (password !== confirmPassword) {
          throw new Error("Passwords do not match.");
        }

        await resetPassword(token, password);
        setNotice("Password updated. Sign in again with the new password.");
        setPassword("");
        setConfirmPassword("");
      } catch (requestError) {
        setError(requestError instanceof Error ? requestError.message : "Unable to reset.");
      }
    });
  }

  const fieldClass =
    "mt-2 w-full rounded-2xl border border-[rgba(22,36,58,0.12)] bg-white px-4 py-3 text-sm text-[var(--ink)] transition duration-200 ease-out hover:border-[rgba(22,36,58,0.22)] focus:border-[rgba(255,179,71,0.8)] focus:outline-none focus:ring-2 focus:ring-[rgba(255,179,71,0.22)]";

  return (
    <main className="section-wrap py-20">
      <div className="mx-auto max-w-lg rounded-[32px] border border-[rgba(22,36,58,0.08)] bg-[rgba(255,255,255,0.94)] p-8 shadow-[0_24px_70px_rgba(22,36,58,0.08)]">
        <p className="eyebrow">Reset password</p>
        <h1 className="mt-4 text-4xl font-semibold text-[var(--ink)]">Choose a new password</h1>
        <label className="mt-8 block text-sm font-medium text-[var(--ink)]">
          New password
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className={fieldClass}
          />
        </label>
        <label className="mt-5 block text-sm font-medium text-[var(--ink)]">
          Confirm password
          <input
            type="password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            className={fieldClass}
          />
        </label>
        {error ? (
          <p className="mt-5 rounded-2xl border border-[rgba(234,111,81,0.2)] bg-[rgba(234,111,81,0.08)] px-4 py-3 text-sm text-[var(--danger)]">
            {error}
          </p>
        ) : null}
        {notice ? (
          <p className="mt-5 rounded-2xl border border-[rgba(31,183,166,0.2)] bg-[rgba(31,183,166,0.08)] px-4 py-3 text-sm text-[var(--accent-2)]">
            {notice}
          </p>
        ) : null}
        <div className="mt-8 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isPending}
            className="rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-[var(--ink)]"
          >
            {isPending ? "Updating..." : "Update password"}
          </button>
          <Link href="/auth" className="text-sm font-semibold text-[var(--muted)]">
            Return to sign in
          </Link>
        </div>
      </div>
    </main>
  );
}
