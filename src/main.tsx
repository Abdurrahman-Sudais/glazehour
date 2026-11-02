import { StrictMode, Suspense, lazy } from 'react';
import type { ComponentType, ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './index.css';
import { SiteLayout } from './components/SiteLayout';
import Home from './pages/Home';
import { StoreProvider } from './state/store';

// The home page ships in the main bundle; every other page, and the whole demo workspace, loads on demand.
const named = <K extends string>(load: () => Promise<Record<K, ComponentType<any>>>, key: K) => lazy(() => load().then((m) => ({ default: m[key] })));
const platform = () => import('./pages/Platform');
const company = () => import('./pages/Company');
const trust = () => import('./pages/Trust');
const misc = () => import('./workspace/Misc');
const Product = named(platform, 'Product');
const DefectInvestigation = named(platform, 'DefectInvestigation');
const QualityWorkflows = named(platform, 'QualityWorkflows');
const HowItWorks = named(platform, 'HowItWorks');
const Pricing = named(company, 'Pricing');
const About = named(company, 'About');
const Contact = named(company, 'Contact');
const NotFound = named(company, 'NotFound');
const Technology = named(trust, 'Technology');
const Security = named(trust, 'Security');
const Legal = named(trust, 'Legal');
const WorkspaceLayout = named(() => import('./workspace/WorkspaceLayout'), 'WorkspaceLayout');
const Overview = lazy(() => import('./workspace/Overview'));
const Jobs = lazy(() => import('./workspace/Jobs'));
const DefectLibrary = lazy(() => import('./workspace/Defects'));
const SimilarGroup = named(() => import('./workspace/Defects'), 'SimilarGroup');
const DefectDetail = lazy(() => import('./workspace/DefectDetail'));
const Specifications = lazy(() => import('./workspace/Specifications'));
const InvestigationsList = named(misc, 'InvestigationsList');
const Reports = named(misc, 'Reports');
const SettingsPage = named(misc, 'SettingsPage');
const Team = named(misc, 'Team');
const Audit = lazy(() => import('./workspace/Audit'));

function Loading() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center" role="status" aria-live="polite">
      <span className="h-6 w-6 animate-spin rounded-full border-2 border-mist-200 border-t-signal-500" aria-hidden />
      <span className="sr-only">Loading…</span>
    </div>
  );
}
const L = ({ children }: { children: ReactNode }) => <Suspense fallback={<Loading />}>{children}</Suspense>;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <StoreProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<SiteLayout />}>
            <Route index element={<Home />} />
            <Route path="product" element={<L><Product /></L>} />
            <Route path="defect-investigation" element={<L><DefectInvestigation /></L>} />
            <Route path="quality-workflows" element={<L><QualityWorkflows /></L>} />
            <Route path="how-it-works" element={<L><HowItWorks /></L>} />
            <Route path="pricing" element={<L><Pricing /></L>} />
            <Route path="about" element={<L><About /></L>} />
            <Route path="contact" element={<L><Contact /></L>} />
            <Route path="technology" element={<L><Technology /></L>} />
            <Route path="security" element={<L><Security /></L>} />
            <Route path="privacy" element={<L><Legal kind="privacy" /></L>} />
            <Route path="terms" element={<L><Legal kind="terms" /></L>} />
            <Route path="*" element={<L><NotFound /></L>} />
          </Route>
          <Route path="investigations" element={<L><WorkspaceLayout /></L>}>
            <Route index element={<L><Overview /></L>} />
            <Route path="jobs" element={<L><Jobs /></L>} />
            <Route path="defects" element={<L><DefectLibrary /></L>} />
            <Route path="defects/groups/:groupId" element={<L><SimilarGroup /></L>} />
            <Route path="defects/:defectId" element={<L><DefectDetail /></L>} />
            <Route path="cases" element={<L><InvestigationsList /></L>} />
            <Route path="specifications" element={<L><Specifications /></L>} />
            <Route path="reports" element={<L><Reports /></L>} />
            <Route path="team" element={<L><Team /></L>} />
            <Route path="audit" element={<L><Audit /></L>} />
            <Route path="settings" element={<L><SettingsPage /></L>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </StoreProvider>
  </StrictMode>,
);
