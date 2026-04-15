import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';

// Pages
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import PetsPage from './pages/PetsPage';
import AIPage from './pages/AIPage';
import VaccinationsPage from './pages/VaccinationsPage';
import SubscriptionsPage from './pages/SubscriptionsPage';
import DonationsPage from './pages/DonationsPage';
import ProductsPage from './pages/ProductsPage';
import PetDetailPage from './pages/PetDetailPage';

// Components
import BottomNav from './components/BottomNav';

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
    <div className="app-wrapper app-layout" style={{ display: 'block', minHeight: '100vh', paddingBottom: '80px' }}>
      <main className="main-content" style={{ marginLeft: 0, padding: 0 }}>
        <Routes>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/pets" element={<PetsPage />} />
          <Route path="/pet/:id" element={<PetDetailPage />} />
          <Route path="/ai" element={<AIPage />} />
          <Route path="/health" element={<AIPage />} />
          <Route path="/vaccinations" element={<VaccinationsPage />} />
          <Route path="/subscriptions" element={<SubscriptionsPage />} />
          <Route path="/donate" element={<DonationsPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </main>
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
