import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Search, MapPin, ArrowUpRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import DonationBanner from '../components/DonationBanner';

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('Dogs');

  const categories = [
    { id: 'Dogs', icon: '🐶', label: 'Dogs' },
    { id: 'Cats', icon: '🐱', label: 'Cats' },
    { id: 'Birds', icon: '🐦', label: 'Birds' },
    { id: 'Fishes', icon: '🐠', label: 'Fishes' },
    { id: 'Rabbits', icon: '🐰', label: 'Rabbits' },
  ];

  const pets = [
    { id: 1, name: 'Golden Retriever', category: 'Dogs', distance: 'Distance (Near 15km)', img: 'https://images.unsplash.com/photo-1552053831-71594a27632d?fit=crop&w=600&h=400' },
    { id: 2, name: 'Persian Cat', category: 'Cats', distance: 'Distance (Near 5km)', img: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?fit=crop&w=600&h=400' },
    { id: 3, name: 'Macaw Parrot', category: 'Birds', distance: 'Distance (Near 8km)', img: 'https://images.unsplash.com/photo-1552728089-571ebd13ba3b?fit=crop&w=600&h=400' }
  ];

  const filteredPets = pets.filter(p => p.category === activeCategory);

  return (
    <div className="page-container">
      {/* Top Header */}
      <div className="flex-row justify-between items-center" style={{ marginBottom: '24px' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
          {user?.name?.charAt(0) || 'U'}
        </div>
        <div className="flex-col items-center">
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Location</span>
          <div className="flex-row items-center gap-2" style={{ fontWeight: 600, fontSize: '14px' }}>
            Chicago, US
          </div>
        </div>
        <button className="btn-icon" style={{ width: '40px', height: '40px', background: 'transparent' }}>
          <Bell size={20} />
        </button>
      </div>

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

      {/* Categories */}
      <div className="flex-row justify-between items-center" style={{ marginTop: '32px', marginBottom: '16px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 700 }}>Categories</h3>
        <span style={{ fontSize: '13px', color: 'var(--text-primary)', opacity: 0.6 }}>See All</span>
      </div>

      <div className="flex-row gap-3" style={{ overflowX: 'auto', paddingBottom: '8px', WebkitOverflowScrolling: 'touch' }}>
        {categories.map(cat => (
          <div 
            key={cat.id} 
            onClick={() => setActiveCategory(cat.id)}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', cursor: 'pointer', minWidth: '60px' }}
          >
            <div style={{ 
              width: '56px', height: '56px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px',
              background: activeCategory === cat.id ? 'var(--primary-light)' : 'var(--bg-card)',
              border: `1px solid ${activeCategory === cat.id ? 'var(--primary)' : 'var(--border)'}`,
              boxShadow: activeCategory === cat.id ? 'none' : '0 2px 8px rgba(0,0,0,0.05)',
              transition: 'all 0.2s'
            }}>
              {cat.icon}
            </div>
            <span style={{ fontSize: '12px', fontWeight: activeCategory === cat.id ? 600 : 500, color: activeCategory === cat.id ? 'var(--primary-dark)' : 'var(--text-main)' }}>
              {cat.label}
            </span>
          </div>
        ))}
      </div>

      {/* Pets Feed */}
      <div style={{ marginTop: '24px' }}>
        {filteredPets.length === 0 ? (
          <p style={{ textAlign: 'center', color: 'var(--text-muted)', margin: '40px 0' }}>No pets found in this category.</p>
        ) : (
          filteredPets.map(pet => (
            <div key={pet.id} className="card animate-fade-in" style={{ padding: '0', overflow: 'hidden', marginBottom: '20px' }} onClick={() => navigate(`/pet/${pet.id}`)}>
              <img src={pet.img} alt={pet.name} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
              <div style={{ padding: '16px', position: 'relative' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '4px' }}>{pet.name}</h3>
                <div className="flex-row items-center gap-2" style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
                  <MapPin size={14} /> {pet.distance}
                </div>
                
                {/* Floating Action Button inside card */}
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
