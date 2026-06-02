import { Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import CreationPage from './pages/CreationPage';
import ResultPage from './pages/ResultPage';
import HistoryPage from './pages/HistoryPage';
import SettingsPage from './pages/SettingsPage';
import AuthPage from './pages/AuthPage';
import MembershipPage from './pages/MembershipPage';
import CreditsPage from './pages/CreditsPage';
import CheckoutPage from './pages/CheckoutPage';
import GalleryPage from './pages/GalleryPage';
import AuthGuard from './components/auth/AuthGuard';

/** Root application component with routing */
function App(): React.ReactElement {
  return (
    <Routes>
      <Route path="/auth" element={<AuthPage />} />
      <Route
        path="/"
        element={
          <AuthGuard>
            <AppLayout />
          </AuthGuard>
        }
      >
        <Route index element={<CreationPage />} />
        <Route path="result/:taskId" element={<ResultPage />} />
        <Route path="history" element={<HistoryPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="membership" element={<MembershipPage />} />
        <Route path="membership/credits" element={<CreditsPage />} />
        <Route path="membership/checkout" element={<CheckoutPage />} />
        <Route path="gallery" element={<GalleryPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
