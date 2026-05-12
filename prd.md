# Product Requirements Document (PRD)
## FunnelLens - Campaign Diagnostic Agent

| Field | Detail |
|-------|--------|
| **Product** | Campaign Diagnostic Agent |
| **Version** | v1.0 MVP |
| **Status** | Draft |
| **Date** | May 8, 2026 |
| **Author** | Jenny Park |
| **Vertical** | Legal Lead Generation (Multi-vertical config from Phase 1) |

---

## 1. Problem Summary

Media buyers managing legal lead generation campaigns spend 2-4 hours per underperforming campaign manually triangulating data across Meta Ads Manager, Google Analytics, form analytics, and CRM to diagnose root cause. Existing tools (Adalysis, Sprinklr, Formstack) report *what* happened but not *why* — and critically, none can distinguish between "this form question has high drop-off because it's correctly filtering unqualified leads" and "this form question has high drop-off because it's unnecessary UX friction." 

Furthermore, once the diagnosis is complete, the media buyer faces a second unsolved problem: given multiple clients with different payout structures, multiple campaigns with different cost curves, and geographic constraints — **where should the next dollar of budget go to maximize total net profit?** Today this is calculated manually in spreadsheets, taking additional hours and prone to error.

FunnelLens addresses both: **Phase 1 diagnoses the problem. Phase 3 optimizes the solution.

---

## 2. Product Vision

An agent that connects the full lead generation funnel — from ad impression to signed case — diagnoses root causes of underperformance in under 60 seconds, and ultimately tells the media buyer exactly where to allocate budget for maximum profit.

---

## 3. MVP Scope (Phase 1)

### What's In

| Feature | Priority | Rationale |
|---------|----------|-----------|
| CSV upload (4 files) | P0 | No API dependency. Works with any data source. Fastest path to user testing. |
| Campaign metrics diagnosis (CPM, CTR, CPC, CPL) | P0 | Foundation. Every media buyer starts here. |
| Landing page diagnosis (CVR, bounce rate, time on page) | P0 | Campaign-to-form missing link. |
| Form question-level diagnosis (qualification vs. friction classification) | P0 | **Core differentiator.** No competitor does this. |
| Lead quality diagnosis (lead → qualified → signed) | P0 | Closes the full-funnel loop. |
| Root cause ranking | P0 | Diagnosis without prioritization is noise. |
| Actionable recommendations with projected impact | P0 | Diagnosis without prescription is half the value. |
| Text-based diagnostic report output | P0 | Terminal output for MVP, clean formatted report as stretch. |
| Multi-vertical benchmark config (Legal MVA, Mass Tort, Insurance, Senior Care) | P0 | Config-driven architecture. Proof of extensibility from day one. |
| Benchmark manual override + change history log | P1 | Establishes "benchmarks are living assets" design principle. |
| Legal vertical benchmarks (hardcoded for MVP with manual edit capability) | P0 | Domain-specific intelligence. |

### What's Out (Phase 2+)

| Feature | Rationale for deferral |
|---------|----------------------|
| Meta Ads API / Google Ads API integration | CSV upload removes integration complexity for initial validation |
| Google Analytics / Form builder / CRM API integration | Manual export is acceptable for MVP user base |
| Real-time alerting (CPA threshold breach) | Weekly batch diagnosis is sufficient for initial use case |
| Temporal anomaly detection (yesterday vs. today comparison) | Requires continuous data ingestion — Phase 2 |
| A/B test variant auto-generation | Requires recommendation validation before building execution layer |
| Auto-execution of recommendations (budget reallocation, form editing) | High-risk feature. Human-in-the-loop required for trust building |
| Multi-vertical support (insurance, senior care) | Single-vertical focus reduces complexity and strengthens domain moat |
| Dashboard / UI | Terminal output validates the core logic before investing in frontend |
| Historical trend analysis | Single snapshot MVP — trends come with continuous data |
| Google Ads support | Meta-first to match primary user base |

### What's Out (Phase 3)

| Feature | Rationale for deferral |
|---------|----------------------|
| Ad Allocation Simulator (multi-campaign budget optimization) | Requires validated diagnostic engine (Phase 1) and continuous data ingestion (Phase 2) before allocation logic can be reliable. Built on same math as multi-client, multi-state ROAS optimization: optimize campaign volume mix across clients with different payouts, geographic constraints, and cost curves to maximize blended net profit. |
| Cross-client anonymized benchmark learning | Requires sufficient client base for statistical significance |
| Dashboard with portfolio-level view | Requires Phase 2 data pipeline |

---

## 4. User Personas

### Primary: Performance Media Buyer (Legal Vertical)

| Attribute | Detail |
|-----------|--------|
| **Who** | Manages 5-20 Meta campaigns across multiple states and case types (MVA, mass tort) |
| **Current workflow** | Exports data manually from 4+ platforms → builds pivot tables → mentally runs diagnostic tree → writes client Slack message with findings → manually calculates budget allocation in spreadsheets |
| **Biggest pain** | "I know something is wrong, but I spend 2 hours figuring out WHAT exactly is wrong before I can even start fixing it. Then I spend another hour figuring out WHERE to move the budget." |
| **Success with FunnelLens** | Phase 1: Uploads 4 CSVs → receives root cause + prioritized action items in <10 seconds. Phase 3: Enters client payout/cap constraints → receives optimal campaign allocation in <30 seconds. Spends saved time actually fixing problems. |

### Secondary: Marketing Manager / Client

| Attribute | Detail |
|-----------|--------|
| **Who** | Receives weekly performance reports from media buyer. Non-technical. |
| **Current workflow** | Asks "Why is CPA up?" → waits hours for media buyer to investigate → receives explanation they can't fully verify → asks "So where should we spend more?" → waits additional hours |
| **Biggest pain** | "I don't know if the media buyer's diagnosis is correct, or if they're just guessing. And I can't independently verify the budget allocation logic." |
| **Success with FunnelLens** | Receives standardized diagnostic output + allocation recommendation with clear evidence chain — builds trust and speeds up budget approval decisions. ||

---

## 5. User Stories (MVP)

### Epic 1: Data Input

| ID | User Story | Acceptance Criteria |
|----|-----------|---------------------|
| US-1.1 | As a media buyer, I want to upload my campaign performance CSV so that the agent can analyze my ad metrics | CSV with columns `date, campaign_name, impressions, clicks, spend, leads` is accepted. Validation error shown for missing required columns. |
| US-1.2 | As a media buyer, I want to upload my landing page CSV so that page performance is included in diagnosis | CSV with columns `date, page_views, form_starts, form_submits, bounce_rate, avg_time_on_page_sec` is accepted. |
| US-1.3 | As a media buyer, I want to upload my form analytics CSV so that question-level drop-off is analyzed | CSV with columns `step, question, type, started, completed` is accepted. `type` must be one of: `qualification`, `friction`, `friction_heavy`. |
| US-1.4 | As a media buyer, I want to upload my sales/CRM summary so that lead quality is included in diagnosis | JSON or CSV with fields `total_leads, calls_connected, qualified_calls, cases_signed, sales_feedback` is accepted. |
| US-1.5 | As a media buyer, I want a clear error message if my CSV is malformed so I can fix it and retry | Specific error messages: missing column name, wrong data type, empty file, unparseable rows. |


### Epic 2: Campaign Diagnosis

| ID | User Story | Acceptance Criteria |
|----|-----------|---------------------|
| US-2.1 | As a media buyer, I want the agent to flag campaigns with abnormally high CPM so I know if competition or saturation is the issue | CPM compared to active vertical benchmark. Finding includes actual CPM value and campaign name. |
| US-2.2 | As a media buyer, I want the agent to flag campaigns with abnormally low CTR so I know if creative/hook is the problem | CTR compared to active vertical benchmark. Finding suggests creative refresh angle. |
| US-2.3 | As a media buyer, I want the agent to calculate CPL per campaign and compare to benchmark so I know overall campaign health | CPL compared to active vertical benchmark with severity indicator. |

### Epic 3: Landing Page Diagnosis

| ID | User Story | Acceptance Criteria |
|----|-----------|---------------------|
| US-3.1 | As a media buyer, I want the agent to flag low landing page CVR so I know if there's an ad-to-page disconnect | Overall CVR compared to benchmark. Recommendation includes "Test headline complex alignment with ad angle." |
| US-3.2 | As a media buyer, I want the agent to flag high bounce rate or low time-on-page so I know if users are leaving immediately | Bounce rate and avg time compared to benchmark thresholds. |

### Epic 4: Form Question-Level Diagnosis (Core Differentiator)

| ID | User Story | Acceptance Criteria |
|----|-----------|---------------------|
| US-4.1 | As a media buyer, I want the agent to distinguish between qualification questions and friction questions so I know which drop-off is healthy and which is harmful | Questions tagged `qualification` compared to min/max thresholds. Questions tagged `friction` or `friction_heavy` compared to max thresholds. |
| US-4.2 | As a media buyer, I want the agent to flag friction questions that have unusually high drop-off so I can prioritize removing or moving them | `friction_heavy` question exceeding max triggers critical finding with specific recommendation. |
| US-4.3 | As a media buyer, I want the agent to flag qualification questions that have too-low drop-off (not filtering enough) so I know lead quality may be suffering downstream | `qualification` question below min threshold triggers warning with recommendation to strengthen wording. |
| US-4.4 | As a media buyer, I want the agent to tell me which specific question position is problematic so I know exactly where to focus | Output includes step number and question text. |

### Epic 5: Lead Quality Diagnosis (Full-Funnel Closure)

| ID | User Story | Acceptance Criteria |
|----|-----------|---------------------|
| US-5.1 | As a media buyer, I want the agent to flag low lead-to-qualified conversion so I know if my form is letting too many unqualified leads through | Qualify rate compared to benchmark. Agent cross-references with form qualification question drop-off rates. |
| US-5.2 | As a media buyer, I want the agent to flag low qualified-to-signed conversion so I know if there's an offer/pricing/sales issue | Sign rate compared to benchmark. Recommendation distinguishes between sales team issue and expectation gap. |
| US-5.3 | As a media buyer, I want sales team feedback integrated into the diagnosis so qualitative signals are not lost | If `sales_feedback` field is populated, it appears in findings. |

### Epic 6: Root Cause & Recommendations

| ID | User Story | Acceptance Criteria |
|----|-----------|---------------------|
| US-6.1 | As a media buyer, I want the agent to rank root causes by likelihood so I know what to fix first | Output lists root causes in priority order. Most likely cause listed first. |
| US-6.2 | As a media buyer, I want each recommendation to include the expected impact so I can decide whether it's worth acting on | Recommendations include projected metric improvement where calculable. |
| US-6.3 | As a media buyer, I want recommendations to be specific and actionable, not generic | Recommendations reference specific campaign name, question number, or metric. |

### Epic 7: Multi-Vertical Benchmark Configuration

| ID | User Story | Acceptance Criteria |
|----|-----------|---------------------|
| US-7.1 | As a media buyer, I want to switch between verticals (Legal MVA, Mass Tort, Insurance, Senior Care) so benchmarks match my current campaign type | Vertical selector in header. On change, active benchmarks update and diagnosis re-runs if data is loaded. |
| US-7.2 | As a media buyer, I want to view all current benchmark thresholds so I understand what "good" looks like for my vertical | Collapsible benchmark panel shows all thresholds in a clean table format. |
| US-7.3 | As a media buyer, I want to manually override a benchmark threshold so I can adjust for seasonality or client-specific expectations | Edit modal allows changing any threshold value. Reason field is required. Change is logged. |
| US-7.4 | As a media buyer, I want to see who changed what benchmark and why so I can audit adjustments over time | Change history side sheet shows all modifications with timestamp, field, old/new values, and reason. |
| US-7.5 | As a media buyer, I want to reset benchmarks to system defaults so I can revert temporary adjustments | Reset button in edit modal. Confirmation dialog required. Reset is logged. |

### Epic 8: Output & Experience

| ID | User Story | Acceptance Criteria |
|----|-----------|---------------------|
| US-8.1 | As a media buyer, I want results in under 10 seconds from upload so the tool saves me time, not adds friction | End-to-end: upload → diagnosis output in <10 seconds for a single week of data. |
| US-8.2 | As a media buyer, I want findings color-coded by severity so I can scan quickly | 🔴 Critical, 🟡 Warning, ✅ Good, 📝 Informational. |
| US-8.3 | As a media buyer, I want the output grouped into Findings → Recommendations → Root Cause so it follows my mental model | Three clearly labeled sections in output. |

---

## 6. Functional Requirements

### FR-1: Data Ingestion
- FR-1.1: System shall accept CSV uploads for campaign, landing page, and form data.
- FR-1.2: System shall accept JSON input for sales/CRM data.
- FR-1.3: System shall validate required columns and data types on upload.
- FR-1.4: System shall return specific, human-readable error messages for malformed inputs.
- FR-1.5: System shall support a minimum of 5,000 rows of campaign data per upload.

### FR-2: Benchmark Configuration
- FR-2.1: System shall include 4 pre-configured verticals: Legal MVA, Legal Mass Tort, Insurance, Senior Care.
- FR-2.2: All diagnostic thresholds shall be stored in a single configuration structure separated from diagnostic logic.
- FR-2.3: Each benchmark metric shall include three tiers: good, average, bad (or min/max for form question thresholds).
- FR-2.4: Users shall be able to manually override any threshold value with a required reason field.
- FR-2.5: All threshold changes shall be logged with timestamp, field path, old value, new value, reason, and change author.
- FR-2.6: Users shall be able to view change history filtered by current vertical.
- FR-2.7: Users shall be able to reset thresholds to system defaults per vertical.

### FR-3: Diagnostic Engine
- FR-3.1: System shall execute all diagnostics on upload completion.
- FR-3.2: System shall run campaign-level, landing-page-level, form-level, and CRM-level diagnostics in sequence.
- FR-3.3: System shall read all thresholds from the active vertical's benchmark configuration.
- FR-3.4: System shall classify each form question by its `type` field and apply different thresholds for qualification vs. friction questions.
- FR-3.5: System shall generate a root cause summary by pattern-matching findings across all four data sources.
- FR-3.6: System shall re-run diagnosis when the active vertical is changed and data is already loaded.

### FR-4: Output
- FR-4.1: System shall output findings with severity indicators (🔴 🟡 ✅ 📝).
- FR-4.2: System shall output prioritized recommendations with projected impact where calculable.
- FR-4.3: System shall output a root cause summary of 1-3 most likely issues.
- FR-4.4: Total output length shall not exceed 50 lines for readability.
- FR-4.5: Results header shall display the active vertical name.

---

## 7. Non-Functional Requirements

| NFR | Requirement |
|-----|------------|
| **Performance** | Upload-to-output in <10 seconds for ≤1 week of data |
| **Reliability** | Graceful handling of missing optional fields (e.g., `sales_feedback`) |
| **Usability** | Error messages must reference specific column names and rows |
| **Extensibility** | Benchmark configuration maintained in a single structured object separated from diagnostic engine logic. Adding a new vertical requires only adding a new benchmark object — no code changes to the diagnostic engine. |
| **Configurability** | All thresholds are user-editable with audit trail. System supports manual override, change history, and reset-to-defaults per vertical. |
| **Language** | All output in English for MVP |

### 7.1 Multi-Vertical Architecture (Designed for Phase 1, Expandable through Phase 3)

While Phase 1 MVP ships with 4 pre-configured verticals (Legal MVA, Legal Mass Tort, Insurance, Senior Care), the system architecture is designed to support unlimited verticals with zero diagnostic engine changes.

**Design Principle: Configuration-Driven Vertical Support**

Diagnostic logic is completely decoupled from vertical-specific benchmarks. All thresholds, question classifications, and sample data are stored in a single configuration structure:
benchmarks/
├── legal_mva ← Active in Phase 1
├── legal_mass_tort ← Active in Phase 1
├── insurance ← Active in Phase 1
└── senior_care ← Active in Phase 1

text

**What stays the same across verticals:**
- All metric calculations (CPM, CTR, CPC, CPL, CPA)
- Full diagnostic tree (Campaign → Landing Page → Form → Lead Quality)
- Form question classification logic (qualification vs. friction vs. friction-heavy)
- Root cause identification framework (Creative vs. Audience vs. Landing Page vs. Form vs. Sales)
- Output format (Findings → Recommendations → Root Cause)

**What changes per vertical:**
- Benchmark thresholds (e.g., "good" CPL for legal = $150, for insurance = $80)
- Sample data for demos
- Vertical label in UI header

**Why this matters for Phase 3 (Ad Allocation Simulator):**
The Ad Allocation Simulator in Phase 3 will use the same vertical-specific benchmarks to model cost curves. A legal MVA campaign with $150 CPL behaves differently than an insurance campaign with $80 CPL. The config-driven architecture ensures the simulator can optimize allocation across mixed-vertical portfolios without code changes.

---

## 8. Success Metrics

| Metric | Target | Measurement Method |
|--------|--------|-------------------|
| **Time to diagnosis** | <10 seconds from upload | System timestamp |
| **Diagnostic accuracy** | >70% of root causes confirmed by user follow-up | User feedback survey (1-5 scale: "Was the root cause correct?") |
| **Recommendation actionability** | >60% of users say they would act on ≥1 recommendation | User feedback survey post-diagnosis |
| **Retention signal** | >40% of users run ≥2 diagnoses | Usage log |
| **Coverage** | Agent identifies ≥1 finding per diagnostic run (not empty output) | System log |
| **False positive rate** | <20% of 🔴 findings flagged as incorrect by user | User feedback |
| **Vertical switch adoption** | >30% of users switch verticals at least once | Usage log |

---

## 9. Out of Scope (Explicitly)

### Phase 1 Out of Scope
- ❌ API integrations (Meta Ads, Google Ads, Google Analytics, CRM, Form builders)
- ❌ Real-time data ingestion or alerting
- ❌ Historical trend comparison (only single-period snapshot analysis)
- ❌ A/B test variant auto-generation or execution
- ❌ Campaign budget auto-adjustment
- ❌ Graphical dashboard or web UI beyond single-page diagnostic report
- ❌ Multi-user accounts, authentication, or data persistence
- ❌ Google Ads campaign support
- ❌ Mobile app or notification system
- ❌ Auto-recalibration of benchmarks from trailing data

### Phase 2 Out of Scope (Planned)
- ❌ API integrations and real-time alerting
- ❌ Temporal anomaly detection
- ❌ Dashboard and multi-user support

### Phase 3 Out of Scope (Planned)
- ❌ Ad Allocation Simulator: multi-campaign portfolio optimization across clients with different payout structures, geographic constraints, and cost curves. Built on the same mathematical framework as manual ROAS optimization (Homework 5/6): maximize blended net profit given client caps, per-lead payouts, and campaign cost curves.
- ❌ Cross-client anonymized benchmark learning
- ❌ Auto-execution of budget reallocation

---

## 10. Product Roadmap (3 Phases)
Phase 1: Funnel Diagnostics (MVP)
├── CSV upload → Multi-source diagnosis → Root cause + recommendations
├── 4 vertical benchmark configs with manual override + change history
├── Form question-level qualification vs. friction classification
└── Goal: Validate that automated diagnosis saves time and is accurate

Phase 2: Real-Time Intelligence
├── Meta Ads API, Google Analytics API, Form builder API integration
├── Continuous data ingestion → temporal anomaly detection
├── Real-time CPA threshold alerts (Slack/email)
├── Auto-recalibration of benchmarks based on trailing 90-day data
└── Goal: Reduce time from "problem occurs" to "problem detected" to zero

Phase 3: Ad Allocation Simulator
├── Multi-campaign, multi-client, multi-geo budget optimization
├── Input: Client payout structures, caps, campaign cost curves, geo constraints
├── Output: Optimal campaign volume mix to maximize blended net profit
├── "What-if" sliders: adjust constraints, see projected ROAS impact
├── Aggregator overflow pricing integration
└── Goal: Answer "Where should the next dollar go?" in under 30 seconds

text

---

## 11. Dependency Map
Phase 1 MUST validate:
├── "Does the form-level qualification-vs-friction logic identify root causes?"
├── "Do users trust the recommendations enough to act on them?"
├── "Is multi-vertical config useful or overwhelming for MVP users?"
└── "Is single-period snapshot diagnosis useful without trend data?"

If YES to all three →
Phase 2 unlocks: API integrations, temporal anomaly detection, real-time alerting

Phase 2 MUST establish:
├── Continuous data pipeline with reliable ingestion
├── Validated benchmark ranges across multiple verticals
└── User trust in automated recommendations

If YES to all three →
Phase 3 unlocks: Ad Allocation Simulator can make reliable budget recommendations
because (a) diagnostic engine is trusted, (b) benchmarks are validated,
(c) cost curves are understood per vertical

text

---

## 12. Phase 3 Preview: Ad Allocation Simulator

### Problem
Once a media buyer knows *why* CPA is high (Phase 1 diagnosis) and has continuous monitoring (Phase 2), the next question is: **"Where should I allocate budget across my campaign portfolio to maximize total net profit?"**

Today this is done manually in spreadsheets. Consider the real scenario from training:
Client A: 100 leads across TN, MS, AR, MO, IL — 
325
/
l
e
a
d
p
a
y
o
u
t
C
l
i
e
n
t
B
:
50
l
e
a
d
s
a
c
r
o
s
s
G
A
—
325/leadpayoutClientB:50leadsacrossGA—375/lead payout
Client C (Aggregator): Unlimited excess — $187/lead

Campaign A: GA only — 
210
/
l
e
a
d
c
o
s
t
C
a
m
p
a
i
g
n
B
:
T
N
,
M
S
,
A
R
,
M
O
,
I
L
—
210/leadcostCampaignB:TN,MS,AR,MO,IL—115/lead cost
Campaign C: All 6 states — $140/lead cost, ~10% of leads are GA

Optimal allocation: Campaign A (50 leads) + Campaign B (100 leads)
But finding this took manual calculation. At portfolio scale, this is infeasible.

text

### Proposed Solution
A simulation engine that takes client constraints (caps, payouts), campaign cost curves, and geographic distributions as input, and outputs the optimal campaign volume mix.

### Core Inputs
- **Client definitions:** Lead volume caps, per-lead payout, geo restrictions, any excess/aggregator pricing
- **Campaign definitions:** Cost per lead per campaign, geographic distribution (% of leads per state), volume capacity constraints
- **Constraints:** Minimum/maximum leads per campaign, budget caps

### Core Output
- Optimal campaign volume allocation (e.g., "Campaign A: 50 leads, Campaign B: 100 leads, Campaign C: 0 leads")
- Blended ROAS and net profit projection
- Marginal ROAS curve ("If you increase Campaign B by 10 leads, ROAS changes from X to Y")
- Aggregator overflow recommendation ("Excess above client caps → sell to aggregator at $187")

### User Experience Concept
- Slider-based "what-if" interface: adjust any constraint and see real-time ROAS impact
- Visual allocation chart: stacked bar per campaign, color-coded by client
- "Optimize" button: auto-calculates optimal mix, user can then manually tweak
- Warning indicators: "Client A cap reached — 15 leads will go to aggregator at lower payout"

### Why Phase 3, Not Phase 1
1. Requires validated diagnostic engine (Phase 1): if the cost-per-lead numbers feeding the simulator are unreliable, the allocation output is garbage
2. Requires continuous data (Phase 2): cost curves change. Yesterday's optimal allocation may not be today's
3. Higher stakes: budget allocation recommendations directly impact client revenue. Trust must be built through diagnostic accuracy first

---

## 13. Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| CSV upload friction prevents adoption | Medium | High | Provide sample CSV templates and a "download template" button. Accept flexible column ordering. "Load Sample Data" for instant demo. |
| Users don't trust AI diagnosis without trend context | Medium | High | Include confidence language ("Likely cause", "Possible cause"). Make clear this is a single-period snapshot. Phase 2 addresses this with continuous data. |
| Legal vertical hardcoded benchmarks are wrong for specific sub-verticals (MVA vs. mass tort) | High | Medium | Multi-vertical config from Phase 1 directly addresses this. Users can manually override thresholds and change history provides audit trail. |
| Form `type` classification (qualification vs. friction) requires human judgment on upload | High | Medium | Provide clear definition + examples in upload guide. Accept `unknown` type and treat conservatively. |
| 5,000-row limit too small for large agencies | Low | Low | MVP target is single buyer with 5-20 campaigns. Document limit clearly. |
| Benchmarks decay over time due to seasonality, competition, and platform changes | High | High | Phase 1: Manual override with change history allows users to adjust. Phase 2: Auto-recalibration based on trailing 90-day data. |
| Ad Allocation Simulator produces unreliable recommendations if built on inaccurate diagnostic data | Medium | High | Explicitly sequenced as Phase 3. Requires validated Phase 1 + Phase 2 data pipeline before allocation logic is activated. |

---

## 14. Glossary

| Term | Definition |
|------|-----------|
| **Qualification question** | A form question designed to filter out leads who don't meet criteria (e.g., "Do you have a lawyer?"). High drop-off is expected and healthy. |
| **Friction question** | A form question that collects necessary information but adds no filtering value (e.g., "Best time to contact?"). High drop-off is undesirable. |
| **Friction-heavy question** | A form question requiring significant cognitive effort (e.g., "Describe your injury in detail"). Position-sensitive. |
| **CPL** | Cost Per Lead = Total Spend / Total Leads |
| **CVR** | Conversion Rate = Form Submits / Page Views |
| **Root cause** | The most upstream issue in the funnel that, if fixed, would have the largest downstream impact on CPA. |
| **Ad Allocation Simulator** | Phase 3 feature that optimizes campaign volume mix across multiple clients, campaigns, and geographies to maximize blended net profit. |
| **Vertical** | Industry-specific lead generation category with distinct benchmarks (Legal MVA, Legal Mass Tort, Insurance, Senior Care). |
| **Benchmark decay** | The tendency for static thresholds to become inaccurate over time due to seasonality, competition, and platform changes. |
