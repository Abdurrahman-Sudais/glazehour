import { useState } from 'react';
import type { FormEvent } from 'react';
import { AlertTriangle, CircleCheck, CircleSlash, CircleX } from 'lucide-react';
import { Button, KindTag, cx, inputCls } from '../components/ui';
import { MEASUREMENT_KEYS, MEASUREMENT_META, evaluateSpecification, isValidReading, parseReading } from '../domain/rules';
import type { RuleResult } from '../domain/rules';
import type { Job, MeasurementKey, Measurements, Specification } from '../domain/types';

export function OutcomeBadge({ r }: { r: RuleResult }) {
  if (r.outcome === 'pass')
    return <span className="inline-flex items-center gap-1 text-xs font-medium text-signal-600"><CircleCheck size={14} /> Within supplied limit</span>;
  if (r.outcome === 'fail')
    return <span className="inline-flex items-center gap-1 text-xs font-medium text-fault"><CircleX size={14} /> Outside supplied limit</span>;
  return <span className="inline-flex items-center gap-1 text-xs font-medium text-amberish"><CircleSlash size={14} /> Not evaluated</span>;
}

/** Recorded measurements table. Missing values are shown as such, never estimated. */
export function MeasurementsTable({ m, keys = MEASUREMENT_KEYS }: { m: Measurements; keys?: MeasurementKey[] }) {
  return (
    <div>
      <div className="mb-2"><KindTag kind="recorded" /></div>
      <dl className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {keys.filter((k) => k in m || ['substrateTempC', 'ambientTempC', 'relativeHumidityPct', 'dewPointC'].includes(k)).map((k) => {
          const v = m[k];
          const ok = isValidReading(v);
          return (
            <div key={k} className={cx('rounded-md border px-3 py-2', ok ? 'border-mist-200 bg-mist-50' : 'border-dashed border-amber-300 bg-amber-50/60')}>
              <dt className="text-[11px] text-graphite-500">{MEASUREMENT_META[k].label}</dt>
              <dd className={cx('mt-0.5 font-mono text-sm', ok ? 'text-ink-900' : 'text-amberish')}>
                {ok ? <>{v} <span className="text-graphite-400">{MEASUREMENT_META[k].unit}</span></> : 'Not recorded'}
              </dd>
            </div>
          );
        })}
      </dl>
    </div>
  );
}

export function SpecCheckPanel({ spec, m }: { spec: Specification | undefined; m: Measurements }) {
  if (!spec) return <p className="text-sm text-graphite-500">No specification linked to this job.</p>;
  const summary = evaluateSpecification(spec, m);
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-sm font-medium">{spec.name}</p>
          <p className="text-[11px] text-graphite-500">{spec.product} · {spec.source}</p>
        </div>
        <p className="font-mono text-[11px] text-graphite-500">
          {summary.pass} within · {summary.fail} outside · {summary.notEvaluable} not evaluated
        </p>
      </div>
      {spec.illustrative && (
        <p className="rounded border border-blue-200 bg-blue-50 px-2.5 py-1.5 text-[11px] text-blue-900">Illustrative thresholds, configured by the user. Not an industry standard.</p>
      )}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] text-sm">
          <thead className="text-left text-[11px] text-graphite-500">
            <tr className="border-b border-mist-200">
              <th className="py-2 pr-3 font-medium">Rule</th>
              <th className="py-2 pr-3 font-medium"><KindTag kind="limit" short /></th>
              <th className="py-2 pr-3 font-medium"><KindTag kind="calculated" short /></th>
              <th className="py-2 font-medium">Result</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-mist-100">
            {summary.results.map((r) => (
              <tr key={r.ruleId} className="align-top">
                <td className="py-2.5 pr-3">
                  <p className="font-medium">{r.label}</p>
                  <p className="mt-0.5 text-[11px] text-graphite-500">{r.detail}</p>
                  {r.missing.length > 0 && (
                    <p className="mt-0.5 text-[11px] text-amberish">Missing: {r.missing.map((k) => MEASUREMENT_META[k].label).join(', ')}</p>
                  )}
                </td>
                <td className="py-2.5 pr-3 font-mono text-xs text-volt-600">{r.limitText}</td>
                <td className="py-2.5 pr-3 font-mono text-xs">{r.calculated !== null ? r.calculated : '—'}</td>
                <td className="py-2.5"><OutcomeBadge r={r} /></td>
              </tr>
            ))}
            {summary.results.length === 0 && (
              <tr><td colSpan={4} className="py-4 text-center text-xs text-graphite-500">No enabled rules on this specification.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/** Form for entering or correcting recorded measurements; blank = not recorded. */
export function MeasurementEditor({ job, onSave, onCancel }: { job: Job; onSave: (m: Measurements) => void; onCancel: () => void }) {
  const [values, setValues] = useState<Record<MeasurementKey, string>>(
    () => Object.fromEntries(MEASUREMENT_KEYS.map((k) => [k, isValidReading(job.measurements[k]) ? String(job.measurements[k]) : ''])) as Record<MeasurementKey, string>,
  );
  const [errors, setErrors] = useState<Partial<Record<MeasurementKey, string>>>({});

  function submit(e: FormEvent) {
    e.preventDefault();
    const out: Measurements = {};
    const errs: Partial<Record<MeasurementKey, string>> = {};
    MEASUREMENT_KEYS.forEach((k) => {
      const { value, error } = parseReading(values[k]);
      if (error) errs[k] = error;
      else if (k === 'relativeHumidityPct' && value !== null && (value < 0 || value > 100)) errs[k] = 'Relative humidity must be 0–100 %.';
      else if ((k === 'dftMicrons' || k === 'surfaceProfileMicrons' || k === 'cureMinutes') && value !== null && value < 0) errs[k] = 'Must not be negative.';
      else out[k] = value;
    });
    setErrors(errs);
    if (Object.keys(errs).length === 0) onSave(out);
  }

  return (
    <form onSubmit={submit} noValidate className="space-y-4" aria-label="Edit recorded measurements">
      <p className="flex items-start gap-2 text-xs text-graphite-500">
        <AlertTriangle size={14} className="mt-0.5 shrink-0 text-amberish" /> Enter only readings that were actually taken. Leave blank if not recorded — Glazehour will not estimate values.
      </p>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {MEASUREMENT_KEYS.map((k) => (
          <div key={k}>
            <label htmlFor={`m-${job.id}-${k}`} className="block text-[11px] font-medium text-ink-700">
              {MEASUREMENT_META[k].label} ({MEASUREMENT_META[k].unit})
            </label>
            <input
              id={`m-${job.id}-${k}`}
              inputMode="decimal"
              className={cx(inputCls, 'mt-1 font-mono')}
              value={values[k]}
              placeholder="Not recorded"
              aria-invalid={Boolean(errors[k])}
              aria-describedby={errors[k] ? `m-${job.id}-${k}-err` : undefined}
              onChange={(e) => setValues((v) => ({ ...v, [k]: e.target.value }))}
            />
            {errors[k] && <p id={`m-${job.id}-${k}-err`} role="alert" className="mt-1 text-[11px] text-fault">{errors[k]}</p>}
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <Button type="submit">Save measurements</Button>
        <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
      </div>
    </form>
  );
}
