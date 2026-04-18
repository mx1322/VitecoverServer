export default function SettingsPage() {
  return (
    <div className="rounded-[28px] border border-[rgba(22,36,58,0.08)] bg-[rgba(255,255,255,0.94)] p-6 shadow-[0_18px_50px_rgba(22,36,58,0.05)]">
      <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--muted)]">
        Account Settings
      </p>
      <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--ink)]">Settings</h2>
      <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
        Account details and preferences will appear here.
      </p>
    </div>
  );
}
