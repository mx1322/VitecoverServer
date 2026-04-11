export type CustomerType = "individual" | "pro";

export type QuoteStatus =
  | "draft"
  | "priced"
  | "expired"
  | "converted"
  | "cancelled";

export interface InsuranceProduct {
  id: number;
  code: string;
  name: string;
  product_family: string;
  customer_segment: string;
  description?: string | null;
  min_duration_days?: number | null;
  max_duration_days?: number | null;
  status: string;
}

export interface GeoZone {
  id: number;
  code: string;
  name: string;
  zone_type: string;
}

export interface Vehicle {
  id: number;
  registration_number: string;
  vehicle_category: string;
  usage_type: string;
  manufacturer?: string | null;
  model?: string | null;
}

export interface Driver {
  id: number;
  first_name: string;
  last_name: string;
  birthday?: string | null;
  license_country_code?: string | null;
}

export interface Quote {
  id: number;
  quote_number: string;
  status: QuoteStatus;
  coverage_start_at: string;
  coverage_end_at: string;
  duration_days: number;
  total_premium: number;
  currency: string;
}

export interface Policy {
  id: number;
  policy_number: string;
  status: string;
  coverage_start_at: string;
  coverage_end_at: string;
  pdf_file?: string | null;
}

export interface DirectusSchema {
  insurance_products: InsuranceProduct[];
  geo_zones: GeoZone[];
  vehicles: Vehicle[];
  drivers: Driver[];
  quotes: Quote[];
  policies: Policy[];
}
