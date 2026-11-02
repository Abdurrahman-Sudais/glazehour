import type { CSSProperties, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, ArrowRight, Bot, Building2, Camera, Check, CircleCheck, ClipboardList, ExternalLink, Factory, FileSpreadsheet, FileText, FolderKanban, MessageSquareText, Minus, Ruler, ShieldCheck, Sparkles, Wrench, X } from 'lucide-react';
import { CtaBand, ProductPreview, STEPS, Section } from '../components/marketing';
import { DefectImage, Scene } from '../components/Imagery';
import { ButtonLink, KindTag, cx, useSeo } from '../components/ui';
import { useCountUp, useCycle } from '../lib/motion';
import { AiSection, EarlyAccessSection, FaqSection, PricingSection, RoadmapSection, SafeguardsSection, TeamSection, TechnologySection } from './HomeSections';
import { DEFECTS, JOBS, SPECIFICATIONS } from '../data/seed';
import { MEASUREMENT_META, evaluateSpecification } from '../domain/rules';
import { SIMILARITY_DISCLAIMER } from '../domain/similarity';

export const PROBLEM_STATS = [
  {
    value: 2.5,
    decimals: 1,
    prefix: '$',
    suffix: 'T',
    label: 'estimated global cost of corrosion each year — about 3.4% of global GDP.',
    source: 'NACE International IMPACT study (2016), via Inspectioneering',
    url: 'https://inspectioneering.com/news/2016-03-08/5202/nace-study-estimates-global-cost-of-corrosion-at-25-trillion-ann',
  },
  {
    value: 35,
    decimals: 0,
    prefix: '15–',
    suffix: '%',
    label: 'of that cost could be saved by applying corrosion-control best practices, the same study estimates.',
    source: 'NACE International IMPACT study (2016), via Inspectioneering',
    url: 'https://inspectioneering.com/news/2016-03-08/5202/nace-study-estimates-global-cost-of-corrosion-at-25-trillion-ann',
  },
  {
    value: 68,
    decimals: 0,
    prefix: '',
    suffix: '%',
    label: 'of coating failures were traced to application errors in more than 120 failure analyses — process evidence, not the paint.',
    source: 'Weston failure analyses (1993), cited in an AMPP sample publication',
    url: 'https://store.ampp.org/download/sample/52199',
  },
];

const OUTCOME_WORDS = ['customer claims', 'repeat rework', 'warranty disputes', 'lost evidence'] as const;
const BUILT_FOR = ['Coating contractors', 'Powder lines', 'Wet spray booths', 'Two-pack epoxies', 'Polyurethane topcoats', 'Zinc-rich primers', 'Structural steel', 'Conveyor frames', 'Trailer chassis', 'Racking systems', 'Electrical enclosures', 'In-house paint shops', 'Metal finishers'];

const dl = (ms: number) => ({ '--d': `${ms}ms` }) as CSSProperties;

export default function Home() {
  useSeo('Glazehour — Investigate coating defects with the full process in view', 'Bring defect images, job conditions, inspection records and product specifications together so coating teams can investigate recurring issues with better context.');

  return (
    <>
      <Hero />
      <Marquee />
      <ProblemSection />
      <SolutionSection />
      <ConnectedEvidence />
      <PlatformSection />
      <SimilarSection />
      <SpecReview />
      <Section id="how" eyebrow="How it works" title="Four steps from observation to finding" tone="dark">
        <ol className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <li key={s.n} className="reveal lift spot rounded-xl border border-ink-600 bg-ink-800 p-6" style={dl(i * 100)}>
              <span className="flex h-9 w-9 items-center justify-center rounded-full border border-signal-500/60 font-mono text-sm text-signal-400">{s.n}</span>
              <h3 className="mt-4 font-semibold text-white">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-graphite-300">{s.text}</p>
            </li>
          ))}
        </ol>
        <div className="mt-8">
          <ButtonLink to="/how-it-works" variant="dark">See the full workflow <ArrowRight size={16} /></ButtonLink>
        </div>
      </Section>
      <WhoSection />
      <CompareSection />
      <AiSection />
      <SafeguardsSection />
      <TechnologySection />
      <PricingSection />
      <RoadmapSection />
      <TeamSection />
      <FaqSection />
      <EarlyAccessSection />
      <CtaBand title="Turn recurring defects into structured investigations." text="Request early access for your facility, or open the demonstration workspace with fictional records." />
    </>
  );
}

function Hero() {
  const word = useCycle(OUTCOME_WORDS, 2400);
  return (
    <section className="tech-grid relative overflow-hidden bg-ink-900 text-white">
      <div className="hero-glow pointer-events-none absolute -left-32 -top-40 h-[32rem] w-[32rem] rounded-full bg-signal-500/15 blur-3xl" aria-hidden />
      <div className="hero-glow pointer-events-none absolute -right-40 top-56 h-[26rem] w-[26rem] rounded-full bg-volt-600/15 blur-3xl" style={{ animationDelay: '-4s' }} aria-hidden />
      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-4 pb-24 pt-16 sm:px-6 lg:grid-cols-[1fr_1.15fr] lg:pt-24">
        <div>
          <Link to="/contact" className="reveal group inline-flex items-center gap-2 rounded-full border border-ink-600 bg-ink-800/70 px-3 py-1.5 text-xs text-mist-200 backdrop-blur hover:border-signal-500">
            <span className="live-dot" aria-hidden /> Early access open · pilots on one coating line
            <ArrowRight size={14} className="text-signal-400 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <h1 className="reveal mt-6 text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl lg:text-[3.4rem]" style={dl(80)}>
            Investigate coating defects with the full process in view — before they turn into{' '}
            <span className="sr-only">customer claims, repeat rework, warranty disputes or lost evidence.</span>
            <span aria-hidden className="block min-h-[1.1em]">
              <span key={word} className="word-in"><span className="text-shimmer">{word}.</span></span>
            </span>
          </h1>
          <p className="reveal mt-6 max-w-xl text-lg leading-relaxed text-graphite-300" style={dl(160)}>
            Glazehour keeps defect photographs, job conditions, inspection records and your own product specifications on one investigation — and says plainly what wasn’t recorded.
          </p>
          <div className="reveal mt-9 flex flex-wrap gap-3" style={dl(240)}>
            <ButtonLink to="/contact" className="px-5 py-3">Request early access <ArrowRight size={16} /></ButtonLink>
            <ButtonLink to="/investigations" variant="dark" className="px-5 py-3">Explore the live demo</ButtonLink>
          </div>
          <ul className="reveal mt-8 grid max-w-lg gap-x-6 gap-y-2 text-sm text-graphite-300 sm:grid-cols-2" style={dl(320)}>
            {['Photos linked to jobs', 'Readings checked against your specs', 'Missing evidence flagged', 'Findings confirmed by people'].map((t) => (
              <li key={t} className="flex items-center gap-1.5"><Check size={15} className="text-signal-400" /> {t}</li>
            ))}
          </ul>
        </div>
        <div className="reveal relative" style={dl(380)}>
          <div className="pointer-events-none absolute -inset-6 rounded-3xl bg-gradient-to-br from-signal-500/15 to-volt-600/10 blur-2xl" aria-hidden />
          <div className="sweep relative rounded-xl"><ProductPreview /></div>
          <FloatCard className="float -left-6 -top-10 hidden lg:flex" tone="fail" icon={<AlertTriangle size={16} />} title="Rule failed · J-24117" body="Substrate − dew point below your supplied limit" />
          <FloatCard className="float-slow -bottom-12 right-4 hidden lg:flex" tone="ok" icon={<CircleCheck size={16} />} title="Finding confirmed" body="Booth heaters switched on after first coat" style={{ animationDelay: '-2s' }} />
          <FloatCard className="float -bottom-14 left-4 hidden xl:flex" tone="ai" icon={<Sparkles size={16} />} title="Similar observations · 3" body="Blistering across two lines — compare, don’t assume" style={{ animationDelay: '-4s' }} />
        </div>
      </div>
    </section>
  );
}

function FloatCard({ className, tone, icon, title, body, style }: { className: string; tone: 'fail' | 'ok' | 'ai'; icon: ReactNode; title: string; body: string; style?: CSSProperties }) {
  const color = { fail: 'text-red-300 border-red-400/30', ok: 'text-signal-400 border-signal-500/30', ai: 'text-violet-300 border-violet-400/30' }[tone];
  return (
    <div className={cx('absolute z-10 max-w-[17rem] items-start gap-3 rounded-lg border bg-ink-900/95 p-3 shadow-2xl shadow-black/50 backdrop-blur', color, className)} style={style} aria-hidden>
      <span className="mt-0.5">{icon}</span>
      <span>
        <span className="block text-xs font-medium text-white">{title}</span>
        <span className="mt-0.5 block text-xs text-graphite-300">{body}</span>
      </span>
    </div>
  );
}

function Marquee() {
  const row = [...BUILT_FOR, ...BUILT_FOR];
  return (
    <section aria-label="Built for" className="marquee overflow-hidden border-b border-mist-200 bg-white py-6">
      <p className="mb-4 text-center font-mono text-[11px] uppercase tracking-[0.18em] text-graphite-400">Built for quality teams working with</p>
      <div className="[mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        <ul className="marquee-track flex w-max gap-10">
          {row.map((t, i) => (
            <li key={i} aria-hidden={i >= BUILT_FOR.length} className="flex items-center gap-10 whitespace-nowrap text-lg font-medium text-graphite-400">
              {t}<span className="h-1 w-1 rounded-full bg-signal-500" />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function ProblemSection() {
  return (
    <Section
      id="problem"
      eyebrow="The problem"
      title="Defect investigations start from scratch — because the evidence was never kept together."
      intro="A blistered panel turns up at final inspection. The photograph is on a phone, the booth readings are in a logbook, the product data sheet is in a shared drive and the sprayer’s note is on a whiteboard that has since been wiped."
      tone="white"
    >
      <div className="grid gap-5 md:grid-cols-3">
        {PROBLEM_STATS.map((s, i) => <Stat key={s.label} {...s} delay={i * 120} />)}
      </div>
      <p className="mt-4 text-xs text-graphite-400">Published figures from third-party studies, linked above. They describe the wider corrosion-protection and coatings industry, not Glazehour results.</p>
      <div className="mt-14 grid gap-4 md:grid-cols-4">
        {[
          { icon: <Camera size={18} />, t: 'Photographs', d: 'Taken on personal devices, named by date, rarely tied to a job number or a location on the part.' },
          { icon: <FileSpreadsheet size={18} />, t: 'Process logs', d: 'Temperatures and humidity recorded on paper or in a spreadsheet that nobody links back to the defect.' },
          { icon: <FileText size={18} />, t: 'Datasheets', d: 'Application windows sit in PDFs. Comparing them with what was recorded is manual and inconsistent.' },
          { icon: <MessageSquareText size={18} />, t: 'Operator notes', d: 'The most useful context — a door left open, a new batch, a late heater — is often never written down at all.' },
        ].map((c, i) => (
          <div key={c.t} className="reveal lift spot rounded-lg border border-mist-200 bg-mist-50 p-5" style={dl(i * 80)}>
            <div className="text-signal-600">{c.icon}</div>
            <h3 className="mt-3 font-semibold">{c.t}</h3>
            <p className="mt-2 text-sm leading-relaxed text-graphite-500">{c.d}</p>
          </div>
        ))}
      </div>
      <p className="reveal mt-8 max-w-3xl border-l-2 border-signal-500 pl-4 text-sm text-graphite-500">
        When the same defect returns a month later, the team starts again from nothing. Glazehour keeps each observation attached to the evidence that was available at the time — and records clearly what was not.
      </p>
    </Section>
  );
}

function Stat({ value, decimals, prefix, suffix, label, source, url, delay }: (typeof PROBLEM_STATS)[number] & { delay: number }) {
  const [ref, n] = useCountUp<HTMLDivElement>(value);
  return (
    <figure className="reveal lift spot rounded-xl border border-mist-200 bg-white p-6 shadow-sm" style={dl(delay)}>
      <div ref={ref} className="font-mono text-5xl font-medium tracking-tight tabular-nums text-ink-900">
        {prefix}{n.toFixed(decimals)}<span className="text-signal-600">{suffix}</span>
      </div>
      <figcaption>
        <p className="mt-3 text-ink-800">{label}</p>
        <a href={url} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-start gap-1 text-xs text-graphite-400 hover:text-volt-600">Source: {source} <ExternalLink size={12} className="mt-0.5 shrink-0" /></a>
      </figcaption>
    </figure>
  );
}

function SolutionSection() {
  const today = [
    'Defect photos sit on personal phones, named by date and detached from the job.',
    'Booth temperature, humidity and dew point live in a paper log nobody links back.',
    'Comparing readings with the product data sheet is done by hand, if at all.',
    'Readings that were never taken are quietly assumed to have been fine.',
    'Findings end up in emails, so the next investigation starts from scratch.',
  ];
  const withGh = [
    'Every observation links to its job, line, substrate, coating system and photos.',
    'Recorded conditions are checked automatically against the limits you supply.',
    'Rules that need a missing reading say “Unable to evaluate” — never a guess.',
    'Visually similar observations from other jobs can be lined up side by side.',
    'Findings, tasks and every change live on one timeline with an audit trail.',
  ];
  return (
    <Section id="solution" eyebrow="What we solve" title="From scattered evidence to one investigation — without guessing at causes." tone="dark">
      <div className="grid gap-5 lg:grid-cols-2">
        <div className="reveal rounded-xl border border-ink-600 bg-ink-800 p-6 sm:p-8">
          <p className="eyebrow flex items-center gap-2 text-graphite-400"><X size={14} className="text-red-400" /> Today</p>
          <ul className="mt-5 space-y-4">{today.map((t) => <li key={t} className="flex gap-3 text-graphite-300"><Minus size={16} className="mt-1 shrink-0 text-graphite-500" /> {t}</li>)}</ul>
        </div>
        <div className="reveal spot relative overflow-hidden rounded-xl border border-signal-500/40 bg-gradient-to-br from-ink-800 to-teal-950 p-6 sm:p-8" style={dl(120)}>
          <p className="eyebrow flex items-center gap-2 text-signal-400"><Check size={14} /> With Glazehour</p>
          <ul className="mt-5 space-y-4">{withGh.map((t) => <li key={t} className="flex gap-3 text-white"><CircleCheck size={18} className="mt-0.5 shrink-0 text-signal-400" /> {t}</li>)}</ul>
        </div>
      </div>
    </Section>
  );
}

function PlatformSection() {
  const mods: { icon: typeof Camera; t: string; b: string; why: string }[] = [
    { icon: FolderKanban, t: 'Job records', b: 'Reference, customer, component, substrate, coating system, line, specification and inspections in one record.', why: 'Answer “what happened here?” with evidence.' },
    { icon: Camera, t: 'Defect library', b: 'Photographs with location, severity and operator notes, each tied to the job it came from.', why: 'No more anonymous photos on phones.' },
    { icon: Ruler, t: 'Specification checks', b: 'Min, max, range and difference rules from your own data sheets, evaluated only when every reading exists.', why: 'Never compare against a guess.' },
    { icon: Sparkles, t: 'Similar-case groups', b: 'Visually similar observations across jobs and lines, lined up with their recorded conditions.', why: 'Compare — without assuming a shared cause.' },
    { icon: ClipboardList, t: 'Investigation workflow', b: 'Assign, review evidence, add tasks and record human-confirmed findings on one timeline.', why: 'A traceable record for every decision.' },
    { icon: Bot, t: 'Assistant, reports & audit', b: 'Ask in plain English, export CSV reports, and see who changed what — with roles for every person.', why: 'Answers from your records, never guesses.' },
  ];
  return (
    <Section id="platform" eyebrow="Platform" title="Six modules that follow a defect from the line to a confirmed finding." intro="Each module writes to the same investigation, so a photo, a reading and a finding show up everywhere they matter.">
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {mods.map((m, i) => (
          <article key={m.t} className="reveal lift spot flex flex-col rounded-xl border border-mist-200 bg-white p-6" style={dl((i % 3) * 80)}>
            <span className="flex h-10 w-10 items-center justify-center rounded-md bg-signal-500/10 text-signal-600"><m.icon size={18} /></span>
            <h3 className="mt-4 text-lg font-semibold">{m.t}</h3>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-graphite-500">{m.b}</p>
            <p className="mt-5 border-t border-mist-100 pt-4 text-sm font-medium text-signal-600">{m.why}</p>
          </article>
        ))}
      </div>
      <Link to="/product" className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-volt-600 hover:underline">Explore the platform <ArrowRight size={15} /></Link>
    </Section>
  );
}

function SimilarSection() {
  return (
    <Section
      id="similar"
      eyebrow="Find similar cases"
      title="Group visually similar observations — without assuming a shared cause"
      intro="Glazehour can suggest observations from other jobs that look alike, so an investigator can line up their recorded conditions side by side. A similar appearance is a reason to compare, not a conclusion."
      tone="white"
    >
      <div className="grid items-start gap-8 lg:grid-cols-[1.2fr_1fr]">
        <div className="grid grid-cols-3 gap-3">
          {DEFECTS.filter((d) => d.category === 'blistering').map((d, i) => {
            const job = JOBS.find((j) => j.id === d.jobId)!;
            return (
              <figure key={d.id} className="reveal lift overflow-hidden rounded-lg border border-mist-200 bg-white" style={dl(i * 100)}>
                <DefectImage category={d.category} seed={d.photos[0]!.seed} alt={`Demonstration image of blistering on ${job.component}`} className="aspect-square" />
                <figcaption className="p-3 text-xs">
                  <p className="font-mono text-signal-600">{d.id}</p>
                  <p className="mt-0.5 text-graphite-500">{job.id} · {job.line}</p>
                </figcaption>
              </figure>
            );
          })}
        </div>
        <div className="space-y-4">
          <div className="reveal rounded-lg border border-dashed border-violet-300 bg-violet-50 p-5">
            <KindTag kind="ai" />
            <p className="mt-3 text-sm text-ink-800">Suggested group: dome-shaped blisters, 1–4 mm, clustered. Three observations across two lines and three jobs.</p>
          </div>
          <div className="reveal flex items-start gap-3 rounded-lg border border-mist-200 bg-mist-50 p-5 text-sm text-graphite-500">
            <ShieldCheck className="mt-0.5 shrink-0 text-ink-700" size={18} />
            <p>{SIMILARITY_DISCLAIMER}</p>
          </div>
        </div>
      </div>
    </Section>
  );
}

const AUDIENCES = [
  { icon: Wrench, scene: 'line' as const, who: 'Coating contractors', profile: 'Customer jobs across structural steel, frames and fabrications.', how: 'Keep conditions, photos and inspections on every job record.', benefit: 'A defensible answer when a customer asks what happened.' },
  { icon: Factory, scene: 'panel' as const, who: 'Metal-finishing operations', profile: 'Powder and wet lines running several shifts.', how: 'Track recurring defects across lines, shifts and substrate batches.', benefit: 'Patterns spotted without chasing paper logs.' },
  { icon: Building2, scene: 'facility' as const, who: 'In-house manufacturing quality', profile: 'Paint shops inside larger manufacturing plants.', how: 'Connect paint-shop observations with internal specifications.', benefit: 'One record from incoming inspection to final release review.' },
];

function WhoSection() {
  return (
    <Section id="who" eyebrow="Who it’s for" title="Built for industrial quality teams" tone="white">
      <div className="grid gap-6 md:grid-cols-3">
        {AUDIENCES.map((a, i) => (
          <article key={a.who} className="reveal lift spot overflow-hidden rounded-xl border border-mist-200 bg-white" style={dl(i * 100)}>
            <Scene kind={a.scene} alt={`Illustration: ${a.who.toLowerCase()} environment`} className="aspect-[16/9]" />
            <div className="p-6">
              <div className="flex items-center gap-2 text-signal-600"><a.icon size={18} /><h3 className="font-semibold text-ink-900">{a.who}</h3></div>
              <dl className="mt-4 space-y-3 text-sm">
                {([['Who', a.profile], ['How they use it', a.how], ['Benefit', a.benefit]] as const).map(([k, v]) => (
                  <div key={k}>
                    <dt className="eyebrow text-graphite-400">{k}</dt>
                    <dd className={cx('mt-1', k === 'Benefit' ? 'font-medium text-signal-600' : 'text-graphite-500')}>{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </article>
        ))}
      </div>
      <div className="reveal mt-8 grid gap-4 rounded-xl border border-mist-200 bg-mist-50 p-6 text-sm text-graphite-500 md:grid-cols-4">
        {[['Quality leads', 'set specifications and read the audit log'], ['Process engineers', 'review evidence and drive investigations'], ['Coatings inspectors', 'record readings, photos and findings'], ['Line supervisors', 'manage job status and tasks']].map(([r, t]) => (
          <p key={r}><span className="font-semibold text-ink-900">{r}</span> {t}.</p>
        ))}
      </div>
    </Section>
  );
}

type Cell = { v: 'yes' | 'no' | 'part'; t: string };
const COMPARE: { row: string; cols: [Cell, Cell, Cell, Cell] }[] = [
  { row: 'Photos tied to the job and location', cols: [{ v: 'no', t: 'On personal phones' }, { v: 'part', t: 'Attached, unstructured' }, { v: 'part', t: 'Separate module' }, { v: 'yes', t: 'Linked to job, line and spec' }] },
  { row: 'Conditions checked against your specs', cols: [{ v: 'part', t: 'By hand, if at all' }, { v: 'no', t: 'Not designed for it' }, { v: 'part', t: 'Generic checklists' }, { v: 'yes', t: 'Your own limits, every job' }] },
  { row: 'Missing readings flagged, never assumed', cols: [{ v: 'no', t: 'Blank cells' }, { v: 'no', t: 'Not tracked' }, { v: 'part', t: 'Required fields only' }, { v: 'yes', t: '“Unable to evaluate”' }] },
  { row: 'Similar defects compared side by side', cols: [{ v: 'no', t: 'From memory' }, { v: 'no', t: 'Search by keyword' }, { v: 'part', t: 'Category filters' }, { v: 'yes', t: 'With recorded conditions' }] },
  { row: 'Findings and tasks on one timeline', cols: [{ v: 'no', t: 'Email threads' }, { v: 'part', t: 'Comments' }, { v: 'yes', t: 'CAPA workflow' }, { v: 'yes', t: 'With audit trail' }] },
  { row: 'Made for coating lines', cols: [{ v: 'part', t: 'Whatever you build' }, { v: 'no', t: 'Generic' }, { v: 'no', t: 'Generic' }, { v: 'yes', t: 'Booth, substrate, DFT, dew point' }] },
];

function CompareSection() {
  const heads = ['Paper logs & spreadsheets', 'Shared drives & email', 'Generic QMS', 'Glazehour'];
  const Icon = ({ v }: { v: Cell['v'] }) => (v === 'yes' ? <Check size={16} className="shrink-0 text-signal-500" aria-label="Yes" /> : v === 'no' ? <X size={16} className="shrink-0 text-red-400" aria-label="No" /> : <Minus size={16} className="shrink-0 text-amber-400" aria-label="Partly" />);
  return (
    <Section id="compare" eyebrow="Why Glazehour" title="How it compares with the ways coating teams investigate today" intro="Glazehour works alongside your inspectors, data sheets and existing systems — it keeps the evidence together." tone="dark">
      <div className="reveal overflow-x-auto rounded-xl border border-ink-600">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead>
            <tr className="border-b border-ink-600 bg-ink-800">
              <th className="p-4 font-normal"><span className="sr-only">Capability</span></th>
              {heads.map((h, i) => <th key={h} className={cx('p-4 font-medium', i === 3 ? 'bg-signal-500/10 text-signal-400' : 'text-mist-200')}>{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {COMPARE.map((r) => (
              <tr key={r.row} className="border-b border-ink-700 last:border-0">
                <th scope="row" className="p-4 font-normal text-white">{r.row}</th>
                {r.cols.map((c, i) => (
                  <td key={i} className={cx('p-4 align-top', i === 3 && 'bg-signal-500/5')}>
                    <span className={cx('flex gap-2', i === 3 ? 'text-white' : 'text-graphite-300')}><Icon v={c.v} /> {c.t}</span>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Section>
  );
}

function ConnectedEvidence() {
  const job = JOBS[0];
  const defect = DEFECTS[0];
  return (
    <Section
      id="connected"
      eyebrow="One investigation"
      title="One investigation, connected evidence"
      intro="Each defect observation links to the specific job it came from — its recorded conditions, the product specification it was applied against, and every inspection finding."
    >
      <div className="grid gap-6 lg:grid-cols-[1fr_auto_1fr] lg:items-center">
        <figure className="reveal lift overflow-hidden rounded-lg border border-mist-200 bg-white">
          <DefectImage category={defect.category} seed={defect.photos[0].seed} alt="Demonstration image of blistering on a conveyor frame flange" className="aspect-[4/3]" />
          <figcaption className="flex items-center justify-between p-4 text-sm">
            <span><span className="font-mono text-signal-600">{defect.id}</span> · Blistering</span>
            <span className="text-graphite-500">{defect.location.split(',')[0]}</span>
          </figcaption>
        </figure>
        <div className="hidden h-px w-16 bg-graphite-300 lg:block" aria-hidden />
        <ul className="space-y-3">
          {[
            ['Job', `${job.id} · ${job.component}`, job.customer],
            ['Recorded conditions', `Substrate ${job.measurements.substrateTempC} °C · RH ${job.measurements.relativeHumidityPct}% · Dew point ${job.measurements.dewPointC} °C`, 'Entered from booth log'],
            ['Product specification', SPECIFICATIONS[0].name, 'Illustrative, user-supplied thresholds'],
            ['Inspection findings', job.inspections[0].notes, `${job.inspections[0].inspector} · ${job.inspections[0].method}`],
          ].map(([k, v, s]) => (
            <li key={k} className="reveal lift spot rounded-lg border border-mist-200 bg-white p-4">
              <p className="eyebrow text-graphite-400">{k}</p>
              <p className="mt-1.5 text-sm font-medium">{v}</p>
              <p className="mt-0.5 text-xs text-graphite-500">{s}</p>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}

function SpecReview() {
  const rows = JOBS.filter((j) => j.specificationId === 'spec-ep200').slice(0, 4);
  const spec = SPECIFICATIONS[0];
  const rule = spec.rules[0];
  return (
    <Section
      id="specs"
      eyebrow="Specification checks"
      title="Review against supplied specifications"
      intro={
        <>
          Enter the limits from your own product data sheets or process specifications. Glazehour compares recorded values with those limits — and says plainly when a comparison cannot be made.
        </>
      }
    >
      <div className="overflow-x-auto rounded-lg border border-mist-200 bg-white">
        <table className="w-full min-w-[640px] text-sm">
          <caption className="border-b border-mist-200 p-4 text-left text-xs text-graphite-500">
            Rule: <strong className="text-ink-800">{rule.label}</strong> · substrate temperature − dew point {`≥ ${rule.min} ${rule.unit}`} · illustrative threshold, configured by the user
          </caption>
          <thead className="bg-mist-50 text-left text-xs text-graphite-500">
            <tr>
              <th className="px-4 py-2.5 font-medium">Job</th>
              <th className="px-4 py-2.5 font-medium">{MEASUREMENT_META.substrateTempC.label}</th>
              <th className="px-4 py-2.5 font-medium">{MEASUREMENT_META.dewPointC.label}</th>
              <th className="px-4 py-2.5 font-medium">Calculated difference</th>
              <th className="px-4 py-2.5 font-medium">Result</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-mist-100">
            {rows.map((j) => {
              const r = evaluateSpecification({ ...spec, rules: [rule] }, j.measurements).results[0];
              return (
                <tr key={j.id}>
                  <td className="px-4 py-3 font-mono text-xs">{j.id}</td>
                  <td className="px-4 py-3 font-mono">{j.measurements.substrateTempC ?? '—'} °C</td>
                  <td className="px-4 py-3 font-mono">{j.measurements.dewPointC ?? <span className="text-graphite-400">not recorded</span>}{j.measurements.dewPointC != null && ' °C'}</td>
                  <td className="px-4 py-3 font-mono">{r.calculated !== null ? `${r.calculated} °C` : '—'}</td>
                  <td className="px-4 py-3 text-xs">
                    {r.outcome === 'pass' && <span className="font-medium text-signal-600">Within supplied limit</span>}
                    {r.outcome === 'fail' && <span className="font-medium text-fault">Below supplied limit</span>}
                    {r.outcome === 'not-evaluable' && <span className="font-medium text-amberish">{r.detail}</span>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="mt-4 text-xs text-graphite-500">Glazehour does not supply coating standards. Thresholds shown are fictional examples; your team configures its own.</p>
    </Section>
  );
}
