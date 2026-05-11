"use client";

import { useEffect, useState, useTransition } from "react";

import type { Locale } from "@/lib/i18n/config";
import { t } from "@/lib/i18n/translations";

async function requestJson<T>(url: string, init: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
  });

  const payload = (await response.json()) as T & { error?: string };
  if (!response.ok) {
    throw new Error(payload.error ?? "Request failed.");
  }

  return payload;
}

export function AuthGatewayClient({ returnTo, locale }: { returnTo: string; locale: Locale }) {
  const [isPending, startTransition] = useTransition();
  const [mode, setMode] = useState<"login" | "register" | "forgot">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const safeReturnTo = returnTo.startsWith("/") && !returnTo.startsWith("//") ? returnTo : "/account";

  useEffect(() => {
    startTransition(async () => {
      try {
        const payload = await requestJson<{
          authenticated: boolean;
        }>("/api/auth/session?scope=identity", {
          method: "GET",
        });

        if (payload.authenticated) {
          window.location.replace(safeReturnTo);
        }
      } catch {
        // Ignore session probe errors on the public entry.
      }
    });
  }, [safeReturnTo]);

  function handleSubmit() {
    setError("");
    setNotice("");

    startTransition(async () => {
      try {
        if (!email.trim()) {
          throw new Error(t(locale, "Email is required."));
        }

        if (mode === "register") {
          if (!firstName.trim() || !lastName.trim()) {
            throw new Error(t(locale, "First name and last name are required."));
          }

          if (!password || password.length < 8) {
            throw new Error(t(locale, "Password must be at least 8 characters long."));
          }

          if (password !== confirmPassword) {
            throw new Error(t(locale, "Passwords do not match."));
          }

          await requestJson("/api/auth/register", {
            method: "POST",
            body: JSON.stringify({
              email,
              password,
              firstName,
              lastName,
            }),
          });

          setMode("login");
          setPassword("");
          setConfirmPassword("");
          setNotice(t(locale, "Account created. Check your inbox to verify your email."));
          return;
        }

        if (mode === "forgot") {
          await requestJson("/api/auth/password/request", {
            method: "POST",
            body: JSON.stringify({
              email,
            }),
          });
          setNotice(t(locale, "Password reset email sent."));
          return;
        }

        if (!password) {
          throw new Error(t(locale, "Password is required."));
        }

        await requestJson("/api/auth/login", {
          method: "POST",
          body: JSON.stringify({
            email,
            password,
          }),
        });

        window.location.assign(safeReturnTo);
      } catch (requestError) {
        setError(requestError instanceof Error ? requestError.message : t(locale, "Unable to continue."));
      }
    });
  }

  const cardClass =
    "w-full max-w-[520px] rounded-[32px] border border-[rgba(22,36,58,0.08)] bg-[rgba(255,255,255,0.94)] p-8 shadow-[0_24px_70px_rgba(22,36,58,0.08)] md:p-10";
  const fieldClass =
    "mt-2 w-full rounded-2xl border border-[rgba(22,36,58,0.12)] bg-white px-4 py-3 text-sm text-[var(--ink)] transition duration-200 ease-out hover:border-[rgba(22,36,58,0.22)] focus:border-[rgba(255,179,71,0.8)] focus:outline-none focus:ring-2 focus:ring-[rgba(255,179,71,0.22)]";
  const primaryButtonClass =
    "inline-flex items-center justify-center rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-[var(--ink)] shadow-[0_10px_24px_rgba(255,179,71,0.18)] transition duration-200 ease-out hover:scale-[1.03] hover:bg-[#f2a63a] hover:shadow-[0_16px_32px_rgba(255,179,71,0.28)] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70";

  return (
    <main className="section-wrap flex min-h-[calc(100vh-88px)] items-center py-16 md:py-24">
      <div className="mx-auto flex w-full justify-center">
        <section className={cardClass}>
          <div className="grid grid-cols-3 gap-2 rounded-[24px] bg-[var(--surface-2)] p-2">
            {(["login", "register", "forgot"] as const).map((entry) => (
              <button
                key={entry}
                type="button"
                onClick={() => {
                  setMode(entry);
                  setError("");
                  setNotice("");
                }}
                className={`rounded-[18px] px-4 py-3 text-sm font-semibold transition ${
                  mode === entry
                    ? "bg-white text-[var(--ink)] shadow-[0_12px_30px_rgba(22,36,58,0.08)]"
                    : "text-[var(--muted)]"
                }`}
              >
                {entry === "login" ? t(locale, "Sign in") : entry === "register" ? t(locale, "Register") : t(locale, "Forgot")}
              </button>
            ))}
          </div>

          <div className="mt-8">
            <h2 className="text-3xl font-semibold text-[var(--ink)]">
              {mode === "login"
                ? t(locale, "Sign in")
                : mode === "register"
                  ? t(locale, "Create account")
                  : t(locale, "Reset password")}
            </h2>
            <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
              {mode === "login"
                ? t(locale, "Enter your email and password to continue.")
                : mode === "register"
                  ? t(locale, "Create your account and verify your email.")
                  : t(locale, "We will send a password reset link.")}
            </p>
          </div>

          {mode === "register" ? (
            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <label className="block text-sm font-medium text-[var(--ink)]">
                {t(locale, "First name")}
                <input
                  type="text"
                  value={firstName}
                  onChange={(event) => setFirstName(event.target.value)}
                  className={fieldClass}
                />
              </label>
              <label className="block text-sm font-medium text-[var(--ink)]">
                {t(locale, "Last name")}
                <input
                  type="text"
                  value={lastName}
                  onChange={(event) => setLastName(event.target.value)}
                  className={fieldClass}
                />
              </label>
            </div>
          ) : null}

          <label className="mt-6 block text-sm font-medium text-[var(--ink)]">
            {t(locale, "Email")}
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className={fieldClass}
            />
          </label>

          {mode !== "forgot" ? (
            <label className="mt-5 block text-sm font-medium text-[var(--ink)]">
              {t(locale, "Password")}
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className={fieldClass}
              />
            </label>
          ) : null}

          {mode === "register" ? (
            <label className="mt-5 block text-sm font-medium text-[var(--ink)]">
              {t(locale, "Confirm password")}
              <input
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                className={fieldClass}
              />
            </label>
          ) : null}

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

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isPending}
              className={primaryButtonClass}
            >
              {isPending
                ? t(locale, "Processing...")
                : mode === "login"
                  ? t(locale, "Sign in")
                  : mode === "register"
                    ? t(locale, "Create account")
                    : t(locale, "Send reset link")}
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
