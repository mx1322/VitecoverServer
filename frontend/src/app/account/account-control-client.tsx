"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

import type { AuthenticatedAccount } from "@/lib/directus-auth";

interface SessionResponse {
  authenticated: boolean;
  account: AuthenticatedAccount | null;
  error?: string;
}

interface AccountMutationResponse {
  account?: AuthenticatedAccount;
  workspace?: AuthenticatedAccount["recentOrders"] extends never
    ? never
    : {
        customer: AuthenticatedAccount["customer"];
        vehicles: AuthenticatedAccount["vehicles"];
        drivers: AuthenticatedAccount["drivers"];
        recentOrders: AuthenticatedAccount["recentOrders"];
      };
  error?: string;
}

async function requestJson<T>(url: string, init: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
  });

  const payload = (await response.json()) as T & { error?: string };
  if (!response.ok) {
    throw new Error(payload.error ?? "Request failed.");
  }

  return payload;
}

export function AccountControlClient() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [account, setAccount] = useState<AuthenticatedAccount | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [profileForm, setProfileForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    customerType: "individual",
    preferredLanguage: "fr-FR",
  });
  const [vehicleForm, setVehicleForm] = useState({
    registrationNumber: "",
    manufacturer: "",
    model: "",
    fiscalPower: "6",
  });
  const [driverForm, setDriverForm] = useState({
    firstName: "",
    lastName: "",
    birthday: "",
    driverEmail: "",
    phone: "",
    licenseNumber: "",
    licenseCountryCode: "FR",
  });
  const [passwordForm, setPasswordForm] = useState({
    password: "",
    confirmPassword: "",
  });
  const [deletePhrase, setDeletePhrase] = useState("");
  const menuItems = [
    "Overview",
    "My Policies",
    "Drivers",
    "Vehicles",
    "Documents",
    "Account Settings",
  ];

  function syncAccount(nextAccount: AuthenticatedAccount) {
    setAccount(nextAccount);
    setProfileForm({
      firstName: nextAccount.user.firstName,
      lastName: nextAccount.user.lastName,
      email: nextAccount.user.email,
      phone: nextAccount.customer.phone,
      customerType: nextAccount.customer.customerType,
      preferredLanguage: nextAccount.customer.preferredLanguage,
    });
    setDriverForm((current) => ({
      ...current,
      driverEmail: current.driverEmail || nextAccount.user.email,
      phone: current.phone || nextAccount.customer.phone,
    }));
  }

  useEffect(() => {
    startTransition(async () => {
      try {
        const payload = await requestJson<SessionResponse>("/api/auth/session", {
          method: "GET",
        });

        if (!payload.authenticated || !payload.account) {
          router.replace("/auth?returnTo=%2Faccount");
          return;
        }

        syncAccount(payload.account);
      } catch (requestError) {
        setError(
          requestError instanceof Error
            ? requestError.message
            : "Unable to load this account control center.",
        );
      } finally {
        setLoading(false);
      }
    });
  }, [router]);

  function updateWorkspace(workspace: NonNullable<AccountMutationResponse["workspace"]>) {
    setAccount((current) => {
      if (!current) {
        return current;
      }

      return {
        ...current,
        customer: workspace.customer,
        vehicles: workspace.vehicles,
        drivers: workspace.drivers,
        recentOrders: workspace.recentOrders,
      };
    });
  }

  function saveProfile() {
    setError("");
    setNotice("");

    startTransition(async () => {
      try {
        const payload = await requestJson<{ account: AuthenticatedAccount }>("/api/auth/profile", {
          method: "PATCH",
          body: JSON.stringify(profileForm),
        });

        syncAccount(payload.account);
        setNotice("Profile updated.");
      } catch (requestError) {
        setError(requestError instanceof Error ? requestError.message : "Unable to save profile.");
      }
    });
  }

  function changePassword() {
    setError("");
    setNotice("");

    startTransition(async () => {
      try {
        if (!passwordForm.password || passwordForm.password.length < 8) {
          throw new Error("Password must be at least 8 characters long.");
        }

        if (passwordForm.password !== passwordForm.confirmPassword) {
          throw new Error("Passwords do not match.");
        }

        await requestJson("/api/auth/password/change", {
          method: "POST",
          body: JSON.stringify({
            password: passwordForm.password,
          }),
        });

        setPasswordForm({
          password: "",
          confirmPassword: "",
        });
        setNotice("Password changed.");
      } catch (requestError) {
        setError(
          requestError instanceof Error ? requestError.message : "Unable to change password.",
        );
      }
    });
  }

  function signOut() {
    startTransition(async () => {
      await requestJson("/api/auth/logout", {
        method: "POST",
        body: JSON.stringify({}),
      });
      router.push("/auth");
    });
  }

  function createWorkspaceItem(kind: "vehicle" | "driver") {
    setError("");
    setNotice("");

    startTransition(async () => {
      try {
        const payload = await requestJson<AccountMutationResponse>("/api/auth/workspace-item", {
          method: "POST",
          body: JSON.stringify(
            kind === "vehicle"
              ? {
                  kind,
                  registrationNumber: vehicleForm.registrationNumber,
                  manufacturer: vehicleForm.manufacturer,
                  model: vehicleForm.model,
                  fiscalPower: Number(vehicleForm.fiscalPower),
                }
              : {
                  kind,
                  firstName: driverForm.firstName,
                  lastName: driverForm.lastName,
                  birthday: driverForm.birthday,
                  driverEmail: driverForm.driverEmail,
                  phone: driverForm.phone,
                  licenseNumber: driverForm.licenseNumber,
                  licenseCountryCode: driverForm.licenseCountryCode,
                },
          ),
        });

        if (payload.workspace) {
          updateWorkspace(payload.workspace);
        }

        if (kind === "vehicle") {
          setVehicleForm({
            registrationNumber: "",
            manufacturer: "",
            model: "",
            fiscalPower: "6",
          });
        } else {
          setDriverForm({
            firstName: "",
            lastName: "",
            birthday: "",
            driverEmail: profileForm.email,
            phone: profileForm.phone,
            licenseNumber: "",
            licenseCountryCode: "FR",
          });
        }
      } catch (requestError) {
        setError(
          requestError instanceof Error
            ? requestError.message
            : `Unable to create this ${kind}.`,
        );
      }
    });
  }

  function deleteWorkspaceItem(kind: "vehicle" | "driver", id: number) {
    setError("");
    setNotice("");

    startTransition(async () => {
      try {
        const payload = await requestJson<AccountMutationResponse>("/api/auth/workspace-item", {
          method: "DELETE",
          body: JSON.stringify({
            kind,
            id,
          }),
        });

        if (payload.workspace) {
          updateWorkspace(payload.workspace);
        }
      } catch (requestError) {
        setError(
          requestError instanceof Error ? requestError.message : `Unable to delete this ${kind}.`,
        );
      }
    });
  }

  function deleteAccount() {
    setError("");
    setNotice("");

    startTransition(async () => {
      try {
        if (deletePhrase !== "DELETE") {
          throw new Error("Type DELETE to confirm account deletion.");
        }

        await requestJson("/api/auth/account", {
          method: "DELETE",
          body: JSON.stringify({}),
        });
        router.push("/auth");
      } catch (requestError) {
        setError(
          requestError instanceof Error ? requestError.message : "Unable to close this account.",
        );
      }
    });
  }

  const cardClass =
    "rounded-[28px] border border-[rgba(22,36,58,0.08)] bg-[rgba(255,255,255,0.94)] p-6 shadow-[0_18px_50px_rgba(22,36,58,0.05)]";
  const fieldClass =
    "mt-2 w-full rounded-2xl border border-[rgba(22,36,58,0.12)] bg-white px-4 py-3 text-sm text-[var(--ink)] transition duration-200 ease-out hover:border-[rgba(22,36,58,0.22)] focus:border-[rgba(255,179,71,0.8)] focus:outline-none focus:ring-2 focus:ring-[rgba(255,179,71,0.22)]";
  const primaryButtonClass =
    "inline-flex items-center justify-center rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-[var(--ink)] shadow-[0_10px_24px_rgba(255,179,71,0.18)] transition duration-200 ease-out hover:scale-[1.03] hover:bg-[#f2a63a] hover:shadow-[0_16px_32px_rgba(255,179,71,0.28)] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70";

  if (loading) {
    return (
      <main className="section-wrap py-20">
        <div className={cardClass}>Loading account center...</div>
      </main>
    );
  }

  if (!account) {
    return null;
  }

  return (
    <main className="section-wrap py-10 md:py-12">
      <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="rounded-[28px] border border-[rgba(22,36,58,0.08)] bg-[rgba(255,255,255,0.92)] p-5 shadow-[0_18px_50px_rgba(22,36,58,0.05)]">
          <div className="border-b border-[rgba(22,36,58,0.08)] pb-4">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--muted)]">
              Account Center
            </p>
            <h1 className="mt-3 text-2xl font-semibold tracking-tight text-[var(--ink)]">
              My Account
            </h1>
            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
              Signed in as {account.user.email}
            </p>
          </div>

          <nav className="mt-4 space-y-2">
            {menuItems.map((item, index) => (
              <button
                key={item}
                type="button"
                className={
                  index === 0
                    ? "flex w-full items-center rounded-full bg-[rgba(255,179,71,0.16)] px-4 py-3 text-sm font-semibold text-[var(--ink)]"
                    : "flex w-full items-center rounded-full px-4 py-3 text-sm font-medium text-[var(--muted)] transition hover:bg-[rgba(22,36,58,0.04)] hover:text-[var(--ink)]"
                }
              >
                {item}
              </button>
            ))}
          </nav>

          <button
            type="button"
            onClick={signOut}
            disabled={isPending}
            className="mt-5 flex w-full items-center justify-center rounded-full border border-[rgba(22,36,58,0.12)] bg-white px-4 py-3 text-sm font-semibold text-[var(--ink)] transition hover:bg-[rgba(22,36,58,0.04)]"
          >
            Logout
          </button>
        </aside>

        <section className="space-y-6">
          <div className={cardClass}>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--muted)]">
              Overview
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--ink)]">
              Welcome back{account.user.firstName ? `, ${account.user.firstName}` : ""}
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--muted)]">
              View your recent policies, manage saved drivers and vehicles, and keep your profile
              ready for faster checkout.
            </p>
            {error ? (
              <p className="mt-5 rounded-2xl border border-[rgba(234,111,81,0.2)] bg-[rgba(234,111,81,0.08)] px-4 py-3 text-sm text-[var(--danger)]">
                {error}
              </p>
            ) : null}
            {notice ? (
              <p className="mt-5 rounded-2xl border border-[rgba(31,183,166,0.2)] bg-[rgba(31,183,166,0.08)] px-4 py-3 text-sm text-[var(--accent-2)]">
                {notice}
              </p>
            ) : null}
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {[
              ["Active Policies", String(account.recentOrders.length)],
              ["Saved Drivers", String(account.drivers.length)],
              ["Saved Vehicles", String(account.vehicles.length)],
              [
                "Email Status",
                account.user.isEmailVerified ? "Verified" : account.user.status,
              ],
            ].map(([label, value]) => (
              <article
                key={label}
                className="rounded-[24px] border border-[rgba(22,36,58,0.08)] bg-[rgba(255,255,255,0.92)] p-5 shadow-[0_14px_36px_rgba(22,36,58,0.04)]"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--muted)]">
                  {label}
                </p>
                <p className="mt-4 text-4xl font-semibold tracking-tight text-[var(--ink)]">
                  {value}
                </p>
              </article>
            ))}
          </div>

          <div className="grid gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(320px,0.9fr)]">
            <div className={cardClass}>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--muted)]">
                    Recent Policies
                  </p>
                  <h3 className="mt-3 text-2xl font-semibold tracking-tight text-[var(--ink)]">
                    Latest activity
                  </h3>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                {account.recentOrders.length ? (
                  account.recentOrders.map((order) => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between gap-4 rounded-[22px] border border-[rgba(22,36,58,0.08)] bg-[rgba(255,255,255,0.82)] px-4 py-4"
                    >
                      <div>
                        <p className="font-semibold text-[var(--ink)]">{order.orderNumber}</p>
                        <p className="mt-1 text-sm text-[var(--muted)]">
                          Starts {new Date(order.coverageStartAt).toLocaleDateString()}
                        </p>
                      </div>
                      <span className="rounded-full bg-[rgba(255,179,71,0.16)] px-3 py-1.5 text-xs font-semibold text-[var(--ink)]">
                        {order.status}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="rounded-[22px] border border-[rgba(22,36,58,0.08)] bg-[rgba(255,255,255,0.82)] px-4 py-4 text-sm text-[var(--muted)]">
                    No policies yet.
                  </div>
                )}
              </div>
            </div>

            <div className={cardClass}>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--muted)]">
                Quick Actions
              </p>
              <h3 className="mt-3 text-2xl font-semibold tracking-tight text-[var(--ink)]">
                Manage faster
              </h3>

              <div className="mt-6 space-y-3">
                <button
                  type="button"
                  onClick={() => createWorkspaceItem("driver")}
                  disabled={isPending}
                  className="flex w-full items-center justify-between rounded-[22px] border border-[rgba(22,36,58,0.08)] px-4 py-4 text-left text-sm font-medium text-[var(--ink)] transition hover:bg-[rgba(22,36,58,0.03)]"
                >
                  Add a new driver
                </button>
                <button
                  type="button"
                  onClick={() => createWorkspaceItem("vehicle")}
                  disabled={isPending}
                  className="flex w-full items-center justify-between rounded-[22px] border border-[rgba(22,36,58,0.08)] px-4 py-4 text-left text-sm font-medium text-[var(--ink)] transition hover:bg-[rgba(22,36,58,0.03)]"
                >
                  Add a new vehicle
                </button>
                <button
                  type="button"
                  onClick={saveProfile}
                  disabled={isPending}
                  className="flex w-full items-center justify-between rounded-[22px] border border-[rgba(22,36,58,0.08)] px-4 py-4 text-left text-sm font-medium text-[var(--ink)] transition hover:bg-[rgba(22,36,58,0.03)]"
                >
                  Save account details
                </button>
                <button
                  type="button"
                  onClick={changePassword}
                  disabled={isPending}
                  className="flex w-full items-center justify-between rounded-[22px] border border-[rgba(22,36,58,0.08)] px-4 py-4 text-left text-sm font-medium text-[var(--ink)] transition hover:bg-[rgba(22,36,58,0.03)]"
                >
                  Update password
                </button>
              </div>
            </div>
          </div>

          <div className="grid gap-4 xl:grid-cols-2">
            <div className={cardClass}>
              <p className="eyebrow">Profile</p>
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <label className="block text-sm font-medium text-[var(--ink)]">
                  First name
                  <input
                    type="text"
                    value={profileForm.firstName}
                    onChange={(event) =>
                      setProfileForm((current) => ({ ...current, firstName: event.target.value }))
                    }
                    className={fieldClass}
                  />
                </label>
                <label className="block text-sm font-medium text-[var(--ink)]">
                  Last name
                  <input
                    type="text"
                    value={profileForm.lastName}
                    onChange={(event) =>
                      setProfileForm((current) => ({ ...current, lastName: event.target.value }))
                    }
                    className={fieldClass}
                  />
                </label>
                <label className="block text-sm font-medium text-[var(--ink)] md:col-span-2">
                  Email
                  <input type="email" value={profileForm.email} readOnly className={fieldClass} />
                </label>
                <label className="block text-sm font-medium text-[var(--ink)]">
                  Phone
                  <input
                    type="tel"
                    value={profileForm.phone}
                    onChange={(event) =>
                      setProfileForm((current) => ({ ...current, phone: event.target.value }))
                    }
                    className={fieldClass}
                  />
                </label>
                <label className="block text-sm font-medium text-[var(--ink)]">
                  Customer type
                  <select
                    value={profileForm.customerType}
                    onChange={(event) =>
                      setProfileForm((current) => ({ ...current, customerType: event.target.value }))
                    }
                    className={fieldClass}
                  >
                    <option value="individual">Individual</option>
                    <option value="pro">Professional</option>
                  </select>
                </label>
                <label className="block text-sm font-medium text-[var(--ink)] md:col-span-2">
                  Preferred language
                  <select
                    value={profileForm.preferredLanguage}
                    onChange={(event) =>
                      setProfileForm((current) => ({
                        ...current,
                        preferredLanguage: event.target.value,
                      }))
                    }
                    className={fieldClass}
                  >
                    <option value="fr-FR">French</option>
                    <option value="en-US">English</option>
                  </select>
                </label>
              </div>
              <button
                type="button"
                onClick={saveProfile}
                disabled={isPending}
                className={`mt-6 ${primaryButtonClass}`}
              >
                Save profile
              </button>
            </div>

            <div className={cardClass}>
              <p className="eyebrow">Password</p>
              <p className="mt-4 text-sm leading-6 text-[var(--muted)]">
                Change the sign-in password without leaving the account center.
              </p>
              <label className="mt-5 block text-sm font-medium text-[var(--ink)]">
                New password
                <input
                  type="password"
                  value={passwordForm.password}
                  onChange={(event) =>
                    setPasswordForm((current) => ({ ...current, password: event.target.value }))
                  }
                  className={fieldClass}
                />
              </label>
              <label className="mt-5 block text-sm font-medium text-[var(--ink)]">
                Confirm password
                <input
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(event) =>
                    setPasswordForm((current) => ({
                      ...current,
                      confirmPassword: event.target.value,
                    }))
                  }
                  className={fieldClass}
                />
              </label>
              <button
                type="button"
                onClick={changePassword}
                disabled={isPending}
                className={`mt-6 ${primaryButtonClass}`}
              >
                Update password
              </button>
            </div>
          </div>

          <div className={cardClass}>
            <p className="eyebrow">My Policies</p>
            <div className="mt-5 grid gap-4">
              {account.recentOrders.length ? (
                account.recentOrders.map((order) => (
                  <article
                    key={order.id}
                    className="rounded-[24px] border border-[rgba(22,36,58,0.08)] bg-white p-5"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <h3 className="text-lg font-semibold text-[var(--ink)]">
                          {order.orderNumber}
                        </h3>
                        <p className="mt-1 text-sm text-[var(--muted)]">
                          {order.totalAmount} {order.currency}
                        </p>
                      </div>
                      <div className="rounded-full bg-[rgba(31,183,166,0.12)] px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--accent-2)]">
                        {order.status}
                      </div>
                    </div>
                    <div className="mt-4 grid gap-2 text-sm text-[var(--ink)] md:grid-cols-2">
                      <p>Review: {order.adminReviewStatus}</p>
                      <p>Paid at: {order.paidAt ? new Date(order.paidAt).toLocaleString() : "Pending"}</p>
                      <p>Starts: {new Date(order.coverageStartAt).toLocaleString()}</p>
                      <p>Ends: {new Date(order.coverageEndAt).toLocaleString()}</p>
                    </div>
                    {order.contractFileUrl ? (
                      <a
                        href={order.contractFileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-4 inline-flex rounded-full border border-[rgba(22,36,58,0.12)] bg-[rgba(255,255,255,0.82)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--ink)] transition duration-200 ease-out hover:border-[rgba(22,36,58,0.24)] hover:bg-white"
                      >
                        View contract template
                      </a>
                    ) : null}
                  </article>
                ))
              ) : (
                <div className="rounded-[24px] bg-[var(--surface-2)] p-5 text-sm text-[var(--muted)]">
                  No orders yet for this account.
                </div>
              )}
            </div>
          </div>

          <div className="grid gap-4 xl:grid-cols-2">
            <div className={cardClass}>
              <p className="eyebrow">Vehicles</p>
              <div className="mt-5 space-y-3">
                {account.vehicles.length ? (
                  account.vehicles.map((vehicle) => (
                    <div
                      key={vehicle.id}
                      className="rounded-[24px] border border-[rgba(22,36,58,0.08)] bg-white p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold text-[var(--ink)]">{vehicle.registrationNumber}</p>
                          <p className="mt-1 text-sm text-[var(--muted)]">
                            {vehicle.manufacturer || "Vehicle"} {vehicle.model || ""} · {vehicle.fiscalPower} CV
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => deleteWorkspaceItem("vehicle", vehicle.id)}
                          className="text-sm font-semibold text-[var(--danger)]"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="rounded-[24px] bg-[var(--surface-2)] p-4 text-sm text-[var(--muted)]">
                    No saved vehicle yet.
                  </div>
                )}
              </div>
              <div className="mt-5 grid gap-4">
                <label className="block text-sm font-medium text-[var(--ink)]">
                  Registration number
                  <input
                    type="text"
                    value={vehicleForm.registrationNumber}
                    onChange={(event) =>
                      setVehicleForm((current) => ({
                        ...current,
                        registrationNumber: event.target.value,
                      }))
                    }
                    className={fieldClass}
                  />
                </label>
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="block text-sm font-medium text-[var(--ink)]">
                    Manufacturer
                    <input
                      type="text"
                      value={vehicleForm.manufacturer}
                      onChange={(event) =>
                        setVehicleForm((current) => ({ ...current, manufacturer: event.target.value }))
                      }
                      className={fieldClass}
                    />
                  </label>
                  <label className="block text-sm font-medium text-[var(--ink)]">
                    Model
                    <input
                      type="text"
                      value={vehicleForm.model}
                      onChange={(event) =>
                        setVehicleForm((current) => ({ ...current, model: event.target.value }))
                      }
                      className={fieldClass}
                    />
                  </label>
                </div>
                <label className="block text-sm font-medium text-[var(--ink)]">
                  Fiscal power
                  <input
                    type="number"
                    min="1"
                    value={vehicleForm.fiscalPower}
                    onChange={(event) =>
                      setVehicleForm((current) => ({ ...current, fiscalPower: event.target.value }))
                    }
                    className={fieldClass}
                  />
                </label>
                <button
                  type="button"
                  onClick={() => createWorkspaceItem("vehicle")}
                  disabled={isPending}
                  className={primaryButtonClass}
                >
                  Add vehicle
                </button>
              </div>
            </div>

            <div className={cardClass}>
              <p className="eyebrow">Drivers</p>
              <div className="mt-5 space-y-3">
                {account.drivers.length ? (
                  account.drivers.map((driver) => (
                    <div
                      key={driver.id}
                      className="rounded-[24px] border border-[rgba(22,36,58,0.08)] bg-white p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold text-[var(--ink)]">
                            {driver.firstName} {driver.lastName}
                          </p>
                          <p className="mt-1 text-sm text-[var(--muted)]">
                            {driver.email || "No email"} · {driver.licenseCountryCode}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => deleteWorkspaceItem("driver", driver.id)}
                          className="text-sm font-semibold text-[var(--danger)]"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="rounded-[24px] bg-[var(--surface-2)] p-4 text-sm text-[var(--muted)]">
                    No saved driver yet.
                  </div>
                )}
              </div>
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <label className="block text-sm font-medium text-[var(--ink)]">
                  First name
                  <input
                    type="text"
                    value={driverForm.firstName}
                    onChange={(event) =>
                      setDriverForm((current) => ({ ...current, firstName: event.target.value }))
                    }
                    className={fieldClass}
                  />
                </label>
                <label className="block text-sm font-medium text-[var(--ink)]">
                  Last name
                  <input
                    type="text"
                    value={driverForm.lastName}
                    onChange={(event) =>
                      setDriverForm((current) => ({ ...current, lastName: event.target.value }))
                    }
                    className={fieldClass}
                  />
                </label>
                <label className="block text-sm font-medium text-[var(--ink)]">
                  Birthday
                  <input
                    type="date"
                    value={driverForm.birthday}
                    onChange={(event) =>
                      setDriverForm((current) => ({ ...current, birthday: event.target.value }))
                    }
                    className={fieldClass}
                  />
                </label>
                <label className="block text-sm font-medium text-[var(--ink)]">
                  Email
                  <input
                    type="email"
                    value={driverForm.driverEmail}
                    onChange={(event) =>
                      setDriverForm((current) => ({ ...current, driverEmail: event.target.value }))
                    }
                    className={fieldClass}
                  />
                </label>
                <label className="block text-sm font-medium text-[var(--ink)]">
                  Phone
                  <input
                    type="tel"
                    value={driverForm.phone}
                    onChange={(event) =>
                      setDriverForm((current) => ({ ...current, phone: event.target.value }))
                    }
                    className={fieldClass}
                  />
                </label>
                <label className="block text-sm font-medium text-[var(--ink)]">
                  License number
                  <input
                    type="text"
                    value={driverForm.licenseNumber}
                    onChange={(event) =>
                      setDriverForm((current) => ({ ...current, licenseNumber: event.target.value }))
                    }
                    className={fieldClass}
                  />
                </label>
                <label className="block text-sm font-medium text-[var(--ink)] md:col-span-2">
                  License country code
                  <input
                    type="text"
                    value={driverForm.licenseCountryCode}
                    onChange={(event) =>
                      setDriverForm((current) => ({
                        ...current,
                        licenseCountryCode: event.target.value.toUpperCase(),
                      }))
                    }
                    className={fieldClass}
                  />
                </label>
                <button
                  type="button"
                  onClick={() => createWorkspaceItem("driver")}
                  disabled={isPending}
                  className={primaryButtonClass}
                >
                  Add driver
                </button>
              </div>
            </div>
          </div>

          <div className={cardClass}>
            <p className="eyebrow">Delete account</p>
            <p className="mt-4 text-sm leading-6 text-[var(--muted)]">
              Closing the account suspends future sign-in access while preserving historical order
              records needed for audit and policy follow-up.
            </p>
            <label className="mt-5 block text-sm font-medium text-[var(--ink)]">
              Type DELETE to confirm
              <input
                type="text"
                value={deletePhrase}
                onChange={(event) => setDeletePhrase(event.target.value)}
                className={fieldClass}
              />
            </label>
            <button
              type="button"
              onClick={deleteAccount}
              disabled={isPending}
              className="mt-6 rounded-full bg-[var(--danger)] px-6 py-3 text-sm font-semibold text-white"
            >
              Delete account
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
