"use client";

import { useState, Fragment } from "react";
import { Select } from "@/components/shared/Select";
import { TeamMemberRow } from "./TeamMemberRow";
import { TeamMemberDetail } from "./TeamMemberDetail";
import type { TeamMember } from "@/lib/db";

interface TeamTableProps {
  members: TeamMember[];
}

const SORT_OPTIONS = [
  { value: "billable", label: "Total Billable" },
  { value: "mesaBillable", label: "MESA Billable" },
  { value: "globalBillable", label: "Global Billable" },
  { value: "bench", label: "Bench %" },
];

export function TeamTable({ members }: TeamTableProps) {
  const [sortBy, setSortBy] = useState("billable");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const sorted = [...members].sort((a, b) => {
    const key = sortBy as keyof TeamMember;
    return (b[key] as number) - (a[key] as number);
  });

  return (
    <div className="my-8">
      <div className="flex items-center justify-between mb-4">
        <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-grey-text">
          Individual Utilization
        </span>
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-grey-text">Sort by:</span>
          <Select
            options={SORT_OPTIONS}
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          />
        </div>
      </div>

      <div className="w-full overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-grey-bg border-t-2 border-navy">
              {["Name", "Role", "Billable", "MESA", "Global", "Utilization Breakdown", "Projects", "Status"].map(
                (h) => (
                  <th
                    key={h}
                    className="text-left text-[10px] font-bold uppercase tracking-[0.14em] text-grey-text px-4 py-3 border-b border-grey-border"
                  >
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {sorted.map((member) => {
              const isExpanded = expandedId === member.id;
              return (
                <Fragment key={member.id}>
                  <tr
                    className="border-b border-grey-border hover:bg-grey-bg/50 cursor-pointer transition-colors duration-150"
                    onClick={() =>
                      setExpandedId(isExpanded ? null : member.id)
                    }
                  >
                    <TeamMemberRow member={member} />
                  </tr>
                  {isExpanded && (
                    <tr>
                      <td colSpan={8} className="p-0">
                        <TeamMemberDetail member={member} />
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
