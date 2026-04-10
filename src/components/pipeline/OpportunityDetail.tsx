"use client";

import { MilestoneChecklist } from "./MilestoneChecklist";
import { fmtDate } from "@/lib/formatters";
import type { Opportunity } from "@/lib/db";

interface OpportunityDetailProps {
  opportunity: Opportunity;
  onToggleMilestone: (opportunityId: string, milestoneId: string) => void;
}

export function OpportunityDetail({
  opportunity,
  onToggleMilestone,
}: OpportunityDetailProps) {
  return (
    <div className="grid grid-cols-2 gap-8 bg-grey-bg border-b border-grey-border px-6 py-5">
      <MilestoneChecklist
        milestones={opportunity.milestones}
        onToggle={(milestoneId) =>
          onToggleMilestone(opportunity.id, milestoneId)
        }
      />
      <div className="flex flex-col gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-grey-text">
            BD Lead
          </span>
          <p className="text-[13px] font-bold text-navy mt-1">
            {opportunity.lead}
          </p>
        </div>
        <div>
          <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-grey-text">
            Target Date
          </span>
          <p className="text-[13px] text-navy mt-1">
            {fmtDate(opportunity.targetDate)}
          </p>
        </div>
        <div>
          <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-grey-text">
            Target Outcomes
          </span>
          <p className="text-[13px] text-navy mt-1 leading-relaxed">
            {opportunity.outcomes}
          </p>
        </div>
        <div>
          <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-grey-text">
            Status Notes
          </span>
          <p className="text-[13px] text-navy mt-1 leading-relaxed">
            {opportunity.notes}
          </p>
        </div>
      </div>
    </div>
  );
}
