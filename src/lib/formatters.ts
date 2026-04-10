export function fmt(n: number): string {
  return "$" + n.toLocaleString("en-US");
}

export function fmtCompact(n: number): string {
  if (n >= 1_000_000) {
    const m = n / 1_000_000;
    return "$" + (m % 1 === 0 ? m.toFixed(0) : m.toFixed(1)) + "M";
  }
  if (n >= 1_000) {
    const k = n / 1_000;
    return "$" + (k % 1 === 0 ? k.toFixed(0) : k.toFixed(0)) + "K";
  }
  return "$" + n.toLocaleString("en-US");
}

export function fmtDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function fmtPercent(n: number): string {
  return Math.round(n) + "%";
}

export function fmtMonth(yyyymm: string): string {
  const [year, month] = yyyymm.split("-");
  const d = new Date(parseInt(year), parseInt(month) - 1);
  return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

export function fmtMonthShort(yyyymm: string): string {
  const [year, month] = yyyymm.split("-");
  const d = new Date(parseInt(year), parseInt(month) - 1);
  return d.toLocaleDateString("en-US", { month: "short" });
}
