import { useNavigate } from 'react-router-dom';
import { petImages } from '../utils';

export default function LandingPage() {
  const navigate = useNavigate();
  const heroPhotos = [
    { type: 'dog', img: petImages.dog },
    { type: 'cat', img: petImages.cat },
    { type: 'bird', img: petImages.bird },
    { type: 'rabbit', img: petImages.rabbit },
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-app)', overflow: 'hidden' }}>
      {/* Soft gradient blobs */}
      <div style={{ position: 'fixed', top: '-15%', left: '-10%', width: '400px', height: '400px', background: 'rgba(34,197,94,0.25)', filter: 'blur(100px)', borderRadius: '50%', zIndex: 0 }} />
      <div style={{ position: 'fixed', bottom: '10%', right: '-10%', width: '350px', height: '350px', background: 'rgba(134,239,172,0.3)', filter: 'blur(90px)', borderRadius: '50%', zIndex: 0 }} />

      {/* Nav */}
      <nav className="landing-nav" style={{ position: 'relative', zIndex: 10 }}>
        <div className="logo">🐾 PawCare AI</div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button className="btn btn-secondary btn-sm" onClick={() => navigate('/login')}>Sign In</button>
          <button className="btn btn-primary btn-sm" onClick={() => navigate('/register')}>Get Started</button>
        </div>
      </nav>

      {/* Hero */}
      <div className="hero-content" style={{ flexDirection: 'column', paddingTop: 40 }}>
        <div className="hero-text animate-fade-in">
          <h1>AI Care for Your Pet 🐾</h1>
          <p>Smart grooming, health tracking & pet insights powered by AI. The all-in-one platform for dog, cat, bird, and 6+ more pet types.</p>
          <button className="btn btn-primary btn-lg" onClick={() => navigate('/register')} style={{ fontSize: 18, padding: '18px 48px' }}>
            Try Free
          </button>
        </div>

        {/* Floating Pet Images */}
        <div className="hero-images" style={{ marginTop: 48 }}>
          {heroPhotos.map((p, i) => (
            <div key={p.type} className="hero-pet-card" style={{ animationDelay: `${i * 0.8}s` }}>
              <img src={p.img} alt={p.type} />
            </div>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div className="features-section" style={{ position: 'relative', zIndex: 10, marginTop: 40 }}>
        <h2 style={{ textAlign: 'center', fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 800, marginBottom: 8 }}>
          Everything Your Pet Needs
        </h2>
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: 40, fontSize: 16 }}>
          Powered by AI, built with love
        </p>
        <div className="features-grid">
          {[
            { icon: '🤖', title: 'AI Pet Analysis', desc: 'Upload a photo and get breed detection, fur condition, grooming needs, and styled previews.' },
            { icon: '💉', title: 'Vaccination Tracker', desc: 'Full CRUD management with auto due dates, overdue alerts, and smart filtering by pet type.' },
            { icon: '🏃', title: 'Exercise Plans', desc: 'Pet-specific exercise routines for 9+ animal types with AI-powered care recommendations.' },
            { icon: '🔔', title: 'Smart Reminders', desc: 'Feeding schedules, grooming alerts, and vaccination reminders with push notifications.' },
          ].map((f, i) => (
            <div key={i} className="feature-card animate-fade-in" style={{ animationDelay: `${i * 0.15}s` }}>
              <div className="icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Pricing Preview */}
      <div style={{ padding: '60px 40px', position: 'relative', zIndex: 10 }}>
        <h2 style={{ textAlign: 'center', fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800, marginBottom: 40 }}>
          Simple, Transparent Pricing
        </h2>
        <div className="pricing-grid" style={{ maxWidth: 900, margin: '0 auto' }}>
          {[
            { name: 'Free', price: '0', period: 'forever', features: ['5 AI Scans', 'Up to 2 Pets', 'Basic Health Tips', 'Watch Ads for More Scans'], popular: false },
            { name: 'Advance', price: '7', period: '/month', features: ['Unlimited Scans', '1 Pet Profile', 'Full Health Analysis', 'Vaccination Tracker', 'Exercise Plans'], popular: false },
            { name: 'Pro', price: '15', period: '/month', features: ['Unlimited Everything', 'Priority AI', 'All Features', 'Smart Routines', 'Priority Support'], popular: true },
          ].map((plan, i) => (
            <div key={i} className={`pricing-card ${plan.popular ? 'popular' : ''}`}>
              <div className="pricing-name">{plan.name}</div>
              <div className="pricing-price">
                <span className="currency">$</span>{plan.price}
                <span className="period"> {plan.period}</span>
              </div>
              <ul className="pricing-features">
                {plan.features.map((f, j) => <li key={j}>{f}</li>)}
              </ul>
              <button className={`btn btn-full ${plan.popular ? 'btn-primary' : 'btn-secondary'}`} onClick={() => navigate('/register')}>
                {plan.price === '0' ? 'Start Free' : `Choose ${plan.name}`}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Footer CTA */}
      <div style={{ textAlign: 'center', padding: '40px 20px 60px', position: 'relative', zIndex: 10 }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 700, marginBottom: 16 }}>
          Ready to give your pet the best care?
        </h2>
        <button className="btn btn-primary btn-lg" onClick={() => navigate('/register')}>
          Get Started — It's Free 🐾
        </button>
      </div>
    </div>
  );
}
