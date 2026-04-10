import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getUtilColor(pct: number): string {
  if (pct >= 75) return "#2E7D32";
  if (pct >= 60) return "#1B2838";
  if (pct >= 50) return "#E8A000";
  return "#C62828";
}

export function getUtilColorClass(pct: number): string {
  if (pct >= 75) return "text-green";
  if (pct >= 60) return "text-navy";
  if (pct >= 50) return "text-amber";
  return "text-red";
}

export function getCoverageHealth(ratio: number): {
  label: string;
  color: string;
} {
  if (ratio >= 80) return { label: "Strong", color: "#2E7D32" };
  if (ratio >= 60) return { label: "Adequate", color: "#E8A000" };
  return { label: "At Risk", color: "#C62828" };
}

export function getWinRate(
  opportunities: { phase: string }[]
): number {
  if (opportunities.length === 0) return 0;
  const closed = opportunities.filter((o) => o.phase === "Closed").length;
  return Math.round((closed / opportunities.length) * 100);
}

export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}
