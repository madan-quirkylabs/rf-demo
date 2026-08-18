# RF-Live — Regulatory Analysis Workspace (demo)

A source-traceable, regulator-agnostic demo of "understand the circular + what changed."
Built on **Vite + React + TypeScript + Tailwind v4** (the deliberately boring, LLM-friendly,
hand-off-safe stack). Renders two real instruments as a single scrolling page: SEBI SID /
offer-document simplification, and the RBI (Commercial Banks – Compliance Function)
Directions, 2026.

## Run

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # typecheck + production bundle → dist/
npm run preview    # serve the built bundle
```

## Page flow (top → bottom)

The layout follows the compliance reader's mental model — what needs to be easy to see is
above the fold; the rest is below or behind a click.

| Section | Purpose | Effort to see |
|---|---|---|
| **Hero** | Identity (regulator, ref no., status, effective date), applicability gate ("Applies to"), one-line summary | Above the fold |
| **Analysis — What Changed** (default lens) | Previous-state vs. new-requirement diff + the validated wedge (why it's a diff, not an AI summary) | Above the fold, no clicks |
| **Analysis — Overview** | Regulator's requirement, interpretation basis, evolution trajectory, obligations arising | One click |
| **Analysis — Circular Reader** | The source document clause by clause, change-type color coding, obligations pinned per clause | One click (lookup) |
| **Analysis — Traceability** | Every obligation maps to source instrument + clause (source → requirement → obligation) | One click (proof) |
| **Partner Commentary** | Expert analysis from law firms / consultancies / industry bodies, attributed to the partner | Scroll |
| **Clarifications** | Community questions with AI answers grounded in partner sources; upvote the useful | Scroll |

A **regulator selector** in the top bar switches between the SEBI and RBI datasets live.

## Data model

All content lives in `src/data/` (typed via `src/data/types.ts`). To demo a *different*
circular / regulator (SEBI → RBI → any body), add one dataset file that satisfies the
`Circular` type and export it from `src/data/index.ts` — no component changes needed.
The structure is regulator-agnostic by design.

## ⚠ Grounding (read before a live customer call)

The **instrument refs are REAL and verified**:
- SEBI Master Circular for Mutual Funds dated 27 Jun 2024; circular no.
  `SEBI/HO/IMD/IMD-RAC-1/P/CIR/2024/179` dated 20 Dec 2024 (simplification of offer documents).
- RBI (Commercial Banks – Compliance Function) Directions, 2026 — `RBI/DoS/2026-27/408`,
  dated 31 Jul 2026 (https://www.rbi.org.in/Scripts/BS_ViewMasDirections.aspx?id=13645).

The **specific interpretation wording, commentary, and obligation sets are demo-illustration
content** — VERIFY against sebi.gov.in / rbi.org.in before presenting to a customer.
Partner names (AMFI, AZB & Partners, Deloitte, ICSI, Cyril Amarchand Mangaldas, Shardul
Amarchand Mangaldas, PwC) are plausible but not real publications — flag this before any
live customer call. No invented statistics; label anything inferred as inference.
Clause-boundary check: the Compliance Directions apply to commercial banks, **excluding**
SFBs, Payments Banks, and Local Area Banks — keep this in mind if demoing to those.

## Project layout

```
src/
  App.tsx                 # single-page flow: Hero → Analysis → Commentary → Clarifications
  index.css               # Institutional Precision design tokens (from DESIGN.md)
  main.tsx
  components/ui.tsx       # Card, Badge, StatCard, Pill
  data/types.ts           # Circular/SourceClause/Obligation/ChangeDiff/Commentary/Clarification types
  data/index.ts           # registry of all demo circulars
  data/circular.ts        # SEBI SID data
  data/rbiCircular.ts     # RBI Compliance Function Directions data
  sections/HeroSection.tsx            # identity + applicability + summary
  sections/AnalysisPane.tsx           # in-page tabs: What Changed / Overview / Reader / Traceability
  sections/CommentarySection.tsx      # partner analysis with attribution
  sections/ClarificationsSection.tsx  # community Q&A + AI answers + upvoting
  tabs/ChangeTab.tsx                  # diff lens body
  tabs/OverviewTab.tsx                # requirement + trajectory + obligations
  tabs/CircularReaderTab.tsx          # clause-by-clause source + pinned obligations
  tabs/TraceabilityTab.tsx            # obligation → source lineage
  shot.mjs / verify2.mjs  # Playwright render + verify scripts
```

## Design system source

The design tokens in `index.css` are mapped from
`02_Assets/RF_Live/Designs/stitch_regulatoryfabric_institutional_prototype/institutional_precision/DESIGN.md`
(Institutional Modernism, "Paper & Ink", Inter + JetBrains Mono).
