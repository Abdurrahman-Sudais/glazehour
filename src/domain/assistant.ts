/**
 * Simulated, record-grounded assistant for the demo workspace.
 * Answers only from current jobs, defects, investigations and specification checks, and lists the records it used.
 * Refuses to name causes, prescribe corrective processes, or accept/release work — those belong to people.
 * No model or external API is called.
 */
import { CATEGORY_LABEL } from '../data/seed';
import { STATUS_LABEL } from './investigation';
import { MEASUREMENT_META, evaluateSpecification, missingMeasurements } from './rules';
import type { Defect, Investigation, Job, Specification, TeamMember } from './types';

export interface AssistantContext {
  jobs: Job[];
  defects: Defect[];
  investigations: Investigation[];
  specifications: Specification[];
  team: TeamMember[];
}

export interface AssistantAnswer {
  kind: 'answer' | 'refusal' | 'help';
  title: string;
  lines: string[];
  sources: string[];
  links: { label: string; to: string }[];
}

export const EXAMPLE_QUESTIONS = ['Which investigations need attention?', 'Which jobs failed a specification check?', 'What happened on J-24117?', 'Which jobs are missing measurements?', 'What caused D-1042?'] as const;

const REFUSAL_RE = /\b(caus\w*|why did|root cause|diagnos\w*|fix|how (do|should) (we|i) (fix|repair|recoat)|should (we|i) (recoat|strip|blast|change)|release|approve|accept|sign off|warrant\w*|predict\w*|will it fail)\b/i;

const REFUSAL: AssistantAnswer = {
  kind: 'refusal',
  title: 'That’s for your quality team to confirm',
  lines: [
    'Glazehour connects a defect to its evidence — measurements, specification checks, photographs and similar cases. It does not name causes, prescribe corrective processes, or accept or release work.',
    'I can show which readings are missing, which specification rules failed, and which similar observations exist, so the investigator can decide.',
  ],
  sources: [],
  links: [{ label: 'Open investigations', to: '/investigations/cases' }],
};

const who = (c: AssistantContext, id: string | null) => c.team.find((t) => t.id === id)?.name ?? 'unassigned';
const specFor = (c: AssistantContext, j: Job) => c.specifications.find((s) => s.id === j.specificationId);

function jobSummary(j: Job, c: AssistantContext): AssistantAnswer {
  const spec = evaluateSpecification(specFor(c, j), j.measurements);
  const missing = missingMeasurements(j.measurements);
  const defects = c.defects.filter((d) => d.jobId === j.id);
  const invs = c.investigations.filter((i) => defects.some((d) => d.id === i.defectId));
  return {
    kind: 'answer',
    title: `${j.id} at a glance`,
    lines: [
      `${j.component} for ${j.customer} · ${j.coatingSystem} on ${j.substrate}, ${j.line}.`,
      `Specification check: ${spec.pass} passed, ${spec.fail} failed, ${spec.notEvaluable} not evaluable.`,
      ...spec.results.filter((r) => r.outcome === 'fail').map((r) => `Failed: ${r.label} (${r.limitText}).`),
      ...(missing.length ? [`Not recorded: ${missing.map((k) => MEASUREMENT_META[k].label.toLowerCase()).join(', ')}. Rules that need them are not evaluated.`] : []),
      ...defects.map((d) => `${d.id}: ${CATEGORY_LABEL[d.category]} — ${d.location} (${d.severity}).`),
      ...invs.map((i) => `${i.id}: ${STATUS_LABEL[i.status]}, ${who(c, i.investigatorId)}.`),
    ],
    sources: [j.id, ...defects.map((d) => d.id), ...invs.map((i) => i.id)],
    links: [{ label: `Open ${j.id}`, to: `/investigations/jobs?job=${j.id}` }, ...defects.slice(0, 2).map((d) => ({ label: `Open ${d.id}`, to: `/investigations/defects/${d.id}` }))],
  };
}

function defectSummary(d: Defect, c: AssistantContext): AssistantAnswer {
  const j = c.jobs.find((x) => x.id === d.jobId);
  const base = j ? jobSummary(j, c) : null;
  const inv = c.investigations.find((i) => i.defectId === d.id);
  return {
    kind: 'answer',
    title: `${d.id} · ${CATEGORY_LABEL[d.category]}`,
    lines: [
      `${d.location}. Severity ${d.severity}, inspected ${d.inspectionDate}.`,
      ...(inv ? [`${inv.id}: ${STATUS_LABEL[inv.status]}, ${who(c, inv.investigatorId)}, ${inv.findings.length} confirmed finding${inv.findings.length === 1 ? '' : 's'}.`] : ['No investigation has been opened yet.']),
      ...(base ? base.lines.slice(1, 4) : []),
    ],
    sources: [d.id, ...(j ? [j.id] : []), ...(inv ? [inv.id] : [])],
    links: [{ label: `Open ${d.id}`, to: `/investigations/defects/${d.id}` }],
  };
}

function attention(c: AssistantContext): AssistantAnswer {
  const open = c.investigations.filter((i) => i.status !== 'closed');
  return {
    kind: 'answer',
    title: `${open.length} investigation${open.length === 1 ? '' : 's'} still open`,
    lines: [
      ...open.map((i) => `${i.id} (${i.defectId}): ${i.title}. ${STATUS_LABEL[i.status]}, ${who(c, i.investigatorId)}, ${i.tasks.filter((t) => !t.done).length} open task(s).`),
      ...(open.some((i) => !i.investigatorId) ? [`${open.filter((i) => !i.investigatorId).map((i) => i.id).join(', ')} still need an investigator.`] : []),
    ],
    sources: open.map((i) => i.id),
    links: open.slice(0, 3).map((i) => ({ label: `Open ${i.id}`, to: `/investigations/defects/${i.defectId}` })),
  };
}

function failedChecks(c: AssistantContext): AssistantAnswer {
  const rows = c.jobs.map((j) => ({ j, s: evaluateSpecification(specFor(c, j), j.measurements) })).filter((r) => r.s.fail > 0);
  return {
    kind: 'answer',
    title: rows.length ? `${rows.length} job${rows.length === 1 ? '' : 's'} failed a specification rule` : 'No failed specification checks',
    lines: rows.map((r) => `${r.j.id} (${r.j.component}): ${r.s.results.filter((x) => x.outcome === 'fail').map((x) => x.label).join('; ')}.`),
    sources: rows.map((r) => r.j.id),
    links: [{ label: 'Open jobs', to: '/investigations/jobs' }],
  };
}

function missingData(c: AssistantContext): AssistantAnswer {
  const rows = c.jobs.map((j) => ({ j, m: missingMeasurements(j.measurements) })).filter((r) => r.m.length);
  return {
    kind: 'answer',
    title: rows.length ? `${rows.length} job${rows.length === 1 ? ' is' : 's are'} missing measurements` : 'Every job has its measurements',
    lines: rows.map((r) => `${r.j.id}: ${r.m.map((k) => MEASUREMENT_META[k].label.toLowerCase()).join(', ')}. Rules needing these show “Unable to evaluate”.`),
    sources: rows.map((r) => r.j.id),
    links: [{ label: 'Open jobs', to: '/investigations/jobs' }],
  };
}

const HELP: AssistantAnswer = {
  kind: 'help',
  title: 'What I can answer',
  lines: ['Ask about a job (for example “J-24117”) or an observation (“D-1042”), which investigations need attention, which jobs failed a specification check, or which jobs are missing measurements.', 'I answer from the records in this workspace and list the ones I used.'],
  sources: [],
  links: [],
};

export function answer(question: string, c: AssistantContext): AssistantAnswer {
  const q = question.trim();
  if (!q) return HELP;
  if (REFUSAL_RE.test(q)) return REFUSAL;
  const up = q.toUpperCase();
  const jid = up.match(/\bJ-\d{5}\b/)?.[0];
  if (jid) {
    const j = c.jobs.find((x) => x.id === jid);
    return j ? jobSummary(j, c) : { kind: 'answer', title: `No job called ${jid}`, lines: ['That ID is not in this workspace.'], sources: [], links: [{ label: 'Open jobs', to: '/investigations/jobs' }] };
  }
  const did = up.match(/\bD-\d{4}\b/)?.[0];
  if (did) {
    const d = c.defects.find((x) => x.id === did);
    return d ? defectSummary(d, c) : { kind: 'answer', title: `No observation called ${did}`, lines: ['That ID is not in this workspace.'], sources: [], links: [{ label: 'Open the defect library', to: '/investigations/defects' }] };
  }
  if (/\b(fail\w*|out of spec|specification|spec check|non-?conform\w*)\b/i.test(q)) return failedChecks(c);
  if (/\b(missing|not recorded|gap|incomplete|measurement)/i.test(q)) return missingData(c);
  if (/\b(attention|investigation|open|unassigned|overdue|task)/i.test(q)) return attention(c);
  return HELP;
}
