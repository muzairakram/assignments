import { UTIL_SEGMENTS } from "@/lib/constants";
import { fmtPercent } from "@/lib/formatters";
import { getUtilColor } from "@/lib/utils";
import type { TeamMember } from "@/lib/db";

interface TeamMemberDetailProps {
  member: TeamMember;
}

export function TeamMemberDetail({ member }: TeamMemberDetailProps) {
  const allocations = [
    { label: "MESA Billable", value: member.mesaBillable, color: UTIL_SEGMENTS.mesa.color },
    { label: "Global Billable", value: member.globalBillable, color: UTIL_SEGMENTS.global.color },
    { label: "Internal", value: member.internal, color: UTIL_SEGMENTS.internal.color },
    { label: "Bench", value: member.bench, color: UTIL_SEGMENTS.bench.color },
  ];

  return (
    <div className="grid grid-cols-2 gap-8 bg-grey-bg border-b border-grey-border px-6 py-5">
      {/* Allocation Breakdown */}
      <div>
        <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-grey-text">
          Allocation Breakdown
        </span>
        <div className="flex flex-col gap-3 mt-3">
          {allocations.map((alloc) => (
            <div key={alloc.label} className="flex items-center gap-3">
              <span
                className="inline-block w-[10px] h-[10px] flex-shrink-0"
                style={{ backgroundColor: alloc.color }}
              />
              <span className="text-[13px] text-navy flex-1">{alloc.label}</span>
              <span className="text-[13px] font-bold text-navy">
                {fmtPercent(alloc.value)}
              </span>
            </div>
          ))}
        </div>

        {/* Target vs Actual */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-grey-text">
              Target vs Actual
            </span>
            <span
              className="text-[12px] font-bold"
              style={{ color: getUtilColor(member.billable) }}
            >
              {fmtPercent(member.billable)} / 70%
            </span>
          </div>
          <div className="w-full bg-grey-border h-[6px] relative">
            <div
              className="h-full"
              style={{
                width: `${member.billable}%`,
                backgroundColor: getUtilColor(member.billable),
              }}
            />
            <div
              className="absolute top-0 h-full w-[2px] bg-navy"
              style={{ left: "70%" }}
            />
          </div>
        </div>
      </div>

      {/* Current Projects */}
      <div>
        <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-grey-text">
          Current Projects
        </span>
        <div className="flex flex-col gap-2 mt-3">
          {member.projects.map((project) => (
            <div
              key={project}
              className="flex items-center gap-2 text-[13px] text-navy"
            >
              <span className="inline-block w-[6px] h-[6px] bg-gold flex-shrink-0" />
              {project}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
