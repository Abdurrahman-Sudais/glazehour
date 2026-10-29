import type { ReactNode } from 'react';
import { AlertTriangle, ArrowRight, Link2 } from 'lucide-react';
import { DefectImage } from './Imagery';
import { ButtonLink, InvStatus, KindTag, cx } from './ui';
import { DEFECTS, JOBS, SPECIFICATIONS, CATEGORY_LABEL } from '../data/seed';
import { MEASUREMENT_META, evaluateSpecification } from '../domain/rules';

export function PageHero({ eyebrow, title, intro, children }: { eyebrow: string; title: string; intro: string; children?: ReactNode }) {
  return (
    <section className="tech-grid relative overflow-hidden bg-ink-900 text-white">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-24">
        <p className="eyebrow text-signal-400">{eyebrow}</p>
        <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-[1.08] tracking-tight md:text-5xl">{title}</h1>
        <p className="mt-6 max-w-2xl text-lg text-graphite-300">{intro}</p>
        {children && <div className="mt-8">{children}</div>}
      </div>
    </section>
  );
}

export function Section({ id, eyebrow, title, intro, children, tone = 'light' }: { id?: string; eyebrow?: string; title: string; intro?: ReactNode; children?: ReactNode; tone?: 'light' | 'white' | 'dark' }) {
  return (
    <section id={id} className={cx(tone === 'dark' ? 'tech-grid bg-ink-900 text-white' : tone === 'white' ? 'bg-white' : 'bg-mist-50')} aria-labelledby={id ? `${id}-title` : undefined}>
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        {eyebrow && <p className={cx('eyebrow', tone === 'dark' ? 'text-signal-400' : 'text-signal-600')}>{eyebrow}</p>}
        <h2 id={id ? `${id}-title` : undefined} className="mt-3 max-w-3xl text-3xl font-semibold tracking-tight md:text-[2.1rem] md:leading-tight">
          {title}
        </h2>
        {intro && <div className={cx('mt-4 max-w-2xl text-base leading-relaxed', tone === 'dark' ? 'text-graphite-300' : 'text-graphite-500')}>{intro}</div>}
        {children && <div className="mt-12">{children}</div>}
      </div>
    </section>
  );
}

export function CtaBand({ title, text }: { title: string; text: string }) {
  return (
    <section className="tech-grid bg-ink-950 text-white">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 px-4 py-20 sm:px-6 md:flex-row md:items-center">
        <div>
          <h2 className="max-w-2xl text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
          <p className="mt-4 max-w-xl text-graphite-300">{text}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <ButtonLink to="/investigations">
            Explore the Investigation Workspace <ArrowRight size={16} />
          </ButtonLink>
          <ButtonLink to="/contact" variant="dark">
            Talk to us
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}

/** Product preview built from the same demo records and rules engine as the workspace. */
export function ProductPreview() {
  const job = JOBS[0];
  const spec = SPECIFICATIONS.find((s) => s.id === job.specificationId);
  const summary = evaluateSpecification(spec, job.measurements);
  const defects = DEFECTS.filter((d) => ['D-1042', 'D-1043', 'D-1049'].includes(d.id));
  const keys = ['substrateTempC', 'ambientTempC', 'relativeHumidityPct', 'dewPointC'] as const;

  return (
    <div className="overflow-hidden rounded-xl border border-ink-600 bg-ink-800 shadow-2xl shadow-black/40" aria-label="Product preview with demonstration data">
      <div className="flex items-center justify-between border-b border-ink-600 px-4 py-2.5">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-ink-600" />
          <span className="h-2.5 w-2.5 rounded-full bg-ink-600" />
          <span className="h-2.5 w-2.5 rounded-full bg-ink-600" />
          <span className="ml-3 font-mono text-[11px] text-graphite-400">INV-301 · Recurring blistering, Wet Line 2</span>
        </div>
        <InvStatus status="findings-added" />
      </div>
      <div className="grid gap-px bg-ink-600 md:grid-cols-5">
        <div className="bg-ink-800 p-4 md:col-span-3">
          <p className="eyebrow text-graphite-400">Defect observations</p>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {defects.map((d) => (
              <figure key={d.id} className="overflow-hidden rounded-md border border-ink-600 bg-ink-900">
                <DefectImage category={d.category} seed={d.photos[0].seed} alt={`Demonstration image: ${d.photos[0].caption}`} className="aspect-[4/3]" showBadge={false} />
                <figcaption className="px-2 py-1.5">
                  <p className="font-mono text-[10px] text-signal-400">{d.id}</p>
                  <p className="truncate text-[11px] text-mist-200">{CATEGORY_LABEL[d.category]} · {d.jobId}</p>
                </figcaption>
              </figure>
            ))}
          </div>
          <div className="mt-4 rounded-md border border-ink-600 bg-ink-900 p-3">
            <div className="flex items-center gap-2 text-[11px] text-graphite-300">
              <Link2 size={13} className="text-signal-400" /> Linked job record
            </div>
            <p className="mt-1.5 text-sm text-white">{job.id} · {job.component}</p>
            <p className="text-xs text-graphite-400">{job.substrate} · {job.coatingSystem}</p>
          </div>
        </div>
        <div className="space-y-3 bg-ink-800 p-4 md:col-span-2">
          <p className="eyebrow text-graphite-400">Recorded conditions</p>
          <dl className="grid grid-cols-2 gap-2">
            {keys.map((k) => (
              <div key={k} className="rounded-md border border-ink-600 bg-ink-900 px-2.5 py-2">
                <dt className="text-[10px] text-graphite-400">{MEASUREMENT_META[k].label}</dt>
                <dd className="font-mono text-sm text-white">
                  {job.measurements[k] ?? '—'} <span className="text-graphite-400">{MEASUREMENT_META[k].unit}</span>
                </dd>
              </div>
            ))}
          </dl>
          <div className="rounded-md border border-ink-600 bg-ink-900 p-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-graphite-300">{summary.results[0]?.label}</span>
              <span className={cx('font-mono text-xs', summary.results[0]?.outcome === 'fail' ? 'text-red-300' : 'text-signal-400')}>
                Δ {summary.results[0]?.calculated} °C · {summary.results[0]?.outcome === 'fail' ? 'below limit' : 'within limit'}
              </span>
            </div>
            <p className="mt-1 text-[10px] text-graphite-400">Illustrative limit {summary.results[0]?.limitText}, configured by user</p>
          </div>
          <div className="flex items-start gap-2 rounded-md border border-amber-500/40 bg-amber-500/10 p-2.5 text-[11px] text-amber-200">
            <AlertTriangle size={14} className="mt-0.5 shrink-0" />
            <span>Missing evidence on J-24121: dew-point reading and surface profile not recorded.</span>
          </div>
          <div className="flex flex-wrap gap-1.5 opacity-90">
            <KindTag kind="recorded" short />
            <KindTag kind="limit" short />
            <KindTag kind="calculated" short />
            <KindTag kind="ai" short />
            <KindTag kind="confirmed" short />
          </div>
        </div>
      </div>
    </div>
  );
}

export function FeatureCard({ icon, title, children }: { icon: ReactNode; title: string; children: ReactNode }) {
  return (
    <div className="rounded-lg border border-mist-200 bg-white p-6">
      <div className="flex h-9 w-9 items-center justify-center rounded-md border border-mist-200 bg-mist-50 text-signal-600">{icon}</div>
      <h3 className="mt-4 text-base font-semibold">{title}</h3>
      <div className="mt-2 text-sm leading-relaxed text-graphite-500">{children}</div>
    </div>
  );
}

export const STEPS = [
  { n: '01', title: 'Record the affected job', text: 'Capture the job reference, substrate, coating system, line and the product specification your team works to.' },
  { n: '02', title: 'Add defect photographs and available measurements', text: 'Attach photographs and whatever readings were actually taken. Gaps are flagged, never filled in.' },
  { n: '03', title: 'Review related cases and specification checks', text: 'See visually similar observations from other jobs and compare recorded values with the limits you supplied.' },
  { n: '04', title: 'Assign investigation tasks and record findings', text: 'Assign an investigator, track tasks and record human-confirmed findings on a single timeline.' },
];
