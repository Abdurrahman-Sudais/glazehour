# Glazehour

**Connect the defect to the evidence.** Marketing site and interactive demonstration workspace for Glazehour, an AI-assisted coating-defect investigation and quality-management platform (glazehour.space, founder Safiya Abdullahi, safiya@glazehour.space).

Built with Vite, React 18, TypeScript, Tailwind CSS v4, React Router 6 and Lucide React. It has no backend and calls no external APIs.

## Setup

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production build to dist/
npm test         # rules-engine unit tests (Vitest)
```

The app uses client-side routing. When you deploy it, configure the host to serve `index.html` for every path (SPA fallback).

## Routes

| Path | Page |
|---|---|
| `/` | Home |
| `/product`, `/defect-investigation`, `/quality-workflows`, `/how-it-works` | Platform pages |
| `/pricing`, `/about`, `/contact` | Company pages (contact form is validated; submissions are kept in localStorage only) |
| `/investigations` | Demo workspace: Overview, Jobs, Defect Library (+ similar-case groups), Investigations, Specifications, Reports, Team, Settings |

## Structure

```
src/domain/      Framework-free business logic
  types.ts         Domain model
  rules.ts         Deterministic specification-checking engine (+ rules.test.ts)
  investigation.ts Investigation state transitions, closure rules, form validation
  similarity.ts    Simulated similar-defect grouping, side-by-side comparison, investigator questions
  assist.ts        Simulated "AI" evidence suggestions (never diagnostic)
  reports.ts       Report aggregation and CSV export
  contact.ts       Contact form validation
src/data/seed.ts  Fictional demo facility, jobs, defects, specs, investigations
src/state/store.tsx React context + reducer, persisted to localStorage ("glazehour-demo-v1")
src/components/   Site layout, UI primitives, SEO hook, procedural imagery
src/pages/        Marketing pages
src/workspace/    Workspace views
```

## Specification checking

- Rules are configured by the user per specification: minimum, maximum, range, or minimum difference between two readings (for example, substrate temperature minus dew point ≥ 3 °C).
- A rule is calculated only when every reading it needs is a finite number. If one is missing, the result is **"Unable to evaluate: required measurement missing."** Values are never estimated.
- All thresholds in the seed data are fictional and illustrative. No industry standard is encoded.
- The UI labels five kinds of information separately: recorded measurement, specification limit, calculated comparison, AI suggestion (simulated) and human-confirmed finding.

## What is simulated

- **Similar-defect grouping**: the groups are pre-defined in the seed data. No vision model runs.
- **Evidence suggestions**: these are deterministic prompts derived from missing readings and failed rules, labelled as AI. They never name a cause or prescribe a corrective process.
- **Defect photographs and industrial imagery**: procedurally generated SVG, marked "Demo image". Both `DefectImage` and `Scene` accept a `src` prop for real photography.
- **Instruments, data loggers, ERP, email, auth and permissions**: none are integrated. Measurements are typed in by hand, and the contact form sends nothing.

Use **Settings → Reset demo data** to restore the original records.
