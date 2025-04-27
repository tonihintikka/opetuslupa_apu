import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppShell from '../components/layout/AppShell';
import {
  StudentsPage,
  LessonsPage,
  MilestonesPage,
  SettingsPage,
  DataManagementPage,
} from '../components/pages';

/**
 * Router configuration for the application
 */
const Router: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppShell />}>
          <Route index element={<Navigate to="/students" replace />} />
          <Route path="students" element={<StudentsPage />} />
          <Route path="lessons" element={<LessonsPage />} />
          <Route path="milestones" element={<MilestonesPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="export-import" element={<DataManagementPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
