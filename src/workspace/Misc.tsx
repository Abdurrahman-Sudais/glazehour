import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Download, RotateCcw, Search } from 'lucide-react';
import { Button, InvStatus, cx, fmtDate, inputCls, useSeo } from '../components/ui';
import { CATEGORY_LABEL } from '../data/seed';
import { STATUS_LABEL } from '../domain/investigation';
import { evaluateSpecification } from '../domain/rules';
import type { InvestigationStatus } from '../domain/types';
import { buildReport, investigationsCsv } from '../domain/reports';
import { useStore } from '../state/store';
import { PageHeader, Panel } from './WorkspaceLayout';

export function InvestigationsList() {
  useSeo('Investigations — Workspace', 'Demonstration investigations with status, investigator and tasks.');
  const { state, team } = useStore();
  const [q, setQ] = useState('');
  const [st, setSt] = useState<'' | InvestigationStatus>('');
  const [owner, setOwner] = useState('');

  const rows = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return state.investigations.filter((i) => {
      if (st && i.status !== st) return false;
      if (owner === 'none' ? i.investigatorId : owner && i.investigatorId !== owner) return false;
      return !needle || `${i.id} ${i.title} ${i.defectId}`.toLowerCase().includes(needle);
    });
  }, [state.investigations, q, st, owner]);

  return (
    <>
      <PageHeader title="Investigations" subtitle={`${state.investigations.length} investigations · open one from any defect record`} />
      <div className="mb-4 flex flex-wrap gap-2" role="search">
        <div className="relative min-w-[220px] flex-1">
          <Search size={15} className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-graphite-400" />
          <label htmlFor="i-q" className="sr-only">Search investigations</label>
          <input id="i-q" className={cx(inputCls, 'pl-8')} placeholder="Search investigations…" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <label htmlFor="i-st" className="sr-only">Filter by status</label>
        <select id="i-st" className={cx(inputCls, 'w-auto')} value={st} onChange={(e) => setSt(e.target.value as InvestigationStatus | '')}>
          <option value="">All statuses</option>
          {Object.entries(STATUS_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <label htmlFor="i-own" className="sr-only">Filter by investigator</label>
        <select id="i-own" className={cx(inputCls, 'w-auto')} value={owner} onChange={(e) => setOwner(e.target.value)}>
          <option value="">Any investigator</option>
          <option value="none">Unassigned</option>
          {team.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
        </select>
      </div>
      <div className="overflow-x-auto rounded-lg border border-mist-200 bg-white">
        <table className="w-full min-w-[720px] text-sm">
          <thead className="bg-mist-50 text-left text-[11px] text-graphite-500">
            <tr>
              <th className="px-3 py-2.5 font-medium">Investigation</th>
              <th className="px-3 py-2.5 font-medium">Defect</th>
              <th className="px-3 py-2.5 font-medium">Investigator</th>
              <th className="px-3 py-2.5 font-medium">Tasks</th>
              <th className="px-3 py-2.5 font-medium">Findings</th>
              <th className="px-3 py-2.5 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-mist-100">
            {rows.map((i) => {
              const d = state.defects.find((x) => x.id === i.defectId);
              return (
                <tr key={i.id} className="hover:bg-mist-50">
                  <td className="px-3 py-2.5">
                    <Link to={`/investigations/defects/${i.defectId}`} className="font-medium hover:underline">{i.title}</Link>
                    <p className="font-mono text-[11px] text-graphite-500">{i.id} · opened {fmtDate(i.openedAt)}</p>
                  </td>
                  <td className="px-3 py-2.5 text-xs"><span className="font-mono">{i.defectId}</span>{d && ` · ${CATEGORY_LABEL[d.category]}`}</td>
                  <td className="px-3 py-2.5 text-xs">{team.find((t) => t.id === i.investigatorId)?.name ?? <span className="text-amberish">Unassigned</span>}</td>
                  <td className="px-3 py-2.5 font-mono text-xs">{i.tasks.filter((t) => t.done).length}/{i.tasks.length}</td>
                  <td className="px-3 py-2.5 font-mono text-xs">{i.findings.length}</td>
                  <td className="px-3 py-2.5"><InvStatus status={i.status} /></td>
                </tr>
              );
            })}
            {rows.length === 0 && <tr><td colSpan={6} className="px-3 py-8 text-center text-graphite-500">No investigations match these filters.</td></tr>}
          </tbody>
        </table>
      </div>
    </>
  );
}

function Bars({ data }: { data: { label: string; value: number }[] }) {
  const max = Math.max(1, ...data.map((d) => d.value));
  return (
    <ul className="space-y-2">
      {data.map((d) => (
        <li key={d.label} className="grid grid-cols-[140px_1fr_32px] items-center gap-3 text-xs">
          <span className="truncate text-graphite-500">{d.label}</span>
          <span className="h-2.5 rounded-sm bg-mist-100" aria-hidden>
            <span className="block h-full rounded-sm bg-ink-700" style={{ width: `${(d.value / max) * 100}%` }} />
          </span>
          <span className="text-right font-mono">{d.value}</span>
        </li>
      ))}
    </ul>
  );
}

export function Reports() {
  useSeo('Reports — Workspace', 'Summary of demonstration defects, investigations and specification coverage.');
  const { state, team } = useStore();
  const r = buildReport(state);

  function download() {
    const blob = new Blob([investigationsCsv(state, team)], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'glazehour-demo-investigations.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <>
      <PageHeader title="Reports" subtitle="Computed from the demonstration records in this browser" actions={<Button variant="secondary" onClick={download}><Download size={14} /> Export investigations (CSV)</Button>} />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Panel title="Defects by category"><Bars data={r.byCategory} /></Panel>
        <Panel title="Defects by line"><Bars data={r.byLine} /></Panel>
        <Panel title="Investigations by status"><Bars data={r.byStatus} /></Panel>
        <Panel title="Specification rule outcomes (all jobs)">
          <Bars data={[{ label: 'Within supplied limit', value: r.outcomes.pass }, { label: 'Outside supplied limit', value: r.outcomes.fail }, { label: 'Not evaluable (missing)', value: r.outcomes.notEvaluable }]} />
          <p className="mt-3 text-[11px] text-graphite-500">Evaluation coverage: <span className="font-mono">{r.coveragePct}%</span> of enabled rules could be evaluated with recorded data.</p>
        </Panel>
      </div>
    </>
  );
}

export function Team() {
  useSeo('Team — Workspace', 'Demonstration quality team members and workload.');
  const { state, team } = useStore();
  return (
    <>
      <PageHeader title="Team" subtitle="Fictional demonstration team" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {team.map((m) => {
          const invs = state.investigations.filter((i) => i.investigatorId === m.id && i.status !== 'closed');
          const tasks = state.investigations.flatMap((i) => i.tasks).filter((t) => t.assigneeId === m.id && !t.done);
          const jobs = state.jobs.filter((j) => j.investigatorId === m.id);
          return (
            <Panel key={m.id}>
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-ink-800 font-mono text-sm text-white">{m.initials}</span>
                <div>
                  <p className="font-medium">{m.name}</p>
                  <p className="text-xs text-graphite-500">{m.role}</p>
                </div>
              </div>
              <dl className="mt-4 grid grid-cols-3 gap-2 text-center">
                {[['Open investigations', invs.length], ['Open tasks', tasks.length], ['Jobs', jobs.length]].map(([l, v]) => (
                  <div key={l} className="rounded-md bg-mist-50 py-2">
                    <dd className="font-mono text-lg">{v}</dd>
                    <dt className="text-[10px] text-graphite-500">{l}</dt>
                  </div>
                ))}
              </dl>
            </Panel>
          );
        })}
      </div>
    </>
  );
}

export function SettingsPage() {
  useSeo('Settings — Workspace', 'Demonstration workspace settings.');
  const { reset, state } = useStore();
  const [done, setDone] = useState(false);
  const totalRules = state.specifications.reduce((a, s) => a + s.rules.length, 0);
  const evaluated = state.jobs.map((j) => evaluateSpecification(state.specifications.find((s) => s.id === j.specificationId), j.measurements));
  return (
    <>
      <PageHeader title="Settings" />
      <div className="grid max-w-3xl gap-6">
        <Panel title="Demonstration data">
          <p className="text-sm text-graphite-500">
            This workspace stores {state.jobs.length} jobs, {state.defects.length} defects, {state.investigations.length} investigations and {totalRules} specification rules in your browser’s local storage ({evaluated.length} jobs evaluated). Resetting restores the original fictional records.
          </p>
          <Button variant="secondary" className="mt-4" onClick={() => { if (window.confirm('Reset all demo data to the original records?')) { reset(); setDone(true); } }}>
            <RotateCcw size={14} /> Reset demo data
          </Button>
          {done && <p role="status" className="mt-2 text-xs text-signal-600">Demo data reset.</p>}
        </Panel>
        <Panel title="Simulated integrations">
          <ul className="list-disc space-y-1.5 pl-5 text-sm text-graphite-500">
            <li>Image similarity grouping — deterministic stand-in for a vision model.</li>
            <li>Evidence suggestions — rule-derived prompts, labelled as AI suggestions.</li>
            <li>Environmental data loggers, DFT gauges and dew-point meters — values are typed in manually.</li>
            <li>ERP / job scheduling — jobs are seeded mock data.</li>
            <li>User accounts, permissions and notifications — not implemented in the demo.</li>
          </ul>
        </Panel>
      </div>
    </>
  );
}
