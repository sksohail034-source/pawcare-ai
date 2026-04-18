import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Search, MapPin, ArrowUpRight, Activity, Cpu, Gift, Star } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';
import { getPetEmoji, daysUntil } from '../utils';
import DonationBanner from '../components/DonationBanner';

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [pets, setPets] = useState([]);
  const [stats, setStats] = useState({ petsCount: 0, aiUsage: 0, vaccinations: 0, donations: 0 });
  const [location, setLocation] = useState(null);
  const [locationLoading, setLocationLoading] = useState(true);
  const [locationError, setLocationError] = useState(null);

  useEffect(() => {
    loadData();
    getUserLocation();
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
        vaccinations: 0, // Placeholder
        donations: donData.totalDonated || 0
      });
    } catch (err) {
      console.error(err);
    }
  }

  async function getUserLocation() {
    if (!navigator.geolocation) {
      setLocation('Location unavailable');
      setLocationLoading(false);
      return;
    }

    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          timeout: 10000,
          enableHighAccuracy: false
        });
      });

      const { latitude, longitude } = position.coords;
      
      // Use reverse geocoding to get city/country
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
        );
        const data = await response.json();
        const city = data.address?.city || data.address?.town || data.address?.village || '';
        const country = data.address?.country || '';
        setLocation(city && country ? `${city}, ${country}` : `${latitude.toFixed(2)}, ${longitude.toFixed(2)}`);
      } catch {
        setLocation(`${latitude.toFixed(2)}°, ${longitude.toFixed(2)}°`);
      }
    } catch (err) {
      setLocationError('Location access denied');
      setLocation('Set your location');
    } finally {
      setLocationLoading(false);
    }
  }

  const trialDays = user?.trial_ends_at ? daysUntil(user.trial_ends_at) : null;

  return (
    <div className="page-container">
      {/* Top Header */}
      <div className="flex-row justify-between items-center" style={{ marginBottom: '24px' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
          {user?.name?.charAt(0) || 'U'}
        </div>
        <div className="flex-col items-center">
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>📍 Location</span>
          <div className="flex-row items-center gap-2" style={{ fontWeight: 600, fontSize: '14px' }}>
            {locationLoading ? (
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Detecting...</span>
            ) : locationError ? (
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{locationError}</span>
            ) : (
              <span>{location}</span>
            )}
          </div>
        </div>
        <button className="btn-icon" style={{ width: '40px', height: '40px', background: 'transparent' }}>
          <Bell size={20} />
        </button>
      </div>

      {/* Greeting */}
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 800 }}>Welcome back, {user?.name?.split(' ')[0]}! 👋</h2>
        <p style={{ color: 'var(--text-muted)' }}>Here's what's happening with your pets today.</p>
      </div>

      {/* Free Trial Banner */}
      {user?.subscription === 'free_trial' && trialDays !== null && (
        <div className="card animate-fade-in" style={{ marginBottom: 24, background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(134, 239, 172, 0.2))', border: '1px solid var(--primary-light)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <strong style={{ color: 'var(--primary-dark)' }}>Free Trial Active</strong>
              <p style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 4 }}>
                {trialDays > 0 ? `${trialDays} days remaining` : 'Trial expired'}
              </p>
            </div>
            <button onClick={() => navigate('/subscriptions')} className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '14px' }}>Upgrade Now</button>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="search-container">
        <Search className="search-icon" size={20} />
        <input 
          type="text" 
          className="search-input" 
          placeholder="Search pets, services..."
        />
      </div>

      <DonationBanner />

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginTop: '24px', marginBottom: '32px' }}>
        <div className="card flex-col items-center justify-center p-4">
          <Activity size={24} color="var(--primary)" style={{ marginBottom: '8px' }} />
          <div style={{ fontSize: '20px', fontWeight: 700 }}>{stats.petsCount}</div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>My Pets</div>
        </div>
        <div className="card flex-col items-center justify-center p-4">
          <Cpu size={24} color="#8b5cf6" style={{ marginBottom: '8px' }} />
          <div style={{ fontSize: '20px', fontWeight: 700 }}>{stats.aiUsage}</div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>AI Analyses</div>
        </div>
        <div className="card flex-col items-center justify-center p-4">
          <Gift size={24} color="#ec4899" style={{ marginBottom: '8px' }} />
          <div style={{ fontSize: '20px', fontWeight: 700 }}>${stats.donations.toFixed(2)}</div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Donated</div>
        </div>
        <div className="card flex-col items-center justify-center p-4">
          <Star size={24} color="#f59e0b" style={{ marginBottom: '8px' }} />
          <div style={{ fontSize: '16px', fontWeight: 700, textTransform: 'capitalize' }}>{user?.subscription?.replace('_', ' ')}</div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Plan</div>
        </div>
      </div>

      {/* Quick Actions (Replacing Horizontal Categories conceptually) */}
      <div className="flex-row justify-between items-center" style={{ marginTop: '32px', marginBottom: '16px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 700 }}>Quick Actions</h3>
      </div>
      <div className="flex-row gap-3" style={{ overflowX: 'auto', paddingBottom: '8px', WebkitOverflowScrolling: 'touch' }}>
        {[
          { icon: '➕', label: 'Add Pet', path: '/pets' },
          { icon: '🤖', label: 'AI Health', path: '/ai' },
          { icon: '💉', label: 'Vaccines', path: '/vaccinations' },
          { icon: '🛍️', label: 'Shop', path: '/products' },
        ].map(action => (
          <div 
            key={action.label} 
            onClick={() => navigate(action.path)}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', cursor: 'pointer', minWidth: '70px' }}
          >
            <div style={{ 
              width: '56px', height: '56px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px',
              background: 'var(--bg-card)', border: '1px solid var(--border)', boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
            }}>
              {action.icon}
            </div>
            <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-main)', textAlign: 'center' }}>
              {action.label}
            </span>
          </div>
        ))}
      </div>

      {/* Real Pets Feed */}
      <div className="flex-row justify-between items-center" style={{ marginTop: '32px', marginBottom: '16px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 700 }}>My Pets</h3>
        <span style={{ fontSize: '13px', color: 'var(--primary)', fontWeight: 600 }} onClick={() => navigate('/pets')}>View All</span>
      </div>

      <div style={{ marginTop: '16px' }}>
        {pets.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '40px 20px' }}>
            <div style={{ fontSize: '40px', marginBottom: '16px' }}>🐾</div>
            <h3 style={{ marginBottom: '8px' }}>No pets yet</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '24px', fontSize: '14px' }}>Add your first pet to get started with AI-powered care</p>
            <button className="btn btn-primary" onClick={() => navigate('/pets')}>Add Your Pet</button>
          </div>
        ) : (
          pets.map(pet => (
            <div key={pet.id} className="card animate-fade-in" style={{ padding: '0', overflow: 'hidden', marginBottom: '20px' }} onClick={() => navigate(`/pets`)}>
              <div style={{ 
                height: '140px', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '60px'
              }}>
                {getPetEmoji(pet.type)}
              </div>
              <div style={{ padding: '16px', position: 'relative' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>{pet.name}</h3>
                
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '8px' }}>
                  <span style={{ background: 'var(--bg-app)', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 600 }}>{pet.type}</span>
                  {pet.breed && <span style={{ background: 'var(--bg-app)', padding: '4px 10px', borderRadius: '12px', fontSize: '12px' }}>{pet.breed}</span>}
                  {pet.age > 0 && <span style={{ background: 'var(--bg-app)', padding: '4px 10px', borderRadius: '12px', fontSize: '12px' }}>{pet.age} yrs</span>}
                </div>
                
                <button style={{
                  position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)',
                  width: '40px', height: '40px', borderRadius: '50%', background: 'var(--text-main)', color: 'white',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <ArrowUpRight size={20} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
