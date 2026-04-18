export default function AccountSettingsPage() {
  return (
    <>
      <div className="rounded-[28px] border border-[rgba(22,36,58,0.08)] bg-[rgba(255,255,255,0.94)] p-6 shadow-[0_18px_50px_rgba(22,36,58,0.05)]">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--muted)]">
          Account Settings
        </p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--ink)]">
          Security and contact details
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--muted)]">
          Review your login details, contact preferences, and profile information in one place.
        </p>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        {[
          {
            label: "Email",
            value: "camille.martin@example.com",
            action: "Edit email",
          },
          {
            label: "Password",
            value: "Last updated 30 days ago",
            action: "Change password",
          },
          {
            label: "Contact Details",
            value: "+33 6 12 34 56 78",
            action: "Edit contact",
          },
        ].map((item) => (
          <article
            key={item.label}
            className="rounded-[28px] border border-[rgba(22,36,58,0.08)] bg-[rgba(255,255,255,0.94)] p-6 shadow-[0_18px_50px_rgba(22,36,58,0.05)]"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--muted)]">
              {item.label}
            </p>
            <p className="mt-4 text-lg font-semibold text-[var(--ink)]">{item.value}</p>
            <button
              type="button"
              className="mt-6 inline-flex items-center justify-center rounded-full border border-[rgba(22,36,58,0.12)] bg-white px-5 py-3 text-sm font-semibold text-[var(--ink)] transition hover:bg-[rgba(22,36,58,0.03)]"
            >
              {item.action}
            </button>
          </article>
        ))}
      </div>

      <div className="rounded-[28px] border border-[rgba(22,36,58,0.08)] bg-[rgba(255,255,255,0.94)] p-6 shadow-[0_18px_50px_rgba(22,36,58,0.05)]">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--muted)]">
          Preferences
        </p>
        <div className="mt-5 space-y-4">
          {[
            "Policy documents by email",
            "Application review updates",
            "Renewal reminders",
          ].map((item) => (
            <div
              key={item}
              className="flex items-center justify-between rounded-[22px] border border-[rgba(22,36,58,0.08)] bg-white px-4 py-4"
            >
              <div>
                <p className="font-semibold text-[var(--ink)]">{item}</p>
                <p className="mt-1 text-sm text-[var(--muted)]">
                  Enabled for this mock account profile.
                </p>
              </div>
              <button
                type="button"
                className="rounded-full bg-[rgba(255,179,71,0.16)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--ink)]"
              >
                Enabled
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
