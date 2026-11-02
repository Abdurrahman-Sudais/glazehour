import type { CSSProperties } from 'react';
import { ArrowRight, Bot, Check, Clock, Compass, Lock, Mail, Rocket, ShieldCheck, Sparkles, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Section } from '../components/marketing';
import { LeadForm } from '../components/LeadForm';
import { cx } from '../components/ui';
import { FOUNDERS, SITE, type Person } from '../data/site';
import { PLANS } from './Company';
import { PIPELINE, SAFEGUARDS } from './Trust';

const d = (ms: number) => ({ '--d': `${ms}ms` }) as CSSProperties;

export function AiSection() {
  return (
    <Section eyebrow="AI, used carefully" title="Answers from your own inspection records, not guesses" intro="Glazehour’s assistant explains what the records and specification checks show. The comparisons are deterministic; the wording only makes them easier to read." tone="white">
      <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:items-start">
        <ul className="space-y-3">
          {(
            [
              [true, 'Summarise a job: conditions, failed rules, missing readings and linked observations'],
              [true, 'Answer “which investigations need attention?” and “which jobs failed a specification check?”'],
              [true, 'List the records it used, so every answer can be checked'],
              [true, 'Suggest evidence to collect — not conclusions'],
              [false, 'Name the cause of a defect'],
              [false, 'Prescribe a corrective process, or accept or release work'],
            ] as const
          ).map(([ok, t], i) => (
            <li key={t} className="reveal lift flex gap-3 rounded-lg border border-mist-200 bg-mist-50 p-4 text-sm text-ink-800" style={d(i * 60)}>
              {ok ? <Check size={16} className="mt-0.5 shrink-0 text-signal-600" aria-label="Does" /> : <X size={16} className="mt-0.5 shrink-0 text-fault" aria-label="Never does" />}
              {t}
            </li>
          ))}
        </ul>
        <div className="reveal relative" style={d(120)}>
          <div className="pointer-events-none absolute -inset-4 rounded-2xl bg-signal-500/10 blur-2xl" aria-hidden />
          <div className="tech-grid relative rounded-xl border border-ink-600 bg-ink-900 p-6 text-white shadow-2xl shadow-ink-950/40">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Bot size={16} className="text-signal-400" /> Ask about this facility
              <span className="rounded border border-ink-600 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-graphite-300">Sample data</span>
            </div>
            <p className="ml-auto mt-5 w-fit max-w-[85%] rounded-lg rounded-br-sm bg-signal-500/15 px-3 py-2 text-sm text-teal-100">What happened on J-24117?</p>
            <div className="mt-3 max-w-[92%] rounded-lg rounded-bl-sm border border-ink-600 bg-ink-800 p-3 text-sm text-mist-200">
              <p><span className="font-mono text-white">J-24117</span> · conveyor side frame, EP-200 epoxy. Substrate-minus-dew-point is below the limit your team supplied.</p>
              <p className="mt-2"><span className="font-mono text-white">D-1042</span> blistering on the lower flange is linked to <span className="font-mono text-white">INV-301</span>.</p>
              <p className="mt-3 font-mono text-[11px] text-graphite-400">From records J-24117, D-1042, INV-301</p>
            </div>
            <p className="ml-auto mt-4 w-fit rounded-lg rounded-br-sm bg-signal-500/15 px-3 py-2 text-sm text-teal-100">What caused it?</p>
            <div className="mt-3 max-w-[92%] rounded-lg rounded-bl-sm border border-ink-600 bg-ink-800 p-3 text-sm text-graphite-300">That’s for your quality team to confirm. I can show which readings are missing, which rules failed and which similar observations exist.</div>
            <Link to="/investigations" className="mt-6 inline-flex items-center gap-2 rounded-md bg-signal-600 px-3.5 py-2 text-sm font-medium text-white hover:bg-signal-500">Try the assistant in the demo <ArrowRight size={15} /></Link>
          </div>
        </div>
      </div>
    </Section>
  );
}

export function SafeguardsSection() {
  return (
    <Section eyebrow="Safeguards" title="Evidence informs the investigation. People decide." tone="dark">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {SAFEGUARDS.map(([t, b], i) => (
          <div key={t} className="reveal lift rounded-lg border border-ink-600 bg-ink-800 p-6 hover:border-signal-500/50" style={d((i % 3) * 90)}>
            <span className="flex h-10 w-10 items-center justify-center rounded-md bg-signal-500/10"><ShieldCheck size={18} className="text-signal-400" /></span>
            <h3 className="mt-4 font-semibold text-white">{t}</h3>
            <p className="mt-2 text-sm text-graphite-300">{b}</p>
          </div>
        ))}
      </div>
      <Link to="/security" className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-signal-400 hover:underline">Security and safeguards in detail <ArrowRight size={15} /></Link>
    </Section>
  );
}

export function TechnologySection() {
  return (
    <Section id="technology" eyebrow="Technology" title="How we use Amazon Web Services" intro="A proposed serverless architecture: capture evidence at the line, keep every record linked, keep the checks deterministic, and use Amazon Bedrock only to explain." tone="white">
      <ol className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {PIPELINE.map((p, i) => (
          <li key={p.step} className="reveal lift spot rounded-lg border border-mist-200 bg-mist-50 p-5" style={d(i * 90)}>
            <span className="font-mono text-xs text-signal-600">{p.step}</span>
            <h3 className="mt-2 font-semibold">{p.title}</h3>
            <p className="mt-1 font-mono text-[11px] text-signal-600">{p.services}</p>
            <p className="mt-3 text-sm text-graphite-500">{p.body}</p>
          </li>
        ))}
      </ol>
      <p className="mt-6 text-sm text-graphite-500">These services are proposed, not deployed. The demo runs in your browser on fictional records.</p>
      <Link to="/technology" className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-volt-600 hover:underline">The full architecture <ArrowRight size={15} /></Link>
    </Section>
  );
}

export function PricingSection() {
  return (
    <Section id="pricing" eyebrow="Pricing" title="Simple plans that grow with your quality team" tone="dark">
      <div className="grid gap-5 lg:grid-cols-3">
        {PLANS.map((p, i) => (
          <div key={p.name} className={cx('reveal lift relative flex flex-col rounded-xl border p-6', p.featured ? 'border-signal-500 bg-gradient-to-b from-ink-800 to-ink-900 ring-1 ring-signal-500/40' : 'border-ink-600 bg-ink-800')} style={d(i * 100)}>
            {p.featured && <span className="absolute -top-3 left-6 rounded-full bg-signal-500 px-2.5 py-0.5 text-xs font-medium text-ink-950">Most popular</span>}
            <h3 className="text-lg font-semibold text-white">{p.name}</h3>
            <p className="mt-1 text-sm text-graphite-300">{p.blurb}</p>
            <div className="mt-4 flex items-baseline gap-1">
              <span className="text-4xl font-semibold text-white">{p.price}</span>
              <span className="text-graphite-400">{p.per}</span>
            </div>
            <ul className="mt-5 flex-1 space-y-2.5">
              {p.features.map((f) => (
                <li key={f} className="flex gap-2 text-sm text-mist-200"><Check size={16} className="mt-0.5 shrink-0 text-signal-400" /> {f}</li>
              ))}
            </ul>
            <Link to={`/contact?plan=${encodeURIComponent(p.name)}`} className={cx('mt-6 inline-flex justify-center rounded-md px-4 py-2.5 text-sm font-medium', p.featured ? 'bg-signal-600 text-white hover:bg-signal-500' : 'border border-ink-600 text-white hover:bg-ink-700')}>{p.cta}</Link>
          </div>
        ))}
      </div>
      <p className="mt-6 text-sm text-graphite-400">Prices in USD, excluding taxes. Early-access teams are onboarded directly by the founders. <Link to="/pricing" className="text-signal-400 hover:underline">Compare plans</Link></p>
    </Section>
  );
}

export const ROADMAP = [
  { icon: Sparkles, stage: 'Now', title: 'Live demo & early access', items: ['Interactive workspace on a fictional finishing facility', 'Specification checks, similar-case groups, investigation timeline', 'Roles, audit log and grounded assistant', 'Early-access requests open'], current: true },
  { icon: Compass, stage: 'Next', title: 'Pilot on one line', items: ['Photo and reading capture from a tablet at the line', 'Your own specifications and limits', 'Investigation workflow with email notifications'] },
  { icon: Rocket, stage: 'Then', title: 'General availability', items: ['Multiple lines and facilities', 'Single sign-on with roles enforced on the server', 'Evidence summaries written with Amazon Bedrock', 'Customer-ready investigation reports'] },
  { icon: Clock, stage: 'Later', title: 'Exploring with pilot teams', items: ['Data-logger and ERP integrations', 'Similar-observation suggestions trained on your photos', 'Supplier batch traceability'] },
];

export function RoadmapSection() {
  return (
    <Section id="roadmap" eyebrow="Roadmap" title="Where Glazehour is going" intro="Built with early-access teams. The order below is our plan and may change based on what pilots teach us." tone="white">
      <ol className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {ROADMAP.map((r, i) => (
          <li key={r.stage} className={cx('reveal lift rounded-xl border p-6', r.current ? 'border-signal-500 bg-white shadow-lg shadow-signal-600/10' : 'border-mist-200 bg-mist-50')} style={d(i * 100)}>
            <div className="flex items-center justify-between">
              <span className={cx('flex h-10 w-10 items-center justify-center rounded-md', r.current ? 'bg-ink-900 text-signal-400' : 'bg-mist-100 text-graphite-500')}><r.icon size={18} /></span>
              <span className={cx('flex items-center gap-2 font-mono text-xs uppercase tracking-wider', r.current ? 'text-signal-600' : 'text-graphite-400')}>{r.current && <span className="live-dot" aria-hidden />}{r.stage}</span>
            </div>
            <h3 className="mt-4 font-semibold">{r.title}</h3>
            <ul className="mt-3 space-y-2">
              {r.items.map((t) => <li key={t} className="flex gap-2 text-sm text-graphite-500"><Check size={15} className={cx('mt-0.5 shrink-0', r.current ? 'text-signal-600' : 'text-graphite-300')} /> {t}</li>)}
            </ul>
          </li>
        ))}
      </ol>
    </Section>
  );
}

export function PersonCard({ person, delay = 0 }: { person: Person; delay?: number }) {
  return (
    <article className="reveal lift spot relative overflow-hidden rounded-2xl border border-ink-600 bg-gradient-to-br from-ink-800 to-ink-900 p-6 text-white sm:p-8" style={d(delay)}>
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
        <div className="relative grid h-24 w-24 shrink-0 place-items-center" aria-hidden>
          <div className="spin-slow absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,#2dd4bf,#2563eb,#14b8a6,#2dd4bf)]" style={{ animationDelay: `-${delay / 10}s` }} />
          <div className="absolute inset-[3px] grid place-items-center rounded-full bg-ink-900 font-mono text-2xl text-signal-400">{person.initials}</div>
        </div>
        <div>
          <p className="eyebrow text-signal-400">{person.role}</p>
          <h3 className="mt-1 text-2xl font-semibold">{person.name}</h3>
          <p className="mt-3 max-w-xl text-graphite-300">{person.bio}</p>
          <ul className="mt-4 flex flex-wrap gap-2" aria-label="Focus areas">
            {person.focus.map((f) => <li key={f} className="rounded-full border border-ink-600 bg-ink-800 px-2.5 py-1 text-xs text-mist-200">{f}</li>)}
          </ul>
          {person.email && <a href={`mailto:${person.email}`} className="mt-4 inline-flex items-center gap-1.5 text-sm text-signal-400 hover:underline"><Mail size={15} /> {person.email}</a>}
        </div>
      </div>
    </article>
  );
}

export function FoundersGrid() {
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      {FOUNDERS.map((p, i) => <PersonCard key={p.name} person={p} delay={i * 120} />)}
    </div>
  );
}

export function TeamSection() {
  return (
    <Section id="team" eyebrow="Team" title="The people building Glazehour" intro={`Founded by ${FOUNDERS.map((f) => f.name).join(' and ')}, and built together with the coating inspectors and quality engineers who will use it.`} tone="dark">
      <FoundersGrid />
      <div className="reveal mt-5 grid gap-6 rounded-2xl border border-ink-600 bg-ink-800 p-6 sm:p-8 lg:grid-cols-[1.2fr_1fr] lg:items-center">
        <div>
          <h3 className="text-lg font-semibold text-white">Building with coating teams</h3>
          <p className="mt-2 text-sm text-graphite-300">Glazehour is shaped by conversations with coating contractors, metal finishers and in-house quality teams. Early-access teams get a direct line to the founders and a say in what we build next.</p>
          <Link to="/about" className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-signal-400 hover:underline">Our story <ArrowRight size={15} /></Link>
        </div>
        <div>
          <p className="eyebrow text-graphite-400">We’d like to hear from</p>
          <ul className="mt-3 space-y-2 text-sm text-mist-200">
            {['Facilities willing to pilot on one line', 'Coating inspectors and quality engineers', 'Advisors who know industrial finishing'].map((t) => <li key={t} className="flex gap-2"><Check size={16} className="mt-0.5 shrink-0 text-signal-400" /> {t}</li>)}
          </ul>
        </div>
      </div>
    </Section>
  );
}

export const FAQS: [string, string][] = [
  ['Does Glazehour tell us what caused a defect?', 'No. It brings together the photographs, job conditions, inspection records and specification checks for an observation, and shows similar observations from other jobs. Your investigators decide on the cause and record the finding.'],
  ['What problem does it actually solve?', 'When a defect turns up, the evidence is scattered: photos on phones, booth readings in a logbook, data sheets in a shared drive and operator notes on a whiteboard. Glazehour keeps each observation attached to the evidence available at the time — and records clearly what was not.'],
  ['Do you supply coating standards or thresholds?', 'No. Every limit comes from your own product data sheets or specifications. The thresholds in the demo are fictional examples.'],
  ['What happens when a reading wasn’t taken?', 'The rule shows “Unable to evaluate: required measurement missing.” Values are never estimated or filled in, and the missing evidence is listed.'],
  ['How does similar-case grouping work?', 'In the demo, groups are predefined. In production, a vision model may suggest visually similar observations so you can compare their recorded conditions side by side. A similar appearance is a reason to compare, not a shared cause.'],
  ['Who can change what?', 'Quality leads, process engineers, coatings inspectors and line supervisors each get only the actions they need, and every change is written to an audit log. Try “Demo as” in the workspace.'],
  ['What does the AI do?', 'It explains recorded data and rule results in plain language and answers questions from your own records, listing the records it used. It never names causes, prescribes corrective processes or accepts work.'],
  ['Do we need new hardware?', 'No. Inspectors use a phone or tablet. Data-logger exports can be uploaded; direct integrations are planned with pilot teams.'],
  ['How much does it cost?', 'Inspector is $79/month and Quality Team is $249/month; Enterprise is priced per deployment. Prices exclude taxes.'],
  ['Is it available today?', 'Glazehour is in early access. The demo workspace runs in your browser on fictional records; a pilot runs on one of your lines. Request early access and one of the founders will reply personally.'],
];

export function FaqSection() {
  return (
    <Section id="faq" eyebrow="FAQ" title="Questions coating teams ask" tone="white">
      <div className="grid gap-10 lg:grid-cols-[1fr_2fr]">
        <div className="reveal">
          <p className="text-graphite-500">Can’t find your answer?</p>
          <a href={`mailto:${SITE.email}`} className="mt-2 inline-flex items-center gap-2 font-medium text-volt-600 hover:underline"><Mail size={15} /> Email the founders</a>
        </div>
        <div className="divide-y divide-mist-200 rounded-xl border border-mist-200 bg-white">
          {FAQS.map(([q, a]) => (
            <details key={q} className="group px-5 py-4 [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium">
                {q}
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full border border-mist-200 text-signal-600 transition-transform duration-300 group-open:rotate-45" aria-hidden>+</span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-graphite-500">{a}</p>
            </details>
          ))}
        </div>
      </div>
    </Section>
  );
}

export function EarlyAccessSection() {
  return (
    <Section id="early-access" eyebrow="Early access" title="Request early access" intro="Early-access teams get guided setup on one coating line and a direct say in what we build next.">
      <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        <div className="rounded-xl border border-mist-200 bg-white p-6 md:p-8"><LeadForm compact /></div>
        <div className="space-y-5">
          <ul className="space-y-3 text-sm text-ink-800">
            {['Guided setup on one line with the records you already keep', 'Direct line to the founders', 'Launch pricing on Inspector, Quality Team or Enterprise', 'No commitment — a request is not a subscription'].map((t) => <li key={t} className="flex gap-2"><Check size={16} className="mt-0.5 shrink-0 text-signal-600" /> {t}</li>)}
            <li className="flex gap-2 text-graphite-500"><Lock size={16} className="mt-0.5 shrink-0" /> Please don’t include confidential customer data.</li>
          </ul>
          <div className="tech-grid rounded-xl bg-ink-900 p-5 text-white">
            <p className="eyebrow text-signal-400">What happens next</p>
            <ol className="mt-3 space-y-2 text-sm text-graphite-300">
              <li>1. A founder replies to arrange a short call.</li>
              <li>2. We look at your lines, coating systems and records.</li>
              <li>3. If it’s a fit, we scope a pilot on one line.</li>
            </ol>
          </div>
        </div>
      </div>
    </Section>
  );
}
