import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import PetDetailPage from './pages/PetDetailPage';
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
    <div className="app-layout" style={{ display: 'block', minHeight: '100vh', paddingBottom: '80px' }}>
      <main className="main-content" style={{ marginLeft: 0, padding: 0 }}>
        <Routes>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/pet/:id" element={<PetDetailPage />} />
          {/* We'll add the new routes here */}
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
