"use client";

import { fmtMonthShort, fmtPercent } from "@/lib/formatters";
import { UTIL_SEGMENTS } from "@/lib/constants";
import type { UtilizationSnapshot } from "@/lib/db";

interface UtilizationTrendProps {
  snapshots: UtilizationSnapshot[];
  selectedMonth: string;
  onSelectMonth: (month: string) => void;
}

export function UtilizationTrend({
  snapshots,
  selectedMonth,
  onSelectMonth,
}: UtilizationTrendProps) {
  const maxHeight = 200;

  return (
    <div className="my-8">
      <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-grey-text mb-4">
        6-Month Utilization Trend
      </div>

      <div className="relative">
        {/* Target line */}
        <div
          className="absolute left-0 right-0 border-t-2 border-dashed z-10"
          style={{
            top: `${maxHeight - (70 / 100) * maxHeight}px`,
            borderColor: "#E8B800",
          }}
        >
          <span className="absolute -top-[10px] -left-1 text-[9px] text-gold font-bold">
            70%
          </span>
        </div>

        <div className="flex items-end gap-4 justify-between" style={{ height: maxHeight }}>
          {snapshots.map((snap) => {
            const isSelected = snap.month === selectedMonth;
            const segments = [
              { value: snap.mesa, color: UTIL_SEGMENTS.mesa.color },
              { value: snap.global, color: UTIL_SEGMENTS.global.color },
              { value: snap.internal, color: UTIL_SEGMENTS.internal.color },
              { value: snap.bench, color: UTIL_SEGMENTS.bench.color },
            ];
            const total = snap.billable + snap.internal + snap.bench;
            const barHeight = (total / 100) * maxHeight;

            return (
              <button
                key={snap.month}
                onClick={() => onSelectMonth(snap.month)}
                className="flex-1 flex flex-col items-center"
                style={{ height: "100%" }}
              >
                <div
                  className="w-full flex flex-col justify-end"
                  style={{ height: "100%" }}
                >
                  <div
                    className={`w-full flex flex-col overflow-hidden ${
                      isSelected ? "ring-2 ring-gold" : ""
                    }`}
                    style={{ height: barHeight }}
                  >
                    {segments.map((seg, i) => (
                      <div
                        key={i}
                        className="w-full"
                        style={{
                          height: `${(seg.value / total) * 100}%`,
                          backgroundColor: seg.color,
                        }}
                      />
                    ))}
                  </div>
                </div>
                <div className="text-[11px] font-bold text-navy mt-2">
                  {fmtPercent(snap.billable)}
                </div>
                <div className="text-[10px] text-grey-text">
                  {fmtMonthShort(snap.month)}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-5 mt-4">
        {Object.values(UTIL_SEGMENTS).map((seg) => (
          <span key={seg.label} className="inline-flex items-center gap-1.5">
            <span
              className="inline-block w-[10px] h-[10px]"
              style={{ backgroundColor: seg.color }}
            />
            <span className="text-[11px] text-grey-text">{seg.label}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
