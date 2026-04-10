import { StackedBar } from "@/components/shared/StackedBar";
import { fmtPercent } from "@/lib/formatters";
import { UTIL_SEGMENTS, STAFF_STATUS_COLORS } from "@/lib/constants";
import { getUtilColor } from "@/lib/utils";
import type { TeamMember } from "@/lib/db";

interface TeamMemberRowProps {
  member: TeamMember;
}

export function TeamMemberRow({ member }: TeamMemberRowProps) {
  return (
    <>
      <td className="px-4 py-3">
        <div className="font-bold text-[13px] text-navy">{member.name}</div>
      </td>
      <td className="px-4 py-3 text-[13px] text-grey-text">{member.role}</td>
      <td className="px-4 py-3">
        <span
          className="text-[14px] font-bold"
          style={{ color: getUtilColor(member.billable) }}
        >
          {fmtPercent(member.billable)}
        </span>
      </td>
      <td className="px-4 py-3">
        <span className="text-[13px] font-bold" style={{ color: UTIL_SEGMENTS.mesa.color }}>
          {fmtPercent(member.mesaBillable)}
        </span>
      </td>
      <td className="px-4 py-3">
        <span className="text-[13px] font-bold text-navy">
          {fmtPercent(member.globalBillable)}
        </span>
      </td>
      <td className="px-4 py-3 w-[160px]">
        <StackedBar
          height={8}
          segments={[
            { value: member.mesaBillable, color: UTIL_SEGMENTS.mesa.color, label: "MESA" },
            { value: member.globalBillable, color: UTIL_SEGMENTS.global.color, label: "Global" },
            { value: member.internal, color: UTIL_SEGMENTS.internal.color, label: "Internal" },
            { value: member.bench, color: UTIL_SEGMENTS.bench.color, label: "Bench" },
          ]}
        />
      </td>
      <td className="px-4 py-3 text-[13px] text-navy">
        {member.projects.length}
      </td>
      <td className="px-4 py-3">
        <span className="inline-flex items-center gap-1.5">
          <span
            className="inline-block w-[8px] h-[8px]"
            style={{ backgroundColor: STAFF_STATUS_COLORS[member.status] }}
          />
          <span className="text-[11px] text-grey-text">{member.status}</span>
        </span>
      </td>
    </>
  );
}
