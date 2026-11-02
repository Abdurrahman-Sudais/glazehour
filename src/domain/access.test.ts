import { describe, expect, it } from 'vitest';
import { ACTIONS, MEMBER_ROLE, can } from './access';
import { TEAM } from '../data/seed';

describe('demo roles', () => {
  it('gives the quality lead every action', () => {
    for (const a of ACTIONS) expect(can('lead', a)).toBe(true);
  });
  it('keeps specification rules and the audit log with the quality lead', () => {
    for (const r of ['engineer', 'inspector', 'supervisor'] as const) {
      expect(can(r, 'rules')).toBe(false);
      expect(can(r, 'audit')).toBe(false);
    }
  });
  it('lets inspectors record evidence but not change status or assign', () => {
    expect(can('inspector', 'measurements')).toBe(true);
    expect(can('inspector', 'finding')).toBe(true);
    expect(can('inspector', 'status')).toBe(false);
    expect(can('inspector', 'assign')).toBe(false);
  });
  it('assigns a role to every team member', () => {
    for (const m of TEAM) expect(MEMBER_ROLE[m.id]).toBeDefined();
  });
});
