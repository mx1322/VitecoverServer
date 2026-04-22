"use client";

import type { FormEvent } from "react";
import { useEffect, useState } from "react";

type SettingsState = {
  email: string;
  password: string;
  phone: string;
  address: string;
};

const initialSettings: SettingsState = {
  email: "",
  password: "••••••••••••",
  phone: "+33 6 00 00 00 00",
  address: "Paris, France",
};

const labels: Record<keyof SettingsState, string> = {
  email: "Email",
  password: "Password",
  phone: "Phone",
  address: "Address",
};

export default function SettingsPage() {
  const [settings, setSettings] = useState(initialSettings);
  const [editingKey, setEditingKey] = useState<keyof SettingsState | null>(null);
  const [draftValue, setDraftValue] = useState("");

  useEffect(() => {
    async function loadSessionEmail() {
      try {
        const response = await fetch("/api/auth/session", { cache: "no-store" });
        const payload = (await response.json()) as {
          authenticated?: boolean;
          account?: { user?: { email?: string } };
        };
        const nextEmail = payload.account?.user?.email?.trim();

        if (payload.authenticated && nextEmail) {
          setSettings((current) => ({ ...current, email: nextEmail }));
        }
      } catch {
        // Keep local fallback.
      }
    }

    loadSessionEmail();
  }, []);

  function startEdit(key: keyof SettingsState) {
    if (key === "email") {
      return;
    }

    setEditingKey(key);
    setDraftValue(settings[key]);
  }

  function saveSetting(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editingKey) {
      return;
    }

    setSettings((current) => ({ ...current, [editingKey]: draftValue }));
    setEditingKey(null);
  }

  return (
    <div className="space-y-6">
      <section className="rounded-[28px] border border-[rgba(22,36,58,0.08)] bg-[rgba(255,255,255,0.94)] p-6 shadow-[0_18px_50px_rgba(22,36,58,0.05)]">
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--muted)]">
          Account Settings
        </p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--ink)]">Settings</h2>
        <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
          Update your personal details and account preferences.
        </p>
      </section>

      <section className="space-y-4">
        {(Object.keys(labels) as Array<keyof SettingsState>).map((key) => (
          <article
            key={key}
            className="rounded-[22px] border border-[rgba(22,36,58,0.08)] bg-[rgba(255,255,255,0.94)] px-5 py-5 shadow-[0_14px_36px_rgba(22,36,58,0.04)]"
          >
            {editingKey === key ? (
              <form onSubmit={saveSetting} className="flex flex-col gap-4 md:flex-row md:items-end">
                <label className="min-w-0 flex-1 text-sm font-medium text-[var(--ink)]">
                  {labels[key]}
                  <input
                    autoFocus
                    value={draftValue}
                    onChange={(event) => setDraftValue(event.target.value)}
                    className="mt-2 w-full rounded-2xl border border-[rgba(22,36,58,0.12)] px-4 py-3 text-sm"
                  />
                </label>
                <div className="flex gap-3">
                  <button className="rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-[var(--ink)]">
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingKey(null)}
                    className="rounded-full border border-[rgba(22,36,58,0.08)] px-5 py-3 text-sm font-medium text-[var(--ink)]"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm text-[var(--muted)]">{labels[key]}</p>
                  <p className="mt-1 font-semibold text-[var(--ink)]">
                    {key === "email" ? settings[key] || "Signed in" : settings[key]}
                  </p>
                </div>
                <button
                  disabled={key === "email"}
                  onClick={() => startEdit(key)}
                  className="rounded-full border border-[rgba(22,36,58,0.08)] px-4 py-2 text-sm font-medium text-[var(--ink)] transition hover:bg-[rgba(22,36,58,0.03)] disabled:cursor-not-allowed disabled:bg-[rgba(235,235,235,0.6)] disabled:text-[var(--muted)]"
                >
                  {key === "email" ? "Locked" : "Edit"}
                </button>
              </div>
            )}
          </article>
        ))}
      </section>
    </div>
  );
}
