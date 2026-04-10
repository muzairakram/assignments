import { PHASES, PHASE_COLORS } from "@/lib/constants";

interface PhaseIndicatorProps {
  currentPhase: string;
  className?: string;
}

export function PhaseIndicator({ currentPhase, className = "" }: PhaseIndicatorProps) {
  const currentIndex = PHASES.indexOf(currentPhase as typeof PHASES[number]);

  return (
    <div className={`flex gap-[3px] items-center ${className}`}>
      {PHASES.map((phase, i) => (
        <div
          key={phase}
          className="h-[6px] w-[22px]"
          style={{
            backgroundColor:
              i <= currentIndex ? PHASE_COLORS[phase] : "#E8ECF0",
          }}
          title={phase}
        />
      ))}
    </div>
  );
}
