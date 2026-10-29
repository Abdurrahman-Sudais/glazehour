// Procedural imagery. The demo ships without third-party photography, so
// defect "photographs" and marketing surface imagery are rendered as SVG
// from a seed. Each component accepts an optional `src` so real photographs
// can be dropped into /public/images and used instead.

import { useId } from 'react';
import type { DefectCategory } from '../domain/types';

function rng(seed: number) {
  let s = seed * 9301 + 49297;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

const PAINT: Record<DefectCategory, [string, string]> = {
  blistering: ['#5d6b7a', '#7a8794'],
  pinholes: ['#c9ced4', '#e4e7ea'],
  'uneven-coverage': ['#3f4f3a', '#5c6b52'],
  'runs-sags': ['#8a6a1f', '#b08a35'],
  'surface-contamination': ['#29405f', '#3c5a80'],
  'orange-peel': ['#6b2f2f', '#8a4242'],
  'adhesion-loss': ['#4a4f57', '#6c727b'],
};

interface DefectImageProps {
  category: DefectCategory;
  seed: number;
  alt: string;
  className?: string;
  src?: string;
  showBadge?: boolean;
}

export function DefectImage({ category, seed, alt, className = '', src, showBadge = true }: DefectImageProps) {
  const uidRaw = useId().replace(/:/g, '');
  const id = `d${uidRaw}`;
  if (src) return <img src={src} alt={alt} className={`object-cover ${className}`} loading="lazy" />;

  const r = rng(seed);
  const [c1, c2] = PAINT[category];
  const marks: JSX.Element[] = [];

  if (category === 'blistering') {
    const cx = 80 + r() * 140, cy = 70 + r() * 80;
    for (let i = 0; i < 26; i++) {
      const x = cx + (r() - 0.5) * 170, y = cy + (r() - 0.5) * 120, rad = 3 + r() * 9;
      marks.push(
        <g key={i}>
          <ellipse cx={x + rad * 0.25} cy={y + rad * 0.35} rx={rad} ry={rad * 0.9} fill="#000" opacity={0.28} />
          <circle cx={x} cy={y} r={rad} fill={`url(#${id}-dome)`} />
        </g>,
      );
    }
  } else if (category === 'pinholes') {
    for (let i = 0; i < 90; i++) {
      const x = r() * 300, y = r() * 200, rad = 0.6 + r() * 1.6;
      marks.push(<circle key={i} cx={x} cy={y} r={rad + 0.9} fill="#fff" opacity={0.5} />, <circle key={`h${i}`} cx={x} cy={y} r={rad} fill="#1a1d22" opacity={0.85} />);
    }
  } else if (category === 'runs-sags') {
    for (let i = 0; i < 7; i++) {
      const x = 20 + r() * 260, len = 50 + r() * 110, w = 6 + r() * 10;
      marks.push(
        <path key={i} d={`M${x - w} 0 L${x - w * 0.6} ${len} Q${x} ${len + w * 1.6} ${x + w * 0.6} ${len} L${x + w} 0 Z`} fill={c2} stroke="#000" strokeOpacity={0.25} strokeWidth={1} />,
        <path key={`s${i}`} d={`M${x - w * 0.3} 4 L${x - w * 0.2} ${len - 4}`} stroke="#fff" strokeOpacity={0.35} strokeWidth={1.5} />,
      );
    }
  } else if (category === 'uneven-coverage') {
    for (let row = 0; row < 6; row++)
      for (let col = 0; col < 9; col++) {
        const x = 20 + col * 32, y = 20 + row * 32;
        marks.push(<circle key={`${row}-${col}`} cx={x} cy={y} r={9} fill="#0d0f12" />, <circle key={`h${row}-${col}`} cx={x} cy={y} r={13} fill="none" stroke="#a8a49a" strokeOpacity={0.35 + r() * 0.4} strokeWidth={3 + r() * 3} />);
      }
  } else {
    for (let i = 0; i < 14; i++) {
      const x = r() * 300, y = r() * 200, rad = 5 + r() * 12;
      marks.push(
        <g key={i}>
          <circle cx={x} cy={y} r={rad + 3} fill="none" stroke="#fff" strokeOpacity={0.35} strokeWidth={2} />
          <circle cx={x} cy={y} r={rad} fill="#000" opacity={0.25} />
          <circle cx={x} cy={y} r={rad * 0.35} fill="#9aa3ad" opacity={0.8} />
        </g>,
      );
    }
  }

  return (
    <div className={`relative overflow-hidden bg-ink-800 ${className}`}>
      <svg viewBox="0 0 300 200" preserveAspectRatio="xMidYMid slice" className="h-full w-full" role="img" aria-label={alt}>
        <defs>
          <linearGradient id={`${id}-base`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={c2} />
            <stop offset="1" stopColor={c1} />
          </linearGradient>
          <radialGradient id={`${id}-dome`} cx="0.35" cy="0.3" r="0.8">
            <stop offset="0" stopColor="#fff" stopOpacity="0.7" />
            <stop offset="0.35" stopColor={c2} />
            <stop offset="1" stopColor={c1} />
          </radialGradient>
          <filter id={`${id}-tex`}>
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" seed={seed} />
            <feColorMatrix values="0 0 0 0 0.5  0 0 0 0 0.5  0 0 0 0 0.5  0 0 0 0.35 0" />
            <feComposite in2="SourceGraphic" operator="in" />
          </filter>
          <radialGradient id={`${id}-vig`} cx="0.5" cy="0.5" r="0.75">
            <stop offset="0.55" stopColor="#000" stopOpacity="0" />
            <stop offset="1" stopColor="#000" stopOpacity="0.55" />
          </radialGradient>
        </defs>
        <rect width="300" height="200" fill={`url(#${id}-base)`} />
        <rect width="300" height="200" filter={`url(#${id}-tex)`} />
        {marks}
        <rect width="300" height="200" fill={`url(#${id}-vig)`} />
        <g fontFamily="IBM Plex Mono, monospace" fontSize="7" fill="#fff" opacity="0.8">
          <line x1="12" y1="186" x2="62" y2="186" stroke="#fff" strokeWidth="1.2" />
          <line x1="12" y1="182" x2="12" y2="190" stroke="#fff" strokeWidth="1.2" />
          <line x1="62" y1="182" x2="62" y2="190" stroke="#fff" strokeWidth="1.2" />
          <text x="22" y="180">10 mm</text>
        </g>
      </svg>
      {showBadge && (
        <span className="absolute right-2 top-2 rounded-sm bg-ink-950/75 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-mist-200">Demo image</span>
      )}
    </div>
  );
}

type SceneKind = 'panel' | 'line' | 'gauge' | 'facility';

interface SceneProps {
  kind: SceneKind;
  alt: string;
  className?: string;
  src?: string;
}

/** Industrial scene imagery for marketing pages. */
export function Scene({ kind, alt, className = '', src }: SceneProps) {
  const uidRaw = useId().replace(/:/g, '');
  const id = `s${uidRaw}`;
  if (src) return <img src={src} alt={alt} className={`object-cover ${className}`} loading="lazy" />;

  return (
    <div className={`relative overflow-hidden bg-ink-900 ${className}`}>
      <svg viewBox="0 0 600 400" preserveAspectRatio="xMidYMid slice" className="h-full w-full" role="img" aria-label={alt}>
        <defs>
          <linearGradient id={`${id}-steel`} x1="0" y1="0" x2="1" y2="0.3">
            <stop offset="0" stopColor="#2b3442" />
            <stop offset="0.45" stopColor="#7d8796" />
            <stop offset="0.55" stopColor="#a3acb8" />
            <stop offset="1" stopColor="#353f4e" />
          </linearGradient>
          <linearGradient id={`${id}-coat`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#1e3a5f" />
            <stop offset="1" stopColor="#0f1f35" />
          </linearGradient>
          <filter id={`${id}-brush`}>
            <feTurbulence type="fractalNoise" baseFrequency="0.004 0.6" numOctaves="2" seed="4" />
            <feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.12 0" />
          </filter>
          <filter id={`${id}-grain`}>
            <feTurbulence type="fractalNoise" baseFrequency="1.2" numOctaves="2" seed="9" />
            <feColorMatrix values="0 0 0 0 0.5  0 0 0 0 0.5  0 0 0 0 0.5  0 0 0 0.18 0" />
          </filter>
          <linearGradient id={`${id}-light`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#fff" stopOpacity="0.18" />
            <stop offset="0.5" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
        </defs>

        {kind === 'panel' && (
          <>
            <rect width="600" height="400" fill={`url(#${id}-steel)`} />
            <rect width="600" height="400" filter={`url(#${id}-brush)`} />
            <polygon points="0,0 380,0 240,400 0,400" fill={`url(#${id}-coat)`} />
            <polygon points="0,0 380,0 240,400 0,400" filter={`url(#${id}-grain)`} />
            <line x1="380" y1="0" x2="240" y2="400" stroke="#0b1220" strokeWidth="3" opacity="0.6" />
            <rect width="600" height="400" fill={`url(#${id}-light)`} />
          </>
        )}

        {kind === 'line' && (
          <>
            <rect width="600" height="400" fill="#0e1524" />
            {[...Array(9)].map((_, i) => (
              <line key={i} x1={i * 75} y1="0" x2={300 + (i - 4) * 30} y2="180" stroke="#2a3752" strokeWidth="1" />
            ))}
            <rect x="0" y="70" width="600" height="10" fill="#3b4760" />
            {[...Array(7)].map((_, i) => (
              <g key={i} transform={`translate(${40 + i * 85} 80)`}>
                <line x1="20" y1="0" x2="20" y2="40" stroke="#5b6475" strokeWidth="2" />
                <rect x="0" y="40" width="40" height={150 - Math.abs(3 - i) * 12} fill={`url(#${id}-coat)`} stroke="#1c273d" />
                <rect x="0" y="40" width="40" height={150 - Math.abs(3 - i) * 12} filter={`url(#${id}-grain)`} />
                <rect x="4" y="44" width="6" height={140 - Math.abs(3 - i) * 12} fill="#fff" opacity="0.08" />
              </g>
            ))}
            <rect x="0" y="330" width="600" height="70" fill="#0a0f1a" />
            <rect width="600" height="400" fill={`url(#${id}-light)`} />
          </>
        )}

        {kind === 'gauge' && (
          <>
            <rect width="600" height="400" fill={`url(#${id}-coat)`} />
            <rect width="600" height="400" filter={`url(#${id}-grain)`} />
            <g transform="translate(300 210)">
              <ellipse cx="10" cy="120" rx="150" ry="18" fill="#000" opacity="0.35" />
              <rect x="-110" y="-150" width="220" height="260" rx="22" fill="#1b2232" stroke="#3a465e" strokeWidth="2" />
              <rect x="-82" y="-120" width="164" height="96" rx="6" fill="#0a1a1a" stroke="#14b8a6" strokeOpacity="0.5" />
              <text x="0" y="-62" textAnchor="middle" fontFamily="IBM Plex Mono, monospace" fontSize="38" fill="#2dd4bf">118</text>
              <text x="58" y="-40" textAnchor="end" fontFamily="IBM Plex Mono, monospace" fontSize="12" fill="#5eead4">µm DFT</text>
              {[-40, 0, 40].map((x) => (
                <circle key={x} cx={x} cy="40" r="14" fill="#2a3448" stroke="#4a566e" />
              ))}
              <rect x="-28" y="110" width="56" height="40" fill="#1b2232" />
            </g>
            <rect width="600" height="400" fill={`url(#${id}-light)`} />
          </>
        )}

        {kind === 'facility' && (
          <>
            <rect width="600" height="400" fill="#0c1322" />
            {[...Array(12)].map((_, i) => (
              <line key={i} x1={i * 55} y1="0" x2={i * 55 - 40} y2="400" stroke="#1c273d" strokeWidth="2" />
            ))}
            {[...Array(5)].map((_, i) => (
              <rect key={i} x={30 + i * 115} y="40" width="80" height="14" fill="#dde2ea" opacity={0.55 - i * 0.05} />
            ))}
            <rect x="40" y="170" width="250" height="160" fill="#1c273d" stroke="#2a3752" />
            <rect x="60" y="190" width="210" height="120" fill={`url(#${id}-steel)`} opacity="0.7" />
            <rect x="320" y="200" width="240" height="130" fill="#121b2d" stroke="#2a3752" />
            {[...Array(6)].map((_, i) => (
              <rect key={i} x={335 + i * 37} y="220" width="25" height="90" fill={`url(#${id}-coat)`} />
            ))}
            <rect x="0" y="330" width="600" height="70" fill="#080d18" />
            <rect width="600" height="400" filter={`url(#${id}-grain)`} />
            <rect width="600" height="400" fill={`url(#${id}-light)`} />
          </>
        )}
      </svg>
    </div>
  );
}
