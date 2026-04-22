type DirectusCollectionResponse<T> = {
  data: T[];
};

type DirectusItemResponse<T> = {
  data: T;
};

interface InsuranceProductRecord {
  id: number;
  code: string;
  name: string;
  description?: string | null;
  min_duration_days?: number | null;
  max_duration_days?: number | null;
  requires_admin_review?: boolean | null;
  status: string;
}

interface GeoZoneRecord {
  id: number;
  code: string;
  name: string;
}

interface PricingRuleRecord {
  id: number;
  duration_days: number;
  base_premium: string;
  min_fiscal_power?: number | null;
  max_fiscal_power?: number | null;
  priority?: number | null;
  requires_manual_quote?: boolean | null;
}

interface CustomerRecord {
  id: number;
  email: string;
  first_name?: string | null;
  last_name?: string | null;
  phone?: string | null;
  account_status?: string | null;
  customer_type?: string | null;
  preferred_language?: string | null;
  directus_user?: string | null;
}

interface VehicleRecord {
  id: number;
  customer: number;
  registration_number: string;
  manufacturer?: string | null;
  model?: string | null;
  fiscal_power?: number | null;
  vehicle_category: string;
  usage_type: string;
  is_active?: boolean | null;
  is_verified?: boolean | null;
}

interface DriverRecord {
  id: number;
  customer: number;
  first_name: string;
  last_name: string;
  birthday?: string | null;
  email?: string | null;
  phone?: string | null;
  license_number?: string | null;
  license_country_code?: string | null;
  license_issue_date?: string | null;
  is_active?: boolean | null;
  is_verified?: boolean | null;
}

interface QuoteRecord {
  id: number;
  quote_number: string;
  status: string;
  coverage_start_at: string;
  coverage_end_at: string;
  duration_days: number;
  total_premium: string;
  currency: string;
}

interface OrderRecord {
  id: number;
  customer?: number;
  product?: number;
  vehicle?: number;
  driver?: number;
  order_number: string;
  status: string;
  coverage_start_at: string;
  coverage_end_at: string;
  total_amount: string;
  premium_amount?: string | null;
  currency: string;
  paid_at?: string | null;
  admin_review_status?: string | null;
}

interface PolicyRecord {
  id: number;
  order: number;
  customer?: number | null;
  product?: number | null;
  vehicle?: number | null;
  driver?: number | null;
  coverage_start_at?: string | null;
  coverage_end_at?: string | null;
  premium_amount?: string | null;
  total_amount?: string | null;
  currency?: string | null;
  status?: string | null;
  issued_at?: string | null;
  pdf_file?: string | null;
  pdf_generated_at?: string | null;
}

interface PaymentRecord {
  id: number;
  amount: string;
  currency: string;
  status: string;
  payment_provider: string;
  paid_at?: string | null;
}

interface AdminReviewRecord {
  id: number;
  review_type: string;
  status: string;
  reviewed_at?: string | null;
  decision_reason?: string | null;
}

interface DirectusUserRecord {
  id: string;
}

interface DirectusFileRecord {
  id: string;
  title?: string | null;
  filename_download?: string | null;
  type?: string | null;
}

interface DirectusFileItemResponse {
  data: DirectusFileRecord;
}

export interface QuoteProductOption {
  code: string;
  name: string;
  description?: string | null;
  minDurationDays?: number | null;
  maxDurationDays?: number | null;
}

export interface CreateOrderInput {
  productCode: string;
  customerFirstName: string;
  customerLastName: string;
  email: string;
  phone?: string;
  registrationNumber: string;
  fiscalPower: number;
  manufacturer?: string;
  model?: string;
  coverageStartAt: string;
  durationDays: number;
}

export interface CreatedOrderSummary {
  customerId: number;
  vehicleId: number;
  driverId: number;
  quoteId: number;
  quoteNumber: string;
  orderId: number;
  orderNumber: string;
  totalPremium: string;
  currency: string;
  coverageEndAt: string;
}

export interface CustomerWorkspaceVehicle {
  id: number;
  registrationNumber: string;
  manufacturer: string;
  model: string;
  fiscalPower: number;
  vehicleCategory: string;
  isVerified: boolean;
}

export interface CustomerWorkspaceDriver {
  id: number;
  firstName: string;
  lastName: string;
  birthday: string;
  email: string;
  phone: string;
  licenseNumber: string;
  licenseExpiryDate: string;
  licenseCountryCode: string;
  isVerified: boolean;
}

export interface CustomerWorkspaceOrder {
  id: number;
  orderNumber: string;
  status: string;
  adminReviewStatus: string;
  totalAmount: string;
  currency: string;
  coverageStartAt: string;
  coverageEndAt: string;
  paidAt?: string | null;
  contractFileUrl?: string;
}

export interface WorkspaceReviewItem {
  id: number;
  kind: "vehicle" | "driver";
  ownerEmail: string;
  title: string;
  detail: string;
  isVerified: boolean;
}

export interface CustomerWorkspace {
  customer: {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
    accountStatus: string;
    customerType: string;
    preferredLanguage: string;
    directusUserId: string;
  };
  vehicles: CustomerWorkspaceVehicle[];
  drivers: CustomerWorkspaceDriver[];
  recentOrders: CustomerWorkspaceOrder[];
}

export interface ContinueCustomerInput {
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  customerType?: string;
  preferredLanguage?: string;
  directusUserId?: string;
}

export interface CreateWorkspaceVehicleInput {
  registrationNumber: string;
  manufacturer?: string;
  model?: string;
  fiscalPower: number;
}

export interface CreateWorkspaceDriverInput {
  firstName: string;
  lastName: string;
  birthday?: string;
  email?: string;
  phone?: string;
  licenseNumber?: string;
  licenseCountryCode?: string;
}

export interface QuotePreviewInput {
  productCode: string;
  durationDays: number;
  coverageStartAt: string;
  fiscalPower: number;
}

export interface QuotePreview {
  productCode: string;
  productName: string;
  durationDays: number;
  fiscalPower: number;
  totalPremium: string;
  currency: string;
  coverageStartAt: string;
  coverageEndAt: string;
  requiresAdminReview: boolean;
}

export interface ProductPricingOptions {
  productCode: string;
  durationOptions: number[];
  fiscalPowerOptionsByDuration: Record<string, number[]>;
}

export interface CheckoutVehicleInput {
  vehicleId?: number;
  registrationNumber?: string;
  manufacturer?: string;
  model?: string;
  fiscalPower?: number;
}

export interface CheckoutDriverInput {
  driverId?: number;
  firstName?: string;
  lastName?: string;
  birthday?: string;
  email?: string;
  phone?: string;
  licenseNumber?: string;
  licenseExpiryDate?: string;
  licenseCountryCode?: string;
}

export interface CompleteCheckoutInput {
  customer: ContinueCustomerInput;
  productCode: string;
  durationDays: number;
  coverageStartAt: string;
  vehicle: CheckoutVehicleInput;
  driver: CheckoutDriverInput;
}

export interface CompleteCheckoutResult {
  customer: CustomerWorkspace["customer"];
  vehicle: CustomerWorkspaceVehicle;
  driver: CustomerWorkspaceDriver;
  quote: {
    id: number;
    quoteNumber: string;
    status: string;
  };
  order: {
    id: number;
    orderNumber: string;
    status: string;
    adminReviewStatus: string;
  };
  payment: {
    id: number;
    status: string;
    amount: string;
    currency: string;
    provider: string;
    paidAt?: string | null;
  };
  review: {
    id: number;
    status: string;
    reviewType: string;
    reviewedAt?: string | null;
    decisionReason: string;
  };
  summary: QuotePreview;
  recentOrders: CustomerWorkspaceOrder[];
}

const directusInternalUrl =
  process.env.DIRECTUS_INTERNAL_URL?.replace(/\/$/, "") ??
  process.env.NEXT_PUBLIC_DIRECTUS_URL?.replace(/\/$/, "") ??
  "http://localhost:8088/directus";
const directusStaticToken = process.env.DIRECTUS_TOKEN ?? process.env.ADMIN_TOKEN;
const directusAdminEmail = process.env.DIRECTUS_ADMIN_EMAIL;
const directusAdminPassword = process.env.DIRECTUS_ADMIN_PASSWORD;
const defaultGeoZoneCode =
  process.env.DIRECTUS_DEFAULT_GEO_ZONE_CODE ?? "FRANCE_METROPOLE";
const publicDirectusUrl =
  process.env.NEXT_PUBLIC_DIRECTUS_URL?.replace(/\/$/, "") ??
  process.env.DIRECTUS_PUBLIC_URL?.replace(/\/$/, "") ??
  directusInternalUrl;

function normalizeCoverageStartAt(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    throw new Error("Invalid coverage start date.");
  }

  return date.toISOString();
}

function normalizeEmail(value: string): string {
  return value.trim().toLowerCase();
}

function normalizeText(value?: string | null): string {
  return value?.trim() ?? "";
}

function assertAdminConfig(): void {
  if (!directusAdminEmail || !directusAdminPassword) {
    throw new Error("Missing Directus admin credentials in frontend runtime env.");
  }
}

async function directusLogin(): Promise<string> {
  assertAdminConfig();

  const response = await fetch(`${directusInternalUrl}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: directusAdminEmail,
      password: directusAdminPassword,
    }),
    cache: "no-store",
  });

  const payload = (await response.json()) as {
    data?: {
      access_token?: string;
    };
    errors?: Array<{ message?: string }>;
  };

  if (!response.ok || !payload.data?.access_token) {
    const message = payload.errors?.[0]?.message ?? "Unable to authenticate with Directus.";
    throw new Error(message);
  }

  return payload.data.access_token;
}

async function directusRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const token = directusStaticToken || (await directusLogin());

  let response = await fetch(`${directusInternalUrl}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });

  if ((response.status === 401 || response.status === 403) && directusStaticToken) {
    const refreshedToken = await directusLogin();
    response = await fetch(`${directusInternalUrl}${path}`, {
      ...init,
      headers: {
        Authorization: `Bearer ${refreshedToken}`,
        "Content-Type": "application/json",
        ...(init?.headers ?? {}),
      },
      cache: "no-store",
    });
  }

  const payload = (await response.json()) as T & {
    errors?: Array<{ message?: string }>;
  };

  if (!response.ok) {
    const message =
      payload.errors?.[0]?.message ?? `Directus request failed with status ${response.status}.`;
    throw new Error(message);
  }

  return payload;
}

function buildQuery(params: Record<string, string>): string {
  const search = new URLSearchParams(params);
  return `?${search.toString()}`;
}

function formatSequenceNumber(prefix: string): string {
  const now = new Date();
  const stamp = [
    now.getUTCFullYear(),
    String(now.getUTCMonth() + 1).padStart(2, "0"),
    String(now.getUTCDate()).padStart(2, "0"),
    String(now.getUTCHours()).padStart(2, "0"),
    String(now.getUTCMinutes()).padStart(2, "0"),
    String(now.getUTCSeconds()).padStart(2, "0"),
  ].join("");

  const random = Math.floor(Math.random() * 9000 + 1000);
  return `${prefix}-${stamp}-${random}`;
}

function addDays(startAt: string, durationDays: number): string {
  const date = new Date(startAt);
  date.setUTCDate(date.getUTCDate() + durationDays);
  return date.toISOString();
}

function normalizeRegistrationNumber(value: string): string {
  return value.trim().toUpperCase().replace(/\s+/g, "-");
}

function asCurrencyString(value: string | number): string {
  return Number(value).toFixed(2);
}

function formatDisplayDate(value?: string | null): string {
  if (!value) {
    return "-";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleString("fr-FR", {
    timeZone: "UTC",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function buildContractAssetUrl(fileId: string): string {
  return `${publicDirectusUrl}/assets/${fileId}?download`;
}

function escapePdfText(value: string): string {
  return value.replaceAll("\\", "\\\\").replaceAll("(", "\\(").replaceAll(")", "\\)");
}

function buildContractPdfTemplate(input: {
  order: OrderRecord;
  customer: CustomerRecord;
  vehicle: VehicleRecord;
  driver: DriverRecord;
  productName: string;
}): ArrayBuffer {
  const { order, customer, vehicle, driver, productName } = input;
  const lines = [
    "Attestation provisoire (demo)",
    `Commande: ${order.order_number}`,
    `Produit: ${productName}`,
    "",
    `Statut: ${order.status}`,
    `Debut couverture: ${formatDisplayDate(order.coverage_start_at)}`,
    `Fin couverture: ${formatDisplayDate(order.coverage_end_at)}`,
    `Montant total: ${asCurrencyString(order.total_amount)} ${order.currency}`,
    `Paye le: ${formatDisplayDate(order.paid_at)}`,
    "",
    "Vehicule",
    `Immatriculation: ${vehicle.registration_number}`,
    `Constructeur/modele: ${`${normalizeText(vehicle.manufacturer)} ${normalizeText(vehicle.model)}`.trim() || "-"}`,
    `Categorie: ${vehicle.vehicle_category}`,
    "",
    "Conducteur",
    `Nom: ${driver.first_name} ${driver.last_name}`,
    `Email: ${normalizeText(driver.email) || customer.email}`,
    `Telephone: ${normalizeText(driver.phone) || normalizeText(customer.phone) || "-"}`,
    `Pays du permis: ${normalizeText(driver.license_country_code) || "-"}`,
    "",
    "Document genere automatiquement pour la phase de demonstration.",
  ];

  const contentOps = [
    "BT",
    "/F1 12 Tf",
    "50 800 Td",
    "14 TL",
    ...lines.map((line, index) =>
      index === 0 ? `(${escapePdfText(line)}) Tj` : `T* (${escapePdfText(line)}) Tj`,
    ),
    "ET",
  ].join("\n");

  const stream = `${contentOps}\n`;
  const objects = [
    "1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n",
    "2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n",
    "3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>\nendobj\n",
    "4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n",
    `5 0 obj\n<< /Length ${Buffer.byteLength(stream, "utf8")} >>\nstream\n${stream}endstream\nendobj\n`,
  ];

  let pdf = "%PDF-1.4\n";
  const offsets: number[] = [0];
  for (const object of objects) {
    offsets.push(Buffer.byteLength(pdf, "utf8"));
    pdf += object;
  }

  const xrefOffset = Buffer.byteLength(pdf, "utf8");
  pdf += `xref\n0 ${objects.length + 1}\n`;
  pdf += "0000000000 65535 f \n";
  for (let i = 1; i <= objects.length; i += 1) {
    pdf += `${offsets[i].toString().padStart(10, "0")} 00000 n \n`;
  }
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;

  return new TextEncoder().encode(pdf).buffer;
}

async function getDirectusAccessToken(): Promise<string> {
  return directusStaticToken || directusLogin();
}

async function uploadContractTemplateFile(
  filename: string,
  content: string | ArrayBuffer,
  mimeType: string,
): Promise<string> {
  const formData = new FormData();
  formData.append("title", filename);
  formData.append("filename_download", filename);
  formData.append("type", mimeType);
  formData.append("file", new Blob([content], { type: mimeType }), filename);

  const token = await getDirectusAccessToken();
  let response = await fetch(`${directusInternalUrl}/files`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
    cache: "no-store",
  });

  if ((response.status === 401 || response.status === 403) && directusStaticToken) {
    const refreshedToken = await directusLogin();
    response = await fetch(`${directusInternalUrl}/files`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${refreshedToken}`,
      },
      body: formData,
      cache: "no-store",
    });
  }

  const payload = (await response.json()) as {
    data?: { id?: string };
    errors?: Array<{ message?: string }>;
  };

  if (!response.ok || !payload.data?.id) {
    const message = payload.errors?.[0]?.message ?? "Unable to upload contract file.";
    throw new Error(message);
  }

  return payload.data.id;
}

function requirePositiveInteger(value: number | undefined, label: string): number {
  if (typeof value !== "number" || !Number.isInteger(value) || value <= 0) {
    throw new Error(`Invalid ${label}.`);
  }

  return value;
}

function getVehicleCategory(productCode: string): string {
  const vehicleCategoryMap: Record<string, string> = {
    AUTOMOBILE: "automobile",
    UTILITAIRE: "utilitaire",
    POIDS_LOURDS: "poids_lourds",
    AUTOCAR_BUS: "autocar_bus",
    CAMPING_CAR: "camping_car",
    REMORQUE: "remorque",
  };

  return vehicleCategoryMap[productCode] ?? "automobile";
}

function mapCustomerWorkspace(customer: CustomerRecord): CustomerWorkspace["customer"] {
  return {
    id: customer.id,
    email: customer.email,
    firstName: normalizeText(customer.first_name),
    lastName: normalizeText(customer.last_name),
    phone: normalizeText(customer.phone),
    accountStatus: normalizeText(customer.account_status) || "lead",
    customerType: normalizeText(customer.customer_type) || "individual",
    preferredLanguage: normalizeText(customer.preferred_language) || "fr-FR",
    directusUserId: normalizeText(customer.directus_user),
  };
}

function mapVehicleRecord(vehicle: VehicleRecord): CustomerWorkspaceVehicle {
  return {
    id: vehicle.id,
    registrationNumber: vehicle.registration_number,
    manufacturer: normalizeText(vehicle.manufacturer),
    model: normalizeText(vehicle.model),
    fiscalPower: vehicle.fiscal_power ?? 0,
    vehicleCategory: vehicle.vehicle_category,
    isVerified: Boolean(vehicle.is_verified),
  };
}

function mapDriverRecord(driver: DriverRecord): CustomerWorkspaceDriver {
  return {
    id: driver.id,
    firstName: driver.first_name,
    lastName: driver.last_name,
    birthday: normalizeText(driver.birthday),
    email: normalizeText(driver.email),
    phone: normalizeText(driver.phone),
    licenseNumber: normalizeText(driver.license_number),
    licenseExpiryDate: "",
    licenseCountryCode: normalizeText(driver.license_country_code) || "FR",
    isVerified: Boolean(driver.is_verified),
  };
}

function mapOrderRecord(order: OrderRecord): CustomerWorkspaceOrder {
  return {
    id: order.id,
    orderNumber: order.order_number,
    status: order.status,
    adminReviewStatus: normalizeText(order.admin_review_status),
    totalAmount: asCurrencyString(order.total_amount),
    currency: order.currency,
    coverageStartAt: order.coverage_start_at,
    coverageEndAt: order.coverage_end_at,
    paidAt: order.paid_at,
  };
}

function buildPolicyNumber(orderNumber: string): string {
  return orderNumber.replace(/^ORD-/, "POL-");
}

async function mapContractLinksByOrderId(orderIds: number[]): Promise<Map<number, string>> {
  if (!orderIds.length) {
    return new Map();
  }

  const payload = await directusRequest<DirectusCollectionResponse<PolicyRecord>>(
    `/items/policies${buildQuery({
      fields: "id,order,pdf_file,pdf_generated_at",
      "filter[order][_in]": orderIds.join(","),
      sort: "-id",
      limit: "200",
    })}`,
  );

  const linksByOrderId = new Map<number, string>();

  for (const policy of payload.data) {
    if (linksByOrderId.has(policy.order)) {
      continue;
    }

    const fileId = normalizeText(policy.pdf_file);
    if (fileId) {
      linksByOrderId.set(policy.order, buildContractAssetUrl(fileId));
    }
  }

  return linksByOrderId;
}

async function getOrderByIdForCustomer(
  orderId: number,
  customerId: number,
): Promise<OrderRecord | null> {
  const payload = await directusRequest<DirectusCollectionResponse<OrderRecord>>(
    `/items/orders${buildQuery({
      fields:
        "id,order_number,status,coverage_start_at,coverage_end_at,total_amount,premium_amount,currency,paid_at,admin_review_status,customer,product,vehicle,driver",
      "filter[id][_eq]": String(orderId),
      "filter[customer][_eq]": String(customerId),
      limit: "1",
    })}`,
  );

  return payload.data[0] ?? null;
}

async function getPolicyByOrderId(orderId: number): Promise<PolicyRecord | null> {
  const payload = await directusRequest<DirectusCollectionResponse<PolicyRecord>>(
    `/items/policies${buildQuery({
      fields:
        "id,order,customer,product,vehicle,driver,status,issued_at,coverage_start_at,coverage_end_at,premium_amount,total_amount,currency,pdf_file,pdf_generated_at",
      "filter[order][_eq]": String(orderId),
      sort: "-id",
      limit: "1",
    })}`,
  );

  return payload.data[0] ?? null;
}

async function getDirectusFileMeta(fileId: string): Promise<DirectusFileRecord> {
  const payload = await directusRequest<DirectusFileItemResponse>(
    `/files/${fileId}${buildQuery({ fields: "id,filename_download,type,title" })}`,
  );

  return payload.data;
}

async function isPdfAsset(fileId: string): Promise<boolean> {
  const fileMeta = await getDirectusFileMeta(fileId);
  const contentType = normalizeText(fileMeta.type).toLowerCase();
  const filename = normalizeText(fileMeta.filename_download || fileMeta.title).toLowerCase();

  return contentType.includes("pdf") || filename.endsWith(".pdf");
}

async function getRecordById<T>(
  collection: string,
  id: number,
  fields: string,
): Promise<T> {
  const payload = await directusRequest<DirectusItemResponse<T>>(
    `/items/${collection}/${id}${buildQuery({ fields })}`,
  );

  return payload.data;
}

async function ensurePolicyPdfForOrder(orderId: number, customerId: number): Promise<boolean> {
  const order = await getOrderByIdForCustomer(orderId, customerId);
  if (!order) {
    throw new Error("Order not found for this customer.");
  }

  let existingPolicy = await getPolicyByOrderId(order.id);
  const existingFileId = normalizeText(existingPolicy?.pdf_file);
  if (existingFileId && (await isPdfAsset(existingFileId))) {
    return false;
  }

  if (!order.vehicle || !order.driver || !order.product) {
    throw new Error("Order data is incomplete for PDF generation.");
  }

  const [customer, vehicle, driver, product] = await Promise.all([
    getRecordById<CustomerRecord>(
      "customers",
      customerId,
      "id,email,first_name,last_name,phone,account_status,customer_type,preferred_language,directus_user",
    ),
    getRecordById<VehicleRecord>(
      "vehicles",
      order.vehicle,
      "id,customer,registration_number,manufacturer,model,fiscal_power,vehicle_category,usage_type,is_active,is_verified",
    ),
    getRecordById<DriverRecord>(
      "drivers",
      order.driver,
      "id,customer,first_name,last_name,birthday,email,phone,license_number,license_country_code,license_issue_date,is_active,is_verified",
    ),
    getRecordById<InsuranceProductRecord>(
      "insurance_products",
      order.product,
      "id,code,name,status",
    ),
  ]);

  const pdfBytes = buildContractPdfTemplate({
    order,
    customer,
    vehicle,
    driver,
    productName: product.name,
  });
  const pdfFileId = await uploadContractTemplateFile(
    `${order.order_number.toLowerCase()}-contract.pdf`,
    pdfBytes,
    "application/pdf",
  );

  if (existingPolicy) {
    existingPolicy = await updateItem<PolicyRecord>("policies", existingPolicy.id, {
      pdf_file: pdfFileId,
      pdf_generated_at: new Date().toISOString(),
      document_version: "template-pdf-v1",
    });
  } else {
    await createItem<PolicyRecord>("policies", {
      policy_number: buildPolicyNumber(order.order_number),
      order: order.id,
      customer: customerId,
      product: order.product,
      vehicle: order.vehicle,
      driver: order.driver,
      status: "issued",
      issued_at: order.paid_at || new Date().toISOString(),
      coverage_start_at: order.coverage_start_at,
      coverage_end_at: order.coverage_end_at,
      premium_amount: order.premium_amount || order.total_amount,
      tax_amount: "0.00",
      total_amount: order.total_amount,
      currency: order.currency,
      circulation_countries: "FR",
      pdf_file: pdfFileId,
      pdf_generated_at: new Date().toISOString(),
      document_version: "template-pdf-v1",
    });
  }

  return true;
}

async function createItem<T>(collection: string, payload: Record<string, unknown>): Promise<T> {
  const response = await directusRequest<DirectusItemResponse<T>>(`/items/${collection}`, {
    method: "POST",
    body: JSON.stringify(payload),
  });

  return response.data;
}

async function updateItem<T>(
  collection: string,
  id: number | string,
  payload: Record<string, unknown>,
): Promise<T> {
  const response = await directusRequest<DirectusItemResponse<T>>(`/items/${collection}/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });

  return response.data;
}

async function softDeleteItem(
  collection: string,
  id: number | string,
): Promise<void> {
  await updateItem(collection, id, {
    is_active: false,
  });
}

export async function listOrderableProducts(): Promise<QuoteProductOption[]> {
  const payload = await directusRequest<DirectusCollectionResponse<InsuranceProductRecord>>(
    `/items/insurance_products${buildQuery({
      fields: "code,name,description,min_duration_days,max_duration_days,status",
      "filter[status][_eq]": "active",
      sort: "name",
    })}`,
  );

  return payload.data.map((item) => ({
    code: item.code,
    name: item.name,
    description: item.description,
    minDurationDays: item.min_duration_days,
    maxDurationDays: item.max_duration_days,
  }));
}

export async function listDirectusFiles(): Promise<DirectusFileRecord[]> {
  const payload = await directusRequest<DirectusCollectionResponse<DirectusFileRecord>>(
    `/files${buildQuery({
      fields: "id,title,filename_download,type",
      limit: "100",
      sort: "title",
    })}`,
  );

  return payload.data;
}

async function getActiveProductByCode(productCode: string): Promise<InsuranceProductRecord> {
  const payload = await directusRequest<DirectusCollectionResponse<InsuranceProductRecord>>(
    `/items/insurance_products${buildQuery({
      fields: "id,code,name,description,min_duration_days,max_duration_days,requires_admin_review,status",
      "filter[code][_eq]": productCode,
      "filter[status][_eq]": "active",
      limit: "1",
    })}`,
  );

  const product = payload.data[0];
  if (!product) {
    throw new Error("This insurance product is not currently available.");
  }

  return product;
}

async function getGeoZoneByCode(code: string): Promise<GeoZoneRecord> {
  const payload = await directusRequest<DirectusCollectionResponse<GeoZoneRecord>>(
    `/items/geo_zones${buildQuery({
      fields: "id,code,name",
      "filter[code][_eq]": code,
      limit: "1",
    })}`,
  );

  const geoZone = payload.data[0];
  if (!geoZone) {
    throw new Error(`Missing geo zone configuration for ${code}.`);
  }

  return geoZone;
}

async function findPricingRule(
  productId: number,
  geoZoneId: number,
  durationDays: number,
  fiscalPower: number,
): Promise<PricingRuleRecord> {
  const payload = await directusRequest<DirectusCollectionResponse<PricingRuleRecord>>(
    `/items/pricing_rules${buildQuery({
      fields: "id,duration_days,base_premium,min_fiscal_power,max_fiscal_power,priority,requires_manual_quote",
      "filter[product][_eq]": String(productId),
      "filter[geo_zone][_eq]": String(geoZoneId),
      "filter[duration_days][_eq]": String(durationDays),
      "filter[is_active][_eq]": "true",
      sort: "-priority,id",
      limit: "100",
    })}`,
  );

  const rule = payload.data.find((item) => {
    const min = item.min_fiscal_power ?? Number.NEGATIVE_INFINITY;
    const max = item.max_fiscal_power ?? Number.POSITIVE_INFINITY;
    return fiscalPower >= min && fiscalPower <= max;
  });

  if (!rule) {
    throw new Error("No pricing rule matches the selected duration and fiscal power.");
  }

  if (rule.requires_manual_quote) {
    throw new Error("This configuration currently requires a manual quote.");
  }

  return rule;
}

async function getCustomerByEmail(email: string): Promise<CustomerRecord | null> {
  const payload = await directusRequest<DirectusCollectionResponse<CustomerRecord>>(
    `/items/customers${buildQuery({
      fields:
        "id,email,first_name,last_name,phone,account_status,customer_type,preferred_language,directus_user",
      "filter[email][_eq]": normalizeEmail(email),
      limit: "1",
    })}`,
  );

  return payload.data[0] ?? null;
}

async function getVehiclesByCustomerId(customerId: number): Promise<CustomerWorkspaceVehicle[]> {
  const payload = await directusRequest<DirectusCollectionResponse<VehicleRecord>>(
    `/items/vehicles${buildQuery({
      fields: "id,customer,registration_number,manufacturer,model,fiscal_power,vehicle_category,usage_type,is_active,is_verified",
      "filter[customer][_eq]": String(customerId),
      sort: "-id",
      limit: "50",
    })}`,
  );

  return payload.data
    .filter((item) => item.is_active !== false)
    .map(mapVehicleRecord);
}

async function getDriversByCustomerId(customerId: number): Promise<CustomerWorkspaceDriver[]> {
  const payload = await directusRequest<DirectusCollectionResponse<DriverRecord>>(
    `/items/drivers${buildQuery({
      fields:
        "id,customer,first_name,last_name,birthday,email,phone,license_number,license_country_code,license_issue_date,is_active,is_verified",
      "filter[customer][_eq]": String(customerId),
      sort: "-id",
      limit: "50",
    })}`,
  );

  return payload.data
    .filter((item) => item.is_active !== false)
    .map(mapDriverRecord);
}

async function getCustomersByIds(customerIds: number[]): Promise<Map<number, CustomerRecord>> {
  if (customerIds.length === 0) {
    return new Map();
  }

  const payload = await directusRequest<DirectusCollectionResponse<CustomerRecord>>(
    `/items/customers${buildQuery({
      fields: "id,email,first_name,last_name,phone,account_status,customer_type,preferred_language,directus_user",
      "filter[id][_in]": customerIds.join(","),
      limit: "100",
    })}`,
  );

  return new Map(payload.data.map((customer) => [customer.id, customer]));
}

export async function listWorkspaceReviewItems(): Promise<WorkspaceReviewItem[]> {
  const [vehiclesPayload, driversPayload] = await Promise.all([
    directusRequest<DirectusCollectionResponse<VehicleRecord>>(
      `/items/vehicles${buildQuery({
        fields: "id,customer,registration_number,manufacturer,model,fiscal_power,vehicle_category,usage_type,is_active,is_verified",
        "filter[is_active][_neq]": "false",
        sort: "-id",
        limit: "100",
      })}`,
    ),
    directusRequest<DirectusCollectionResponse<DriverRecord>>(
      `/items/drivers${buildQuery({
        fields: "id,customer,first_name,last_name,birthday,email,phone,license_number,license_country_code,license_issue_date,is_active,is_verified",
        "filter[is_active][_neq]": "false",
        sort: "-id",
        limit: "100",
      })}`,
    ),
  ]);

  const vehicles = vehiclesPayload.data.filter((vehicle) => !vehicle.is_verified);
  const drivers = driversPayload.data.filter((driver) => !driver.is_verified);
  const customerIds = Array.from(
    new Set([...vehicles.map((vehicle) => vehicle.customer), ...drivers.map((driver) => driver.customer)]),
  );
  const customersById = await getCustomersByIds(customerIds);

  return [
    ...vehicles.map((vehicle): WorkspaceReviewItem => {
      const customer = customersById.get(vehicle.customer);
      const model = [normalizeText(vehicle.manufacturer), normalizeText(vehicle.model)]
        .filter(Boolean)
        .join(" ");

      return {
        id: vehicle.id,
        kind: "vehicle",
        ownerEmail: normalizeText(customer?.email),
        title: vehicle.registration_number,
        detail: model || vehicle.vehicle_category,
        isVerified: Boolean(vehicle.is_verified),
      };
    }),
    ...drivers.map((driver): WorkspaceReviewItem => {
      const customer = customersById.get(driver.customer);
      const name = [normalizeText(driver.first_name), normalizeText(driver.last_name)]
        .filter(Boolean)
        .join(" ");

      return {
        id: driver.id,
        kind: "driver",
        ownerEmail: normalizeText(customer?.email),
        title: name || normalizeText(driver.email) || `Driver #${driver.id}`,
        detail: normalizeText(driver.license_number) || normalizeText(driver.license_country_code),
        isVerified: Boolean(driver.is_verified),
      };
    }),
  ];
}

async function getRecentOrdersByCustomerId(customerId: number): Promise<CustomerWorkspaceOrder[]> {
  const payload = await directusRequest<DirectusCollectionResponse<OrderRecord>>(
    `/items/orders${buildQuery({
      fields:
        "id,order_number,status,coverage_start_at,coverage_end_at,total_amount,premium_amount,currency,paid_at,admin_review_status",
      "filter[customer][_eq]": String(customerId),
      sort: "-id",
      limit: "10",
    })}`,
  );

  const orders = payload.data.map(mapOrderRecord);
  const linksByOrderId = await mapContractLinksByOrderId(orders.map((order) => order.id));

  return orders.map((order) => ({
    ...order,
    contractFileUrl: linksByOrderId.get(order.id),
  }));
}

export async function getOrderHistoryByCustomerId(
  customerId: number,
): Promise<CustomerWorkspaceOrder[]> {
  const payload = await directusRequest<DirectusCollectionResponse<OrderRecord>>(
    `/items/orders${buildQuery({
      fields:
        "id,order_number,status,coverage_start_at,coverage_end_at,total_amount,premium_amount,currency,paid_at,admin_review_status",
      "filter[customer][_eq]": String(customerId),
      sort: "-id",
      limit: "100",
    })}`,
  );

  const orders = payload.data.map(mapOrderRecord);
  const linksByOrderId = await mapContractLinksByOrderId(orders.map((order) => order.id));

  return orders.map((order) => ({
    ...order,
    contractFileUrl: linksByOrderId.get(order.id),
  }));
}

export async function generateMissingPolicyPdfsForCustomer(
  customerId: number,
): Promise<{ generated: number; skipped: number }> {
  const orders = await getOrderHistoryByCustomerId(customerId);
  let generated = 0;
  let skipped = 0;

  for (const order of orders) {
    if (!["paid", "approved", "issued"].includes(order.status)) {
      skipped += 1;
      continue;
    }

    const didGenerate = await ensurePolicyPdfForOrder(order.id, customerId);
    if (didGenerate) {
      generated += 1;
    } else {
      skipped += 1;
    }
  }

  return { generated, skipped };
}

export async function getPolicyPdfAssetIdForCustomerOrder(
  customerId: number,
  orderId: number,
): Promise<string | null> {
  const order = await getOrderByIdForCustomer(orderId, customerId);
  if (!order) {
    return null;
  }

  await ensurePolicyPdfForOrder(orderId, customerId);
  const policy = await getPolicyByOrderId(orderId);
  return normalizeText(policy?.pdf_file) || null;
}

export async function fetchDirectusAssetFile(fileId: string): Promise<{
  bytes: ArrayBuffer;
  contentType: string;
  filename: string;
}> {
  const [fileMeta, token] = await Promise.all([
    getDirectusFileMeta(fileId),
    getDirectusAccessToken(),
  ]);

  const response = await fetch(`${directusInternalUrl}/assets/${fileId}?download`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Unable to download the policy PDF from file service.");
  }

  return {
    bytes: await response.arrayBuffer(),
    contentType: response.headers.get("content-type") || fileMeta.type || "application/pdf",
    filename:
      normalizeText(fileMeta.filename_download) ||
      normalizeText(fileMeta.title) ||
      `${fileId}.pdf`,
  };
}

async function buildCustomerWorkspace(customer: CustomerRecord): Promise<CustomerWorkspace> {
  const [vehicles, drivers, recentOrders] = await Promise.all([
    getVehiclesByCustomerId(customer.id),
    getDriversByCustomerId(customer.id),
    getRecentOrdersByCustomerId(customer.id),
  ]);

  return {
    customer: mapCustomerWorkspace(customer),
    vehicles,
    drivers,
    recentOrders,
  };
}

export async function getCustomerWorkspaceByEmail(
  email: string,
): Promise<CustomerWorkspace | null> {
  const customer = await getCustomerByEmail(email);

  if (!customer) {
    return null;
  }

  return buildCustomerWorkspace(customer);
}

export async function continueCustomerWorkspace(
  input: ContinueCustomerInput,
): Promise<CustomerWorkspace> {
  const email = normalizeEmail(input.email);
  if (!email) {
    throw new Error("Email is required.");
  }

  let customer = await getCustomerByEmail(email);

  if (!customer) {
    if (!normalizeText(input.firstName) || !normalizeText(input.lastName)) {
      throw new Error("First name and last name are required for a new customer account.");
    }

    customer = await createItem<CustomerRecord>("customers", {
      customer_type: "individual",
      account_status: "lead",
      email,
      phone: normalizeText(input.phone) || null,
      first_name: normalizeText(input.firstName),
      last_name: normalizeText(input.lastName),
      preferred_language: normalizeText(input.preferredLanguage) || "fr-FR",
      directus_user: normalizeText(input.directusUserId) || null,
    });
  } else {
    const patch: Record<string, unknown> = {};

    if (normalizeText(input.firstName) && normalizeText(input.firstName) !== normalizeText(customer.first_name)) {
      patch.first_name = normalizeText(input.firstName);
    }

    if (normalizeText(input.lastName) && normalizeText(input.lastName) !== normalizeText(customer.last_name)) {
      patch.last_name = normalizeText(input.lastName);
    }

    if (normalizeText(input.phone) && normalizeText(input.phone) !== normalizeText(customer.phone)) {
      patch.phone = normalizeText(input.phone);
    }

    if (
      normalizeText(input.customerType) &&
      normalizeText(input.customerType) !== normalizeText(customer.customer_type)
    ) {
      patch.customer_type = normalizeText(input.customerType);
    }

    if (
      normalizeText(input.preferredLanguage) &&
      normalizeText(input.preferredLanguage) !== normalizeText(customer.preferred_language)
    ) {
      patch.preferred_language = normalizeText(input.preferredLanguage);
    }

    if (
      normalizeText(input.directusUserId) &&
      normalizeText(input.directusUserId) !== normalizeText(customer.directus_user)
    ) {
      patch.directus_user = normalizeText(input.directusUserId);
    }

    if (Object.keys(patch).length > 0) {
      customer = await updateItem<CustomerRecord>("customers", customer.id, patch);
    }
  }

  return buildCustomerWorkspace(customer);
}

export async function registerCustomerWorkspace(
  input: ContinueCustomerInput,
): Promise<CustomerWorkspace> {
  const email = normalizeEmail(input.email);
  if (!email) {
    throw new Error("Email is required.");
  }

  const existingCustomer = await getCustomerByEmail(email);
  if (existingCustomer) {
    throw new Error("An account already exists for this email.");
  }

  return continueCustomerWorkspace(input);
}

export async function updateCustomerProfile(
  input: ContinueCustomerInput,
): Promise<CustomerWorkspace> {
  const email = normalizeEmail(input.email);
  if (!email) {
    throw new Error("Email is required.");
  }

  if (!normalizeText(input.firstName) || !normalizeText(input.lastName)) {
    throw new Error("First name and last name are required.");
  }

  const customer = await getCustomerByEmail(email);
  if (!customer) {
    throw new Error("No account was found for this email.");
  }

  await updateItem<CustomerRecord>("customers", customer.id, {
    first_name: normalizeText(input.firstName),
    last_name: normalizeText(input.lastName),
    phone: normalizeText(input.phone) || null,
    customer_type: normalizeText(input.customerType) || "individual",
    preferred_language: normalizeText(input.preferredLanguage) || "fr-FR",
    directus_user: normalizeText(input.directusUserId) || null,
  });

  return continueCustomerWorkspace({
    email,
  });
}

export async function ensureCustomerWorkspaceForDirectusUser(input: {
  directusUserId: string;
  email: string;
  firstName?: string;
  lastName?: string;
}): Promise<CustomerWorkspace> {
  return continueCustomerWorkspace({
    email: input.email,
    firstName: input.firstName,
    lastName: input.lastName,
    directusUserId: input.directusUserId,
  });
}

export async function closeCustomerAccount(email: string): Promise<void> {
  const customer = await getCustomerByEmail(email);
  if (!customer) {
    return;
  }

  await updateItem<CustomerRecord>("customers", customer.id, {
    account_status: "closed",
  });
}

export async function getQuotePreview(input: QuotePreviewInput): Promise<QuotePreview> {
  const coverageStartAt = normalizeCoverageStartAt(input.coverageStartAt);
  const product = await getActiveProductByCode(input.productCode);
  const geoZone = await getGeoZoneByCode(defaultGeoZoneCode);
  const pricingRule = await findPricingRule(
    product.id,
    geoZone.id,
    input.durationDays,
    input.fiscalPower,
  );

  return {
    productCode: product.code,
    productName: product.name,
    durationDays: input.durationDays,
    fiscalPower: input.fiscalPower,
    totalPremium: asCurrencyString(pricingRule.base_premium),
    currency: "EUR",
    coverageStartAt,
    coverageEndAt: addDays(coverageStartAt, input.durationDays),
    requiresAdminReview: Boolean(product.requires_admin_review),
  };
}

export async function getProductPricingOptions(productCode: string): Promise<ProductPricingOptions> {
  const product = await getActiveProductByCode(productCode);
  const geoZone = await getGeoZoneByCode(defaultGeoZoneCode);
  const payload = await directusRequest<DirectusCollectionResponse<PricingRuleRecord>>(
    `/items/pricing_rules${buildQuery({
      fields: "duration_days,min_fiscal_power,max_fiscal_power,priority,requires_manual_quote",
      "filter[product][_eq]": String(product.id),
      "filter[geo_zone][_eq]": String(geoZone.id),
      "filter[is_active][_eq]": "true",
      sort: "duration_days,-priority,id",
      limit: "200",
    })}`,
  );

  const fiscalPowerOptionsByDuration = new Map<number, Set<number>>();

  for (const rule of payload.data) {
    if (rule.requires_manual_quote) {
      continue;
    }

    const duration = rule.duration_days;
    const min = Math.max(1, rule.min_fiscal_power ?? 1);
    const max = Math.min(22, rule.max_fiscal_power ?? 22);
    const current = fiscalPowerOptionsByDuration.get(duration) ?? new Set<number>();

    for (let fiscalPower = min; fiscalPower <= max; fiscalPower += 1) {
      current.add(fiscalPower);
    }

    fiscalPowerOptionsByDuration.set(duration, current);
  }

  const durationOptions = Array.from(fiscalPowerOptionsByDuration.keys()).sort((a, b) => a - b);
  const normalized = Object.fromEntries(
    durationOptions.map((duration) => [
      String(duration),
      Array.from(fiscalPowerOptionsByDuration.get(duration) ?? []).sort((a, b) => a - b),
    ]),
  );

  return {
    productCode,
    durationOptions,
    fiscalPowerOptionsByDuration: normalized,
  };
}

async function getVehicleByIdForCustomer(
  customerId: number,
  vehicleId: number,
): Promise<VehicleRecord> {
  const payload = await directusRequest<DirectusCollectionResponse<VehicleRecord>>(
    `/items/vehicles${buildQuery({
      fields: "id,customer,registration_number,manufacturer,model,fiscal_power,vehicle_category,usage_type,is_active,is_verified",
      "filter[id][_eq]": String(vehicleId),
      "filter[customer][_eq]": String(customerId),
      limit: "1",
    })}`,
  );

  const vehicle = payload.data[0];
  if (!vehicle) {
    throw new Error("The selected vehicle does not belong to this customer.");
  }

  return vehicle;
}

async function getDriverByIdForCustomer(customerId: number, driverId: number): Promise<DriverRecord> {
  const payload = await directusRequest<DirectusCollectionResponse<DriverRecord>>(
    `/items/drivers${buildQuery({
      fields:
        "id,customer,first_name,last_name,birthday,email,phone,license_number,license_country_code,license_issue_date,is_active,is_verified",
      "filter[id][_eq]": String(driverId),
      "filter[customer][_eq]": String(customerId),
      limit: "1",
    })}`,
  );

  const driver = payload.data[0];
  if (!driver) {
    throw new Error("The selected driver does not belong to this customer.");
  }

  return driver;
}

async function resolveFiscalPowerForCheckout(
  customerId: number,
  vehicle: CheckoutVehicleInput,
): Promise<number> {
  if (vehicle.vehicleId) {
    const storedVehicle = await getVehicleByIdForCustomer(customerId, vehicle.vehicleId);
    return requirePositiveInteger(storedVehicle.fiscal_power ?? undefined, "vehicle fiscal power");
  }

  return requirePositiveInteger(vehicle.fiscalPower, "vehicle fiscal power");
}

async function ensureVehicleForCheckout(
  customerId: number,
  productCode: string,
  vehicle: CheckoutVehicleInput,
): Promise<VehicleRecord> {
  if (vehicle.vehicleId) {
    return getVehicleByIdForCustomer(customerId, vehicle.vehicleId);
  }

  if (!normalizeText(vehicle.registrationNumber)) {
    throw new Error("Registration number is required for a new vehicle.");
  }

  const fiscalPower = requirePositiveInteger(vehicle.fiscalPower, "vehicle fiscal power");

  return createItem<VehicleRecord>("vehicles", {
    customer: customerId,
    registration_number: normalizeRegistrationNumber(normalizeText(vehicle.registrationNumber)),
    registration_country_code: "FR",
    vehicle_category: getVehicleCategory(productCode),
    usage_type: "standard",
    manufacturer: normalizeText(vehicle.manufacturer) || null,
    model: normalizeText(vehicle.model) || null,
    fiscal_power: fiscalPower,
    is_active: true,
    is_verified: false,
  });
}

async function ensureDriverForCheckout(
  customer: CustomerWorkspace["customer"],
  driver: CheckoutDriverInput,
): Promise<DriverRecord> {
  if (driver.driverId) {
    return getDriverByIdForCustomer(customer.id, driver.driverId);
  }

  if (!normalizeText(driver.firstName) || !normalizeText(driver.lastName)) {
    throw new Error("First name and last name are required for a new driver.");
  }

  return createItem<DriverRecord>("drivers", {
    customer: customer.id,
    first_name: normalizeText(driver.firstName),
    last_name: normalizeText(driver.lastName),
    birthday: normalizeText(driver.birthday) || null,
    email: normalizeText(driver.email) || customer.email,
    phone: normalizeText(driver.phone) || customer.phone || null,
    license_number: normalizeText(driver.licenseNumber) || null,
    license_country_code: normalizeText(driver.licenseCountryCode) || "FR",
    is_active: true,
    is_verified: false,
  });
}

export async function deleteWorkspaceVehicle(
  email: string,
  vehicleId: number,
): Promise<CustomerWorkspace> {
  const customer = await getCustomerByEmail(email);
  if (!customer) {
    throw new Error("No account was found for this email.");
  }

  const vehicle = await getVehicleByIdForCustomer(customer.id, vehicleId);
  if (vehicle.is_verified) {
    throw new Error("Approved vehicles cannot be deleted from the customer portal.");
  }

  await softDeleteItem("vehicles", vehicleId);
  return buildCustomerWorkspace(customer);
}

export async function createWorkspaceVehicle(
  email: string,
  input: CreateWorkspaceVehicleInput,
): Promise<CustomerWorkspace> {
  const customer = await getCustomerByEmail(email);
  if (!customer) {
    throw new Error("No account was found for this email.");
  }

  if (!normalizeText(input.registrationNumber)) {
    throw new Error("Registration number is required.");
  }

  const fiscalPower = requirePositiveInteger(input.fiscalPower, "vehicle fiscal power");

  await createItem<VehicleRecord>("vehicles", {
    customer: customer.id,
    registration_number: normalizeRegistrationNumber(normalizeText(input.registrationNumber)),
    registration_country_code: "FR",
    vehicle_category: "automobile",
    usage_type: "standard",
    manufacturer: normalizeText(input.manufacturer) || null,
    model: normalizeText(input.model) || null,
    fiscal_power: fiscalPower,
    is_active: true,
    is_verified: false,
  });

  return buildCustomerWorkspace(customer);
}

export async function deleteWorkspaceDriver(
  email: string,
  driverId: number,
): Promise<CustomerWorkspace> {
  const customer = await getCustomerByEmail(email);
  if (!customer) {
    throw new Error("No account was found for this email.");
  }

  const driver = await getDriverByIdForCustomer(customer.id, driverId);
  if (driver.is_verified) {
    throw new Error("Approved drivers cannot be deleted from the customer portal.");
  }

  await softDeleteItem("drivers", driverId);
  return buildCustomerWorkspace(customer);
}

export async function createWorkspaceDriver(
  email: string,
  input: CreateWorkspaceDriverInput,
): Promise<CustomerWorkspace> {
  const customer = await getCustomerByEmail(email);
  if (!customer) {
    throw new Error("No account was found for this email.");
  }

  if (!normalizeText(input.firstName) || !normalizeText(input.lastName)) {
    throw new Error("First name and last name are required for a new driver.");
  }

  await createItem<DriverRecord>("drivers", {
    customer: customer.id,
    first_name: normalizeText(input.firstName),
    last_name: normalizeText(input.lastName),
    birthday: normalizeText(input.birthday) || null,
    email: normalizeText(input.email) || customer.email,
    phone: normalizeText(input.phone) || customer.phone || null,
    license_number: normalizeText(input.licenseNumber) || null,
    license_country_code: normalizeText(input.licenseCountryCode) || "FR",
    is_active: true,
    is_verified: false,
  });

  return buildCustomerWorkspace(customer);
}

export async function setWorkspaceItemVerification(
  kind: "vehicle" | "driver",
  id: number,
  isVerified: boolean,
): Promise<void> {
  if (kind === "vehicle") {
    await updateItem("vehicles", id, {
      is_verified: isVerified,
    });
    return;
  }

  await updateItem("drivers", id, {
    is_verified: isVerified,
  });
}

export async function archiveWorkspaceItem(
  kind: "vehicle" | "driver",
  id: number,
): Promise<void> {
  await softDeleteItem(kind === "vehicle" ? "vehicles" : "drivers", id);
}

async function getCurrentAdminUserId(): Promise<string | null> {
  try {
    const payload = await directusRequest<DirectusItemResponse<DirectusUserRecord>>(
      `/users/me${buildQuery({ fields: "id" })}`,
    );

    return payload.data.id;
  } catch {
    return null;
  }
}

export async function completeCheckoutFlow(
  input: CompleteCheckoutInput,
): Promise<CompleteCheckoutResult> {
  const workspace = await continueCustomerWorkspace(input.customer);
  const fiscalPower = await resolveFiscalPowerForCheckout(workspace.customer.id, input.vehicle);
  const summary = await getQuotePreview({
    productCode: input.productCode,
    durationDays: input.durationDays,
    coverageStartAt: input.coverageStartAt,
    fiscalPower,
  });

  const [product, geoZone] = await Promise.all([
    getActiveProductByCode(input.productCode),
    getGeoZoneByCode(defaultGeoZoneCode),
  ]);
  const pricingRule = await findPricingRule(product.id, geoZone.id, input.durationDays, fiscalPower);

  const vehicle = await ensureVehicleForCheckout(workspace.customer.id, input.productCode, input.vehicle);
  const driver = await ensureDriverForCheckout(workspace.customer, input.driver);

  const quoteNumber = formatSequenceNumber("QUO");
  const orderNumber = formatSequenceNumber("ORD");
  const paidAt = new Date().toISOString();

  const quote = await createItem<QuoteRecord>("quotes", {
    quote_number: quoteNumber,
    customer: workspace.customer.id,
    product: product.id,
    vehicle: vehicle.id,
    driver: driver.id,
    geo_zone: geoZone.id,
    pricing_rule: pricingRule.id,
    status: "priced",
    coverage_start_at: summary.coverageStartAt,
    coverage_end_at: summary.coverageEndAt,
    duration_days: summary.durationDays,
    base_premium: summary.totalPremium,
    surcharge_amount: "0.00",
    tax_amount: "0.00",
    total_premium: summary.totalPremium,
    currency: summary.currency,
    valid_until: addDays(new Date().toISOString(), 7),
    created_from_channel: "website",
  });

  let order = await createItem<OrderRecord>("orders", {
    order_number: orderNumber,
    customer: workspace.customer.id,
    quote: quote.id,
    product: product.id,
    vehicle: vehicle.id,
    driver: driver.id,
    geo_zone: geoZone.id,
    status: "pending_payment",
    coverage_start_at: summary.coverageStartAt,
    coverage_end_at: summary.coverageEndAt,
    premium_amount: summary.totalPremium,
    tax_amount: "0.00",
    total_amount: summary.totalPremium,
    currency: summary.currency,
    payment_deadline_at: addDays(new Date().toISOString(), 1),
    admin_review_required: Boolean(product.requires_admin_review),
    admin_review_status: "pending",
  });

  const payment = await createItem<PaymentRecord>("payments", {
    order: order.id,
    payment_provider: "local_demo",
    provider_payment_intent_id: `pi_${order.order_number.toLowerCase()}`,
    provider_charge_id: `ch_${order.order_number.toLowerCase()}`,
    amount: summary.totalPremium,
    currency: summary.currency,
    status: "succeeded",
    payment_method_type: "card",
    paid_at: paidAt,
  });

  order = await updateItem<OrderRecord>("orders", order.id, {
    status: "paid",
    paid_at: paidAt,
    admin_review_status: "in_review",
  });

  const adminUserId = await getCurrentAdminUserId();

  const review = await createItem<AdminReviewRecord>("admin_reviews", {
    order: order.id,
    reviewed_by: adminUserId,
    review_type: "local_demo_auto",
    status: "approved",
    decision_reason: "Automatically approved in the local demo flow.",
    internal_comment: "Local payment simulation approved this order.",
    reviewed_at: paidAt,
  });

  order = await updateItem<OrderRecord>("orders", order.id, {
    status: "approved",
    admin_review_status: "approved",
    internal_notes: "Local demo flow approved automatically.",
  });

  const contractFilename = `${order.order_number.toLowerCase()}-contract.pdf`;
  const contractPdf = buildContractPdfTemplate({
    order,
    customer: {
      id: workspace.customer.id,
      email: workspace.customer.email,
      first_name: workspace.customer.firstName,
      last_name: workspace.customer.lastName,
      phone: workspace.customer.phone,
    },
    vehicle,
    driver,
    productName: product.name,
  });
  const contractFileId = await uploadContractTemplateFile(
    contractFilename,
    contractPdf,
    "application/pdf",
  );

  await createItem<PolicyRecord>("policies", {
    policy_number: buildPolicyNumber(order.order_number),
    order: order.id,
    customer: workspace.customer.id,
    product: product.id,
    vehicle: vehicle.id,
    driver: driver.id,
    geo_zone: geoZone.id,
    status: "issued",
    issued_at: paidAt,
    coverage_start_at: summary.coverageStartAt,
    coverage_end_at: summary.coverageEndAt,
    premium_amount: summary.totalPremium,
    tax_amount: "0.00",
    total_amount: summary.totalPremium,
    currency: summary.currency,
    circulation_countries: "FR",
    pdf_file: contractFileId,
    pdf_generated_at: paidAt,
    document_version: "template-pdf-v1",
  });

  await Promise.all([
    updateItem<QuoteRecord>("quotes", quote.id, {
      status: "converted",
    }),
    updateItem<CustomerRecord>("customers", workspace.customer.id, {
      account_status: "active",
    }),
  ]);

  const refreshedWorkspace = await continueCustomerWorkspace({
    email: workspace.customer.email,
  });

  return {
    customer: refreshedWorkspace.customer,
    vehicle: mapVehicleRecord(vehicle),
    driver: mapDriverRecord(driver),
    quote: {
      id: quote.id,
      quoteNumber: quote.quote_number,
      status: "converted",
    },
    order: {
      id: order.id,
      orderNumber: order.order_number,
      status: order.status,
      adminReviewStatus: normalizeText(order.admin_review_status) || "approved",
    },
    payment: {
      id: payment.id,
      status: payment.status,
      amount: asCurrencyString(payment.amount),
      currency: payment.currency,
      provider: payment.payment_provider,
      paidAt: payment.paid_at,
    },
    review: {
      id: review.id,
      status: review.status,
      reviewType: review.review_type,
      reviewedAt: review.reviewed_at,
      decisionReason:
        normalizeText(review.decision_reason) ||
        "Automatically approved in the local demo flow.",
    },
    summary,
    recentOrders: refreshedWorkspace.recentOrders,
  };
}

export async function createOrderFromInput(
  input: CreateOrderInput,
): Promise<CreatedOrderSummary> {
  const result = await completeCheckoutFlow({
    customer: {
      email: input.email,
      firstName: input.customerFirstName,
      lastName: input.customerLastName,
      phone: input.phone,
    },
    productCode: input.productCode,
    durationDays: input.durationDays,
    coverageStartAt: input.coverageStartAt,
    vehicle: {
      registrationNumber: input.registrationNumber,
      fiscalPower: input.fiscalPower,
      manufacturer: input.manufacturer,
      model: input.model,
    },
    driver: {
      firstName: input.customerFirstName,
      lastName: input.customerLastName,
      birthday: "",
      email: input.email,
      phone: input.phone,
      licenseNumber: "",
      licenseExpiryDate: "",
      licenseCountryCode: "FR",
    },
  });

  return {
    customerId: result.customer.id,
    vehicleId: result.vehicle.id,
    driverId: result.driver.id,
    quoteId: result.quote.id,
    quoteNumber: result.quote.quoteNumber,
    orderId: result.order.id,
    orderNumber: result.order.orderNumber,
    totalPremium: result.summary.totalPremium,
    currency: result.summary.currency,
    coverageEndAt: result.summary.coverageEndAt,
  };
}
