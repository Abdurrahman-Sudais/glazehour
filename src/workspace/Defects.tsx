import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { AlertTriangle, ArrowLeft, HelpCircle, Search, ShieldCheck } from 'lucide-react';
import { DefectImage } from '../components/Imagery';
import { DemoNotice, InvStatus, KindTag, cx, fmtDate, inputCls, useSeo } from '../components/ui';
import { CATEGORY_LABEL, SIMILARITY_GROUPS } from '../data/seed';
import { MEASUREMENT_META, isValidReading } from '../domain/rules';
import { COMPARISON_KEYS, SIMILARITY_DISCLAIMER, buildGroupMembers, investigatorQuestions, spread } from '../domain/similarity';
import type { DefectCategory, InvestigationStatus } from '../domain/types';
import { STATUS_LABEL } from '../domain/investigation';
import { useStore } from '../state/store';
import { PageHeader, Panel } from './WorkspaceLayout';

export default function DefectLibrary() {
  useSeo('Defect Library — Workspace', 'Demonstration defect observations with photographs, locations and operator notes.');
  const { state } = useStore();
  const [q, setQ] = useState('');
  const [cat, setCat] = useState<'' | DefectCategory>('');
  const [st, setSt] = useState<'' | InvestigationStatus | 'none'>('');

  const rows = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return state.defects.filter((d) => {
      const inv = state.investigations.find((i) => i.defectId === d.id);
      const job = state.jobs.find((j) => j.id === d.jobId);
      if (cat && d.category !== cat) return false;
      if (st === 'none' && inv) return false;
      if (st && st !== 'none' && inv?.status !== st) return false;
      if (needle && ![d.id, d.jobId, d.location, d.operatorNotes, job?.component, job?.line, CATEGORY_LABEL[d.category]].join(' ').toLowerCase().includes(needle)) return false;
      return true;
    });
  }, [state, q, cat, st]);

  return (
    <>
      <PageHeader title="Defect Library" subtitle="Demonstration records. Images are procedurally generated, not photographs of real parts." />

      <Panel title="Suggested similar-case groups" className="mb-6" actions={<KindTag kind="ai" />}>
        <p className="mb-3 flex items-start gap-2 text-xs text-graphite-500"><ShieldCheck size={14} className="mt-0.5 shrink-0" /> {SIMILARITY_DISCLAIMER}</p>
        <div className="grid gap-3 md:grid-cols-3">
          {SIMILARITY_GROUPS.map((g) => (
            <Link key={g.id} to={`/investigations/defects/groups/${g.id}`} className="rounded-md border border-dashed border-violet-200 p-3 hover:border-violet-400">
              <p className="text-sm font-medium">{g.label}</p>
              <p className="mt-1 text-[11px] text-graphite-500">{g.defectIds.join(' · ')}</p>
              <p className="mt-1 font-mono text-[11px] text-violet-700">simulated visual similarity {Math.round(g.visualSimilarity * 100)}%</p>
            </Link>
          ))}
        </div>
      </Panel>

      <div className="mb-4 flex flex-wrap gap-2" role="search">
        <div className="relative min-w-[220px] flex-1">
          <Search size={15} className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-graphite-400" />
          <label htmlFor="d-q" className="sr-only">Search defects</label>
          <input id="d-q" className={cx(inputCls, 'pl-8')} placeholder="Search defect ID, job, location, notes…" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <label htmlFor="d-cat" className="sr-only">Filter by category</label>
        <select id="d-cat" className={cx(inputCls, 'w-auto')} value={cat} onChange={(e) => setCat(e.target.value as DefectCategory | '')}>
          <option value="">All categories</option>
          {Object.entries(CATEGORY_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <label htmlFor="d-st" className="sr-only">Filter by investigation status</label>
        <select id="d-st" className={cx(inputCls, 'w-auto')} value={st} onChange={(e) => setSt(e.target.value as typeof st)}>
          <option value="">Any investigation status</option>
          <option value="none">Not under investigation</option>
          {Object.entries(STATUS_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
      </div>

      <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3" aria-label="Defect records">
        {rows.map((d) => {
          const inv = state.investigations.find((i) => i.defectId === d.id);
          return (
            <li key={d.id}>
              <Link to={`/investigations/defects/${d.id}`} className="block overflow-hidden rounded-lg border border-mist-200 bg-white hover:border-graphite-300">
                <DefectImage category={d.category} seed={d.photos[0].seed} alt={`Demonstration image: ${d.photos[0].caption}`} className="aspect-[16/9]" />
                <div className="p-4">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-xs text-volt-600">{d.id}</span>
                    {inv ? <InvStatus status={inv.status} /> : <span className="text-[11px] text-graphite-500">Not under investigation</span>}
                  </div>
                  <p className="mt-2 font-medium">{CATEGORY_LABEL[d.category]}</p>
                  <p className="mt-0.5 truncate text-xs text-graphite-500">{d.location}</p>
                  <p className="mt-2 text-[11px] text-graphite-500">Job <span className="font-mono">{d.jobId}</span> · inspected {fmtDate(d.inspectionDate)} · {d.photos.length} photo{d.photos.length > 1 && 's'}</p>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
      {rows.length === 0 && <p className="py-10 text-center text-sm text-graphite-500">No defects match these filters.</p>}
    </>
  );
}

export function SimilarGroup() {
  const { groupId } = useParams();
  const { state } = useStore();
  const group = SIMILARITY_GROUPS.find((g) => g.id === groupId);
  useSeo('Similar-case group — Workspace', 'Simulated grouping of visually similar demonstration defects.');
  if (!group) return <p>Group not found. <Link className="text-volt-600" to="/investigations/defects">Back to library</Link></p>;

  const members = buildGroupMembers(group, state.defects, state.jobs);
  const questions = investigatorQuestions(members);

  return (
    <>
      <Link to="/investigations/defects" className="mb-4 inline-flex items-center gap-1 text-xs text-graphite-500 hover:text-ink-900"><ArrowLeft size={14} /> Defect Library</Link>
      <PageHeader title={group.label} subtitle={`${members.length} records from ${new Set(members.map((m) => m.job?.id)).size} jobs · simulated visual similarity ${Math.round(group.visualSimilarity * 100)}%`} actions={<KindTag kind="ai" />} />
      <div role="note" className="mb-6 flex items-start gap-3 rounded-lg border-2 border-violet-200 bg-violet-50 p-4 text-sm text-violet-950">
        <ShieldCheck size={18} className="mt-0.5 shrink-0" />
        <div>
          <p className="font-semibold">This grouping is not a diagnosis.</p>
          <p className="mt-1">{SIMILARITY_DISCLAIMER} Glazehour does not determine a cause or recommend a corrective process. Use the comparison below to decide what to check next.</p>
        </div>
      </div>
      <DemoNotice className="mb-6" />

      <div className="grid gap-4 md:grid-cols-3">
        {members.map(({ defect, job }) => (
          <Link key={defect.id} to={`/investigations/defects/${defect.id}`} className="overflow-hidden rounded-lg border border-mist-200 bg-white hover:border-graphite-300">
            <DefectImage category={defect.category} seed={defect.photos[0].seed} alt={`Demonstration image: ${defect.photos[0].caption}`} className="aspect-[16/10]" />
            <div className="p-3 text-sm">
              <p><span className="font-mono text-xs text-volt-600">{defect.id}</span> · {job?.id}</p>
              <p className="mt-0.5 truncate text-xs text-graphite-500">{job?.component} · {job?.line}</p>
            </div>
          </Link>
        ))}
      </div>

      <Panel title="Job conditions side by side" className="mt-6">
        <div className="mb-3"><KindTag kind="recorded" /></div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-sm">
            <thead className="text-left text-[11px] text-graphite-500">
              <tr className="border-b border-mist-200">
                <th className="py-2 pr-3 font-medium">Attribute</th>
                {members.map((m) => <th key={m.defect.id} className="py-2 pr-3 font-mono font-medium">{m.defect.id} / {m.job?.id}</th>)}
                <th className="py-2 font-medium"><KindTag kind="calculated" short /> spread</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-mist-100">
              {[
                ['Line', (i: number) => members[i].job?.line],
                ['Substrate', (i: number) => members[i].job?.substrate],
                ['Coating system', (i: number) => members[i].job?.coatingSystem],
                ['Application date', (i: number) => members[i].job && fmtDate(members[i].job!.applicationDate)],
                ['Location', (i: number) => members[i].defect.location],
              ].map(([label, get]) => (
                <tr key={label as string} className="align-top">
                  <td className="py-2 pr-3 text-xs text-graphite-500">{label as string}</td>
                  {members.map((m, i) => <td key={m.defect.id} className="py-2 pr-3 text-xs">{(get as (i: number) => string | undefined)(i)}</td>)}
                  <td />
                </tr>
              ))}
              {COMPARISON_KEYS.map((k) => {
                const sp = spread(members, k);
                return (
                  <tr key={k}>
                    <td className="py-2 pr-3 text-xs text-graphite-500">{MEASUREMENT_META[k].label}</td>
                    {members.map((m) => {
                      const v = m.job?.measurements[k];
                      return (
                        <td key={m.defect.id} className="py-2 pr-3 font-mono text-xs">
                          {isValidReading(v) ? `${v} ${MEASUREMENT_META[k].unit}` : <span className="inline-flex items-center gap-1 rounded bg-amber-50 px-1.5 py-0.5 text-amberish"><AlertTriangle size={11} /> missing</span>}
                        </td>
                      );
                    })}
                    <td className="py-2 font-mono text-xs text-signal-600">{sp !== null ? `${sp} ${MEASUREMENT_META[k].unit}` : '—'}</td>
                  </tr>
                );
              })}
              <tr className="align-top">
                <td className="py-2 pr-3 text-xs text-graphite-500">Operator notes</td>
                {members.map((m) => <td key={m.defect.id} className="py-2 pr-3 text-xs italic text-ink-700">“{m.defect.operatorNotes}”</td>)}
                <td />
              </tr>
            </tbody>
          </table>
        </div>
      </Panel>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Panel title={<span className="flex items-center gap-2"><AlertTriangle size={15} className="text-amberish" /> Missing evidence</span>}>
          <ul className="space-y-2 text-sm">
            {members.map((m) => (
              <li key={m.defect.id} className="flex items-start justify-between gap-3">
                <span className="font-mono text-xs">{m.defect.id}</span>
                <span className="text-right text-xs text-graphite-500">{m.missing.length ? m.missing.map((k) => MEASUREMENT_META[k].label).join(', ') : 'All compared measurements recorded'}</span>
              </li>
            ))}
          </ul>
        </Panel>
        <Panel title={<span className="flex items-center gap-2"><HelpCircle size={15} className="text-violet-700" /> Possible questions for the investigator</span>} actions={<KindTag kind="ai" short />}>
          <ul className="list-disc space-y-1.5 pl-5 text-sm text-ink-800">
            {questions.map((qq) => <li key={qq}>{qq}</li>)}
          </ul>
        </Panel>
      </div>
    </>
  );
}
