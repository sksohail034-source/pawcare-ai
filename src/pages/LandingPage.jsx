import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const navigate = useNavigate();

  const features = [
    { icon: '🤖', title: 'AI-Powered Styling', desc: 'Get personalized grooming and styling suggestions powered by advanced AI analysis of your pet’s breed and characteristics.' },
    { icon: '💊', title: 'Health Insights', desc: 'Receive tailored health tips, diet recommendations, and behavior insights based on your pet’s unique profile.' },
    { icon: '💉', title: 'Vaccination Tracker', desc: 'Never miss a vaccination with smart reminders and a complete schedule tracker for all your pets.' },
    { icon: '🛍️', title: 'Smart Recommendations', desc: 'Discover the best products for your pets with AI-curated recommendations from top brands.' },
    { icon: '❤️', title: 'Support Animals', desc: 'Make a difference by donating to animal welfare organizations directly through the app.' },
    { icon: '📊', title: 'Pet Dashboard', desc: 'Get a comprehensive overview of all your pets’ health, activities, and upcoming appointments in one place.' },
  ];

  const plans = [
    { name: 'Free Trial', price: '0', period: '/14 days', features: ['1 Pet Profile', 'Basic AI Styling', 'Health Tips', 'Email Support'], popular: false },
    { name: 'Basic', price: '9.99', period: '/month', features: ['3 Pet Profiles', 'Unlimited AI Styling', 'Full Health Tips', 'Vaccination Tracker', 'Priority Support'], popular: false },
    { name: 'Premium', price: '19.99', period: '/month', features: ['Unlimited Pets', 'Advanced Health AI', 'Smart Reminders', 'Product Recs', 'Family Sharing', 'VIP Support'], popular: true },
    { name: 'Lifetime', price: '199.99', period: ' once', features: ['Everything Forever', 'Early Features', 'Custom AI Models', 'VIP Support', 'Exclusive Content'], popular: false },
  ];

  return (
    <div style={{ background: 'var(--bg-app)', color: 'var(--text-main)' }}>
      {/* Navbar Minimalist */}
      <nav style={{ padding: '24px 8%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-card)', boxShadow: 'var(--shadow-soft)' }}>
        <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--primary-dark)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          🐾 PawCare AI
        </div>
        <div className="flex-row gap-4">
          <button style={{ fontWeight: 600, color: 'var(--text-muted)' }} onClick={() => navigate('/login')}>Log In</button>
          <button className="btn btn-primary" style={{ padding: '10px 20px' }} onClick={() => navigate('/register')}>Get Started</button>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{ textAlign: 'center', padding: '100px 24px', position: 'relative', overflow: 'hidden' }}>
        {/* Soft Background Blurs */}
        <div style={{ position: 'absolute', top: '10%', left: '10%', width: '400px', height: '400px', background: 'rgba(34, 197, 94, 0.1)', filter: 'blur(100px)', borderRadius: '50%', zIndex: 0 }} />
        <div style={{ position: 'absolute', top: '20%', right: '10%', width: '300px', height: '300px', background: 'rgba(134, 239, 172, 0.2)', filter: 'blur(100px)', borderRadius: '50%', zIndex: 0 }} />
        
        <div style={{ position: 'relative', zIndex: 10, maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ display: 'inline-block', background: 'var(--bg-card)', padding: '6px 16px', borderRadius: 'var(--radius-full)', border: '1px solid var(--primary-light)', color: 'var(--primary-dark)', fontSize: '14px', fontWeight: 600, marginBottom: '24px', boxShadow: 'var(--shadow-soft)' }}>
            ✨ AI-Powered Pet Care Platform
          </div>
          <h1 style={{ fontSize: '64px', fontWeight: 800, lineHeight: 1.1, marginBottom: '24px', letterSpacing: '-1px' }}>
            Smart Care for Your <span className="gradient-text">Beloved Pets</span>
          </h1>
          <p style={{ fontSize: '20px', color: 'var(--text-muted)', marginBottom: '40px', lineHeight: 1.6, maxWidth: '600px', margin: '0 auto 40px auto' }}>
            From AI grooming suggestions to health insights and vaccination tracking — 
            PawCare AI brings the future of pet care to your fingertips.
          </p>
          <div className="flex-row justify-center gap-4">
            <button className="btn btn-primary" style={{ padding: '16px 32px', fontSize: '18px' }} onClick={() => navigate('/register')}>
              Start Free Trial →
            </button>
            <button className="btn" style={{ background: 'white', color: 'var(--text-main)', border: '1px solid var(--border)', padding: '16px 32px', fontSize: '18px', boxShadow: 'var(--shadow-soft)' }} onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}>
              Explore Features
            </button>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '60px', marginTop: '80px', flexWrap: 'wrap' }}>
            {[
              { val: '50K+', label: 'Happy Pets' },
              { val: '99.2%', label: 'AI Accuracy' },
              { val: '4.9★', label: 'User Rating' },
              { val: '24/7', label: 'AI Support' }
            ].map((stat, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '36px', fontWeight: 800, color: 'var(--primary-dark)' }}>{stat.val}</div>
                <div style={{ fontSize: '14px', color: 'var(--text-muted)', fontWeight: 500 }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" style={{ padding: '100px 8%', background: 'linear-gradient(to bottom, transparent, rgba(34, 197, 94, 0.03))' }}>
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <h2 style={{ fontSize: '40px', fontWeight: 800, marginBottom: '16px' }}>Everything Your Pet Needs</h2>
          <p style={{ fontSize: '18px', color: 'var(--text-muted)' }}>Comprehensive AI-driven features designed to give your pets the best care possible</p>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
          {features.map((f, i) => (
            <div key={i} className="card" style={{ padding: '32px', border: '1px solid var(--border-hover)', transition: 'all 0.3s', cursor: 'default' }}>
              <div style={{ width: '60px', height: '60px', borderRadius: '16px', background: 'var(--bg-app)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', marginBottom: '24px', border: '1px solid var(--border)' }}>
                {f.icon}
              </div>
              <h3 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '12px' }}>{f.title}</h3>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, fontSize: '15px' }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" style={{ padding: '100px 8%', background: 'var(--bg-card)' }}>
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <h2 style={{ fontSize: '40px', fontWeight: 800, marginBottom: '16px' }}>Simple, Transparent Pricing</h2>
          <p style={{ fontSize: '18px', color: 'var(--text-muted)' }}>Start with a free trial. Upgrade anytime. Cancel anytime.</p>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px', alignItems: 'center' }}>
          {plans.map((p, i) => (
            <div key={i} className="card" style={{ 
              padding: '40px 32px', 
              border: p.popular ? '2px solid var(--primary)' : '1px solid var(--border)',
              transform: p.popular ? 'scale(1.05)' : 'scale(1)',
              zIndex: p.popular ? 10 : 1,
              position: 'relative'
            }}>
              {p.popular && (
                <div style={{ position: 'absolute', top: '-14px', left: '50%', transform: 'translateX(-50%)', background: 'var(--primary)', color: 'white', padding: '4px 16px', borderRadius: 'var(--radius-full)', fontSize: '13px', fontWeight: 700 }}>
                  MOST POPULAR
                </div>
              )}
              <h3 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '16px', color: 'var(--text-muted)' }}>{p.name}</h3>
              <div style={{ fontSize: '48px', fontWeight: 800, marginBottom: '24px', color: 'var(--text-main)', display: 'flex', alignItems: 'baseline' }}>
                <span style={{ fontSize: '24px', verticalAlign: 'super' }}>$</span>{p.price}<span style={{ fontSize: '16px', color: 'var(--text-muted)', fontWeight: 500 }}>{p.period}</span>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px 0' }}>
                {p.features.map((feat, j) => (
                  <li key={j} style={{ padding: '12px 0', borderBottom: '1px solid var(--border)', fontSize: '15px', display: 'flex', gap: '8px' }}>
                    <span style={{ color: 'var(--primary)' }}>✓</span> {feat}
                  </li>
                ))}
              </ul>
              <button className={p.popular ? 'btn btn-primary' : 'btn'} style={{ width: '100%', background: p.popular ? '' : 'var(--bg-app)', border: p.popular ? '' : '1px solid var(--border)', color: p.popular ? 'white' : 'var(--text-main)', padding: '14px' }} onClick={() => navigate('/register')}>
                {p.price === '0' ? 'Start Free' : 'Choose Plan'}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Footer CTA */}
      <footer style={{ padding: '80px 24px', textAlign: 'center', background: 'var(--primary-dark)', color: 'white' }}>
        <h2 style={{ fontSize: '40px', fontWeight: 800, marginBottom: '16px' }}>Ready to Transform Pet Care?</h2>
        <p style={{ fontSize: '20px', marginBottom: '40px', opacity: 0.9 }}>Join thousands of pet parents who use PawCare AI every day.</p>
        <button className="btn" style={{ background: 'white', color: 'var(--primary-dark)', padding: '18px 40px', fontSize: '18px', boxShadow: '0 10px 30px rgba(0,0,0,0.15)' }} onClick={() => navigate('/register')}>
          Get Started Free — No Credit Card Required
        </button>
        <p style={{ marginTop: '60px', opacity: 0.7, fontSize: '14px' }}>© 2024 PawCare AI. Built with ❤️ for pets everywhere. USA & Canada.</p>
      </footer>
    </div>
  );
}
