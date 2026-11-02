import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { ArrowRight, Menu, X } from 'lucide-react';
import { cx } from './ui';
import { useRevealOnScroll } from '../lib/motion';
import { FOUNDERS, SITE } from '../data/site';

export const NAV = [
  { to: '/#problem', label: 'Problem' },
  { to: '/product', label: 'Platform' },
  { to: '/how-it-works', label: 'How It Works' },
  { to: '/technology', label: 'Technology' },
  { to: '/pricing', label: 'Pricing' },
  { to: '/about', label: 'Team' },
  { to: '/security', label: 'Security' },
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
  const [scrolled, setScrolled] = useState(false);
  const { pathname, hash } = useLocation();
  useRevealOnScroll(pathname);
  useEffect(() => {
    setOpen(false);
    if (!hash) {
      window.scrollTo(0, 0);
      return;
    }
    let tries = 0;
    let t = 0;
    const find = () => {
      const el = document.getElementById(decodeURIComponent(hash.slice(1)));
      if (el) {
        el.scrollIntoView();
        t = window.setTimeout(() => el.scrollIntoView(), 450);
      } else if (tries++ < 40) t = window.setTimeout(find, 50);
    };
    find();
    return () => window.clearTimeout(t);
  }, [pathname, hash]);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-white focus:px-3 focus:py-2">
        Skip to content
      </a>
      <header className={cx('sticky top-0 z-40 border-b backdrop-blur transition-all duration-300', scrolled ? 'border-ink-700 bg-ink-900/95 shadow-lg shadow-black/30' : 'border-transparent bg-ink-900/70')}>
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Logo dark />
          <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
            {NAV.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                className={({ isActive }) =>
                  cx(
                    'relative rounded px-2.5 py-1.5 text-[13px] transition-colors after:absolute after:inset-x-2.5 after:-bottom-0.5 after:h-px after:origin-left after:bg-signal-400 after:transition-transform',
                    isActive && !n.to.includes('#') ? 'text-white after:scale-x-100' : 'text-graphite-300 after:scale-x-0 hover:text-white hover:after:scale-x-100',
                  )
                }
              >
                {n.label}
              </NavLink>
            ))}
          </nav>
          <div className="hidden items-center gap-2 lg:flex">
            <Link to="/investigations" className="rounded-md px-3 py-2 text-[13px] text-graphite-300 hover:text-white">
              Live demo
            </Link>
            <Link to="/contact" className="inline-flex items-center gap-1.5 rounded-md bg-signal-600 px-3.5 py-2 text-[13px] font-medium text-white hover:bg-signal-500">
              Request early access <ArrowRight size={14} />
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
            <Link to="/contact" className="mt-4 block rounded-md bg-signal-600 px-3 py-2.5 text-center text-sm font-medium text-white">
              Request early access
            </Link>
            <Link to="/investigations" className="mt-2 block rounded-md border border-ink-600 px-3 py-2.5 text-center text-sm font-medium text-white">
              Explore the live demo
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
  const cols: [string, [string, string][]][] = [
    ['Platform', [['/product', 'Platform overview'], ['/defect-investigation', 'Defect investigation'], ['/quality-workflows', 'Quality workflows'], ['/investigations', 'Live demo'], ['/pricing', 'Pricing']]],
    ['Solutions', [['/#problem', 'Problems we solve'], ['/#who', 'Who it’s for'], ['/#compare', 'Why Glazehour'], ['/how-it-works', 'How it works'], ['/#roadmap', 'Roadmap']]],
    ['Company', [['/about', 'About & team'], ['/technology', 'Technology (AWS)'], ['/security', 'Security & safeguards'], ['/contact', 'Request early access'], ['/#faq', 'FAQ']]],
    ['Legal', [['/privacy', 'Privacy notice'], ['/terms', 'Terms of use']]],
  ];
  return (
    <footer className="relative overflow-hidden border-t border-ink-700 bg-ink-950 text-graphite-300">
      <div className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[48rem] -translate-x-1/2 rounded-full bg-signal-500/10 blur-3xl" aria-hidden />
      <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr_0.8fr]">
        <div>
          <Logo dark />
          <p className="mt-4 max-w-sm text-sm">Connect the defect to the evidence. Investigation and quality-management software for industrial coating teams.</p>
          <a className="mt-4 inline-block font-mono text-xs text-signal-400 hover:text-white" href={`mailto:${SITE.email}`}>{SITE.email}</a>
          <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-ink-700 bg-ink-900 px-3 py-1.5 text-xs text-graphite-300">
            <span className="live-dot" aria-hidden /> Early access open · pilots on one coating line
          </div>
        </div>
        {cols.map(([title, links]) => (
          <div key={title}>
            <p className="eyebrow text-graphite-400">{title}</p>
            <ul className="mt-3 space-y-2 text-sm">
              {links.map(([to, label]) => (
                <li key={to}><Link className="hover:text-white" to={to}>{label}</Link></li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="relative border-t border-ink-800">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-5 text-xs text-graphite-400 sm:px-6 md:flex-row md:items-center md:justify-between">
          <span>
            © {new Date().getFullYear()} Glazehour · Founded by{' '}
            {FOUNDERS.map((f, i) => (
              <span key={f.name}>{i > 0 && ' & '}<Link to="/about#team" className="text-graphite-300 hover:text-white">{f.name}</Link></span>
            ))}
          </span>
          <span>Glazehour supports investigation; it does not diagnose defects or replace qualified coating inspectors.</span>
        </div>
      </div>
    </footer>
  );
}
