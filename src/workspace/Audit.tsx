import { useMemo, useState } from 'react';
import { Check, Download, Minus } from 'lucide-react';
import { ACTIONS, ACTION_LABEL, DEMO_PEOPLE, ROLE_LABEL, actorName, can, type DemoRole } from '../domain/access';
import { useStore } from '../state/store';
import { Button, RoleNote, inputCls, useSeo } from '../components/ui';
import { PageHeader, Panel } from './WorkspaceLayout';

const ROLES: DemoRole[] = ['lead', 'engineer', 'inspector', 'supervisor'];
const csvCell = (v: string) => (/[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v);
const fmt = (iso: string) => new Date(iso).toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', timeZone: 'UTC' }) + ' UTC';

export default function Audit() {
  useSeo('Audit & roles · Demo workspace', 'Roles, permissions and the audit log in the Glazehour demo workspace.');
  const { auditLog, can: allowed, role } = useStore();
  const [q, setQ] = useState('');
  const rows = useMemo(() => {
    const t = q.trim().toLowerCase();
    return [...auditLog].reverse().filter((e) => !t || `${actorName(e.actorId)} ${e.action} ${e.detail}`.toLowerCase().includes(t));
  }, [auditLog, q]);
  const exportCsv = () => {
    const text = [['Time (UTC)', 'Person', 'Action', 'Detail'], ...rows.map((e) => [e.at, actorName(e.actorId), e.action, e.detail])].map((r) => r.map(csvCell).join(',')).join('\n');
    const url = URL.createObjectURL(new Blob([text], { type: 'text/csv;charset=utf-8' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = 'glazehour-audit-log.csv';
    a.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  return (
    <>
      <PageHeader title="Audit & roles" subtitle="Who can do what in this demo workspace, and an append-only record of every change. Switch user under “Demo as” to try each role." />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
        <div className="min-w-0 space-y-6">
          <Panel title="Roles and permissions">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-[11px] text-graphite-500">
                    <th className="py-2 pr-3 font-medium">Action</th>
                    {ROLES.map((r) => <th key={r} className="px-2 py-2 text-center font-medium">{ROLE_LABEL[r]}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {ACTIONS.map((a) => (
                    <tr key={a} className="border-t border-mist-100">
                      <td className="py-2 pr-3">{ACTION_LABEL[a]}</td>
                      {ROLES.map((r) => (
                        <td key={r} className="px-2 py-2 text-center">
                          {can(r, a) ? <Check size={16} className="mx-auto text-signal-600" aria-label="Allowed" /> : <Minus size={16} className="mx-auto text-graphite-300" aria-label="Not allowed" />}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-xs text-graphite-500">Resetting the demo is open to everyone because it only clears this browser. In production, roles come from your identity provider and are enforced on the server.</p>
          </Panel>
          <Panel title="People in this demo">
            <ul className="divide-y divide-mist-100">
              {DEMO_PEOPLE.map((p) => (
                <li key={p.id} className="flex items-center justify-between gap-3 py-2.5 text-sm">
                  <span className="flex items-center gap-2.5">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-ink-900 font-mono text-[11px] text-mist-100">{p.initials}</span>
                    <span>
                      <span className="block">{p.name}</span>
                      <span className="block text-[11px] text-graphite-500">{p.role}</span>
                    </span>
                  </span>
                  <span className="rounded-full bg-mist-100 px-2 py-0.5 text-[11px] text-ink-800">{ROLE_LABEL[p.demoRole]}</span>
                </li>
              ))}
            </ul>
          </Panel>
        </div>
        <Panel title={`Audit log (${auditLog.length})`} actions={allowed('audit') ? <Button variant="secondary" className="px-2.5 py-1 text-xs" onClick={exportCsv}><Download size={13} /> Export CSV</Button> : undefined}>
          {!allowed('audit') ? (
            <RoleNote>Acting as {ROLE_LABEL[role].toLowerCase()}: only the quality lead can read the audit log. Switch to Amara Okafor under “Demo as”.</RoleNote>
          ) : (
            <>
              <label htmlFor="audit-q" className="sr-only">Filter the audit log</label>
              <input id="audit-q" className={`${inputCls} mb-3`} placeholder="Filter by person, action or record…" value={q} onChange={(e) => setQ(e.target.value)} />
              <ol className="divide-y divide-mist-100">
                {rows.map((e) => (
                  <li key={e.id} className="py-2.5 text-[13px]">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <span className="font-medium">{actorName(e.actorId)}</span>
                      <span className="font-mono text-[11px] text-graphite-500">{fmt(e.at)}</span>
                    </div>
                    <div className="text-ink-800"><span className="mr-1.5 rounded bg-mist-100 px-1.5 py-0.5 font-mono text-[10px] uppercase text-graphite-500">{e.action}</span>{e.detail}</div>
                  </li>
                ))}
                {!rows.length && <li className="py-3 text-sm text-graphite-500">No matching entries.</li>}
              </ol>
            </>
          )}
        </Panel>
      </div>
    </>
  );
}
