"use client";

import type { FormEvent } from "react";
import { useState } from "react";

type Vehicle = {
  id: string;
  registration: string;
  model: string;
  type: string;
};

const initialVehicles: Vehicle[] = [
  { id: "1", registration: "AB-123-CD", model: "Peugeot 308", type: "Passenger Car" },
  { id: "2", registration: "EF-456-GH", model: "Renault Trafic", type: "Light Commercial Van" },
];

const emptyVehicle: Vehicle = {
  id: "",
  registration: "",
  model: "",
  type: "",
};

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState(initialVehicles);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyVehicle);

  function startEdit(vehicle?: Vehicle) {
    setEditingId(vehicle?.id || "new");
    setForm(vehicle || emptyVehicle);
  }

  function saveVehicle(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextVehicle = {
      ...form,
      id: form.id || `vehicle-${Date.now()}`,
    };

    setVehicles((current) =>
      form.id ? current.map((vehicle) => (vehicle.id === form.id ? nextVehicle : vehicle)) : [nextVehicle, ...current],
    );
    setEditingId(null);
    setForm(emptyVehicle);
  }

  function removeVehicle(id: string) {
    setVehicles((current) => current.filter((vehicle) => vehicle.id !== id));
  }

  return (
    <div className="space-y-6">
      <section className="rounded-[28px] border border-[rgba(22,36,58,0.08)] bg-[rgba(255,255,255,0.94)] p-6 shadow-[0_18px_50px_rgba(22,36,58,0.05)]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--muted)]">Vehicles</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--ink)]">Vehicles</h2>
            <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
              Save vehicle details for faster checkout next time.
            </p>
          </div>
          <button
            onClick={() => startEdit()}
            className="rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-[var(--ink)] shadow-[0_10px_24px_rgba(255,179,71,0.18)]"
          >
            Add vehicle
          </button>
        </div>
      </section>

      {editingId ? (
        <section className="rounded-[22px] border border-[rgba(22,36,58,0.08)] bg-[rgba(255,255,255,0.94)] p-5 shadow-[0_14px_36px_rgba(22,36,58,0.04)]">
          <form onSubmit={saveVehicle} className="grid gap-4 md:grid-cols-3">
            <label className="text-sm font-medium text-[var(--ink)]">
              Registration
              <input
                required
                value={form.registration}
                onChange={(event) => setForm((current) => ({ ...current, registration: event.target.value }))}
                className="mt-2 w-full rounded-2xl border border-[rgba(22,36,58,0.12)] px-4 py-3 text-sm"
              />
            </label>
            <label className="text-sm font-medium text-[var(--ink)]">
              Model
              <input
                required
                value={form.model}
                onChange={(event) => setForm((current) => ({ ...current, model: event.target.value }))}
                className="mt-2 w-full rounded-2xl border border-[rgba(22,36,58,0.12)] px-4 py-3 text-sm"
              />
            </label>
            <label className="text-sm font-medium text-[var(--ink)]">
              Type
              <input
                required
                value={form.type}
                onChange={(event) => setForm((current) => ({ ...current, type: event.target.value }))}
                className="mt-2 w-full rounded-2xl border border-[rgba(22,36,58,0.12)] px-4 py-3 text-sm"
              />
            </label>
            <div className="flex gap-3 md:col-span-3">
              <button className="rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-[var(--ink)]">
                Save vehicle
              </button>
              <button
                type="button"
                onClick={() => setEditingId(null)}
                className="rounded-full border border-[rgba(22,36,58,0.08)] px-5 py-3 text-sm font-medium text-[var(--ink)]"
              >
                Cancel
              </button>
            </div>
          </form>
        </section>
      ) : null}

      <section className="space-y-4">
        {vehicles.map((vehicle) => (
          <article
            key={vehicle.id}
            className="rounded-[22px] border border-[rgba(22,36,58,0.08)] bg-[rgba(255,255,255,0.94)] px-5 py-5 shadow-[0_14px_36px_rgba(22,36,58,0.04)]"
          >
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="font-semibold text-[var(--ink)]">{vehicle.registration}</p>
                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-sm text-[var(--muted)]">
                  <span>{vehicle.model}</span>
                  <span>{vehicle.type}</span>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => startEdit(vehicle)}
                  className="rounded-full border border-[rgba(22,36,58,0.08)] px-4 py-2 text-sm font-medium text-[var(--ink)] transition hover:bg-[rgba(22,36,58,0.03)]"
                >
                  Edit
                </button>
                <button
                  onClick={() => removeVehicle(vehicle.id)}
                  className="rounded-full border border-[rgba(22,36,58,0.08)] px-4 py-2 text-sm font-medium text-[var(--ink)] transition hover:bg-[rgba(22,36,58,0.03)]"
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
