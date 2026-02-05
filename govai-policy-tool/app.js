/* ======================================================
   GovAI Policy Tool — Application Logic
   Decision engine, Investment planner, Vendor strategy,
   Training planner, ROI model, Report generator
   ====================================================== */

(function () {
    'use strict';

    // ── State ──────────────────────────────────────────
    const state = {
        currentStep: 0,
        totalSteps: 7,
        minister: {},
        pillars: {},
        plan: 'lean',
    };

    const PILLAR_NAMES = {
        principles: 'Principles & Outcomes',
        governance: 'Governance & Accountability',
        risk: 'Risk Mgmt & Responsible AI',
        data: 'Data Policy & Infrastructure',
        capability: 'Capability & Education',
        implementation: 'Implementation & Procurement',
    };

    const PILLAR_KEYS = Object.keys(PILLAR_NAMES);

    const SEG_CLASSES = {
        principles: 'seg-principles',
        governance: 'seg-governance',
        risk: 'seg-risk',
        data: 'seg-data',
        capability: 'seg-capability',
        implementation: 'seg-implementation',
    };

    // ── Navigation ─────────────────────────────────────
    const stepNav = document.getElementById('stepNav');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const stepItems = stepNav.querySelectorAll('.step-item');

    function goToStep(idx) {
        if (idx < 0 || idx >= state.totalSteps) return;
        // Collect data from current step before leaving
        collectStepData(state.currentStep);
        // Mark completed
        if (idx > state.currentStep) {
            for (let i = 0; i <= state.currentStep; i++) {
                stepItems[i].classList.add('completed');
            }
        }
        state.currentStep = idx;
        // Update nav
        stepItems.forEach((el, i) => {
            el.classList.toggle('active', i === idx);
        });
        // Update panels
        document.querySelectorAll('.step-panel').forEach((p, i) => {
            p.classList.toggle('active', i === idx);
        });
        // Update buttons
        prevBtn.disabled = idx === 0;
        const labels = [
            'Next: Policy Pillars',
            'Next: Investment Plan',
            'Next: Vendor Strategy',
            'Next: Training Plan',
            'Next: ROI & Evidence',
            'Generate Report',
            'Done',
        ];
        nextBtn.textContent = labels[idx] || 'Next';
        nextBtn.disabled = idx === state.totalSteps - 1;

        // Generate dynamic content for steps 2+
        if (idx >= 2) generateDynamicContent(idx);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    prevBtn.addEventListener('click', () => goToStep(state.currentStep - 1));
    nextBtn.addEventListener('click', () => goToStep(state.currentStep + 1));

    stepItems.forEach((el) => {
        el.addEventListener('click', () => {
            const step = parseInt(el.dataset.step);
            goToStep(step);
        });
    });

    // Priority checkbox limit (max 3)
    document.querySelectorAll('input[name="priority"]').forEach((cb) => {
        cb.addEventListener('change', () => {
            const checked = document.querySelectorAll('input[name="priority"]:checked');
            if (checked.length > 3) {
                cb.checked = false;
            }
        });
    });

    // Budget mode toggle
    document.getElementById('budgetMode').addEventListener('change', function () {
        document.getElementById('budgetAmountGroup').style.display =
            this.value === 'known' ? 'block' : 'none';
    });

    // Plan toggle
    document.getElementById('planToggle').addEventListener('click', function (e) {
        if (!e.target.classList.contains('plan-btn')) return;
        this.querySelectorAll('.plan-btn').forEach((b) => b.classList.remove('active'));
        e.target.classList.add('active');
        state.plan = e.target.dataset.plan;
        renderInvestmentPlan();
    });

    // Print
    document.getElementById('printReport')?.addEventListener('click', () => window.print());
    document.getElementById('restartTool')?.addEventListener('click', () => location.reload());

    // ── Data Collection ────────────────────────────────
    function collectStepData(step) {
        if (step === 0) collectMinisterData();
        if (step === 1) collectPillarData();
    }

    function collectMinisterData() {
        const priorities = [];
        document.querySelectorAll('input[name="priority"]:checked').forEach((cb) => {
            priorities.push(cb.value);
        });
        state.minister = {
            priorities,
            riskAppetite: document.querySelector('input[name="riskAppetite"]:checked')?.value || 'balanced',
            budgetMode: document.getElementById('budgetMode').value,
            budgetAmount: parseFloat(document.getElementById('budgetAmount').value) || 0,
            horizon: parseInt(document.getElementById('horizon').value) || 12,
            procurementLead: document.getElementById('procurementLead').value,
            hiringCap: document.getElementById('hiringCap').value,
            aiUsage: document.getElementById('aiUsage').value,
            dataSharing: document.querySelector('input[name="dataSharing"]:checked')?.value || 'siloed',
            demoKpi: document.getElementById('demoKpi').value,
        };
    }

    function collectPillarData() {
        const pillars = {};
        PILLAR_KEYS.forEach((key) => {
            const matSel = document.querySelector(`[data-maturity="${key}"]`);
            const checks = document.querySelectorAll(`[data-pillar="${key}"]:checked`);
            const totalChecks = document.querySelectorAll(`[data-pillar="${key}"]`).length;
            pillars[key] = {
                maturity: parseInt(matSel?.value || 0),
                checkedCount: checks.length,
                totalChecks,
                coverage: totalChecks > 0 ? checks.length / totalChecks : 0,
            };
        });
        state.pillars = pillars;
    }

    // ── Dynamic Content Generator ──────────────────────
    function generateDynamicContent(step) {
        collectStepData(0);
        collectStepData(1);
        switch (step) {
            case 2: renderInvestmentPlan(); break;
            case 3: renderVendorStrategy(); break;
            case 4: renderTrainingPlan(); break;
            case 5: renderROI(); break;
            case 6: renderReport(); break;
        }
    }

    // ── Utility ────────────────────────────────────────
    function avgMaturity() {
        const vals = PILLAR_KEYS.map((k) => state.pillars[k]?.maturity || 0);
        return vals.reduce((a, b) => a + b, 0) / vals.length;
    }

    function needsStrategy() {
        const m = state.minister;
        return m.aiUsage !== 'none' || m.dataSharing === 'siloed' || avgMaturity() < 2;
    }

    function effortLabel() {
        return state.minister.budgetMode === 'known' ? 'USD' : 'Effort Pts';
    }

    // ── Investment Planner ─────────────────────────────
    function renderInvestmentPlan() {
        const el = document.getElementById('investmentOutput');
        const m = state.minister;
        const avg = avgMaturity();
        const horizon = m.horizon || 12;

        // Effort allocations per plan
        const plans = {
            lean: {
                label: 'Lean',
                desc: 'Minimal viable investment — foundations + 1 pilot. Suitable for conservative risk appetite or very constrained budgets.',
                total: m.budgetMode === 'known' ? Math.round(m.budgetAmount * 0.4) : 100,
                split: { principles: 10, governance: 20, risk: 15, data: 25, capability: 15, implementation: 15 },
                phases: [
                    { month: '1-3', label: 'Foundations', items: 'Principles + governance + data audit' },
                    { month: '4-8', label: 'Pilot', items: '1 use-case pilot + risk assessment' },
                    { month: '9-' + horizon, label: 'Embed', items: 'Training + monitoring + lessons learned' },
                ],
            },
            balanced: {
                label: 'Balanced',
                desc: 'Structured investment across all pillars — 2-3 pilots with proper governance. Recommended for most governments.',
                total: m.budgetMode === 'known' ? Math.round(m.budgetAmount * 0.7) : 200,
                split: { principles: 8, governance: 18, risk: 18, data: 22, capability: 18, implementation: 16 },
                phases: [
                    { month: '1-3', label: 'Foundations', items: 'Principles + governance + data platform + risk framework' },
                    { month: '4-6', label: 'Pilot Wave 1', items: '2 use-case pilots + vendor evaluation' },
                    { month: '7-9', label: 'Pilot Wave 2', items: '1 additional pilot + training rollout' },
                    { month: '10-' + horizon, label: 'Scale', items: 'Scale proven pilots + embed monitoring' },
                ],
            },
            aggressive: {
                label: 'Aggressive',
                desc: 'Maximum pace — parallel workstreams, 3+ pilots, platform build. Requires strong hiring and procurement.',
                total: m.budgetMode === 'known' ? m.budgetAmount : 400,
                split: { principles: 6, governance: 14, risk: 16, data: 24, capability: 20, implementation: 20 },
                phases: [
                    { month: '1-2', label: 'Sprint Setup', items: 'All pillars initiated in parallel' },
                    { month: '3-5', label: 'Build + Pilot', items: '3 pilots + data platform + vendor onboarding' },
                    { month: '6-8', label: 'Scale Wave 1', items: 'Scale 2 pilots + training at scale' },
                    { month: '9-' + horizon, label: 'Scale Wave 2', items: 'Full rollout + continuous improvement' },
                ],
            },
        };

        const plan = plans[state.plan];
        const unit = effortLabel();

        // Feasibility flags
        const flags = [];
        if (state.plan === 'aggressive' && m.hiringCap === 'weak') {
            flags.push({ level: 'red', text: 'Aggressive plan requires strong hiring — current capability is weak' });
        }
        if (state.plan !== 'lean' && m.procurementLead === 'slow') {
            flags.push({ level: 'amber', text: 'Slow procurement may delay vendor-dependent workstreams' });
        }
        if (avg < 1 && state.plan === 'aggressive') {
            flags.push({ level: 'red', text: 'Very low maturity — aggressive plan carries high execution risk' });
        }
        if (m.dataSharing === 'siloed') {
            flags.push({ level: 'amber', text: 'Siloed data increases effort required for data pillar' });
        }

        let html = `
            <div class="output-section">
                <h3>${plan.label} Plan — ${horizon}-Month Horizon</h3>
                <p style="color:var(--text-muted);font-size:13px;margin-bottom:16px">${plan.desc}</p>

                <h4>Effort Allocation (Total: ${plan.total.toLocaleString()} ${unit})</h4>
                <div class="effort-bar">
                    ${PILLAR_KEYS.map((k) => {
                        const pct = plan.split[k];
                        return `<div class="effort-segment ${SEG_CLASSES[k]}" style="width:${pct}%"
                            title="${PILLAR_NAMES[k]}: ${pct}%">${pct > 8 ? pct + '%' : ''}</div>`;
                    }).join('')}
                </div>
                <div style="display:flex;flex-wrap:wrap;gap:8px;margin:8px 0 16px">
                    ${PILLAR_KEYS.map((k) => {
                        const amt = Math.round((plan.split[k] / 100) * plan.total);
                        return `<span class="tag tag-blue" style="font-size:11px">
                            ${PILLAR_NAMES[k]}: ${amt.toLocaleString()} ${unit} (${plan.split[k]}%)
                        </span>`;
                    }).join('')}
                </div>

                <table class="data-table">
                    <thead><tr><th>Pillar</th><th>Current Maturity</th><th>Target (${horizon}m)</th><th>Allocation</th><th>Priority</th></tr></thead>
                    <tbody>
                        ${PILLAR_KEYS.map((k) => {
                            const mat = state.pillars[k]?.maturity || 0;
                            const target = Math.min(4, mat + (state.plan === 'aggressive' ? 2 : state.plan === 'balanced' ? 1.5 : 1));
                            const priority = mat < 2 ? 'High' : mat < 3 ? 'Medium' : 'Low';
                            const tagClass = priority === 'High' ? 'tag-red' : priority === 'Medium' ? 'tag-amber' : 'tag-green';
                            const amt = Math.round((plan.split[k] / 100) * plan.total);
                            return `<tr>
                                <td><strong>${PILLAR_NAMES[k]}</strong></td>
                                <td>${['Not started','Awareness','Developing','Established','Advanced'][mat]}</td>
                                <td>${target.toFixed(1)}</td>
                                <td>${amt.toLocaleString()} ${unit}</td>
                                <td><span class="tag ${tagClass}">${priority}</span></td>
                            </tr>`;
                        }).join('')}
                    </tbody>
                </table>
            </div>

            <div class="output-section">
                <h3>Implementation Timeline</h3>
                <div class="timeline">
                    ${plan.phases.map((p) => `
                        <div class="timeline-item">
                            <div class="timeline-phase">Month ${p.month}</div>
                            <div class="timeline-title">${p.label}</div>
                            <div class="timeline-desc">${p.items}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        if (flags.length > 0) {
            html += `
                <div class="output-section">
                    <h3>Feasibility Flags</h3>
                    ${flags.map((f) => `
                        <div class="risk-item">
                            <div class="risk-level risk-${f.level === 'red' ? 'high' : 'medium'}"></div>
                            <div>${f.text}</div>
                        </div>
                    `).join('')}
                </div>
            `;
        }

        el.innerHTML = html;
    }

    // ── Vendor Strategy ────────────────────────────────
    function renderVendorStrategy() {
        const el = document.getElementById('vendorOutput');
        const m = state.minister;
        const avg = avgMaturity();

        const categories = [
            {
                name: 'AI Governance & Model Risk',
                scope: 'Policies, model inventory, monitoring, audits — aligned to NIST RMF functions',
                nist: 'Govern, Map, Measure, Manage',
                priority: avg < 2 ? 'High' : 'Medium',
                delivery: m.hiringCap === 'strong' ? 'In-house first' : 'Partner-led pilot',
            },
            {
                name: 'Data Platform & Integration',
                scope: 'Data quality, master data management, interoperability, cataloguing',
                nist: 'Map (data context)',
                priority: m.dataSharing === 'siloed' ? 'Critical' : m.dataSharing === 'partial' ? 'High' : 'Medium',
                delivery: m.procurementLead === 'slow' ? 'Hybrid delivery' : 'Partner-led pilot',
            },
            {
                name: 'Workflow & Case Management Automation',
                scope: 'Process automation, citizen-facing service digitization',
                nist: 'Manage (operational)',
                priority: m.priorities.includes('citizen_services') || m.priorities.includes('gov_efficiency') ? 'High' : 'Medium',
                delivery: 'Partner-led pilot',
            },
            {
                name: 'LLM Productivity Tools',
                scope: 'Secure internal copilots, document processing, summarization',
                nist: 'Govern (safe use policies)',
                priority: m.aiUsage !== 'none' ? 'Medium' : 'Low',
                delivery: m.riskAppetite === 'conservative' ? 'In-house first' : 'Hybrid delivery',
            },
            {
                name: 'Assurance & Evaluation',
                scope: 'Testing, transparency, bias/safety checks — aligned to UK principles & NIST measurement',
                nist: 'Measure, Manage',
                priority: 'High',
                delivery: m.hiringCap === 'weak' ? 'Partner-led pilot' : 'Hybrid delivery',
            },
        ];

        // Procurement logic
        const procDecision = m.procurementLead === 'fast' ? 'Can pursue parallel vendor tracks' :
            m.procurementLead === 'slow' ? 'Sequential procurement — start with highest priority' :
                'Standard procurement — batch by priority tier';

        let html = `
            <div class="output-section">
                <h3>Procurement Approach</h3>
                <p style="font-size:13px;color:var(--text-muted);margin-bottom:12px">${procDecision}</p>
                <div style="display:flex;gap:12px;flex-wrap:wrap;margin-bottom:8px">
                    <span class="tag tag-blue">Lead time: ${m.procurementLead}</span>
                    <span class="tag tag-blue">Risk appetite: ${m.riskAppetite}</span>
                    <span class="tag tag-blue">Data readiness: ${m.dataSharing}</span>
                    <span class="tag tag-blue">Hiring: ${m.hiringCap}</span>
                </div>
            </div>

            <div class="output-section">
                <h3>Vendor Categories & Delivery Model</h3>
                ${categories.map((c) => {
                    const tagClass = c.priority === 'Critical' ? 'tag-red' : c.priority === 'High' ? 'tag-amber' : c.priority === 'Medium' ? 'tag-blue' : 'tag-green';
                    return `
                        <div class="vendor-category">
                            <h4>${c.name}</h4>
                            <div class="vendor-scope">${c.scope}</div>
                            <div class="vendor-meta">
                                <span><strong>Priority:</strong> <span class="tag ${tagClass}">${c.priority}</span></span>
                                <span><strong>NIST:</strong> ${c.nist}</span>
                                <span><strong>Delivery:</strong> ${c.delivery}</span>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>

            <div class="output-section">
                <h3>Build / Buy / Partner Decision Matrix</h3>
                <table class="data-table">
                    <thead><tr><th>Workstream</th><th>Decision</th><th>Rationale</th></tr></thead>
                    <tbody>
                        ${categories.map((c) => {
                            let decision, rationale;
                            if (c.delivery === 'In-house first') {
                                decision = 'Build';
                                rationale = 'Strong internal capability — start in-house, extend later if needed';
                            } else if (c.delivery === 'Partner-led pilot') {
                                decision = 'Buy (pilot)';
                                rationale = 'Capability gaps or procurement constraints — engage vendor for initial pilot';
                            } else {
                                decision = 'Partner';
                                rationale = 'Hybrid delivery — internal team with vendor support for specialist capability';
                            }
                            return `<tr><td><strong>${c.name}</strong></td><td><span class="tag tag-purple">${decision}</span></td><td>${rationale}</td></tr>`;
                        }).join('')}
                    </tbody>
                </table>
            </div>

            <div class="output-section">
                <h3>Evaluation Criteria (UK Principles + NIST)</h3>
                <table class="data-table">
                    <thead><tr><th>Criterion</th><th>Framework</th><th>Weight</th><th>Assessment Method</th></tr></thead>
                    <tbody>
                        <tr><td>Safety & robustness</td><td>UK + NIST Manage</td><td>25%</td><td>Technical evaluation + pen testing</td></tr>
                        <tr><td>Transparency & explainability</td><td>OECD + UK</td><td>20%</td><td>Documentation review + demos</td></tr>
                        <tr><td>Fairness & bias</td><td>OECD + NIST Measure</td><td>20%</td><td>Bias testing on representative data</td></tr>
                        <tr><td>Accountability & governance</td><td>UK + NIST Govern</td><td>15%</td><td>Audit trail + governance docs</td></tr>
                        <tr><td>Data handling & privacy</td><td>UNESCO</td><td>10%</td><td>Data processing assessment</td></tr>
                        <tr><td>Scalability & interoperability</td><td>Operational</td><td>10%</td><td>Architecture review + API testing</td></tr>
                    </tbody>
                </table>
            </div>
        `;

        el.innerHTML = html;
    }

    // ── Training Planner ───────────────────────────────
    function renderTrainingPlan() {
        const el = document.getElementById('trainingOutput');
        const m = state.minister;

        const cohorts = [
            {
                role: 'Executives / Ministers',
                pillars: 'Governance, Risk',
                topics: 'AI governance, risk landscape, decision rights, strategic oversight',
                hours: '2-4',
                people: '10-20',
                urgency: 'Immediate',
                timeToImpact: '1-2 months',
            },
            {
                role: 'Policy & Legal',
                pillars: 'Risk, Principles, Implementation',
                topics: 'Responsible AI, impact assessments, procurement clauses, regulatory frameworks',
                hours: '8-16',
                people: '20-40',
                urgency: 'Immediate',
                timeToImpact: '2-3 months',
            },
            {
                role: 'Service Owners',
                pillars: 'Implementation, Capability',
                topics: 'Use-case design, KPI trajectories, change management, pilot methodology',
                hours: '8-16',
                people: '30-60',
                urgency: 'Phase 1',
                timeToImpact: '3-4 months',
            },
            {
                role: 'Data / IT Teams',
                pillars: 'Data, Risk, Implementation',
                topics: 'Data readiness, MLOps, security, model evaluation, monitoring',
                hours: '20-40',
                people: '15-30',
                urgency: 'Immediate',
                timeToImpact: '3-6 months',
            },
            {
                role: 'Frontline Staff',
                pillars: 'Capability, Principles',
                topics: 'Safe use of AI tools, process changes, escalation procedures',
                hours: '2-6',
                people: '100-500',
                urgency: 'Phase 2',
                timeToImpact: '4-6 months',
            },
        ];

        // Compute cost estimates
        const costPerHour = m.budgetMode === 'known' ? 150 : 1; // rough $/hour or effort pts
        const unit = effortLabel();

        let totalMinHours = 0;
        let totalMaxHours = 0;

        const rows = cohorts.map((c) => {
            const [minH, maxH] = c.hours.split('-').map(Number);
            const [minP, maxP] = c.people.split('-').map(Number);
            const minCost = minH * minP * costPerHour;
            const maxCost = maxH * maxP * costPerHour;
            totalMinHours += minH * minP;
            totalMaxHours += maxH * maxP;
            return { ...c, minCost, maxCost, minTotal: minH * minP, maxTotal: maxH * maxP };
        });

        let html = `
            <div class="output-section">
                <h3>Role-Based Training Cohorts</h3>
                <p style="font-size:13px;color:var(--text-muted);margin-bottom:16px">
                    Mapped to policy pillars (Capability + Governance). Aligned to UNESCO AI literacy and OECD human capacity recommendations.
                </p>
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Cohort</th>
                            <th>Pillar Link</th>
                            <th>Key Topics</th>
                            <th>Hours/Person</th>
                            <th>Est. People</th>
                            <th>Urgency</th>
                            <th>Time to Impact</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${rows.map((r) => `
                            <tr>
                                <td><strong>${r.role}</strong></td>
                                <td><span class="tag tag-blue">${r.pillars}</span></td>
                                <td style="font-size:12px">${r.topics}</td>
                                <td>${r.hours}</td>
                                <td>${r.people}</td>
                                <td><span class="tag ${r.urgency === 'Immediate' ? 'tag-red' : 'tag-amber'}">${r.urgency}</span></td>
                                <td>${r.timeToImpact}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>

            <div class="output-section">
                <h3>Cost & Capacity Summary</h3>
                <table class="data-table">
                    <thead><tr><th>Cohort</th><th>Total Person-Hours (Range)</th><th>Est. Cost (${unit})</th></tr></thead>
                    <tbody>
                        ${rows.map((r) => `
                            <tr>
                                <td><strong>${r.role}</strong></td>
                                <td>${r.minTotal.toLocaleString()} — ${r.maxTotal.toLocaleString()}</td>
                                <td>${r.minCost.toLocaleString()} — ${r.maxCost.toLocaleString()}</td>
                            </tr>
                        `).join('')}
                        <tr style="background:var(--bg-light);font-weight:700">
                            <td>TOTAL</td>
                            <td>${totalMinHours.toLocaleString()} — ${totalMaxHours.toLocaleString()}</td>
                            <td>${(totalMinHours * costPerHour).toLocaleString()} — ${(totalMaxHours * costPerHour).toLocaleString()}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div class="output-section">
                <h3>Capacity Constraints & Sequencing</h3>
                <div class="timeline">
                    <div class="timeline-item">
                        <div class="timeline-phase">Immediate (Month 1-2)</div>
                        <div class="timeline-title">Executive + Policy + Data/IT teams</div>
                        <div class="timeline-desc">Governance understanding and technical readiness must precede pilots</div>
                    </div>
                    <div class="timeline-item">
                        <div class="timeline-phase">Phase 1 (Month 3-5)</div>
                        <div class="timeline-title">Service Owners</div>
                        <div class="timeline-desc">Aligned to pilot initiation — need use-case design skills before pilot kickoff</div>
                    </div>
                    <div class="timeline-item">
                        <div class="timeline-phase">Phase 2 (Month 6-${m.horizon || 12})</div>
                        <div class="timeline-title">Frontline Staff</div>
                        <div class="timeline-desc">Timed to coincide with pilot scaling — training on actual tools and processes</div>
                    </div>
                </div>
                ${m.hiringCap === 'weak' ? `
                    <div class="risk-item" style="margin-top:12px">
                        <div class="risk-level risk-high"></div>
                        <div><strong>Hiring constraint:</strong> Weak hiring capability means training must compensate — consider external trainers or partnered delivery.</div>
                    </div>
                ` : ''}
            </div>
        `;

        el.innerHTML = html;
    }

    // ── ROI & Evidence ─────────────────────────────────
    function renderROI() {
        const el = document.getElementById('roiOutput');
        const m = state.minister;
        const kpiMap = {
            permit_time: {
                label: 'Permit Approval Time',
                baseline: '30 days avg',
                lowRange: '15-20%',
                highRange: '30-45%',
                lowPct: 15, highPct: 45,
                unit: 'reduction',
            },
            digital_uptake: {
                label: 'Digital Uptake Rate',
                baseline: '35% of services',
                lowRange: '10-15%',
                highRange: '25-40%',
                lowPct: 10, highPct: 40,
                unit: 'increase',
            },
            fraud_leakage: {
                label: 'Fraud/Leakage Reduction',
                baseline: '3-5% of expenditure',
                lowRange: '20-30%',
                highRange: '40-60%',
                lowPct: 20, highPct: 60,
                unit: 'reduction',
            },
            call_center: {
                label: 'Call Center Resolution',
                baseline: '12 min avg / 65% FCR',
                lowRange: '15-20%',
                highRange: '30-50%',
                lowPct: 15, highPct: 50,
                unit: 'improvement',
            },
        };

        const kpi = kpiMap[m.demoKpi] || kpiMap.permit_time;

        const roiMetrics = [
            { label: 'Staff Time Saved', low: '10-15%', high: '25-40%', lowPct: 10, highPct: 40, color: '#2A7F8E' },
            { label: 'Service Cycle-Time Reduction', low: kpi.lowRange, high: kpi.highRange, lowPct: kpi.lowPct, highPct: kpi.highPct, color: '#1B3A5C' },
            { label: 'Leakage/Error Reduction', low: '15-25%', high: '35-55%', lowPct: 15, highPct: 55, color: '#D4A843' },
            { label: 'Compliance Risk Avoided', low: '20-30%', high: '40-60%', lowPct: 20, highPct: 60, color: '#2E8B57' },
            { label: 'Citizen Satisfaction (proxy)', low: '5-10 NPS pts', high: '15-25 NPS pts', lowPct: 10, highPct: 25, color: '#8B5CF6' },
        ];

        // Adjust ranges based on plan aggressiveness
        const multiplier = state.plan === 'lean' ? 0.7 : state.plan === 'aggressive' ? 1.3 : 1.0;

        let html = `
            <div class="output-section">
                <h3>Benefits Model — ${kpi.label}</h3>
                <p style="font-size:13px;color:var(--text-muted);margin-bottom:8px">
                    Baseline: <strong>${kpi.baseline}</strong> | Horizon: <strong>${m.horizon || 12} months</strong> | Plan: <strong>${state.plan}</strong>
                </p>
                <p style="font-size:12px;color:var(--text-light);margin-bottom:16px">
                    Ranges shown reflect uncertainty — not fake precision. Actual outcomes depend on implementation quality, data readiness, and change adoption.
                </p>

                ${roiMetrics.map((r) => {
                    const adjLow = Math.round(r.lowPct * multiplier);
                    const adjHigh = Math.round(r.highPct * multiplier);
                    return `
                        <div class="roi-metric">
                            <div class="roi-label">${r.label}</div>
                            <div class="roi-range">
                                <div class="roi-bar-bg">
                                    <div class="roi-bar-fill" style="left:${adjLow}%;width:${adjHigh - adjLow}%;background:${r.color};opacity:0.6"></div>
                                </div>
                                <div class="roi-values">${adjLow}% — ${adjHigh}% ${r.label.includes('Satisfaction') ? '' : r.label.includes('Saved') ? 'saved' : r.unit || 'improvement'}</div>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>

            <div class="output-section">
                <h3>Evidence Plan</h3>
                <table class="data-table">
                    <thead><tr><th>Element</th><th>Approach</th><th>Cadence</th></tr></thead>
                    <tbody>
                        <tr>
                            <td><strong>Baseline KPIs</strong></td>
                            <td>Measure current state for ${kpi.label} + staff time + error rates before pilot launch</td>
                            <td>One-time (pre-pilot)</td>
                        </tr>
                        <tr>
                            <td><strong>Measurement</strong></td>
                            <td>Automated dashboards tracking KPI movement vs baseline</td>
                            <td>Monthly</td>
                        </tr>
                        <tr>
                            <td><strong>Control Group</strong></td>
                            <td>Phased rollout: pilot group vs business-as-usual comparison for first 3-6 months</td>
                            <td>Per pilot wave</td>
                        </tr>
                        <tr>
                            <td><strong>Benefits Attribution</strong></td>
                            <td>Isolate AI contribution from other changes using contribution analysis methodology</td>
                            <td>Quarterly review</td>
                        </tr>
                        <tr>
                            <td><strong>Stocktake</strong></td>
                            <td>Full benefits review with steering committee — update projections, adjust plans</td>
                            <td>Every ${Math.max(3, Math.round((m.horizon || 12) / 4))} months</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div class="output-section">
                <h3>Risk & Controls Checklist (NIST-Style)</h3>
                <p style="font-size:12px;color:var(--text-light);margin-bottom:12px">Aligned to NIST AI RMF: Map / Measure / Manage</p>

                <div class="risk-item">
                    <div class="risk-level risk-high"></div>
                    <div><strong>Bias & fairness risk</strong> — AI decisions may disproportionately affect certain groups. <em>Control: Pre-deployment bias testing + ongoing monitoring (NIST Measure)</em></div>
                </div>
                <div class="risk-item">
                    <div class="risk-level risk-high"></div>
                    <div><strong>Data quality & completeness</strong> — Poor data leads to unreliable AI outputs. <em>Control: Data quality audits + validation gates (NIST Map)</em></div>
                </div>
                <div class="risk-item">
                    <div class="risk-level risk-medium"></div>
                    <div><strong>Privacy & security</strong> — Personal data exposure in AI pipelines. <em>Control: Privacy impact assessments + data minimisation (UNESCO)</em></div>
                </div>
                <div class="risk-item">
                    <div class="risk-level risk-medium"></div>
                    <div><strong>Model drift & degradation</strong> — Performance decays over time without monitoring. <em>Control: Continuous monitoring + retraining triggers (NIST Manage)</em></div>
                </div>
                <div class="risk-item">
                    <div class="risk-level risk-medium"></div>
                    <div><strong>Vendor lock-in</strong> — Over-dependence on single vendor platform. <em>Control: Interoperability requirements + exit clauses in contracts</em></div>
                </div>
                <div class="risk-item">
                    <div class="risk-level risk-low"></div>
                    <div><strong>Change resistance</strong> — Staff pushback on AI-enabled processes. <em>Control: Training program + phased rollout + feedback loops (NIST Govern)</em></div>
                </div>
                <div class="risk-item">
                    <div class="risk-level risk-low"></div>
                    <div><strong>Benefits realisation gap</strong> — ROI projections not met. <em>Control: Evidence plan + quarterly stocktakes + adaptive management</em></div>
                </div>
            </div>
        `;

        el.innerHTML = html;
    }

    // ── Decisions Report ───────────────────────────────
    function renderReport() {
        const el = document.getElementById('reportOutput');
        const m = state.minister;
        const avg = avgMaturity();
        const horizon = m.horizon || 12;

        // Decision 1: Do we need a national AI strategy?
        const needsStrat = needsStrategy();
        const d1Class = needsStrat ? 'recommend-yes' : 'recommend-no';
        const d1Rec = needsStrat
            ? `<strong>YES</strong> — AI is already in use (${m.aiUsage}), data sharing is ${m.dataSharing}, and average pillar maturity is ${avg.toFixed(1)}/4. You need common principles, governance, and risk management aligned to OECD/NIST.`
            : `<strong>Lightweight policy first</strong> — AI usage is minimal. Start with principles + governance + procurement guardrails, then build a full strategy after 2-3 pilots prove value.`;

        // Decision 2: Where to invest first?
        const foundationsFirst = avg < 2 || m.dataSharing === 'siloed';
        const d2Detail = foundationsFirst
            ? `<strong>Foundations first</strong> (data + governance + RAI) because maturity is low (${avg.toFixed(1)}/4) and data is ${m.dataSharing}. Tooling ROI won't land without it.`
            : `<strong>Parallel investment</strong> — maturity is sufficient to run pilots alongside foundation strengthening.`;

        // Decision 3: Vendors
        const vendorApproach = m.hiringCap === 'strong' ? 'In-house first, vendor augmentation for specialist areas'
            : m.hiringCap === 'moderate' ? 'Hybrid delivery — partner-led pilots with internal ownership'
            : 'Vendor-led with knowledge transfer — hiring constraints require external delivery';

        // Decision 4: Training
        const trainingUrgency = avg < 2 ? 'Immediate — governance and technical training must precede pilots'
            : 'Phase with implementation — training cohorts aligned to pilot waves';

        // Decision 5: ROI
        const kpiLabels = {
            permit_time: 'Permit Approval Time',
            digital_uptake: 'Digital Uptake Rate',
            fraud_leakage: 'Fraud/Leakage Reduction',
            call_center: 'Call Center Resolution',
        };

        let html = `
            <div class="output-section">
                <h3>Minister Briefing — 5 Key Decisions</h3>
                <p style="font-size:13px;color:var(--text-muted);margin-bottom:20px">
                    Based on your inputs: ${m.priorities.length} priorities selected | Risk appetite: ${m.riskAppetite} |
                    AI usage: ${m.aiUsage} | Data: ${m.dataSharing} | Avg maturity: ${avg.toFixed(1)}/4
                </p>
            </div>

            <div class="decision-card ${d1Class}">
                <div class="decision-num">Decision 1</div>
                <h3>Do we need a national AI strategy?</h3>
                <div class="decision-recommendation ${needsStrat ? 'rec-yes' : 'rec-no'}">
                    ${d1Rec}
                </div>
                <div class="decision-detail">
                    <ul>
                        <li>Current AI usage: <strong>${m.aiUsage}</strong></li>
                        <li>Data sharing: <strong>${m.dataSharing}</strong></li>
                        <li>Procurement: <strong>${m.procurementLead === 'slow' ? 'ad-hoc / slow' : m.procurementLead}</strong></li>
                        <li>Framework alignment: OECD AI Principles + NIST AI RMF</li>
                    </ul>
                </div>
            </div>

            <div class="decision-card recommend-info">
                <div class="decision-num">Decision 2</div>
                <h3>Where should we invest first?</h3>
                <div class="decision-recommendation rec-info">
                    ${d2Detail}
                </div>
                <div class="decision-detail">
                    <p><strong>Recommended sequence:</strong></p>
                    <ol>
                        <li><strong>Foundations</strong> (data + governance + RAI) — aligned to UNESCO data policy focus & NIST "Govern" as cross-cutting</li>
                        <li><strong>Use-case pilots</strong> (service outcomes) — 2-3 carefully selected pilots</li>
                        <li><strong>Scale platform/tooling</strong> — only after proven pilots demonstrate value</li>
                    </ol>
                </div>
            </div>

            <div class="decision-card recommend-info">
                <div class="decision-num">Decision 3</div>
                <h3>Vendors: should we buy, and what types?</h3>
                <div class="decision-recommendation rec-info">
                    <strong>${vendorApproach}</strong>
                </div>
                <div class="decision-detail">
                    <p><strong>Recommended vendor categories:</strong></p>
                    <ul>
                        <li>AI Governance / Model Risk (NIST RMF functions)</li>
                        <li>Data Platform & Integration (quality, master data, interoperability)</li>
                        <li>Workflow/Case Management + Automation</li>
                        <li>LLM Productivity Tools (secure internal copilots)</li>
                        <li>Assurance & Evaluation (testing, transparency, bias/safety checks)</li>
                    </ul>
                    <p style="margin-top:8px"><strong>Procurement logic:</strong> ${m.procurementLead} lead time + ${m.riskAppetite} risk appetite + ${m.dataSharing} data readiness
                        → ${m.procurementLead === 'slow' ? 'sequential' : 'parallel'} procurement tracks</p>
                </div>
            </div>

            <div class="decision-card recommend-info">
                <div class="decision-num">Decision 4</div>
                <h3>Training: who, what, and how much?</h3>
                <div class="decision-recommendation rec-info">
                    <strong>${trainingUrgency}</strong>
                </div>
                <div class="decision-detail">
                    <table class="data-table" style="margin-top:8px">
                        <thead><tr><th>Cohort</th><th>Focus</th><th>Hours/Person</th></tr></thead>
                        <tbody>
                            <tr><td>Executives/Ministers</td><td>AI governance, risk, decision rights</td><td>2-4 hrs</td></tr>
                            <tr><td>Policy & Legal</td><td>RAI, impact assessments, procurement clauses</td><td>8-16 hrs</td></tr>
                            <tr><td>Service Owners</td><td>Use-case design, KPIs, change management</td><td>8-16 hrs</td></tr>
                            <tr><td>Data/IT</td><td>Data readiness, MLOps, security, evaluation</td><td>20-40 hrs</td></tr>
                            <tr><td>Frontline Staff</td><td>Safe use of AI tools + process changes</td><td>2-6 hrs</td></tr>
                        </tbody>
                    </table>
                    <p style="margin-top:8px;font-size:12px;color:var(--text-light)">Aligned to UNESCO AI literacy emphasis and OECD human capacity recommendations</p>
                </div>
            </div>

            <div class="decision-card recommend-yes">
                <div class="decision-num">Decision 5</div>
                <h3>ROI: what will we get back and how do we prove it?</h3>
                <div class="decision-recommendation rec-yes">
                    <strong>Primary KPI: ${kpiLabels[m.demoKpi] || 'Permit Approval Time'}</strong> — ranges (not point estimates) across ${horizon} months
                </div>
                <div class="decision-detail">
                    <p><strong>Expected benefits (ranges):</strong></p>
                    <ul>
                        <li>Staff time saved: 10-40%</li>
                        <li>Service cycle-time reduction: 15-45%</li>
                        <li>Leakage/error reduction: 15-55%</li>
                        <li>Compliance risk avoided: 20-60%</li>
                        <li>Citizen satisfaction proxy: +5 to +25 NPS points</li>
                    </ul>
                    <p style="margin-top:8px"><strong>Evidence plan:</strong></p>
                    <ul>
                        <li>Baseline KPI measurement before pilot launch</li>
                        <li>Monthly automated dashboards</li>
                        <li>Control group via phased rollout</li>
                        <li>Contribution analysis for benefits attribution</li>
                        <li>Quarterly stocktakes with steering committee</li>
                        <li>NIST Map/Measure/Manage risk register</li>
                    </ul>
                </div>
            </div>

            <div class="output-section">
                <h3>Governance Pack Summary</h3>
                <table class="data-table">
                    <thead><tr><th>Document</th><th>Content</th><th>Framework</th></tr></thead>
                    <tbody>
                        <tr><td><strong>AI Principles Charter</strong></td><td>National AI principles statement — human rights, fairness, transparency, safety, accountability</td><td>OECD AI Principles</td></tr>
                        <tr><td><strong>Governance Framework</strong></td><td>Roles, decision rights, oversight body ToR, escalation pathways</td><td>OECD + UK Principles</td></tr>
                        <tr><td><strong>Risk Management Profile</strong></td><td>NIST RMF profile: Govern/Map/Measure/Manage functions + impact assessment templates</td><td>NIST AI RMF</td></tr>
                        <tr><td><strong>Data Policy</strong></td><td>Data sharing agreements, quality standards, security requirements, interoperability</td><td>UNESCO</td></tr>
                        <tr><td><strong>Procurement Standards</strong></td><td>Vendor evaluation criteria, assurance requirements, contract clauses</td><td>UK Cross-Sector</td></tr>
                        <tr><td><strong>Training & Capability Plan</strong></td><td>Role-based training matrix, delivery schedule, capacity plan</td><td>UNESCO + OECD</td></tr>
                        <tr><td><strong>Benefits & Evidence Plan</strong></td><td>KPI framework, measurement approach, stocktake schedule</td><td>All frameworks</td></tr>
                    </tbody>
                </table>
            </div>

            <div class="output-section">
                <h3>Implementation Roadmap — ${horizon} Months</h3>
                <div class="timeline">
                    <div class="timeline-item">
                        <div class="timeline-phase">Month 1-2: Foundation Sprint</div>
                        <div class="timeline-title">Establish governance + principles + risk framework</div>
                        <div class="timeline-desc">Approve AI principles charter, set up oversight body, initiate data audit, begin executive training</div>
                    </div>
                    <div class="timeline-item">
                        <div class="timeline-phase">Month 3-4: Pilot Preparation</div>
                        <div class="timeline-title">Select pilots + vendor evaluation + data readiness</div>
                        <div class="timeline-desc">Identify 2-3 use cases, run procurement for priority vendors, establish baselines, train service owners</div>
                    </div>
                    <div class="timeline-item">
                        <div class="timeline-phase">Month 5-8: Pilot Delivery</div>
                        <div class="timeline-title">Execute pilots + monitor + iterate</div>
                        <div class="timeline-desc">Deploy pilots with control groups, monthly measurement, risk monitoring, iterate based on evidence</div>
                    </div>
                    <div class="timeline-item">
                        <div class="timeline-phase">Month 9-${horizon}: Scale & Embed</div>
                        <div class="timeline-title">Scale proven pilots + institutionalise</div>
                        <div class="timeline-desc">Roll out successful pilots, train frontline staff, embed governance, publish stocktake report</div>
                    </div>
                </div>
            </div>
        `;

        el.innerHTML = html;
    }

    // ── Init ───────────────────────────────────────────
    goToStep(0);
})();
