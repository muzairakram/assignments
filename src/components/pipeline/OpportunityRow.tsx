import { PhaseIndicator } from "@/components/shared/PhaseIndicator";
import { RAGBadge } from "@/components/shared/RAGBadge";
import { ProgressBar } from "@/components/shared/ProgressBar";
import { fmt } from "@/lib/formatters";
import type { Opportunity } from "@/lib/db";

interface OpportunityRowProps {
  opportunity: Opportunity;
}

export function OpportunityRow({ opportunity }: OpportunityRowProps) {
  const doneCount = opportunity.milestones.filter((m) => m.done).length;
  const totalMs = opportunity.milestones.length;

  return (
    <>
      <td className="px-4 py-3">
        <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-gold">
          {opportunity.client}
        </span>
      </td>
      <td className="px-4 py-3">
        <div className="font-bold text-[13px] text-navy">
          {opportunity.title}
        </div>
        <div className="text-[11px] text-grey-text mt-0.5">
          {opportunity.type}
        </div>
      </td>
      <td className="px-4 py-3">
        <PhaseIndicator currentPhase={opportunity.phase} />
        <div className="text-[10px] text-grey-text mt-1">
          {opportunity.phase}
        </div>
      </td>
      <td className="px-4 py-3">
        <RAGBadge status={opportunity.rag} />
      </td>
      <td className="px-4 py-3 w-[140px]">
        <ProgressBar value={doneCount} max={totalMs} />
        <div className="text-[10px] text-grey-text mt-1">
          {doneCount}/{totalMs} milestones
        </div>
      </td>
      <td className="px-4 py-3 text-right">
        <span className="font-bold text-[14px] text-navy">
          {fmt(opportunity.value)}
        </span>
      </td>
    </>
  );
}
