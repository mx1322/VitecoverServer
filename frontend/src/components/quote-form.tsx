"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

import type {
  CompleteCheckoutResult,
  CustomerWorkspace,
  ProductPricingOptions,
  QuotePreview,
  QuoteProductOption,
} from "@/lib/directus-admin";
import type { AuthenticatedAccount } from "@/lib/directus-auth";
import type { Locale } from "@/lib/i18n/config";
import { localizePath } from "@/lib/i18n/routing";
import { t } from "@/lib/i18n/translations";

interface QuoteFormProps {
  products: QuoteProductOption[];
  initialProductCode?: string;
  locale: Locale;
}

type Step =
  | "price"
  | "vehicle"
  | "driver"
  | "payment"
  | "review"
  | "success";

interface SessionResponse {
  authenticated: boolean;
  account: AuthenticatedAccount | null;
  error?: string;
}

interface PreviewResponse extends QuotePreview {
  error?: string;
}

interface PricingOptionsResponse extends ProductPricingOptions {
  error?: string;
}

interface CheckoutResponse extends CompleteCheckoutResult {
  error?: string;
}

interface WorkspaceMutationResponse {
  workspace: CustomerWorkspace;
  error?: string;
}

const hourOptions = Array.from({ length: 24 }, (_, index) => String(index).padStart(2, "0"));
const quoteDraftStorageKey = "vitecover-quote-draft";
const primaryButtonClass =
  "rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-[var(--ink)] shadow-[0_10px_24px_rgba(255,179,71,0.18)] transition duration-200 ease-out hover:scale-[1.03] hover:bg-[#f2a63a] hover:shadow-[0_16px_32px_rgba(255,179,71,0.28)] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:scale-100 disabled:hover:bg-[var(--accent)]";
const secondaryButtonClass =
  "rounded-full border border-[rgba(22,36,58,0.12)] bg-white px-5 py-3 text-sm font-semibold text-[var(--ink)] transition duration-200 ease-out hover:scale-[1.03] hover:border-[rgba(22,36,58,0.2)] hover:bg-[rgba(22,36,58,0.04)] active:scale-[0.99]";
const toggleButtonClass =
  "rounded-full px-4 py-2 text-sm font-semibold transition duration-200 ease-out hover:scale-[1.03] active:scale-[0.99]";
const fieldClass =
  "mt-2 block w-full min-w-0 max-w-full [min-inline-size:0] rounded-2xl border border-[rgba(22,36,58,0.12)] bg-white px-4 py-3 text-sm text-[var(--ink)] transition duration-200 ease-out hover:border-[rgba(22,36,58,0.22)] focus:border-[rgba(255,179,71,0.8)] focus:outline-none focus:ring-2 focus:ring-[rgba(255,179,71,0.22)]";
const fieldLabelClass = "block min-w-0 text-sm font-medium text-[var(--ink)]";

const stepLabels: Array<{ id: Step; label: string }> = [
  { id: "price", label: "Product" },
  { id: "vehicle", label: "Vehicle" },
  { id: "driver", label: "Driver" },
  { id: "payment", label: "Overview" },
  { id: "review", label: "Review" },
  { id: "success", label: "Covered" },
];

const stepDetails: Record<
  Step,
  { title: string; description: string; next: string[] }
> = {
  price: {
    title: "Choose the product and cover window",
    description:
      "Select product, duration, and start hour. We immediately show premium, start, and end times.",
    next: ["Vehicle", "Driver", "Overview"],
  },
  vehicle: {
    title: "Confirm the customer and vehicle",
    description:
      "Sign in, then pick a saved vehicle or add a new one.",
    next: ["Driver", "Overview", "Review"],
  },
  driver: {
    title: "Confirm the driver",
    description:
      "Pick a saved driver or add one new driver.",
    next: ["Overview", "Review", "Covered"],
  },
  payment: {
    title: "Overview",
    description:
      "Check the recap and confirm payment.",
    next: ["Review", "Covered"],
  },
  review: {
    title: "Manual review",
    description:
      "Some products require a short manual check before coverage starts.",
    next: ["Covered"],
  },
  success: {
    title: "Covered",
    description:
      "Order approved. Your policy is sent by email and stored in your history.",
    next: [],
  },
};

async function postJson<T>(url: string, body: Record<string, unknown>): Promise<T> {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const payload = (await response.json()) as T & { error?: string };
  if (!response.ok) {
    throw new Error(payload.error ?? "Request failed.");
  }

  return payload;
}

function stepNumber(step: Step): number {
  return stepLabels.findIndex((item) => item.id === step);
}

function toDateTimeLocalValue(date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:00`;
}

function getDefaultCoverageStart(date = new Date()): string {
  const nextHourTomorrow = new Date(date);
  nextHourTomorrow.setDate(nextHourTomorrow.getDate() + 1);
  nextHourTomorrow.setMinutes(0, 0, 0);
  nextHourTomorrow.setHours(nextHourTomorrow.getHours() + 1);
  return toDateTimeLocalValue(nextHourTomorrow);
}

function getCoverageWindow(startAt: string, durationDays: string) {
  const startDate = new Date(startAt);
  if (Number.isNaN(startDate.getTime())) {
    return null;
  }

  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + Number(durationDays || "0"));
  endDate.setHours(23, 59, 59, 0);
  return { startDate, endDate };
}

function formatCoverageDate(date: Date, locale: Locale): string {
  return new Intl.DateTimeFormat(locale === "zh" ? "zh-CN" : locale, {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function formatDateCell(value: string | undefined, locale: Locale): string {
  if (!value) {
    return "-";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat(locale === "zh" ? "zh-CN" : locale, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

function formatCurrencyAmount(value: string | number): string {
  return Number(value).toFixed(2);
}

function splitCoverageStart(value: string): { date: string; hour: string } {
  const [datePart, timePart = "00:00"] = value.split("T");
  return {
    date: datePart ?? "",
    hour: timePart.slice(0, 2) || "00",
  };
}

function toWorkspace(account: AuthenticatedAccount): CustomerWorkspace {
  return {
    customer: account.customer,
    vehicles: account.vehicles,
    drivers: account.drivers,
    recentOrders: account.recentOrders,
  };
}

export function QuoteForm({ products, initialProductCode, locale }: QuoteFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [step, setStep] = useState<Step>("price");
  const [authResolved, setAuthResolved] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState<QuotePreview | null>(null);
  const [isPreviewPending, setIsPreviewPending] = useState(false);
  const [pricingOptions, setPricingOptions] = useState<ProductPricingOptions | null>(null);
  const [workspace, setWorkspace] = useState<CustomerWorkspace | null>(null);
  const [result, setResult] = useState<CompleteCheckoutResult | null>(null);
  const [priceForm, setPriceForm] = useState({
    productCode: initialProductCode ?? products[0]?.code ?? "AUTOMOBILE",
    durationDays: "1",
    coverageStartAt: getDefaultCoverageStart(),
    fiscalPower: "6",
  });
  const [accountForm, setAccountForm] = useState({
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
  });
  const [vehicleMode, setVehicleMode] = useState<"existing" | "new">("new");
  const [selectedVehicleId, setSelectedVehicleId] = useState("");
  const [vehicleForm, setVehicleForm] = useState({
    registrationNumber: "",
    manufacturer: "",
    model: "",
    fiscalPower: "6",
  });
  const [driverMode, setDriverMode] = useState<"existing" | "new">("new");
  const [selectedDriverId, setSelectedDriverId] = useState("");
  const [driverForm, setDriverForm] = useState({
    firstName: "",
    lastName: "",
    birthday: "",
    email: "",
    phone: "",
    licenseNumber: "",
    licenseExpiryDate: "",
    licenseCountryCode: "FR",
  });
  const requestedStep = (searchParams.get("step") as Step | null) ?? "price";
  const requestedProductCode = searchParams.get("product")?.trim().toUpperCase() || initialProductCode || products[0]?.code || "AUTOMOBILE";

  function buildQuoteHref(targetStep: Step): string {
    const params = new URLSearchParams(searchParams.toString());
    params.set("step", targetStep);
    if (priceForm.productCode) {
      params.set("product", priceForm.productCode);
    }
    const query = params.toString();
    const quotePath = localizePath("/quote", locale);
    return query ? `${quotePath}?${query}` : quotePath;
  }

  function redirectToAuth(targetStep: Step) {
    router.replace(`${localizePath("/auth", locale)}?returnTo=${encodeURIComponent(buildQuoteHref(targetStep))}`);
  }

  function setWorkspaceAndSelection(nextWorkspace: CustomerWorkspace) {
    setWorkspace(nextWorkspace);

    setSelectedVehicleId((current) => {
      if (nextWorkspace.vehicles.some((item) => String(item.id) === current)) {
        return current;
      }
      return String(nextWorkspace.vehicles[0]?.id ?? "");
    });

    setSelectedDriverId((current) => {
      if (nextWorkspace.drivers.some((item) => String(item.id) === current)) {
        return current;
      }
      return String(nextWorkspace.drivers[0]?.id ?? "");
    });
  }

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const savedDraft = window.localStorage.getItem(quoteDraftStorageKey);
    if (savedDraft) {
      try {
        const draft = JSON.parse(savedDraft) as Partial<typeof priceForm>;
        setPriceForm((current) => ({
          ...current,
          ...draft,
          productCode: requestedProductCode,
        }));
      } catch {
        window.localStorage.removeItem(quoteDraftStorageKey);
      }
    }
  }, [requestedProductCode]);

  useEffect(() => {
    setPriceForm((current) => {
      if (current.productCode === requestedProductCode) {
        return current;
      }

      return {
        ...current,
        productCode: requestedProductCode,
      };
    });
  }, [requestedProductCode]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(quoteDraftStorageKey, JSON.stringify(priceForm));
  }, [priceForm]);

  useEffect(() => {
    let isActive = true;

    startTransition(async () => {
      try {
        const response = await fetch("/api/auth/session", {
          method: "GET",
        });
        const payload = (await response.json()) as SessionResponse;

        if (!isActive) {
          return;
        }

        if (!response.ok || !payload.authenticated || !payload.account) {
          setWorkspace(null);
          return;
        }

        setWorkspaceAndSelection(toWorkspace(payload.account));
        setError("");
      } catch {
        if (!isActive) {
          return;
        }

        setWorkspace(null);
      } finally {
        if (isActive) {
          setAuthResolved(true);
        }
      }
    });

    return () => {
      isActive = false;
    };
  }, []);

  useEffect(() => {
    if (!workspace) {
      return;
    }

    setAccountForm({
      email: workspace.customer.email,
      firstName: workspace.customer.firstName,
      lastName: workspace.customer.lastName,
      phone: workspace.customer.phone,
    });

    setDriverForm((current) => ({
      ...current,
      firstName: current.firstName || workspace.customer.firstName,
      lastName: current.lastName || workspace.customer.lastName,
      email: current.email || workspace.customer.email,
      phone: current.phone || workspace.customer.phone,
    }));

    if (workspace.vehicles.length > 0 && !selectedVehicleId) {
      setVehicleMode("existing");
      setSelectedVehicleId(String(workspace.vehicles[0]?.id ?? ""));
    }

    if (workspace.drivers.length > 0 && !selectedDriverId) {
      setDriverMode("existing");
      setSelectedDriverId(String(workspace.drivers[0]?.id ?? ""));
    }
  }, [selectedDriverId, selectedVehicleId, workspace]);

  useEffect(() => {
    if (!requestedStep || requestedStep === step) {
      return;
    }

    if (requestedStep !== "price" && !authResolved) {
      return;
    }

    if ((requestedStep === "vehicle" || requestedStep === "driver" || requestedStep === "payment") && !preview) {
      return;
    }

    if (requestedStep !== "price" && !workspace) {
      redirectToAuth(requestedStep);
      return;
    }

    setStep(requestedStep);
  }, [authResolved, preview, requestedStep, step, workspace]);

  const selectedVehicle =
    workspace?.vehicles.find((item) => String(item.id) === selectedVehicleId) ?? null;
  const selectedDriver =
    workspace?.drivers.find((item) => String(item.id) === selectedDriverId) ?? null;
  const durationOptions = pricingOptions?.durationOptions ?? [];
  const fiscalPowerOptions =
    pricingOptions?.fiscalPowerOptionsByDuration[priceForm.durationDays]?.map(String) ?? [];
  const vehicleFiscalPowerOptions = Array.from(
    new Set([priceForm.fiscalPower, vehicleForm.fiscalPower, ...fiscalPowerOptions].filter(Boolean)),
  );

  useEffect(() => {
    if (vehicleMode !== "new") {
      return;
    }

    setVehicleForm((current) => {
      if (current.fiscalPower === priceForm.fiscalPower) {
        return current;
      }

      return {
        ...current,
        fiscalPower: priceForm.fiscalPower,
      };
    });
  }, [priceForm.fiscalPower, vehicleMode]);

  useEffect(() => {
    let isActive = true;

    startTransition(async () => {
      try {
        const payload = await postJson<PricingOptionsResponse>("/api/checkout/options", {
          productCode: priceForm.productCode,
        });

        if (!isActive) {
          return;
        }

        setPricingOptions(payload);
        setError("");

        const nextDuration = payload.durationOptions.includes(Number(priceForm.durationDays))
          ? priceForm.durationDays
          : String(payload.durationOptions[0] ?? "");
        const nextFiscalPowerOptions = payload.fiscalPowerOptionsByDuration[nextDuration] ?? [];
        const nextFiscalPower = nextFiscalPowerOptions.includes(Number(priceForm.fiscalPower))
          ? priceForm.fiscalPower
          : String(nextFiscalPowerOptions[0] ?? "");

        if (
          nextDuration &&
          nextFiscalPower &&
          (nextDuration !== priceForm.durationDays || nextFiscalPower !== priceForm.fiscalPower)
        ) {
          setPriceForm((current) => ({
            ...current,
            durationDays: nextDuration,
            fiscalPower: nextFiscalPower,
          }));
        }
      } catch (requestError) {
        if (!isActive) {
          return;
        }

        setPricingOptions(null);
        setError(
          requestError instanceof Error
            ? requestError.message
            : t(locale, "Unable to load pricing options."),
        );
      }
    });

    return () => {
      isActive = false;
    };
  }, [priceForm.productCode]);

  useEffect(() => {
    if (step !== "price") {
      return;
    }

    const durationDays = Number(priceForm.durationDays);
    const fiscalPower = Number(priceForm.fiscalPower);
    const coverageStartAt = priceForm.coverageStartAt;

    if (!priceForm.productCode || !durationDays || !fiscalPower || !coverageStartAt) {
      setPreview(null);
      setIsPreviewPending(false);
      return;
    }

    if (
      pricingOptions &&
      !(
        pricingOptions.fiscalPowerOptionsByDuration[String(durationDays)] ?? []
      ).includes(fiscalPower)
    ) {
      setPreview(null);
      setIsPreviewPending(false);
      return;
    }

    let isActive = true;
    const timer = window.setTimeout(async () => {
      setIsPreviewPending(true);

      try {
        const payload = await postJson<PreviewResponse>("/api/checkout/preview", {
          productCode: priceForm.productCode,
          durationDays,
          coverageStartAt,
          fiscalPower,
        });

        if (!isActive) {
          return;
        }

        setPreview(payload);
        setError("");
      } catch (requestError) {
        if (!isActive) {
          return;
        }

        setPreview(null);
        setError(
          requestError instanceof Error ? requestError.message : t(locale, "Unable to calculate the price."),
        );
      } finally {
        if (isActive) {
          setIsPreviewPending(false);
        }
      }
    }, 250);

    return () => {
      isActive = false;
      window.clearTimeout(timer);
    };
  }, [
    priceForm.coverageStartAt,
    priceForm.durationDays,
    priceForm.fiscalPower,
    priceForm.productCode,
    pricingOptions,
    step,
  ]);

  function updatePriceField(name: string, value: string) {
    if (name === "productCode" || name === "durationDays" || name === "fiscalPower") {
      setPreview(null);
    }
    setPriceForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function updateCoverageStart(partial: { date?: string; hour?: string }) {
    const current = splitCoverageStart(priceForm.coverageStartAt);
    const nextDate = partial.date ?? current.date;
    const nextHour = partial.hour ?? current.hour;
    if (!nextDate) {
      return;
    }

    setPriceForm((currentForm) => ({
      ...currentForm,
      coverageStartAt: `${nextDate}T${nextHour}:00`,
    }));
  }

  function updateVehicleField(name: string, value: string) {
    setVehicleForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function updateDriverField(name: string, value: string) {
    setDriverForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function moveBack() {
    const index = stepNumber(step);
    if (index <= 0) {
      return;
    }

    setError("");
    const previousStep = stepLabels[index - 1]!.id;
    setStep(previousStep);
    router.replace(buildQuoteHref(previousStep));
  }

  function canUseCurrentVehicle(): boolean {
    if (!workspace) {
      return false;
    }

    if (vehicleMode === "existing") {
      return Boolean(selectedVehicle);
    }

    return Boolean(vehicleForm.registrationNumber.trim());
  }

  function canUseCurrentDriver(): boolean {
    if (driverMode === "existing") {
      return Boolean(selectedDriver);
    }

    return Boolean(driverForm.firstName.trim() && driverForm.lastName.trim());
  }

  function navigateToStep(target: Step) {
    setError("");

    if (target === "price") {
      setStep("price");
      router.replace(buildQuoteHref("price"));
      return;
    }

    if (!workspace) {
      setError(t(locale, "Sign in first to open the next steps."));
      redirectToAuth(target);
      return;
    }

    if (!preview) {
      setError(t(locale, "Choose the product options and wait for the price first."));
      setStep("price");
      router.replace(buildQuoteHref("price"));
      return;
    }

    if (target === "vehicle") {
      setStep("vehicle");
      router.replace(buildQuoteHref("vehicle"));
      return;
    }

    if (target === "driver" && !canUseCurrentVehicle()) {
      setError(t(locale, "Choose or create a vehicle first."));
      setStep("vehicle");
      return;
    }

    if (target === "driver") {
      setStep("driver");
      router.replace(buildQuoteHref("driver"));
      return;
    }

    if (target === "payment" && !canUseCurrentVehicle()) {
      setError(t(locale, "Choose or create a vehicle first."));
      setStep("vehicle");
      return;
    }

    if (target === "payment" && !canUseCurrentDriver()) {
      setError(t(locale, "Choose or create a driver first."));
      setStep("driver");
      return;
    }

    if (target === "payment") {
      setStep("payment");
      router.replace(buildQuoteHref("payment"));
      return;
    }

    if ((target === "review" || target === "success") && !result) {
      setError(t(locale, "Finish payment before opening review or covered."));
      setStep("payment");
      return;
    }

    setStep(target);
    router.replace(buildQuoteHref(target));
  }

  function handleDeleteWorkspaceItem(kind: "vehicle" | "driver", id: number) {
    if (!workspace) {
      return;
    }

    setError("");

    startTransition(async () => {
      try {
        const payload = await fetch("/api/auth/workspace-item", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            kind,
            id,
          }),
        });

        const result = (await payload.json()) as WorkspaceMutationResponse;
        if (!payload.ok) {
          throw new Error(result.error ?? t(locale, "Unable to delete this item."));
        }

        setWorkspaceAndSelection(result.workspace);
      } catch (requestError) {
        setError(
          requestError instanceof Error ? requestError.message : t(locale, "Unable to delete this item."),
        );
      }
    });
  }

  function handleVehicleContinue() {
    if (!workspace) {
      setError(t(locale, "Sign in before continuing to vehicle details."));
      redirectToAuth("vehicle");
      return;
    }

    setError("");

    startTransition(async () => {
      try {
        const fiscalPower =
          vehicleMode === "existing"
            ? selectedVehicle?.fiscalPower
            : Number(vehicleForm.fiscalPower || priceForm.fiscalPower);

        if (!fiscalPower || fiscalPower <= 0) {
          throw new Error(t(locale, "Choose a vehicle or provide a valid fiscal power."));
        }

        if (vehicleMode === "existing" && !selectedVehicle) {
          throw new Error(t(locale, "Choose one of the saved vehicles."));
        }

        if (vehicleMode === "new" && !vehicleForm.registrationNumber.trim()) {
          throw new Error(t(locale, "Registration number is required for a new vehicle."));
        }

        const refreshedPreview = await postJson<PreviewResponse>("/api/checkout/preview", {
          productCode: priceForm.productCode,
          durationDays: Number(priceForm.durationDays),
          coverageStartAt: priceForm.coverageStartAt,
          fiscalPower,
        });

        setPreview(refreshedPreview);
        setPriceForm((current) => ({
          ...current,
          fiscalPower: String(fiscalPower),
        }));
        setStep("driver");
        router.replace(buildQuoteHref("driver"));
      } catch (requestError) {
        setError(
          requestError instanceof Error
            ? requestError.message
            : t(locale, "Unable to continue with this vehicle."),
        );
      }
    });
  }

  function handleDriverContinue() {
    setError("");

    if (driverMode === "existing" && !selectedDriver) {
      setError(t(locale, "Choose one of the saved drivers."));
      return;
    }

    if (driverMode === "new" && (!driverForm.firstName.trim() || !driverForm.lastName.trim())) {
      setError(t(locale, "First name and last name are required for a new driver."));
      return;
    }

    setStep("payment");
    router.replace(buildQuoteHref("payment"));
  }

  function handleLocalPayment() {
    if (!preview) {
      setError(t(locale, "Check the price first."));
      setStep("price");
      return;
    }

    if (!workspace) {
      setError(t(locale, "Sign in before payment."));
      redirectToAuth("payment");
      return;
    }

    setError("");

    startTransition(async () => {
      try {
        const payload = await postJson<CheckoutResponse>("/api/checkout/complete", {
          customer: accountForm,
          productCode: priceForm.productCode,
          durationDays: Number(priceForm.durationDays),
          coverageStartAt: priceForm.coverageStartAt,
          vehicle:
            vehicleMode === "existing"
              ? { vehicleId: Number(selectedVehicleId) }
              : {
                  registrationNumber: vehicleForm.registrationNumber,
                  manufacturer: vehicleForm.manufacturer,
                  model: vehicleForm.model,
                  fiscalPower: Number(vehicleForm.fiscalPower),
                },
          driver:
            driverMode === "existing"
              ? { driverId: Number(selectedDriverId) }
              : {
                  firstName: driverForm.firstName,
                  lastName: driverForm.lastName,
                  birthday: driverForm.birthday,
                  email: driverForm.email,
                  phone: driverForm.phone,
                  licenseNumber: driverForm.licenseNumber,
                  licenseExpiryDate: driverForm.licenseExpiryDate,
                  licenseCountryCode: driverForm.licenseCountryCode,
                },
        });

        setWorkspace((current) => {
          const currentVehicles = current?.vehicles ?? [];
          const currentDrivers = current?.drivers ?? [];

          return {
            customer: payload.customer,
            vehicles: currentVehicles.some((item) => item.id === payload.vehicle.id)
              ? currentVehicles
              : [payload.vehicle, ...currentVehicles],
            drivers: currentDrivers.some((item) => item.id === payload.driver.id)
              ? currentDrivers
              : [payload.driver, ...currentDrivers],
            recentOrders: payload.recentOrders,
          };
        });
        setResult(payload);
        setStep("review");
        router.replace(buildQuoteHref("review"));
      } catch (requestError) {
        setError(
          requestError instanceof Error
            ? requestError.message
            : t(locale, "Unable to finish the local checkout flow."),
        );
      }
    });
  }

  const summaryVehicle = selectedVehicle ?? {
    id: 0,
    registrationNumber: vehicleForm.registrationNumber,
    manufacturer: vehicleForm.manufacturer,
    model: vehicleForm.model,
    fiscalPower: Number(vehicleForm.fiscalPower || "0"),
    vehicleCategory: "automobile",
    isVerified: false,
  };

  const summaryDriver = selectedDriver ?? {
    id: 0,
    firstName: driverForm.firstName,
    lastName: driverForm.lastName,
    birthday: driverForm.birthday,
    email: driverForm.email,
    phone: driverForm.phone,
    licenseNumber: driverForm.licenseNumber,
    licenseExpiryDate: driverForm.licenseExpiryDate,
    licenseCountryCode: driverForm.licenseCountryCode,
    isVerified: false,
  };
  const currentStepMeta = stepDetails[step];
  const coverageWindow = getCoverageWindow(priceForm.coverageStartAt, priceForm.durationDays);
  const coverageStartParts = splitCoverageStart(priceForm.coverageStartAt);

  return (
    <div>
      <div className="rounded-[32px] border border-[rgba(22,36,58,0.08)] bg-[rgba(255,255,255,0.92)] p-6 shadow-[0_24px_70px_rgba(22,36,58,0.08)]">
        <div className="overflow-x-auto pb-2">
          <div className="relative min-w-[820px] px-2">
            <div className="absolute left-6 right-6 top-5 h-[2px] bg-[rgba(22,36,58,0.12)]" />
            <div
              className="absolute left-6 top-5 h-[2px] bg-[linear-gradient(90deg,var(--accent),var(--accent-2))] transition-all duration-300"
              style={{
                width: `calc(${((stepNumber(step) + 1) / stepLabels.length) * 100}% - 3rem)`,
              }}
            />
            <div className="relative grid grid-cols-6 gap-3">
              {stepLabels.map((item, index) => {
                const isActive = step === item.id;
                const isComplete = stepNumber(step) > index;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => navigateToStep(item.id)}
                    className="flex flex-col items-center text-center transition duration-200 ease-out hover:scale-[1.03]"
                  >
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full border text-xs font-semibold transition duration-200 ease-out ${
                        isActive
                          ? "border-[var(--accent)] bg-[var(--accent)] text-[var(--ink)] shadow-[0_12px_24px_rgba(255,179,71,0.24)]"
                          : isComplete
                            ? "border-[var(--accent-2)] bg-[var(--accent-2)] text-white shadow-[0_12px_24px_rgba(31,183,166,0.2)]"
                            : "border-[rgba(22,36,58,0.12)] bg-white text-[var(--muted)] hover:border-[rgba(22,36,58,0.24)] hover:bg-[rgba(22,36,58,0.04)]"
                      }`}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </div>
                    <p
                      className={`mt-3 text-xs font-semibold uppercase tracking-[0.18em] ${
                        isActive || isComplete ? "text-[var(--ink)]" : "text-[var(--muted)]"
                      }`}
                    >
                      {t(locale, item.label)}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-[28px] border border-[rgba(22,36,58,0.08)] bg-[linear-gradient(135deg,rgba(255,179,71,0.12),rgba(31,183,166,0.08))] p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
            {t(locale, "Current step")}
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-[var(--ink)]">
            {t(locale, currentStepMeta.title)}
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--muted)]">
            {t(locale, currentStepMeta.description)}
          </p>
          <p className="mt-4 text-sm leading-6 text-[var(--ink)]">
            {currentStepMeta.next.length
              ? `${t(locale, "Coming next")}: ${currentStepMeta.next.map((item) => t(locale, item)).join(" -> ")}`
              : t(locale, "The order is complete for now. Contract email delivery will be connected next.")}
          </p>
        </div>

        {step === "price" ? (
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            <label className={fieldLabelClass}>
              {t(locale, "Product")}
              <select
                value={priceForm.productCode}
                onChange={(event) => updatePriceField("productCode", event.target.value)}
                className={fieldClass}
              >
                {products.map((product) => (
                  <option key={product.code} value={product.code}>
                    {t(locale, product.name)}
                  </option>
                ))}
              </select>
            </label>

            <label className={fieldLabelClass}>
              {t(locale, "Duration")}
              <select
                value={priceForm.durationDays}
                onChange={(event) => updatePriceField("durationDays", event.target.value)}
                disabled={durationOptions.length === 0}
                className={fieldClass}
              >
                {durationOptions.map((days) => (
                  <option key={days} value={days}>
                    {days} {t(locale, days > 1 ? "days" : "day")}
                  </option>
                ))}
              </select>
            </label>

            <label className={fieldLabelClass}>
              {t(locale, "Coverage date")}
              <input
                type="date"
                value={coverageStartParts.date}
                onChange={(event) => updateCoverageStart({ date: event.target.value })}
                className={fieldClass}
              />
            </label>

            <label className={fieldLabelClass}>
              {t(locale, "Coverage start hour")}
              <select
                value={coverageStartParts.hour}
                onChange={(event) => updateCoverageStart({ hour: event.target.value })}
                className={fieldClass}
              >
                {hourOptions.map((hour) => (
                  <option key={hour} value={hour}>
                    {hour}:00
                  </option>
                ))}
              </select>
            </label>

            <label className={fieldLabelClass}>
              {t(locale, "Fiscal power (CV)")}
              <select
                value={priceForm.fiscalPower}
                onChange={(event) => updatePriceField("fiscalPower", event.target.value)}
                disabled={fiscalPowerOptions.length === 0}
                className={fieldClass}
              >
                {fiscalPowerOptions.map((value) => (
                  <option key={value} value={value}>
                    {value} CV
                  </option>
                ))}
              </select>
            </label>
          </div>
        ) : null}

        {step === "price" && coverageWindow ? (
          <div className="mt-6 grid gap-4 md:grid-cols-[1fr_1fr_0.95fr]">
            <div className="rounded-[24px] bg-[var(--surface-2)] p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
                {t(locale, "Selected cover")}
              </p>
              <p className="mt-3 text-lg font-semibold text-[var(--ink)]">
                {t(locale, "Temporary passenger car cover")}
              </p>
              <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                {Number(priceForm.fiscalPower) <= 10
                  ? t(locale, "For a passenger car up to 10 CV.")
                  : t(locale, "Check that the fiscal power matches the product rules before continuing.")}
              </p>
            </div>

            <div className="rounded-[24px] bg-[var(--surface-2)] p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
                {t(locale, "Cover window")}
              </p>
              <div className="mt-3 space-y-2 text-sm text-[var(--ink)]">
                <p>
                  <span className="font-semibold text-[var(--ink)]">{t(locale, "Duration")}:</span>{" "}
                  <span className="font-semibold text-[var(--ink)]">
                    {priceForm.durationDays} day{Number(priceForm.durationDays) > 1 ? "s" : ""}
                  </span>
                </p>
                <p>
                  <span className="font-semibold text-[var(--ink)]">{t(locale, "Starts")}:</span>{" "}
                  <span className="font-semibold text-[var(--ink)]">
                    {formatCoverageDate(coverageWindow.startDate, locale)}
                  </span>
                </p>
                <p>
                  <span className="font-semibold text-[var(--ink)]">{t(locale, "Ends")}:</span>{" "}
                  <span className="font-semibold text-[var(--ink)]">
                    {formatCoverageDate(coverageWindow.endDate, locale)}
                  </span>
                </p>
              </div>
              <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                {t(locale, "Temporary cover starts on the selected hour and ends at 23:59 on the final day.")}
              </p>
            </div>

            <div className="rounded-[24px] border border-[rgba(255,179,71,0.35)] bg-[rgba(255,179,71,0.14)] p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
                {t(locale, "Premium")}
              </p>
              {isPreviewPending ? (
                <>
                  <p className="mt-3 text-3xl font-semibold text-[var(--ink)]">{t(locale, "Updating price...")}</p>
                  <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                    {t(locale, "The tariff refreshes automatically when duration or fiscal power changes.")}
                  </p>
                </>
              ) : preview ? (
                <>
                  <p className="mt-3 text-4xl font-semibold text-[var(--ink)]">
                    {preview.totalPremium} {preview.currency}
                  </p>
                  {preview.durationDays > 1 ? (
                    <p className="mt-2 text-sm font-semibold text-[var(--ink)]">
                      {t(locale, "Average per day")}:{" "}
                      {formatCurrencyAmount(
                        Number(preview.totalPremium) / Number(preview.durationDays),
                      )}{" "}
                      {preview.currency} / day
                    </p>
                  ) : null}
                  <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                    {t(locale, "This is the current price for the selected duration and fiscal power.")}
                  </p>
                </>
              ) : (
                <>
                  <p className="mt-3 text-3xl font-semibold text-[var(--ink)]">{t(locale, "Check the price")}</p>
                  <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                    {t(locale, "Calculate the tariff here before moving on to vehicle details.")}
                  </p>
                </>
              )}
            </div>
          </div>
        ) : null}

        {step === "vehicle" ? (
          <div className="mt-8 space-y-6">
            {!workspace ? (
              <p className="rounded-[22px] border border-[rgba(22,36,58,0.08)] bg-white px-5 py-5 text-sm text-[var(--muted)]">
                {t(locale, "Redirecting to login...")}
              </p>
            ) : (
              <>
                <div className="rounded-[24px] border border-[rgba(22,36,58,0.08)] bg-[var(--surface-2)] p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
                    {t(locale, "Logged in account")}
                  </p>
                  <p className="mt-3 text-sm text-[var(--ink)]">
                    {workspace.customer.firstName} {workspace.customer.lastName}
                  </p>
                  <p className="mt-1 text-sm text-[var(--muted)]">{workspace.customer.email}</p>
                </div>

                {workspace.vehicles.length ? (
                  <div className="flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => setVehicleMode("existing")}
                      className={`${toggleButtonClass} ${
                        vehicleMode === "existing"
                          ? "bg-[var(--accent)] text-[var(--ink)] shadow-[0_10px_20px_rgba(255,179,71,0.22)]"
                          : "bg-[var(--surface-2)] text-[var(--muted)] hover:bg-[rgba(22,36,58,0.08)]"
                      }`}
                    >
                      {t(locale, "Choose saved vehicle")}
                    </button>
                    <button
                      type="button"
                      onClick={() => setVehicleMode("new")}
                      className={`${toggleButtonClass} ${
                        vehicleMode === "new"
                          ? "bg-[var(--accent)] text-[var(--ink)] shadow-[0_10px_20px_rgba(255,179,71,0.22)]"
                          : "bg-[var(--surface-2)] text-[var(--muted)] hover:bg-[rgba(22,36,58,0.08)]"
                      }`}
                    >
                      {t(locale, "Create new vehicle")}
                    </button>
                  </div>
                ) : null}

                {vehicleMode === "existing" && workspace?.vehicles.length ? (
                  <div className="overflow-hidden rounded-[24px] border border-[rgba(22,36,58,0.08)] bg-white">
                    <div className="grid grid-cols-[44px_1.1fr_1fr_1fr_1fr_80px_120px_88px] gap-3 border-b border-[rgba(22,36,58,0.08)] bg-[var(--surface-2)] px-4 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
                      <span />
                      <span>{t(locale, "Vehicle name")}</span>
                      <span>{t(locale, "Plate")}</span>
                      <span>{t(locale, "Brand")}</span>
                      <span>{t(locale, "Model")}</span>
                      <span>CV</span>
                      <span>{t(locale, "Review")}</span>
                      <span>{t(locale, "Action")}</span>
                    </div>
                    <fieldset>
                      {workspace.vehicles.map((vehicle) => (
                        <div
                          key={vehicle.id}
                          onClick={() => setSelectedVehicleId(String(vehicle.id))}
                          className={`grid grid-cols-[44px_1.1fr_1fr_1fr_1fr_80px_120px_88px] items-center gap-3 border-b border-[rgba(22,36,58,0.08)] px-4 py-4 text-sm transition duration-200 ease-out last:border-b-0 hover:bg-[rgba(255,179,71,0.1)] ${
                            String(vehicle.id) === selectedVehicleId
                              ? "bg-[rgba(249,208,127,0.2)] shadow-[inset_0_0_0_1px_rgba(255,179,71,0.35)]"
                              : "bg-white"
                          }`}
                        >
                          <input
                            type="radio"
                            name="selected-vehicle"
                            value={vehicle.id}
                            checked={String(vehicle.id) === selectedVehicleId}
                            onChange={(event) => setSelectedVehicleId(event.target.value)}
                            className="mt-1 h-4 w-4 border-[rgba(22,36,58,0.2)] text-[var(--accent)]"
                          />
                          <span className="font-semibold text-[var(--ink)]">
                            {[vehicle.manufacturer, vehicle.model].filter(Boolean).join(" ") || t(locale, "Vehicle")}
                          </span>
                          <span className="text-[var(--ink)]">{vehicle.registrationNumber}</span>
                          <span className="text-[var(--muted)]">{vehicle.manufacturer || "-"}</span>
                          <span className="text-[var(--muted)]">{vehicle.model || "-"}</span>
                          <span className="text-[var(--muted)]">{vehicle.fiscalPower} CV</span>
                          <span
                            className={`inline-flex w-fit rounded-full px-3 py-1 text-xs font-semibold ${
                              vehicle.isVerified
                                ? "bg-[rgba(31,183,166,0.12)] text-[var(--accent-2)]"
                                : "bg-[rgba(22,36,58,0.08)] text-[var(--muted)]"
                            }`}
                          >
                            {vehicle.isVerified ? t(locale, "Approved") : t(locale, "Pending review")}
                          </span>
                          <button
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation();
                              handleDeleteWorkspaceItem("vehicle", vehicle.id);
                            }}
                            className="rounded-full border border-[rgba(234,111,81,0.18)] px-3 py-2 text-xs font-semibold text-[var(--danger)] transition duration-200 ease-out hover:scale-[1.03] hover:bg-[rgba(234,111,81,0.08)]"
                          >
                            {t(locale, "Delete")}
                          </button>
                        </div>
                      ))}
                    </fieldset>
                  </div>
                ) : (
                  <div className="grid gap-5 md:grid-cols-2">
                    <label className={fieldLabelClass}>
                      {t(locale, "Registration number")}
                      <input
                        value={vehicleForm.registrationNumber}
                        onChange={(event) => updateVehicleField("registrationNumber", event.target.value)}
                        className={`${fieldClass} uppercase`}
                      />
                    </label>

                    <label className={fieldLabelClass}>
                      {t(locale, "Fiscal power (CV)")}
                      <select
                        value={vehicleForm.fiscalPower}
                        onChange={(event) => updateVehicleField("fiscalPower", event.target.value)}
                        className={fieldClass}
                      >
                        {vehicleFiscalPowerOptions.map((value) => (
                          <option key={value} value={value}>
                            {value} CV
                          </option>
                        ))}
                      </select>
                    </label>

                    <label className={fieldLabelClass}>
                      {t(locale, "Manufacturer")}
                      <input
                        value={vehicleForm.manufacturer}
                        onChange={(event) => updateVehicleField("manufacturer", event.target.value)}
                        className={fieldClass}
                      />
                    </label>

                    <label className={fieldLabelClass}>
                      {t(locale, "Model")}
                      <input
                        value={vehicleForm.model}
                        onChange={(event) => updateVehicleField("model", event.target.value)}
                        className={fieldClass}
                      />
                    </label>
                  </div>
                )}
              </>
            )}
          </div>
        ) : null}

        {step === "driver" ? (
          <div className="mt-8 space-y-6">
            {workspace?.drivers.length ? (
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => setDriverMode("existing")}
                  className={`${toggleButtonClass} ${
                    driverMode === "existing"
                      ? "bg-[var(--accent)] text-[var(--ink)] shadow-[0_10px_20px_rgba(255,179,71,0.22)]"
                      : "bg-[var(--surface-2)] text-[var(--muted)] hover:bg-[rgba(22,36,58,0.08)]"
                  }`}
                >
                  {t(locale, "Choose saved driver")}
                </button>
                <button
                  type="button"
                  onClick={() => setDriverMode("new")}
                  className={`${toggleButtonClass} ${
                    driverMode === "new"
                      ? "bg-[var(--accent)] text-[var(--ink)] shadow-[0_10px_20px_rgba(255,179,71,0.22)]"
                      : "bg-[var(--surface-2)] text-[var(--muted)] hover:bg-[rgba(22,36,58,0.08)]"
                  }`}
                >
                  {t(locale, "Create new driver")}
                </button>
              </div>
            ) : null}

            {driverMode === "existing" && workspace?.drivers.length ? (
              <div className="overflow-hidden rounded-[24px] border border-[rgba(22,36,58,0.08)] bg-white">
                <div className="grid grid-cols-[44px_1.2fr_110px_1fr_130px_110px_120px_88px] gap-3 border-b border-[rgba(22,36,58,0.08)] bg-[var(--surface-2)] px-4 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
                  <span />
                  <span>{t(locale, "Name")}</span>
                  <span>{t(locale, "Birthday")}</span>
                  <span>{t(locale, "License no.")}</span>
                  <span>{t(locale, "Expiry date")}</span>
                  <span>{t(locale, "Country")}</span>
                  <span>{t(locale, "Review")}</span>
                  <span>{t(locale, "Action")}</span>
                </div>
                <fieldset>
                  {workspace.drivers.map((driver) => (
                    <div
                      key={driver.id}
                      onClick={() => setSelectedDriverId(String(driver.id))}
                      className={`grid grid-cols-[44px_1.2fr_110px_1fr_130px_110px_120px_88px] items-center gap-3 border-b border-[rgba(22,36,58,0.08)] px-4 py-4 text-sm transition duration-200 ease-out last:border-b-0 hover:bg-[rgba(255,179,71,0.1)] ${
                        String(driver.id) === selectedDriverId
                          ? "bg-[rgba(249,208,127,0.2)] shadow-[inset_0_0_0_1px_rgba(255,179,71,0.35)]"
                          : "bg-white"
                      }`}
                    >
                      <input
                        type="radio"
                        name="selected-driver"
                        value={driver.id}
                        checked={String(driver.id) === selectedDriverId}
                        onChange={(event) => setSelectedDriverId(event.target.value)}
                        className="mt-1 h-4 w-4 border-[rgba(22,36,58,0.2)] text-[var(--accent)]"
                      />
                      <span className="font-semibold text-[var(--ink)]">
                        {driver.firstName} {driver.lastName}
                      </span>
                      <span className="text-[var(--muted)]">{formatDateCell(driver.birthday, locale)}</span>
                      <span className="text-[var(--muted)]">{driver.licenseNumber || "-"}</span>
                      <span className="text-[var(--muted)]">
                        {driver.licenseExpiryDate || "-"}
                      </span>
                      <span className="text-[var(--muted)]">{driver.licenseCountryCode}</span>
                      <span
                        className={`inline-flex w-fit rounded-full px-3 py-1 text-xs font-semibold ${
                          driver.isVerified
                            ? "bg-[rgba(31,183,166,0.12)] text-[var(--accent-2)]"
                            : "bg-[rgba(22,36,58,0.08)] text-[var(--muted)]"
                        }`}
                      >
                        {driver.isVerified ? t(locale, "Approved") : t(locale, "Pending review")}
                      </span>
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          handleDeleteWorkspaceItem("driver", driver.id);
                        }}
                        className="rounded-full border border-[rgba(234,111,81,0.18)] px-3 py-2 text-xs font-semibold text-[var(--danger)] transition duration-200 ease-out hover:scale-[1.03] hover:bg-[rgba(234,111,81,0.08)]"
                      >
                        {t(locale, "Delete")}
                      </button>
                    </div>
                  ))}
                </fieldset>
              </div>
            ) : (
              <div className="grid gap-5 md:grid-cols-2">
                <label className={fieldLabelClass}>
                  {t(locale, "First name")}
                  <input
                    value={driverForm.firstName}
                    onChange={(event) => updateDriverField("firstName", event.target.value)}
                    className={fieldClass}
                  />
                </label>

                <label className={fieldLabelClass}>
                  {t(locale, "Last name")}
                  <input
                    value={driverForm.lastName}
                    onChange={(event) => updateDriverField("lastName", event.target.value)}
                    className={fieldClass}
                  />
                </label>

                <label className={fieldLabelClass}>
                  {t(locale, "Birthday")}
                  <input
                    type="date"
                    value={driverForm.birthday}
                    onChange={(event) => updateDriverField("birthday", event.target.value)}
                    className={fieldClass}
                  />
                </label>

                <label className={fieldLabelClass}>
                  {t(locale, "License number")}
                  <input
                    value={driverForm.licenseNumber}
                    onChange={(event) => updateDriverField("licenseNumber", event.target.value)}
                    className={fieldClass}
                  />
                </label>

                <label className={fieldLabelClass}>
                  {t(locale, "Email")}
                  <input
                    type="email"
                    value={driverForm.email}
                    onChange={(event) => updateDriverField("email", event.target.value)}
                    className={fieldClass}
                  />
                </label>

                <label className={fieldLabelClass}>
                  {t(locale, "Phone")}
                  <input
                    value={driverForm.phone}
                    onChange={(event) => updateDriverField("phone", event.target.value)}
                    className={fieldClass}
                  />
                </label>

                <label className={fieldLabelClass}>
                  {t(locale, "License expiry date")}
                  <input
                    type="date"
                    value={driverForm.licenseExpiryDate}
                    onChange={(event) => updateDriverField("licenseExpiryDate", event.target.value)}
                    className={fieldClass}
                  />
                </label>

                <label className={fieldLabelClass}>
                  {t(locale, "License country")}
                  <input
                    value={driverForm.licenseCountryCode}
                    onChange={(event) => updateDriverField("licenseCountryCode", event.target.value)}
                    className={`${fieldClass} uppercase`}
                  />
                </label>
              </div>
            )}
          </div>
        ) : null}

        {step === "payment" && preview ? (
          <div className="mt-8 space-y-4">
            <div className="rounded-[28px] bg-[var(--surface-2)] p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
                {t(locale, "Order recap")}
              </p>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div className="rounded-[24px] bg-white p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
                    {t(locale, "Product")}
                  </p>
                  <p className="mt-3 text-sm text-[var(--ink)]">{preview.productName}</p>
                  <p className="mt-1 text-sm text-[var(--muted)]">
                    {preview.durationDays} {t(locale, preview.durationDays > 1 ? "days" : "day")} · {preview.fiscalPower} CV
                  </p>
                  <p className="mt-1 text-sm text-[var(--muted)]">
                    {t(locale, "Starts")}: {formatCoverageDate(new Date(preview.coverageStartAt), locale)}
                  </p>
                  <p className="mt-1 text-sm text-[var(--muted)]">
                    {t(locale, "Ends")}: {formatCoverageDate(new Date(preview.coverageEndAt), locale)}
                  </p>
                </div>

                <div className="rounded-[24px] bg-white p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
                    {t(locale, "Customer")}
                  </p>
                  <p className="mt-3 text-sm text-[var(--ink)]">
                    {workspace?.customer.firstName} {workspace?.customer.lastName}
                  </p>
                  <p className="mt-1 text-sm text-[var(--muted)]">{workspace?.customer.email}</p>
                </div>

                <div className="rounded-[24px] bg-white p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
                    {t(locale, "Vehicle")}
                  </p>
                  <p className="mt-3 text-sm text-[var(--ink)]">
                    {summaryVehicle.registrationNumber || t(locale, "New vehicle")}
                  </p>
                  <p className="mt-1 text-sm text-[var(--muted)]">
                    {summaryVehicle.manufacturer} {summaryVehicle.model} · {summaryVehicle.fiscalPower} CV
                  </p>
                </div>

                <div className="rounded-[24px] bg-white p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
                    {t(locale, "Driver")}
                  </p>
                  <p className="mt-3 text-sm text-[var(--ink)]">
                    {summaryDriver.firstName} {summaryDriver.lastName}
                  </p>
                  <p className="mt-1 text-sm text-[var(--muted)]">
                    {summaryDriver.email || workspace?.customer.email || t(locale, "Email pending")}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-[28px] bg-[var(--surface-2)] p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
                {t(locale, "Overview")}
              </p>
              <h2 className="mt-3 text-2xl font-semibold text-[var(--ink)]">
                {t(locale, "Confirm the order details before payment.")}
              </h2>
              <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                {t(locale, "For the local flow we skip the real PSP and mark the payment as succeeded immediately. The order then moves into the mandatory manual review step.")}
              </p>
              <p className="mt-5 text-lg font-semibold text-[var(--ink)]">
                {t(locale, "Amount due")}: {preview.totalPremium} {preview.currency}
              </p>
            </div>
          </div>
        ) : null}

        {step === "review" && result ? (
          <div className="mt-8 rounded-[28px] border border-[rgba(31,183,166,0.18)] bg-[rgba(31,183,166,0.08)] p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent-2)]">
              {t(locale, "Manual review")}
            </p>
            <h2 className="mt-3 text-2xl font-semibold text-[var(--ink)]">
              {t(locale, "The order has passed the required human review step.")}
            </h2>
            <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
              {t(locale, "This insurance product must be checked by a human reviewer before coverage. In the local demo, the review is approved automatically after payment so the flow can keep moving.")}
            </p>
            <div className="mt-5 grid gap-3 text-sm text-[var(--ink)]">
              <p>{t(locale, "Payment status")}: {t(locale, result.payment.status)}</p>
              <p>{t(locale, "Review status")}: {t(locale, result.review.status)}</p>
              <p>{t(locale, "Decision")}: {t(locale, result.review.decisionReason)}</p>
            </div>
          </div>
        ) : null}

        {step === "success" && result ? (
          <div className="mt-8 space-y-4">
            <div className="rounded-[28px] border border-[rgba(22,36,58,0.08)] bg-[rgba(255,255,255,0.92)] p-6">
              <p className="eyebrow">{t(locale, "Covered")}</p>
              <h2 className="mt-3 text-2xl font-semibold text-[var(--ink)]">
                {result.order.orderNumber}
              </h2>
              <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                {t(locale, "The order is approved. Contract email delivery is the next milestone; for now, the customer can already go to Orders to review the record and the cover window.")}
              </p>
              <div className="mt-4 grid gap-3 text-sm text-[var(--ink)] md:grid-cols-2">
                <p>{t(locale, "Quote")}: {result.quote.quoteNumber}</p>
                <p>{t(locale, "Status")}: {t(locale, result.order.status)}</p>
                <p>{t(locale, "Review")}: {t(locale, result.order.adminReviewStatus)}</p>
                <p>{t(locale, "Payment")}: {t(locale, result.payment.status)}</p>
                <p>
                  {t(locale, "Premium")}: {result.summary.totalPremium} {result.summary.currency}
                </p>
                <p>{t(locale, "Coverage start")}: {formatCoverageDate(new Date(result.summary.coverageStartAt), locale)}</p>
                <p>{t(locale, "Coverage end")}: {formatCoverageDate(new Date(result.summary.coverageEndAt), locale)}</p>
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href={localizePath("/account/orders", locale)}
                  className={`${primaryButtonClass} inline-flex items-center justify-center`}
                >
                  {t(locale, "Go to orders")}
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setResult(null);
                    setPreview(null);
                    setStep("price");
                    router.replace(buildQuoteHref("price"));
                  }}
                  className={secondaryButtonClass}
                >
                  {t(locale, "Start another quote")}
                </button>
              </div>
            </div>
          </div>
        ) : null}

        {error ? (
          <p className="mt-6 rounded-2xl border border-[rgba(234,111,81,0.2)] bg-[rgba(234,111,81,0.08)] px-4 py-3 text-sm text-[var(--danger)]">
            {error}
          </p>
        ) : null}

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {step !== "price" && step !== "success" ? (
            <button
              type="button"
              onClick={moveBack}
              className={secondaryButtonClass}
            >
              {t(locale, "Back")}
            </button>
          ) : null}

          {step === "price" ? (
            <>
              <button
                type="button"
                disabled={!preview || isPreviewPending}
                onClick={() => {
                  if (!workspace) {
                    redirectToAuth("vehicle");
                    return;
                  }

                  setStep("vehicle");
                  router.replace(buildQuoteHref("vehicle"));
                }}
                className={primaryButtonClass}
              >
                {t(locale, "Confirm insurance")}
              </button>
            </>
          ) : null}

          {step === "vehicle" ? (
            <button
              type="button"
              disabled={isPending}
              onClick={handleVehicleContinue}
              className={primaryButtonClass}
            >
              {isPending ? t(locale, "Refreshing price...") : t(locale, "Confirm vehicle")}
            </button>
          ) : null}

          {step === "driver" ? (
            <button
              type="button"
              onClick={handleDriverContinue}
              className={primaryButtonClass}
            >
              {t(locale, "Confirm driver")}
            </button>
          ) : null}

          {step === "payment" ? (
            <button
              type="button"
              disabled={isPending}
              onClick={handleLocalPayment}
              className={primaryButtonClass}
            >
              {isPending ? t(locale, "Processing payment...") : t(locale, "Pay locally")}
            </button>
          ) : null}

          {step === "review" ? (
            <button
              type="button"
              onClick={() => {
                setStep("success");
                router.replace(buildQuoteHref("success"));
              }}
              className={primaryButtonClass}
            >
              {t(locale, "Continue to covered")}
            </button>
          ) : null}

        </div>
      </div>
    </div>
  );
}
