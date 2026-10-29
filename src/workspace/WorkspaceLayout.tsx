import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { BarChart3, ClipboardList, FolderKanban, Images, LayoutDashboard, Menu, Ruler, Settings, Users, X } from 'lucide-react';
import { Logo } from '../components/SiteLayout';
import { cx } from '../components/ui';
import { useStore } from '../state/store';

const ITEMS = [
  { to: '/investigations', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/investigations/jobs', label: 'Jobs', icon: FolderKanban },
  { to: '/investigations/defects', label: 'Defect Library', icon: Images },
  { to: '/investigations/cases', label: 'Investigations', icon: ClipboardList },
  { to: '/investigations/specifications', label: 'Specifications', icon: Ruler },
  { to: '/investigations/reports', label: 'Reports', icon: BarChart3 },
  { to: '/investigations/team', label: 'Team', icon: Users },
  { to: '/investigations/settings', label: 'Settings', icon: Settings },
];

export function WorkspaceLayout() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const { user } = useStore();
  useEffect(() => setOpen(false), [pathname]);

  const nav = (
    <nav aria-label="Workspace" className="space-y-0.5 px-3">
      {ITEMS.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) =>
            cx('flex items-center gap-2.5 rounded-md px-2.5 py-2 text-[13px] transition-colors', isActive ? 'bg-ink-700 text-white' : 'text-graphite-300 hover:bg-ink-800 hover:text-white')
          }
        >
          <Icon size={16} aria-hidden /> {label}
        </NavLink>
      ))}
    </nav>
  );

  return (
    <div className="flex min-h-screen bg-mist-50">
      <a href="#ws-main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-white focus:px-3 focus:py-2">
        Skip to content
      </a>
      <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-ink-700 bg-ink-900 lg:flex">
        <div className="px-5 py-5"><Logo dark /></div>
        <p className="eyebrow px-5 pb-2 text-graphite-500">Halvard Street (demo)</p>
        {nav}
        <div className="mt-auto border-t border-ink-700 p-4">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-ink-700 font-mono text-xs text-mist-100">{user.initials}</span>
            <div>
              <p className="text-xs text-white">{user.name}</p>
              <p className="text-[11px] text-graphite-400">{user.role}</p>
            </div>
          </div>
          <Link to="/" className="mt-4 block text-[11px] text-graphite-400 hover:text-white">← Back to glazehour.space</Link>
        </div>
      </aside>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Workspace navigation">
          <div className="absolute inset-0 bg-ink-950/60" onClick={() => setOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-64 bg-ink-900 py-5">
            <div className="flex items-center justify-between px-5 pb-5">
              <Logo dark />
              <button aria-label="Close navigation" className="text-mist-100" onClick={() => setOpen(false)}><X size={20} /></button>
            </div>
            {nav}
            <Link to="/" className="mt-6 block px-5 text-xs text-graphite-400">← Back to glazehour.space</Link>
          </div>
        </div>
      )}

      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-mist-200 bg-white/95 px-4 backdrop-blur sm:px-6">
          <button className="rounded p-1.5 text-ink-800 lg:hidden" aria-label="Open navigation" onClick={() => setOpen(true)}><Menu size={20} /></button>
          <span className="rounded border border-dashed border-amber-300 bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-900">Demo workspace · fictional records</span>
          <span className="ml-auto hidden text-xs text-graphite-500 sm:block">Changes are saved in this browser only</span>
        </header>
        <div id="ws-main" className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export function PageHeader({ title, subtitle, actions }: { title: string; subtitle?: string; actions?: React.ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-graphite-500">{subtitle}</p>}
      </div>
      {actions}
    </div>
  );
}

export function Panel({ title, children, className, actions, id }: { title?: React.ReactNode; children: React.ReactNode; className?: string; actions?: React.ReactNode; id?: string }) {
  return (
    <section id={id} className={cx('rounded-lg border border-mist-200 bg-white', className)} aria-label={typeof title === 'string' ? title : undefined}>
      {title && (
        <div className="flex items-center justify-between gap-3 border-b border-mist-200 px-4 py-3">
          <h2 className="text-sm font-semibold">{title}</h2>
          {actions}
        </div>
      )}
      <div className="p-4">{children}</div>
    </section>
  );
}
