import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Pencil, Search, X } from 'lucide-react';
import { DefectImage } from '../components/Imagery';
import { Button, JOB_STATUS_LABEL, JobStatusPill, cx, fmtDate, inputCls, useSeo } from '../components/ui';
import { CATEGORY_LABEL } from '../data/seed';
import { evaluateSpecification } from '../domain/rules';
import type { JobStatus } from '../domain/types';
import { useStore } from '../state/store';
import { MeasurementEditor, MeasurementsTable, SpecCheckPanel } from './shared';
import { PageHeader, Panel } from './WorkspaceLayout';

export default function Jobs() {
  useSeo('Jobs — Workspace', 'Demonstration coating jobs with substrate, coating system, measurements and inspections.');
  const { state, team } = useStore();
  const [params, setParams] = useSearchParams();
  const [q, setQ] = useState('');
  const [status, setStatus] = useState<'' | JobStatus>('');
  const [line, setLine] = useState('');
  const selectedId = params.get('job');

  const lines = [...new Set(state.jobs.map((j) => j.line))];
  const rows = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return state.jobs.filter(
      (j) =>
        (!status || j.status === status) &&
        (!line || j.line === line) &&
        (!needle || [j.id, j.reference, j.customer, j.component, j.substrate, j.coatingSystem].join(' ').toLowerCase().includes(needle)),
    );
  }, [state.jobs, q, status, line]);

  const select = (id: string | null) => {
    const next = new URLSearchParams(params);
    if (id) next.set('job', id);
    else next.delete('job');
    setParams(next, { replace: true });
  };

  return (
    <>
      <PageHeader title="Jobs" subtitle={`${state.jobs.length} demonstration jobs`} />
      <div className="mb-4 flex flex-wrap gap-2" role="search">
        <div className="relative min-w-[220px] flex-1">
          <Search size={15} className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-graphite-400" />
          <label htmlFor="job-q" className="sr-only">Search jobs</label>
          <input id="job-q" className={cx(inputCls, 'pl-8')} placeholder="Search job ID, customer, substrate, coating system…" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <label htmlFor="job-status" className="sr-only">Filter by status</label>
        <select id="job-status" className={cx(inputCls, 'w-auto')} value={status} onChange={(e) => setStatus(e.target.value as JobStatus | '')}>
          <option value="">All statuses</option>
          {Object.entries(JOB_STATUS_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <label htmlFor="job-line" className="sr-only">Filter by line</label>
        <select id="job-line" className={cx(inputCls, 'w-auto')} value={line} onChange={(e) => setLine(e.target.value)}>
          <option value="">All lines</option>
          {lines.map((l) => <option key={l}>{l}</option>)}
        </select>
      </div>

      <div className={cx('grid grid-cols-1 gap-6', selectedId && 'xl:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]')}>
        <div className="self-start overflow-x-auto rounded-lg border border-mist-200 bg-white">
          <table className={cx('w-full text-sm', selectedId ? 'min-w-[520px]' : 'min-w-[640px]')}>
            <thead className="bg-mist-50 text-left text-[11px] text-graphite-500">
              <tr>
                <th className="px-3 py-2.5 font-medium">Job</th>
                <th className="px-3 py-2.5 font-medium">Component / substrate</th>
                <th className={cx('px-3 py-2.5 font-medium', selectedId && 'xl:hidden 2xl:table-cell')}>Applied</th>
                <th className="px-3 py-2.5 font-medium">Checks</th>
                <th className="px-3 py-2.5 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-mist-100">
              {rows.map((j) => {
                const s = evaluateSpecification(state.specifications.find((x) => x.id === j.specificationId), j.measurements);
                return (
                  <tr key={j.id} className={cx('cursor-pointer hover:bg-mist-50', selectedId === j.id && 'bg-blue-50/60')} onClick={() => select(j.id)}>
                    <td className="px-3 py-2.5">
                      <button className="font-mono text-xs font-medium text-volt-600 hover:underline" onClick={(e) => { e.stopPropagation(); select(j.id); }} aria-label={`Open job ${j.id}`}>
                        {j.id}
                      </button>
                      <p className="max-w-[180px] truncate text-[11px] text-graphite-500">{j.reference}</p>
                    </td>
                    <td className="px-3 py-2.5">
                      <p className="max-w-[220px] truncate">{j.component}</p>
                      <p className="max-w-[220px] truncate text-[11px] text-graphite-500">{j.substrate}</p>
                    </td>
                    <td className={cx('whitespace-nowrap px-3 py-2.5 text-xs', selectedId && 'xl:hidden 2xl:table-cell')}>{fmtDate(j.applicationDate)}</td>
                    <td className="whitespace-nowrap px-3 py-2.5 font-mono text-[11px]">
                      <span className="text-signal-600">{s.pass}✓</span> <span className="text-fault">{s.fail}✗</span> <span className="text-amberish">{s.notEvaluable}?</span>
                    </td>
                    <td className="px-3 py-2.5"><JobStatusPill status={j.status} /></td>
                  </tr>
                );
              })}
              {rows.length === 0 && (
                <tr><td colSpan={5} className="px-3 py-8 text-center text-sm text-graphite-500">No jobs match these filters.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        {selectedId && <JobDetail id={selectedId} onClose={() => select(null)} team={team} />}
      </div>
    </>
  );
}

function JobDetail({ id, onClose, team }: { id: string; onClose: () => void; team: ReturnType<typeof useStore>['team'] }) {
  const { state, updateMeasurements, setJobStatus, setJobInvestigator } = useStore();
  const [editing, setEditing] = useState(false);
  const job = state.jobs.find((j) => j.id === id);
  if (!job) return <Panel title="Job not found"><p className="text-sm">No job with ID {id}.</p></Panel>;
  const spec = state.specifications.find((s) => s.id === job.specificationId);
  const defects = state.defects.filter((d) => d.jobId === job.id);

  return (
    <div className="space-y-4" aria-label={`Job ${job.id} details`}>
      <Panel
        title={<span className="font-mono">{job.id}</span>}
        actions={<button onClick={onClose} aria-label="Close job details" className="rounded p-1 text-graphite-500 hover:bg-mist-100"><X size={16} /></button>}
      >
        <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
          {[
            ['Reference', job.reference],
            ['Customer / project', job.customer],
            ['Component', job.component],
            ['Substrate', job.substrate],
            ['Coating system', job.coatingSystem],
            ['Line', job.line],
            ['Application date', fmtDate(job.applicationDate)],
            ['Specification', spec?.name ?? '—'],
          ].map(([k, v]) => (
            <div key={k}>
              <dt className="text-[11px] text-graphite-500">{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div>
            <label htmlFor={`inv-${job.id}`} className="text-[11px] text-graphite-500">Assigned investigator</label>
            <select id={`inv-${job.id}`} className={cx(inputCls, 'mt-1')} value={job.investigatorId ?? ''} onChange={(e) => setJobInvestigator(job.id, e.target.value || null)}>
              <option value="">Unassigned</option>
              {team.map((t) => <option key={t.id} value={t.id}>{t.name} — {t.role}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor={`st-${job.id}`} className="text-[11px] text-graphite-500">Job status</label>
            <select id={`st-${job.id}`} className={cx(inputCls, 'mt-1')} value={job.status} onChange={(e) => setJobStatus(job.id, e.target.value as JobStatus)}>
              {Object.entries(JOB_STATUS_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </div>
        </div>
      </Panel>

      <Panel
        title="Process measurements"
        actions={!editing && <Button variant="secondary" className="px-2.5 py-1 text-xs" onClick={() => setEditing(true)}><Pencil size={13} /> Edit</Button>}
      >
        {editing ? (
          <MeasurementEditor job={job} onCancel={() => setEditing(false)} onSave={(m) => { updateMeasurements(job.id, m); setEditing(false); }} />
        ) : (
          <MeasurementsTable m={job.measurements} />
        )}
      </Panel>

      <Panel title="Specification check">
        <SpecCheckPanel spec={spec} m={job.measurements} />
      </Panel>

      <Panel title="Inspection records">
        <ul className="space-y-2">
          {job.inspections.map((i) => (
            <li key={i.id} className="rounded-md border border-mist-200 p-3 text-sm">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-medium">{i.method}</span>
                <span className={cx('rounded px-1.5 py-0.5 text-[10px] font-medium uppercase', i.result === 'pass' ? 'bg-emerald-50 text-emerald-800' : i.result === 'fail' ? 'bg-red-50 text-red-800' : 'bg-mist-100 text-graphite-500')}>{i.result}</span>
              </div>
              <p className="mt-1">{i.notes}</p>
              <p className="mt-1 text-[11px] text-graphite-500">{i.inspector} · {fmtDate(i.date)}</p>
            </li>
          ))}
        </ul>
      </Panel>

      <Panel title={`Defect observations (${defects.length})`}>
        {defects.length === 0 ? (
          <p className="text-sm text-graphite-500">No defects recorded for this job.</p>
        ) : (
          <ul className="space-y-2">
            {defects.map((d) => (
              <li key={d.id}>
                <Link to={`/investigations/defects/${d.id}`} className="flex items-center gap-3 rounded-md border border-mist-200 p-2 hover:border-graphite-300">
                  <DefectImage category={d.category} seed={d.photos[0].seed} alt={`Demonstration image for ${d.id}`} className="h-12 w-16 shrink-0 rounded" showBadge={false} />
                  <div className="min-w-0">
                    <p className="text-sm"><span className="font-mono text-xs text-volt-600">{d.id}</span> · {CATEGORY_LABEL[d.category]}</p>
                    <p className="truncate text-[11px] text-graphite-500">{d.location}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </div>
  );
}
