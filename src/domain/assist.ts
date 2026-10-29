// Simulated AI-assisted suggestions. Deterministic, rule-derived prompts that
// stand in for a model. They point at evidence to review and never name a
// cause or prescribe a corrective process. The UI must label them as AI
// suggestions, separate from recorded data and human-confirmed findings.

import { MEASUREMENT_META, missingMeasurements } from './rules';
import type { SpecSummary } from './rules';
import type { Defect, Job, MeasurementKey } from './types';

export interface Suggestion {
  id: string;
  text: string;
  basis: string;
}

const RELEVANT: Record<Defect['category'], MeasurementKey[]> = {
  blistering: ['substrateTempC', 'dewPointC', 'relativeHumidityPct', 'dftMicrons', 'surfaceProfileMicrons'],
  pinholes: ['cureTempC', 'cureMinutes', 'dftMicrons', 'relativeHumidityPct'],
  'uneven-coverage': ['dftMicrons', 'surfaceProfileMicrons'],
  'runs-sags': ['dftMicrons', 'substrateTempC', 'ambientTempC'],
  'surface-contamination': ['surfaceProfileMicrons', 'relativeHumidityPct'],
  'orange-peel': ['dftMicrons', 'ambientTempC'],
  'adhesion-loss': ['surfaceProfileMicrons', 'substrateTempC', 'dewPointC'],
};

export function suggestionsFor(defect: Defect, job: Job | undefined, spec: SpecSummary, relatedCount: number): Suggestion[] {
  const out: Suggestion[] = [];
  if (!job) return out;

  const missing = missingMeasurements(job.measurements, RELEVANT[defect.category]);
  missing.forEach((k) =>
    out.push({ id: `s-miss-${k}`, text: `Consider locating a ${MEASUREMENT_META[k].label.replace(/ \(.*\)$/, '').toLowerCase()} reading for this job.`, basis: 'Measurement not recorded on the job.' }),
  );

  spec.results
    .filter((r) => r.outcome === 'fail')
    .forEach((r) => out.push({ id: `s-fail-${r.ruleId}`, text: `Review the recorded value for “${r.label}” — it falls outside the supplied limit.`, basis: 'Calculated comparison against the configured specification.' }));

  if (relatedCount > 0)
    out.push({ id: 's-related', text: `Compare with ${relatedCount} visually similar observation${relatedCount > 1 ? 's' : ''} from other jobs.`, basis: 'Simulated image-similarity grouping.' });

  if (defect.photos.length < 2)
    out.push({ id: 's-photo', text: 'Add a second photograph under raking light or magnification for comparison.', basis: 'Only one photograph is attached.' });

  return out;
}
