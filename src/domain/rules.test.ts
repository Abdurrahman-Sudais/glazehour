import { describe, expect, it } from 'vitest';
import { MISSING_MESSAGE, evaluateRule, parseReading, validateRule } from './rules';
import type { SpecRule } from './types';

const dp: SpecRule = { id: 'r', label: 'Dew point margin', comparator: 'min-difference', measurement: 'substrateTempC', subtract: 'dewPointC', min: 3, unit: '°C', enabled: true };

describe('evaluateRule', () => {
  it('calculates the difference when both readings exist', () => {
    const r = evaluateRule(dp, { substrateTempC: 15.5, dewPointC: 10.9 });
    expect(r.calculated).toBe(4.6);
    expect(r.outcome).toBe('pass');
  });
  it('fails when the difference is below the minimum', () => {
    expect(evaluateRule(dp, { substrateTempC: 12.4, dewPointC: 11.1 }).outcome).toBe('fail');
  });
  it('refuses to evaluate with a missing reading', () => {
    const r = evaluateRule(dp, { substrateTempC: 9.8, dewPointC: null });
    expect(r.outcome).toBe('not-evaluable');
    expect(r.detail).toBe(MISSING_MESSAGE);
    expect(r.calculated).toBeNull();
    expect(r.missing).toEqual(['dewPointC']);
  });
  it('treats NaN as missing', () => {
    expect(evaluateRule(dp, { substrateTempC: NaN, dewPointC: 5 }).outcome).toBe('not-evaluable');
  });
  it('handles range limits inclusively', () => {
    const range: SpecRule = { id: 'x', label: 'DFT', comparator: 'range', measurement: 'dftMicrons', min: 75, max: 125, unit: 'µm', enabled: true };
    expect(evaluateRule(range, { dftMicrons: 75 }).outcome).toBe('pass');
    expect(evaluateRule(range, { dftMicrons: 126 }).outcome).toBe('fail');
  });
});

describe('validation', () => {
  it('rejects inverted ranges', () => {
    expect(validateRule({ ...dp, comparator: 'range', min: 10, max: 5 })).toContain('Minimum must not exceed maximum.');
  });
  it('parses readings', () => {
    expect(parseReading('')).toEqual({ value: null, error: null });
    expect(parseReading('12.5').value).toBe(12.5);
    expect(parseReading('abc').error).not.toBeNull();
  });
});
