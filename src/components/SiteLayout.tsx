import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { cx } from './ui';

export const NAV = [
  { to: '/product', label: 'Product' },
  { to: '/defect-investigation', label: 'Defect Investigation' },
  { to: '/quality-workflows', label: 'Quality Workflows' },
  { to: '/how-it-works', label: 'How It Works' },
  { to: '/pricing', label: 'Pricing' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

export function Logo({ dark = false }: { dark?: boolean }) {
  return (
    <Link to="/" className="flex items-center gap-2" aria-label="Glazehour home">
      <svg width="26" height="26" viewBox="0 0 32 32" aria-hidden>
        <rect width="32" height="32" rx="6" fill={dark ? '#121b2d' : '#0b1220'} />
        <path d="M9 22V10h6M9 16h4M23 10v12M23 16h-6" stroke="#2dd4bf" strokeWidth="2.4" fill="none" strokeLinecap="square" />
      </svg>
      <span className={cx('text-[17px] font-semibold tracking-tight', dark ? 'text-white' : 'text-ink-900')}>Glazehour</span>
    </Link>
  );
}

export function SiteLayout() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  useEffect(() => {
    setOpen(false);
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="flex min-h-screen flex-col">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-white focus:px-3 focus:py-2">
        Skip to content
      </a>
      <header className="sticky top-0 z-40 border-b border-ink-700 bg-ink-900/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Logo dark />
          <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
            {NAV.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                className={({ isActive }) => cx('rounded px-2.5 py-1.5 text-[13px] transition-colors', isActive ? 'text-white' : 'text-graphite-300 hover:text-white')}
              >
                {n.label}
              </NavLink>
            ))}
          </nav>
          <div className="hidden lg:block">
            <Link to="/investigations" className="rounded-md bg-signal-600 px-3.5 py-2 text-[13px] font-medium text-white hover:bg-signal-500">
              Open demo workspace
            </Link>
          </div>
          <button className="rounded p-2 text-mist-100 lg:hidden" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} onClick={() => setOpen((o) => !o)}>
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
        {open && (
          <nav aria-label="Mobile" className="border-t border-ink-700 px-4 pb-4 lg:hidden">
            {NAV.map((n) => (
              <NavLink key={n.to} to={n.to} className="block border-b border-ink-800 py-3 text-sm text-mist-100">
                {n.label}
              </NavLink>
            ))}
            <Link to="/investigations" className="mt-4 block rounded-md bg-signal-600 px-3 py-2.5 text-center text-sm font-medium text-white">
              Open demo workspace
            </Link>
          </nav>
        )}
      </header>
      <main id="main" className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

function Footer() {
  return (
    <footer className="border-t border-ink-700 bg-ink-950 text-graphite-300">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo dark />
          <p className="mt-4 max-w-sm text-sm">Connect the defect to the evidence. Investigation and quality-management software for industrial coating teams.</p>
          <p className="mt-6 font-mono text-xs text-graphite-400">
            glazehour.space · <a className="hover:text-white" href="mailto:safiya@glazehour.space">safiya@glazehour.space</a>
          </p>
        </div>
        <div>
          <p className="eyebrow text-graphite-400">Platform</p>
          <ul className="mt-3 space-y-2 text-sm">
            {NAV.slice(0, 4).map((n) => (
              <li key={n.to}><Link className="hover:text-white" to={n.to}>{n.label}</Link></li>
            ))}
            <li><Link className="hover:text-white" to="/investigations">Demo workspace</Link></li>
          </ul>
        </div>
        <div>
          <p className="eyebrow text-graphite-400">Company</p>
          <ul className="mt-3 space-y-2 text-sm">
            {NAV.slice(4).map((n) => (
              <li key={n.to}><Link className="hover:text-white" to={n.to}>{n.label}</Link></li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-ink-800">
        <p className="mx-auto max-w-7xl px-4 py-5 text-xs text-graphite-400 sm:px-6">
          © {new Date().getFullYear()} Glazehour. Glazehour supports investigation; it does not diagnose defects or replace qualified coating inspectors, product data sheets or applicable standards.
        </p>
      </div>
    </footer>
  );
}
