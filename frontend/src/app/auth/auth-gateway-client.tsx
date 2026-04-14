"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

type Mode = "login" | "register" | "forgot";

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

export function AuthGatewayClient({ returnTo }: { returnTo: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    startTransition(async () => {
      try {
        const payload = await requestJson<{
          authenticated: boolean;
        }>("/api/auth/session", {
          method: "GET",
        });

        if (payload.authenticated) {
          router.replace(returnTo || "/account");
        }
      } catch {
        // Ignore session probe errors on the public entry.
      }
    });
  }, [returnTo, router]);

  function handleSubmit() {
    setError("");
    setNotice("");

    startTransition(async () => {
      try {
        if (!email.trim()) {
          throw new Error("Email is required.");
        }

        if (mode === "login") {
          if (!password) {
            throw new Error("Password is required.");
          }

          await requestJson("/api/auth/login", {
            method: "POST",
            body: JSON.stringify({
              email,
              password,
            }),
          });

          router.push(returnTo || "/account");
          return;
        }

        if (mode === "register") {
          if (!firstName.trim() || !lastName.trim()) {
            throw new Error("First name and last name are required.");
          }

          if (!password || password.length < 8) {
            throw new Error("Password must be at least 8 characters long.");
          }

          if (password !== confirmPassword) {
            throw new Error("Passwords do not match.");
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
          setNotice("Account created. Check your inbox to verify the email before signing in.");
          return;
        }

        await requestJson("/api/auth/password/request", {
          method: "POST",
          body: JSON.stringify({
            email,
          }),
        });
        setNotice("Password reset email sent. Check your inbox for the secure reset link.");
      } catch (requestError) {
        setError(requestError instanceof Error ? requestError.message : "Unable to continue.");
      }
    });
  }

  const cardClass =
    "rounded-[32px] border border-[rgba(22,36,58,0.08)] bg-[rgba(255,255,255,0.94)] p-8 shadow-[0_24px_70px_rgba(22,36,58,0.08)]";
  const fieldClass =
    "mt-2 w-full rounded-2xl border border-[rgba(22,36,58,0.12)] bg-white px-4 py-3 text-sm text-[var(--ink)] transition duration-200 ease-out hover:border-[rgba(22,36,58,0.22)] focus:border-[rgba(255,179,71,0.8)] focus:outline-none focus:ring-2 focus:ring-[rgba(255,179,71,0.22)]";
  const primaryButtonClass =
    "inline-flex items-center justify-center rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-[var(--ink)] shadow-[0_10px_24px_rgba(255,179,71,0.18)] transition duration-200 ease-out hover:scale-[1.03] hover:bg-[#f2a63a] hover:shadow-[0_16px_32px_rgba(255,179,71,0.28)] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70";

  return (
    <main className="section-wrap py-16 md:py-24">
      <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <section className="rounded-[36px] border border-[rgba(22,36,58,0.08)] bg-[linear-gradient(180deg,rgba(22,36,58,0.96),rgba(13,27,43,0.96))] p-8 text-white shadow-[0_28px_80px_rgba(22,36,58,0.2)]">
          <p className="eyebrow text-[var(--accent)]">Account center</p>
          <h1 className="mt-5 text-5xl font-semibold leading-[0.95] tracking-tight">
            A dedicated customer access module with WordPress-style control.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-[rgba(255,255,255,0.72)]">
            Customers register once, verify their email, sign in securely, manage profile data,
            review orders, and maintain reusable vehicle and driver records from one private space.
          </p>
          <div className="mt-8 grid gap-3">
            <div className="rounded-[24px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.06)] p-4 text-sm text-[rgba(255,255,255,0.78)]">
              Email verification and password recovery routes are isolated under `/auth`.
            </div>
            <div className="rounded-[24px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.06)] p-4 text-sm text-[rgba(255,255,255,0.78)]">
              Account control, orders, vehicles, and drivers stay together under `/account`.
            </div>
            <div className="rounded-[24px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.06)] p-4 text-sm text-[rgba(255,255,255,0.78)]">
              Quote continuation still works, but the identity system now has its own entrance.
            </div>
          </div>
        </section>

        <section className={cardClass}>
          <div className="grid grid-cols-3 gap-2 rounded-[24px] bg-[var(--surface-2)] p-2">
            {(["login", "register", "forgot"] as Mode[]).map((entry) => (
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
                {entry === "login" ? "Sign in" : entry === "register" ? "Register" : "Forgot"}
              </button>
            ))}
          </div>

          <div className="mt-8">
            <h2 className="text-3xl font-semibold text-[var(--ink)]">
              {mode === "login"
                ? "Secure sign in"
                : mode === "register"
                  ? "Create your customer account"
                  : "Reset your password"}
            </h2>
            <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
              {mode === "login"
                ? "Use your verified email and password to access the private customer control center."
                : mode === "register"
                  ? "Registration sends a verification email before the account can be used."
                  : "Enter the account email and we will send a reset link."}
            </p>
          </div>

          {mode === "login" ? (
            <div className="mt-5 rounded-[24px] border border-[rgba(22,36,58,0.08)] bg-[var(--surface-2)] px-4 py-4 text-sm text-[var(--ink)]">
              No account yet?{" "}
              <button
                type="button"
                onClick={() => {
                  setMode("register");
                  setError("");
                  setNotice("");
                }}
                className="font-semibold text-[var(--ink)] underline decoration-[rgba(22,36,58,0.28)] underline-offset-4"
              >
                Create your account here
              </button>
            </div>
          ) : null}

          {mode === "register" ? (
            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <label className="block text-sm font-medium text-[var(--ink)]">
                First name
                <input
                  type="text"
                  value={firstName}
                  onChange={(event) => setFirstName(event.target.value)}
                  className={fieldClass}
                />
              </label>
              <label className="block text-sm font-medium text-[var(--ink)]">
                Last name
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
            Email
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className={fieldClass}
            />
          </label>

          {mode !== "forgot" ? (
            <label className="mt-5 block text-sm font-medium text-[var(--ink)]">
              Password
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
              Confirm password
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
                ? "Processing..."
                : mode === "login"
                  ? "Sign in"
                  : mode === "register"
                    ? "Create account"
                    : "Send reset link"}
            </button>
            <Link href="/quote" className="text-sm font-semibold text-[var(--muted)]">
              Back to quote
            </Link>
            {mode !== "register" ? (
              <button
                type="button"
                onClick={() => {
                  setMode("register");
                  setError("");
                  setNotice("");
                }}
                className="text-sm font-semibold text-[var(--ink)]"
              >
                Register a new account
              </button>
            ) : null}
          </div>
        </section>
      </div>
    </main>
  );
}
