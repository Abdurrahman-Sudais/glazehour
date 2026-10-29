import { useState } from 'react';
import type { FormEvent } from 'react';
import { Check, Mail, MapPin } from 'lucide-react';
import { CtaBand, PageHero, Section } from '../components/marketing';
import { Scene } from '../components/Imagery';
import { Button, ButtonLink, Field, cx, inputCls, useSeo } from '../components/ui';
import { EMPTY_CONTACT, validateContact } from '../domain/contact';
import type { ContactForm } from '../domain/contact';

const PLANS = [
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
  useSeo('About', 'Glazehour was founded by Safiya Abdullahi to help coating teams connect defects with the process evidence behind them.');
  return (
    <>
      <PageHero eyebrow="About" title="Built for the people who have to explain the defect." intro="Glazehour exists because coating investigations too often depend on memory, scattered photos and paper logs." />
      <Section title="Why we started" tone="white">
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="space-y-4 text-graphite-500">
            <p>
              Founder <strong className="text-ink-900">Safiya Abdullahi</strong> started Glazehour after seeing how much time quality teams spend reconstructing what happened to a job — which batch, which booth, what the humidity was, who sprayed it — before they can even begin an investigation.
            </p>
            <p>
              Our view is simple: software should keep the evidence together and be honest about what is missing. It should help experienced people investigate, not pretend to replace them. That is why Glazehour separates recorded measurements, user-supplied limits, calculated comparisons, AI suggestions and human-confirmed findings everywhere they appear.
            </p>
            <p>We work with coating contractors, metal finishers and in-house manufacturing quality teams.</p>
          </div>
          <Scene kind="facility" alt="Illustration: industrial finishing facility" className="aspect-[4/3] rounded-lg" />
        </div>
      </Section>
      <Section title="Principles">
        <div className="grid gap-5 md:grid-cols-3">
          {[
            ['Evidence first', 'Every conclusion should be traceable to a photo, a reading or a record.'],
            ['No invented standards', 'We never ship universal thresholds. Your team supplies its own specifications.'],
            ['People confirm findings', 'AI may suggest where to look. Only people record findings.'],
          ].map(([t, d]) => (
            <div key={t} className="rounded-lg border border-mist-200 bg-white p-6">
              <h3 className="font-semibold">{t}</h3>
              <p className="mt-2 text-sm text-graphite-500">{d}</p>
            </div>
          ))}
        </div>
      </Section>
      <CtaBand title="Turn recurring defects into structured investigations." text="Talk to Safiya about your facility." />
    </>
  );
}

export function Contact() {
  useSeo('Contact', 'Contact Glazehour about coating-defect investigation and quality management for your facility. Email safiya@glazehour.space.');
  const [form, setForm] = useState<ContactForm>(EMPTY_CONTACT);
  const [errors, setErrors] = useState<Partial<Record<keyof ContactForm, string>>>({});
  const [sent, setSent] = useState(false);

  const set = (k: keyof ContactForm) => (e: { target: { value: string } }) => setForm((f) => ({ ...f, [k]: e.target.value }));

  function submit(e: FormEvent) {
    e.preventDefault();
    const errs = validateContact(form);
    setErrors(errs);
    if (Object.keys(errs).length) {
      document.getElementById(`c-${Object.keys(errs)[0]}`)?.focus();
      return;
    }
    // Simulated: no backend. Saved locally so the demo can show a confirmation.
    try {
      const prev = JSON.parse(localStorage.getItem('glazehour-contact') ?? '[]');
      localStorage.setItem('glazehour-contact', JSON.stringify([...prev, { ...form, at: new Date().toISOString() }]));
    } catch {
      /* ignore */
    }
    setSent(true);
  }

  const err = (k: keyof ContactForm) => ({ 'aria-invalid': Boolean(errors[k]), 'aria-describedby': errors[k] ? `c-${k}-error` : undefined });

  return (
    <>
      <PageHero eyebrow="Contact" title="Talk to us about your coating operation." intro="Tell us about your lines, your inspection process and the defects you see most often." />
      <section className="bg-mist-50">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_1.4fr]">
          <aside className="space-y-6">
            <div className="rounded-lg border border-mist-200 bg-white p-6">
              <p className="eyebrow text-graphite-400">Founder</p>
              <p className="mt-2 font-semibold">Safiya Abdullahi</p>
              <a href="mailto:safiya@glazehour.space" className="mt-3 flex items-center gap-2 text-sm text-volt-600 hover:underline">
                <Mail size={15} /> safiya@glazehour.space
              </a>
              <p className="mt-2 flex items-center gap-2 text-sm text-graphite-500">
                <MapPin size={15} /> glazehour.space
              </p>
            </div>
            <p className="text-sm text-graphite-500">We usually reply within two working days. For a quick look first, open the demo workspace — it runs in your browser with fictional data.</p>
          </aside>
          <div className="rounded-lg border border-mist-200 bg-white p-6 md:p-8">
            {sent ? (
              <div role="status" className="py-10 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-teal-50 text-signal-600"><Check /></div>
                <h2 className="mt-4 text-xl font-semibold">Thanks, {form.name.split(' ')[0]}.</h2>
                <p className="mt-2 text-sm text-graphite-500">Your message has been recorded in this browser. In this demo site no email is sent — please also write to safiya@glazehour.space.</p>
                <Button variant="secondary" className="mt-6" onClick={() => { setForm(EMPTY_CONTACT); setSent(false); }}>Send another message</Button>
              </div>
            ) : (
              <form noValidate onSubmit={submit} className="grid gap-5 md:grid-cols-2" aria-label="Contact form">
                <Field label="Name *" htmlFor="c-name" error={errors.name}>
                  <input id="c-name" className={inputCls} value={form.name} onChange={set('name')} autoComplete="name" {...err('name')} />
                </Field>
                <Field label="Work email *" htmlFor="c-email" error={errors.email}>
                  <input id="c-email" type="email" className={inputCls} value={form.email} onChange={set('email')} autoComplete="email" {...err('email')} />
                </Field>
                <Field label="Company or facility *" htmlFor="c-company" error={errors.company}>
                  <input id="c-company" className={inputCls} value={form.company} onChange={set('company')} autoComplete="organization" {...err('company')} />
                </Field>
                <Field label="Role" htmlFor="c-role">
                  <input id="c-role" className={inputCls} value={form.role} onChange={set('role')} placeholder="e.g. Quality manager" />
                </Field>
                <Field label="Quality team size *" htmlFor="c-teamSize" error={errors.teamSize}>
                  <select id="c-teamSize" className={inputCls} value={form.teamSize} onChange={set('teamSize')} {...err('teamSize')}>
                    <option value="">Select…</option>
                    <option>1–3</option>
                    <option>4–15</option>
                    <option>16–50</option>
                    <option>More than 50 / multi-site</option>
                  </select>
                </Field>
                <div className="md:col-span-2">
                  <Field label="What would you like to investigate? *" htmlFor="c-message" error={errors.message}>
                    <textarea id="c-message" rows={5} className={inputCls} value={form.message} onChange={set('message')} {...err('message')} />
                  </Field>
                </div>
                <div className="flex items-center justify-between gap-4 md:col-span-2">
                  <p className="text-xs text-graphite-500">* Required. Demo form: submissions are stored only in this browser.</p>
                  <Button type="submit">Send message</Button>
                </div>
              </form>
            )}
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
