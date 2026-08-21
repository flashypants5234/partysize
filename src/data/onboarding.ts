export type Option = { value: string; label: string };

export type AssetKey = "property" | "personal_valuables" | "digital_assets";

export const assetQuestions: { key: AssetKey; label: string }[] = [
  { key: "property", label: "Do you own property (real estate) you'd want covered?" },
  {
    key: "personal_valuables",
    label:
      "Do you have valuable personal property (jewelry, collectibles, etc.) you'd want VPP coverage for?",
  },
  { key: "digital_assets", label: "Do you hold digital assets (cryptocurrency)?" },
];

export const valueRanges: Option[] = [
  { value: "under_1k", label: "Under $1,000" },
  { value: "1k_10k", label: "$1,000 – $10,000" },
  { value: "10k_100k", label: "$10,000 – $100,000" },
  { value: "100k_plus", label: "$100,000+" },
];

export const digitalStorageOptions: Option[] = [
  { value: "exchange", label: "On an exchange" },
  { value: "hardware_wallet", label: "Hardware wallet" },
  { value: "custodian", label: "Third-party custodian" },
  { value: "other", label: "Other / not sure" },
];

export const goalsOptions: Option[] = [
  { value: "protect_assets", label: "Protect my existing assets" },
  { value: "get_quote", label: "Get a coverage quote" },
  { value: "early_access", label: "Early access pricing" },
  { value: "exploring", label: "Just exploring for now" },
];

export const securityLoadingSteps = [
  "Verifying case ID…",
  "Encrypting session…",
  "Preparing your profile…",
];
