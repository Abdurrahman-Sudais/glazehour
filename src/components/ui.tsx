import { useEffect } from 'react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Bot, Calculator, CircleCheck, Gauge, Ruler } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { InvestigationStatus, JobStatus } from '../domain/types';
import { STATUS_LABEL } from '../domain/investigation';

/** Sets document title and meta description per route. */
export function useSeo(title: string, description: string) {
  useEffect(() => {
    document.title = title.includes('Glazehour') ? title : `${title} — Glazehour`;
    let meta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'description';
      document.head.appendChild(meta);
    }
    meta.content = description;
    const canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (canonical) canonical.href = `https://glazehour.space${window.location.pathname}`;
  }, [title, description]);
}

export function cx(...c: (string | false | null | undefined)[]) {
  return c.filter(Boolean).join(' ');
}

type Variant = 'primary' | 'secondary' | 'ghost' | 'dark';
const VARIANT: Record<Variant, string> = {
  primary: 'bg-signal-600 text-white hover:bg-signal-500',
  secondary: 'border border-mist-200 bg-white text-ink-900 hover:border-graphite-300',
  ghost: 'text-ink-700 hover:bg-mist-100',
  dark: 'border border-ink-600 bg-ink-800 text-mist-100 hover:border-graphite-500',
};

export function Button({ variant = 'primary', className, ...rest }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return (
    <button
      {...rest}
      className={cx('inline-flex items-center justify-center gap-2 rounded-md px-3.5 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50', VARIANT[variant], className)}
    />
  );
}

export function ButtonLink({ to, variant = 'primary', children, className }: { to: string; variant?: Variant; children: ReactNode; className?: string }) {
  return (
    <Link to={to} className={cx('inline-flex items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm font-medium transition-colors', VARIANT[variant], className)}>
      {children}
    </Link>
  );
}

/** Distinguishes the five kinds of information shown in the workspace. */
export type DataKind = 'recorded' | 'limit' | 'calculated' | 'ai' | 'confirmed';
const KIND: Record<DataKind, { label: string; cls: string; icon: typeof Gauge }> = {
  recorded: { label: 'Recorded measurement', cls: 'bg-mist-100 text-ink-700 border-mist-200', icon: Gauge },
  limit: { label: 'Specification limit', cls: 'bg-blue-50 text-volt-600 border-blue-200', icon: Ruler },
  calculated: { label: 'Calculated comparison', cls: 'bg-teal-50 text-signal-600 border-teal-200', icon: Calculator },
  ai: { label: 'AI suggestion (simulated)', cls: 'bg-violet-50 text-violet-700 border-violet-200 border-dashed', icon: Bot },
  confirmed: { label: 'Human-confirmed finding', cls: 'bg-emerald-50 text-emerald-800 border-emerald-300', icon: CircleCheck },
};

export function KindTag({ kind, short }: { kind: DataKind; short?: boolean }) {
  const k = KIND[kind];
  const Icon = k.icon;
  return (
    <span className={cx('inline-flex items-center gap-1 rounded border px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide', k.cls)} title={k.label}>
      <Icon size={11} aria-hidden />
      {short ? k.label.split(' ')[0] : k.label}
    </span>
  );
}

export function KindLegend() {
  return (
    <div className="flex flex-wrap gap-2" aria-label="Information type legend">
      {(Object.keys(KIND) as DataKind[]).map((k) => (
        <KindTag key={k} kind={k} />
      ))}
    </div>
  );
}

const INV_COLORS: Record<InvestigationStatus, string> = {
  open: 'bg-amber-50 text-amber-800 border-amber-200',
  'evidence-review': 'bg-sky-50 text-sky-800 border-sky-200',
  assigned: 'bg-blue-50 text-blue-800 border-blue-200',
  'findings-added': 'bg-teal-50 text-teal-800 border-teal-200',
  closed: 'bg-mist-100 text-graphite-500 border-mist-200',
};

export function InvStatus({ status }: { status: InvestigationStatus }) {
  return <span className={cx('inline-flex whitespace-nowrap rounded border px-1.5 py-0.5 text-[11px] font-medium', INV_COLORS[status])}>{STATUS_LABEL[status]}</span>;
}

export const JOB_STATUS_LABEL: Record<JobStatus, string> = {
  scheduled: 'Scheduled',
  'in-progress': 'In progress',
  inspection: 'Awaiting inspection review',
  'on-hold': 'Quality hold',
  released: 'Released',
};
const JOB_COLORS: Record<JobStatus, string> = {
  scheduled: 'bg-mist-100 text-graphite-500 border-mist-200',
  'in-progress': 'bg-blue-50 text-blue-800 border-blue-200',
  inspection: 'bg-amber-50 text-amber-800 border-amber-200',
  'on-hold': 'bg-red-50 text-red-800 border-red-200',
  released: 'bg-emerald-50 text-emerald-800 border-emerald-200',
};
export function JobStatusPill({ status }: { status: JobStatus }) {
  return <span className={cx('inline-flex whitespace-nowrap rounded border px-1.5 py-0.5 text-[11px] font-medium', JOB_COLORS[status])}>{JOB_STATUS_LABEL[status]}</span>;
}

export function Field({ label, error, children, hint, htmlFor }: { label: string; error?: string; hint?: string; children: ReactNode; htmlFor: string }) {
  return (
    <div className="space-y-1">
      <label htmlFor={htmlFor} className="block text-xs font-medium text-ink-700">
        {label}
      </label>
      {children}
      {hint && !error && <p className="text-[11px] text-graphite-500">{hint}</p>}
      {error && (
        <p id={`${htmlFor}-error`} role="alert" className="text-[11px] font-medium text-fault">
          {error}
        </p>
      )}
    </div>
  );
}

export const inputCls =
  'w-full rounded-md border border-mist-200 bg-white px-2.5 py-1.5 text-sm text-ink-900 placeholder:text-graphite-400 focus:border-volt-500 focus:outline-none focus:ring-2 focus:ring-volt-500/20 aria-[invalid=true]:border-fault';

export function DemoNotice({ className }: { className?: string }) {
  return (
    <p className={cx('rounded-md border border-dashed border-amber-300 bg-amber-50 px-3 py-2 text-xs text-amber-900', className)}>
      <strong>Demonstration records.</strong> All jobs, customers, people, measurements and specification thresholds are fictional and illustrative. They are not industry standards or recommendations.
    </p>
  );
}

export function fmtDate(iso: string) {
  const d = new Date(iso.length === 10 ? `${iso}T00:00:00` : iso);
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

/** Explains why controls are read-only for the acting demo user. */
export function RoleNote({ children }: { children: ReactNode }) {
  return (
    <p role="note" className="flex items-start gap-1.5 rounded-md border border-mist-200 bg-mist-50 px-3 py-2 text-[11.5px] text-graphite-500">
      <span aria-hidden>🔒</span>
      <span>{children}</span>
    </p>
  );
}
