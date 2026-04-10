import { fmtMonth, fmt, fmtPercent } from "@/lib/formatters";
import { getCoverageHealth } from "@/lib/utils";
import type { PipelineForecast } from "@/lib/db";

interface CoverageTableProps {
  forecasts: PipelineForecast[];
}

interface MonthData {
  month: string;
  confirmed: number;
  probable: number;
  pipeline: number;
  capacity: number;
}

export function CoverageTable({ forecasts }: CoverageTableProps) {
  const monthMap = new Map<string, MonthData>();
  for (const f of forecasts) {
    const existing = monthMap.get(f.month);
    if (existing) {
      existing.confirmed += f.confirmed;
      existing.probable += f.probable;
      existing.pipeline += f.pipeline;
      existing.capacity += f.capacity;
    } else {
      monthMap.set(f.month, {
        month: f.month,
        confirmed: f.confirmed,
        probable: f.probable,
        pipeline: f.pipeline,
        capacity: f.capacity,
      });
    }
  }

  const months = Array.from(monthMap.values()).sort((a, b) =>
    a.month.localeCompare(b.month)
  );

  return (
    <div className="w-full overflow-x-auto mt-6">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-grey-bg border-t-2 border-navy">
            {["Month", "Confirmed", "Probable", "Pipeline", "Capacity", "Health"].map(
              (h) => (
                <th
                  key={h}
                  className="text-left text-[10px] font-bold uppercase tracking-[0.14em] text-grey-text px-4 py-3 border-b border-grey-border"
                >
                  {h}
                </th>
              )
            )}
          </tr>
        </thead>
        <tbody>
          {months.map((m) => {
            const covRatio =
              m.capacity > 0
                ? Math.round(((m.confirmed + m.probable) / m.capacity) * 100)
                : 0;
            const health = getCoverageHealth(covRatio);

            return (
              <tr
                key={m.month}
                className="border-b border-grey-border"
              >
                <td className="px-4 py-3 text-[13px] font-bold text-navy">
                  {fmtMonth(m.month)}
                </td>
                <td className="px-4 py-3 text-[13px] text-green font-bold">
                  {fmt(m.confirmed)}
                </td>
                <td className="px-4 py-3 text-[13px] text-gold font-bold">
                  {fmt(m.probable)}
                </td>
                <td className="px-4 py-3 text-[13px] text-grey-text">
                  {fmt(m.pipeline)}
                </td>
                <td className="px-4 py-3 text-[13px] text-navy font-bold">
                  {fmt(m.capacity)}
                </td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center gap-1.5">
                    <span
                      className="inline-block w-[8px] h-[8px]"
                      style={{ backgroundColor: health.color }}
                    />
                    <span
                      className="text-[12px] font-bold"
                      style={{ color: health.color }}
                    >
                      {fmtPercent(covRatio)}
                    </span>
                    <span
                      className="text-[11px] uppercase font-bold"
                      style={{ color: health.color }}
                    >
                      {health.label}
                    </span>
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
