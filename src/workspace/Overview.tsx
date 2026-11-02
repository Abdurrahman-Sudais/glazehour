import { AssistantPanel } from './AssistantPanel';
import { Link } from 'react-router-dom';
import { AlertTriangle, ArrowRight, Bot } from 'lucide-react';
import { DefectImage } from '../components/Imagery';
import { DemoNotice, InvStatus, JobStatusPill, KindTag, fmtDate, useSeo } from '../components/ui';
import { CATEGORY_LABEL, SIMILARITY_GROUPS } from '../data/seed';
import { MEASUREMENT_META, evaluateSpecification } from '../domain/rules';
import { useStore } from '../state/store';
import { PageHeader, Panel } from './WorkspaceLayout';

export default function Overview() {
  useSeo('Investigation Workspace', 'Interactive Glazehour demonstration workspace with fictional coating jobs, defects and investigations.');
  const { state, team } = useStore();
  const open = state.investigations.filter((i) => i.status !== 'closed');
  const held = state.jobs.filter((j) => j.status === 'on-hold');
  const evals = state.jobs.map((j) => evaluateSpecification(state.specifications.find((s) => s.id === j.specificationId), j.measurements));
  const fail = evals.reduce((a, e) => a + e.fail, 0);
  const ne = evals.reduce((a, e) => a + e.notEvaluable, 0);
  const tasksOpen = state.investigations.flatMap((i) => i.tasks).filter((t) => !t.done).length;

  // Gaps = measurements required by the job's own enabled spec rules but not recorded.
  const gaps = state.jobs
    .map((j, idx) => ({ j, missing: [...new Set(evals[idx].results.flatMap((r) => r.missing))] }))
    .filter((g) => g.missing.length > 0);

  return (
    <>
      <PageHeader title="Overview" subtitle="Halvard Street Finishing · fictional demonstration facility" />
      <DemoNotice className="mb-6" />
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        {[
          ['Open investigations', open.length],
          ['Jobs on quality hold', held.length],
          ['Rules outside supplied limits', fail],
          ['Rules not evaluable', ne],
          ['Open tasks', tasksOpen],
        ].map(([l, v]) => (
          <div key={l} className="rounded-lg border border-mist-200 bg-white p-4">
            <p className="text-[11px] text-graphite-500">{l}</p>
            <p className="mt-1 font-mono text-2xl">{v}</p>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <AssistantPanel />
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Panel title="Active investigations" className="xl:col-span-2" actions={<Link to="/investigations/cases" className="text-xs text-volt-600 hover:underline">View all</Link>}>
          <ul className="divide-y divide-mist-100">
            {open.map((i) => {
              const d = state.defects.find((x) => x.id === i.defectId)!;
              const job = state.jobs.find((j) => j.id === d.jobId);
              const owner = team.find((t) => t.id === i.investigatorId);
              return (
                <li key={i.id}>
                  <Link to={`/investigations/defects/${d.id}`} className="flex items-center gap-4 py-3 hover:bg-mist-50">
                    <DefectImage category={d.category} seed={d.photos[0].seed} alt={`Demonstration image for ${d.id}`} className="h-12 w-16 shrink-0 rounded" showBadge={false} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{i.title}</p>
                      <p className="text-[11px] text-graphite-500">
                        <span className="font-mono">{i.id}</span> · {CATEGORY_LABEL[d.category]} · {job?.id} · {owner ? owner.name : 'Unassigned'}
                      </p>
                    </div>
                    <InvStatus status={i.status} />
                  </Link>
                </li>
              );
            })}
          </ul>
        </Panel>

        <Panel title={<span className="flex items-center gap-2"><AlertTriangle size={15} className="text-amberish" /> Missing evidence</span>}>
          <ul className="space-y-3 text-sm">
            {gaps.map(({ j, missing }) => (
              <li key={j.id} className="rounded-md border border-dashed border-amber-300 bg-amber-50/60 p-3">
                <Link to={`/investigations/jobs?job=${j.id}`} className="font-mono text-xs text-volt-600 hover:underline">{j.id}</Link>
                <p className="mt-1 text-xs text-amber-900">Not recorded: {missing.map((k) => MEASUREMENT_META[k].label.toLowerCase()).join(', ')}</p>
              </li>
            ))}
            {gaps.length === 0 && <li className="text-xs text-graphite-500">No gaps in environmental readings on jobs with defects.</li>}
          </ul>
        </Panel>

        <Panel title={<span className="flex items-center gap-2"><Bot size={15} className="text-violet-700" /> Suggested similar-case groups</span>} className="xl:col-span-2">
          <div className="mb-3"><KindTag kind="ai" /></div>
          <div className="grid gap-3 md:grid-cols-3">
            {SIMILARITY_GROUPS.map((g) => (
              <Link key={g.id} to={`/investigations/defects/groups/${g.id}`} className="group rounded-md border border-dashed border-violet-200 p-3 hover:border-violet-400">
                <div className="flex -space-x-2">
                  {g.defectIds.map((id) => {
                    const d = state.defects.find((x) => x.id === id)!;
                    return <DefectImage key={id} category={d.category} seed={d.photos[0].seed} alt="" className="h-10 w-10 rounded-full ring-2 ring-white" showBadge={false} />;
                  })}
                </div>
                <p className="mt-2 text-sm font-medium">{g.label}</p>
                <p className="mt-0.5 flex items-center gap-1 text-[11px] text-graphite-500">{g.defectIds.length} records · open group <ArrowRight size={11} className="transition-transform group-hover:translate-x-0.5" /></p>
              </Link>
            ))}
          </div>
        </Panel>

        <Panel title="Jobs on quality hold">
          <ul className="space-y-2">
            {held.map((j) => (
              <li key={j.id} className="flex items-center justify-between gap-2 text-sm">
                <Link to={`/investigations/jobs?job=${j.id}`} className="min-w-0">
                  <span className="font-mono text-xs text-volt-600">{j.id}</span>
                  <span className="block truncate text-xs text-graphite-500">{j.component} · {fmtDate(j.applicationDate)}</span>
                </Link>
                <JobStatusPill status={j.status} />
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </>
  );
}
