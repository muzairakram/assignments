import type {
  Opportunity,
  TeamMember,
  UtilizationSnapshot,
  PipelineForecast,
} from "./db";

function id(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

function makeMilestones(
  oppId: string,
  labels: string[],
  doneCount: number
) {
  return labels.map((label, i) => ({
    id: id(),
    opportunityId: oppId,
    label,
    done: i < doneCount,
    order: i + 1,
  }));
}

function seedOpportunities(): Opportunity[] {
  const opp1Id = id();
  const opp2Id = id();
  const opp3Id = id();
  const opp4Id = id();
  const opp5Id = id();

  return [
    {
      id: opp1Id,
      client: "IsDB",
      title: "LLF Results-Based Management Digital Transformation",
      type: "Technical Assistance",
      phase: "Delivery",
      rag: "Green",
      value: 485000,
      lead: "Uzair Akram",
      targetDate: "2026-06-30",
      outcomes: "Digitize RBM processes across 12 LLF programs, enabling real-time tracking of development outcomes and automated reporting for IsDB stakeholders.",
      notes: "Phase 2 delivery on track. Client satisfaction high. Exploring expansion to additional LLF programs in Q3.",
      milestones: makeMilestones(opp1Id, [
        "Needs Assessment & Stakeholder Mapping",
        "RBM Framework Design",
        "Digital Platform Configuration",
        "Pilot Deployment & Training",
        "Full Rollout & Handover",
      ], 3),
      createdAt: "2025-09-15T10:00:00Z",
      updatedAt: "2026-03-10T14:30:00Z",
    },
    {
      id: opp2Id,
      client: "World Bank",
      title: "Pacific Islands Education Delivery Unit Setup",
      type: "Strategy Advisory",
      phase: "Proposal",
      rag: "Amber",
      value: 720000,
      lead: "Romina Genovesi",
      targetDate: "2026-09-15",
      outcomes: "Establish delivery units in 3 Pacific Island nations to improve education service delivery, with measurable improvement in school completion rates.",
      notes: "Proposal submitted. Awaiting WB procurement review. Timeline may slip due to election cycles in target countries.",
      milestones: makeMilestones(opp2Id, [
        "Context Analysis & Benchmarking",
        "Delivery Unit Design",
        "Proposal Development & Submission",
        "Stakeholder Alignment Workshops",
        "Implementation Roadmap Finalization",
      ], 3),
      createdAt: "2025-11-01T09:00:00Z",
      updatedAt: "2026-03-05T11:00:00Z",
    },
    {
      id: opp3Id,
      client: "Ministry of Education Rwanda",
      title: "AI-Enabled Learning Outcomes Monitoring",
      type: "Implementation Support",
      phase: "Negotiation",
      rag: "Green",
      value: 340000,
      lead: "Juan Riesco",
      targetDate: "2026-12-01",
      outcomes: "Deploy AI-powered monitoring system to track learning outcomes across 500+ schools, providing early warning signals for intervention.",
      notes: "MoU in final review. Technical approach validated. Budget alignment discussions ongoing with Ministry finance team.",
      milestones: makeMilestones(opp3Id, [
        "Feasibility Study & Data Audit",
        "System Architecture & Design",
        "Contract Negotiation & MoU",
        "Platform Development & Integration",
        "Monitoring Framework & Handover",
      ], 2),
      createdAt: "2025-12-10T08:00:00Z",
      updatedAt: "2026-03-12T16:00:00Z",
    },
    {
      id: opp4Id,
      client: "Gates Foundation",
      title: "Sub-Saharan Africa Health Procurement Reform",
      type: "Assessment",
      phase: "Discovery",
      rag: "Green",
      value: 290000,
      lead: "Kate Cherednichenko",
      targetDate: "2026-08-15",
      outcomes: "Comprehensive assessment of health procurement systems in 5 Sub-Saharan African countries with reform recommendations and implementation roadmap.",
      notes: "Initial conversations with Gates program officers. Strong alignment with their health systems strengthening agenda.",
      milestones: makeMilestones(opp4Id, [
        "Stakeholder Engagement & Scoping",
        "Procurement Systems Assessment",
        "Comparative Analysis & Benchmarking",
        "Reform Recommendations",
        "Implementation Roadmap & Costing",
      ], 1),
      createdAt: "2026-01-20T10:00:00Z",
      updatedAt: "2026-03-08T09:00:00Z",
    },
    {
      id: opp5Id,
      client: "UNDP Asia-Pacific",
      title: "Government AI Readiness and Capacity Building",
      type: "Capacity Building",
      phase: "Closed",
      rag: "Green",
      value: 560000,
      lead: "Narjes Jafarian",
      targetDate: "2026-02-28",
      outcomes: "Built AI readiness frameworks and trained 200+ government officials across 6 Asia-Pacific nations on responsible AI adoption for public services.",
      notes: "Project successfully completed. Final report delivered. Client exploring Phase 2 engagement for implementation support.",
      milestones: makeMilestones(opp5Id, [
        "AI Readiness Assessment Framework",
        "Country-Level Diagnostic Reports",
        "Curriculum & Training Design",
        "Training Delivery (6 countries)",
        "Final Report & Sustainability Plan",
      ], 5),
      createdAt: "2025-06-01T10:00:00Z",
      updatedAt: "2026-02-28T17:00:00Z",
    },
  ];
}

function seedTeamMembers(): TeamMember[] {
  return [
    {
      id: id(),
      name: "Uzair Akram",
      role: "AI@DA Lead",
      email: "uzair.akram@deliveryassociates.com",
      billable: 72,
      mesaBillable: 55,
      globalBillable: 17,
      internal: 18,
      bench: 10,
      projects: ["IsDB LLF RBM", "Rwanda AI Monitoring"],
      status: "Active",
      reportingMonth: "2026-03",
    },
    {
      id: id(),
      name: "Romina Genovesi",
      role: "Senior Associate",
      email: "romina.genovesi@deliveryassociates.com",
      billable: 80,
      mesaBillable: 60,
      globalBillable: 20,
      internal: 12,
      bench: 8,
      projects: ["World Bank Pacific Islands", "UNICEF Education"],
      status: "Active",
      reportingMonth: "2026-03",
    },
    {
      id: id(),
      name: "Juan Riesco",
      role: "Associate",
      email: "juan.riesco@deliveryassociates.com",
      billable: 68,
      mesaBillable: 40,
      globalBillable: 28,
      internal: 22,
      bench: 10,
      projects: ["Rwanda AI Monitoring", "UNDP Capacity Building"],
      status: "Active",
      reportingMonth: "2026-03",
    },
    {
      id: id(),
      name: "Narjes Jafarian",
      role: "Associate",
      email: "narjes.jafarian@deliveryassociates.com",
      billable: 85,
      mesaBillable: 50,
      globalBillable: 35,
      internal: 10,
      bench: 5,
      projects: ["UNDP AI Readiness", "IsDB LLF RBM", "Gates Health"],
      status: "Active",
      reportingMonth: "2026-03",
    },
    {
      id: id(),
      name: "Olia Gladkova-Burgess",
      role: "Senior Associate",
      email: "olia.gladkova@deliveryassociates.com",
      billable: 60,
      mesaBillable: 45,
      globalBillable: 15,
      internal: 25,
      bench: 15,
      projects: ["Gates Health Procurement"],
      status: "Active",
      reportingMonth: "2026-03",
    },
    {
      id: id(),
      name: "Hafsa Iqbal",
      role: "Analyst",
      email: "hafsa.iqbal@deliveryassociates.com",
      billable: 55,
      mesaBillable: 40,
      globalBillable: 15,
      internal: 35,
      bench: 10,
      projects: ["IsDB LLF RBM"],
      status: "Active",
      reportingMonth: "2026-03",
    },
    {
      id: id(),
      name: "Arqam Lodhi",
      role: "Analyst",
      email: "arqam.lodhi@deliveryassociates.com",
      billable: 45,
      mesaBillable: 30,
      globalBillable: 15,
      internal: 40,
      bench: 15,
      projects: ["Rwanda AI Monitoring"],
      status: "Ramping",
      reportingMonth: "2026-03",
    },
    {
      id: id(),
      name: "Renee Sturcq",
      role: "Associate",
      email: "renee.sturcq@deliveryassociates.com",
      billable: 75,
      mesaBillable: 35,
      globalBillable: 40,
      internal: 15,
      bench: 10,
      projects: ["World Bank Pacific Islands", "UNDP AI Readiness"],
      status: "Active",
      reportingMonth: "2026-03",
    },
  ];
}

function seedUtilizationSnapshots(): UtilizationSnapshot[] {
  return [
    { id: id(), month: "2025-10", billable: 65, internal: 22, bench: 13, mesa: 42, global: 23, target: 70, headcount: 7 },
    { id: id(), month: "2025-11", billable: 68, internal: 20, bench: 12, mesa: 44, global: 24, target: 70, headcount: 7 },
    { id: id(), month: "2025-12", billable: 62, internal: 24, bench: 14, mesa: 40, global: 22, target: 70, headcount: 7 },
    { id: id(), month: "2026-01", billable: 70, internal: 19, bench: 11, mesa: 46, global: 24, target: 70, headcount: 8 },
    { id: id(), month: "2026-02", billable: 72, internal: 18, bench: 10, mesa: 48, global: 24, target: 70, headcount: 8 },
    { id: id(), month: "2026-03", billable: 68, internal: 22, bench: 10, mesa: 44, global: 24, target: 70, headcount: 8 },
  ];
}

function seedPipelineForecasts(): PipelineForecast[] {
  const months = ["2026-04", "2026-05", "2026-06", "2026-07", "2026-08", "2026-09"];
  const forecasts: PipelineForecast[] = [];

  const mesaData = [
    { confirmed: 320000, probable: 180000, pipeline: 290000, capacity: 450000 },
    { confirmed: 310000, probable: 200000, pipeline: 340000, capacity: 450000 },
    { confirmed: 280000, probable: 220000, pipeline: 380000, capacity: 450000 },
    { confirmed: 250000, probable: 190000, pipeline: 420000, capacity: 450000 },
    { confirmed: 220000, probable: 170000, pipeline: 460000, capacity: 450000 },
    { confirmed: 200000, probable: 150000, pipeline: 500000, capacity: 450000 },
  ];

  const globalData = [
    { confirmed: 180000, probable: 120000, pipeline: 150000, capacity: 300000 },
    { confirmed: 170000, probable: 140000, pipeline: 180000, capacity: 300000 },
    { confirmed: 150000, probable: 160000, pipeline: 200000, capacity: 300000 },
    { confirmed: 140000, probable: 130000, pipeline: 220000, capacity: 300000 },
    { confirmed: 120000, probable: 110000, pipeline: 250000, capacity: 300000 },
    { confirmed: 100000, probable: 100000, pipeline: 280000, capacity: 300000 },
  ];

  months.forEach((month, i) => {
    forecasts.push({
      id: id(),
      month,
      ...mesaData[i],
      region: "MESA",
    });
    forecasts.push({
      id: id(),
      month,
      ...globalData[i],
      region: "Global",
    });
  });

  return forecasts;
}

export function seedAll() {
  return {
    opportunities: seedOpportunities(),
    teamMembers: seedTeamMembers(),
    utilizationSnapshots: seedUtilizationSnapshots(),
    pipelineForecasts: seedPipelineForecasts(),
  };
}
