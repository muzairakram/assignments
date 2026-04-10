export const PHASES = [
  "Discovery",
  "Scoping",
  "Proposal",
  "Negotiation",
  "Delivery",
  "Closed",
] as const;

export const OPPORTUNITY_TYPES = [
  "Technical Assistance",
  "Strategy Advisory",
  "Capacity Building",
  "Implementation Support",
  "Assessment",
] as const;

export const RAG_STATUSES = ["Green", "Amber", "Red"] as const;

export const STAFF_STATUSES = ["Active", "Ramping", "On Leave", "Exiting"] as const;

export const PHASE_COLORS: Record<string, string> = {
  Discovery: "#90A4AE",
  Scoping: "#78909C",
  Proposal: "#E8B800",
  Negotiation: "#FF8F00",
  Delivery: "#2E7D32",
  Closed: "#1B2838",
};

export const RAG_COLORS: Record<string, string> = {
  Green: "#2E7D32",
  Amber: "#E8A000",
  Red: "#C62828",
};

export const STAFF_STATUS_COLORS: Record<string, string> = {
  Active: "#2E7D32",
  Ramping: "#E8A000",
  "On Leave": "#6B7B8D",
  Exiting: "#C62828",
};

export const UTIL_SEGMENTS = {
  mesa: { label: "MESA", color: "#E8B800" },
  global: { label: "Global", color: "#1B2838" },
  internal: { label: "Internal", color: "#90A4AE" },
  bench: { label: "Bench", color: "#CFD8DC" },
};

export const COVERAGE_THRESHOLDS = {
  strong: 80,
  adequate: 60,
};

export const UTIL_COLOR_THRESHOLDS = {
  green: 75,
  navy: 60,
  amber: 50,
};
