// Deterministic specification-checking engine.
//
// Compares *recorded* measurements against *user-supplied* specification
// limits. It never fills in a missing value, never estimates, and never
// references external industry standards. If a required measurement is
// missing or invalid, the rule is reported as not evaluable.

import type { MeasurementKey, Measurements, SpecRule, Specification } from './types';

export const MISSING_MESSAGE = 'Unable to evaluate: required measurement missing.';

export const MEASUREMENT_META: Record<MeasurementKey, { label: string; unit: string }> = {
  substrateTempC: { label: 'Substrate temperature', unit: '°C' },
  ambientTempC: { label: 'Ambient temperature', unit: '°C' },
  relativeHumidityPct: { label: 'Relative humidity', unit: '%' },
  dewPointC: { label: 'Dew point (supplied)', unit: '°C' },
  dftMicrons: { label: 'Dry film thickness', unit: 'µm' },
  surfaceProfileMicrons: { label: 'Surface profile', unit: 'µm' },
  cureTempC: { label: 'Cure temperature', unit: '°C' },
  cureMinutes: { label: 'Cure duration', unit: 'min' },
};

export const MEASUREMENT_KEYS = Object.keys(MEASUREMENT_META) as MeasurementKey[];

export type RuleOutcome = 'pass' | 'fail' | 'not-evaluable';

export interface RuleResult {
  ruleId: string;
  label: string;
  outcome: RuleOutcome;
  /** The calculated comparison value (e.g. a difference). Null when not evaluable. */
  calculated: number | null;
  /** Human-readable description of the limit, e.g. "≥ 3.0 °C". */
  limitText: string;
  /** Explanation of how the result was produced. */
  detail: string;
  missing: MeasurementKey[];
}

/** A value is valid only if it is a finite number. */
export function isValidReading(v: unknown): v is number {
  return typeof v === 'number' && Number.isFinite(v);
}

/** Parses a free-text input into a reading. Empty input yields null (not recorded). */
export function parseReading(input: string): { value: number | null; error: string | null } {
  const trimmed = input.trim();
  if (trimmed === '') return { value: null, error: null };
  const n = Number(trimmed);
  if (!Number.isFinite(n)) return { value: null, error: 'Enter a number or leave blank if not recorded.' };
  return { value: n, error: null };
}

function round(n: number, dp = 1): number {
  const f = 10 ** dp;
  return Math.round(n * f) / f;
}

function fmt(n: number | undefined, unit: string): string {
  return n === undefined ? '—' : `${n} ${unit}`;
}

export function describeLimit(rule: SpecRule): string {
  switch (rule.comparator) {
    case 'min':
      return `≥ ${fmt(rule.min, rule.unit)}`;
    case 'max':
      return `≤ ${fmt(rule.max, rule.unit)}`;
    case 'range':
      return `${fmt(rule.min, rule.unit)} – ${fmt(rule.max, rule.unit)}`;
    case 'min-difference':
      return `difference ≥ ${fmt(rule.min, rule.unit)}`;
  }
}

/** Returns a list of configuration problems; an empty list means the rule is well-formed. */
export function validateRule(rule: SpecRule): string[] {
  const errors: string[] = [];
  if (!rule.label.trim()) errors.push('Rule label is required.');
  const needsMin = rule.comparator === 'min' || rule.comparator === 'range' || rule.comparator === 'min-difference';
  const needsMax = rule.comparator === 'max' || rule.comparator === 'range';
  if (needsMin && !isValidReading(rule.min)) errors.push('A numeric minimum is required.');
  if (needsMax && !isValidReading(rule.max)) errors.push('A numeric maximum is required.');
  if (rule.comparator === 'range' && isValidReading(rule.min) && isValidReading(rule.max) && rule.min > rule.max)
    errors.push('Minimum must not exceed maximum.');
  if (rule.comparator === 'min-difference') {
    if (!rule.subtract) errors.push('Select the measurement to subtract.');
    else if (rule.subtract === rule.measurement) errors.push('Choose two different measurements.');
  }
  return errors;
}

export function evaluateRule(rule: SpecRule, m: Measurements): RuleResult {
  const limitText = describeLimit(rule);
  const base = { ruleId: rule.id, label: rule.label, limitText };

  const configErrors = validateRule(rule);
  if (configErrors.length) {
    return { ...base, outcome: 'not-evaluable', calculated: null, detail: `Rule misconfigured: ${configErrors.join(' ')}`, missing: [] };
  }

  const required: MeasurementKey[] = rule.comparator === 'min-difference' && rule.subtract ? [rule.measurement, rule.subtract] : [rule.measurement];
  const missing = required.filter((k) => !isValidReading(m[k]));
  if (missing.length) {
    return { ...base, outcome: 'not-evaluable', calculated: null, detail: MISSING_MESSAGE, missing };
  }

  const a = m[rule.measurement] as number;

  if (rule.comparator === 'min-difference') {
    const b = m[rule.subtract!] as number;
    const diff = round(a - b, 2);
    const pass = diff >= rule.min!;
    return {
      ...base,
      outcome: pass ? 'pass' : 'fail',
      calculated: diff,
      detail: `${MEASUREMENT_META[rule.measurement].label} ${a} − ${MEASUREMENT_META[rule.subtract!].label} ${b} = ${diff} ${rule.unit}`,
      missing: [],
    };
  }

  let pass = true;
  if ((rule.comparator === 'min' || rule.comparator === 'range') && a < rule.min!) pass = false;
  if ((rule.comparator === 'max' || rule.comparator === 'range') && a > rule.max!) pass = false;
  return {
    ...base,
    outcome: pass ? 'pass' : 'fail',
    calculated: a,
    detail: `Recorded ${MEASUREMENT_META[rule.measurement].label.toLowerCase()} ${a} ${rule.unit} compared with limit ${limitText}`,
    missing: [],
  };
}

export interface SpecSummary {
  results: RuleResult[];
  pass: number;
  fail: number;
  notEvaluable: number;
}

export function evaluateSpecification(spec: Specification | undefined, m: Measurements): SpecSummary {
  const results = (spec?.rules ?? []).filter((r) => r.enabled).map((r) => evaluateRule(r, m));
  return {
    results,
    pass: results.filter((r) => r.outcome === 'pass').length,
    fail: results.filter((r) => r.outcome === 'fail').length,
    notEvaluable: results.filter((r) => r.outcome === 'not-evaluable').length,
  };
}

/** Lists which tracked measurements have not been recorded for a job. */
export function missingMeasurements(m: Measurements, keys: MeasurementKey[] = MEASUREMENT_KEYS): MeasurementKey[] {
  return keys.filter((k) => !isValidReading(m[k]));
}
