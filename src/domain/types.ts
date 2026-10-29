// Core domain types for Glazehour. These are framework-agnostic and are
// consumed by the rules engine, the store and the React presentation layer.

export type JobStatus = 'scheduled' | 'in-progress' | 'inspection' | 'on-hold' | 'released';

export type InvestigationStatus = 'open' | 'evidence-review' | 'assigned' | 'findings-added' | 'closed';

export type DefectCategory =
  | 'blistering'
  | 'pinholes'
  | 'uneven-coverage'
  | 'runs-sags'
  | 'surface-contamination'
  | 'orange-peel'
  | 'adhesion-loss';

export type MeasurementKey =
  | 'substrateTempC'
  | 'ambientTempC'
  | 'relativeHumidityPct'
  | 'dewPointC'
  | 'dftMicrons'
  | 'surfaceProfileMicrons'
  | 'cureTempC'
  | 'cureMinutes';

/** A recorded measurement is a reading somebody actually took. `null` means not recorded. */
export type Measurements = Partial<Record<MeasurementKey, number | null>>;

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  initials: string;
}

export interface InspectionRecord {
  id: string;
  date: string;
  inspector: string;
  method: string;
  result: 'pass' | 'fail' | 'observation';
  notes: string;
}

export interface Job {
  id: string;
  reference: string;
  customer: string;
  component: string;
  substrate: string;
  coatingSystem: string;
  specificationId: string;
  line: string;
  applicationDate: string;
  measurements: Measurements;
  inspections: InspectionRecord[];
  investigatorId: string | null;
  status: JobStatus;
}

export interface DefectPhoto {
  id: string;
  /** Seed used by the procedural demonstration image renderer. */
  seed: number;
  caption: string;
  magnification: string;
}

export interface Defect {
  id: string;
  jobId: string;
  category: DefectCategory;
  location: string;
  operatorNotes: string;
  inspectionDate: string;
  photos: DefectPhoto[];
  severity: 'minor' | 'moderate' | 'major';
}

export type Comparator = 'min' | 'max' | 'range' | 'min-difference';

/** A user-configured requirement. Thresholds in demo data are illustrative only. */
export interface SpecRule {
  id: string;
  label: string;
  comparator: Comparator;
  /** Primary measurement. */
  measurement: MeasurementKey;
  /** Secondary measurement, required for `min-difference` (measurement − subtract). */
  subtract?: MeasurementKey;
  min?: number;
  max?: number;
  unit: string;
  enabled: boolean;
}

export interface Specification {
  id: string;
  name: string;
  product: string;
  source: string;
  illustrative: boolean;
  rules: SpecRule[];
}

export type TimelineKind =
  | 'observation-recorded'
  | 'evidence-reviewed'
  | 'investigation-assigned'
  | 'finding-added'
  | 'task-added'
  | 'task-completed'
  | 'status-changed'
  | 'investigation-closed';

export interface TimelineEvent {
  id: string;
  kind: TimelineKind;
  at: string;
  by: string;
  text: string;
}

export interface Finding {
  id: string;
  text: string;
  author: string;
  at: string;
  /** Findings are only ever human-confirmed; AI suggestions are kept separately. */
  confirmed: true;
}

export interface InvestigationTask {
  id: string;
  title: string;
  assigneeId: string;
  due: string;
  done: boolean;
}

export interface Investigation {
  id: string;
  defectId: string;
  title: string;
  status: InvestigationStatus;
  investigatorId: string | null;
  openedAt: string;
  timeline: TimelineEvent[];
  findings: Finding[];
  tasks: InvestigationTask[];
}

export interface SimilarityGroup {
  id: string;
  label: string;
  /** Simulated model confidence that the photos look alike; says nothing about cause. */
  visualSimilarity: number;
  defectIds: string[];
  observedTraits: string[];
}
