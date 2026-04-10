"use client";

import { useState, useCallback, Fragment } from "react";
import useSWR, { mutate } from "swr";
import { Header } from "@/components/layout/Header";
import { PipelineStats } from "@/components/pipeline/PipelineStats";
import { PhaseDistributionBar } from "@/components/pipeline/PhaseDistributionBar";
import { FilterRow } from "@/components/pipeline/FilterRow";
import { OpportunityRow } from "@/components/pipeline/OpportunityRow";
import { OpportunityDetail } from "@/components/pipeline/OpportunityDetail";
import { AddOpportunityModal } from "@/components/pipeline/AddOpportunityModal";
import type { Opportunity } from "@/lib/db";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function PipelinePage() {
  const [filters, setFilters] = useState({ rag: "", phase: "", type: "" });
  const [showModal, setShowModal] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const params = new URLSearchParams();
  if (filters.rag) params.set("rag", filters.rag);
  if (filters.phase) params.set("phase", filters.phase);
  if (filters.type) params.set("type", filters.type);

  const { data: opportunities = [] } = useSWR<Opportunity[]>(
    `/api/opportunities?${params.toString()}`,
    fetcher
  );
  const { data: allOpportunities = [] } = useSWR<Opportunity[]>(
    "/api/opportunities",
    fetcher
  );
  const { data: stats } = useSWR(
    "/api/stats/pipeline",
    fetcher
  );

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleClearFilters = () => {
    setFilters({ rag: "", phase: "", type: "" });
  };

  const handleToggleMilestone = useCallback(
    async (opportunityId: string, milestoneId: string) => {
      await fetch(`/api/opportunities/${opportunityId}/milestones`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ milestoneId }),
      });
      mutate((key: string) => typeof key === "string" && key.startsWith("/api/opportunities"));
      mutate("/api/stats/pipeline");
    },
    []
  );

  const handleAddOpportunity = async (data: Record<string, unknown>) => {
    await fetch("/api/opportunities", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    mutate((key: string) => typeof key === "string" && key.startsWith("/api/opportunities"));
    mutate("/api/stats/pipeline");
  };

  return (
    <div>
      <Header microLabel="Business Development" title="Pipeline & Outcomes Tracker">
        <button
          onClick={() => setShowModal(true)}
          className="bg-navy text-white px-5 py-2.5 text-[12px] font-bold uppercase tracking-[0.1em] hover:bg-navy/90"
        >
          + Add Opportunity
        </button>
      </Header>

      {stats && (
        <>
          <PipelineStats
            totalValue={stats.totalValue}
            activeCount={stats.activeCount}
            winRate={stats.winRate}
            byPhase={stats.byPhase}
          />
          <PhaseDistributionBar byPhase={stats.byPhase} />
        </>
      )}

      <FilterRow
        filters={filters}
        onFilterChange={handleFilterChange}
        onClear={handleClearFilters}
        filteredCount={opportunities.length}
        totalCount={allOpportunities.length}
      />

      <div className="w-full overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-grey-bg border-t-2 border-navy">
              <th className="text-left text-[10px] font-bold uppercase tracking-[0.14em] text-grey-text px-4 py-3 border-b border-grey-border">
                Client
              </th>
              <th className="text-left text-[10px] font-bold uppercase tracking-[0.14em] text-grey-text px-4 py-3 border-b border-grey-border">
                Title / Type
              </th>
              <th className="text-left text-[10px] font-bold uppercase tracking-[0.14em] text-grey-text px-4 py-3 border-b border-grey-border">
                Phase
              </th>
              <th className="text-left text-[10px] font-bold uppercase tracking-[0.14em] text-grey-text px-4 py-3 border-b border-grey-border">
                RAG
              </th>
              <th className="text-left text-[10px] font-bold uppercase tracking-[0.14em] text-grey-text px-4 py-3 border-b border-grey-border">
                Progress
              </th>
              <th className="text-right text-[10px] font-bold uppercase tracking-[0.14em] text-grey-text px-4 py-3 border-b border-grey-border">
                Value
              </th>
            </tr>
          </thead>
          <tbody>
            {opportunities.map((opp) => {
              const isExpanded = expandedId === opp.id;
              return (
                <Fragment key={opp.id}>
                  <tr
                    className="border-b border-grey-border hover:bg-grey-bg/50 cursor-pointer transition-colors duration-150"
                    onClick={() => setExpandedId(isExpanded ? null : opp.id)}
                  >
                    <OpportunityRow opportunity={opp} />
                  </tr>
                  {isExpanded && (
                    <tr>
                      <td colSpan={6} className="p-0">
                        <OpportunityDetail
                          opportunity={opp}
                          onToggleMilestone={handleToggleMilestone}
                        />
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      <AddOpportunityModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleAddOpportunity}
      />
    </div>
  );
}
