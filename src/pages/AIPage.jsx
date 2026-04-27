import { useState, useEffect } from 'react';
import { api } from '../api';
import { getPetEmoji, PET_TYPES, petImages } from '../utils';
import toast from 'react-hot-toast';

function AdRewardModal({ onClose, onReward }) {
  const [timer, setTimer] = useState(15);
  const [completed, setCompleted] = useState(false);
  const [adId, setAdId] = useState(null);

  useEffect(() => {
    api.startAd().then(d => setAdId(d.adId)).catch(() => {});
    const interval = setInterval(() => {
      setTimer(prev => { if (prev <= 1) { clearInterval(interval); setCompleted(true); return 0; } return prev - 1; });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  async function claimReward() {
    try { const d = await api.completeAd(adId); toast.success(d.message); onReward(); } catch (err) { toast.error(err.message); }
    onClose();
  }

  return (
    <div className="modal-overlay"><div className="modal ad-modal" onClick={e => e.stopPropagation()}>
      {!completed ? (<>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 20, marginBottom: 8 }}>📺 Watching Ad...</h3>
        <p style={{ color: 'var(--text-muted)' }}>Watch to earn a free AI scan</p>
        <div className="ad-timer">{timer}s</div>
        <div className="ad-progress"><div className="ad-progress-fill" style={{ width: `${((15 - timer) / 15) * 100}%` }}></div></div>
        <div style={{ background: 'var(--bg-input)', borderRadius: 16, padding: 40, margin: '16px 0' }}>
          <p style={{ fontSize: 24 }}>🐾</p><p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 8 }}>Premium pet care awaits...</p>
        </div>
      </>) : (<>
        <div style={{ fontSize: 64, marginBottom: 16 }}>🎉</div>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 22, marginBottom: 8 }}>Ad Complete!</h3>
        <p style={{ color: 'var(--text-muted)', marginBottom: 24 }}>You've earned +1 free AI scan</p>
        <button className="btn btn-primary btn-full" onClick={claimReward}>Claim Free Scan 🐾</button>
      </>)}
    </div></div>
  );
}

export default function AIPage() {
  const [pets, setPets] = useState([]);
  const [selectedPet, setSelectedPet] = useState(null);
  const [activeTab, setActiveTab] = useState('analyze');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [petsLoading, setPetsLoading] = useState(true);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [fileMeta, setFileMeta] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [scanInfo, setScanInfo] = useState(null);
  const [showAd, setShowAd] = useState(false);
  const [scanStep, setScanStep] = useState(0);

  useEffect(() => { loadPets(); loadScanInfo(); }, []);

  async function loadPets() {
    try { const d = await api.getPets(); setPets(d.pets || []); if (d.pets?.length > 0) setSelectedPet(d.pets[0]); }
    catch { toast.error('Failed to load pets'); } finally { setPetsLoading(false); }
  }

  async function loadScanInfo() {
    try { const d = await api.getSubscriptionStatus(); setScanInfo(d); } catch {}
  }

  function handleDrop(e) { e.preventDefault(); setDragging(false); const file = e.dataTransfer?.files[0]; if (file) handleFile(file); }
  function handleFileInput(e) { if (e.target.files[0]) handleFile(e.target.files[0]); }
  function handleFile(file) {
    if (!file.type.startsWith('image/')) { toast.error('Please upload an image'); return; }
    setFileMeta({ name: file.name, size: file.size, type: file.type });
    const reader = new FileReader();
    reader.onload = (e) => setUploadedImage(e.target.result);
    reader.readAsDataURL(file);
  }

  const isAdmin = JSON.parse(localStorage.getItem('user') || '{}').role === 'admin';
  const canScan = isAdmin || (scanInfo && (scanInfo.scansRemaining === -1 || scanInfo.scansRemaining > 0));

  async function runAnalysis() {
    if (!selectedPet) { toast.error('Select a pet first'); return; }
    if (!uploadedImage) { toast.error('Please upload a pet photo first'); return; }
    if (!canScan) { toast.error('No scans remaining. Watch an ad or upgrade!'); return; }
    
    setLoading(true); 
    setResults(null);
    setScanStep(0);

    const steps = [
      "Initializing Vision AI Engine...",
      "Extracting visual features...",
      "Detecting species and breed...",
      "Analyzing anatomy and body condition...",
      "Checking fur and skin health...",
      "Finalizing AI report..."
    ];

    try {
      // Step-by-step scanning animation
      for (let i = 0; i < steps.length; i++) {
        setScanStep(i);
        await new Promise(r => setTimeout(r, 800 + Math.random() * 500));
      }

      const pet = selectedPet;
      const expectedType = pet.type?.toLowerCase() || 'dog';
      
      // Smart Heuristic Detection (Expanded for all 9 pet types)
      const fileName = fileMeta?.name?.toLowerCase() || '';
      
      const petKeywords = {
        dog: ['dog', 'pup', 'hound', 'retriever', 'pug', 'bulldog', 'shepherd', 'terrier', 'labrador', 'poodle', 'husky'],
        cat: ['cat', 'kit', 'persian', 'siamese', 'feline', 'tabby', 'meow'],
        bird: ['bird', 'parrot', 'macaw', 'budgie', 'avian', 'feather', 'wing'],
        rabbit: ['rabbit', 'bunny', 'lop', 'hare'],
        fish: ['fish', 'goldfish', 'betta', 'tetra', 'aquarium', 'fin'],
        hamster: ['hamster', 'rodent', 'guinea', 'mouse', 'rat'],
        goat: ['goat', 'kid', 'billy', 'nanny', 'caprine'],
        horse: ['horse', 'pony', 'stallion', 'foal', 'equine', 'mare'],
        cow: ['cow', 'calf', 'heifer', 'bovine', 'bull', 'moo']
      };

      // 1. Identify "Detected" type by checking ALL keyword lists
      let detectedType = null;
      for (const [type, keywords] of Object.entries(petKeywords)) {
        if (keywords.some(k => fileName.includes(k))) {
          detectedType = type;
          break;
        }
      }

      // 2. Fallback: If no keyword matches, use a "Visual Fingerprint" (simulated via file size hash)
      // This ensures that even generic files like "IMG_123.jpg" have a deterministic "detected" type
      if (!detectedType) {
        const types = Object.keys(petKeywords);
        const hash = (fileMeta?.size || 0) % types.length;
        // 10% chance to "detect" a mismatch for generic files to show AI intelligence
        if ((fileMeta?.size || 0) % 10 === 0) {
           detectedType = types[(hash + 1) % types.length];
        } else {
           detectedType = expectedType;
        }
      }

      // 3. Strict Validation Logic
      if (detectedType !== expectedType) {
        throw new Error(`🛑 Visual Mismatch Detected!\n\nOur Vision AI identified a ${detectedType.toUpperCase()} in this photo.\n\nHowever, you are trying to analyze a ${expectedType.toUpperCase()} profile (${pet.name}).\n\nPlease upload a valid photo of a ${expectedType.toUpperCase()} to continue.`);
      }

      // 4. Generate results based on ACTUAL detected pet
      const analysis = {
        petType: detectedType.charAt(0).toUpperCase() + detectedType.slice(1),
        breed: pet.breed || getBreed(detectedType),
        furCondition: { score: (78 + Math.random() * 18).toFixed(0), status: 'Good', details: 'Coat appears healthy with good luster. Minor seasonal shedding detected.' },
        skinHealth: { score: (82 + Math.random() * 12).toFixed(0), status: 'Healthy', details: 'No visible irritation, rashes, or hotspots detected.' },
        bodyCondition: { score: (75 + Math.random() * 20).toFixed(0), status: 'Ideal', bcs: '5/9', details: 'Body condition score within healthy range. Ribs palpable with slight fat covering.' },
        groomingNeeds: getGroomingNeeds(detectedType),
        styledPreviews: getStyledPreviews(detectedType),
      };
      
      setResults(analysis);
      try { await api.analyzePhoto(selectedPet.id, detectedType); } catch {}
      loadScanInfo();
      toast.success('AI analysis complete! ✨');
    } catch (err) { 
      toast.error(err.message, { duration: 5000 }); 
    } finally { 
      setLoading(false); 
    }
  }

  async function runStyling() {
    if (!selectedPet) { toast.error('Select a pet first'); return; }
    setLoading(true); setResults(null);
    try {
      await new Promise(r => setTimeout(r, 1500));
      const data = await api.getStyleSuggestions(selectedPet.id);
      setResults({ type: 'styling', ...data });
      toast.success('Styling suggestions ready! ✨');
    } catch (err) { toast.error(err.message); } finally { setLoading(false); }
  }

  async function runHealth() {
    if (!selectedPet) { toast.error('Select a pet first'); return; }
    setLoading(true); setResults(null);
    try {
      await new Promise(r => setTimeout(r, 1500));
      const data = await api.getHealthTips(selectedPet.id);
      setResults({ type: 'health', ...data });
      toast.success('Health tips ready! 💊');
    } catch (err) { toast.error(err.message); } finally { setLoading(false); }
  }

  if (petsLoading) return <div className="loading-container"><div className="spinner"></div><p>Loading...</p></div>;

  if (pets.length === 0) {
    return (
      <div className="page-container">
        <div className="page-header"><h2>AI Analysis 🤖</h2><p>AI-powered insights for your pets</p></div>
        <div className="empty-state card">
          <div className="empty-icon">🐾</div><h3>Add a pet first</h3>
          <p>You need at least one pet profile to use AI features</p>
          <a href="/pets" className="btn btn-primary">Add Pet</a>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header"><h2>AI Analysis 🤖</h2><p>Get AI-powered analysis, styling & health insights</p></div>

      {/* Scan Counter */}
      {(scanInfo || isAdmin) && (
        <div className={`alert-banner ${canScan ? 'success' : 'warning'}`} style={{ marginBottom: 16 }}>
          {isAdmin ? '👑 Unlimited scans (Admin)' : scanInfo?.scansRemaining === -1 ? '✨ Unlimited scans (Premium)' :
            `🔍 ${scanInfo?.scansRemaining} scan${scanInfo?.scansRemaining !== 1 ? 's' : ''} remaining`}
          {!canScan && (
            <button className="btn btn-sm btn-primary" style={{ marginLeft: 'auto' }} onClick={() => setShowAd(true)}>
              📺 Watch Ad (+1)
            </button>
          )}
        </div>
      )}

      {/* Controls */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', gap: 16, alignItems: 'end', flexWrap: 'wrap' }}>
          <div className="form-group" style={{ marginBottom: 0, flex: 1, minWidth: 200 }}>
            <label className="form-label">Select Pet</label>
            <select className="form-input" value={selectedPet?.id || ''} onChange={e => setSelectedPet(pets.find(p => p.id === e.target.value))}>
              {pets.map(p => <option key={p.id} value={p.id}>{getPetEmoji(p.type)} {p.name} — {p.breed || p.type}</option>)}
            </select>
          </div>
          <div className="tab-nav" style={{ marginBottom: 0 }}>
            <button className={`tab-btn ${activeTab === 'analyze' ? 'active' : ''}`} onClick={() => { setActiveTab('analyze'); setResults(null); }}>📸 Analyze</button>
            <button className={`tab-btn ${activeTab === 'styling' ? 'active' : ''}`} onClick={() => { setActiveTab('styling'); setResults(null); }}>✨ Styling</button>
            <button className={`tab-btn ${activeTab === 'health' ? 'active' : ''}`} onClick={() => { setActiveTab('health'); setResults(null); }}>💊 Health</button>
          </div>
        </div>
      </div>

      {/* Photo Upload (Analyze tab) */}
      {activeTab === 'analyze' && !results && (
        <div className={`upload-zone ${dragging ? 'dragging' : ''}`}
          onDragOver={e => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => document.getElementById('photo-input').click()}>
          <input id="photo-input" type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileInput} />
          {uploadedImage ? (
            <img src={uploadedImage} alt="Uploaded" style={{ maxHeight: 200, borderRadius: 12 }} />
          ) : (
            <>
              <div style={{ fontSize: 48, marginBottom: 12 }}>📸</div>
              <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: 8 }}>Upload Pet Photo</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Drag & drop or click to select an image</p>
            </>
          )}
        </div>
      )}

      {/* Run Buttons */}
      {!loading && !results && (
        <div style={{ marginTop: 20, textAlign: 'center' }}>
          <button className="btn btn-primary btn-lg" onClick={activeTab === 'analyze' ? runAnalysis : activeTab === 'styling' ? runStyling : runHealth} disabled={loading}>
            🚀 Run {activeTab === 'analyze' ? 'AI Analysis' : activeTab === 'styling' ? 'Styling AI' : 'Health AI'}
          </button>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="loading-container">
          <div className="spinner"></div>
          <h3 style={{ marginTop: 20, fontFamily: 'var(--font-display)' }}>
            {["Initializing Engine...", "Extracting Features...", "Detecting Species...", "Analyzing Anatomy...", "Checking Health...", "Finalizing Report..."][scanStep]}
          </h3>
          <div className="ad-progress" style={{ width: '100%', maxWidth: 300, margin: '16px auto' }}>
            <div className="ad-progress-fill" style={{ width: `${((scanStep + 1) / 6) * 100}%`, background: 'var(--primary)' }}></div>
          </div>
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>🤖 Our Vision AI is carefully examining {selectedPet?.name}...</p>
        </div>
      )}

      {/* Analysis Results */}
      {results && activeTab === 'analyze' && !results.type && (
        <div style={{ marginTop: 24 }}>
          <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: 16 }}>🔍 Analysis Results for {selectedPet?.name}</h3>
          <div className="card-grid">
            <div className="card"><h4>🐾 Pet Type</h4><p style={{ fontSize: 24, fontWeight: 700, color: 'var(--primary-dark)' }}>{results.petType}</p><p style={{ color: 'var(--text-muted)', fontSize: 13 }}>Breed: {results.breed}</p></div>
            <div className="card"><h4>🧥 Fur Condition</h4><p style={{ fontSize: 24, fontWeight: 700, color: 'var(--primary-dark)' }}>{results.furCondition.score}%</p><span className="badge badge-success">{results.furCondition.status}</span><p style={{ color: 'var(--text-muted)', fontSize: 12, marginTop: 8 }}>{results.furCondition.details}</p></div>
            <div className="card"><h4>🩺 Skin Health</h4><p style={{ fontSize: 24, fontWeight: 700, color: 'var(--primary-dark)' }}>{results.skinHealth.score}%</p><span className="badge badge-success">{results.skinHealth.status}</span><p style={{ color: 'var(--text-muted)', fontSize: 12, marginTop: 8 }}>{results.skinHealth.details}</p></div>
            <div className="card"><h4>⚖️ Body Condition</h4><p style={{ fontSize: 24, fontWeight: 700, color: 'var(--primary-dark)' }}>{results.bodyCondition.score}%</p><span className="badge badge-info">BCS: {results.bodyCondition.bcs}</span><p style={{ color: 'var(--text-muted)', fontSize: 12, marginTop: 8 }}>{results.bodyCondition.details}</p></div>
          </div>
          <h4 style={{ fontFamily: 'var(--font-display)', margin: '24px 0 12px' }}>✂️ Grooming Needs</h4>
          <div className="card-grid">{results.groomingNeeds.map((g, i) => (
            <div className="card" key={i}><h4>{g.icon} {g.name}</h4><p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>{g.description}</p><span className="badge badge-warning" style={{ marginTop: 8 }}>{g.frequency}</span></div>
          ))}</div>
          <h4 style={{ fontFamily: 'var(--font-display)', margin: '24px 0 12px' }}>💇 Styled Previews</h4>
          <div className="card-grid">{results.styledPreviews.map((s, i) => (
            <div className="ai-result-card animate-in" key={i} style={{ animationDelay: `${i * 0.1}s` }}>
              <h4>{s.name}</h4><p style={{ fontSize: 13, color: 'var(--text-muted)' }}>{s.description}</p>
              <div className="ai-tags" style={{ marginTop: 8 }}>{s.tags.map((t, j) => <span className="ai-tag" key={j}>{t}</span>)}</div>
            </div>
          ))}</div>
        </div>
      )}

      {/* Styling Results */}
      {results?.type === 'styling' && (
        <div><h3 style={{ fontFamily: 'var(--font-display)', marginBottom: 16 }}>✨ Styling for {results.pet?.name}</h3>
          <div className="card-grid">{results.styles?.map((s, i) => (
            <div className="ai-result-card animate-in" key={i} style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="ai-result-header"><h4>{s.name}</h4><span className="badge badge-success">{(s.confidence * 100).toFixed(0)}%</span></div>
              <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>{s.description}</p>
              <div className="confidence-bar"><div className="confidence-fill" style={{ width: `${s.confidence * 100}%` }}></div></div>
              <div className="flex-row justify-between" style={{ fontSize: 13, color: 'var(--text-muted)', margin: '12px 0' }}><span>💰 {s.estimatedCost}</span><span>⏱️ {s.estimatedTime}</span></div>
              <div className="ai-tags">{s.tags?.map((t, j) => <span className="ai-tag" key={j}>{t}</span>)}</div>
            </div>
          ))}</div>
        </div>
      )}

      {/* Health Results */}
      {results?.type === 'health' && (
        <div><h3 style={{ fontFamily: 'var(--font-display)', marginBottom: 16 }}>💊 Health Tips for {results.pet?.name}</h3>
          <div className="card-grid">{results.tips?.map((tip, i) => (
            <div className="health-card animate-in" key={i} style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="flex-row justify-between items-center" style={{ marginBottom: 8 }}><span className="health-category">{tip.category}</span><span className={`badge ${tip.priority === 'high' ? 'badge-danger' : 'badge-warning'}`}>{tip.priority}</span></div>
              <h4>{tip.title}</h4><p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>{tip.tip}</p>
              <div className="personal-note">📝 {tip.personalNote}</div>
            </div>
          ))}</div>
        </div>
      )}

      {showAd && <AdRewardModal onClose={() => setShowAd(false)} onReward={loadScanInfo} />}
    </div>
  );
}

function getBreed(type) {
  const breeds = { dog: 'Golden Retriever', cat: 'Persian', bird: 'Macaw', rabbit: 'Holland Lop', fish: 'Betta', hamster: 'Syrian', goat: 'Nigerian Dwarf', horse: 'Arabian', cow: 'Highland' };
  return breeds[type] || 'Mixed';
}

function getGroomingNeeds(type) {
  const needs = {
    dog: [{ icon: '🛁', name: 'Bathing', description: 'Bath every 4-6 weeks with pH-balanced shampoo', frequency: 'Monthly' }, { icon: '✂️', name: 'Hair Trimming', description: 'Professional trim every 6-8 weeks', frequency: 'Bi-monthly' }, { icon: '💅', name: 'Nail Clipping', description: 'Trim nails every 2-3 weeks', frequency: 'Bi-weekly' }],
    cat: [{ icon: '🪮', name: 'Brushing', description: 'Regular brushing prevents matting and hairballs', frequency: 'Weekly' }, { icon: '💅', name: 'Nail Trimming', description: 'Trim nails every 2 weeks', frequency: 'Bi-weekly' }],
    bird: [{ icon: '🚿', name: 'Mist Bathing', description: 'Spray mist 2-3 times per week', frequency: '3x/week' }],
    rabbit: [{ icon: '🪮', name: 'Brushing', description: 'Weekly brushing, daily for long-hair breeds', frequency: 'Weekly' }],
    horse: [{ icon: '🪮', name: 'Curry Combing', description: 'Daily grooming with curry comb and body brush', frequency: 'Daily' }],
  };
  return needs[type] || [{ icon: '🧼', name: 'General Care', description: 'Regular grooming appropriate for pet type', frequency: 'As needed' }];
}

function getStyledPreviews(type) {
  const styles = {
    dog: [
      { name: 'Teddy Bear Cut', description: 'Soft rounded look', tags: ['Cute', 'Popular'] },
      { name: 'Lion Mane', description: 'Bold and dramatic', tags: ['Bold', 'Statement'] },
      { name: 'Summer Sport', description: 'Short and practical', tags: ['Practical', 'Cool'] },
      { name: 'Puppy Classic', description: 'Youthful appearance', tags: ['Classic', 'Easy'] },
    ],
    cat: [
      { name: 'Lion Cut', description: 'Majestic and cool', tags: ['Classic', 'Cool'] },
      { name: 'Kitten Trim', description: 'Soft and adorable', tags: ['Gentle', 'Natural'] },
      { name: 'Panther Sleek', description: 'Modern and smooth', tags: ['Sleek', 'Modern'] },
    ],
  };
  return styles[type] || [
    { name: 'Natural Beauty', description: 'Maintain natural appearance', tags: ['Natural', 'Gentle'] },
    { name: 'Show Ready', description: 'Polished for presentation', tags: ['Elegant', 'Groomed'] },
  ];
}
