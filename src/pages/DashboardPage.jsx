import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Search, MapPin, Sparkles, Syringe, Dumbbell, Clock, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useRoutines } from '../context/RoutineContext';
import { PET_TYPES, petImages, formatTime } from '../utils';
import { api } from '../api';
import WelcomeModal from '../components/WelcomeModal';
import ProfileDrawer from '../components/ProfileDrawer';

export default function DashboardPage() {
  const { user } = useAuth();
  const { routines, loading: routinesLoading } = useRoutines();
  const navigate = useNavigate();
  const [location, setLocation] = useState('Detecting...');
  const [activeCategory, setActiveCategory] = useState('Dog');
  const [showWelcome, setShowWelcome] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    const init = async () => {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          async (pos) => {
            try {
              const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&format=json`);
              const data = await res.json();
              const city = data.address?.city || data.address?.town || data.address?.state || '';
              const country = data.address?.country || '';
              setLocation(`${city}${city && country ? ', ' : ''}${country}` || 'Location Found');
            } catch { setLocation('Location Available'); }
          },
          () => setLocation('Location Unavailable'),
          { timeout: 5000 }
        );
      } else { setLocation('Not Supported'); }

      try {
        const pets = await api.getPets();
        if (pets.length === 0 && !localStorage.getItem('has_seen_welcome')) {
          setShowWelcome(true);
        }
      } catch (err) {
        console.error('Failed to fetch pets', err);
      }
    };
    init();
  }, []);

  const quickActions = [
    { icon: <Sparkles size={20} />, label: 'AI Scan', color: '#22c55e', path: '/ai' },
    { icon: <Syringe size={20} />, label: 'Vaccines', color: '#3b82f6', path: '/vaccinations' },
    { icon: <Dumbbell size={20} />, label: 'Exercise', color: '#f59e0b', path: '/exercise' },
    { icon: <Clock size={20} />, label: 'Routine', color: '#8b5cf6', path: '/routine' },
  ];

  const petShowcase = {
    Dog: { img: petImages.dog, name: 'Golden Retriever', desc: 'Friendly, intelligent, devoted' },
    Cat: { img: petImages.cat, name: 'Persian Cat', desc: 'Calm, gentle, affectionate' },
    Bird: { img: petImages.bird, name: 'Macaw Parrot', desc: 'Colorful, intelligent, social' },
    Rabbit: { img: petImages.rabbit, name: 'Holland Lop', desc: 'Gentle, playful, cuddly' },
    Fish: { img: petImages.fish, name: 'Betta Fish', desc: 'Vibrant, graceful, easy-care' },
    Hamster: { img: petImages.hamster, name: 'Syrian Hamster', desc: 'Playful, curious, low-maintenance' },
    Goat: { img: petImages.goat, name: 'Nigerian Dwarf', desc: 'Gentle, friendly, hardy' },
    Horse: { img: petImages.horse, name: 'Arabian Horse', desc: 'Elegant, spirited, loyal' },
    Cow: { img: petImages.cow, name: 'Highland Cow', desc: 'Gentle, hardy, calm' },
  };

  const currentPet = petShowcase[activeCategory];

  // Logic to find next routine
  const getNextRoutine = () => {
    if (!routines || routines.length === 0) return null;
    const active = routines.filter(r => r.enabled);
    if (active.length === 0) return null;

    const now = new Date();
    const currentMin = now.getHours() * 60 + now.getMinutes();

    const sorted = [...active].sort((a, b) => {
      const [ah, am] = a.time.split(':').map(Number);
      const [bh, bm] = b.time.split(':').map(Number);
      return (ah * 60 + am) - (bh * 60 + bm);
    });

    let next = sorted.find(r => {
      const [rh, rm] = r.time.split(':').map(Number);
      return (rh * 60 + rm) > currentMin;
    });

    return next || sorted[0];
  };

  const nextRoutine = getNextRoutine();

  const routineBackgrounds = {
    Dog: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=800&q=80',
    Cat: 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=800&q=80',
    Bird: 'https://images.unsplash.com/photo-1444464666168-49d633b86797?w=800&q=80',
    Rabbit: 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=800&q=80',
  };

  return (
    <div className="page-container">
      {showWelcome && (
        <WelcomeModal onClose={() => {
          setShowWelcome(false);
          localStorage.setItem('has_seen_welcome', 'true');
        }} />
      )}

      {/* Profile Drawer */}
      <ProfileDrawer isOpen={showProfile} onClose={() => setShowProfile(false)} />

      {/* Header */}
      <div className="flex-row justify-between items-center" style={{ marginBottom: 24 }}>
        <div className="flex-row gap-3" onClick={() => setShowProfile(true)} style={{ cursor: 'pointer' }}>
          <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), var(--primary-light))', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: 18 }}>
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700 }}>Hi, {user?.name?.split(' ')[0] || 'there'} 👋</div>
            <div className="flex-row items-center gap-2" style={{ fontSize: 12, color: 'var(--text-muted)' }}>
              <MapPin size={12} /> {location}
            </div>
          </div>
        </div>
        <button className="btn-icon" onClick={() => navigate('/routine')}>
          <Bell size={20} />
        </button>
      </div>

      {/* Premium Pet Store Hero Banner */}
      <div 
        onClick={() => navigate(`/products?type=${activeCategory.toLowerCase()}`)}
        className="card" 
        style={{ 
          background: `linear-gradient(rgba(0,0,0,0.75), rgba(0,0,0,0.4)), url('/images/banners/store-hero.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          color: '#fff', 
          padding: '35px 24px', 
          borderRadius: '28px',
          marginBottom: '24px',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 12px 25px rgba(0,0,0,0.2)',
          cursor: 'pointer',
          border: 'none',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}
      >
        <div style={{ position: 'relative', zIndex: 2 }}>
          <span style={{ 
            background: '#FF9900', 
            padding: '4px 12px', 
            borderRadius: '50px', 
            fontSize: '9px', 
            fontWeight: '900', 
            textTransform: 'uppercase',
            letterSpacing: '1px',
            marginBottom: '10px',
            display: 'inline-block',
            boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
          }}>
            EXCLUSIVE STORE
          </span>
          <h2 style={{ fontSize: '22px', fontWeight: '800', marginBottom: '6px', lineHeight: '1.1', textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}>
            Best for your {activeCategory} 🐾
          </h2>
          <p style={{ opacity: 0.9, fontSize: '12px', maxWidth: '220px', marginBottom: '18px', lineHeight: '1.4' }}>
            Curated premium essentials to keep your pet healthy.
          </p>
          <button style={{ 
            background: '#fff', 
            color: '#FF9900', 
            padding: '10px 24px', 
            borderRadius: '14px', 
            border: 'none', 
            fontWeight: '800',
            fontSize: '13px',
            boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            width: 'fit-content'
          }}>
            Shop Now <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="search-container">
        <Search className="search-icon" size={18} />
        <input type="text" className="search-input" placeholder="Search pets, services..." />
      </div>

      {/* Premium Next Routine Section */}
      <div 
        onClick={() => navigate('/routine')}
        className="card" 
        style={{ 
          background: nextRoutine 
            ? `linear-gradient(rgba(139, 92, 246, 0.85), rgba(109, 40, 217, 0.6)), url('${routineBackgrounds[activeCategory] || routineBackgrounds.Dog}')`
            : 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          color: '#fff', 
          padding: '28px 24px', 
          borderRadius: '28px',
          marginBottom: '32px',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 12px 25px rgba(139, 92, 246, 0.3)',
          cursor: 'pointer',
          border: 'none',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <span style={{ 
              background: '#4ade80', 
              padding: '4px 12px', 
              borderRadius: '50px', 
              fontSize: '10px', 
              fontWeight: '900', 
              textTransform: 'uppercase',
              letterSpacing: '1px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
            }}>
              <span className="animate-pulse" style={{ width: 6, height: 6, borderRadius: '50%', background: '#fff' }}></span>
              Next Routine
            </span>
          </div>
          
          {!nextRoutine ? (
            <div>
              <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '6px', lineHeight: '1.1' }}>
                No routines set 📅
              </h2>
              <p style={{ opacity: 0.9, fontSize: '12px', marginBottom: '18px' }}>
                Tap to set up your pet's daily schedule and never miss a task.
              </p>
              <button style={{ 
                background: '#fff', 
                color: '#8b5cf6', 
                padding: '8px 20px', 
                borderRadius: '12px', 
                border: 'none', 
                fontWeight: '800',
                fontSize: '13px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                Setup Now <ChevronRight size={14} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                  <span style={{ fontSize: '32px', filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))' }}>{nextRoutine.icon || '🔔'}</span>
                  <h2 style={{ fontSize: '26px', fontWeight: '800', margin: 0, letterSpacing: '-0.5px', textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
                    {nextRoutine.title}
                  </h2>
                </div>
                
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 8, 
                  background: 'rgba(255,255,255,0.2)', 
                  backdropFilter: 'blur(10px)',
                  padding: '8px 16px', 
                  borderRadius: '16px', 
                  width: 'fit-content',
                  marginBottom: '20px',
                  border: '1px solid rgba(255,255,255,0.3)'
                }}>
                  <Clock size={18} style={{ opacity: 0.9 }} />
                  <span style={{ fontSize: '18px', fontWeight: '700' }}>{formatTime(nextRoutine.time)}</span>
                </div>

                <button style={{ 
                  background: '#fff', 
                  color: '#8b5cf6', 
                  padding: '10px 24px', 
                  borderRadius: '14px', 
                  border: 'none', 
                  fontWeight: '800',
                  fontSize: '13px',
                  boxShadow: '0 5px 15px rgba(0,0,0,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  Manage Schedule <ChevronRight size={14} />
                </button>
              </div>

              <div style={{ 
                width: 44, height: 44, borderRadius: '14px', background: 'rgba(255,255,255,0.2)', 
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.3)'
              }}>
                <ChevronRight size={24} />
              </div>
            </div>
          )}
        </div>
      </div>


      {/* Quick Actions */}
      <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>Quick Actions</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, marginBottom: 28 }}>
        {quickActions.map((a, i) => (
          <div key={i} onClick={() => navigate(a.path)} className="card" style={{ textAlign: 'center', padding: 16, cursor: 'pointer' }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: `${a.color}15`, color: a.color, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px' }}>
              {a.icon}
            </div>
            <div style={{ fontSize: 12, fontWeight: 600 }}>{a.label}</div>
          </div>
        ))}
      </div>

      {/* Pet Categories */}
      <div className="flex-row justify-between items-center" style={{ marginBottom: 12 }}>
        <h3 style={{ fontSize: 18, fontWeight: 700 }}>Explore Pets</h3>
      </div>
      <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 8, marginBottom: 16, maxWidth: '100%', WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {PET_TYPES.map(type => (
          <div key={type} onClick={() => setActiveCategory(type)}
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, cursor: 'pointer', minWidth: 70,
            }}>
            <div style={{
              width: 56, height: 56, borderRadius: '50%', overflow: 'hidden',
              border: activeCategory === type ? '3px solid var(--primary)' : '2px solid var(--border)',
              transition: 'all 0.2s'
            }}>
              <img src={petImages[type.toLowerCase()]} alt={type} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <span style={{ fontSize: 11, fontWeight: activeCategory === type ? 700 : 500, color: activeCategory === type ? 'var(--primary-dark)' : 'var(--text-main)' }}>
              {type}
            </span>
          </div>
        ))}
      </div>

      {/* Featured Pet Card */}
      {currentPet && (
        <div className="card animate-fade-in" style={{ padding: 0, overflow: 'hidden', marginBottom: 20 }}>
          <img src={currentPet.img} alt={currentPet.name} style={{ width: '100%', height: 220, objectFit: 'cover' }} />
          <div style={{ padding: 20 }}>
            <div className="flex-row justify-between items-center">
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>{currentPet.name}</h3>
                <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>{currentPet.desc}</p>
              </div>
              <button className="btn btn-primary btn-sm" onClick={() => navigate('/exercise')}>
                Care Guide →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Subscription Banner */}
      {user?.subscription === 'free' && (() => {
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
        const isIndia = tz.includes('Calcutta') || tz.includes('Kolkata');
        return (
          <div className="card" style={{ background: 'linear-gradient(135deg, rgba(34,197,94,0.1), rgba(74,222,128,0.05))', borderColor: 'var(--primary)', cursor: 'pointer', marginBottom: 20 }}
            onClick={() => navigate('/subscriptions')}>
            <div className="flex-row justify-between items-center">
              <div>
                <h4 style={{ fontFamily: 'var(--font-display)', marginBottom: 4 }}>🚀 Upgrade Your Plan</h4>
                <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Unlimited AI scans, no ads & premium features</p>
              </div>
              <span className="badge badge-success">{isIndia ? 'From ₹149/mo' : 'From $4.99/mo'}</span>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
