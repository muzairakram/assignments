"use client";

import type { Milestone } from "@/lib/db";

interface MilestoneChecklistProps {
  milestones: Milestone[];
  onToggle: (milestoneId: string) => void;
}

export function MilestoneChecklist({ milestones, onToggle }: MilestoneChecklistProps) {
  const sorted = [...milestones].sort((a, b) => a.order - b.order);
  const doneCount = sorted.filter((m) => m.done).length;

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-grey-text">
          Milestones
        </span>
        <span className="text-[12px] font-bold text-navy">
          {doneCount}/{sorted.length}
        </span>
      </div>
      <div className="flex flex-col gap-2">
        {sorted.map((ms) => (
          <button
            key={ms.id}
            onClick={(e) => {
              e.stopPropagation();
              onToggle(ms.id);
            }}
            className="flex items-center gap-3 text-left group"
          >
            <span
              className={`flex items-center justify-center w-[18px] h-[18px] border-2 flex-shrink-0 ${
                ms.done
                  ? "bg-navy border-navy"
                  : "bg-white border-input-border group-hover:border-navy"
              }`}
            >
              {ms.done && (
                <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                  <path
                    d="M1 4L3.5 6.5L9 1"
                    stroke="#E8B800"
                    strokeWidth="2"
                    strokeLinecap="square"
                  />
                </svg>
              )}
            </span>
            <span
              className={`text-[13px] ${
                ms.done ? "text-grey-text line-through" : "text-navy"
              }`}
            >
              {ms.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
