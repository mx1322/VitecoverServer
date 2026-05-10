"use client";

import { useEffect, useState, useTransition } from "react";

import type { Dictionary } from "@/types/i18n";

async function requestJson<T>(url: string, init: RequestInit, fallbackError: string): Promise<T> {
  const response = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
  });

  const payload = (await response.json()) as T & { error?: string };
  if (!response.ok) {
    throw new Error(fallbackError);
  }

  return payload;
}

export function AuthGatewayClient({ returnTo, dictionary }: { returnTo: string; dictionary: Dictionary["auth"] }) {
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
        const payload = await requestJson<{ authenticated: boolean }>(
          "/api/auth/session?scope=identity",
          { method: "GET" },
          dictionary.errors.requestFailed,
        );

        if (payload.authenticated) {
          window.location.replace(safeReturnTo);
        }
      } catch {
        // Ignore session probe errors on the public entry.
      }
    });
  }, [safeReturnTo, dictionary.errors.requestFailed]);

  function handleSubmit() {
    setError("");
    setNotice("");

    startTransition(async () => {
      try {
        if (!email.trim()) throw new Error(dictionary.errors.emailRequired);

        if (mode === "register") {
          if (!firstName.trim() || !lastName.trim()) throw new Error(dictionary.errors.fullNameRequired);
          if (!password || password.length < 8) throw new Error(dictionary.errors.passwordMinLength);
          if (password !== confirmPassword) throw new Error(dictionary.errors.passwordsDoNotMatch);

          await requestJson(
            "/api/auth/register",
            { method: "POST", body: JSON.stringify({ email, password, firstName, lastName }) },
            dictionary.errors.requestFailed,
          );

          setMode("login");
          setPassword("");
          setConfirmPassword("");
          setNotice(dictionary.notices.accountCreated);
          return;
        }

        if (mode === "forgot") {
          await requestJson(
            "/api/auth/password/request",
            { method: "POST", body: JSON.stringify({ email }) },
            dictionary.errors.requestFailed,
          );
          setNotice(dictionary.notices.resetEmailSent);
          return;
        }

        if (!password) throw new Error(dictionary.errors.passwordRequired);

        await requestJson(
          "/api/auth/login",
          { method: "POST", body: JSON.stringify({ email, password }) },
          dictionary.errors.requestFailed,
        );

        window.location.assign(safeReturnTo);
      } catch (requestError) {
        setError(requestError instanceof Error ? requestError.message : dictionary.errors.unableToContinue);
      }
    });
  }

  return (
    <main className="section-wrap flex min-h-[calc(100vh-88px)] items-center py-16 md:py-24">
      <div className="mx-auto flex w-full justify-center">
        <section className="w-full max-w-[520px] rounded-[32px] border border-[rgba(22,36,58,0.08)] bg-[rgba(255,255,255,0.94)] p-8 shadow-[0_24px_70px_rgba(22,36,58,0.08)] md:p-10">
          <div className="grid grid-cols-3 gap-2 rounded-[24px] bg-[var(--surface-2)] p-2">
            {(["login", "register", "forgot"] as const).map((entry) => (
              <button key={entry} type="button" onClick={() => { setMode(entry); setError(""); setNotice(""); }} className={`rounded-[18px] px-4 py-3 text-sm font-semibold transition ${mode === entry ? "bg-white text-[var(--ink)] shadow-[0_12px_30px_rgba(22,36,58,0.08)]" : "text-[var(--muted)]"}`}>
                {entry === "login" ? dictionary.tabs.login : entry === "register" ? dictionary.tabs.register : dictionary.tabs.forgot}
              </button>
            ))}
          </div>
          <div className="mt-8">
            <h2 className="text-3xl font-semibold text-[var(--ink)]">{mode === "login" ? dictionary.headings.login : mode === "register" ? dictionary.headings.register : dictionary.headings.forgot}</h2>
            <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{mode === "login" ? dictionary.descriptions.login : mode === "register" ? dictionary.descriptions.register : dictionary.descriptions.forgot}</p>
          </div>
          {mode === "register" ? (
            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <label className="block text-sm font-medium text-[var(--ink)]">{dictionary.fields.firstName}<input type="text" value={firstName} onChange={(event) => setFirstName(event.target.value)} className="mt-2 w-full rounded-2xl border border-[rgba(22,36,58,0.12)] bg-white px-4 py-3 text-sm text-[var(--ink)] transition duration-200 ease-out hover:border-[rgba(22,36,58,0.22)] focus:border-[rgba(255,179,71,0.8)] focus:outline-none focus:ring-2 focus:ring-[rgba(255,179,71,0.22)]" /></label>
              <label className="block text-sm font-medium text-[var(--ink)]">{dictionary.fields.lastName}<input type="text" value={lastName} onChange={(event) => setLastName(event.target.value)} className="mt-2 w-full rounded-2xl border border-[rgba(22,36,58,0.12)] bg-white px-4 py-3 text-sm text-[var(--ink)] transition duration-200 ease-out hover:border-[rgba(22,36,58,0.22)] focus:border-[rgba(255,179,71,0.8)] focus:outline-none focus:ring-2 focus:ring-[rgba(255,179,71,0.22)]" /></label>
            </div>
          ) : null}
          <label className="mt-6 block text-sm font-medium text-[var(--ink)]">{dictionary.fields.email}<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="mt-2 w-full rounded-2xl border border-[rgba(22,36,58,0.12)] bg-white px-4 py-3 text-sm text-[var(--ink)] transition duration-200 ease-out hover:border-[rgba(22,36,58,0.22)] focus:border-[rgba(255,179,71,0.8)] focus:outline-none focus:ring-2 focus:ring-[rgba(255,179,71,0.22)]" /></label>
          {mode !== "forgot" ? <label className="mt-5 block text-sm font-medium text-[var(--ink)]">{dictionary.fields.password}<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="mt-2 w-full rounded-2xl border border-[rgba(22,36,58,0.12)] bg-white px-4 py-3 text-sm text-[var(--ink)] transition duration-200 ease-out hover:border-[rgba(22,36,58,0.22)] focus:border-[rgba(255,179,71,0.8)] focus:outline-none focus:ring-2 focus:ring-[rgba(255,179,71,0.22)]" /></label> : null}
          {mode === "register" ? <label className="mt-5 block text-sm font-medium text-[var(--ink)]">{dictionary.fields.confirmPassword}<input type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} className="mt-2 w-full rounded-2xl border border-[rgba(22,36,58,0.12)] bg-white px-4 py-3 text-sm text-[var(--ink)] transition duration-200 ease-out hover:border-[rgba(22,36,58,0.22)] focus:border-[rgba(255,179,71,0.8)] focus:outline-none focus:ring-2 focus:ring-[rgba(255,179,71,0.22)]" /></label> : null}
          {error ? <p className="mt-5 rounded-2xl border border-[rgba(234,111,81,0.2)] bg-[rgba(234,111,81,0.08)] px-4 py-3 text-sm text-[var(--danger)]">{error}</p> : null}
          {notice ? <p className="mt-5 rounded-2xl border border-[rgba(31,183,166,0.2)] bg-[rgba(31,183,166,0.08)] px-4 py-3 text-sm text-[var(--accent-2)]">{notice}</p> : null}
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <button type="button" onClick={handleSubmit} disabled={isPending} className="inline-flex items-center justify-center rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-[var(--ink)] shadow-[0_10px_24px_rgba(255,179,71,0.18)] transition duration-200 ease-out hover:scale-[1.03] hover:bg-[#f2a63a] hover:shadow-[0_16px_32px_rgba(255,179,71,0.28)] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70">
              {isPending ? dictionary.actions.processing : mode === "login" ? dictionary.tabs.login : mode === "register" ? dictionary.actions.createAccount : dictionary.actions.sendResetLink}
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
