import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';
import { getPetEmoji, daysUntil } from '../utils';

export default function DashboardPage() {
  const { user } = useAuth();
  const [pets, setPets] = useState([]);
  const [stats, setStats] = useState({ petsCount: 0, aiUsage: 0, vaccinations: 0, donations: 0 });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [petsData, aiData, donData] = await Promise.all([
        api.getPets(),
        api.getAIHistory(),
        api.getDonationHistory()
      ]);
      setPets(petsData.pets || []);
      setStats({
        petsCount: petsData.pets?.length || 0,
        aiUsage: aiData.history?.length || 0,
        vaccinations: 0,
        donations: donData.totalDonated || 0
      });
    } catch (err) {
      console.error(err);
    }
  }

  const trialDays = user?.trial_ends_at ? daysUntil(user.trial_ends_at) : null;

  return (
    <div>
      <div className="page-header">
        <h2>Welcome back, {user?.name?.split(' ')[0]}! 👋</h2>
        <p>Here's what's happening with your pets today</p>
      </div>

      {user?.subscription === 'free_trial' && trialDays !== null && (
        <div className="card" style={{ marginBottom: 24, background: 'linear-gradient(135deg, rgba(108, 92, 231, 0.1), rgba(0, 206, 201, 0.05))', border: '1px solid rgba(108, 92, 231, 0.3)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <strong>Free Trial Active</strong>
              <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginTop: 4 }}>
                {trialDays > 0 ? `${trialDays} days remaining` : 'Trial expired'}
              </p>
            </div>
            <a href="/subscriptions" className="btn btn-primary btn-sm">Upgrade Now</a>
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20, marginBottom: 32 }}>
        <div className="stat-card">
          <div className="stat-icon purple">🐾</div>
          <div>
            <div className="stat-value">{stats.petsCount}</div>
            <div className="stat-label">My Pets</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon teal">🤖</div>
          <div>
            <div className="stat-value">{stats.aiUsage}</div>
            <div className="stat-label">AI Analyses</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon pink">❤️</div>
          <div>
            <div className="stat-value">${stats.donations.toFixed(2)}</div>
            <div className="stat-label">Total Donated</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green">⭐</div>
          <div>
            <div className="stat-value" style={{ textTransform: 'capitalize' }}>{user?.subscription?.replace('_', ' ')}</div>
            <div className="stat-label">Current Plan</div>
          </div>
        </div>
      </div>

      <div className="page-header" style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: 22 }}>My Pets</h2>
      </div>

      {pets.length === 0 ? (
        <div className="empty-state card">
          <div className="empty-icon">🐾</div>
          <h3>No pets yet</h3>
          <p>Add your first pet to get started with AI-powered care</p>
          <a href="/pets" className="btn btn-primary">Add Your Pet</a>
        </div>
      ) : (
        <div className="card-grid">
          {pets.map(pet => (
            <div className="pet-card" key={pet.id}>
              <div className={`pet-card-image ${pet.type?.toLowerCase()}`}>
                {getPetEmoji(pet.type)}
              </div>
              <div className="pet-card-body">
                <h3>{pet.name}</h3>
                <span className="badge badge-primary" style={{ marginTop: 4 }}>{pet.type}</span>
                <div className="pet-card-info">
                  {pet.breed && <span>🏷️ {pet.breed}</span>}
                  {pet.age > 0 && <span>📅 {pet.age}y</span>}
                  {pet.weight > 0 && <span>⚖️ {pet.weight}lb</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{ marginTop: 32 }}>
        <div className="card" style={{ background: 'linear-gradient(135deg, rgba(253, 121, 168, 0.08), rgba(253, 203, 110, 0.04))' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: 8 }}>💡 Quick Actions</h3>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 16 }}>
            <a href="/pets" className="btn btn-primary btn-sm">➕ Add Pet</a>
            <a href="/ai" className="btn btn-secondary btn-sm">🤖 AI Analysis</a>
            <a href="/vaccinations" className="btn btn-secondary btn-sm">💉 Vaccinations</a>
            <a href="/products" className="btn btn-secondary btn-sm">🛍️ Products</a>
            <a href="/donate" className="btn btn-accent btn-sm">❤️ Donate</a>
          </div>
        </div>
      </div>
    </div>
  );
}
