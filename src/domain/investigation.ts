// Pure state transitions for investigations. The store calls these; React
// components never mutate investigations directly.

import type { Finding, Investigation, InvestigationStatus, InvestigationTask, TimelineEvent, TimelineKind } from './types';

export const STATUS_ORDER: InvestigationStatus[] = ['open', 'evidence-review', 'assigned', 'findings-added', 'closed'];

export const STATUS_LABEL: Record<InvestigationStatus, string> = {
  open: 'Observation recorded',
  'evidence-review': 'Evidence under review',
  assigned: 'Investigation assigned',
  'findings-added': 'Findings added',
  closed: 'Closed',
};

/** The five milestone stages shown on the investigation timeline. */
export const MILESTONES: { status: InvestigationStatus; label: string }[] = [
  { status: 'open', label: 'Observation recorded' },
  { status: 'evidence-review', label: 'Evidence reviewed' },
  { status: 'assigned', label: 'Investigation assigned' },
  { status: 'findings-added', label: 'Findings added' },
  { status: 'closed', label: 'Investigation closed' },
];

let counter = 0;
export function uid(prefix: string): string {
  counter += 1;
  return `${prefix}-${Date.now().toString(36)}${counter.toString(36)}`;
}

function event(kind: TimelineKind, by: string, text: string, at = new Date().toISOString()): TimelineEvent {
  return { id: uid('ev'), kind, at, by, text };
}

export function stageIndex(status: InvestigationStatus): number {
  return STATUS_ORDER.indexOf(status);
}

/** Validation for closing: a closed investigation must have at least one human-confirmed finding. */
export function canTransition(inv: Investigation, to: InvestigationStatus): { ok: boolean; reason?: string } {
  if (to === inv.status) return { ok: false, reason: 'Already in this status.' };
  if (to === 'assigned' && !inv.investigatorId) return { ok: false, reason: 'Assign an investigator first.' };
  if (to === 'findings-added' && inv.findings.length === 0) return { ok: false, reason: 'Add at least one confirmed finding first.' };
  if (to === 'closed' && inv.findings.length === 0) return { ok: false, reason: 'An investigation cannot be closed without a confirmed finding.' };
  if (to === 'closed' && inv.tasks.some((t) => !t.done)) return { ok: false, reason: 'Complete all open tasks before closing.' };
  return { ok: true };
}

export function setStatus(inv: Investigation, to: InvestigationStatus, by: string): Investigation {
  const check = canTransition(inv, to);
  if (!check.ok) return inv;
  const kind: TimelineKind = to === 'closed' ? 'investigation-closed' : to === 'evidence-review' ? 'evidence-reviewed' : 'status-changed';
  return { ...inv, status: to, timeline: [...inv.timeline, event(kind, by, `Status changed to “${STATUS_LABEL[to]}”.`)] };
}

export function assign(inv: Investigation, investigatorId: string, investigatorName: string, by: string): Investigation {
  const status: InvestigationStatus = stageIndex(inv.status) < stageIndex('assigned') ? 'assigned' : inv.status;
  return {
    ...inv,
    investigatorId,
    status,
    timeline: [...inv.timeline, event('investigation-assigned', by, `Assigned to ${investigatorName}.`)],
  };
}

export function addFinding(inv: Investigation, text: string, author: string): Investigation {
  const finding: Finding = { id: uid('fd'), text: text.trim(), author, at: new Date().toISOString(), confirmed: true };
  const status: InvestigationStatus = stageIndex(inv.status) < stageIndex('findings-added') ? 'findings-added' : inv.status;
  return {
    ...inv,
    status,
    findings: [...inv.findings, finding],
    timeline: [...inv.timeline, event('finding-added', author, `Confirmed finding: ${finding.text}`)],
  };
}

export function addTask(inv: Investigation, task: Omit<InvestigationTask, 'id' | 'done'>, by: string): Investigation {
  const t: InvestigationTask = { ...task, id: uid('tk'), title: task.title.trim(), done: false };
  return { ...inv, tasks: [...inv.tasks, t], timeline: [...inv.timeline, event('task-added', by, `Task added: ${t.title}`)] };
}

export function toggleTask(inv: Investigation, taskId: string, by: string): Investigation {
  const task = inv.tasks.find((t) => t.id === taskId);
  if (!task) return inv;
  const done = !task.done;
  return {
    ...inv,
    tasks: inv.tasks.map((t) => (t.id === taskId ? { ...t, done } : t)),
    timeline: done ? [...inv.timeline, event('task-completed', by, `Task completed: ${task.title}`)] : inv.timeline,
  };
}

export function markEvidenceReviewed(inv: Investigation, by: string, note: string): Investigation {
  const status: InvestigationStatus = inv.status === 'open' ? 'evidence-review' : inv.status;
  return { ...inv, status, timeline: [...inv.timeline, event('evidence-reviewed', by, note)] };
}

/** Field validation shared by the finding and task forms. */
export function validateFinding(text: string): string | null {
  if (text.trim().length < 10) return 'Describe the finding in at least 10 characters.';
  if (text.length > 600) return 'Keep findings under 600 characters.';
  return null;
}

export function validateTask(title: string, assigneeId: string, due: string): Record<string, string> {
  const e: Record<string, string> = {};
  if (title.trim().length < 4) e.title = 'Task title must be at least 4 characters.';
  if (!assigneeId) e.assignee = 'Select an assignee.';
  if (!due || Number.isNaN(Date.parse(due))) e.due = 'Choose a valid due date.';
  return e;
}
