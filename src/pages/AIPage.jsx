import { useState, useEffect } from 'react';
import { api } from '../api';
import { getPetEmoji } from '../utils';
import toast from 'react-hot-toast';

export default function AIPage() {
  const [pets, setPets] = useState([]);
  const [selectedPet, setSelectedPet] = useState(null);
  const [activeTab, setActiveTab] = useState('styling');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [petsLoading, setPetsLoading] = useState(true);

  useEffect(() => { loadPets(); }, []);

  async function loadPets() {
    try {
      const data = await api.getPets();
      setPets(data.pets || []);
      if (data.pets?.length > 0) setSelectedPet(data.pets[0]);
    } catch (err) { toast.error('Failed to load pets'); }
    finally { setPetsLoading(false); }
  }

  async function runAI() {
    if (!selectedPet) { toast.error('Select a pet first'); return; }
    setLoading(true);
    setResults(null);
    try {
      await new Promise(r => setTimeout(r, 1500)); // Simulate AI delay
      const data = activeTab === 'styling'
        ? await api.getStyleSuggestions(selectedPet.id)
        : await api.getHealthTips(selectedPet.id);
      setResults(data);
      toast.success('AI analysis complete! ✨');
    } catch (err) { toast.error(err.message); }
    finally { setLoading(false); }
  }

  if (petsLoading) return <div className="loading-container"><div className="spinner"></div><p>Loading...</p></div>;

  if (pets.length === 0) {
    return (
      <div>
        <div className="page-header"><h2>AI Analysis 🤖</h2><p>AI-powered insights for your pets</p></div>
        <div className="empty-state card">
          <div className="empty-icon">🐾</div>
          <h3>Add a pet first</h3>
          <p>You need at least one pet profile to use AI features</p>
          <a href="/pets" className="btn btn-primary">Add Pet</a>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <h2>AI Analysis 🤖</h2>
        <p>Get AI-powered styling suggestions and health insights for your pets</p>
      </div>

      <div className="card" style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', gap: 16, alignItems: 'end', flexWrap: 'wrap' }}>
          <div className="form-group" style={{ marginBottom: 0, flex: 1, minWidth: 200 }}>
            <label className="form-label">Select Pet</label>
            <select className="form-input" value={selectedPet?.id || ''} onChange={e => setSelectedPet(pets.find(p => p.id === e.target.value))}>
              {pets.map(p => <option key={p.id} value={p.id}>{getPetEmoji(p.type)} {p.name} — {p.breed || p.type}</option>)}
            </select>
          </div>
          <div className="tab-nav" style={{ marginBottom: 0 }}>
            <button className={`tab-btn ${activeTab === 'styling' ? 'active' : ''}`} onClick={() => { setActiveTab('styling'); setResults(null); }}>✨ Styling</button>
            <button className={`tab-btn ${activeTab === 'health' ? 'active' : ''}`} onClick={() => { setActiveTab('health'); setResults(null); }}>💊 Health Tips</button>
          </div>
          <button className="btn btn-primary" onClick={runAI} disabled={loading}>
            {loading ? '⏳ Analyzing...' : '🚀 Run AI Analysis'}
          </button>
        </div>
      </div>

      {loading && (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>🤖 AI is analyzing {selectedPet?.name}...</p>
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>This may take a moment</p>
        </div>
      )}

      {results && activeTab === 'styling' && (
        <div>
          <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: 16 }}>
            ✨ Styling Suggestions for {results.pet?.name}
          </h3>
          <div className="card-grid">
            {results.styles?.map((style, i) => (
              <div className="ai-result-card animate-in" key={i} style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="ai-result-header">
                  <h4>{style.name}</h4>
                  <span className="badge badge-success">{(style.confidence * 100).toFixed(0)}% match</span>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.7 }}>{style.description}</p>
                <div className="confidence-bar">
                  <div className="confidence-fill" style={{ width: `${style.confidence * 100}%` }}></div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--text-muted)', margin: '12px 0' }}>
                  <span>💰 {style.estimatedCost}</span>
                  <span>⏱️ {style.estimatedTime}</span>
                </div>
                <div className="ai-tags">
                  {style.tags?.map((tag, j) => <span className="ai-tag" key={j}>{tag}</span>)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {results && activeTab === 'health' && (
        <div>
          <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: 16 }}>
            💊 Health Tips for {results.pet?.name}
          </h3>
          <div className="card-grid">
            {results.tips?.map((tip, i) => (
              <div className="health-card animate-in" key={i} style={{ animationDelay: `${i * 0.1}s` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <span className="health-category">{tip.category}</span>
                  <span className={`badge ${tip.priority === 'high' ? 'badge-danger' : 'badge-warning'}`}>{tip.priority}</span>
                </div>
                <h4>{tip.title}</h4>
                <p>{tip.tip}</p>
                <div className="personal-note">📝 {tip.personalNote}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
