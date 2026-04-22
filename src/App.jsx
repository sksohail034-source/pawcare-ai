import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import AIPage from './pages/AIPage';
import ExercisePage from './pages/ExercisePage';
import VaccinationsPage from './pages/VaccinationsPage';
import PetsPage from './pages/PetsPage';
import RoutinePage from './pages/RoutinePage';
import SubscriptionsPage from './pages/SubscriptionsPage';
import DonationsPage from './pages/DonationsPage';
import PetDetailPage from './pages/PetDetailPage';
import HealthChartsPage from './pages/HealthChartsPage';
import MedicationsPage from './pages/MedicationsPage';
import ProductsPage from './pages/ProductsPage';
import EmergencyVetPage from './pages/EmergencyVetPage';
import CareProtocolsPage from './pages/CareProtocolsPage';
import AdminPage from './pages/AdminPage';
import BottomNav from './components/BottomNav';
import Sidebar from './components/Sidebar';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading-container"><div className="spinner"></div><p>Loading...</p></div>;
  if (!user) return <Navigate to="/login" />;
  return children;
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading-container"><div className="spinner"></div><p>Loading...</p></div>;
  if (user) return <Navigate to="/dashboard" />;
  return children;
}

function AppLayout() {
  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-area">
        <Routes>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/ai" element={<AIPage />} />
          <Route path="/exercise" element={<ExercisePage />} />
          <Route path="/vaccinations" element={<VaccinationsPage />} />
          <Route path="/pets" element={<PetsPage />} />
          <Route path="/pet/:id" element={<PetDetailPage />} />
          <Route path="/routine" element={<RoutinePage />} />
          <Route path="/subscriptions" element={<SubscriptionsPage />} />
          <Route path="/donations" element={<DonationsPage />} />
          <Route path="/health-charts" element={<HealthChartsPage />} />
          <Route path="/medications" element={<MedicationsPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/emergency-vet" element={<EmergencyVetPage />} />
          <Route path="/care-protocols" element={<CareProtocolsPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </div>
      <BottomNav />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: '#ffffff',
              color: '#1f2937',
              border: '1px solid rgba(34, 197, 94, 0.2)',
              borderRadius: '16px',
            },
          }}
        />
        <Routes>
          <Route path="/" element={<PublicRoute><LandingPage /></PublicRoute>} />
          <Route path="/login" element={<PublicRoute><AuthPage mode="login" /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><AuthPage mode="register" /></PublicRoute>} />
          <Route path="/*" element={<ProtectedRoute><AppLayout /></ProtectedRoute>} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
