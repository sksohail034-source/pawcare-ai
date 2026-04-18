import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';
import { getPetEmoji } from '../utils';
import toast from 'react-hot-toast';

export default function AIPage() {
  const navigate = useNavigate();
  const [pets, setPets] = useState([]);
  const [selectedPet, setSelectedPet] = useState(null);
  const [activeTab, setActiveTab] = useState('styling');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [petsLoading, setPetsLoading] = useState(true);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [scanCount, setScanCount] = useState(0);
  const fileInputRef = useRef(null);

  useEffect(() => { 
    loadPets(); 
    const saved = localStorage.getItem('pawcare_scan_count');
    if (saved) setScanCount(parseInt(saved));
  }, []);

  function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Image must be less than 10MB');
      return;
    }
    
    setUploadedImage(file);
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
    toast.success('Photo uploaded! Ready for AI analysis');
  }

  function clearImage() {
    setUploadedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  async function runAI() {
    if (!selectedPet) { toast.error('Select a pet first'); return; }
    if (!uploadedImage) { toast.error('Please upload a pet photo first'); return; }
    
    // Check scan limit for free users (3 free scans)
    const isFreeUser = localStorage.getItem('pawcare_plan') !== 'premium';
    if (isFreeUser && scanCount >= 3) {
      toast.error('Free trial limit reached! Upgrade to continue.');
      setTimeout(() => navigate('/subscriptions'), 2000);
      return;
    }
    
    setLoading(true);
    setResults(null);
    try {
      await new Promise(r => setTimeout(r, 2500));
      
      const data = activeTab === 'styling'
        ? await api.getStyleSuggestions(selectedPet.id)
        : await api.getHealthTips(selectedPet.id);
      
      // Update scan count
      const newCount = scanCount + 1;
      setScanCount(newCount);
      localStorage.setItem('pawcare_scan_count', newCount);
      
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
        </div>
        
        <div style={{ marginTop: 20, paddingTop: 20, borderTop: '1px solid var(--border)' }}>
          <label className="form-label">📸 Upload Pet Photo</label>
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            onChange={handleImageUpload}
            style={{ display: 'none' }}
          />
          {imagePreview ? (
            <div style={{ position: 'relative', marginTop: 12 }}>
              <img src={imagePreview} alt="Pet preview" style={{ width: '100%', maxHeight: 200, borderRadius: 16, objectFit: 'cover' }} />
              <button 
                onClick={clearImage}
                style={{
                  position: 'absolute', top: 8, right: 8,
                  background: 'rgba(0,0,0,0.6)', color: 'white',
                  border: 'none', borderRadius: '50%', width: 32, height: 32,
                  cursor: 'pointer', fontSize: 18
                }}
              >✕</button>
              <div style={{ marginTop: 8, color: 'var(--success)', fontSize: 13 }}>✓ Photo ready for analysis</div>
            </div>
          ) : (
            <div 
              onClick={() => fileInputRef.current?.click()}
              style={{
                border: '2px dashed var(--border-hover)',
                borderRadius: 16, padding: 32, textAlign: 'center',
                cursor: 'pointer', marginTop: 12,
                background: 'var(--bg-app)', transition: 'all 0.3s'
              }}
            >
              <div style={{ fontSize: 40, marginBottom: 8 }}>📷</div>
              <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Tap to upload pet photo</p>
              <p style={{ color: 'var(--text-light)', fontSize: 12, marginTop: 4 }}>JPG, PNG up to 10MB</p>
            </div>
          )}
        </div>
        
        <button className="btn btn-primary btn-full" onClick={runAI} disabled={loading || !uploadedImage} style={{ marginTop: 16 }}>
          {loading ? '⏳ Analyzing...' : '🚀 Run AI Analysis'}
        </button>
        
        <div style={{ marginTop: 12, textAlign: 'center' }}>
          {localStorage.getItem('pawcare_plan') !== 'premium' && (
            <span style={{ fontSize: 12, color: scanCount >= 3 ? '#ef4444' : 'var(--text-muted)' }}>
              📊 Free scans: {scanCount}/3 {scanCount >= 3 && '(Upgrade to continue)'}
            </span>
          )}
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
