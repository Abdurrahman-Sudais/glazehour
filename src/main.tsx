import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './index.css';
import { SiteLayout } from './components/SiteLayout';
import Home from './pages/Home';
import { DefectInvestigation, HowItWorks, Product, QualityWorkflows } from './pages/Platform';
import { About, Contact, NotFound, Pricing } from './pages/Company';
import { StoreProvider } from './state/store';
import { WorkspaceLayout } from './workspace/WorkspaceLayout';
import Overview from './workspace/Overview';
import Jobs from './workspace/Jobs';
import DefectLibrary, { SimilarGroup } from './workspace/Defects';
import DefectDetail from './workspace/DefectDetail';
import Specifications from './workspace/Specifications';
import { InvestigationsList, Reports, SettingsPage, Team } from './workspace/Misc';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <StoreProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<SiteLayout />}>
            <Route index element={<Home />} />
            <Route path="product" element={<Product />} />
            <Route path="defect-investigation" element={<DefectInvestigation />} />
            <Route path="quality-workflows" element={<QualityWorkflows />} />
            <Route path="how-it-works" element={<HowItWorks />} />
            <Route path="pricing" element={<Pricing />} />
            <Route path="about" element={<About />} />
            <Route path="contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Route>
          <Route path="investigations" element={<WorkspaceLayout />}>
            <Route index element={<Overview />} />
            <Route path="jobs" element={<Jobs />} />
            <Route path="defects" element={<DefectLibrary />} />
            <Route path="defects/groups/:groupId" element={<SimilarGroup />} />
            <Route path="defects/:defectId" element={<DefectDetail />} />
            <Route path="cases" element={<InvestigationsList />} />
            <Route path="specifications" element={<Specifications />} />
            <Route path="reports" element={<Reports />} />
            <Route path="team" element={<Team />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </StoreProvider>
  </StrictMode>,
);
