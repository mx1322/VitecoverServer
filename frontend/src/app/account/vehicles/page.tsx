import { mockVehicles } from "@/lib/account/mock-data";

export default function AccountVehiclesPage() {
  return (
    <>
      <div className="rounded-[28px] border border-[rgba(22,36,58,0.08)] bg-[rgba(255,255,255,0.94)] p-6 shadow-[0_18px_50px_rgba(22,36,58,0.05)]">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--muted)]">
          Vehicles
        </p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--ink)]">
          Saved vehicles
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--muted)]">
          Store your most-used vehicles here to speed up cover selection and checkout.
        </p>
      </div>

      <div className="space-y-4">
        {mockVehicles.map((vehicle) => (
          <article
            key={vehicle.id}
            className="rounded-[28px] border border-[rgba(22,36,58,0.08)] bg-[rgba(255,255,255,0.94)] p-6 shadow-[0_18px_50px_rgba(22,36,58,0.05)]"
          >
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <h3 className="text-xl font-semibold tracking-tight text-[var(--ink)]">
                  {vehicle.registration}
                </h3>
                <div className="mt-3 grid gap-2 text-sm text-[var(--muted)] md:grid-cols-2 md:gap-6">
                  <p>Model: {vehicle.model}</p>
                  <p>Type: {vehicle.type}</p>
                </div>
              </div>
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-full border border-[rgba(22,36,58,0.12)] bg-white px-5 py-3 text-sm font-semibold text-[var(--ink)] transition hover:bg-[rgba(22,36,58,0.03)]"
              >
                Edit
              </button>
            </div>
          </article>
        ))}
      </div>

      <div className="rounded-[28px] border border-[rgba(22,36,58,0.08)] bg-[rgba(255,255,255,0.94)] p-6 shadow-[0_18px_50px_rgba(22,36,58,0.05)]">
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-[var(--ink)] shadow-[0_10px_24px_rgba(255,179,71,0.18)] transition hover:scale-[1.02]"
        >
          Add vehicle
        </button>
      </div>
    </>
  );
}
