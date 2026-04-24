"use client";

import type { FormEvent } from "react";
import { useEffect, useState } from "react";

import type { CustomerWorkspaceVehicle } from "@/lib/directus-admin";

type SessionResponse = {
  authenticated: boolean;
  account?: {
    vehicles?: CustomerWorkspaceVehicle[];
  } | null;
  error?: string;
};

type WorkspaceMutationResponse = {
  workspace?: {
    vehicles?: CustomerWorkspaceVehicle[];
  };
  error?: string;
};

type VehicleFormState = {
  registrationNumber: string;
  manufacturer: string;
  model: string;
  fiscalPower: string;
  greyCardFileName: string;
};

const emptyVehicle: VehicleFormState = {
  registrationNumber: "",
  manufacturer: "",
  model: "",
  fiscalPower: "6",
  greyCardFileName: "",
};

function VehicleStatusBadge({ approved }: { approved: boolean }) {
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

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<CustomerWorkspaceVehicle[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [form, setForm] = useState(emptyVehicle);
  const [loading, setLoading] = useState(true);
  const [isPending, setIsPending] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadVehicles() {
      try {
        const response = await fetch("/api/auth/session", { cache: "no-store" });
        const payload = (await response.json()) as SessionResponse;

        if (!response.ok) {
          throw new Error(payload.error || "Unable to load vehicles.");
        }

        setVehicles(payload.account?.vehicles || []);
      } catch (error) {
        setMessage(error instanceof Error ? error.message : "Unable to load vehicles.");
      } finally {
        setLoading(false);
      }
    }

    loadVehicles();
  }, []);

  async function saveVehicle(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!form.greyCardFileName.trim()) {
      setMessage("Please upload the vehicle registration document (French Carte Grise) before submitting.");
      return;
    }

    setIsPending(true);
    setMessage("");

    try {
      const response = await fetch("/api/auth/workspace-item", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind: "vehicle",
          registrationNumber: form.registrationNumber,
          manufacturer: form.manufacturer,
          model: form.model,
          fiscalPower: Number(form.fiscalPower),
        }),
      });
      const payload = (await response.json()) as WorkspaceMutationResponse;

      if (!response.ok) {
        throw new Error(payload.error || "Unable to save this vehicle.");
      }

      setVehicles(payload.workspace?.vehicles || []);
      setForm(emptyVehicle);
      setIsAdding(false);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to save this vehicle.");
    } finally {
      setIsPending(false);
    }
  }

  async function removeVehicle(id: number, approved: boolean) {
    if (approved) {
      setMessage("This vehicle record has already been verified and cannot be deleted here. Please contact an administrator.");
      return;
    }

    setIsPending(true);
    setMessage("");

    try {
      const response = await fetch("/api/auth/workspace-item", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind: "vehicle", id }),
      });
      const payload = (await response.json()) as WorkspaceMutationResponse;

      if (!response.ok) {
        throw new Error(payload.error || "Unable to remove this vehicle.");
      }

      setVehicles(payload.workspace?.vehicles || []);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to remove this vehicle.");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className="space-y-6">
      <section className="rounded-[28px] border border-[rgba(22,36,58,0.08)] bg-[rgba(255,255,255,0.94)] p-6 shadow-[0_18px_50px_rgba(22,36,58,0.05)]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--muted)]">Vehicles</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--ink)]">Vehicles</h2>
            <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
              Customers can upload vehicle documents here. Please upload an image of the French Carte Grise before submitting for review.
            </p>
          </div>
          <button
            onClick={() => {
              setIsAdding(true);
              setForm(emptyVehicle);
              setMessage("");
            }}
            className="rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-[var(--ink)] shadow-[0_10px_24px_rgba(255,179,71,0.18)]"
          >
            Add vehicle
          </button>
        </div>
      </section>

      {message ? (
        <p className="rounded-2xl border border-[rgba(234,111,81,0.2)] bg-[rgba(234,111,81,0.08)] px-4 py-3 text-sm text-[var(--danger)]">{message}</p>
      ) : null}

      <section className="space-y-4">
        {isAdding ? (
          <article className="rounded-[22px] border border-[rgba(22,36,58,0.08)] bg-[rgba(255,255,255,0.94)] px-5 py-5 shadow-[0_14px_36px_rgba(22,36,58,0.04)]">
            <VehicleForm form={form} onChange={setForm} onSubmit={saveVehicle} onCancel={() => setIsAdding(false)} isPending={isPending} />
          </article>
        ) : null}

        {loading ? (
          <p className="rounded-[22px] border border-[rgba(22,36,58,0.08)] bg-white px-5 py-5 text-sm text-[var(--muted)]">
            Loading vehicles...
          </p>
        ) : null}

        {!loading && vehicles.length === 0 ? (
          <p className="rounded-[22px] border border-[rgba(22,36,58,0.08)] bg-white px-5 py-5 text-sm text-[var(--muted)]">
            No vehicles yet.
          </p>
        ) : null}

        {vehicles.map((vehicle) => (
          <article
            key={vehicle.id}
            className="rounded-[22px] border border-[rgba(22,36,58,0.08)] bg-[rgba(255,255,255,0.94)] px-5 py-5 shadow-[0_14px_36px_rgba(22,36,58,0.04)]"
          >
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <p className="font-semibold text-[var(--ink)]">{vehicle.registrationNumber}</p>
                  <VehicleStatusBadge approved={vehicle.isVerified} />
                </div>
                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-sm text-[var(--muted)]">
                  <span>{[vehicle.manufacturer, vehicle.model].filter(Boolean).join(" ") || "Vehicle"}</span>
                  <span>{vehicle.fiscalPower} CV</span>
                  <span>Documents: {vehicle.isVerified ? "Verified" : "Submitted for review"}</span>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => removeVehicle(vehicle.id, vehicle.isVerified)}
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

function VehicleForm({
  form,
  onChange,
  onSubmit,
  onCancel,
  isPending,
}: {
  form: VehicleFormState;
  onChange: (value: VehicleFormState | ((current: VehicleFormState) => VehicleFormState)) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
  isPending: boolean;
}) {
  return (
    <form onSubmit={onSubmit} className="grid gap-4 md:grid-cols-3">
      <label className="text-sm font-medium text-[var(--ink)]">
        Registration
        <input required value={form.registrationNumber} onChange={(event) => onChange((current) => ({ ...current, registrationNumber: event.target.value }))} className="mt-2 w-full rounded-2xl border border-[rgba(22,36,58,0.12)] px-4 py-3 text-sm" />
      </label>
      <label className="text-sm font-medium text-[var(--ink)]">
        Manufacturer
        <input value={form.manufacturer} onChange={(event) => onChange((current) => ({ ...current, manufacturer: event.target.value }))} className="mt-2 w-full rounded-2xl border border-[rgba(22,36,58,0.12)] px-4 py-3 text-sm" />
      </label>
      <label className="text-sm font-medium text-[var(--ink)]">
        Model
        <input value={form.model} onChange={(event) => onChange((current) => ({ ...current, model: event.target.value }))} className="mt-2 w-full rounded-2xl border border-[rgba(22,36,58,0.12)] px-4 py-3 text-sm" />
      </label>
      <label className="text-sm font-medium text-[var(--ink)]">
        Fiscal power
        <input required type="number" min="1" value={form.fiscalPower} onChange={(event) => onChange((current) => ({ ...current, fiscalPower: event.target.value }))} className="mt-2 w-full rounded-2xl border border-[rgba(22,36,58,0.12)] px-4 py-3 text-sm" />
      </label>
      <label className="text-sm font-medium text-[var(--ink)] md:col-span-2">
        Vehicle registration document (French Carte Grise)
        <input
          required
          type="file"
          accept="image/*,.pdf"
          onChange={(event) => onChange((current) => ({ ...current, greyCardFileName: event.target.files?.[0]?.name || "" }))}
          className="mt-2 block w-full rounded-2xl border border-[rgba(22,36,58,0.12)] px-4 py-3 text-sm"
        />
        {form.greyCardFileName ? <p className="mt-1 text-xs text-[var(--muted)]">Selected: {form.greyCardFileName}</p> : null}
        <p className="mt-1 text-xs text-[var(--muted)]">Images or PDF files are supported. These files are used only for vehicle review.</p>
      </label>
      <div className="flex gap-3 md:col-span-3">
        <button disabled={isPending} className="rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-[var(--ink)] disabled:opacity-60">
          {isPending ? "Saving..." : "Save vehicle"}
        </button>
        <button type="button" onClick={onCancel} className="rounded-full border border-[rgba(22,36,58,0.08)] px-5 py-3 text-sm font-medium text-[var(--ink)]">
          Cancel
        </button>
      </div>
    </form>
  );
}
