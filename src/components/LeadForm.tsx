import { useState } from 'react';
import type { FormEvent } from 'react';
import { Check, Mail, Send } from 'lucide-react';
import { Button, Field, inputCls } from './ui';
import { SITE } from '../data/site';
import { emptyLead, hubspotConfig, leadPayload, validateLead } from '../domain/lead';
import type { Lead, LeadErrors } from '../domain/lead';

const USE_CASES = ['Investigating recurring defects', 'Checking conditions against specifications', 'Traceable inspection records', 'Customer or warranty claims', 'Comparing lines and shifts', 'Not sure yet'];
const PLANS = ['Inspector', 'Quality Team', 'Enterprise'];

/**
 * Early-access form. With HubSpot configured (VITE_HUBSPOT_*) it submits to the HubSpot Forms API;
 * otherwise it keeps the request in this browser and offers a pre-filled email.
 */
export function LeadForm({ initialPlan = '', compact = false }: { initialPlan?: string; compact?: boolean }) {
  const hubspot = hubspotConfig();
  const [form, setForm] = useState<Lead>(() => emptyLead(initialPlan));
  const [errors, setErrors] = useState<LeadErrors>({});
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);
  const [sent, setSent] = useState<'hubspot' | 'local' | null>(null);
  const idp = compact ? 'ea' : 'c';
  const set = <K extends keyof Lead>(k: K, v: Lead[K]) => {
    setForm((f) => ({ ...f, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }));
  };
  const mailto = `mailto:${SITE.email}?subject=${encodeURIComponent(`Glazehour early access${form.company ? ` — ${form.company}` : ''}`)}&body=${encodeURIComponent(`${form.message}\n\nName: ${form.name}\nCompany: ${form.company}\nRole: ${form.role}\nTeam size: ${form.teamSize}\nUse case: ${form.useCase}\nPlan: ${form.plan}`)}`;

  async function submit(e: FormEvent) {
    e.preventDefault();
    setFailed(false);
    if (form.website) return; // honeypot
    const errs = validateLead(form);
    setErrors(errs);
    if (Object.keys(errs).length) {
      document.getElementById(`${idp}-${Object.keys(errs)[0]}`)?.focus();
      return;
    }
    if (!hubspot) {
      try {
        const prev = JSON.parse(localStorage.getItem('glazehour-contact') ?? '[]');
        const { website: _hp, ...keep } = form;
        localStorage.setItem('glazehour-contact', JSON.stringify([...prev, { ...keep, at: new Date().toISOString() }]));
      } catch {
        /* storage unavailable: the email link still works */
      }
      setSent('local');
      return;
    }
    setBusy(true);
    try {
      const r = await fetch(`https://api.hsforms.com/submissions/v3/integration/submit/${encodeURIComponent(hubspot.portalId)}/${encodeURIComponent(hubspot.formGuid)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(leadPayload(form, { pageUri: location.href.split('#')[0] ?? location.href, pageName: document.title }, hubspot)),
      });
      if (!r.ok) throw new Error(String(r.status));
      setSent('hubspot');
    } catch {
      setFailed(true);
    } finally {
      setBusy(false);
    }
  }

  const err = (k: keyof Lead) => ({ 'aria-invalid': Boolean(errors[k]), 'aria-describedby': errors[k] ? `${idp}-${k}-error` : undefined });

  if (sent) {
    return (
      <div role="status" className="py-10 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-teal-50 text-signal-600"><Check /></div>
        <h2 className="mt-4 text-xl font-semibold">Thanks, {form.name.split(' ')[0]}.</h2>
        {sent === 'hubspot' ? (
          <p className="mt-2 text-sm text-graphite-500">Your request has been received. We’ll reply by email to arrange a walkthrough on your own lines and records.</p>
        ) : (
          <>
            <p className="mx-auto mt-2 max-w-sm text-sm text-graphite-500">This site has no form backend configured yet, so your request was saved in this browser only. To send it, open it as an email:</p>
            <a href={mailto} className="mt-5 inline-flex items-center gap-2 rounded-md bg-signal-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-signal-500"><Mail size={16} /> Email {SITE.email}</a>
          </>
        )}
      </div>
    );
  }

  return (
    <form noValidate onSubmit={submit} className="relative grid gap-5 md:grid-cols-2" aria-label="Request early access">
      <Field label="Name *" htmlFor={`${idp}-name`} error={errors.name}>
        <input id={`${idp}-name`} className={inputCls} maxLength={100} value={form.name} onChange={(e) => set('name', e.target.value)} autoComplete="name" {...err('name')} />
      </Field>
      <Field label="Work email *" htmlFor={`${idp}-email`} error={errors.email}>
        <input id={`${idp}-email`} type="email" className={inputCls} maxLength={200} value={form.email} onChange={(e) => set('email', e.target.value)} autoComplete="email" {...err('email')} />
      </Field>
      <Field label="Company or facility *" htmlFor={`${idp}-company`} error={errors.company}>
        <input id={`${idp}-company`} className={inputCls} maxLength={150} value={form.company} onChange={(e) => set('company', e.target.value)} autoComplete="organization" {...err('company')} />
      </Field>
      <Field label="Role" htmlFor={`${idp}-role`}>
        <input id={`${idp}-role`} className={inputCls} maxLength={100} value={form.role} onChange={(e) => set('role', e.target.value)} placeholder="e.g. Quality manager" />
      </Field>
      <Field label="Quality team size *" htmlFor={`${idp}-teamSize`} error={errors.teamSize}>
        <select id={`${idp}-teamSize`} className={inputCls} value={form.teamSize} onChange={(e) => set('teamSize', e.target.value)} {...err('teamSize')}>
          <option value="">Select…</option>
          <option>1–3</option>
          <option>4–15</option>
          <option>16–50</option>
          <option>More than 50 / multi-site</option>
        </select>
      </Field>
      <Field label="Primary use case" htmlFor={`${idp}-useCase`}>
        <select id={`${idp}-useCase`} className={inputCls} value={form.useCase} onChange={(e) => set('useCase', e.target.value)}>
          <option value="">Select…</option>
          {USE_CASES.map((u) => <option key={u}>{u}</option>)}
        </select>
      </Field>
      {!compact && (
        <div className="md:col-span-2">
          <Field label="Plan of interest" htmlFor={`${idp}-plan`}>
            <select id={`${idp}-plan`} className={inputCls} value={form.plan} onChange={(e) => set('plan', e.target.value)}>
              <option value="">Not sure yet</option>
              {PLANS.map((p) => <option key={p}>{p}</option>)}
            </select>
          </Field>
        </div>
      )}
      <div className="md:col-span-2">
        <Field label="What would you like to investigate? *" htmlFor={`${idp}-message`} error={errors.message}>
          <textarea id={`${idp}-message`} rows={compact ? 3 : 5} className={inputCls} value={form.message} onChange={(e) => set('message', e.target.value)} placeholder="Lines, coating systems and the defects you see most often. Please don’t include confidential customer data." {...err('message')} />
        </Field>
      </div>
      <div className="absolute -left-[10000px] h-px w-px overflow-hidden" aria-hidden>
        <label>Leave this field empty<input tabIndex={-1} autoComplete="off" value={form.website} onChange={(e) => set('website', e.target.value)} /></label>
      </div>
      <div className="space-y-2 text-sm md:col-span-2">
        <label className="flex items-start gap-2">
          <input id={`${idp}-consent`} type="checkbox" className="mt-0.5 h-4 w-4 accent-signal-600" checked={form.consent} onChange={(e) => set('consent', e.target.checked)} {...err('consent')} />
          <span>I agree that Glazehour may contact me about this request. *</span>
        </label>
        {errors.consent && <p id={`${idp}-consent-error`} className="text-xs text-fault">{errors.consent}</p>}
        <label className="flex items-start gap-2">
          <input type="checkbox" className="mt-0.5 h-4 w-4 accent-signal-600" checked={form.marketing} onChange={(e) => set('marketing', e.target.checked)} />
          <span>Also send me occasional product updates (optional).</span>
        </label>
      </div>
      {failed && <p role="alert" className="text-sm text-fault md:col-span-2">Sorry, that could not be sent. Please try again, or email {SITE.email}.</p>}
      <div className="flex flex-wrap items-center gap-4 md:col-span-2">
        <Button type="submit" disabled={busy}><Send size={15} /> {busy ? 'Sending…' : 'Request early access'}</Button>
        <p className="text-xs text-graphite-500">
          {hubspot ? 'Submitting sends these details to Glazehour’s customer-relationship system so we can reply.' : 'No form backend is configured: your request is saved in this browser and offered as an email.'} See the <a href="/privacy" className="text-volt-600 underline">privacy notice</a>.
        </p>
      </div>
    </form>
  );
}
