export interface CaseData {
  id: string;
  type: string;
  status: string;
  date: string;
}

export const PORTAL_CONFIG = {
  ACCESS_WORDS: [
    "apple", "bridge", "candle", "dolphin", "engine",
    "forest", "guitar", "harbor", "island", "jungle",
  ],
  ADMIN: { username: "admin", password: "admin123" },
  STAFF: { username: "staff", password: "staff123" },
} as const;

export const MOCK_CASES: Record<string, CaseData> = {
  "CASE-001": { id: "CASE-001", type: "Savings Account", status: "Active", date: "June 15, 2023" },
  "CASE-002": { id: "CASE-002", type: "Personal Items", status: "Pending", date: "August 22, 2023" },
  "CASE-003": { id: "CASE-003", type: "Vehicles", status: "Active", date: "January 5, 2024" },
  "CASE-004": { id: "CASE-004", type: "Digital Assets", status: "Closed", date: "March 10, 2024" },
  "CASE-005": { id: "CASE-005", type: "Savings Account", status: "Active", date: "May 30, 2024" },
};

export const ASSET_TYPES = [
  { id: "savings", title: "Savings Accounts", desc: "Traditional banking", icon: "savings" },
  { id: "jewelry", title: "Personal Items", desc: "Valuables and collectibles", icon: "jewelry" },
  { id: "vehicles", title: "Automobiles", desc: "Product and registry", icon: "vehicles" },
  { id: "digital", title: "Electronic Assets", desc: "Digital holdings and records", icon: "digital" },
] as const;

export type PageId = "landing" | "lookup" | "access" | "verify" | "final" | "admin" | "staff";