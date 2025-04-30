import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppShell from '../components/layout/AppShell';
import {
  StudentsPage,
  LessonsPage,
  TipsPage,
  MilestonesPage,
  SettingsPage,
  DataManagementPage,
  PrivacyPolicy,
  TermsOfService,
  HelpPage,
} from '../components/pages';

/**
 * Router configuration for the application
 * Uses a lesson-centric approach where lessons are the primary workflow
 */
const Router: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppShell />}>
          <Route index element={<Navigate to="/lessons" replace />} />
          <Route path="lessons" element={<LessonsPage />} />
          <Route path="students" element={<StudentsPage />} />
          <Route path="tips" element={<TipsPage />} />
          <Route path="vinkit" element={<Navigate to="/tips" replace />} />
          <Route path="milestones" element={<MilestonesPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="export-import" element={<DataManagementPage />} />
          <Route path="help" element={<HelpPage />} />
          <Route path="privacy-policy" element={<PrivacyPolicy />} />
          <Route path="terms-of-service" element={<TermsOfService />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
