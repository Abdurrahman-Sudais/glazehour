import { createContext, useCallback, useContext, useEffect, useMemo, useReducer } from 'react';
import type { ReactNode } from 'react';
import * as inv from '../domain/investigation';
import type { Investigation, InvestigationStatus, Job, JobStatus, Measurements, SpecRule, Specification, Defect } from '../domain/types';
import { CURRENT_USER, DEFECTS, INVESTIGATIONS, JOBS, SPECIFICATIONS, TEAM } from '../data/seed';

const STORAGE_KEY = 'glazehour-demo-v1';

export interface DemoState {
  jobs: Job[];
  defects: Defect[];
  investigations: Investigation[];
  specifications: Specification[];
}

const initialState: DemoState = { jobs: JOBS, defects: DEFECTS, investigations: INVESTIGATIONS, specifications: SPECIFICATIONS };

type Action =
  | { type: 'reset' }
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
      return initialState;
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
    return { ...initialState, ...parsed };
  } catch {
    return initialState;
  }
}

interface StoreApi {
  state: DemoState;
  team: typeof TEAM;
  user: typeof CURRENT_USER;
  reset: () => void;
  updateMeasurements: (jobId: string, m: Measurements) => void;
  setJobStatus: (jobId: string, s: JobStatus) => void;
  setJobInvestigator: (jobId: string, id: string | null) => void;
  upsertRule: (specId: string, rule: SpecRule) => void;
  removeRule: (specId: string, ruleId: string) => void;
  openInvestigation: (defectId: string) => string;
  assignInvestigation: (invId: string, memberId: string) => void;
  setInvestigationStatus: (invId: string, s: InvestigationStatus) => void;
  addFinding: (invId: string, text: string) => void;
  addTask: (invId: string, task: { title: string; assigneeId: string; due: string }) => void;
  toggleTask: (invId: string, taskId: string) => void;
  reviewEvidence: (invId: string, note: string) => void;
}

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
    const by = CURRENT_USER.name;
    return {
      state,
      team: TEAM,
      user: CURRENT_USER,
      reset: () => dispatch({ type: 'reset' }),
      updateMeasurements: (jobId, measurements) => dispatch({ type: 'job/measurements', jobId, measurements }),
      setJobStatus: (jobId, status) => dispatch({ type: 'job/status', jobId, status }),
      setJobInvestigator: (jobId, investigatorId) => dispatch({ type: 'job/investigator', jobId, investigatorId }),
      upsertRule: (specId, rule) => dispatch({ type: 'spec/rule-upsert', specId, rule }),
      removeRule: (specId, ruleId) => dispatch({ type: 'spec/rule-remove', specId, ruleId }),
      openInvestigation: (defectId) => {
        const existing = state.investigations.find((i) => i.defectId === defectId);
        if (existing) return existing.id;
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
        return id;
      },
      assignInvestigation: (invId, memberId) => {
        const m = TEAM.find((t) => t.id === memberId);
        if (m) withInv(invId, (i) => inv.assign(i, m.id, m.name, by));
      },
      setInvestigationStatus: (invId, s) => withInv(invId, (i) => inv.setStatus(i, s, by)),
      addFinding: (invId, text) => withInv(invId, (i) => inv.addFinding(i, text, by)),
      addTask: (invId, task) => withInv(invId, (i) => inv.addTask(i, task, by)),
      toggleTask: (invId, taskId) => withInv(invId, (i) => inv.toggleTask(i, taskId, by)),
      reviewEvidence: (invId, note) => withInv(invId, (i) => inv.markEvidenceReviewed(i, by, note)),
    };
  }, [state, withInv]);

  return <StoreContext.Provider value={api}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreApi {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used inside StoreProvider');
  return ctx;
}
