import { NavLink } from 'react-router-dom';
import { Home, Sparkles, Dumbbell, Syringe, Clock, CreditCard, PawPrint, Heart, LogOut, BarChart3, Pill, ShoppingBag, AlertCircle, Leaf } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navItems = [
    { path: '/dashboard', icon: <Home size={18} />, label: 'Dashboard' },
    { path: '/ai', icon: <Sparkles size={18} />, label: 'AI Analysis' },
    { path: '/exercise', icon: <Dumbbell size={18} />, label: 'Exercise & Care' },
    { path: '/vaccinations', icon: <Syringe size={18} />, label: 'Vaccinations' },
    { path: '/pets', icon: <PawPrint size={18} />, label: 'My Pets' },
    { path: '/routine', icon: <Clock size={18} />, label: 'Smart Routine' },
    { path: '/health-charts', icon: <BarChart3 size={18} />, label: 'Health Charts' },
    { path: '/medications', icon: <Pill size={18} />, label: 'Medications' },
    { path: '/products', icon: <ShoppingBag size={18} />, label: 'Products' },
    { path: '/emergency-vet', icon: <AlertCircle size={18} />, label: 'Emergency Vet' },
    { path: '/care-protocols', icon: <Leaf size={18} />, label: 'Care Protocols' },
    { path: '/subscriptions', icon: <CreditCard size={18} />, label: 'Subscription' },
    { path: '/donations', icon: <Heart size={18} />, label: 'Donations' },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">🐾 PawCare AI</div>
      <nav className="sidebar-nav">
        {navItems.map(item => (
          <NavLink key={item.path} to={item.path}
            className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
      <div style={{ borderTop: '1px solid var(--border)', paddingTop: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12, padding: '0 8px' }}>
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: 14 }}>
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600 }}>{user?.name || 'User'}</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'capitalize' }}>{user?.subscription || 'free'} plan</div>
          </div>
        </div>
        <button className="sidebar-item" onClick={logout} style={{ color: 'var(--danger)', width: '100%' }}>
          <LogOut size={18} /> <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
