import { TEAM } from '../data/seed';

/** Demo roles. In production these are identity-provider groups, checked again on the server. */
export type DemoRole = 'lead' | 'engineer' | 'inspector' | 'supervisor';

export type Action = 'measurements' | 'jobStatus' | 'assign' | 'rules' | 'open' | 'status' | 'finding' | 'task' | 'evidence' | 'audit';

export const ROLE_LABEL: Record<DemoRole, string> = {
  lead: 'Quality lead',
  engineer: 'Process engineer',
  inspector: 'Coatings inspector',
  supervisor: 'Line supervisor',
};

export const ACTION_LABEL: Record<Action, string> = {
  measurements: 'Record job measurements',
  jobStatus: 'Change job status',
  assign: 'Assign investigators',
  rules: 'Edit specification rules',
  open: 'Open investigations',
  status: 'Change investigation status',
  finding: 'Record confirmed findings',
  task: 'Add and complete tasks',
  evidence: 'Mark evidence reviewed',
  audit: 'Read and export the audit log',
};

export const ACTIONS = Object.keys(ACTION_LABEL) as Action[];

const MATRIX: Record<DemoRole, Action[]> = {
  lead: ACTIONS,
  engineer: ['measurements', 'assign', 'open', 'status', 'finding', 'task', 'evidence'],
  inspector: ['measurements', 'open', 'finding', 'task', 'evidence'],
  supervisor: ['jobStatus', 'assign', 'task'],
};

export const MEMBER_ROLE: Record<string, DemoRole> = {
  'u-amara': 'lead',
  'u-dlee': 'engineer',
  'u-ines': 'inspector',
  'u-ruth': 'inspector',
  'u-tomas': 'supervisor',
};

export const roleOf = (memberId: string): DemoRole => MEMBER_ROLE[memberId] ?? 'supervisor';
export const can = (role: DemoRole, action: Action) => MATRIX[role].includes(action);

export interface AuditEntry {
  id: string;
  at: string;
  actorId: string;
  action: Action;
  detail: string;
}

export const actorName = (id: string) => TEAM.find((t) => t.id === id)?.name ?? id;
export const DEMO_PEOPLE = TEAM.map((m) => ({ ...m, demoRole: roleOf(m.id) }));
