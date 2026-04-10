import { PHASES, PHASE_COLORS } from "@/lib/constants";
import type { Phase } from "@/lib/db";

interface PhaseDistributionBarProps {
  byPhase: Record<Phase, number>;
}

export function PhaseDistributionBar({ byPhase }: PhaseDistributionBarProps) {
  const total = Object.values(byPhase).reduce((s, v) => s + v, 0);
  if (total === 0) return null;

  return (
    <div className="w-full h-[6px] flex my-6">
      {PHASES.map((phase) => {
        const count = byPhase[phase] || 0;
        if (count === 0) return null;
        return (
          <div
            key={phase}
            className="h-full"
            style={{
              width: `${(count / total) * 100}%`,
              backgroundColor: PHASE_COLORS[phase],
            }}
            title={`${phase}: ${count}`}
          />
        );
      })}
    </div>
  );
}
