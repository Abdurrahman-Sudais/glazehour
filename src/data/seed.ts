// DEMONSTRATION DATA ONLY.
// "Halvard Street Finishing" is a fictional coating facility. All customers,
// jobs, people, readings and thresholds below are invented for the demo and
// do not represent real products, standards or recommendations.

import type { Defect, Investigation, Job, SimilarityGroup, Specification, TeamMember } from '../domain/types';

export const FACILITY = 'Halvard Street Finishing (fictional demo facility)';

export const TEAM: TeamMember[] = [
  { id: 'u-amara', name: 'Amara Okafor', role: 'Quality Lead', initials: 'AO' },
  { id: 'u-dlee', name: 'Daniel Lee', role: 'Process Engineer', initials: 'DL' },
  { id: 'u-ines', name: 'Inês Carvalho', role: 'Coatings Inspector', initials: 'IC' },
  { id: 'u-tomas', name: 'Tomasz Nowak', role: 'Line Supervisor', initials: 'TN' },
  { id: 'u-ruth', name: 'Ruth Mensah', role: 'Coatings Inspector', initials: 'RM' },
];

export const CURRENT_USER = TEAM[0];

export const SPECIFICATIONS: Specification[] = [
  {
    id: 'spec-ep200',
    name: 'EP-200 Two-Pack Epoxy Primer — Application Window',
    product: 'Demo product “EP-200” (fictional)',
    source: 'Illustrative values entered by the demo quality team',
    illustrative: true,
    rules: [
      { id: 'r-ep-dp', label: 'Substrate above dew point', comparator: 'min-difference', measurement: 'substrateTempC', subtract: 'dewPointC', min: 3, unit: '°C', enabled: true },
      { id: 'r-ep-rh', label: 'Relative humidity ceiling', comparator: 'max', measurement: 'relativeHumidityPct', max: 85, unit: '%', enabled: true },
      { id: 'r-ep-sub', label: 'Substrate temperature window', comparator: 'range', measurement: 'substrateTempC', min: 10, max: 35, unit: '°C', enabled: true },
      { id: 'r-ep-dft', label: 'Dry film thickness window', comparator: 'range', measurement: 'dftMicrons', min: 75, max: 125, unit: 'µm', enabled: true },
    ],
  },
  {
    id: 'spec-pc40',
    name: 'PC-40 Polyester Powder — Cure & Film',
    product: 'Demo product “PC-40” (fictional)',
    source: 'Illustrative values entered by the demo quality team',
    illustrative: true,
    rules: [
      { id: 'r-pc-cure', label: 'Metal cure temperature', comparator: 'range', measurement: 'cureTempC', min: 180, max: 200, unit: '°C', enabled: true },
      { id: 'r-pc-time', label: 'Minimum cure duration', comparator: 'min', measurement: 'cureMinutes', min: 10, unit: 'min', enabled: true },
      { id: 'r-pc-dft', label: 'Dry film thickness window', comparator: 'range', measurement: 'dftMicrons', min: 60, max: 90, unit: 'µm', enabled: true },
    ],
  },
  {
    id: 'spec-pu310',
    name: 'PU-310 Polyurethane Topcoat — Application',
    product: 'Demo product “PU-310” (fictional)',
    source: 'Illustrative values entered by the demo quality team',
    illustrative: true,
    rules: [
      { id: 'r-pu-dp', label: 'Substrate above dew point', comparator: 'min-difference', measurement: 'substrateTempC', subtract: 'dewPointC', min: 3, unit: '°C', enabled: true },
      { id: 'r-pu-rh', label: 'Relative humidity ceiling', comparator: 'max', measurement: 'relativeHumidityPct', max: 80, unit: '%', enabled: true },
      { id: 'r-pu-dft', label: 'Dry film thickness window', comparator: 'range', measurement: 'dftMicrons', min: 50, max: 80, unit: 'µm', enabled: true },
    ],
  },
];

export const JOBS: Job[] = [
  {
    id: 'J-24117', reference: 'PO 88310 · Conveyor frames', customer: 'Brightwater Conveyors (demo)', component: 'Conveyor side frame, 3.2 m',
    substrate: 'Hot-rolled steel, abrasive blasted', coatingSystem: 'EP-200 primer / PU-310 topcoat', specificationId: 'spec-ep200', line: 'Wet Line 2',
    applicationDate: '2026-09-29',
    measurements: { substrateTempC: 12.4, ambientTempC: 14.1, relativeHumidityPct: 82, dewPointC: 11.1, dftMicrons: 118, surfaceProfileMicrons: 62 },
    inspections: [
      { id: 'in-1', date: '2026-09-30', inspector: 'Inês Carvalho', method: 'Visual, 10× loupe', result: 'fail', notes: 'Clustered blisters on lower flange, 2–4 mm.' },
      { id: 'in-2', date: '2026-09-30', inspector: 'Inês Carvalho', method: 'DFT gauge, 10 readings', result: 'pass', notes: 'Mean 118 µm, range 104–131 µm.' },
    ],
    investigatorId: 'u-dlee', status: 'on-hold',
  },
  {
    id: 'J-24121', reference: 'INT-PRJ-061 · Pump skids', customer: 'Internal — Fabrication', component: 'Pump skid base plate',
    substrate: 'Hot-rolled steel, abrasive blasted', coatingSystem: 'EP-200 primer', specificationId: 'spec-ep200', line: 'Wet Line 1',
    applicationDate: '2026-10-02',
    measurements: { substrateTempC: 9.8, ambientTempC: 11.0, relativeHumidityPct: 88, dewPointC: null, dftMicrons: 96, surfaceProfileMicrons: null },
    inspections: [
      { id: 'in-3', date: '2026-10-03', inspector: 'Ruth Mensah', method: 'Visual', result: 'fail', notes: 'Blisters near weld seams on underside.' },
    ],
    investigatorId: null, status: 'inspection',
  },
  {
    id: 'J-24130', reference: 'PO 88402 · Racking uprights', customer: 'Kestrel Storage Systems (demo)', component: 'Pallet racking upright',
    substrate: 'Pre-galvanised steel, chromate-free pretreat', coatingSystem: 'PC-40 powder', specificationId: 'spec-pc40', line: 'Powder Line A',
    applicationDate: '2026-10-06',
    measurements: { ambientTempC: 21.5, relativeHumidityPct: 54, dftMicrons: 84, cureTempC: 186, cureMinutes: 12 },
    inspections: [
      { id: 'in-4', date: '2026-10-07', inspector: 'Inês Carvalho', method: 'Visual, raking light', result: 'fail', notes: 'Pinholes across face, approx. 6 per 100 cm².' },
      { id: 'in-5', date: '2026-10-07', inspector: 'Inês Carvalho', method: 'Cross-hatch adhesion', result: 'pass', notes: 'No detachment observed.' },
    ],
    investigatorId: 'u-amara', status: 'on-hold',
  },
  {
    id: 'J-24134', reference: 'PO 88419 · Enclosure panels', customer: 'Norrline Electrical (demo)', component: 'Control enclosure door',
    substrate: 'Cast aluminium', coatingSystem: 'PC-40 powder', specificationId: 'spec-pc40', line: 'Powder Line B',
    applicationDate: '2026-10-08',
    measurements: { ambientTempC: 22.0, relativeHumidityPct: 49, dftMicrons: 92, cureTempC: null, cureMinutes: 11 },
    inspections: [
      { id: 'in-6', date: '2026-10-09', inspector: 'Ruth Mensah', method: 'Visual, raking light', result: 'fail', notes: 'Pinholes concentrated near casting bosses.' },
    ],
    investigatorId: null, status: 'inspection',
  },
  {
    id: 'J-24140', reference: 'PO 88455 · Handrail sections', customer: 'Marlow Civic Works (demo)', component: 'Handrail section, 2.4 m',
    substrate: 'Hot-dip galvanised steel, sweep blasted', coatingSystem: 'EP-200 primer / PU-310 topcoat', specificationId: 'spec-pu310', line: 'Wet Line 2',
    applicationDate: '2026-10-11',
    measurements: { substrateTempC: 17.2, ambientTempC: 18.4, relativeHumidityPct: 63, dewPointC: 11.2, dftMicrons: 88, surfaceProfileMicrons: 38 },
    inspections: [
      { id: 'in-7', date: '2026-10-12', inspector: 'Inês Carvalho', method: 'Visual', result: 'fail', notes: 'Runs on vertical faces below brackets.' },
      { id: 'in-8', date: '2026-10-12', inspector: 'Inês Carvalho', method: 'DFT gauge, 12 readings', result: 'observation', notes: 'Upper section 72 µm, lower section 104 µm.' },
    ],
    investigatorId: 'u-tomas', status: 'in-progress',
  },
  {
    id: 'J-24146', reference: 'INT-PRJ-064 · Machine guards', customer: 'Internal — Assembly', component: 'Perforated machine guard',
    substrate: 'Cold-rolled steel, iron phosphate', coatingSystem: 'PU-310 topcoat (DTM)', specificationId: 'spec-pu310', line: 'Wet Line 1',
    applicationDate: '2026-10-14',
    measurements: { substrateTempC: 19.0, ambientTempC: 19.6, relativeHumidityPct: 58, dewPointC: 11.0, dftMicrons: 46, surfaceProfileMicrons: null },
    inspections: [
      { id: 'in-9', date: '2026-10-15', inspector: 'Ruth Mensah', method: 'Visual', result: 'fail', notes: 'Thin coverage at perforation edges and inner corners.' },
    ],
    investigatorId: null, status: 'inspection',
  },
  {
    id: 'J-24152', reference: 'PO 88501 · Trailer chassis', customer: 'Ostrander Trailers (demo)', component: 'Trailer cross member',
    substrate: 'Hot-rolled steel, abrasive blasted', coatingSystem: 'EP-200 primer / PU-310 topcoat', specificationId: 'spec-ep200', line: 'Wet Line 2',
    applicationDate: '2026-10-17',
    measurements: { substrateTempC: 15.5, ambientTempC: 16.2, relativeHumidityPct: 71, dewPointC: 10.9, dftMicrons: 104, surfaceProfileMicrons: 70 },
    inspections: [
      { id: 'in-10', date: '2026-10-18', inspector: 'Inês Carvalho', method: 'Visual, white cloth wipe', result: 'fail', notes: 'Craters and fisheyes on top flange; residue noted on wipe.' },
    ],
    investigatorId: 'u-amara', status: 'on-hold',
  },
  {
    id: 'J-24158', reference: 'PO 88533 · Bracket kits', customer: 'Brightwater Conveyors (demo)', component: 'Mounting bracket kit',
    substrate: 'Hot-rolled steel, abrasive blasted', coatingSystem: 'EP-200 primer', specificationId: 'spec-ep200', line: 'Wet Line 1',
    applicationDate: '2026-10-21',
    measurements: { substrateTempC: 11.0, ambientTempC: 12.5, relativeHumidityPct: 84, dewPointC: 9.9, dftMicrons: 102, surfaceProfileMicrons: 58 },
    inspections: [
      { id: 'in-11', date: '2026-10-22', inspector: 'Ruth Mensah', method: 'Visual, 10× loupe', result: 'fail', notes: 'Small blisters on inside radius of bends.' },
    ],
    investigatorId: null, status: 'inspection',
  },
  {
    id: 'J-24163', reference: 'PO 88560 · Signage posts', customer: 'Marlow Civic Works (demo)', component: 'Signage post, 3.0 m',
    substrate: 'Hot-dip galvanised steel, sweep blasted', coatingSystem: 'PC-40 powder', specificationId: 'spec-pc40', line: 'Powder Line A',
    applicationDate: '2026-10-23',
    measurements: { ambientTempC: 20.8, relativeHumidityPct: 51, dftMicrons: 79, cureTempC: 191, cureMinutes: 14 },
    inspections: [
      { id: 'in-12', date: '2026-10-24', inspector: 'Inês Carvalho', method: 'Visual, raking light', result: 'pass', notes: 'No defects observed on sampled posts.' },
    ],
    investigatorId: null, status: 'released',
  },
];

const p = (id: string, seed: number, caption: string, magnification = '1:1 macro') => ({ id, seed, caption, magnification });

export const DEFECTS: Defect[] = [
  { id: 'D-1042', jobId: 'J-24117', category: 'blistering', location: 'Lower flange, north face, 300 mm from end plate', severity: 'major', inspectionDate: '2026-09-30',
    operatorNotes: 'Parts moved in from yard at 06:40, sprayed from 07:15. Booth doors open for forklift during first coat. Blisters seen after overnight cure.',
    photos: [p('ph-1', 11, 'Blister cluster, lower flange'), p('ph-2', 12, 'Detail, raking light', '5× loupe')] },
  { id: 'D-1043', jobId: 'J-24121', category: 'blistering', location: 'Underside near longitudinal weld seam', severity: 'moderate', inspectionDate: '2026-10-03',
    operatorNotes: 'Cold morning, heaters on late. Dew point meter was out for calibration — not recorded.',
    photos: [p('ph-3', 13, 'Blisters along weld toe')] },
  { id: 'D-1049', jobId: 'J-24158', category: 'blistering', location: 'Inside radius of 90° bends', severity: 'minor', inspectionDate: '2026-10-22',
    operatorNotes: 'Small parts hung on rack 4. Sprayed early in shift. No issues on parts hung later.',
    photos: [p('ph-4', 14, 'Blistering on bend radius'), p('ph-5', 15, 'Comparison part, later rack', '1:1 macro')] },
  { id: 'D-1051', jobId: 'J-24130', category: 'pinholes', location: 'Front face, full length', severity: 'moderate', inspectionDate: '2026-10-07',
    operatorNotes: 'New pallet of substrate from different mill run. Oven profile not changed.',
    photos: [p('ph-6', 21, 'Pinholes across face, raking light')] },
  { id: 'D-1052', jobId: 'J-24134', category: 'pinholes', location: 'Around casting bosses and mounting lugs', severity: 'moderate', inspectionDate: '2026-10-09',
    operatorNotes: 'Castings not pre-baked this batch due to schedule. Oven data logger file missing for the run.',
    photos: [p('ph-7', 22, 'Pinholes near boss'), p('ph-8', 23, 'Cross-section, edge of boss', '20× microscope')] },
  { id: 'D-1055', jobId: 'J-24140', category: 'runs-sags', location: 'Vertical faces below bracket welds', severity: 'minor', inspectionDate: '2026-10-12',
    operatorNotes: 'New sprayer on second coat. Pump pressure was adjusted mid-batch.',
    photos: [p('ph-9', 31, 'Runs below bracket')] },
  { id: 'D-1058', jobId: 'J-24146', category: 'uneven-coverage', location: 'Perforation edges, inner corners', severity: 'moderate', inspectionDate: '2026-10-15',
    operatorNotes: 'Guards hung flat rather than vertical due to rack shortage.',
    photos: [p('ph-10', 41, 'Thin coverage at perforations'), p('ph-11', 42, 'Inner corner detail', '5× loupe')] },
  { id: 'D-1061', jobId: 'J-24152', category: 'surface-contamination', location: 'Top flange, centre third', severity: 'major', inspectionDate: '2026-10-18',
    operatorNotes: 'Overhead crane serviced the day before. Wipe test showed oily residue on top flange only.',
    photos: [p('ph-12', 51, 'Craters / fisheyes on flange')] },
  { id: 'D-1062', jobId: 'J-24117', category: 'surface-contamination', location: 'End plate, inside face', severity: 'minor', inspectionDate: '2026-09-30',
    operatorNotes: 'Isolated crater, possibly handling. Logged for completeness.',
    photos: [p('ph-13', 52, 'Isolated crater on end plate')] },
];

const t = (id: string, kind: Investigation['timeline'][number]['kind'], at: string, by: string, text: string) => ({ id, kind, at, by, text });

export const INVESTIGATIONS: Investigation[] = [
  {
    id: 'INV-301', defectId: 'D-1042', title: 'Recurring blistering on blasted steel, Wet Line 2', status: 'findings-added', investigatorId: 'u-dlee', openedAt: '2026-09-30',
    timeline: [
      t('t1', 'observation-recorded', '2026-09-30T09:12:00Z', 'Inês Carvalho', 'Blistering recorded on J-24117 lower flange.'),
      t('t2', 'evidence-reviewed', '2026-09-30T13:40:00Z', 'Amara Okafor', 'Reviewed photographs, DFT readings and environmental log.'),
      t('t3', 'investigation-assigned', '2026-10-01T08:05:00Z', 'Amara Okafor', 'Assigned to Daniel Lee.'),
      t('t4', 'finding-added', '2026-10-02T15:22:00Z', 'Daniel Lee', 'Confirmed finding: Booth doors were open for 25 min during first coat per shift log.'),
    ],
    findings: [{ id: 'f1', text: 'Booth doors were open for 25 min during first coat per shift log.', author: 'Daniel Lee', at: '2026-10-02T15:22:00Z', confirmed: true }],
    tasks: [
      { id: 'k1', title: 'Pull booth environmental logger data for 29 Sep', assigneeId: 'u-dlee', due: '2026-10-04', done: true },
      { id: 'k2', title: 'Retain blistered panel for lab cross-section', assigneeId: 'u-ines', due: '2026-10-06', done: false },
    ],
  },
  {
    id: 'INV-302', defectId: 'D-1051', title: 'Pinholing on racking uprights, Powder Line A', status: 'assigned', investigatorId: 'u-amara', openedAt: '2026-10-07',
    timeline: [
      t('t5', 'observation-recorded', '2026-10-07T10:30:00Z', 'Inês Carvalho', 'Pinholes recorded on J-24130.'),
      t('t6', 'investigation-assigned', '2026-10-07T14:00:00Z', 'Amara Okafor', 'Assigned to Amara Okafor.'),
    ],
    findings: [],
    tasks: [{ id: 'k3', title: 'Request mill certificate for new substrate batch', assigneeId: 'u-tomas', due: '2026-10-30', done: false }],
  },
  {
    id: 'INV-303', defectId: 'D-1061', title: 'Contamination craters on trailer cross members', status: 'evidence-review', investigatorId: null, openedAt: '2026-10-18',
    timeline: [
      t('t7', 'observation-recorded', '2026-10-18T11:15:00Z', 'Inês Carvalho', 'Craters and fisheyes recorded on J-24152.'),
      t('t8', 'evidence-reviewed', '2026-10-19T09:00:00Z', 'Amara Okafor', 'Wipe-test result and maintenance log attached.'),
    ],
    findings: [], tasks: [],
  },
  {
    id: 'INV-304', defectId: 'D-1055', title: 'Runs on handrail vertical faces', status: 'closed', investigatorId: 'u-tomas', openedAt: '2026-10-12',
    timeline: [
      t('t9', 'observation-recorded', '2026-10-12T08:40:00Z', 'Inês Carvalho', 'Runs recorded on J-24140.'),
      t('t10', 'evidence-reviewed', '2026-10-12T11:00:00Z', 'Tomasz Nowak', 'Reviewed DFT spread and sprayer change.'),
      t('t11', 'investigation-assigned', '2026-10-12T11:05:00Z', 'Tomasz Nowak', 'Assigned to Tomasz Nowak.'),
      t('t12', 'finding-added', '2026-10-13T16:10:00Z', 'Tomasz Nowak', 'Confirmed finding: Lower section DFT exceeded spec maximum; pump pressure change logged mid-batch.'),
      t('t13', 'investigation-closed', '2026-10-15T09:30:00Z', 'Amara Okafor', 'Investigation closed after rework and re-inspection.'),
    ],
    findings: [{ id: 'f2', text: 'Lower section DFT exceeded spec maximum; pump pressure change logged mid-batch.', author: 'Tomasz Nowak', at: '2026-10-13T16:10:00Z', confirmed: true }],
    tasks: [{ id: 'k4', title: 'Rework and re-inspect affected sections', assigneeId: 'u-tomas', due: '2026-10-14', done: true }],
  },
];

export const SIMILARITY_GROUPS: SimilarityGroup[] = [
  { id: 'G-A', label: 'Dome-shaped blisters, 1–4 mm, clustered', visualSimilarity: 0.87, defectIds: ['D-1042', 'D-1043', 'D-1049'],
    observedTraits: ['Rounded, intact blister domes', 'Clustered rather than scattered', 'Concentrated on lower or shaded surfaces'] },
  { id: 'G-B', label: 'Fine pinholes with raised rims', visualSimilarity: 0.81, defectIds: ['D-1051', 'D-1052'],
    observedTraits: ['Sub-millimetre craters', 'Even distribution across face', 'Some with raised rims under raking light'] },
  { id: 'G-C', label: 'Circular craters with clean centre', visualSimilarity: 0.74, defectIds: ['D-1061', 'D-1062'],
    observedTraits: ['Circular cratering', 'Film pulled back from centre', 'Isolated vs. widespread distribution differs'] },
];

export const CATEGORY_LABEL: Record<Defect['category'], string> = {
  blistering: 'Blistering',
  pinholes: 'Pinholes',
  'uneven-coverage': 'Uneven coverage',
  'runs-sags': 'Runs / sags',
  'surface-contamination': 'Surface contamination',
  'orange-peel': 'Orange peel',
  'adhesion-loss': 'Adhesion loss',
};
