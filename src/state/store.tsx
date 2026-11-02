import { createContext, useCallback, useContext, useEffect, useMemo, useReducer } from 'react';
import type { ReactNode } from 'react';
import * as inv from '../domain/investigation';
import type { Investigation, InvestigationStatus, Job, JobStatus, Measurements, SpecRule, Specification, Defect } from '../domain/types';
import { CURRENT_USER, DEFECTS, INVESTIGATIONS, JOBS, SPECIFICATIONS, TEAM } from '../data/seed';
import { can as roleCan, roleOf, type Action as Perm, type AuditEntry, type DemoRole } from '../domain/access';

const STORAGE_KEY = 'glazehour-demo-v1';

export interface DemoState {
  jobs: Job[];
  defects: Defect[];
  investigations: Investigation[];
  specifications: Specification[];
  /** Acting demo user. */
  userId: string;
  /** Append-only record of changes made in this browser. */
  audit: AuditEntry[];
}

const initialState: DemoState = { jobs: JOBS, defects: DEFECTS, investigations: INVESTIGATIONS, specifications: SPECIFICATIONS, userId: CURRENT_USER.id, audit: [] };

type Action =
  | { type: 'reset' }
  | { type: 'user'; userId: string }
  | { type: 'audit'; entry: AuditEntry }
  | { type: 'job/measurements'; jobId: string; measurements: Measurements }
  | { type: 'job/status'; jobId: string; status: JobStatus }
  | { type: 'job/investigator'; jobId: string; investigatorId: string | null }
  | { type: 'spec/rule-upsert'; specId: string; rule: SpecRule }
  | { type: 'spec/rule-remove'; specId: string; ruleId: string }
  | { type: 'inv/replace'; investigation: Investigation }
  | { type: 'inv/create'; investigation: Investigation };

function reducer(state: DemoState, action: Action): DemoState {
  switch (action.type) {
    case 'reset':
      // Reset only clears this browser's demo data; keep the acting user.
      return { ...initialState, userId: state.userId };
    case 'user':
      return { ...state, userId: action.userId };
    case 'audit':
      return { ...state, audit: [...state.audit, action.entry] };
    case 'job/measurements':
      return { ...state, jobs: state.jobs.map((j) => (j.id === action.jobId ? { ...j, measurements: action.measurements } : j)) };
    case 'job/status':
      return { ...state, jobs: state.jobs.map((j) => (j.id === action.jobId ? { ...j, status: action.status } : j)) };
    case 'job/investigator':
      return { ...state, jobs: state.jobs.map((j) => (j.id === action.jobId ? { ...j, investigatorId: action.investigatorId } : j)) };
    case 'spec/rule-upsert':
      return {
        ...state,
        specifications: state.specifications.map((s) => {
          if (s.id !== action.specId) return s;
          const exists = s.rules.some((r) => r.id === action.rule.id);
          return { ...s, rules: exists ? s.rules.map((r) => (r.id === action.rule.id ? action.rule : r)) : [...s.rules, action.rule] };
        }),
      };
    case 'spec/rule-remove':
      return {
        ...state,
        specifications: state.specifications.map((s) => (s.id === action.specId ? { ...s, rules: s.rules.filter((r) => r.id !== action.ruleId) } : s)),
      };
    case 'inv/replace':
      return { ...state, investigations: state.investigations.map((i) => (i.id === action.investigation.id ? action.investigation : i)) };
    case 'inv/create':
      return { ...state, investigations: [action.investigation, ...state.investigations] };
  }
}

function load(): DemoState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialState;
    const parsed = JSON.parse(raw) as DemoState;
    if (!Array.isArray(parsed.jobs) || !Array.isArray(parsed.investigations)) return initialState;
    return { ...initialState, ...parsed, audit: Array.isArray(parsed.audit) ? parsed.audit : [], userId: TEAM.some((t) => t.id === parsed.userId) ? parsed.userId : CURRENT_USER.id };
  } catch {
    return initialState;
  }
}

interface StoreApi {
  state: DemoState;
  team: typeof TEAM;
  user: (typeof TEAM)[number];
  role: DemoRole;
  /** Whether the acting user may perform an action. Every mutation below checks this first and returns false when refused. */
  can: (action: Perm) => boolean;
  setUser: (userId: string) => void;
  /** Seeded investigation history plus changes made in this browser, oldest first. */
  auditLog: AuditEntry[];
  reset: () => void;
  updateMeasurements: (jobId: string, m: Measurements) => boolean;
  setJobStatus: (jobId: string, s: JobStatus) => boolean;
  setJobInvestigator: (jobId: string, id: string | null) => boolean;
  upsertRule: (specId: string, rule: SpecRule) => boolean;
  removeRule: (specId: string, ruleId: string) => boolean;
  /** Returns the investigation id, or null when the acting user may not open investigations. */
  openInvestigation: (defectId: string) => string | null;
  assignInvestigation: (invId: string, memberId: string) => boolean;
  setInvestigationStatus: (invId: string, s: InvestigationStatus) => boolean;
  addFinding: (invId: string, text: string) => boolean;
  addTask: (invId: string, task: { title: string; assigneeId: string; due: string }) => boolean;
  toggleTask: (invId: string, taskId: string) => boolean;
  reviewEvidence: (invId: string, note: string) => boolean;
}

const nameToId = (name: string) => TEAM.find((t) => t.name === name)?.id;

const KIND_ACTION: Record<string, Perm> = {
  'investigation-assigned': 'assign',
  'status-changed': 'status',
  'finding-added': 'finding',
  'task-added': 'task',
  'task-completed': 'task',
  'evidence-reviewed': 'evidence',
};

const SEED_AUDIT: AuditEntry[] = INVESTIGATIONS.flatMap((i) =>
  i.timeline
    .filter((e) => KIND_ACTION[e.kind] && nameToId(e.by))
    .map((e) => ({ id: `seed-${i.id}-${e.id}`, at: e.at, actorId: nameToId(e.by) as string, action: KIND_ACTION[e.kind] as Perm, detail: `${i.id}: ${e.text}` })),
).sort((a, b) => a.at.localeCompare(b.at));

const StoreContext = createContext<StoreApi | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, load);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* storage unavailable: demo continues in memory */
    }
  }, [state]);

  const withInv = useCallback(
    (invId: string, fn: (i: Investigation) => Investigation) => {
      const current = state.investigations.find((i) => i.id === invId);
      if (current) dispatch({ type: 'inv/replace', investigation: fn(current) });
    },
    [state.investigations],
  );

  const api = useMemo<StoreApi>(() => {
    const user = TEAM.find((t) => t.id === state.userId) ?? CURRENT_USER;
    const role = roleOf(user.id);
    const by = user.name;
    const allowed = (a: Perm) => roleCan(role, a);
    const log = (action: Perm, detail: string) => dispatch({ type: 'audit', entry: { id: inv.uid('a'), at: new Date().toISOString(), actorId: user.id, action, detail } });
    /** Run fn only when permitted, and record it in the audit log. */
    const guarded = (action: Perm, detail: string, fn: () => void) => {
      if (!allowed(action)) return false;
      fn();
      log(action, detail);
      return true;
    };
    return {
      state,
      team: TEAM,
      user,
      role,
      can: allowed,
      setUser: (userId) => dispatch({ type: 'user', userId }),
      auditLog: [...SEED_AUDIT, ...state.audit],
      reset: () => dispatch({ type: 'reset' }),
      updateMeasurements: (jobId, measurements) => guarded('measurements', `${jobId}: Measurements updated.`, () => dispatch({ type: 'job/measurements', jobId, measurements })),
      setJobStatus: (jobId, status) => guarded('jobStatus', `${jobId}: Status set to ${status}.`, () => dispatch({ type: 'job/status', jobId, status })),
      setJobInvestigator: (jobId, investigatorId) =>
        guarded('assign', `${jobId}: Investigator ${investigatorId ? `set to ${TEAM.find((t) => t.id === investigatorId)?.name}` : 'cleared'}.`, () => dispatch({ type: 'job/investigator', jobId, investigatorId })),
      upsertRule: (specId, rule) => guarded('rules', `${specId}: Rule “${rule.label}” saved${rule.enabled ? '' : ' (disabled)'}.`, () => dispatch({ type: 'spec/rule-upsert', specId, rule })),
      removeRule: (specId, ruleId) => guarded('rules', `${specId}: Rule ${ruleId} removed.`, () => dispatch({ type: 'spec/rule-remove', specId, ruleId })),
      openInvestigation: (defectId) => {
        const existing = state.investigations.find((i) => i.defectId === defectId);
        if (existing) return existing.id;
        if (!allowed('open')) return null;
        const defect = state.defects.find((d) => d.id === defectId);
        const id = `INV-${300 + state.investigations.length + 1}`;
        dispatch({
          type: 'inv/create',
          investigation: {
            id,
            defectId,
            title: `Investigation of ${defectId}${defect ? ` (${defect.location})` : ''}`,
            status: 'open',
            investigatorId: null,
            openedAt: new Date().toISOString().slice(0, 10),
            timeline: [{ id: inv.uid('ev'), kind: 'observation-recorded', at: new Date().toISOString(), by, text: `Investigation opened from observation ${defectId}.` }],
            findings: [],
            tasks: [],
          },
        });
        log('open', `${id}: Opened from observation ${defectId}.`);
        return id;
      },
      assignInvestigation: (invId, memberId) => {
        const m = TEAM.find((t) => t.id === memberId);
        if (!m) return false;
        return guarded('assign', `${invId}: Assigned to ${m.name}.`, () => withInv(invId, (i) => inv.assign(i, m.id, m.name, by)));
      },
      setInvestigationStatus: (invId, s) => guarded('status', `${invId}: Status changed to ${s}.`, () => withInv(invId, (i) => inv.setStatus(i, s, by))),
      addFinding: (invId, text) => guarded('finding', `${invId}: Finding recorded.`, () => withInv(invId, (i) => inv.addFinding(i, text, by))),
      addTask: (invId, task) => guarded('task', `${invId}: Task “${task.title}” added.`, () => withInv(invId, (i) => inv.addTask(i, task, by))),
      toggleTask: (invId, taskId) => guarded('task', `${invId}: Task ${taskId} toggled.`, () => withInv(invId, (i) => inv.toggleTask(i, taskId, by))),
      reviewEvidence: (invId, note) => guarded('evidence', `${invId}: Evidence marked reviewed.`, () => withInv(invId, (i) => inv.markEvidenceReviewed(i, by, note))),
    };
  }, [state, withInv]);

  return <StoreContext.Provider value={api}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreApi {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used inside StoreProvider');
  return ctx;
}
