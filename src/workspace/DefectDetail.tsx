import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Bot, Check, CircleCheck, ClipboardCheck, FileSearch, Plus, Quote } from 'lucide-react';
import { DefectImage } from '../components/Imagery';
import { Button, DemoNotice, Field, InvStatus, KindLegend, KindTag, cx, fmtDate, inputCls, useSeo } from '../components/ui';
import { CATEGORY_LABEL, SIMILARITY_GROUPS } from '../data/seed';
import { suggestionsFor } from '../domain/assist';
import { MILESTONES, STATUS_LABEL, STATUS_ORDER, canTransition, stageIndex, validateFinding, validateTask } from '../domain/investigation';
import { evaluateSpecification } from '../domain/rules';
import type { Investigation, InvestigationStatus } from '../domain/types';
import { useStore } from '../state/store';
import { MeasurementsTable, SpecCheckPanel } from './shared';
import { PageHeader, Panel } from './WorkspaceLayout';

export default function DefectDetail() {
  const { defectId } = useParams();
  const { state, openInvestigation } = useStore();
  const defect = state.defects.find((d) => d.id === defectId);
  const [photoIdx, setPhotoIdx] = useState(0);
  useSeo(`${defectId ?? 'Defect'} — Workspace`, 'Demonstration defect investigation with linked job, measurements, specification and timeline.');

  if (!defect) return <p>Defect not found. <Link className="text-volt-600" to="/investigations/defects">Back to library</Link></p>;

  const job = state.jobs.find((j) => j.id === defect.jobId);
  const spec = state.specifications.find((s) => s.id === job?.specificationId);
  const summary = evaluateSpecification(spec, job?.measurements ?? {});
  const inv = state.investigations.find((i) => i.defectId === defect.id);
  const group = SIMILARITY_GROUPS.find((g) => g.defectIds.includes(defect.id));
  const related = state.defects.filter((d) => d.id !== defect.id && (group?.defectIds.includes(d.id) || (d.category === defect.category && d.jobId !== defect.jobId)));
  const suggestions = suggestionsFor(defect, job, summary, related.length);
  const photo = defect.photos[Math.min(photoIdx, defect.photos.length - 1)];

  return (
    <>
      <Link to="/investigations/defects" className="mb-4 inline-flex items-center gap-1 text-xs text-graphite-500 hover:text-ink-900"><ArrowLeft size={14} /> Defect Library</Link>
      <PageHeader
        title={`${defect.id} · ${CATEGORY_LABEL[defect.category]}`}
        subtitle={`${defect.location} · inspected ${fmtDate(defect.inspectionDate)} · severity ${defect.severity}`}
        actions={inv ? <InvStatus status={inv.status} /> : <Button onClick={() => openInvestigation(defect.id)}><FileSearch size={15} /> Open investigation</Button>}
      />
      <DemoNotice className="mb-4" />
      <div className="mb-6"><KindLegend /></div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]">
        <div className="space-y-6">
          <Panel title={`Photographs (${defect.photos.length})`}>
            <figure>
              <DefectImage category={defect.category} seed={photo.seed} alt={`Demonstration image: ${photo.caption}`} className="aspect-[16/10] rounded-md" />
              <figcaption className="mt-2 flex justify-between text-xs text-graphite-500">
                <span>{photo.caption}</span>
                <span className="font-mono">{photo.magnification}</span>
              </figcaption>
            </figure>
            {defect.photos.length > 1 && (
              <div className="mt-3 flex gap-2" role="tablist" aria-label="Select photograph">
                {defect.photos.map((p, i) => (
                  <button key={p.id} role="tab" aria-selected={i === photoIdx} aria-label={p.caption} onClick={() => setPhotoIdx(i)} className={cx('overflow-hidden rounded border-2', i === photoIdx ? 'border-volt-500' : 'border-transparent')}>
                    <DefectImage category={defect.category} seed={p.seed} alt="" className="h-12 w-16" showBadge={false} />
                  </button>
                ))}
              </div>
            )}
          </Panel>

          {job && (
            <Panel title="Associated job" actions={<Link to={`/investigations/jobs?job=${job.id}`} className="font-mono text-xs text-volt-600 hover:underline">{job.id} →</Link>}>
              <dl className="mb-4 grid grid-cols-2 gap-3 text-sm">
                <div><dt className="text-[11px] text-graphite-500">Component</dt><dd>{job.component}</dd></div>
                <div><dt className="text-[11px] text-graphite-500">Customer / project</dt><dd>{job.customer}</dd></div>
                <div><dt className="text-[11px] text-graphite-500">Substrate</dt><dd>{job.substrate}</dd></div>
                <div><dt className="text-[11px] text-graphite-500">Coating system</dt><dd>{job.coatingSystem}</dd></div>
                <div><dt className="text-[11px] text-graphite-500">Line</dt><dd>{job.line}</dd></div>
                <div><dt className="text-[11px] text-graphite-500">Applied</dt><dd>{fmtDate(job.applicationDate)}</dd></div>
              </dl>
              <MeasurementsTable m={job.measurements} keys={['substrateTempC', 'ambientTempC', 'relativeHumidityPct', 'dewPointC', 'dftMicrons', 'surfaceProfileMicrons', 'cureTempC', 'cureMinutes']} />
            </Panel>
          )}

          <Panel title="Product specification check" actions={<Link to="/investigations/specifications" className="text-xs text-volt-600 hover:underline">Configure</Link>}>
            <SpecCheckPanel spec={spec} m={job?.measurements ?? {}} />
          </Panel>

          <Panel title="Operator notes">
            <blockquote className="flex gap-3 text-sm text-ink-800">
              <Quote size={16} className="shrink-0 text-graphite-400" />
              <p>{defect.operatorNotes}</p>
            </blockquote>
          </Panel>

          <Panel title={`Previous related observations (${related.length})`}>
            {related.length === 0 ? (
              <p className="text-sm text-graphite-500">No related observations on other jobs.</p>
            ) : (
              <ul className="grid gap-3 sm:grid-cols-2">
                {related.map((d) => (
                  <li key={d.id}>
                    <Link to={`/investigations/defects/${d.id}`} className="flex items-center gap-3 rounded-md border border-mist-200 p-2 hover:border-graphite-300">
                      <DefectImage category={d.category} seed={d.photos[0].seed} alt={`Demonstration image for ${d.id}`} className="h-12 w-16 shrink-0 rounded" showBadge={false} />
                      <div className="min-w-0 text-sm">
                        <p><span className="font-mono text-xs text-volt-600">{d.id}</span> · {d.jobId}</p>
                        <p className="truncate text-[11px] text-graphite-500">{CATEGORY_LABEL[d.category]} · {fmtDate(d.inspectionDate)}</p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
            {group && (
              <Link to={`/investigations/defects/groups/${group.id}`} className="mt-3 inline-flex items-center gap-1 text-xs text-violet-700 hover:underline">
                <Bot size={13} /> Compare in suggested group “{group.label}”
              </Link>
            )}
          </Panel>
        </div>

        <div className="space-y-6">
          <Panel title={<span className="flex items-center gap-2"><Bot size={15} className="text-violet-700" /> Evidence suggestions</span>} actions={<KindTag kind="ai" short />}>
            <p className="mb-3 text-[11px] text-graphite-500">Simulated assistant. Suggestions point to evidence worth reviewing; they are not findings and do not identify a cause.</p>
            <ul className="space-y-2">
              {suggestions.map((s) => (
                <li key={s.id} className="rounded-md border border-dashed border-violet-200 bg-violet-50/50 p-2.5 text-sm">
                  {s.text}
                  <p className="mt-0.5 text-[10px] text-violet-700">Basis: {s.basis}</p>
                </li>
              ))}
              {suggestions.length === 0 && <li className="text-xs text-graphite-500">No suggestions.</li>}
            </ul>
          </Panel>

          {inv ? (
            <InvestigationPanel inv={inv} />
          ) : (
            <Panel title="Investigation">
              <p className="text-sm text-graphite-500">This observation is not under investigation yet.</p>
              <Button className="mt-3" onClick={() => openInvestigation(defect.id)}><FileSearch size={15} /> Open investigation</Button>
            </Panel>
          )}
        </div>
      </div>
    </>
  );
}

function InvestigationPanel({ inv }: { inv: Investigation }) {
  const { team, assignInvestigation, setInvestigationStatus, addFinding, addTask, toggleTask, reviewEvidence } = useStore();
  const [finding, setFinding] = useState('');
  const [findingErr, setFindingErr] = useState<string | null>(null);
  const [task, setTask] = useState({ title: '', assigneeId: '', due: '' });
  const [taskErr, setTaskErr] = useState<Record<string, string>>({});
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const current = stageIndex(inv.status);

  function submitFinding(e: FormEvent) {
    e.preventDefault();
    const err = validateFinding(finding);
    setFindingErr(err);
    if (!err) {
      addFinding(inv.id, finding);
      setFinding('');
    }
  }

  function submitTask(e: FormEvent) {
    e.preventDefault();
    const errs = validateTask(task.title, task.assigneeId, task.due);
    setTaskErr(errs);
    if (Object.keys(errs).length === 0) {
      addTask(inv.id, task);
      setTask({ title: '', assigneeId: '', due: '' });
    }
  }

  function changeStatus(to: InvestigationStatus) {
    const check = canTransition(inv, to);
    if (!check.ok) {
      setStatusMsg(check.reason ?? 'Not allowed.');
      return;
    }
    setStatusMsg(null);
    setInvestigationStatus(inv.id, to);
  }

  return (
    <>
      <Panel title={<span><span className="font-mono">{inv.id}</span> · Investigation</span>} actions={<InvStatus status={inv.status} />}>
        <p className="text-sm font-medium">{inv.title}</p>
        <p className="text-[11px] text-graphite-500">Opened {fmtDate(inv.openedAt)}</p>

        <ol className="mt-4 space-y-0" aria-label="Investigation milestones">
          {MILESTONES.map((m, i) => {
            const done = i <= current;
            return (
              <li key={m.status} className="relative flex gap-3 pb-4 last:pb-0">
                {i < MILESTONES.length - 1 && <span className={cx('absolute left-[9px] top-5 h-full w-px', i < current ? 'bg-signal-500' : 'bg-mist-200')} aria-hidden />}
                <span className={cx('relative z-10 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border', done ? 'border-signal-600 bg-signal-600 text-white' : 'border-mist-200 bg-white')}>
                  {done && <Check size={11} />}
                </span>
                <span className={cx('text-sm', done ? 'text-ink-900' : 'text-graphite-400')}>
                  {m.label}
                  <span className="sr-only">{done ? ' (complete)' : ' (pending)'}</span>
                </span>
              </li>
            );
          })}
        </ol>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <div>
            <label htmlFor={`assign-${inv.id}`} className="text-[11px] text-graphite-500">Investigator</label>
            <select id={`assign-${inv.id}`} className={cx(inputCls, 'mt-1')} value={inv.investigatorId ?? ''} onChange={(e) => e.target.value && assignInvestigation(inv.id, e.target.value)}>
              <option value="" disabled>Select investigator…</option>
              {team.map((t) => <option key={t.id} value={t.id}>{t.name} — {t.role}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor={`status-${inv.id}`} className="text-[11px] text-graphite-500">Status</label>
            <select id={`status-${inv.id}`} className={cx(inputCls, 'mt-1')} value={inv.status} onChange={(e) => changeStatus(e.target.value as InvestigationStatus)}>
              {STATUS_ORDER.map((s) => <option key={s} value={s}>{STATUS_LABEL[s]}</option>)}
            </select>
          </div>
        </div>
        {statusMsg && <p role="alert" className="mt-2 text-xs font-medium text-fault">{statusMsg}</p>}
        {inv.status === 'open' && (
          <Button variant="secondary" className="mt-3 text-xs" onClick={() => reviewEvidence(inv.id, 'Photographs, job measurements and specification check reviewed.')}>
            <ClipboardCheck size={14} /> Mark evidence reviewed
          </Button>
        )}
      </Panel>

      <Panel title={`Findings (${inv.findings.length})`} actions={<KindTag kind="confirmed" short />}>
        <ul className="space-y-2">
          {inv.findings.map((f) => (
            <li key={f.id} className="rounded-md border border-emerald-300 bg-emerald-50 p-3 text-sm">
              <p className="flex items-start gap-2"><CircleCheck size={15} className="mt-0.5 shrink-0 text-emerald-700" /> {f.text}</p>
              <p className="mt-1 pl-6 text-[11px] text-emerald-900/70">Confirmed by {f.author} · {fmtDate(f.at)}</p>
            </li>
          ))}
          {inv.findings.length === 0 && <li className="text-xs text-graphite-500">No confirmed findings yet.</li>}
        </ul>
        {inv.status !== 'closed' && (
          <form onSubmit={submitFinding} noValidate className="mt-4 space-y-2">
            <Field label="Add a confirmed finding" htmlFor={`finding-${inv.id}`} error={findingErr ?? undefined} hint="State what was observed or verified. Findings are attributed to you.">
              <textarea
                id={`finding-${inv.id}`}
                rows={3}
                className={inputCls}
                value={finding}
                onChange={(e) => setFinding(e.target.value)}
                aria-invalid={Boolean(findingErr)}
                aria-describedby={findingErr ? `finding-${inv.id}-error` : undefined}
                placeholder="e.g. Shift log confirms booth heaters were switched on at 07:05, after the first coat started."
              />
            </Field>
            <Button type="submit"><Plus size={14} /> Add finding</Button>
          </form>
        )}
      </Panel>

      <Panel title={`Tasks (${inv.tasks.filter((t) => !t.done).length} open)`}>
        <ul className="space-y-1.5">
          {inv.tasks.map((t) => {
            const who = team.find((m) => m.id === t.assigneeId);
            return (
              <li key={t.id} className="flex items-start gap-2.5 rounded-md border border-mist-200 p-2.5 text-sm">
                <input id={`task-${t.id}`} type="checkbox" checked={t.done} onChange={() => toggleTask(inv.id, t.id)} aria-label={`Mark “${t.title}” ${t.done ? 'not done' : 'done'}`} className="mt-1 h-4 w-4 accent-signal-600" />
                <label htmlFor={`task-${t.id}`} className="flex-1">
                  <span className={cx(t.done && 'text-graphite-400 line-through')}>{t.title}</span>
                  <span className="block text-[11px] text-graphite-500">{who?.name ?? 'Unassigned'} · due {fmtDate(t.due)}</span>
                </label>
              </li>
            );
          })}
          {inv.tasks.length === 0 && <li className="text-xs text-graphite-500">No tasks yet.</li>}
        </ul>
        {inv.status !== 'closed' && (
          <form onSubmit={submitTask} noValidate className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Field label="Task" htmlFor={`t-title-${inv.id}`} error={taskErr.title}>
                <input id={`t-title-${inv.id}`} className={inputCls} value={task.title} onChange={(e) => setTask({ ...task, title: e.target.value })} aria-invalid={Boolean(taskErr.title)} placeholder="e.g. Retrieve booth data-logger file" />
              </Field>
            </div>
            <Field label="Assignee" htmlFor={`t-who-${inv.id}`} error={taskErr.assignee}>
              <select id={`t-who-${inv.id}`} className={inputCls} value={task.assigneeId} onChange={(e) => setTask({ ...task, assigneeId: e.target.value })} aria-invalid={Boolean(taskErr.assignee)}>
                <option value="">Select…</option>
                {team.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
              </select>
            </Field>
            <Field label="Due date" htmlFor={`t-due-${inv.id}`} error={taskErr.due}>
              <input id={`t-due-${inv.id}`} type="date" className={inputCls} value={task.due} onChange={(e) => setTask({ ...task, due: e.target.value })} aria-invalid={Boolean(taskErr.due)} />
            </Field>
            <div className="sm:col-span-2"><Button type="submit" variant="secondary"><Plus size={14} /> Add task</Button></div>
          </form>
        )}
      </Panel>

      <Panel title="Activity log">
        <ol className="space-y-3 border-l border-mist-200 pl-4">
          {[...inv.timeline].reverse().map((e) => (
            <li key={e.id} className="relative text-sm">
              <span className="absolute -left-[21px] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-graphite-300" aria-hidden />
              <p>{e.text}</p>
              <p className="text-[11px] text-graphite-500">{e.by} · {new Date(e.at).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })}</p>
            </li>
          ))}
        </ol>
      </Panel>
    </>
  );
}
