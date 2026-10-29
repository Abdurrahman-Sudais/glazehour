import { CATEGORY_LABEL } from '../data/seed';
import { STATUS_LABEL, STATUS_ORDER } from './investigation';
import { evaluateSpecification } from './rules';
import type { Defect, Investigation, Job, Specification, TeamMember } from './types';

interface ReportInput {
  jobs: Job[];
  defects: Defect[];
  investigations: Investigation[];
  specifications: Specification[];
}

function countBy<T>(items: T[], key: (t: T) => string) {
  const m = new Map<string, number>();
  items.forEach((i) => m.set(key(i), (m.get(key(i)) ?? 0) + 1));
  return [...m.entries()].map(([label, value]) => ({ label, value })).sort((a, b) => b.value - a.value);
}

export function buildReport(s: ReportInput) {
  const outcomes = { pass: 0, fail: 0, notEvaluable: 0 };
  s.jobs.forEach((j) => {
    const e = evaluateSpecification(s.specifications.find((x) => x.id === j.specificationId), j.measurements);
    outcomes.pass += e.pass;
    outcomes.fail += e.fail;
    outcomes.notEvaluable += e.notEvaluable;
  });
  const total = outcomes.pass + outcomes.fail + outcomes.notEvaluable;
  return {
    byCategory: countBy(s.defects, (d) => CATEGORY_LABEL[d.category]),
    byLine: countBy(s.defects, (d) => s.jobs.find((j) => j.id === d.jobId)?.line ?? 'Unknown'),
    byStatus: STATUS_ORDER.map((st) => ({ label: STATUS_LABEL[st], value: s.investigations.filter((i) => i.status === st).length })),
    outcomes,
    coveragePct: total ? Math.round(((outcomes.pass + outcomes.fail) / total) * 100) : 0,
  };
}

const esc = (v: string | number) => `"${String(v).replace(/"/g, '""')}"`;

export function investigationsCsv(s: ReportInput, team: TeamMember[]): string {
  const header = ['Investigation', 'Title', 'Defect', 'Category', 'Job', 'Status', 'Investigator', 'Findings', 'Open tasks'];
  const rows = s.investigations.map((i) => {
    const d = s.defects.find((x) => x.id === i.defectId);
    return [i.id, i.title, i.defectId, d ? CATEGORY_LABEL[d.category] : '', d?.jobId ?? '', STATUS_LABEL[i.status], team.find((t) => t.id === i.investigatorId)?.name ?? 'Unassigned', i.findings.length, i.tasks.filter((t) => !t.done).length];
  });
  return [header, ...rows].map((r) => r.map(esc).join(',')).join('\n');
}
