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
    
    // Check scan limit for free users (5 free scans)
    const plan = localStorage.getItem('pawcare_plan');
    const isFreeUser = !plan || plan === 'free';
    if (isFreeUser && scanCount >= 5) {
      toast.error('Free limit reached! Upgrade to continue.');
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
            <button className={`tab-btn ${activeTab === 'health' ? 'active' : ''}`} onClick={() => { setActiveTab('health'); setResults(null); }}>💊 Health</button>
            <button className={`tab-btn ${activeTab === 'exercise' ? 'active' : ''}`} onClick={() => { setActiveTab('exercise'); setResults(null); }}>🏃 Exercise</button>
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
          {localStorage.getItem('pawcare_plan') !== 'premium' && localStorage.getItem('pawcare_plan') !== 'advance' && localStorage.getItem('pawcare_plan') !== 'pro' && (
            <span style={{ fontSize: 12, color: scanCount >= 5 ? '#ef4444' : 'var(--text-muted)' }}>
              📊 Free scans: {scanCount}/5 {scanCount >= 5 && '(Upgrade to continue)'}
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
        <div style={{ maxHeight: '500px', overflowY: 'auto', marginBottom: 20 }}>
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
        <div style={{ maxHeight: '500px', overflowY: 'auto', marginBottom: 20 }}>
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

      {results && activeTab === 'exercise' && (
        <div style={{ maxHeight: '500px', overflowY: 'auto', marginBottom: 20 }}>
          <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: 16 }}>
            🏃 Exercise & Training for {results.pet?.name}
          </h3>
          
          {results.pet?.type?.toLowerCase() === 'dog' && (
            <div className="card-grid">
              <div className="health-card"><h4>🐕 Daily Walks</h4><p>30-60 minutes of walking daily for physical health.</p></div>
              <div className="health-card"><h4>🎾 Fetch & Play</h4><p>15-20 minutes of fetch to burn energy.</p></div>
              <div className="health-card"><h4>🧠 Training</h4><p>10-15 mins daily for mental exercise.</p></div>
              <div className="health-card"><h4>🐕 Dog Park</h4><p>Socialize with other dogs 1-2 times/week.</p></div>
            </div>
          )}
          
          {results.pet?.type?.toLowerCase() === 'cat' && (
            <div className="card-grid">
              <div className="health-card"><h4>🧶 Interactive Play</h4><p>15-20 minutes with feather wands or lasers.</p></div>
              <div className="health-card"><h4>️ Climbing</h4><p>Cat trees for jumping exercise.</p></div>
              <div className="health-card"><h4>🧠 Puzzle Feeders</h4><p>Stimulate hunting instincts.</p></div>
              <div className="health-card"><h4>🐁 Toy Hunting</h4><p>Hide toys for simulated hunting.</p></div>
            </div>
          )}
          
          {results.pet?.type?.toLowerCase() === 'bird' && (
            <div className="card-grid">
              <div className="health-card"><h4>🕊️ Flight Time</h4><p>20-30 mins supervised flight in safe room.</p></div>
              <div className="health-card"><h4>🎵 Music & Talk</h4><p>Social interaction is exercise for birds!</p></div>
              <div className="health-card"><h4>🌿 Foraging</h4><p>Hide treats in toys for natural behavior.</p></div>
              <div className="health-card"><h4>🪜 Perch Hopping</h4><p>Multiple perches encourage movement.</p></div>
            </div>
          )}
          
          {results.pet?.type?.toLowerCase() === 'goat' && (
            <div className="card-grid">
              <div className="health-card"><h4>🌿 Grazing</h4><p>4-6 hours of grazing - natural exercise.</p></div>
              <div className="health-card"><h4>🪨 Climbing</h4><p>Rocks and platforms for climbing.</p></div>
              <div className="health-card"><h4>👥 Herd Time</h4><p>Socialize with other goats.</p></div>
              <div className="health-card"><h4>🎯 Training</h4><p>Simple commands for mental stimulation.</p></div>
            </div>
          )}
          
          {results.pet?.type?.toLowerCase() === 'fish' && (
            <div className="card-grid">
              <div className="health-card"><h4>💧 Water Current</h4><p>Gentle current for swimming exercise.</p></div>
              <div className="health-card"><h4>🎯 Feeding Games</h4><p>Scatter food to encourage swimming.</p></div>
              <div className="health-card"><h4>🪸 Tank Enrichment</h4><p>Decorations for exploration.</p></div>
            </div>
          )}
          
          {results.pet?.type?.toLowerCase() === 'rabbit' && (
            <div className="card-grid">
              <div className="health-card"><h4>🐇 Hop Space</h4><p>3-4 hours supervised hopping daily.</p></div>
              <div className="health-card"><h4>🧱 Tunnels</h4><p>Tunnel running for exercise.</p></div>
              <div className="health-card"><h4>🥬 Veggie Chase</h4><p>Place veggies around for movement.</p></div>
            </div>
          )}
          
          {['sheep', 'cow', 'horse', 'pig', 'camel', 'other'].includes(results.pet?.type?.toLowerCase()) && (
            <div className="card-grid">
              <div className="health-card"><h4>🏃 Free Movement</h4><p>Supervised exploration time daily.</p></div>
              <div className="health-card"><h4>🧠 Training</h4><p>Simple commands for mental stimulation.</p></div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
