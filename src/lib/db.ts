import { generateId } from "./utils";

// ─── TYPES ───────────────────────────────────────────────────────────────────

export type Phase = "Discovery" | "Scoping" | "Proposal" | "Negotiation" | "Delivery" | "Closed";
export type OpportunityType = "Technical Assistance" | "Strategy Advisory" | "Capacity Building" | "Implementation Support" | "Assessment";
export type RAGStatus = "Green" | "Amber" | "Red";
export type StaffStatus = "Active" | "Ramping" | "On Leave" | "Exiting";

export interface Milestone {
  id: string;
  opportunityId: string;
  label: string;
  done: boolean;
  order: number;
}

export interface Opportunity {
  id: string;
  client: string;
  title: string;
  type: OpportunityType;
  phase: Phase;
  rag: RAGStatus;
  value: number;
  lead: string;
  targetDate: string;
  outcomes: string;
  notes: string;
  milestones: Milestone[];
  createdAt: string;
  updatedAt: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  email: string;
  billable: number;
  mesaBillable: number;
  globalBillable: number;
  internal: number;
  bench: number;
  projects: string[];
  status: StaffStatus;
  reportingMonth: string;
}

export interface UtilizationSnapshot {
  id: string;
  month: string;
  billable: number;
  internal: number;
  bench: number;
  mesa: number;
  global: number;
  target: number;
  headcount: number;
}

export interface PipelineForecast {
  id: string;
  month: string;
  confirmed: number;
  probable: number;
  pipeline: number;
  capacity: number;
  region: string;
}

// ─── IN-MEMORY STORE ─────────────────────────────────────────────────────────

let opportunities: Opportunity[] = [];
let teamMembers: TeamMember[] = [];
let utilizationSnapshots: UtilizationSnapshot[] = [];
let pipelineForecasts: PipelineForecast[] = [];
let seeded = false;

export async function ensureSeeded(): Promise<void> {
  if (seeded) return;
  const { seedAll } = await import("./seed");
  const data = seedAll();
  opportunities = data.opportunities;
  teamMembers = data.teamMembers;
  utilizationSnapshots = data.utilizationSnapshots;
  pipelineForecasts = data.pipelineForecasts;
  seeded = true;
}

// ─── OPPORTUNITY OPERATIONS ──────────────────────────────────────────────────

export async function getOpportunities(filters?: {
  phase?: Phase;
  rag?: RAGStatus;
  type?: OpportunityType;
}): Promise<Opportunity[]> {
  await ensureSeeded();
  let result = [...opportunities];
  if (filters?.phase) result = result.filter((o) => o.phase === filters.phase);
  if (filters?.rag) result = result.filter((o) => o.rag === filters.rag);
  if (filters?.type) result = result.filter((o) => o.type === filters.type);
  return result;
}

export async function getOpportunityById(id: string): Promise<Opportunity | null> {
  await ensureSeeded();
  return opportunities.find((o) => o.id === id) ?? null;
}

export async function createOpportunity(
  data: Omit<Opportunity, "id" | "createdAt" | "updatedAt" | "milestones">
): Promise<Opportunity> {
  await ensureSeeded();
  const now = new Date().toISOString();
  const id = generateId();
  const milestones: Milestone[] = Array.from({ length: 5 }, (_, i) => ({
    id: generateId(),
    opportunityId: id,
    label: `Milestone ${i + 1}`,
    done: false,
    order: i + 1,
  }));
  const opp: Opportunity = {
    ...data,
    id,
    milestones,
    createdAt: now,
    updatedAt: now,
  };
  opportunities.push(opp);
  return opp;
}

export async function updateOpportunity(
  id: string,
  data: Partial<Opportunity>
): Promise<Opportunity> {
  await ensureSeeded();
  const idx = opportunities.findIndex((o) => o.id === id);
  if (idx === -1) throw new Error("Opportunity not found");
  opportunities[idx] = {
    ...opportunities[idx],
    ...data,
    id,
    updatedAt: new Date().toISOString(),
  };
  return opportunities[idx];
}

export async function deleteOpportunity(id: string): Promise<void> {
  await ensureSeeded();
  opportunities = opportunities.filter((o) => o.id !== id);
}

// ─── MILESTONE OPERATIONS ────────────────────────────────────────────────────

export async function toggleMilestone(
  opportunityId: string,
  milestoneId: string
): Promise<Milestone> {
  await ensureSeeded();
  const opp = opportunities.find((o) => o.id === opportunityId);
  if (!opp) throw new Error("Opportunity not found");
  const ms = opp.milestones.find((m) => m.id === milestoneId);
  if (!ms) throw new Error("Milestone not found");
  ms.done = !ms.done;
  opp.updatedAt = new Date().toISOString();
  return ms;
}

export async function updateMilestones(
  opportunityId: string,
  milestones: Milestone[]
): Promise<Milestone[]> {
  await ensureSeeded();
  const opp = opportunities.find((o) => o.id === opportunityId);
  if (!opp) throw new Error("Opportunity not found");
  opp.milestones = milestones;
  opp.updatedAt = new Date().toISOString();
  return opp.milestones;
}

// ─── TEAM / UTILIZATION OPERATIONS ───────────────────────────────────────────

export async function getTeamMembers(month: string): Promise<TeamMember[]> {
  await ensureSeeded();
  return teamMembers.filter((t) => t.reportingMonth === month);
}

export async function upsertTeamMember(
  data: Omit<TeamMember, "id">
): Promise<TeamMember> {
  await ensureSeeded();
  const idx = teamMembers.findIndex(
    (t) => t.email === data.email && t.reportingMonth === data.reportingMonth
  );
  if (idx !== -1) {
    teamMembers[idx] = { ...teamMembers[idx], ...data };
    return teamMembers[idx];
  }
  const member: TeamMember = { ...data, id: generateId() };
  teamMembers.push(member);
  return member;
}

export async function getUtilizationHistory(
  monthsBack: number = 6
): Promise<UtilizationSnapshot[]> {
  await ensureSeeded();
  return utilizationSnapshots
    .sort((a, b) => a.month.localeCompare(b.month))
    .slice(-monthsBack);
}

export async function upsertUtilizationSnapshot(
  data: Omit<UtilizationSnapshot, "id">
): Promise<UtilizationSnapshot> {
  await ensureSeeded();
  const idx = utilizationSnapshots.findIndex((s) => s.month === data.month);
  if (idx !== -1) {
    utilizationSnapshots[idx] = { ...utilizationSnapshots[idx], ...data };
    return utilizationSnapshots[idx];
  }
  const snap: UtilizationSnapshot = { ...data, id: generateId() };
  utilizationSnapshots.push(snap);
  return snap;
}

// ─── PIPELINE FORECAST OPERATIONS ────────────────────────────────────────────

export async function getPipelineForecasts(
  monthsAhead: number = 6
): Promise<PipelineForecast[]> {
  await ensureSeeded();
  return pipelineForecasts
    .sort((a, b) => a.month.localeCompare(b.month))
    .slice(0, monthsAhead * 2); // *2 for MESA + Global per month
}

export async function upsertPipelineForecast(
  data: Omit<PipelineForecast, "id">
): Promise<PipelineForecast> {
  await ensureSeeded();
  const idx = pipelineForecasts.findIndex(
    (f) => f.month === data.month && f.region === data.region
  );
  if (idx !== -1) {
    pipelineForecasts[idx] = { ...pipelineForecasts[idx], ...data };
    return pipelineForecasts[idx];
  }
  const forecast: PipelineForecast = { ...data, id: generateId() };
  pipelineForecasts.push(forecast);
  return forecast;
}

// ─── AGGREGATION / REPORTING ─────────────────────────────────────────────────

export async function getPipelineStats(): Promise<{
  totalValue: number;
  activeCount: number;
  winRate: number;
  byPhase: Record<Phase, number>;
  byType: Record<OpportunityType, number>;
}> {
  await ensureSeeded();
  const all = opportunities;
  const active = all.filter((o) => o.phase !== "Closed");
  const closed = all.filter((o) => o.phase === "Closed");
  const winRate = all.length > 0 ? Math.round((closed.length / all.length) * 100) : 0;

  const byPhase = {} as Record<Phase, number>;
  const phases: Phase[] = ["Discovery", "Scoping", "Proposal", "Negotiation", "Delivery", "Closed"];
  for (const p of phases) {
    byPhase[p] = all.filter((o) => o.phase === p).length;
  }

  const types: OpportunityType[] = [
    "Technical Assistance",
    "Strategy Advisory",
    "Capacity Building",
    "Implementation Support",
    "Assessment",
  ];
  const byType = {} as Record<OpportunityType, number>;
  for (const t of types) {
    byType[t] = all.filter((o) => o.type === t).length;
  }

  return {
    totalValue: all.reduce((s, o) => s + o.value, 0),
    activeCount: active.length,
    winRate,
    byPhase,
    byType,
  };
}

export async function getUtilizationStats(month: string): Promise<{
  avgBillable: number;
  avgMesa: number;
  avgGlobal: number;
  avgInternal: number;
  avgBench: number;
  headcount: number;
  atTarget: number;
  belowTarget: number;
}> {
  await ensureSeeded();
  const members = teamMembers.filter((t) => t.reportingMonth === month);
  if (members.length === 0) {
    return { avgBillable: 0, avgMesa: 0, avgGlobal: 0, avgInternal: 0, avgBench: 0, headcount: 0, atTarget: 0, belowTarget: 0 };
  }
  const avg = (arr: number[]) => arr.reduce((s, v) => s + v, 0) / arr.length;
  return {
    avgBillable: Math.round(avg(members.map((m) => m.billable))),
    avgMesa: Math.round(avg(members.map((m) => m.mesaBillable))),
    avgGlobal: Math.round(avg(members.map((m) => m.globalBillable))),
    avgInternal: Math.round(avg(members.map((m) => m.internal))),
    avgBench: Math.round(avg(members.map((m) => m.bench))),
    headcount: members.length,
    atTarget: members.filter((m) => m.billable >= 70).length,
    belowTarget: members.filter((m) => m.billable < 60).length,
  };
}

export async function getCoverageRatio(monthsAhead: number = 6): Promise<{
  ratio: number;
  totalConfirmed: number;
  totalProbable: number;
  totalPipeline: number;
  totalCapacity: number;
}> {
  await ensureSeeded();
  const forecasts = pipelineForecasts.slice(0, monthsAhead * 2);
  const totalConfirmed = forecasts.reduce((s, f) => s + f.confirmed, 0);
  const totalProbable = forecasts.reduce((s, f) => s + f.probable, 0);
  const totalPipeline = forecasts.reduce((s, f) => s + f.pipeline, 0);
  const totalCapacity = forecasts.reduce((s, f) => s + f.capacity, 0);
  const ratio = totalCapacity > 0
    ? Math.round(((totalConfirmed + totalProbable) / totalCapacity) * 100)
    : 0;
  return { ratio, totalConfirmed, totalProbable, totalPipeline, totalCapacity };
}
