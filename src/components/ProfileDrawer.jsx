import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Home, Sparkles, Dumbbell, Syringe, Clock, CreditCard,
  PawPrint, Heart, LogOut, BarChart3, Pill, ShoppingBag,
  AlertCircle, Leaf, Shield, Bot, X, Crown, ChevronRight, User, Video
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function ProfileDrawer({ isOpen, onClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const navSections = [
    {
      title: 'Main',
      items: [
        { path: '/dashboard', icon: <Home size={20} />, label: 'Dashboard' },
        { path: '/ai', icon: <Sparkles size={20} />, label: 'AI Analysis' },
        { path: '/pets', icon: <PawPrint size={20} />, label: 'My Pets' },
      ]
    },
    {
      title: 'Health & Care',
      items: [
        { path: '/vaccinations', icon: <Syringe size={20} />, label: 'Vaccinations' },
        { path: '/medications', icon: <Pill size={20} />, label: 'Medications' },
        { path: '/health-charts', icon: <BarChart3 size={20} />, label: 'Health Charts' },
        { path: '/exercise', icon: <Dumbbell size={20} />, label: 'Exercise & Care' },
        { path: '/training', icon: <Video size={20} />, label: 'Training Videos' },
        { path: '/care-protocols', icon: <Leaf size={20} />, label: 'Care Protocols' },
        { path: '/emergency-vet', icon: <AlertCircle size={20} />, label: 'Emergency Vet' },
      ]
    },
    {
      title: 'Tools',
      items: [
        { path: '/routine', icon: <Clock size={20} />, label: 'Smart Routine' },
        { path: '/support-bot', icon: <Bot size={20} />, label: 'Pro Support Bot' },
        { path: '/products', icon: <ShoppingBag size={20} />, label: 'Products Store' },
      ]
    },
    {
      title: 'Account',
      items: [
        { path: '/subscriptions', icon: <CreditCard size={20} />, label: 'Subscription' },
        { path: '/donations', icon: <Heart size={20} />, label: 'Donations' },
      ]
    },
  ];

  const handleLogout = () => {
    onClose();
    logout();
    navigate('/login');
  };

  const handleNavigate = () => {
    onClose();
  };

  if (!isOpen) return null;

  const planColors = {
    free: { bg: '#f0fdf4', color: '#16a34a', label: 'Free Plan' },
    pro: { bg: '#fef9c3', color: '#a16207', label: 'Pro Plan' },
    enterprise: { bg: '#ede9fe', color: '#7c3aed', label: 'Enterprise' },
  };

  const currentPlan = planColors[user?.subscription] || planColors.free;

  return (
    <>
      {/* Backdrop */}
      <div className="profile-drawer-overlay" onClick={onClose} />

      {/* Drawer */}
      <div className="profile-drawer">
        {/* Close button */}
        <button className="profile-drawer-close" onClick={onClose}>
          <X size={20} />
        </button>

        {/* User Profile Header */}
        <div className="profile-drawer-header">
          <div className="profile-drawer-avatar">
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div className="profile-drawer-user-info">
            <h3 className="profile-drawer-name">{user?.name || 'User'}</h3>
            <p className="profile-drawer-email">{user?.email || ''}</p>
            <span className="profile-drawer-plan" style={{ background: currentPlan.bg, color: currentPlan.color }}>
              {user?.subscription === 'pro' || user?.subscription === 'enterprise' ? <Crown size={12} /> : null}
              {currentPlan.label}
            </span>
          </div>
        </div>

        {/* Upgrade Banner (for free users) */}
        {user?.subscription === 'free' && (() => {
          const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
          const isIndia = tz.includes('Calcutta') || tz.includes('Kolkata');
          return (
            <div className="profile-drawer-upgrade" onClick={() => { onClose(); navigate('/subscriptions'); }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Crown size={20} color="#f59e0b" />
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#92400e' }}>Upgrade Your Plan</div>
                  <div style={{ fontSize: 11, color: '#a16207' }}>{isIndia ? 'Plans from ₹149/mo' : 'Plans from $4.99/mo'}</div>
                </div>
              </div>
              <ChevronRight size={18} color="#a16207" />
            </div>
          );
        })()}

        {/* Navigation Sections */}
        <div className="profile-drawer-nav">
          {navSections.map((section, idx) => (
            <div key={idx} className="profile-drawer-section">
              <div className="profile-drawer-section-title">{section.title}</div>
              {section.items.map(item => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) => `profile-drawer-item ${isActive ? 'active' : ''}`}
                  onClick={handleNavigate}
                >
                  <div className="profile-drawer-item-icon">{item.icon}</div>
                  <span>{item.label}</span>
                  <ChevronRight size={16} className="profile-drawer-item-arrow" />
                </NavLink>
              ))}
            </div>
          ))}

          {/* Admin Panel (if admin) */}
          {user?.role === 'admin' && (
            <div className="profile-drawer-section">
              <div className="profile-drawer-section-title">Admin</div>
              <NavLink
                to="/admin"
                className={({ isActive }) => `profile-drawer-item ${isActive ? 'active' : ''}`}
                onClick={handleNavigate}
              >
                <div className="profile-drawer-item-icon" style={{ background: 'rgba(139,92,246,0.1)', color: '#7c3aed' }}>
                  <Shield size={20} />
                </div>
                <span>Admin Panel</span>
                <ChevronRight size={16} className="profile-drawer-item-arrow" />
              </NavLink>
            </div>
          )}
        </div>

        {/* Logout */}
        <div className="profile-drawer-footer">
          <NavLink
            to="/privacy-policy"
            className="profile-drawer-item"
            onClick={handleNavigate}
            style={{ padding: '8px 16px', fontSize: 13, color: 'var(--text-light)' }}
          >
            <Shield size={16} />
            <span>Privacy Policy</span>
          </NavLink>
          <button className="profile-drawer-logout" onClick={handleLogout}>
            <LogOut size={20} />
            <span>Sign Out</span>
          </button>
          <div className="profile-drawer-version">PawCare AI v2.0</div>
        </div>
      </div>
    </>
  );
}
