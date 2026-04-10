"use client";

import { fmtMonthShort } from "@/lib/formatters";
import { getCoverageHealth } from "@/lib/utils";
import type { PipelineForecast } from "@/lib/db";

interface CoverageChartProps {
  forecasts: PipelineForecast[];
}

interface MonthData {
  month: string;
  confirmed: number;
  probable: number;
  pipeline: number;
  capacity: number;
}

export function CoverageChart({ forecasts }: CoverageChartProps) {
  // Aggregate MESA + Global per month
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

  const maxVal = Math.max(
    ...months.map((m) =>
      Math.max(m.confirmed + m.probable + m.pipeline, m.capacity)
    )
  );
  const chartHeight = 180;

  return (
    <div className="my-6">
      <div className="relative">
        <div className="flex items-end gap-4 justify-between" style={{ height: chartHeight }}>
          {months.map((m) => {
            const total = m.confirmed + m.probable + m.pipeline;
            const barHeight = maxVal > 0 ? (total / maxVal) * chartHeight : 0;
            const capHeight = maxVal > 0 ? (m.capacity / maxVal) * chartHeight : 0;
            const covRatio =
              m.capacity > 0
                ? Math.round(((m.confirmed + m.probable) / m.capacity) * 100)
                : 0;
            const health = getCoverageHealth(covRatio);

            return (
              <div key={m.month} className="flex-1 flex flex-col items-center" style={{ height: "100%" }}>
                <div className="w-full flex flex-col justify-end relative" style={{ height: "100%" }}>
                  {/* Capacity line */}
                  <div
                    className="absolute left-0 right-0 border-t-2 border-dashed border-navy"
                    style={{ bottom: capHeight }}
                  />
                  {/* Stacked bar */}
                  <div className="w-full flex flex-col overflow-hidden" style={{ height: barHeight }}>
                    <div
                      className="w-full"
                      style={{
                        height: total > 0 ? `${(m.pipeline / total) * 100}%` : 0,
                        backgroundColor: "#CFD8DC",
                      }}
                    />
                    <div
                      className="w-full"
                      style={{
                        height: total > 0 ? `${(m.probable / total) * 100}%` : 0,
                        backgroundColor: "#E8B800",
                      }}
                    />
                    <div
                      className="w-full"
                      style={{
                        height: total > 0 ? `${(m.confirmed / total) * 100}%` : 0,
                        backgroundColor: "#2E7D32",
                      }}
                    />
                  </div>
                </div>
                {/* Health badge */}
                <div className="mt-2 flex flex-col items-center">
                  <span className="inline-flex items-center gap-1">
                    <span
                      className="inline-block w-[7px] h-[7px]"
                      style={{ backgroundColor: health.color }}
                    />
                    <span className="text-[9px] font-bold uppercase" style={{ color: health.color }}>
                      {health.label}
                    </span>
                  </span>
                  <span className="text-[10px] text-grey-text mt-0.5">
                    {fmtMonthShort(m.month)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-5 mt-4">
        {[
          { label: "Confirmed", color: "#2E7D32" },
          { label: "Probable", color: "#E8B800" },
          { label: "Pipeline", color: "#CFD8DC" },
          { label: "Capacity", color: "#1B2838", dashed: true },
        ].map((item) => (
          <span key={item.label} className="inline-flex items-center gap-1.5">
            {item.dashed ? (
              <span className="inline-block w-[14px] border-t-2 border-dashed border-navy" />
            ) : (
              <span
                className="inline-block w-[10px] h-[10px]"
                style={{ backgroundColor: item.color }}
              />
            )}
            <span className="text-[11px] text-grey-text">{item.label}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
