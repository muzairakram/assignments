import { StackedBar } from "@/components/shared/StackedBar";
import { fmtPercent } from "@/lib/formatters";
import { UTIL_SEGMENTS } from "@/lib/constants";

interface MESAvsGlobalPanelProps {
  avgMesa: number;
  avgGlobal: number;
  avgInternal: number;
  avgBench: number;
  avgBillable: number;
}

export function MESAvsGlobalPanel({
  avgMesa,
  avgGlobal,
  avgInternal,
  avgBench,
  avgBillable,
}: MESAvsGlobalPanelProps) {
  return (
    <div className="bg-grey-bg p-6 my-6">
      <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-grey-text mb-4">
        MESA vs Global Billable Split
      </div>

      <div className="grid grid-cols-2 gap-8 mb-6">
        {/* MESA */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span
              className="inline-block w-[10px] h-[10px]"
              style={{ backgroundColor: UTIL_SEGMENTS.mesa.color }}
            />
            <span className="text-[13px] font-bold text-navy">MESA Region</span>
          </div>
          <div className="w-full bg-grey-border h-[10px] mb-2">
            <div
              className="h-full"
              style={{
                width: `${avgMesa}%`,
                backgroundColor: UTIL_SEGMENTS.mesa.color,
              }}
            />
          </div>
          <div className="text-[20px] font-extrabold text-navy">
            {fmtPercent(avgMesa)}
          </div>
          <div className="text-[11px] text-grey-text mt-1">
            Regional delivery projects
          </div>
        </div>

        {/* Global */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span
              className="inline-block w-[10px] h-[10px]"
              style={{ backgroundColor: UTIL_SEGMENTS.global.color }}
            />
            <span className="text-[13px] font-bold text-navy">Global Average</span>
          </div>
          <div className="w-full bg-grey-border h-[10px] mb-2">
            <div
              className="h-full"
              style={{
                width: `${avgGlobal}%`,
                backgroundColor: UTIL_SEGMENTS.global.color,
              }}
            />
          </div>
          <div className="text-[20px] font-extrabold text-navy">
            {fmtPercent(avgGlobal)}
          </div>
          <div className="text-[11px] text-grey-text mt-1">
            Cross-region projects
          </div>
        </div>
      </div>

      {/* Total billable stacked bar */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold text-navy">
            Total Billable Breakdown
          </span>
          <span
            className="text-[13px] font-bold"
            style={{ color: avgBillable >= 70 ? "#2E7D32" : "#E8A000" }}
          >
            {fmtPercent(avgBillable)}
          </span>
        </div>
        <StackedBar
          height={10}
          segments={[
            { value: avgMesa, color: UTIL_SEGMENTS.mesa.color, label: "MESA" },
            { value: avgGlobal, color: UTIL_SEGMENTS.global.color, label: "Global" },
            { value: avgInternal, color: UTIL_SEGMENTS.internal.color, label: "Internal" },
            { value: avgBench, color: UTIL_SEGMENTS.bench.color, label: "Bench" },
          ]}
        />
      </div>
    </div>
  );
}
