"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

async function verifyToken(token: string): Promise<void> {
  const response = await fetch("/api/auth/verify-email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ token }),
  });

  const payload = (await response.json()) as { error?: string };
  if (!response.ok) {
    throw new Error(payload.error ?? "Unable to verify this email.");
  }
}

export function VerifyEmailClient({ token }: { token: string }) {
  const [state, setState] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Verifying the email token...");

  useEffect(() => {
    if (!token) {
      setState("error");
      setMessage("Missing verification token.");
      return;
    }

    void verifyToken(token)
      .then(() => {
        setState("success");
        setMessage("Email verified. The account can now sign in.");
      })
      .catch((error) => {
        setState("error");
        setMessage(error instanceof Error ? error.message : "Unable to verify this email.");
      });
  }, [token]);

  return (
    <main className="section-wrap py-20">
      <div className="mx-auto max-w-lg rounded-[32px] border border-[rgba(22,36,58,0.08)] bg-[rgba(255,255,255,0.94)] p-8 shadow-[0_24px_70px_rgba(22,36,58,0.08)]">
        <p className="eyebrow">Email verification</p>
        <h1 className="mt-4 text-4xl font-semibold text-[var(--ink)]">
          {state === "loading"
            ? "Confirming your account"
            : state === "success"
              ? "Verification complete"
              : "Verification failed"}
        </h1>
        <p className="mt-4 text-sm leading-7 text-[var(--muted)]">{message}</p>
        <div className="mt-8">
          <Link href="/auth" className="rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-[var(--ink)]">
            Go to sign in
          </Link>
        </div>
      </div>
    </main>
  );
}
