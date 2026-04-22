import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout';
import { DashboardPage } from '@/features/dashboard';
import { BiblePage } from '@/features/bible';
import { StudioPage } from '@/features/studio';
import { ArchivePage } from '@/features/archive';
import { SettingsPage } from '@/features/settings';

function App() {
  return (
    <BrowserRouter>
      <AppLayout>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/sermon-lab" element={<BiblePage />} />
          <Route path="/bible" element={<Navigate to="/sermon-lab" replace />} />
          <Route path="/studio" element={<StudioPage />} />
          <Route path="/archive" element={<ArchivePage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  );
}

export default App;
