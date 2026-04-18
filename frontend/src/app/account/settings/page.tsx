const settingsItems = [
  { label: "Email", value: "max@example.com" },
  { label: "Password", value: "••••••••••••" },
  { label: "Phone", value: "+33 6 00 00 00 00" },
  { label: "Address", value: "Paris, France" },
];

export default function SettingsPage() {
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
        {settingsItems.map((item) => (
          <article
            key={item.label}
            className="rounded-[22px] border border-[rgba(22,36,58,0.08)] bg-[rgba(255,255,255,0.94)] px-5 py-5 shadow-[0_14px_36px_rgba(22,36,58,0.04)]"
          >
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm text-[var(--muted)]">{item.label}</p>
                <p className="mt-1 font-semibold text-[var(--ink)]">{item.value}</p>
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
