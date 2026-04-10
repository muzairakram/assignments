import { StatBox } from "@/components/shared/StatBox";
import { fmtPercent } from "@/lib/formatters";

interface UtilizationStatsProps {
  avgBillable: number;
  avgMesa: number;
  avgGlobal: number;
  avgInternal: number;
  avgBench: number;
  headcount: number;
  atTarget: number;
  belowTarget: number;
}

export function UtilizationStats({
  avgBillable,
  avgMesa,
  avgGlobal,
  avgInternal,
  avgBench,
  headcount,
  atTarget,
  belowTarget,
}: UtilizationStatsProps) {
  return (
    <div className="flex items-start gap-6 pb-7 border-b border-grey-border">
      <StatBox
        label="Team Billable Rate"
        value={fmtPercent(avgBillable)}
        valueColor="#E8B800"
        subText="Target: 70%"
        className="flex-1"
      />
      <div className="w-px h-16 bg-grey-border self-center" />
      <StatBox
        label="MESA Billable"
        value={fmtPercent(avgMesa)}
        subText="Regional delivery"
        className="flex-1"
      />
      <div className="w-px h-16 bg-grey-border self-center" />
      <StatBox
        label="Global Billable"
        value={fmtPercent(avgGlobal)}
        subText="Cross-region work"
        className="flex-1"
      />
      <div className="w-px h-16 bg-grey-border self-center" />
      <StatBox
        label="Internal / Bench"
        value={`${fmtPercent(avgInternal)} / ${fmtPercent(avgBench)}`}
        subText="Non-billable allocation"
        className="flex-1"
      />
      <div className="w-px h-16 bg-grey-border self-center" />
      <StatBox
        label="Headcount"
        value={headcount}
        subText={`${atTarget} at target | ${belowTarget} below 60%`}
        className="flex-1"
      />
    </div>
  );
}
