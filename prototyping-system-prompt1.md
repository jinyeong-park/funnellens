You are building a Campaign Diagnostic Agent MVP for legal lead generation media buyers.
This is a single-page web application with an Airtable-inspired clean, minimal design.

## CORE CONCEPT
Media buyers manually triangulate data across Meta Ads, landing pages, forms, and CRM
to diagnose why CPA spiked. This tool ingests 4 CSV uploads, runs a structured diagnostic
engine, and outputs prioritized root causes + recommendations in under 10 seconds.

## TECH STACK
- React + TypeScript + Tailwind CSS
- Shadcn/ui components (minimal usage — prefer custom clean components)
- Papa Parse for CSV parsing
- Zustand for state management

## DESIGN SYSTEM — AIRTABLE INSPIRED

### Color Palette
- Background: #F9FAFB (warm gray-50) — light, airy feel
- Surface/Cards: #FFFFFF with subtle border (#F0F0F0 or gray-200)
- Primary accent: #2563EB (blue-600) — clean, professional blue
- Text primary: #1F2937 (gray-800)
- Text secondary: #6B7280 (gray-500)
- Text tertiary: #9CA3AF (gray-400)
- Severity indicators:
  - Critical: #EF4444 (red-500) — subtle, not aggressive
  - Warning: #F59E0B (amber-500)
  - Good: #10B981 (emerald-500)
  - Info: #6366F1 (indigo-400)

### Typography
- Font: Inter (system sans-serif stack)
- Headings: font-semibold, tight letter-spacing (-0.02em)
- Body: font-normal, comfortable line-height (1.6)
- Numbers/Metrics: tabular-nums for alignment
- Monospace: JetBrains Mono for CSV column names

### Spacing & Layout
- Page padding: 48px (p-12)
- Card padding: 24px (p-6)
- Card gap: 20px
- Border radius: 8px (rounded-lg) — slightly soft, not pill-shaped
- Section spacing: 32px between major sections

### Cards & Surfaces
- White background (#FFFFFF)
- 1px border (#E5E7EB / gray-200)
- Subtle shadow: shadow-sm (only on hover for interactive cards)
- No heavy shadows — Airtable is flat and clean

### Buttons
- Primary: Solid blue-600 background, white text, rounded-lg, px-5 py-2.5
- Secondary: White background, gray-300 border, gray-700 text
- Ghost: No background/border, gray-500 text, hover: gray-50 background
- Disabled: opacity-50, cursor-not-allowed

### Icons
- Use Lucide React icons
- Icon size: 20px for cards, 16px inline
- Icon color: match text secondary (gray-500) unless interactive

## PAGES & ROUTES

### Route: / (Dashboard)
This is the only page for MVP. Airtable-style clean layout.

**Overall Layout:**
- Max-width: 1280px, centered (mx-auto)
- Top: Header bar with minimal branding
- Below: Two-column grid (left 480px fixed, right flexible)
- Gap between columns: 32px
- On mobile: single column stacked

---

**HEADER BAR:**
- Height: 64px
- Left: "Diagnostic Agent" in gray-800, font-semibold, 18px
- Below title: "Legal Lead Gen" in gray-400, 13px, uppercase tracking-wider
- Right: "Load Sample Data" ghost button + "Download Templates" ghost button
- Bottom border: 1px gray-100 separator

---

**LEFT COLUMN — Upload Panel (480px, sticky on scroll):**

Container: white card, border, rounded-lg, p-6

Section title: "Data Sources" in gray-800, 15px, font-semibold
Subtitle: "Upload 4 CSV files to begin diagnosis" in gray-400, 13px

Four upload cards — each is a horizontal row (not stacked cards):

Each upload row:
- Left: Icon in a 36x36 rounded-md square, light blue-50 background
  - Campaign: BarChart3 icon, blue-500
  - Landing: Monitor icon, indigo-500
  - Form: ClipboardList icon, violet-500
  - Sales: Users icon, teal-500
- Middle: 
  - Title: gray-800, 14px, font-medium (e.g., "Campaign Performance")
  - Subtitle: required columns as small gray-400 tags (e.g., "date, campaign_name, impressions, clicks, spend, leads")
- Right:
  - If not uploaded: "Upload CSV" button (outline style, small)
  - If uploaded: Green checkmark (CheckCircle2 icon, green-500) + file name in gray-500, 12px, truncated

Upload rows separated by 1px gray-100 dividers (like Airtable rows)

Below the four rows:
- "Run Diagnosis" button — full width, blue-600 solid, 48px tall, text "Run Diagnosis", font-medium
- When disabled: opacity-40, cursor-not-allowed, text "Upload all 4 files to continue"
- When loading: animated spinner + "Analyzing funnel across 4 data sources..."
- When complete: button collapses, results appear on right

---

**RIGHT COLUMN — Results Panel (flexible width):**

**Empty State (shown when no diagnosis has been run):**
- Centered vertically in the available space
- Large icon: Activity icon, 48px, gray-200
- Title: "Diagnostic Results" gray-400, 16px
- Subtitle: "Upload all 4 files and run diagnosis to see findings" gray-400, 14px
- Very minimal, Airtable-style empty state

**Results State (shown after diagnosis completes):**

Container: white card, border, rounded-lg, overflow-hidden

**1. Summary Metrics Row**
- Horizontal row of 4 metric cards
- Each card: light gray-50 background, rounded-md, p-4
- Metric label: gray-400, 11px, uppercase tracking-wider
- Metric value: gray-800, 24px, font-semibold, tabular-nums
- Status dot: small circle to the right of value (green/amber/red)
- Metrics: Total Spend, Avg CPL, Overall CVR, Lead→Sign Rate
- Row has 1px gray-100 bottom border

**2. Findings Section**
- Section header: "Findings" in gray-800, 15px, font-semibold, px-6 pt-5
- List of findings, each as a horizontal row (Airtable row style):
  - Left: Severity icon (16px) — 🔴 🔵 or muted circle
  - Middle: Finding title (gray-800, 14px)
  - Right: Finding detail (gray-500, 13px, right-aligned)
  - Each row: px-6 py-3, 1px gray-50 bottom border
  - Hover: very subtle gray-50 background
- Findings ordered by severity (critical first)

**3. Recommendations Section**
- Section header: "Recommendations" in gray-800, 15px, font-semibold, px-6 pt-5
- Numbered list, each item in a row:
  - Left: Number circle (20x20, blue-100 bg, blue-600 text, rounded-full, 12px bold)
  - Middle: Recommendation text (gray-800, 14px)
  - Right: Impact badge (small pill, green-50 bg, green-700 text, 12px)
- Each row: px-6 py-3, 1px gray-50 bottom border

**4. Root Cause Summary**
- Section header: "Root Cause" in gray-800, 15px, font-semibold, px-6 pt-5
- 1-3 horizontal cards/pills:
  - Icon + text in a rounded-lg border
  - Critical: red-50 bg, red-600 text, red-200 border
  - Warning: amber-50 bg, amber-600 text, amber-200 border
  - px-4 py-2, 14px

**5. Bottom Actions**
- Border top, px-6 py-4
- "Export Report" button (outline style, gray-500 text)

---

## DATA MODEL & DIAGNOSTIC LOGIC

All logic identical to what was provided. The diagnostic engine should:

### Upload Validation
- Campaign CSV must have: date, campaign_name, impressions, clicks, spend, leads
- Landing Page CSV must have: date, page_views, form_starts, form_submits, bounce_rate, avg_time_on_page_sec
- Form CSV must have: step, question, type, started, completed
  - type = "qualification" | "friction" | "friction_heavy"
- Sales JSON must have: total_leads, calls_connected, qualified_calls, cases_signed, sales_feedback (optional)
- Show clean, Airtable-style toast for errors (top-right, white card, red left border)

### Benchmark Configuration (Legal Vertical — Hardcoded)
Campaign:

CPM: good < 
30
∣
a
v
g
30∣avg30-45 | bad > $45

CTR: good > 2.0% | avg 1.2-2.0% | bad < 0.6%

CPL: good < 
150
∣
a
v
g
150∣avg150-250 | bad > $400

Landing Page:

CVR: good > 12% | avg 7-12% | bad < 3%

Bounce rate: bad > 50%

Avg time: bad < 30s

Form:

Qualification: <40% drop-off = healthy | <15% drop-off = too weak

Friction: >15% drop-off = harmful

Friction-heavy: >20% drop-off = critical

Lead Quality:

Lead→Qualified: good >35% | avg 25-35% | bad <15%

Qualified→Signed: good >25% | avg 18-25% | bad <10%

text

### Diagnostic Engine — Exact Rules

1. **Campaign:** Group by campaign_name → CPM/CTR/CPL → compare to benchmarks
2. **Landing Page:** Overall CVR, bounce rate, time on page
3. **Form:** Per-question drop-off rate by type
4. **Lead Quality:** Qualify rate, sign rate, sales feedback
5. **Root Cause (academy framework):**
   - CTR 낮음 → "CREATIVE: Ad hook not resonating"
   - CPC/CPM 높음 → "AUDIENCE: Targeting or competition issue"
   - CPL 높음 (but CTR/CPC fine) → "LANDING PAGE/OFFER: Page not converting"
   - CPL good but no sign → "FORM/SALES: Checkout friction or sales performance"
6. **Recommendations:** Specific, actionable, with projected impact

---

## SAMPLE DATA

"Load Sample Data" button auto-populates all fields with:

Campaign:
- Campaign_A_GA_Only: 35,000 impressions, 350 clicks, $4,200 spend, 18 leads
- Campaign_B_MultiState: 70,000 impressions, 2,800 clicks, $8,400 spend, 70 leads

Landing Page: 5,200 views, 680 form_starts, 88 submits, 0.42 bounce, 65s avg

Form (7 questions):
1. Full Name | friction | 680→666
2. Phone | friction | 666→626
3. Email | friction | 626→601
4. Were you injured? | qualification | 601→541
5. Do you have a lawyer? | qualification | 541→460
6. Describe injury in detail | friction_heavy | 460→322
7. Best time to contact | friction | 322→296

Sales: 88 leads, 70 connected, 14 qualified, 3 signed
Feedback: "Many leads say they already have a lawyer — form filtering may be too weak"

---

## WHAT NOT TO BUILD
- ❌ Authentication, database, multi-user, API integrations
- ❌ Real-time alerts, historical comparison, A/B generation
- ❌ Heavy shadows, dark mode, gradients, animations beyond subtle transitions
- Keep it Airtable: flat, clean, minimal, professional

## ERROR HANDLING
- Toast notifications: white card, colored left border (red-500 for errors), top-right
- Specific messages: "Missing column: [name]" or "Invalid data in [column]: expected number"
- Empty file detection
- Button disabled with clear message when <4 files uploaded
