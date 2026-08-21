export type CategoryKey =
  | "financial"
  | "savings"
  | "auto"
  | "home"
  | "digital"
  | "valuables"
  | "life"
  | "business";

export type Question = {
  key: string;
  label: string;
  options: string[];
};

export type Category = {
  key: CategoryKey;
  label: string;
  questions: Question[];
};

export const CATEGORIES: Category[] = [
  {
    key: "financial",
    label: "Financial Account Protection",
    questions: [
      {
        key: "account_type",
        label: "Which accounts do you want protected?",
        options: ["Checking", "Savings", "Money market", "Multiple accounts"],
      },
      {
        key: "institution_insured",
        label: "Is your institution federally insured?",
        options: ["Yes", "No", "Not sure"],
      },
      {
        key: "balance_range",
        label: "Estimated balance to protect?",
        options: ["Under $10,000", "$10,000–$100,000", "$100,000–$250,000", "Over $250,000"],
      },
    ],
  },
  {
    key: "savings",
    label: "Savings & Investment",
    questions: [
      {
        key: "account_kind",
        label: "What kind of account is this?",
        options: ["Savings account", "Money market", "CD", "Brokerage / investment"],
      },
      {
        key: "institution_insured",
        label: "Is it held somewhere with deposit or SIPC insurance?",
        options: ["Yes", "No", "Not sure"],
      },
      {
        key: "balance_range",
        label: "Estimated value to protect?",
        options: ["Under $10,000", "$10,000–$100,000", "$100,000–$500,000", "Over $500,000"],
      },
    ],
  },
  {
    key: "auto",
    label: "Auto Insurance",
    questions: [
      {
        key: "vehicle_type",
        label: "What type of vehicle is this?",
        options: ["Everyday vehicle", "Classic / collector", "Motorcycle", "Multiple vehicles"],
      },
      {
        key: "existing_policy",
        label: "Do you already carry standard auto coverage?",
        options: ["Yes", "No", "Not sure"],
      },
      {
        key: "value_range",
        label: "Estimated vehicle value?",
        options: ["Under $20,000", "$20,000–$50,000", "$50,000–$150,000", "Over $150,000"],
      },
    ],
  },
  {
    key: "home",
    label: "Home Insurance",
    questions: [
      {
        key: "property_type",
        label: "What kind of property is this?",
        options: ["Primary residence", "Rental property", "Vacation home", "Other"],
      },
      {
        key: "existing_policy",
        label: "Do you have an existing homeowner's policy?",
        options: ["Yes", "No", "Not sure"],
      },
      {
        key: "value_range",
        label: "Estimated property value?",
        options: ["Under $250,000", "$250,000–$500,000", "$500,000–$1,000,000", "Over $1,000,000"],
      },
    ],
  },
  {
    key: "digital",
    label: "Digital Assets",
    questions: [
      {
        key: "asset_kind",
        label: "Which kind of digital assets do you own?",
        options: ["Cryptocurrency", "NFTs", "Stablecoins", "Multiple types"],
      },
      {
        key: "storage",
        label: "Where are they stored?",
        options: ["Centralized exchange", "Hardware wallet", "Software wallet", "Multiple locations"],
      },
      {
        key: "lock_status",
        label: "Staked or locked status?",
        options: ["Fully liquid", "Partially staked/locked", "Fully staked/locked", "Not sure"],
      },
      {
        key: "value_range",
        label: "Estimated total value?",
        options: ["Under $10,000", "$10,000–$100,000", "$100,000–$500,000", "Over $500,000"],
      },
    ],
  },
  {
    key: "valuables",
    label: "Valuables & Collectables",
    questions: [
      {
        key: "item_kind",
        label: "What kind of items are these?",
        options: ["Jewelry", "Art", "Watches", "Collectables / other"],
      },
      {
        key: "appraised",
        label: "Do you have a current appraisal?",
        options: ["Yes", "No", "Not sure"],
      },
      {
        key: "value_range",
        label: "Estimated total value?",
        options: ["Under $5,000", "$5,000–$25,000", "$25,000–$100,000", "Over $100,000"],
      },
    ],
  },
  {
    key: "life",
    label: "Life Insurance",
    questions: [
      {
        key: "coverage_goal",
        label: "What's the main goal for this coverage?",
        options: ["Income replacement", "Debt / mortgage payoff", "Estate planning", "Not sure yet"],
      },
      {
        key: "existing_policy",
        label: "Do you currently have a life insurance policy?",
        options: ["Yes", "No", "Not sure"],
      },
      {
        key: "coverage_range",
        label: "Estimated coverage amount you're considering?",
        options: ["Under $100,000", "$100,000–$500,000", "$500,000–$1,000,000", "Over $1,000,000"],
      },
    ],
  },
  {
    key: "business",
    label: "Business Assets",
    questions: [
      {
        key: "asset_kind",
        label: "What kind of business assets need protection?",
        options: ["Equipment", "Inventory", "Treasury / cash holdings", "Multiple types"],
      },
      {
        key: "entity_type",
        label: "What type of entity is this for?",
        options: ["Sole proprietorship", "LLC", "Corporation", "Other"],
      },
      {
        key: "value_range",
        label: "Estimated total value?",
        options: ["Under $50,000", "$50,000–$250,000", "$250,000–$1,000,000", "Over $1,000,000"],
      },
    ],
  },
];

export function getCategory(key: string): Category | undefined {
  return CATEGORIES.find((c) => c.key === key);
}