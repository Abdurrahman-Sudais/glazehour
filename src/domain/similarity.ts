// Simulated "visually similar defects" assistant.
//
// In production this would call an image-embedding model. Here it is a
// deterministic stand-in: groups are pre-computed in seed data, and this
// module derives side-by-side comparisons and investigator questions from
// the records. It never states or implies a root cause.

import { MEASUREMENT_META, isValidReading } from './rules';
import type { Defect, Job, MeasurementKey, SimilarityGroup } from './types';

export const SIMILARITY_DISCLAIMER =
  'Visual similarity and statistical association do not prove a shared root cause. These groupings are prompts for investigation, not diagnoses.';

export const COMPARISON_KEYS: MeasurementKey[] = [
  'substrateTempC',
  'ambientTempC',
  'relativeHumidityPct',
  'dewPointC',
  'dftMicrons',
  'surfaceProfileMicrons',
];

export interface GroupMember {
  defect: Defect;
  job: Job | undefined;
  missing: MeasurementKey[];
}

export function buildGroupMembers(group: SimilarityGroup, defects: Defect[], jobs: Job[]): GroupMember[] {
  return group.defectIds
    .map((id) => defects.find((d) => d.id === id))
    .filter((d): d is Defect => Boolean(d))
    .map((defect) => {
      const job = jobs.find((j) => j.id === defect.jobId);
      const missing = COMPARISON_KEYS.filter((k) => !isValidReading(job?.measurements[k]));
      return { defect, job, missing };
    });
}

/**
 * Generates neutral, open questions from the evidence that is (or is not)
 * present. Questions are phrased to prompt checking, not to suggest a cause.
 */
export function investigatorQuestions(members: GroupMember[]): string[] {
  const qs: string[] = [];
  const jobs = members.map((m) => m.job).filter((j): j is Job => Boolean(j));

  const missingByKey = new Map<MeasurementKey, number>();
  members.forEach((m) => m.missing.forEach((k) => missingByKey.set(k, (missingByKey.get(k) ?? 0) + 1)));
  missingByKey.forEach((count, key) => {
    qs.push(`${MEASUREMENT_META[key].label} was not recorded for ${count} of ${members.length} records. Can it be recovered from line logs or instruments?`);
  });

  const lines = new Set(jobs.map((j) => j.line));
  if (lines.size > 1) qs.push(`Records come from ${lines.size} different lines (${[...lines].join(', ')}). What differs in equipment or handling between them?`);
  else if (lines.size === 1) qs.push(`All records come from ${[...lines][0]}. Were other lines running the same system during this period?`);

  const systems = new Set(jobs.map((j) => j.coatingSystem));
  if (systems.size > 1) qs.push('Different coating systems are involved. Do their product data sheets share any application constraints?');
  else if (systems.size === 1) qs.push('All jobs used the same coating system. Were the same material batches in use?');

  const substrates = new Set(jobs.map((j) => j.substrate));
  if (substrates.size > 1) qs.push('Substrates differ across records. Was surface preparation recorded consistently for each?');

  qs.push('Are there unaffected jobs with similar recorded conditions that could serve as a comparison?');
  qs.push('Do the operator notes describe timing, handling or environmental changes not captured in the measurements?');
  return qs;
}

/** Returns the numeric spread (max − min) of a measurement across members, or null if fewer than two readings. */
export function spread(members: GroupMember[], key: MeasurementKey): number | null {
  const vals = members.map((m) => m.job?.measurements[key]).filter(isValidReading);
  if (vals.length < 2) return null;
  return Math.round((Math.max(...vals) - Math.min(...vals)) * 10) / 10;
}
