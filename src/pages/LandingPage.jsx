import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const navigate = useNavigate();

  const features = [
    { icon: '🤖', color: 'rgba(108, 92, 231, 0.15)', title: 'AI-Powered Styling', desc: 'Get personalized grooming and styling suggestions powered by advanced AI analysis of your pet\'s breed and characteristics.' },
    { icon: '💊', color: 'rgba(0, 184, 148, 0.15)', title: 'Health Insights', desc: 'Receive tailored health tips, diet recommendations, and behavior insights based on your pet\'s unique profile.' },
    { icon: '💉', color: 'rgba(116, 185, 255, 0.15)', title: 'Vaccination Tracker', desc: 'Never miss a vaccination with smart reminders and a complete schedule tracker for all your pets.' },
    { icon: '🛍️', color: 'rgba(253, 121, 168, 0.15)', title: 'Smart Recommendations', desc: 'Discover the best products for your pets with AI-curated recommendations from top brands.' },
    { icon: '❤️', color: 'rgba(253, 203, 110, 0.15)', title: 'Support Animals', desc: 'Make a difference by donating to animal welfare organizations directly through the app.' },
    { icon: '📊', color: 'rgba(0, 206, 201, 0.15)', title: 'Pet Dashboard', desc: 'Get a comprehensive overview of all your pets\' health, activities, and upcoming appointments in one place.' },
  ];

  const plans = [
    { name: 'Free Trial', price: '0', period: '/14 days', features: ['1 Pet Profile', 'Basic AI Styling', 'Health Tips', 'Email Support'], popular: false },
    { name: 'Basic', price: '9.99', period: '/month', features: ['3 Pet Profiles', 'Unlimited AI Styling', 'Full Health Tips', 'Vaccination Tracker', 'Priority Support'], popular: false },
    { name: 'Premium', price: '19.99', period: '/month', features: ['Unlimited Pets', 'Advanced Health AI', 'Smart Reminders', 'Product Recs', 'Family Sharing', 'VIP Support'], popular: true },
    { name: 'Lifetime', price: '199.99', period: ' once', features: ['Everything Forever', 'Early Features', 'Custom AI Models', 'VIP Support', 'Exclusive Content'], popular: false },
  ];

  return (
    <div className="landing-page">
      <nav className="landing-nav">
        <div className="logo">
          <span className="logo-icon">🐾</span>
          <span className="logo-text">PawCare AI</span>
        </div>
        <div className="nav-actions">
          <button className="btn btn-ghost" onClick={() => navigate('/login')}>Log In</button>
          <button className="btn btn-primary" onClick={() => navigate('/register')}>Get Started Free</button>
        </div>
      </nav>

      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-badge">✨ AI-Powered Pet Care Platform</div>
          <h1 className="hero-title">
            Smart Care for Your <span className="gradient-text">Beloved Pets</span>
          </h1>
          <p className="hero-subtitle">
            From AI grooming suggestions to health insights and vaccination tracking — 
            PawCare AI brings the future of pet care to your fingertips.
          </p>
          <div className="hero-actions">
            <button className="btn btn-primary btn-lg" onClick={() => navigate('/register')}>
              Start Free Trial →
            </button>
            <button className="btn btn-secondary btn-lg" onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}>
              Explore Features
            </button>
          </div>
          <div className="hero-stats">
            <div className="hero-stat">
              <div className="hero-stat-value">50K+</div>
              <div className="hero-stat-label">Happy Pets</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-value">99.2%</div>
              <div className="hero-stat-label">AI Accuracy</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-value">4.9★</div>
              <div className="hero-stat-label">User Rating</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-value">24/7</div>
              <div className="hero-stat-label">AI Support</div>
            </div>
          </div>
        </div>
      </section>

      <section className="features-section" id="features">
        <div className="section-title">
          <h2>Everything Your Pet Needs</h2>
          <p>Comprehensive AI-driven features designed to give your pets the best care possible</p>
        </div>
        <div className="features-grid">
          {features.map((f, i) => (
            <div className="feature-card" key={i} style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="feature-icon" style={{ background: f.color }}>{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="pricing-section" id="pricing">
        <div className="section-title">
          <h2>Simple, Transparent Pricing</h2>
          <p>Start with a free trial. Upgrade anytime. Cancel anytime.</p>
        </div>
        <div className="pricing-grid">
          {plans.map((plan, i) => (
            <div className={`pricing-card ${plan.popular ? 'popular' : ''}`} key={i}>
              <div className="pricing-name">{plan.name}</div>
              <div className="pricing-price">
                <span className="currency">$</span>{plan.price}
                <span className="period">{plan.period}</span>
              </div>
              <ul className="pricing-features">
                {plan.features.map((f, j) => <li key={j}>{f}</li>)}
              </ul>
              <button className={`btn btn-full ${plan.popular ? 'btn-primary' : 'btn-secondary'}`} onClick={() => navigate('/register')}>
                {plan.price === '0' ? 'Start Free' : 'Choose Plan'}
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="cta-section">
        <h2>Ready to Transform Pet Care?</h2>
        <p>Join thousands of pet parents who use PawCare AI every day</p>
        <button className="btn btn-primary btn-lg" onClick={() => navigate('/register')}>
          Get Started Free — No Credit Card Required
        </button>
      </section>

      <footer className="landing-footer">
        <p>© 2024 PawCare AI. Built with ❤️ for pets everywhere. USA & Canada.</p>
      </footer>
    </div>
  );
}
