"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Dictionary } from "@/types/i18n";

async function verifyToken(token: string, fallbackError: string): Promise<void> {
  const response = await fetch("/api/auth/verify-email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ token }),
  });

  const payload = (await response.json()) as { error?: string };
  if (!response.ok) {
    throw new Error(fallbackError);
  }
}

export function VerifyEmailClient({ token, locale, dictionary }: { token: string; locale: string; dictionary: Dictionary["auth"] }) {
  const [state, setState] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState(dictionary.notices.verifyingToken);

  useEffect(() => {
    if (!token) {
      setState("error");
      setMessage(dictionary.errors.missingVerificationToken);
      return;
    }

    void verifyToken(token, dictionary.errors.unableToVerifyEmail)
      .then(() => {
        setState("success");
        setMessage(dictionary.notices.emailVerified);
      })
      .catch((error) => {
        setState("error");
        setMessage(error instanceof Error ? error.message : dictionary.errors.unableToVerifyEmail);
      });
  }, [token, dictionary]);

  return (
    <main className="section-wrap py-20">
      <div className="mx-auto max-w-lg rounded-[32px] border border-[rgba(22,36,58,0.08)] bg-[rgba(255,255,255,0.94)] p-8 shadow-[0_24px_70px_rgba(22,36,58,0.08)]">
        <p className="eyebrow">{dictionary.headings.verifyEmail}</p>
        <h1 className="mt-4 text-4xl font-semibold text-[var(--ink)]">
          {state === "loading"
            ? dictionary.headings.verifyingAccount
            : state === "success"
              ? dictionary.headings.verificationComplete
              : dictionary.headings.verificationFailed}
        </h1>
        <p className="mt-4 text-sm leading-7 text-[var(--muted)]">{message}</p>
        <div className="mt-8">
          <Link href={`/${locale}/auth`} className="rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-[var(--ink)]">
            {dictionary.actions.goToSignIn}
          </Link>
        </div>
      </div>
    </main>
  );
}
