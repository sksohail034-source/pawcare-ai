import { useState, useEffect } from 'react';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';
import { Users, PawPrint, Scan, Syringe, Heart, Crown, Trash2, ChevronDown, Shield, Activity, TrendingUp } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [activity, setActivity] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const [statsData, usersData, activityData] = await Promise.all([
        api.getAdminStats(),
        api.getAdminUsers(),
        api.getAdminActivity(),
      ]);
      setStats(statsData);
      setUsers(usersData.users);
      setActivity(activityData);
    } catch (err) {
      toast.error('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteUser(id, name) {
    if (!confirm(`Delete user "${name}"? This will remove ALL their data.`)) return;
    try {
      await api.deleteAdminUser(id);
      toast.success('User deleted');
      setUsers(prev => prev.filter(u => u.id !== id));
      loadData();
    } catch (err) {
      toast.error('Failed to delete user');
    }
  }

  async function handleUpdateSubscription(id, subscription) {
    try {
      await api.updateUserSubscription(id, subscription);
      toast.success('Subscription updated');
      setUsers(prev => prev.map(u => u.id === id ? { ...u, subscription } : u));
    } catch (err) {
      toast.error('Failed to update');
    }
  }

  if (user?.role !== 'admin') {
    return (
      <div className="page-container" style={{ textAlign: 'center', padding: '80px 20px' }}>
        <Shield size={64} style={{ color: '#ef4444', marginBottom: 16 }} />
        <h2>Access Denied</h2>
        <p style={{ color: '#6b7280' }}>You don't have admin privileges.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading admin panel...</p>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Shield size={28} /> Admin Panel
        </h1>
        <p className="page-subtitle">Platform management & analytics</p>
      </div>

      {/* Tab Navigation */}
      <div className="admin-tabs">
        {['overview', 'users', 'activity'].map(tab => (
          <button
            key={tab}
            className={`admin-tab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === 'overview' && <TrendingUp size={16} />}
            {tab === 'users' && <Users size={16} />}
            {tab === 'activity' && <Activity size={16} />}
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && stats && (
        <div>
          <div className="admin-stats-grid">
            <div className="admin-stat-card" style={{ borderLeft: '4px solid #22c55e' }}>
              <div className="admin-stat-icon" style={{ background: 'rgba(34,197,94,0.1)', color: '#22c55e' }}><Users size={24} /></div>
              <div className="admin-stat-info">
                <span className="admin-stat-value">{stats.totalUsers}</span>
                <span className="admin-stat-label">Total Users</span>
              </div>
            </div>
            <div className="admin-stat-card" style={{ borderLeft: '4px solid #3b82f6' }}>
              <div className="admin-stat-icon" style={{ background: 'rgba(59,130,246,0.1)', color: '#3b82f6' }}><PawPrint size={24} /></div>
              <div className="admin-stat-info">
                <span className="admin-stat-value">{stats.totalPets}</span>
                <span className="admin-stat-label">Total Pets</span>
              </div>
            </div>
            <div className="admin-stat-card" style={{ borderLeft: '4px solid #8b5cf6' }}>
              <div className="admin-stat-icon" style={{ background: 'rgba(139,92,246,0.1)', color: '#8b5cf6' }}><Scan size={24} /></div>
              <div className="admin-stat-info">
                <span className="admin-stat-value">{stats.totalScans}</span>
                <span className="admin-stat-label">AI Scans</span>
              </div>
            </div>
            <div className="admin-stat-card" style={{ borderLeft: '4px solid #f59e0b' }}>
              <div className="admin-stat-icon" style={{ background: 'rgba(245,158,11,0.1)', color: '#f59e0b' }}><Syringe size={24} /></div>
              <div className="admin-stat-info">
                <span className="admin-stat-value">{stats.totalVaccinations}</span>
                <span className="admin-stat-label">Vaccinations</span>
              </div>
            </div>
            <div className="admin-stat-card" style={{ borderLeft: '4px solid #ef4444' }}>
              <div className="admin-stat-icon" style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444' }}><Heart size={24} /></div>
              <div className="admin-stat-info">
                <span className="admin-stat-value">${(stats.totalDonations || 0).toFixed(2)}</span>
                <span className="admin-stat-label">Total Donations</span>
              </div>
            </div>
            <div className="admin-stat-card" style={{ borderLeft: '4px solid #06b6d4' }}>
              <div className="admin-stat-icon" style={{ background: 'rgba(6,182,212,0.1)', color: '#06b6d4' }}><Crown size={24} /></div>
              <div className="admin-stat-info">
                <span className="admin-stat-value">{stats.subscriptions.pro + stats.subscriptions.enterprise}</span>
                <span className="admin-stat-label">Paid Users</span>
              </div>
            </div>
          </div>

          {/* Subscription Breakdown */}
          <div className="admin-section">
            <h3 style={{ marginBottom: 16 }}>📊 Subscription Breakdown</h3>
            <div className="admin-sub-bars">
              <div className="admin-sub-bar">
                <div className="admin-sub-bar-label">Free</div>
                <div className="admin-sub-bar-track">
                  <div className="admin-sub-bar-fill" style={{ width: `${stats.totalUsers ? (stats.subscriptions.free / stats.totalUsers) * 100 : 0}%`, background: '#94a3b8' }}></div>
                </div>
                <div className="admin-sub-bar-count">{stats.subscriptions.free}</div>
              </div>
              <div className="admin-sub-bar">
                <div className="admin-sub-bar-label">Pro</div>
                <div className="admin-sub-bar-track">
                  <div className="admin-sub-bar-fill" style={{ width: `${stats.totalUsers ? (stats.subscriptions.pro / stats.totalUsers) * 100 : 0}%`, background: '#22c55e' }}></div>
                </div>
                <div className="admin-sub-bar-count">{stats.subscriptions.pro}</div>
              </div>
              <div className="admin-sub-bar">
                <div className="admin-sub-bar-label">Enterprise</div>
                <div className="admin-sub-bar-track">
                  <div className="admin-sub-bar-fill" style={{ width: `${stats.totalUsers ? (stats.subscriptions.enterprise / stats.totalUsers) * 100 : 0}%`, background: '#8b5cf6' }}></div>
                </div>
                <div className="admin-sub-bar-count">{stats.subscriptions.enterprise}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="admin-section">
          <h3 style={{ marginBottom: 16 }}>👥 All Users ({users.length})</h3>
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Plan</th>
                  <th>Scans</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id}>
                    <td style={{ fontWeight: 600 }}>{u.name}</td>
                    <td style={{ color: '#6b7280' }}>{u.email}</td>
                    <td>
                      <span className={`admin-badge ${u.role === 'admin' ? 'admin-badge-admin' : 'admin-badge-user'}`}>
                        {u.role === 'admin' ? '👑 Admin' : '👤 User'}
                      </span>
                    </td>
                    <td>
                      {u.role === 'admin' ? (
                        <span className="admin-badge admin-badge-enterprise">Enterprise</span>
                      ) : (
                        <select
                          value={u.subscription}
                          onChange={(e) => handleUpdateSubscription(u.id, e.target.value)}
                          className="admin-select"
                        >
                          <option value="free">Free</option>
                          <option value="pro">Pro</option>
                          <option value="enterprise">Enterprise</option>
                        </select>
                      )}
                    </td>
                    <td>{u.scan_count || 0}</td>
                    <td style={{ color: '#6b7280', fontSize: 13 }}>
                      {u.created_at ? new Date(u.created_at).toLocaleDateString() : '—'}
                    </td>
                    <td>
                      {u.role !== 'admin' && (
                        <button className="admin-delete-btn" onClick={() => handleDeleteUser(u.id, u.name)} title="Delete user">
                          <Trash2 size={16} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Activity Tab */}
      {activeTab === 'activity' && activity && (
        <div>
          <div className="admin-activity-grid">
            <div className="admin-section">
              <h3>🆕 Recent Users</h3>
              {activity.recentUsers.length === 0 ? (
                <p style={{ color: '#9ca3af', padding: 16 }}>No users yet</p>
              ) : (
                activity.recentUsers.map((u, i) => (
                  <div key={i} className="admin-activity-item">
                    <div className="admin-activity-dot" style={{ background: '#22c55e' }}></div>
                    <div>
                      <strong>{u.name}</strong>
                      <span style={{ color: '#6b7280', marginLeft: 8, fontSize: 13 }}>{u.email}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="admin-section">
              <h3>🐾 Recent Pets</h3>
              {activity.recentPets.length === 0 ? (
                <p style={{ color: '#9ca3af', padding: 16 }}>No pets yet</p>
              ) : (
                activity.recentPets.map((p, i) => (
                  <div key={i} className="admin-activity-item">
                    <div className="admin-activity-dot" style={{ background: '#3b82f6' }}></div>
                    <div>
                      <strong>{p.name}</strong> ({p.type})
                      <span style={{ color: '#6b7280', marginLeft: 8, fontSize: 13 }}>by {p.owner}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="admin-section">
              <h3>❤️ Recent Donations</h3>
              {activity.recentDonations.length === 0 ? (
                <p style={{ color: '#9ca3af', padding: 16 }}>No donations yet</p>
              ) : (
                activity.recentDonations.map((d, i) => (
                  <div key={i} className="admin-activity-item">
                    <div className="admin-activity-dot" style={{ background: '#ef4444' }}></div>
                    <div>
                      <strong>${d.amount}</strong> to {d.organization}
                      <span style={{ color: '#6b7280', marginLeft: 8, fontSize: 13 }}>by {d.donor}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
