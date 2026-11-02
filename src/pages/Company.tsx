import type { CSSProperties } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Check, Mail, MapPin } from 'lucide-react';
import { LeadForm } from '../components/LeadForm';
import { FOUNDERS, SITE } from '../data/site';
import { FoundersGrid, RoadmapSection } from './HomeSections';
import { CtaBand, PageHero, Section } from '../components/marketing';
import { Scene } from '../components/Imagery';
import { ButtonLink, cx, useSeo } from '../components/ui';

export const PLANS = [
  {
    name: 'Inspector', price: '$79', per: '/month', blurb: 'For smaller inspection teams.',
    features: ['Up to 3 users', 'Jobs and defect library', 'Photograph attachments', 'Specification checks (up to 5 specs)', 'Investigation timeline and findings'],
    cta: 'Start with Inspector',
  },
  {
    name: 'Quality Team', price: '$249', per: '/month', blurb: 'For facilities coordinating multiple jobs and investigations.', featured: true,
    features: ['Up to 15 users', 'Everything in Inspector', 'Unlimited specifications', 'Task assignment and quality holds', 'Similar-case grouping (AI-assisted)', 'Reports and CSV export'],
    cta: 'Choose Quality Team',
  },
  {
    name: 'Enterprise', price: 'Custom', per: '', blurb: 'For multi-facility quality operations.',
    features: ['Unlimited users and facilities', 'Everything in Quality Team', 'SSO and role-based permissions', 'Integration planning for data loggers and ERP', 'Dedicated onboarding'],
    cta: 'Contact sales',
  },
];

export function Pricing() {
  useSeo('Pricing', 'Glazehour plans: Inspector $79/month, Quality Team $249/month, and Enterprise custom pricing for multi-facility quality operations.');
  return (
    <>
      <PageHero eyebrow="Pricing" title="Plans for inspection teams through multi-facility operations." intro="Illustrative pricing. All plans include the core investigation workflow; larger plans add coordination and scale." />
      <section className="bg-mist-50">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-20 sm:px-6 md:grid-cols-3">
          {PLANS.map((p) => (
            <article key={p.name} className={cx('flex flex-col rounded-xl border bg-white p-7', p.featured ? 'border-signal-500 ring-1 ring-signal-500' : 'border-mist-200')}>
              {p.featured && <p className="eyebrow mb-3 text-signal-600">Most teams start here</p>}
              <h2 className="text-lg font-semibold">{p.name}</h2>
              <p className="mt-1 text-sm text-graphite-500">{p.blurb}</p>
              <p className="mt-6">
                <span className="text-4xl font-semibold tracking-tight">{p.price}</span>
                <span className="text-sm text-graphite-500">{p.per}</span>
              </p>
              <ul className="mt-6 flex-1 space-y-2.5 text-sm">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <Check size={15} className="mt-0.5 shrink-0 text-signal-600" /> {f}
                  </li>
                ))}
              </ul>
              <ButtonLink to="/contact" variant={p.featured ? 'primary' : 'secondary'} className="mt-8 w-full">
                {p.cta}
              </ButtonLink>
            </article>
          ))}
        </div>
        <p className="mx-auto max-w-7xl px-4 pb-16 text-xs text-graphite-500 sm:px-6">Prices in USD, billed monthly, excluding taxes. Illustrative pricing for this website; final terms are agreed in writing.</p>
      </section>
    </>
  );
}

export function About() {
  useSeo('About & team', `Glazehour was founded by ${FOUNDERS.map((f) => f.name).join(' and ')} to help coating teams connect defects with the process evidence behind them.`);
  return (
    <>
      <PageHero eyebrow="About Glazehour" title="Built for the people who have to explain the defect." intro="Glazehour exists because coating investigations too often depend on memory, scattered photos and paper logs." />
      <Section id="team" eyebrow="Founding team" title="The people behind Glazehour" tone="dark">
        <FoundersGrid />
      </Section>
      <Section eyebrow="Our story" title="Why we started" tone="white">
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="reveal space-y-4 text-graphite-500">
            <p>Glazehour started after seeing how much time quality teams spend reconstructing what happened to a job — which batch, which booth, what the humidity was, who sprayed it — before they can even begin an investigation.</p>
            <p>Our view is simple: software should keep the evidence together and be honest about what is missing. It should help experienced people investigate, not pretend to replace them. That is why Glazehour separates recorded measurements, user-supplied limits, calculated comparisons, AI suggestions and human-confirmed findings everywhere they appear.</p>
            <p>We work with coating contractors, metal finishers and in-house manufacturing quality teams.</p>
            <blockquote className="mt-6 rounded-xl border border-mist-200 bg-mist-50 p-6">
              <p className="eyebrow text-signal-600">Our mission</p>
              <p className="mt-2 text-xl font-semibold text-ink-900">Connect every coating defect to the evidence behind it.</p>
            </blockquote>
          </div>
          <Scene kind="facility" alt="Illustration: industrial finishing facility" className="reveal aspect-[4/3] rounded-lg" />
        </div>
      </Section>
      <Section eyebrow="Principles" title="What we will and won’t do">
        <div className="grid gap-5 md:grid-cols-3">
          {[
            ['Evidence first', 'Every conclusion should be traceable to a photo, a reading or a record.'],
            ['No invented standards', 'We never ship universal thresholds. Your team supplies its own specifications.'],
            ['People confirm findings', 'AI may suggest where to look. Only people record findings.'],
          ].map(([t, d], i) => (
            <div key={t} className="reveal lift spot rounded-lg border border-mist-200 bg-white p-6" style={{ '--d': `${i * 90}ms` } as CSSProperties}>
              <span className="font-mono text-xs text-signal-600">0{i + 1}</span>
              <h3 className="mt-2 font-semibold">{t}</h3>
              <p className="mt-2 text-sm text-graphite-500">{d}</p>
            </div>
          ))}
        </div>
      </Section>
      <RoadmapSection />
      <CtaBand title="Turn recurring defects into structured investigations." text="Request early access, or open the demonstration workspace with fictional records." />
    </>
  );
}

export function Contact() {
  useSeo('Request early access', `Request early access to Glazehour for coating-defect investigation and quality management. Email ${SITE.email}.`);
  const [params] = useSearchParams();
  return (
    <>
      <PageHero eyebrow="Early access" title="Talk to us about your coating operation." intro="Tell us about your lines, your inspection process and the defects you see most often. A founder will reply to arrange a walkthrough." />
      <section className="bg-mist-50">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_1.4fr]">
          <aside className="space-y-6">
            <div className="reveal rounded-lg border border-mist-200 bg-white p-6">
              <p className="eyebrow text-graphite-400">Founders</p>
              <ul className="mt-3 space-y-3">
                {FOUNDERS.map((f) => (
                  <li key={f.name} className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-ink-900 font-mono text-xs text-signal-400">{f.initials}</span>
                    <span><span className="block font-semibold">{f.name}</span><span className="block text-xs text-graphite-500">{f.role}</span></span>
                  </li>
                ))}
              </ul>
              <a href={`mailto:${SITE.email}`} className="mt-4 flex items-center gap-2 border-t border-mist-100 pt-4 text-sm text-volt-600 hover:underline"><Mail size={15} /> {SITE.email}</a>
              <p className="mt-2 flex items-center gap-2 text-sm text-graphite-500"><MapPin size={15} /> {SITE.domain}</p>
            </div>
            <p className="reveal text-sm text-graphite-500">We usually reply within two working days. For a quick look first, open the demo workspace — it runs in your browser with fictional data.</p>
          </aside>
          <div className="reveal rounded-lg border border-mist-200 bg-white p-6 md:p-8">
            <LeadForm initialPlan={params.get('plan') ?? ''} />
          </div>
        </div>
      </section>
    </>
  );
}

export function NotFound() {
  useSeo('Page not found', 'The page you were looking for does not exist.');
  return (
    <PageHero eyebrow="404" title="This page isn’t on record." intro="The link may be out of date.">
      <ButtonLink to="/">Back to home</ButtonLink>
    </PageHero>
  );
}
