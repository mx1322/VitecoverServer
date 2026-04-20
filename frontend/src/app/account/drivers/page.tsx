const drivers = [
  {
    id: "1",
    name: "Maxime Bai",
    dob: "01 Jan 1988",
    licence: "FR-XXXX-1234",
  },
  {
    id: "2",
    name: "Alex Martin",
    dob: "18 Apr 1991",
    licence: "FR-XXXX-5678",
  },
];

export default function DriversPage() {
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
          <button className="rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-[var(--ink)] shadow-[0_10px_24px_rgba(255,179,71,0.18)]">
            Add driver
          </button>
        </div>
      </section>

      <section className="space-y-4">
        {drivers.map((driver) => (
          <article
            key={driver.id}
            className="rounded-[22px] border border-[rgba(22,36,58,0.08)] bg-[rgba(255,255,255,0.94)] px-5 py-5 shadow-[0_14px_36px_rgba(22,36,58,0.04)]"
          >
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="font-semibold text-[var(--ink)]">{driver.name}</p>
                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-sm text-[var(--muted)]">
                  <span>Date of birth: {driver.dob}</span>
                  <span>Licence: {driver.licence}</span>
                </div>
              </div>
              <button className="rounded-full border border-[rgba(22,36,58,0.08)] px-4 py-2 text-sm font-medium text-[var(--ink)] transition hover:bg-[rgba(22,36,58,0.03)]">
                Edit
              </button>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
