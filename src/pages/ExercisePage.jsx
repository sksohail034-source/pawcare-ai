import { useState, useEffect } from 'react';
import { api } from '../api';
import { PET_TYPES, petImages, getPetEmoji } from '../utils';
import toast from 'react-hot-toast';
import AdModal from '../components/AdModal';

export default function ExercisePage() {
  const [selectedType, setSelectedType] = useState('dog');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('exercises');
  const [showAd, setShowAd] = useState(false);
  const [unlocked, setUnlocked] = useState(sessionStorage.getItem('exercise_features_unlocked') === 'true');

  useEffect(() => { loadData(selectedType); }, [selectedType]);

  async function loadData(type) {
    setLoading(true);
    try {
      const d = await api.getExercisePlan(type);
      setData(d);
    } catch (err) { toast.error('Failed to load exercise data'); }
    finally { setLoading(false); }
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>Exercise & Care 🏃</h2>
        <p>AI-powered exercise plans and care tips for your pets</p>
      </div>

      {!unlocked && JSON.parse(localStorage.getItem('user') || '{}').subscription === 'free' && JSON.parse(localStorage.getItem('user') || '{}').role !== 'admin' ? (
        <div className="card" style={{ textAlign: 'center', padding: '40px 20px' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🔒</div>
          <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: 8 }}>Premium Feature</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: 24 }}>Watch a short ad to unlock AI Exercise & Care plans for this session, or upgrade to Advance for ad-free access.</p>
          <button className="btn btn-primary btn-lg" onClick={() => setShowAd(true)}>📺 Watch Ad to Unlock</button>
          
          {showAd && <AdModal 
            title="Unlocking Exercise Plans" 
            onClose={() => setShowAd(false)} 
            onReward={() => {
              sessionStorage.setItem('exercise_features_unlocked', 'true');
              setUnlocked(true);
            }} 
          />}
        </div>
      ) : (
      <>
      {/* Pet Type Selector */}
      <div className="pet-type-grid">
        {PET_TYPES.map(type => (
          <div key={type} className={`pet-type-card ${selectedType === type.toLowerCase() ? 'active' : ''}`}
            onClick={() => setSelectedType(type.toLowerCase())}>
            <img src={petImages[type.toLowerCase()]} alt={type} />
            <span>{type}</span>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="tab-nav" style={{ marginBottom: 24 }}>
        <button className={`tab-btn ${activeTab === 'exercises' ? 'active' : ''}`} onClick={() => setActiveTab('exercises')}>🏃 Exercises</button>
        <button className={`tab-btn ${activeTab === 'grooming' ? 'active' : ''}`} onClick={() => setActiveTab('grooming')}>✂️ Grooming</button>
        <button className={`tab-btn ${activeTab === 'feeding' ? 'active' : ''}`} onClick={() => setActiveTab('feeding')}>🍖 Feeding</button>
        <button className={`tab-btn ${activeTab === 'health' ? 'active' : ''}`} onClick={() => setActiveTab('health')}>💊 Health</button>
      </div>

      {loading ? (
        <div className="loading-container"><div className="spinner"></div><p>Loading...</p></div>
      ) : data && (
        <>
          {activeTab === 'exercises' && (
            <div className="exercise-grid">
              {data.exercises?.map((ex, i) => (
                <div key={i} className="exercise-card animate-in" style={{ animationDelay: `${i * 0.1}s` }}>
                  <img src={ex.image} alt={ex.name} />
                  <div className="exercise-card-body">
                    <div className="flex-row justify-between items-center" style={{ marginBottom: 8 }}>
                      <h4>{ex.icon} {ex.name}</h4>
                    </div>
                    <p>{ex.description}</p>
                    <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                      <span className="badge badge-info">⏱️ {ex.duration}</span>
                      <span className="badge badge-success">📅 {ex.frequency}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'grooming' && data.aiTips && (
            <div className="card-grid">
              <div className="card">
                <h4 style={{ fontFamily: 'var(--font-display)', marginBottom: 12 }}>✂️ Grooming Guide</h4>
                <p style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--text-muted)' }}>{data.aiTips.grooming}</p>
              </div>
              <div className="card">
                <h4 style={{ fontFamily: 'var(--font-display)', marginBottom: 12 }}>🎒 Recommended Accessories</h4>
                <p style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--text-muted)' }}>{data.aiTips.accessories}</p>
              </div>
              <div className="card">
                <h4 style={{ fontFamily: 'var(--font-display)', marginBottom: 12 }}>📋 Daily Routine</h4>
                <p style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--text-muted)' }}>{data.aiTips.routine}</p>
              </div>
            </div>
          )}

          {activeTab === 'feeding' && data.aiTips && (
            <div className="card">
              <h4 style={{ fontFamily: 'var(--font-display)', marginBottom: 12 }}>🍖 Feeding Plan</h4>
              <p style={{ fontSize: 14, lineHeight: 1.8, color: 'var(--text-muted)' }}>{data.aiTips.feeding}</p>
              <div className="alert-banner success" style={{ marginTop: 16 }}>
                💡 AI Tip: Always ensure fresh water is available and adjust portions based on activity level.
              </div>
            </div>
          )}

          {activeTab === 'health' && data.aiTips && (
            <div className="card">
              <h4 style={{ fontFamily: 'var(--font-display)', marginBottom: 12 }}>💊 Health Care Tips</h4>
              <p style={{ fontSize: 14, lineHeight: 1.8, color: 'var(--text-muted)' }}>{data.aiTips.health}</p>
              <div className="alert-banner warning" style={{ marginTop: 16 }}>
                ⚠️ Regular vet checkups are essential. Don't skip annual vaccinations.
              </div>
            </div>
          )}
        </>
      )}
      </>
      )}
    </div>
  );
}
