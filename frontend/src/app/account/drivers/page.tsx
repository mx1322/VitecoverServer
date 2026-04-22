"use client";

import type { FormEvent } from "react";
import { useState } from "react";

type Driver = {
  id: string;
  name: string;
  dob: string;
  licence: string;
  status: "approved" | "under_review";
  licenseFrontFileName?: string;
  licenseBackFileName?: string;
  identityFrontFileName?: string;
  identityBackFileName?: string;
};

const initialDrivers: Driver[] = [
  {
    id: "1",
    name: "Maxime Bai",
    dob: "01 Jan 1988",
    licence: "FR-XXXX-1234",
    status: "under_review",
    licenseFrontFileName: "licence-front.jpg",
    licenseBackFileName: "licence-back.jpg",
    identityFrontFileName: "passport-front.jpg",
    identityBackFileName: "passport-back.jpg",
  },
  { id: "2", name: "Alex Martin", dob: "18 Apr 1991", licence: "FR-XXXX-5678", status: "approved", licenseFrontFileName: "alex-licence-front.png", licenseBackFileName: "alex-licence-back.png", identityFrontFileName: "alex-id-front.png", identityBackFileName: "alex-id-back.png" },
];

const emptyDriver: Driver = {
  id: "",
  name: "",
  dob: "",
  licence: "",
  status: "under_review",
  licenseFrontFileName: "",
  licenseBackFileName: "",
  identityFrontFileName: "",
  identityBackFileName: "",
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

function hasAllDriverDocs(driver: Driver): boolean {
  return Boolean(
    driver.licenseFrontFileName?.trim() &&
      driver.licenseBackFileName?.trim() &&
      driver.identityFrontFileName?.trim() &&
      driver.identityBackFileName?.trim(),
  );
}

export default function DriversPage() {
  const [drivers, setDrivers] = useState(initialDrivers);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyDriver);
  const [message, setMessage] = useState<string>("");

  function startEdit(driver?: Driver) {
    setEditingId(driver?.id || "new");
    setForm(driver || emptyDriver);
    setMessage("");
  }

  function saveDriver(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!hasAllDriverDocs(form)) {
      setMessage("请上传驾照正反面 + 身份证/护照正反面后再提交。\n");
      return;
    }

    const nextDriver = {
      ...form,
      id: form.id || `driver-${Date.now()}`,
    };

    setDrivers((current) =>
      form.id ? current.map((driver) => (driver.id === form.id ? nextDriver : driver)) : [nextDriver, ...current],
    );
    setEditingId(null);
    setForm(emptyDriver);
    setMessage("");
  }

  function removeDriver(id: string) {
    const target = drivers.find((driver) => driver.id === id);

    if (target?.status === "approved") {
      setMessage("驾驶员资料已确认，不能在当前界面删除。请联系管理员后台处理。");
      return;
    }

    setDrivers((current) => current.filter((driver) => driver.id !== id));
    setMessage("");
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
              请上传驾驶员证件：驾照正反面，以及身份证或护照正反面。
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

      {message ? (
        <p className="rounded-2xl border border-[rgba(234,111,81,0.2)] bg-[rgba(234,111,81,0.08)] px-4 py-3 text-sm text-[var(--danger)]">{message}</p>
      ) : null}

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
                    <span>资料: {hasAllDriverDocs(driver) ? "已上传" : "未完整上传"}</span>
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
    <form onSubmit={onSubmit} className="grid gap-4 md:grid-cols-2">
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
      <label className="text-sm font-medium text-[var(--ink)] md:col-span-2">
        Licence
        <input
          required
          value={form.licence}
          onChange={(event) => onChange((current) => ({ ...current, licence: event.target.value }))}
          className="mt-2 w-full rounded-2xl border border-[rgba(22,36,58,0.12)] px-4 py-3 text-sm"
        />
      </label>
      <DocumentUpload
        label="驾照正面"
        existingFileName={form.licenseFrontFileName}
        onSelect={(name) => onChange((current) => ({ ...current, licenseFrontFileName: name }))}
      />
      <DocumentUpload
        label="驾照反面"
        existingFileName={form.licenseBackFileName}
        onSelect={(name) => onChange((current) => ({ ...current, licenseBackFileName: name }))}
      />
      <DocumentUpload
        label="身份证/护照正面"
        existingFileName={form.identityFrontFileName}
        onSelect={(name) => onChange((current) => ({ ...current, identityFrontFileName: name }))}
      />
      <DocumentUpload
        label="身份证/护照反面"
        existingFileName={form.identityBackFileName}
        onSelect={(name) => onChange((current) => ({ ...current, identityBackFileName: name }))}
      />
      <div className="flex gap-3 md:col-span-2">
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

function DocumentUpload({
  label,
  existingFileName,
  onSelect,
}: {
  label: string;
  existingFileName?: string;
  onSelect: (filename: string) => void;
}) {
  const hasExistingFile = Boolean(existingFileName?.trim());

  return (
    <label className="text-sm font-medium text-[var(--ink)]">
      {label}
      <input
        required={!hasExistingFile}
        type="file"
        accept="image/*,.pdf"
        onChange={(event) => onSelect(event.target.files?.[0]?.name || existingFileName || "")}
        className="mt-2 block w-full rounded-2xl border border-[rgba(22,36,58,0.12)] px-4 py-3 text-sm"
      />
      {hasExistingFile ? <p className="mt-1 text-xs text-[var(--muted)]">已上传：{existingFileName}</p> : null}
    </label>
  );
}
