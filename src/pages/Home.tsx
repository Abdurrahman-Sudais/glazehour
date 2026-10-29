import { ArrowRight, Building2, Camera, Factory, FileSpreadsheet, FileText, MessageSquareText, ShieldCheck, Wrench } from 'lucide-react';
import { CtaBand, ProductPreview, STEPS, Section } from '../components/marketing';
import { DefectImage, Scene } from '../components/Imagery';
import { ButtonLink, KindTag, useSeo } from '../components/ui';
import { DEFECTS, JOBS, SPECIFICATIONS } from '../data/seed';
import { MEASUREMENT_META, evaluateSpecification } from '../domain/rules';
import { SIMILARITY_DISCLAIMER } from '../domain/similarity';

export default function Home() {
  useSeo('Glazehour — Investigate coating defects with the full process in view', 'Bring defect images, job conditions, inspection records and product specifications together so coating teams can investigate recurring issues with better context.');

  return (
    <>
      <section className="tech-grid relative overflow-hidden bg-ink-900 text-white">
        <div className="mx-auto grid max-w-7xl items-center gap-14 px-4 pb-20 pt-16 sm:px-6 lg:grid-cols-[1fr_1.15fr] lg:pt-24">
          <div>
            <p className="eyebrow text-signal-400">Connect the defect to the evidence.</p>
            <h1 className="mt-5 text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl lg:text-[3.4rem]">
              Investigate coating defects with the full process in view.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-graphite-300">
              Bring defect images, job conditions, inspection records, and product specifications together so your team can investigate recurring issues with better context.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <ButtonLink to="/investigations" className="px-5 py-3">
                Explore the Investigation Workspace <ArrowRight size={16} />
              </ButtonLink>
              <ButtonLink to="/how-it-works" variant="dark" className="px-5 py-3">
                See How It Works
              </ButtonLink>
            </div>
            <dl className="mt-12 grid max-w-md grid-cols-3 gap-6 border-t border-ink-700 pt-6">
              {[
                ['Photos', 'linked to jobs'],
                ['Readings', 'checked against your specs'],
                ['Findings', 'confirmed by people'],
              ].map(([a, b]) => (
                <div key={a}>
                  <dt className="font-mono text-sm text-white">{a}</dt>
                  <dd className="mt-1 text-xs text-graphite-400">{b}</dd>
                </div>
              ))}
            </dl>
          </div>
          <ProductPreview />
        </div>
      </section>

      {/* A */}
      <Section
        id="fragmented"
        eyebrow="The problem"
        title="Why defect investigations become fragmented"
        intro="A blistered panel turns up at final inspection. The photograph is on a phone, the booth readings are in a logbook, the product data sheet is in a shared drive and the sprayer’s note is on a whiteboard that has since been wiped."
        tone="white"
      >
        <div className="grid gap-4 md:grid-cols-4">
          {[
            { icon: <Camera size={18} />, t: 'Photographs', d: 'Taken on personal devices, named by date, rarely tied to a job number or a location on the part.' },
            { icon: <FileSpreadsheet size={18} />, t: 'Process logs', d: 'Temperatures and humidity recorded on paper or in a spreadsheet that nobody links back to the defect.' },
            { icon: <FileText size={18} />, t: 'Datasheets', d: 'Application windows sit in PDFs. Comparing them with what was recorded is manual and inconsistent.' },
            { icon: <MessageSquareText size={18} />, t: 'Operator notes', d: 'The most useful context — a door left open, a new batch, a late heater — is often never written down at all.' },
          ].map((c) => (
            <div key={c.t} className="rounded-lg border border-mist-200 bg-mist-50 p-5">
              <div className="text-graphite-500">{c.icon}</div>
              <h3 className="mt-3 font-semibold">{c.t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-graphite-500">{c.d}</p>
            </div>
          ))}
        </div>
        <p className="mt-8 max-w-3xl border-l-2 border-signal-500 pl-4 text-sm text-graphite-500">
          When the same defect returns a month later, the team starts again from nothing. Glazehour keeps each observation attached to the evidence that was available at the time — and records clearly what was not.
        </p>
      </Section>

      {/* B */}
      <ConnectedEvidence />

      {/* C */}
      <Section
        id="similar"
        eyebrow="Find similar cases"
        title="Group visually similar observations — without assuming a shared cause"
        intro="Glazehour can suggest observations from other jobs that look alike, so an investigator can line up their recorded conditions side by side. A similar appearance is a reason to compare, not a conclusion."
        tone="white"
      >
        <div className="grid items-start gap-8 lg:grid-cols-[1.2fr_1fr]">
          <div className="grid grid-cols-3 gap-3">
            {DEFECTS.filter((d) => d.category === 'blistering').map((d) => {
              const job = JOBS.find((j) => j.id === d.jobId)!;
              return (
                <figure key={d.id} className="overflow-hidden rounded-lg border border-mist-200 bg-white">
                  <DefectImage category={d.category} seed={d.photos[0].seed} alt={`Demonstration image of blistering on ${job.component}`} className="aspect-square" />
                  <figcaption className="p-3 text-xs">
                    <p className="font-mono text-signal-600">{d.id}</p>
                    <p className="mt-0.5 text-graphite-500">{job.id} · {job.line}</p>
                  </figcaption>
                </figure>
              );
            })}
          </div>
          <div className="space-y-4">
            <div className="rounded-lg border border-dashed border-violet-300 bg-violet-50 p-5">
              <KindTag kind="ai" />
              <p className="mt-3 text-sm text-ink-800">Suggested group: dome-shaped blisters, 1–4 mm, clustered. Three observations across two lines and three jobs.</p>
            </div>
            <div className="flex items-start gap-3 rounded-lg border border-mist-200 bg-mist-50 p-5 text-sm text-graphite-500">
              <ShieldCheck className="mt-0.5 shrink-0 text-ink-700" size={18} />
              <p>{SIMILARITY_DISCLAIMER}</p>
            </div>
          </div>
        </div>
      </Section>

      {/* D */}
      <SpecReview />

      {/* E */}
      <Section id="how" eyebrow="How it works" title="Four steps from observation to finding" tone="dark">
        <ol className="grid gap-px overflow-hidden rounded-lg border border-ink-600 bg-ink-600 md:grid-cols-4">
          {STEPS.map((s) => (
            <li key={s.n} className="bg-ink-800 p-6">
              <span className="font-mono text-sm text-signal-400">{s.n}</span>
              <h3 className="mt-3 font-semibold text-white">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-graphite-300">{s.text}</p>
            </li>
          ))}
        </ol>
        <div className="mt-8">
          <ButtonLink to="/how-it-works" variant="dark">
            See the full workflow <ArrowRight size={16} />
          </ButtonLink>
        </div>
      </Section>

      {/* F */}
      <Section id="teams" eyebrow="Who it’s for" title="Built for industrial quality teams" tone="white">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { icon: <Wrench size={18} />, scene: 'line' as const, t: 'Coating contractors', d: 'Keep a defensible record of conditions and inspections for every customer job, and answer “what happened here?” with evidence.' },
            { icon: <Factory size={18} />, scene: 'panel' as const, t: 'Metal-finishing operations', d: 'Track recurring issues across powder and wet lines, shifts and substrate batches without chasing paper logs.' },
            { icon: <Building2 size={18} />, scene: 'facility' as const, t: 'In-house manufacturing quality', d: 'Connect paint-shop observations with incoming inspection, supplier data and your own internal specifications.' },
          ].map((c) => (
            <article key={c.t} className="overflow-hidden rounded-lg border border-mist-200 bg-white">
              <Scene kind={c.scene} alt={`Illustration: ${c.t.toLowerCase()} environment`} className="aspect-[16/9]" />
              <div className="p-6">
                <div className="flex items-center gap-2 text-signal-600">{c.icon}<h3 className="font-semibold text-ink-900">{c.t}</h3></div>
                <p className="mt-3 text-sm leading-relaxed text-graphite-500">{c.d}</p>
              </div>
            </article>
          ))}
        </div>
      </Section>

      {/* G */}
      <CtaBand title="Turn recurring defects into structured investigations." text="Open the demonstration workspace with fictional records, or talk to us about your facility." />
    </>
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
        <figure className="overflow-hidden rounded-lg border border-mist-200 bg-white">
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
            <li key={k} className="rounded-lg border border-mist-200 bg-white p-4">
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
