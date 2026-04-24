export type AccountNavItem = {
  href: string;
  label: string;
};

export type PolicyStatus = "Active" | "Pending review" | "Expired";
export type DocumentStatus = "Uploaded" | "Missing" | "Under review";

export type MockPolicy = {
  id: string;
  product: string;
  policyNumber: string;
  vehicle: string;
  startDate: string;
  endDate: string;
  status: PolicyStatus;
  premium: string;
};

export type MockDriver = {
  id: string;
  name: string;
  dateOfBirth: string;
  licenceNumber: string;
  licenceCountry: string;
};

export type MockVehicle = {
  id: string;
  registration: string;
  model: string;
  type: string;
};

export type MockDocument = {
  id: string;
  title: string;
  category: string;
  updatedAt: string;
  status: DocumentStatus;
};

export const accountNavItems: AccountNavItem[] = [
  { href: "/account", label: "Overview" },
  { href: "/account/policies", label: "My Policies" },
  { href: "/account/drivers", label: "Drivers" },
  { href: "/account/vehicles", label: "Vehicles" },
  { href: "/account/documents", label: "Documents" },
  { href: "/account/settings", label: "Account Settings" },
];

export const mockPolicies: MockPolicy[] = [
  {
    id: "pol-001",
    product: "Passenger Car",
    policyNumber: "VT-2026-0812",
    vehicle: "AB-123-CD",
    startDate: "12 Aug 2026",
    endDate: "19 Aug 2026",
    status: "Active",
    premium: "€45.00",
  },
  {
    id: "pol-002",
    product: "Light Commercial Van",
    policyNumber: "VT-2026-0818",
    vehicle: "GH-457-JK",
    startDate: "18 Aug 2026",
    endDate: "25 Aug 2026",
    status: "Pending review",
    premium: "€69.00",
  },
  {
    id: "pol-003",
    product: "Motorhome",
    policyNumber: "VT-2026-0702",
    vehicle: "LM-908-NP",
    startDate: "25 Jun 2026",
    endDate: "02 Jul 2026",
    status: "Expired",
    premium: "€58.00",
  },
];

export const mockDrivers: MockDriver[] = [
  {
    id: "drv-001",
    name: "Camille Martin",
    dateOfBirth: "14 Mar 1989",
    licenceNumber: "FR-DRV-28931",
    licenceCountry: "France",
  },
  {
    id: "drv-002",
    name: "Louis Bernard",
    dateOfBirth: "02 Sep 1991",
    licenceNumber: "FR-DRV-55104",
    licenceCountry: "France",
  },
  {
    id: "drv-003",
    name: "Emma Robert",
    dateOfBirth: "29 Jan 1986",
    licenceNumber: "FR-DRV-77382",
    licenceCountry: "France",
  },
];

export const mockVehicles: MockVehicle[] = [
  {
    id: "veh-001",
    registration: "AB-123-CD",
    model: "Peugeot 3008",
    type: "Passenger Car",
  },
  {
    id: "veh-002",
    registration: "GH-457-JK",
    model: "Renault Trafic",
    type: "Light Commercial Van",
  },
  {
    id: "veh-003",
    registration: "LM-908-NP",
    model: "Fiat Ducato",
    type: "Motorhome",
  },
];

export const mockDocuments: MockDocument[] = [
  {
    id: "doc-001",
    title: "Driving Licence",
    category: "Identity",
    updatedAt: "Updated 2 days ago",
    status: "Uploaded",
  },
  {
    id: "doc-002",
    title: "Vehicle Registration",
    category: "Vehicle",
    updatedAt: "Missing file",
    status: "Missing",
  },
  {
    id: "doc-003",
    title: "Proof of Address",
    category: "Compliance",
    updatedAt: "Sent for review this morning",
    status: "Under review",
  },
];

export const accountSummary = [
  { label: "Active Policies", value: "2" },
  { label: "Saved Drivers", value: "3" },
  { label: "Saved Vehicles", value: "4" },
  { label: "Pending Documents", value: "1" },
];

export const quickActions = [
  "Start a new quote",
  "Add a new driver",
  "Add a new vehicle",
  "Upload supporting documents",
];
