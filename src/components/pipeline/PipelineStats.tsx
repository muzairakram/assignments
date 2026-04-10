import { StatBox } from "@/components/shared/StatBox";
import { PHASE_COLORS } from "@/lib/constants";
import { fmtCompact } from "@/lib/formatters";
import type { Phase } from "@/lib/db";

interface PipelineStatsProps {
  totalValue: number;
  activeCount: number;
  winRate: number;
  byPhase: Record<Phase, number>;
}

export function PipelineStats({
  totalValue,
  activeCount,
  winRate,
  byPhase,
}: PipelineStatsProps) {
  return (
    <div className="grid grid-cols-4 gap-6 pb-7 border-b border-grey-border">
      <StatBox
        label="Total Pipeline Value"
        value={fmtCompact(totalValue)}
        valueColor="#E8B800"
      />
      <StatBox
        label="Active Opportunities"
        value={activeCount}
      />
      <StatBox
        label="Win Rate"
        value={`${winRate}%`}
      />
      <div className="flex flex-col gap-1">
        <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-grey-text">
          Phase Breakdown
        </span>
        <div className="flex flex-wrap gap-2 mt-2">
          {(Object.entries(byPhase) as [Phase, number][]).map(([phase, count]) =>
            count > 0 ? (
              <span key={phase} className="inline-flex items-center gap-1.5">
                <span
                  className="inline-block w-[10px] h-[10px]"
                  style={{ backgroundColor: PHASE_COLORS[phase] }}
                />
                <span className="text-[12px] font-bold text-navy">
                  {count}
                </span>
                <span className="text-[11px] text-grey-text">{phase}</span>
              </span>
            ) : null
          )}
        </div>
      </div>
    </div>
  );
}
