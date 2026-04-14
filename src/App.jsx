import { BrowserRouter, Routes, Route, Navigate, NavLink, useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import PetsPage from './pages/PetsPage';
import AIPage from './pages/AIPage';
import VaccinationsPage from './pages/VaccinationsPage';
import SubscriptionsPage from './pages/SubscriptionsPage';
import DonationsPage from './pages/DonationsPage';
import ProductsPage from './pages/ProductsPage';
import './index.css';

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
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { path: '/dashboard', icon: '📊', label: 'Dashboard' },
    { path: '/pets', icon: '🐾', label: 'My Pets' },
    { path: '/ai', icon: '🤖', label: 'AI Analysis' },
    { path: '/vaccinations', icon: '💉', label: 'Vaccinations' },
    { path: '/health', icon: '💊', label: 'Health Tips' },
    { path: '/products', icon: '🛍️', label: 'Products' },
    { path: '/subscriptions', icon: '💎', label: 'Subscription' },
    { path: '/donate', icon: '❤️', label: 'Donate' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <span className="logo-icon">🐾</span>
          <h1>PawCare AI</h1>
        </div>

        <nav className="sidebar-nav">
          {navItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="user-card">
            <div className="user-avatar">
              {user?.name?.charAt(0)?.toUpperCase() || '?'}
            </div>
            <div className="user-info">
              <div className="user-name">{user?.name}</div>
              <div className="user-plan">{user?.subscription?.replace('_', ' ')}</div>
            </div>
          </div>
          <button className="btn btn-ghost btn-full logout-btn" onClick={handleLogout}>
            🚪 Sign Out
          </button>
        </div>
      </aside>

      <main className="main-content">
        <Routes>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/pets" element={<PetsPage />} />
          <Route path="/ai" element={<AIPage />} />
          <Route path="/health" element={<AIPage />} />
          <Route path="/vaccinations" element={<VaccinationsPage />} />
          <Route path="/subscriptions" element={<SubscriptionsPage />} />
          <Route path="/donate" element={<DonationsPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#1A1A2E',
              color: '#fff',
              border: '1px solid rgba(108, 92, 231, 0.3)',
              borderRadius: '12px',
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
