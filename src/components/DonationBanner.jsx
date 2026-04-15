import { Heart } from 'lucide-react';

export default function DonationBanner() {
  const handleDonate = () => {
    // In a real app, this would redirect to a payment link like Stripe or PayPal.
    window.open('https://paypal.me/sksohail034', '_blank');
  };

  return (
    <div className="card" style={{
      marginTop: '24px',
      position: 'relative',
      overflow: 'hidden',
      background: 'linear-gradient(145deg, #ffffff, #f0fdf4)',
      border: '1px solid var(--accent)',
      boxShadow: '0 8px 24px rgba(34, 197, 94, 0.15)'
    }}>
      {/* Background decorations */}
      <div style={{ position: 'absolute', top: '-10px', right: '-10px', opacity: 0.1, color: 'var(--primary)' }}>
        <Heart size={100} fill="currentColor" />
      </div>

      <div style={{ position: 'relative', zIndex: 10 }}>
        <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--primary-dark)', marginBottom: '8px' }}>
          Donate for stray pets 🐾
        </h3>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px', lineHeight: '1.5' }}>
          Your small contribution can change a life. Help provide food, shelter, and medical care for abandoned and injured animals. Every donation matters.
        </p>

        <div className="flex-row gap-3" style={{ marginBottom: '16px' }}>
          {['$1', '$5', '$10', 'Custom'].map(amt => (
            <button key={amt} style={{
              flex: 1, padding: '8px 0', borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border)', background: 'var(--bg-card)',
              color: 'var(--primary-dark)', fontWeight: 600, fontSize: '13px'
            }}>
              {amt}
            </button>
          ))}
        </div>

        <button 
          className="btn btn-primary" 
          style={{ width: '100%', gap: '8px' }}
          onClick={handleDonate}
        >
          Donate Now <Heart size={18} fill="white" />
        </button>

        <p style={{ fontSize: '11px', color: 'var(--text-light)', textAlign: 'center', marginTop: '12px' }}>
          100% of donations go towards animal care
        </p>
      </div>
    </div>
  );
}
