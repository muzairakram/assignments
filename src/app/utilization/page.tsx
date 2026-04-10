"use client";

import { useState } from "react";
import useSWR, { mutate } from "swr";
import { Header } from "@/components/layout/Header";
import { Select } from "@/components/shared/Select";
import { StatBox } from "@/components/shared/StatBox";
import { UtilizationStats } from "@/components/utilization/UtilizationStats";
import { UtilizationTrend } from "@/components/utilization/UtilizationTrend";
import { MESAvsGlobalPanel } from "@/components/utilization/MESAvsGlobalPanel";
import { TeamTable } from "@/components/utilization/TeamTable";
import { AddStaffModal } from "@/components/utilization/AddStaffModal";
import { PipelineCoverage } from "@/components/utilization/PipelineCoverage";
import { CoverageChart } from "@/components/utilization/CoverageChart";
import { CoverageTable } from "@/components/utilization/CoverageTable";
import { fmtCompact, fmtMonth } from "@/lib/formatters";
import type { TeamMember, UtilizationSnapshot, PipelineForecast } from "@/lib/db";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

const MONTHS = [
  { value: "2026-03", label: "Mar 2026" },
  { value: "2026-02", label: "Feb 2026" },
  { value: "2026-01", label: "Jan 2026" },
  { value: "2025-12", label: "Dec 2025" },
  { value: "2025-11", label: "Nov 2025" },
  { value: "2025-10", label: "Oct 2025" },
];

export default function UtilizationPage() {
  const [selectedMonth, setSelectedMonth] = useState("2026-03");
  const [showModal, setShowModal] = useState(false);

  const { data: teamMembers = [] } = useSWR<TeamMember[]>(
    `/api/team?month=${selectedMonth}`,
    fetcher
  );
  const { data: stats } = useSWR(
    `/api/stats/utilization?month=${selectedMonth}`,
    fetcher
  );
  const { data: snapshots = [] } = useSWR<UtilizationSnapshot[]>(
    "/api/utilization?months=6",
    fetcher
  );
  const { data: forecasts = [] } = useSWR<PipelineForecast[]>(
    "/api/pipeline-forecast?months=6",
    fetcher
  );
  const { data: coverage } = useSWR(
    "/api/stats/coverage?months=6",
    fetcher
  );

  const handleAddStaff = async (data: Record<string, unknown>) => {
    const billable = ((data.mesaBillable as number) || 0) + ((data.globalBillable as number) || 0);
    await fetch("/api/team", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, billable, projects: [] }),
    });
    mutate((key: string) => typeof key === "string" && (key.startsWith("/api/team") || key.startsWith("/api/stats/utilization")));
  };

  return (
    <div>
      <Header
        microLabel="Monthly Staffing Report"
        title="Utilization & Pipeline Coverage"
      >
        <Select
          options={MONTHS}
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
        />
        <button
          onClick={() => setShowModal(true)}
          className="bg-navy text-white px-5 py-2.5 text-[12px] font-bold uppercase tracking-[0.1em] hover:bg-navy/90"
        >
          + Add Staff
        </button>
      </Header>

      {stats && (
        <UtilizationStats
          avgBillable={stats.avgBillable}
          avgMesa={stats.avgMesa}
          avgGlobal={stats.avgGlobal}
          avgInternal={stats.avgInternal}
          avgBench={stats.avgBench}
          headcount={stats.headcount}
          atTarget={stats.atTarget}
          belowTarget={stats.belowTarget}
        />
      )}

      {snapshots.length > 0 && (
        <UtilizationTrend
          snapshots={snapshots}
          selectedMonth={selectedMonth}
          onSelectMonth={setSelectedMonth}
        />
      )}

      {stats && (
        <MESAvsGlobalPanel
          avgMesa={stats.avgMesa}
          avgGlobal={stats.avgGlobal}
          avgInternal={stats.avgInternal}
          avgBench={stats.avgBench}
          avgBillable={stats.avgBillable}
        />
      )}

      <TeamTable members={teamMembers} />

      {/* Pipeline Coverage Section */}
      {coverage && <PipelineCoverage ratio={coverage.ratio} />}

      {coverage && (
        <div className="grid grid-cols-4 gap-6 mb-6">
          <StatBox
            label="Confirmed Revenue"
            value={fmtCompact(coverage.totalConfirmed)}
            valueColor="#2E7D32"
          />
          <StatBox
            label="Probable Revenue"
            value={fmtCompact(coverage.totalProbable)}
            valueColor="#E8B800"
          />
          <StatBox
            label="Pipeline Unweighted"
            value={fmtCompact(coverage.totalPipeline)}
          />
          <StatBox
            label="Total Capacity"
            value={fmtCompact(coverage.totalCapacity)}
          />
        </div>
      )}

      {forecasts.length > 0 && <CoverageChart forecasts={forecasts} />}
      {forecasts.length > 0 && <CoverageTable forecasts={forecasts} />}

      {/* Footer */}
      <div className="border-t-2 border-navy mt-12 pt-4 flex items-center justify-between">
        <span className="text-[12px] text-grey-text">
          Delivery Associates -- AI@DA Team
        </span>
        <span className="text-[12px] text-grey-text">
          Generated {fmtMonth(selectedMonth)}
        </span>
      </div>

      <AddStaffModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleAddStaff}
        reportingMonth={selectedMonth}
      />
    </div>
  );
}
