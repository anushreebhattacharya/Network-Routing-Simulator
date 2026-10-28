import { useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import AppShell from './components/layout/AppShell.jsx';
import SimulatorPage from './pages/SimulatorPage.jsx';
import SavedNetworksPage from './pages/SavedNetworksPage.jsx';
import HelpPage from './pages/HelpPage.jsx';
import { healthCheck } from './api/client.js';

export default function App() {
  const [apiStatus, setApiStatus] = useState('checking');

  useEffect(() => {
    healthCheck()
      .then(() => setApiStatus('ok'))
      .catch(() => setApiStatus('down'));
  }, []);

  return (
    <Routes>
      <Route element={<AppShell apiStatus={apiStatus} />}>
        <Route path="/" element={<SimulatorPage />} />
        <Route path="/saved" element={<SavedNetworksPage />} />
        <Route path="/help" element={<HelpPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
