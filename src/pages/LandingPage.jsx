import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: 'var(--bg-app)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Soft Background Blurs */}
      <div style={{
        position: 'absolute',
        top: '-10%', left: '-10%', width: '300px', height: '300px',
        background: 'rgba(34, 197, 94, 0.4)', filter: 'blur(80px)', borderRadius: '50%'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '20%', right: '-10%', width: '250px', height: '250px',
        background: 'rgba(134, 239, 172, 0.5)', filter: 'blur(70px)', borderRadius: '50%'
      }} />

      {/* Header/Title Area */}
      <div style={{ paddingTop: '60px', paddingX: '24px', textAlign: 'center', position: 'relative', zIndex: 10 }}>
        <h1 style={{ fontSize: '36px', fontWeight: 800, color: 'var(--primary-dark)', marginBottom: '8px' }}>
          Smart Pet 🐾
        </h1>
        <p style={{ fontSize: '16px', color: 'var(--text-muted)', fontWeight: 500 }}>
          Your AI Pet Companion
        </p>
      </div>

      {/* Hero Image Section */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 10 }}>
        {/* Placeholder for high quality Golden Retriever cutout. You can replace the src when you have the actual image */}
        <img 
          src="https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=600&fm=png&bg=transparent"
          alt="Happy Golden Retriever"
          style={{ width: '90%', maxWidth: '350px', objectFit: 'contain', animation: 'float 6s ease-in-out infinite' }}
        />
      </div>

      {/* Bottom Glassmorphism Container */}
      <div className="glass-panel" style={{
        padding: '32px 24px',
        textAlign: 'center',
        position: 'relative',
        zIndex: 20
      }}>
        <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '12px', color: 'var(--primary-dark)' }}>
          Happy Pets, Happy You
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '15px', marginBottom: '32px', lineHeight: '1.6' }}>
          Keep your furry friends healthy, happy, and cared for with smart tools and trusted pet services.
        </p>
        <button 
          className="btn btn-primary" 
          style={{ width: '100%', padding: '16px', fontSize: '18px' }}
          onClick={() => navigate('/login')}
        >
          Get Started
        </button>
      </div>
    </div>
  );
}
