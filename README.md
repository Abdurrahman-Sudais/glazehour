# Glazehour

**Connect the defect to the evidence.** Marketing site and interactive demonstration workspace for Glazehour, an AI-assisted coating-defect investigation and quality-management platform (glazehour.space, safiya@glazehour.space). Founded by Safiya Abdullahi (Founder/CEO) and Yusuf Abdulhamid (Co-founder/CTO).

Built with Vite, React 18, TypeScript, Tailwind CSS v4, React Router 6 and Lucide React. It has no backend and calls no external APIs.

## Setup

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production build to dist/
npm test         # rules-engine unit tests (Vitest)
```

## Deploying

`npm run build` produces a static site in `dist/`. Ready-made host configs are included: `public/_redirects` + `public/_headers` (Netlify / Cloudflare Pages) and `vercel.json` (Vercel) set the SPA fallback, security headers and long-lived caching for hashed assets. Every route except the home page is lazy-loaded.

Optional: copy `.env.example` to `.env.local` and set the `VITE_HUBSPOT_*` variables so early-access requests reach HubSpot. Without them the form saves requests in the visitor's browser and offers a pre-filled email.

### Content to confirm before launch

- **Founders:** `FOUNDERS` in `src/data/site.ts`.
- **Industry statistics** (`PROBLEM_STATS` in `src/pages/Home.tsx`) cite the NACE IMPACT study (via Inspectioneering) and the Weston failure analyses (via an AMPP sample). Check each against its source.
- **Roadmap, pricing, FAQ, privacy notice and terms** are drafts to keep in step with what you offer.

## Routes

| Path | Page |
|---|---|
| `/` | Home |
| `/product`, `/defect-investigation`, `/quality-workflows`, `/how-it-works` | Platform pages |
| `/pricing`, `/about` | Pricing; founding team, story, principles and roadmap |
| `/contact` | Early-access form (HubSpot when configured, otherwise local save + mailto) |
| `/technology`, `/security`, `/privacy`, `/terms` | Proposed AWS architecture; safeguards; review-draft legal pages |
| `/investigations` | Demo workspace: Overview (with assistant), Jobs, Defect Library (+ similar-case groups), Investigations, Specifications, Reports, Team, Audit & roles, Settings |

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
- **Instruments, data loggers, ERP, email and auth**: none are integrated. Measurements are typed in by hand.
- **Roles and audit**: “Demo as” switches between fictional people; every change is checked against a role matrix (`src/domain/access.ts`) and written to an audit log. Production would enforce roles on the server.
- **Assistant** (“Ask about this facility”, `src/domain/assistant.ts`): deterministic intent routing over the demo records; it cites the records used and refuses to name causes, prescribe fixes or accept work.

Use **Settings → Reset demo data** to restore the original records.
