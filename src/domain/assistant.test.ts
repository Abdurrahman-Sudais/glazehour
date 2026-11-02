import { describe, expect, it } from 'vitest';
import { DEFECTS, INVESTIGATIONS, JOBS, SPECIFICATIONS, TEAM } from '../data/seed';
import { EXAMPLE_QUESTIONS, answer } from './assistant';

const c = { jobs: JOBS, defects: DEFECTS, investigations: INVESTIGATIONS, specifications: SPECIFICATIONS, team: TEAM };

describe('grounded assistant', () => {
  it('answers every example question', () => {
    for (const q of EXAMPLE_QUESTIONS) expect(answer(q, c).lines.length).toBeGreaterThan(0);
  });
  it('refuses causes, fixes and acceptance', () => {
    for (const q of ['What caused D-1042?', 'How should we fix the blistering?', 'Can we release J-24117?', 'Should we recoat J-24152?']) expect(answer(q, c).kind).toBe('refusal');
  });
  it('summarises a job and cites its records', () => {
    const a = answer('What happened on J-24117?', c);
    expect(a.title).toContain('J-24117');
    expect(a.sources).toContain('J-24117');
    expect(a.sources).toContain('D-1042');
  });
  it('lists open investigations with sources that appear in the answer', () => {
    const a = answer('Which investigations need attention?', c);
    expect(a.sources.length).toBeGreaterThan(0);
    for (const s of a.sources) expect(a.lines.join(' ')).toContain(s);
  });
  it('falls back to help', () => {
    expect(answer('What is the weather?', c).kind).toBe('help');
  });
});
