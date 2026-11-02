import type { CSSProperties } from 'react';
import { ArrowRight, Check, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CtaBand, PageHero, Section } from '../components/marketing';
import { useSeo } from '../components/ui';
import { SITE } from '../data/site';

const d = (ms: number) => ({ '--d': `${ms}ms` }) as CSSProperties;

export const PIPELINE = [
  { step: '01', title: 'Capture', services: 'Amazon S3 · AWS AppSync', body: 'Inspectors attach photographs and readings from a phone or tablet at the line; data-logger exports (temperature, humidity, dew point, DFT) upload alongside.' },
  { step: '02', title: 'Store & link', services: 'Amazon RDS for PostgreSQL · Amazon S3', body: 'Each observation is linked to its job, line, substrate, coating system and specification. Photos are stored with their capture metadata.' },
  { step: '03', title: 'Check & group', services: 'AWS Lambda · Amazon Rekognition Custom Labels', body: 'Deterministic jobs compare recorded values with your own specification limits. A vision model may suggest visually similar observations — never a cause.' },
  { step: '04', title: 'Explain', services: 'Amazon Bedrock', body: 'Evidence summaries and the assistant are written from recorded measurements, rule results and the records a user may see. The model never supplies numbers or causes.' },
  { step: '05', title: 'Review & record', services: 'Amazon Cognito · Amazon SES', body: 'Investigators, inspectors and leads sign in with roles. Findings, tasks and the audit log live with the investigation; assignees get email notifications.' },
];

const SERVICES: [string, string][] = [
  ['Amazon S3', 'Stores defect photographs, data-logger exports and reports with encryption and lifecycle rules.'],
  ['AWS AppSync', 'Syncs inspection records from devices at the line, including when the network drops.'],
  ['Amazon RDS for PostgreSQL', 'Jobs, observations, specifications, investigations, findings and the append-only audit log.'],
  ['AWS Lambda', 'Specification checks, missing-evidence detection, report aggregation and CSV export.'],
  ['Amazon Rekognition Custom Labels', 'Optional similar-observation suggestions trained on your own labelled photos.'],
  ['Amazon Bedrock', 'Writes evidence summaries and assistant answers grounded in recorded data.'],
  ['Amazon Cognito', 'Sign-in, single sign-on and role groups for leads, engineers, inspectors and supervisors.'],
  ['Amazon SES', 'Assignment, task and review notifications by email.'],
  ['Amazon CloudWatch', 'Monitoring and alarms for failed jobs, uploads and sync health.'],
  ['AWS KMS', 'Customer-specific encryption keys for data at rest.'],
];

export const SAFEGUARDS: [string, string][] = [
  ['People confirm findings', 'A failed rule or a similar-looking photo is a reason to investigate, never a verdict. Only people record findings.'],
  ['No invented standards', 'Glazehour ships no universal thresholds. Every limit comes from your own product data sheets or specifications.'],
  ['Missing means missing', 'If a reading was not taken, the rule says “Unable to evaluate” — values are never estimated or filled in.'],
  ['Five kinds of information, labelled', 'Recorded measurement, specification limit, calculated comparison, AI suggestion and confirmed finding are always shown separately.'],
  ['Roles, enforced', 'Leads, engineers, inspectors and supervisors each get only the actions they need. The demo checks every action; production enforces it on the server.'],
  ['Everything audited', 'Measurements, assignments, rule edits, status changes, findings and tasks are written to an append-only audit log the quality lead can export.'],
];

const SECURITY: [string, string][] = [
  ['Encryption', 'TLS 1.2+ in transit; AWS KMS encryption at rest for databases and photo storage.'],
  ['Customer isolation', 'Every record carries a customer identifier filtered on every query; photos are stored per customer.'],
  ['Single sign-on', 'Sign in with your identity provider through Amazon Cognito, with multi-factor authentication for leads.'],
  ['Least privilege', 'Each service gets only the permissions it needs; no human uses root credentials.'],
  ['Data minimisation', 'Coating and inspection records only. No personal data is sent to AI models; summaries reference job and record IDs.'],
  ['Customer-owned specifications', 'Your specifications and thresholds stay yours and are never shared across customers.'],
];

export function Technology() {
  useSeo('Technology', 'How Glazehour proposes to use AWS: evidence capture at the line, linked records, deterministic specification checks, and Amazon Bedrock for grounded explanations.');
  return (
    <>
      <PageHero eyebrow="Technology" title="How we use Amazon Web Services" intro="A proposed architecture for moving from this browser demo to a production service: capture evidence where it happens, keep every number traceable, keep the checks deterministic, and use AI only to explain." />
      <Section title="From the coating line to a recorded finding" intro="Five stages. Rules and storage come first; AI suggests and explains; people decide." tone="white">
        <ol className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {PIPELINE.map((p, i) => (
            <li key={p.step} className="reveal lift spot rounded-lg border border-mist-200 bg-mist-50 p-5" style={d(i * 80)}>
              <span className="font-mono text-xs text-signal-600">{p.step}</span>
              <h3 className="mt-2 font-semibold">{p.title}</h3>
              <p className="mt-1 font-mono text-[11px] text-signal-600">{p.services}</p>
              <p className="mt-3 text-sm text-graphite-500">{p.body}</p>
            </li>
          ))}
        </ol>
        <div className="mt-8 flex gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          <Info size={16} className="mt-0.5 shrink-0" />
          <p><strong>Proposed, not deployed.</strong> None of these services are connected to this website or the demo workspace, which run entirely in your browser on fictional records.</p>
        </div>
      </Section>
      <Section title="What each service does">
        <dl className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map(([n, b], i) => (
            <div key={n} className="reveal rounded-lg border border-mist-200 bg-white p-5" style={d((i % 3) * 80)}>
              <dt className="font-semibold">{n}</dt>
              <dd className="mt-2 text-sm text-graphite-500">{b}</dd>
            </div>
          ))}
        </dl>
        <Link to="/security" className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-volt-600 hover:underline">Security and safeguards <ArrowRight size={15} /></Link>
      </Section>
      <CtaBand title="Turn recurring defects into structured investigations." text="Open the demonstration workspace with fictional records, or request early access for your facility." />
    </>
  );
}

export function Security() {
  useSeo('Security & safeguards', 'How Glazehour keeps people in charge: no invented standards, missing readings never estimated, role-based access, an audit log, and the proposed security design.');
  return (
    <>
      <PageHero eyebrow="Security & safeguards" title="Evidence informs the investigation. People decide." intro="The demo already enforces the review safeguards below. The security controls describe the proposed production design." />
      <Section title="Review safeguards" intro="Built into the demo you can try today." tone="white">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {SAFEGUARDS.map(([t, b], i) => (
            <div key={t} className="reveal lift spot rounded-lg border border-mist-200 bg-mist-50 p-6" style={d((i % 3) * 80)}>
              <Check size={18} className="text-signal-600" />
              <h3 className="mt-3 font-semibold">{t}</h3>
              <p className="mt-2 text-sm text-graphite-500">{b}</p>
            </div>
          ))}
        </div>
        <Link to="/investigations/audit" className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-volt-600 hover:underline">See roles and the audit log in the demo <ArrowRight size={15} /></Link>
      </Section>
      <Section title="Proposed security design" tone="dark">
        <dl className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {SECURITY.map(([t, b], i) => (
            <div key={t} className="reveal rounded-lg border border-ink-600 bg-ink-800 p-5" style={d((i % 3) * 80)}>
              <dt className="font-semibold text-white">{t}</dt>
              <dd className="mt-2 text-sm text-graphite-300">{b}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-6 max-w-3xl text-sm text-graphite-300">These controls are part of the proposed architecture and are not yet independently audited or certified.</p>
      </Section>
      <CtaBand title="Turn recurring defects into structured investigations." text="Open the demonstration workspace with fictional records, or request early access for your facility." />
    </>
  );
}

const PRIVACY: [string, string][] = [
  ['What this website is', 'This website describes Glazehour and includes an interactive demo workspace that runs entirely in your browser on fictional records. No instruments, data loggers or customer systems are connected.'],
  ['Demo data in your browser', 'Job measurements, investigations, rule edits, the chosen demo user and the demo audit log are saved in your browser’s local storage under the key glazehour-demo-v1. That data never leaves your device. “Reset demo data” in Settings, or clearing site data, removes it.'],
  ['Early-access requests', `Until a form service is configured, the early-access form saves your request in your browser (key glazehour-contact) and offers a pre-filled email to ${SITE.email}; nothing is sent until you send that email. If the operator connects the form to a customer-relationship service (proposed: HubSpot), submitting it sends the fields you enter, your consent choices and the page address to that service so Glazehour can reply. Product updates are sent only if you tick the optional box. This notice must be updated with the confirmed service and retention before that is switched on.`],
  ['Analytics and cookies', 'This website includes no analytics or advertising trackers and sets no cookies. A hosting provider may process routine request data to serve and protect the site.'],
  ['Your requests', `Contact ${SITE.email} with questions about information you have sent to Glazehour, or to ask for it to be corrected or deleted.`],
];

const TERMS: [string, string][] = [
  ['Demonstration only', 'The investigation workspace is a demonstration on fictional records. It is not a production quality system and must not be used to make decisions about real jobs.'],
  ['No diagnosis or acceptance', 'Glazehour organises evidence and compares recorded values with limits you supply. It does not name defect causes, prescribe corrective processes, supply coating standards, or accept work.'],
  ['Pricing and availability', 'Prices shown are illustrative and exclude taxes. Early-access requests do not create a subscription or any commitment.'],
  ['Use of the site', 'Use the site and demo lawfully. Do not enter confidential customer data or personal information into the demo or the request form.'],
  ['Changes', 'These terms are a review draft. Operator details, governing law and production service terms will be set out separately before launch.'],
];

export function Legal({ kind }: { kind: 'privacy' | 'terms' }) {
  const privacy = kind === 'privacy';
  useSeo(privacy ? 'Privacy notice' : 'Terms of use', privacy ? 'How the Glazehour website and demo workspace handle information.' : 'Terms for using the Glazehour website and demonstration workspace.');
  return (
    <>
      <PageHero eyebrow="Review draft · operator details to be confirmed" title={privacy ? 'Privacy notice' : 'Terms of use'} intro={privacy ? 'How this website and its demo workspace handle information.' : 'Terms for using this website and its demonstration workspace.'} />
      <Section title={privacy ? 'In short' : 'The terms'} tone="white">
        <div className="max-w-3xl space-y-8">
          {(privacy ? PRIVACY : TERMS).map(([t, b]) => (
            <div key={t} className="reveal">
              <h3 className="text-lg font-semibold">{t}</h3>
              <p className="mt-2 leading-relaxed text-graphite-500">{b}</p>
            </div>
          ))}
          <p className="text-sm text-graphite-500">Contact: <a href={`mailto:${SITE.email}`} className="text-volt-600 underline">{SITE.email}</a></p>
        </div>
      </Section>
    </>
  );
}
