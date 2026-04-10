import { MicroLabel } from "@/components/shared/MicroLabel";
import { fmtPercent } from "@/lib/formatters";
import { getCoverageHealth } from "@/lib/utils";

interface PipelineCoverageProps {
  ratio: number;
}

export function PipelineCoverage({ ratio }: PipelineCoverageProps) {
  const health = getCoverageHealth(ratio);

  return (
    <div className="flex items-end justify-between border-t-2 border-navy pt-6 mt-8 mb-6">
      <div>
        <MicroLabel>Forward Looking</MicroLabel>
        <h2 className="text-[20px] font-extrabold text-navy tracking-tight mt-1">
          Pipeline Coverage & Regional Health
        </h2>
      </div>
      <div className="text-right">
        <MicroLabel>6-Month Coverage Ratio</MicroLabel>
        <div
          className="text-[28px] font-extrabold mt-1"
          style={{ color: health.color }}
        >
          {fmtPercent(ratio)}
        </div>
      </div>
    </div>
  );
}
