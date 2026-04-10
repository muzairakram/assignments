"use client";

import { Select } from "@/components/shared/Select";
import { PHASES, OPPORTUNITY_TYPES, RAG_STATUSES } from "@/lib/constants";

interface FilterRowProps {
  filters: {
    rag: string;
    phase: string;
    type: string;
  };
  onFilterChange: (key: string, value: string) => void;
  onClear: () => void;
  filteredCount: number;
  totalCount: number;
}

export function FilterRow({
  filters,
  onFilterChange,
  onClear,
  filteredCount,
  totalCount,
}: FilterRowProps) {
  const activeCount = Object.values(filters).filter(Boolean).length;

  return (
    <div className="flex items-center gap-3 mb-4">
      <Select
        options={RAG_STATUSES.map((r) => ({ value: r, label: r }))}
        placeholder="RAG Status"
        value={filters.rag}
        onChange={(e) => onFilterChange("rag", e.target.value)}
      />
      <Select
        options={PHASES.map((p) => ({ value: p, label: p }))}
        placeholder="Phase"
        value={filters.phase}
        onChange={(e) => onFilterChange("phase", e.target.value)}
      />
      <Select
        options={OPPORTUNITY_TYPES.map((t) => ({ value: t, label: t }))}
        placeholder="Type"
        value={filters.type}
        onChange={(e) => onFilterChange("type", e.target.value)}
      />
      {activeCount > 0 && (
        <button
          onClick={onClear}
          className="text-[12px] font-bold text-grey-text hover:text-navy uppercase tracking-[0.08em]"
        >
          Clear ({activeCount})
        </button>
      )}
      <span className="ml-auto text-[12px] text-grey-text">
        {filteredCount} of {totalCount} shown
      </span>
    </div>
  );
}
