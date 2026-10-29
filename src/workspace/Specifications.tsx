import { useState } from 'react';
import type { FormEvent } from 'react';
import { FlaskConical, Pencil, Plus, Trash2 } from 'lucide-react';
import { Button, KindTag, cx, inputCls, useSeo } from '../components/ui';
import { uid } from '../domain/investigation';
import { MEASUREMENT_KEYS, MEASUREMENT_META, describeLimit, evaluateSpecification, parseReading, validateRule } from '../domain/rules';
import type { Comparator, MeasurementKey, Measurements, SpecRule, Specification } from '../domain/types';
import { useStore } from '../state/store';
import { OutcomeBadge } from './shared';
import { PageHeader, Panel } from './WorkspaceLayout';

const COMPARATOR_LABEL: Record<Comparator, string> = {
  min: 'Minimum value',
  max: 'Maximum value',
  range: 'Within range',
  'min-difference': 'Minimum difference between two readings',
};

export default function Specifications() {
  useSeo('Specifications — Workspace', 'Configure illustrative specification rules and test them against recorded measurements.');
  const { state } = useStore();
  const [specId, setSpecId] = useState(state.specifications[0]?.id);
  const spec = state.specifications.find((s) => s.id === specId);

  return (
    <>
      <PageHeader title="Specifications" subtitle="User-configured requirements. Glazehour does not provide industry standards." />
      <p className="mb-6 rounded-md border border-blue-200 bg-blue-50 px-3 py-2 text-xs text-blue-900">
        All thresholds below are <strong>illustrative and user-configurable</strong>. Enter the limits from your own product data sheets or process specifications. Changes immediately re-evaluate every job that uses the specification.
      </p>
      <div className="mb-6 flex flex-wrap gap-2" role="tablist" aria-label="Specifications">
        {state.specifications.map((s) => (
          <button key={s.id} role="tab" aria-selected={s.id === specId} onClick={() => setSpecId(s.id)} className={cx('rounded-md border px-3 py-1.5 text-xs', s.id === specId ? 'border-ink-900 bg-ink-900 text-white' : 'border-mist-200 bg-white hover:border-graphite-300')}>
            {s.name.split(' — ')[0]}
          </button>
        ))}
      </div>
      {spec && <SpecEditor key={spec.id} spec={spec} />}
    </>
  );
}

function SpecEditor({ spec }: { spec: Specification }) {
  const { state, upsertRule, removeRule } = useStore();
  const [editing, setEditing] = useState<SpecRule | null>(null);
  const jobs = state.jobs.filter((j) => j.specificationId === spec.id);

  const blank = (): SpecRule => ({ id: uid('r'), label: '', comparator: 'min', measurement: 'substrateTempC', unit: MEASUREMENT_META.substrateTempC.unit, enabled: true });

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
      <div className="space-y-6">
        <Panel title={spec.name} actions={<Button variant="secondary" className="px-2.5 py-1 text-xs" onClick={() => setEditing(blank())}><Plus size={13} /> Add rule</Button>}>
          <p className="mb-3 text-[11px] text-graphite-500">{spec.product} · {spec.source}</p>
          <div className="relative overflow-x-auto">
            <table className="w-full min-w-[560px] text-sm">
              <thead className="text-left text-[11px] text-graphite-500">
                <tr className="border-b border-mist-200">
                  <th className="py-2 pr-3 font-medium">On</th>
                  <th className="py-2 pr-3 font-medium">Rule</th>
                  <th className="py-2 pr-3 font-medium">Measurement(s)</th>
                  <th className="py-2 pr-3 font-medium"><KindTag kind="limit" short /></th>
                  <th className="py-2 font-medium"><span className="sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-mist-100">
                {spec.rules.map((r) => (
                  <tr key={r.id}>
                    <td className="py-2 pr-3">
                      <input type="checkbox" aria-label={`Enable ${r.label}`} checked={r.enabled} onChange={() => upsertRule(spec.id, { ...r, enabled: !r.enabled })} className="h-4 w-4 accent-signal-600" />
                    </td>
                    <td className={cx('py-2 pr-3', !r.enabled && 'text-graphite-400')}>{r.label}</td>
                    <td className="py-2 pr-3 text-xs text-graphite-500">
                      {MEASUREMENT_META[r.measurement].label}{r.subtract && ` − ${MEASUREMENT_META[r.subtract].label}`}
                    </td>
                    <td className="py-2 pr-3 font-mono text-xs text-volt-600">{describeLimit(r)}</td>
                    <td className="whitespace-nowrap py-2 text-right">
                      <button className="rounded p-1.5 text-graphite-500 hover:bg-mist-100" aria-label={`Edit ${r.label}`} onClick={() => setEditing(r)}><Pencil size={14} /></button>
                      <button className="rounded p-1.5 text-graphite-500 hover:bg-red-50 hover:text-fault" aria-label={`Remove ${r.label}`} onClick={() => { if (window.confirm(`Remove rule “${r.label}”?`)) removeRule(spec.id, r.id); }}><Trash2 size={14} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>

        {editing && (
          <RuleForm
            key={editing.id}
            initial={editing}
            isNew={!spec.rules.some((r) => r.id === editing.id)}
            onCancel={() => setEditing(null)}
            onSave={(r) => { upsertRule(spec.id, r); setEditing(null); }}
          />
        )}

        <Panel title={`Jobs using this specification (${jobs.length})`}>
          <ul className="divide-y divide-mist-100">
            {jobs.map((j) => {
              const s = evaluateSpecification(spec, j.measurements);
              return (
                <li key={j.id} className="flex items-center justify-between gap-3 py-2 text-sm">
                  <span><span className="font-mono text-xs">{j.id}</span> <span className="text-graphite-500">· {j.component}</span></span>
                  <span className="font-mono text-[11px]"><span className="text-signal-600">{s.pass} within</span> · <span className="text-fault">{s.fail} outside</span> · <span className="text-amberish">{s.notEvaluable} n/e</span></span>
                </li>
              );
            })}
          </ul>
        </Panel>
      </div>
      <TestBench spec={spec} />
    </div>
  );
}

function RuleForm({ initial, isNew, onSave, onCancel }: { initial: SpecRule; isNew: boolean; onSave: (r: SpecRule) => void; onCancel: () => void }) {
  const [r, setR] = useState(initial);
  const [min, setMin] = useState(initial.min?.toString() ?? '');
  const [max, setMax] = useState(initial.max?.toString() ?? '');
  const [errors, setErrors] = useState<string[]>([]);

  function submit(e: FormEvent) {
    e.preventDefault();
    const pMin = parseReading(min), pMax = parseReading(max);
    const candidate: SpecRule = {
      ...r,
      label: r.label.trim(),
      min: pMin.value ?? undefined,
      max: pMax.value ?? undefined,
      subtract: r.comparator === 'min-difference' ? r.subtract : undefined,
    };
    const errs = [...(pMin.error ? ['Minimum: ' + pMin.error] : []), ...(pMax.error ? ['Maximum: ' + pMax.error] : []), ...validateRule(candidate)];
    setErrors(errs);
    if (!errs.length) onSave(candidate);
  }

  const showMin = r.comparator !== 'max';
  const showMax = r.comparator === 'max' || r.comparator === 'range';

  return (
    <Panel title={isNew ? 'New rule' : `Edit rule: ${initial.label}`}>
      <form onSubmit={submit} noValidate className="grid gap-3 sm:grid-cols-2" aria-label="Specification rule">
        <div className="sm:col-span-2">
          <label htmlFor="rf-label" className="text-[11px] font-medium text-ink-700">Rule label</label>
          <input id="rf-label" className={cx(inputCls, 'mt-1')} value={r.label} onChange={(e) => setR({ ...r, label: e.target.value })} placeholder="e.g. Substrate above dew point" />
        </div>
        <div>
          <label htmlFor="rf-cmp" className="text-[11px] font-medium text-ink-700">Comparison</label>
          <select id="rf-cmp" className={cx(inputCls, 'mt-1')} value={r.comparator} onChange={(e) => setR({ ...r, comparator: e.target.value as Comparator, subtract: e.target.value === 'min-difference' ? r.subtract ?? 'dewPointC' : undefined })}>
            {Object.entries(COMPARATOR_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="rf-m" className="text-[11px] font-medium text-ink-700">{r.comparator === 'min-difference' ? 'Measurement A' : 'Measurement'}</label>
          <select id="rf-m" className={cx(inputCls, 'mt-1')} value={r.measurement} onChange={(e) => { const k = e.target.value as MeasurementKey; setR({ ...r, measurement: k, unit: MEASUREMENT_META[k].unit }); }}>
            {MEASUREMENT_KEYS.map((k) => <option key={k} value={k}>{MEASUREMENT_META[k].label}</option>)}
          </select>
        </div>
        {r.comparator === 'min-difference' && (
          <div>
            <label htmlFor="rf-sub" className="text-[11px] font-medium text-ink-700">Minus measurement B</label>
            <select id="rf-sub" className={cx(inputCls, 'mt-1')} value={r.subtract ?? ''} onChange={(e) => setR({ ...r, subtract: e.target.value as MeasurementKey })}>
              {MEASUREMENT_KEYS.map((k) => <option key={k} value={k}>{MEASUREMENT_META[k].label}</option>)}
            </select>
          </div>
        )}
        {showMin && (
          <div>
            <label htmlFor="rf-min" className="text-[11px] font-medium text-ink-700">{r.comparator === 'min-difference' ? 'Minimum difference' : 'Minimum'} ({r.unit})</label>
            <input id="rf-min" inputMode="decimal" className={cx(inputCls, 'mt-1 font-mono')} value={min} onChange={(e) => setMin(e.target.value)} />
          </div>
        )}
        {showMax && (
          <div>
            <label htmlFor="rf-max" className="text-[11px] font-medium text-ink-700">Maximum ({r.unit})</label>
            <input id="rf-max" inputMode="decimal" className={cx(inputCls, 'mt-1 font-mono')} value={max} onChange={(e) => setMax(e.target.value)} />
          </div>
        )}
        {errors.length > 0 && (
          <ul role="alert" className="list-disc space-y-0.5 pl-5 text-xs text-fault sm:col-span-2">
            {errors.map((er) => <li key={er}>{er}</li>)}
          </ul>
        )}
        <div className="flex gap-2 sm:col-span-2">
          <Button type="submit">{isNew ? 'Add rule' : 'Save rule'}</Button>
          <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
        </div>
      </form>
    </Panel>
  );
}

/** Ad-hoc test bench: enter readings and see how the configured rules evaluate. */
function TestBench({ spec }: { spec: Specification }) {
  const keys = [...new Set(spec.rules.flatMap((r) => [r.measurement, ...(r.subtract ? [r.subtract] : [])]))];
  const [vals, setVals] = useState<Record<string, string>>({});
  const m: Measurements = {};
  const errors: Record<string, string> = {};
  keys.forEach((k) => {
    const p = parseReading(vals[k] ?? '');
    if (p.error) errors[k] = p.error;
    m[k] = p.value;
  });
  const summary = evaluateSpecification(spec, m);

  return (
    <Panel title={<span className="flex items-center gap-2"><FlaskConical size={15} /> Rule test bench</span>} className="self-start">
      <p className="mb-3 text-xs text-graphite-500">Enter readings to see how the enabled rules evaluate. Leave a field blank to see how missing measurements are handled. Nothing here is saved.</p>
      <div className="grid grid-cols-2 gap-3">
        {keys.map((k) => (
          <div key={k}>
            <label htmlFor={`tb-${k}`} className="text-[11px] font-medium text-ink-700">{MEASUREMENT_META[k].label} ({MEASUREMENT_META[k].unit})</label>
            <input id={`tb-${k}`} inputMode="decimal" className={cx(inputCls, 'mt-1 font-mono')} placeholder="Not recorded" value={vals[k] ?? ''} aria-invalid={Boolean(errors[k])} onChange={(e) => setVals({ ...vals, [k]: e.target.value })} />
            {errors[k] && <p role="alert" className="mt-1 text-[11px] text-fault">{errors[k]}</p>}
          </div>
        ))}
      </div>
      <ul className="mt-4 space-y-2" aria-live="polite">
        {summary.results.map((r) => (
          <li key={r.ruleId} className="rounded-md border border-mist-200 p-2.5">
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-medium">{r.label}</span>
              <OutcomeBadge r={r} />
            </div>
            <p className="mt-1 text-[11px] text-graphite-500">{r.detail}</p>
            {r.calculated !== null && (
              <p className="mt-1 font-mono text-[11px]"><span className="text-signal-600">calculated {r.calculated}</span> <span className="text-volt-600">vs limit {r.limitText}</span></p>
            )}
          </li>
        ))}
      </ul>
    </Panel>
  );
}
