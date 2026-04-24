"use client";

import type { FormEvent } from "react";
import { useEffect, useState } from "react";

import type { CustomerWorkspaceDriver } from "@/lib/directus-admin";

type SessionResponse = {
  authenticated: boolean;
  account?: {
    drivers?: CustomerWorkspaceDriver[];
  } | null;
  error?: string;
};

type WorkspaceMutationResponse = {
  workspace?: {
    drivers?: CustomerWorkspaceDriver[];
  };
  error?: string;
};

type DriverFormState = {
  firstName: string;
  lastName: string;
  birthday: string;
  email: string;
  phone: string;
  licenseNumber: string;
  licenseCountryCode: string;
  licenseFrontFileName: string;
  licenseBackFileName: string;
  identityFrontFileName: string;
  identityBackFileName: string;
};

const emptyDriver: DriverFormState = {
  firstName: "",
  lastName: "",
  birthday: "",
  email: "",
  phone: "",
  licenseNumber: "",
  licenseCountryCode: "FR",
  licenseFrontFileName: "",
  licenseBackFileName: "",
  identityFrontFileName: "",
  identityBackFileName: "",
};

function DriverStatusBadge({ approved }: { approved: boolean }) {
  return (
    <span
      className={
        approved
          ? "rounded-full bg-[rgba(31,183,166,0.12)] px-3 py-1.5 text-xs font-semibold text-[var(--accent-2)]"
          : "rounded-full bg-[rgba(255,240,204,1)] px-3 py-1.5 text-xs font-semibold text-[var(--ink)]"
      }
    >
      {approved ? "Approved" : "Under review"}
    </span>
  );
}

function hasAllDriverDocs(driver: DriverFormState): boolean {
  return Boolean(
    driver.licenseFrontFileName.trim() &&
      driver.licenseBackFileName.trim() &&
      driver.identityFrontFileName.trim() &&
      driver.identityBackFileName.trim(),
  );
}

function formatBirthday(value?: string) {
  if (!value) {
    return "Not set";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

export default function DriversPage() {
  const [drivers, setDrivers] = useState<CustomerWorkspaceDriver[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [form, setForm] = useState(emptyDriver);
  const [loading, setLoading] = useState(true);
  const [isPending, setIsPending] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadDrivers() {
      try {
        const response = await fetch("/api/auth/session", { cache: "no-store" });
        const payload = (await response.json()) as SessionResponse;

        if (!response.ok) {
          throw new Error(payload.error || "Unable to load drivers.");
        }

        setDrivers(payload.account?.drivers || []);
      } catch (error) {
        setMessage(error instanceof Error ? error.message : "Unable to load drivers.");
      } finally {
        setLoading(false);
      }
    }

    loadDrivers();
  }, []);

  async function saveDriver(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!hasAllDriverDocs(form)) {
      setMessage("Please upload the front and back of the driving license and the front and back of the ID card or passport before submitting.");
      return;
    }

    setIsPending(true);
    setMessage("");

    try {
      const response = await fetch("/api/auth/workspace-item", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind: "driver",
          firstName: form.firstName,
          lastName: form.lastName,
          birthday: form.birthday,
          driverEmail: form.email,
          phone: form.phone,
          licenseNumber: form.licenseNumber,
          licenseCountryCode: form.licenseCountryCode,
        }),
      });
      const payload = (await response.json()) as WorkspaceMutationResponse;

      if (!response.ok) {
        throw new Error(payload.error || "Unable to save this driver.");
      }

      setDrivers(payload.workspace?.drivers || []);
      setForm(emptyDriver);
      setIsAdding(false);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to save this driver.");
    } finally {
      setIsPending(false);
    }
  }

  async function removeDriver(id: number, approved: boolean) {
    if (approved) {
      setMessage("This driver record has already been verified and cannot be deleted here. Please contact an administrator.");
      return;
    }

    setIsPending(true);
    setMessage("");

    try {
      const response = await fetch("/api/auth/workspace-item", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind: "driver", id }),
      });
      const payload = (await response.json()) as WorkspaceMutationResponse;

      if (!response.ok) {
        throw new Error(payload.error || "Unable to remove this driver.");
      }

      setDrivers(payload.workspace?.drivers || []);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to remove this driver.");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className="space-y-6">
      <section className="rounded-[28px] border border-[rgba(22,36,58,0.08)] bg-[rgba(255,255,255,0.94)] p-6 shadow-[0_18px_50px_rgba(22,36,58,0.05)]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--muted)]">Drivers</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--ink)]">Drivers</h2>
            <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
              Please upload the driver's documents: front and back of the driving license, plus front and back of the ID card or passport.
            </p>
          </div>
          <button
            onClick={() => {
              setIsAdding(true);
              setForm(emptyDriver);
              setMessage("");
            }}
            className="rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-[var(--ink)] shadow-[0_10px_24px_rgba(255,179,71,0.18)]"
          >
            Add driver
          </button>
        </div>
      </section>

      {message ? (
        <p className="rounded-2xl border border-[rgba(234,111,81,0.2)] bg-[rgba(234,111,81,0.08)] px-4 py-3 text-sm text-[var(--danger)]">{message}</p>
      ) : null}

      <section className="space-y-4">
        {isAdding ? (
          <article className="rounded-[22px] border border-[rgba(22,36,58,0.08)] bg-[rgba(255,255,255,0.94)] px-5 py-5 shadow-[0_14px_36px_rgba(22,36,58,0.04)]">
            <DriverForm form={form} onChange={setForm} onSubmit={saveDriver} onCancel={() => setIsAdding(false)} isPending={isPending} />
          </article>
        ) : null}

        {loading ? (
          <p className="rounded-[22px] border border-[rgba(22,36,58,0.08)] bg-white px-5 py-5 text-sm text-[var(--muted)]">
            Loading drivers...
          </p>
        ) : null}

        {!loading && drivers.length === 0 ? (
          <p className="rounded-[22px] border border-[rgba(22,36,58,0.08)] bg-white px-5 py-5 text-sm text-[var(--muted)]">
            No drivers yet.
          </p>
        ) : null}

        {drivers.map((driver) => (
          <article
            key={driver.id}
            className="rounded-[22px] border border-[rgba(22,36,58,0.08)] bg-[rgba(255,255,255,0.94)] px-5 py-5 shadow-[0_14px_36px_rgba(22,36,58,0.04)]"
          >
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <p className="font-semibold text-[var(--ink)]">
                    {[driver.firstName, driver.lastName].filter(Boolean).join(" ") || "Driver"}
                  </p>
                  <DriverStatusBadge approved={driver.isVerified} />
                </div>
                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-sm text-[var(--muted)]">
                  <span>Date of birth: {formatBirthday(driver.birthday)}</span>
                  <span>Licence: {driver.licenseNumber || "Not set"}</span>
                  <span>Documents: {driver.isVerified ? "Verified" : "Submitted for review"}</span>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => removeDriver(driver.id, driver.isVerified)}
                  disabled={isPending}
                  className="rounded-full border border-[rgba(22,36,58,0.08)] px-4 py-2 text-sm font-medium text-[var(--ink)] transition hover:bg-[rgba(22,36,58,0.03)] disabled:opacity-60"
                >
                  Remove
                </button>
              </div>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}

function DriverForm({
  form,
  onChange,
  onSubmit,
  onCancel,
  isPending,
}: {
  form: DriverFormState;
  onChange: (value: DriverFormState | ((current: DriverFormState) => DriverFormState)) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
  isPending: boolean;
}) {
  return (
    <form onSubmit={onSubmit} className="grid gap-4 md:grid-cols-2">
      <label className="text-sm font-medium text-[var(--ink)]">
        First name
        <input required value={form.firstName} onChange={(event) => onChange((current) => ({ ...current, firstName: event.target.value }))} className="mt-2 w-full rounded-2xl border border-[rgba(22,36,58,0.12)] px-4 py-3 text-sm" />
      </label>
      <label className="text-sm font-medium text-[var(--ink)]">
        Last name
        <input required value={form.lastName} onChange={(event) => onChange((current) => ({ ...current, lastName: event.target.value }))} className="mt-2 w-full rounded-2xl border border-[rgba(22,36,58,0.12)] px-4 py-3 text-sm" />
      </label>
      <label className="text-sm font-medium text-[var(--ink)]">
        Date of birth
        <input type="date" value={form.birthday} onChange={(event) => onChange((current) => ({ ...current, birthday: event.target.value }))} className="mt-2 w-full rounded-2xl border border-[rgba(22,36,58,0.12)] px-4 py-3 text-sm" />
      </label>
      <label className="text-sm font-medium text-[var(--ink)]">
        Email
        <input type="email" value={form.email} onChange={(event) => onChange((current) => ({ ...current, email: event.target.value }))} className="mt-2 w-full rounded-2xl border border-[rgba(22,36,58,0.12)] px-4 py-3 text-sm" />
      </label>
      <label className="text-sm font-medium text-[var(--ink)]">
        Phone
        <input value={form.phone} onChange={(event) => onChange((current) => ({ ...current, phone: event.target.value }))} className="mt-2 w-full rounded-2xl border border-[rgba(22,36,58,0.12)] px-4 py-3 text-sm" />
      </label>
      <label className="text-sm font-medium text-[var(--ink)]">
        Licence number
        <input value={form.licenseNumber} onChange={(event) => onChange((current) => ({ ...current, licenseNumber: event.target.value }))} className="mt-2 w-full rounded-2xl border border-[rgba(22,36,58,0.12)] px-4 py-3 text-sm" />
      </label>
      <FileInput label="Driving licence - front" onSelect={(fileName) => onChange((current) => ({ ...current, licenseFrontFileName: fileName }))} existingFileName={form.licenseFrontFileName} />
      <FileInput label="Driving licence - back" onSelect={(fileName) => onChange((current) => ({ ...current, licenseBackFileName: fileName }))} existingFileName={form.licenseBackFileName} />
      <FileInput label="ID card / passport - front" onSelect={(fileName) => onChange((current) => ({ ...current, identityFrontFileName: fileName }))} existingFileName={form.identityFrontFileName} />
      <FileInput label="ID card / passport - back" onSelect={(fileName) => onChange((current) => ({ ...current, identityBackFileName: fileName }))} existingFileName={form.identityBackFileName} />
      <div className="flex gap-3 md:col-span-2">
        <button disabled={isPending} className="rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-[var(--ink)] disabled:opacity-60">
          {isPending ? "Saving..." : "Save driver"}
        </button>
        <button type="button" onClick={onCancel} className="rounded-full border border-[rgba(22,36,58,0.08)] px-5 py-3 text-sm font-medium text-[var(--ink)]">
          Cancel
        </button>
      </div>
    </form>
  );
}

function FileInput({
  label,
  onSelect,
  existingFileName,
}: {
  label: string;
  onSelect: (fileName: string) => void;
  existingFileName?: string;
}) {
  return (
    <label className="text-sm font-medium text-[var(--ink)]">
      {label}
      <input
        type="file"
        accept="image/*,.pdf"
        onChange={(event) => onSelect(event.target.files?.[0]?.name || "")}
        className="mt-2 block w-full rounded-2xl border border-[rgba(22,36,58,0.12)] px-4 py-3 text-sm"
      />
      {existingFileName ? <p className="mt-1 text-xs text-[var(--muted)]">Selected: {existingFileName}</p> : null}
    </label>
  );
}
