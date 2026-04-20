"use client";

import type { FormEvent } from "react";
import { useState } from "react";

type Driver = {
  id: string;
  name: string;
  dob: string;
  licence: string;
  status: "approved" | "under_review";
};

const initialDrivers: Driver[] = [
  { id: "1", name: "Maxime Bai", dob: "01 Jan 1988", licence: "FR-XXXX-1234", status: "under_review" },
  { id: "2", name: "Alex Martin", dob: "18 Apr 1991", licence: "FR-XXXX-5678", status: "approved" },
];

const emptyDriver: Driver = {
  id: "",
  name: "",
  dob: "",
  licence: "",
  status: "under_review",
};

function DriverStatusBadge({ status }: { status: Driver["status"] }) {
  const approved = status === "approved";

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

export default function DriversPage() {
  const [drivers, setDrivers] = useState(initialDrivers);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyDriver);

  function startEdit(driver?: Driver) {
    setEditingId(driver?.id || "new");
    setForm(driver || emptyDriver);
  }

  function saveDriver(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextDriver = {
      ...form,
      id: form.id || `driver-${Date.now()}`,
    };

    setDrivers((current) =>
      form.id ? current.map((driver) => (driver.id === form.id ? nextDriver : driver)) : [nextDriver, ...current],
    );
    setEditingId(null);
    setForm(emptyDriver);
  }

  function removeDriver(id: string) {
    setDrivers((current) => current.filter((driver) => driver.id !== id));
  }

  const isAdding = editingId === "new";

  return (
    <div className="space-y-6">
      <section className="rounded-[28px] border border-[rgba(22,36,58,0.08)] bg-[rgba(255,255,255,0.94)] p-6 shadow-[0_18px_50px_rgba(22,36,58,0.05)]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--muted)]">Drivers</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--ink)]">Drivers</h2>
            <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
              Save driver profiles to speed up future orders.
            </p>
          </div>
          <button
            onClick={() => startEdit()}
            className="rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-[var(--ink)] shadow-[0_10px_24px_rgba(255,179,71,0.18)]"
          >
            Add driver
          </button>
        </div>
      </section>

      <section className="space-y-4">
        {isAdding ? (
          <article className="rounded-[22px] border border-[rgba(22,36,58,0.08)] bg-[rgba(255,255,255,0.94)] px-5 py-5 shadow-[0_14px_36px_rgba(22,36,58,0.04)]">
            <DriverForm
              form={form}
              onChange={setForm}
              onSubmit={saveDriver}
              onCancel={() => setEditingId(null)}
            />
          </article>
        ) : null}

        {drivers.map((driver) => (
          <article
            key={driver.id}
            className="rounded-[22px] border border-[rgba(22,36,58,0.08)] bg-[rgba(255,255,255,0.94)] px-5 py-5 shadow-[0_14px_36px_rgba(22,36,58,0.04)]"
          >
            {editingId === driver.id ? (
              <DriverForm
                form={form}
                onChange={setForm}
                onSubmit={saveDriver}
                onCancel={() => setEditingId(null)}
              />
            ) : (
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <p className="font-semibold text-[var(--ink)]">{driver.name}</p>
                    <DriverStatusBadge status={driver.status} />
                  </div>
                  <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-sm text-[var(--muted)]">
                    <span>Date of birth: {driver.dob}</span>
                    <span>Licence: {driver.licence}</span>
                  </div>
                </div>
                <div className="flex gap-3">
                  {driver.status !== "approved" ? (
                    <button
                      onClick={() => startEdit(driver)}
                      className="rounded-full border border-[rgba(22,36,58,0.08)] px-4 py-2 text-sm font-medium text-[var(--ink)] transition hover:bg-[rgba(22,36,58,0.03)]"
                    >
                      Edit
                    </button>
                  ) : null}
                  <button
                    onClick={() => removeDriver(driver.id)}
                    className="rounded-full border border-[rgba(22,36,58,0.08)] px-4 py-2 text-sm font-medium text-[var(--ink)] transition hover:bg-[rgba(22,36,58,0.03)]"
                  >
                    Remove
                  </button>
                </div>
              </div>
            )}
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
}: {
  form: Driver;
  onChange: (value: Driver | ((current: Driver) => Driver)) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
}) {
  return (
    <form onSubmit={onSubmit} className="grid gap-4 md:grid-cols-3">
      <label className="text-sm font-medium text-[var(--ink)]">
        Name
        <input
          required
          value={form.name}
          onChange={(event) => onChange((current) => ({ ...current, name: event.target.value }))}
          className="mt-2 w-full rounded-2xl border border-[rgba(22,36,58,0.12)] px-4 py-3 text-sm"
        />
      </label>
      <label className="text-sm font-medium text-[var(--ink)]">
        Date of birth
        <input
          required
          value={form.dob}
          onChange={(event) => onChange((current) => ({ ...current, dob: event.target.value }))}
          className="mt-2 w-full rounded-2xl border border-[rgba(22,36,58,0.12)] px-4 py-3 text-sm"
        />
      </label>
      <label className="text-sm font-medium text-[var(--ink)]">
        Licence
        <input
          required
          value={form.licence}
          onChange={(event) => onChange((current) => ({ ...current, licence: event.target.value }))}
          className="mt-2 w-full rounded-2xl border border-[rgba(22,36,58,0.12)] px-4 py-3 text-sm"
        />
      </label>
      <div className="flex gap-3 md:col-span-3">
        <button className="rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-[var(--ink)]">
          Save driver
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-full border border-[rgba(22,36,58,0.08)] px-5 py-3 text-sm font-medium text-[var(--ink)]"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
