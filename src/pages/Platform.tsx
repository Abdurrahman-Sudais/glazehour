import {
  AlertTriangle, ArrowRight, Bot, Calculator, CircleCheck, ClipboardList, FileBarChart, FolderKanban, Gauge, Images, Layers, ListChecks, Ruler, Search, ShieldCheck, Users,
} from 'lucide-react';
import { CtaBand, FeatureCard, PageHero, STEPS, Section } from '../components/marketing';
import { DefectImage, Scene } from '../components/Imagery';
import { ButtonLink, KindLegend, KindTag, useSeo } from '../components/ui';
import { DEFECTS, CATEGORY_LABEL } from '../data/seed';
import { MILESTONES } from '../domain/investigation';
import { SIMILARITY_DISCLAIMER } from '../domain/similarity';

export function Product() {
  useSeo('Product', 'The Glazehour platform: job records, defect library, investigations, specification checks, reports and team workflows for industrial coating quality.');
  return (
    <>
      <PageHero eyebrow="Product" title="A single record for every coating defect and the process behind it." intro="Glazehour is a structured workspace for quality teams: jobs, defect photographs, process measurements, specifications and investigations, all linked.">
        <ButtonLink to="/investigations">Open the demo workspace <ArrowRight size={16} /></ButtonLink>
      </PageHero>
      <Section title="Modules" eyebrow="Platform" tone="white">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          <FeatureCard icon={<FolderKanban size={18} />} title="Jobs">Job ID, customer or project reference, substrate, coating system, line, application date, measurements and inspection records.</FeatureCard>
          <FeatureCard icon={<Images size={18} />} title="Defect library">Every observation with photographs, location on the component, operator notes and status. Searchable and filterable by category, line and job.</FeatureCard>
          <FeatureCard icon={<ClipboardList size={18} />} title="Investigations">Timeline, assignments, tasks and human-confirmed findings, from first observation to closure.</FeatureCard>
          <FeatureCard icon={<Ruler size={18} />} title="Specifications">Enter your own limits from product data sheets or internal process specs. Rules are deterministic and auditable.</FeatureCard>
          <FeatureCard icon={<FileBarChart size={18} />} title="Reports">Summaries of open investigations, evaluation coverage and missing evidence by line and category.</FeatureCard>
          <FeatureCard icon={<Users size={18} />} title="Team">Inspectors, engineers and supervisors with clear ownership of tasks and findings.</FeatureCard>
        </div>
      </Section>
      <Section title="Five kinds of information, never blurred together" eyebrow="Clarity by design" intro="Every value in Glazehour is labelled by where it came from, so nobody mistakes a suggestion for a measurement or a calculation for a finding.">
        <KindLegend />
        <div className="mt-8 grid gap-4 md:grid-cols-5">
          {[
            { i: <Gauge size={16} />, t: 'Recorded', d: 'A reading someone actually took. Missing readings stay missing.' },
            { i: <Ruler size={16} />, t: 'Limit', d: 'A threshold your team supplied from its own specification.' },
            { i: <Calculator size={16} />, t: 'Calculated', d: 'A deterministic comparison of recorded values against limits.' },
            { i: <Bot size={16} />, t: 'AI suggestion', d: 'A prompt to look at something. Never a diagnosis.' },
            { i: <CircleCheck size={16} />, t: 'Confirmed', d: 'A finding a named person has written and stands behind.' },
          ].map((c) => (
            <div key={c.t} className="rounded-lg border border-mist-200 bg-white p-4">
              <div className="text-signal-600">{c.i}</div>
              <p className="mt-2 text-sm font-semibold">{c.t}</p>
              <p className="mt-1 text-xs leading-relaxed text-graphite-500">{c.d}</p>
            </div>
          ))}
        </div>
      </Section>
      <CtaBand title="See the product with demonstration records." text="The workspace runs entirely in your browser using fictional data." />
    </>
  );
}

export function DefectInvestigation() {
  useSeo('Defect Investigation', 'Open a coating defect and see the job, photographs, substrate and ambient temperature, humidity, dew point, specification, operator notes and related observations together.');
  const sample = DEFECTS.slice(0, 6);
  return (
    <>
      <PageHero eyebrow="Defect investigation" title="Open a defect. See everything that was recorded around it." intro="Photographs, job conditions, product specification, operator notes and previous related observations — on one screen, with the gaps marked." />
      <Section title="What an investigator sees" tone="white">
        <div className="grid gap-8 lg:grid-cols-2">
          <ul className="space-y-3 text-sm">
            {[
              'The associated job, substrate and coating system',
              'All available photographs, with location on the component',
              'Recorded substrate temperature, ambient temperature and relative humidity',
              'The supplied dew-point reading, if one was taken',
              'The product specification the job was applied against',
              'Operator notes from the shift',
              'Previous related observations from other jobs',
            ].map((t) => (
              <li key={t} className="flex items-start gap-3 rounded-md border border-mist-200 bg-mist-50 px-4 py-3">
                <CircleCheck size={16} className="mt-0.5 shrink-0 text-signal-600" /> {t}
              </li>
            ))}
            <li className="flex items-start gap-3 rounded-md border border-amber-300 bg-amber-50 px-4 py-3 text-amber-900">
              <AlertTriangle size={16} className="mt-0.5 shrink-0" /> Missing evidence is shown explicitly, so it can be chased rather than assumed.
            </li>
          </ul>
          <div className="grid grid-cols-3 gap-2 self-start">
            {sample.map((d) => (
              <figure key={d.id} className="overflow-hidden rounded-md border border-mist-200">
                <DefectImage category={d.category} seed={d.photos[0].seed} alt={`Demonstration image: ${CATEGORY_LABEL[d.category]}`} className="aspect-square" showBadge={false} />
                <figcaption className="bg-white px-2 py-1.5 text-[11px]">
                  <span className="font-mono text-signal-600">{d.id}</span> · {CATEGORY_LABEL[d.category]}
                </figcaption>
              </figure>
            ))}
            <p className="col-span-3 text-[11px] text-graphite-500">Procedurally generated demonstration images, not photographs of real parts.</p>
          </div>
        </div>
      </Section>
      <Section title="The investigation timeline" eyebrow="Traceable" intro="Every investigation moves through the same milestones. Each step is attributed and time-stamped.">
        <ol className="grid gap-3 md:grid-cols-5">
          {MILESTONES.map((m, i) => (
            <li key={m.status} className="rounded-lg border border-mist-200 bg-white p-4">
              <span className="font-mono text-xs text-signal-600">0{i + 1}</span>
              <p className="mt-2 text-sm font-semibold">{m.label}</p>
            </li>
          ))}
        </ol>
      </Section>
      <Section title="Related cases, with a clear boundary" eyebrow="AI-assisted (simulated in demo)" tone="white">
        <div className="flex items-start gap-3 rounded-lg border border-mist-200 bg-mist-50 p-5 text-sm text-graphite-500">
          <ShieldCheck className="mt-0.5 shrink-0 text-ink-700" size={18} />
          <div>
            <KindTag kind="ai" />
            <p className="mt-2">{SIMILARITY_DISCLAIMER} Glazehour does not diagnose defects or prescribe corrective processes; it helps investigators ask better questions.</p>
          </div>
        </div>
      </Section>
      <CtaBand title="Open a demonstration defect." text="Try adding a finding, assigning a task or changing a specification limit." />
    </>
  );
}

export function QualityWorkflows() {
  useSeo('Quality Workflows', 'Quality holds, investigation assignment, task tracking, specification checks and reporting workflows for coating operations.');
  return (
    <>
      <PageHero eyebrow="Quality workflows" title="Structure for the work that happens after a defect is found." intro="Assign ownership, track tasks, hold or release jobs and close investigations only when a confirmed finding is on record." />
      <Section title="Workflows teams run in Glazehour" tone="white">
        <div className="grid gap-5 md:grid-cols-2">
          <FeatureCard icon={<ListChecks size={18} />} title="Investigation assignment">Assign an investigator from the team, set tasks with due dates and see what is overdue.</FeatureCard>
          <FeatureCard icon={<Layers size={18} />} title="Quality hold and release">Put a job on quality hold while an investigation is open, then release it with the evidence attached.</FeatureCard>
          <FeatureCard icon={<Ruler size={18} />} title="Specification review">Configure rules per product. Re-run checks instantly when a missing reading is recovered.</FeatureCard>
          <FeatureCard icon={<Search size={18} />} title="Recurring-issue review">Filter the defect library by category, line and period to prepare for a weekly quality meeting.</FeatureCard>
        </div>
      </Section>
      <Section title="Closure rules that keep records honest" intro="An investigation cannot close without at least one human-confirmed finding and with tasks still open. Status changes are recorded on the timeline.">
        <div className="grid gap-6 md:grid-cols-2">
          <Scene kind="gauge" alt="Illustration: thickness gauge reading on a coated panel" className="aspect-[16/10] rounded-lg" />
          <Scene kind="line" alt="Illustration: coated parts hanging on a finishing line" className="aspect-[16/10] rounded-lg" />
        </div>
      </Section>
      <CtaBand title="Turn recurring defects into structured investigations." text="Try the workflow with demonstration records." />
    </>
  );
}

export function HowItWorks() {
  useSeo('How It Works', 'Record the affected job, add photographs and measurements, review related cases and specification checks, then assign tasks and record findings.');
  return (
    <>
      <PageHero eyebrow="How it works" title="From a defect on the line to a documented finding." intro="Four steps, the same every time, so investigations are comparable across shifts, lines and sites." />
      <Section title="The workflow" tone="white">
        <ol className="space-y-4">
          {STEPS.map((s, i) => (
            <li key={s.n} className="grid gap-6 rounded-lg border border-mist-200 bg-white p-6 md:grid-cols-[80px_1fr_320px] md:items-center">
              <span className="font-mono text-3xl text-signal-600">{s.n}</span>
              <div>
                <h3 className="text-lg font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-graphite-500">{s.text}</p>
              </div>
              <Scene kind={(['facility', 'panel', 'gauge', 'line'] as const)[i]} alt={`Illustration for step ${s.n}`} className="aspect-[16/9] rounded-md" />
            </li>
          ))}
        </ol>
      </Section>
      <Section title="What stays simulated in the demo" intro="The workspace demonstrates the workflow with mock data and runs in your browser. Image similarity is a deterministic stand-in for a vision model, and there are no live integrations with gauges, data loggers or ERP systems.">
        <ButtonLink to="/investigations">Try it now <ArrowRight size={16} /></ButtonLink>
      </Section>
    </>
  );
}
