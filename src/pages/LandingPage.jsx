import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { petImages } from '../utils';

export default function LandingPage() {
  const navigate = useNavigate();
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [currency, setCurrency] = useState('USD');
  const [animatedStats, setAnimatedStats] = useState({ users: 0, scans: 0, accuracy: 0 });
  const [showUrgency, setShowUrgency] = useState(true);

  // Animate stats on mount
  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedStats({
        users: Math.floor(eased * 12500),
        scans: Math.floor(eased * 85000),
        accuracy: Math.floor(eased * 98),
      });
      if (step >= steps) clearInterval(timer);
    }, interval);
    return () => clearInterval(timer);
  }, []);

  const heroPhotos = [
    { type: 'dog', img: petImages.dog },
    { type: 'cat', img: petImages.cat },
    { type: 'bird', img: petImages.bird },
    { type: 'rabbit', img: petImages.rabbit },
  ];

  const pricing = {
    USD: {
      symbol: '$',
      basic: { monthly: '4.99', yearly: '29.99', monthlySave: '2.50' },
      pro: { monthly: '9.99', yearly: '59.99', monthlySave: '5.00' },
    },
    INR: {
      symbol: '₹',
      basic: { monthly: '149', yearly: '899', monthlySave: '75' },
      pro: { monthly: '299', yearly: '1,799', monthlySave: '150' },
    },
  };

  const plans = [
    {
      name: 'Free',
      emoji: '🆓',
      tagline: 'Get started instantly',
      price: '0',
      period: 'forever',
      features: [
        '3 AI Health Scans',
        'Basic Pet Profile',
        'Health Tips & Articles',
        'Community Access',
      ],
      cta: 'Scan Your Pet Now',
      popular: false,
      highlight: false,
    },
    {
      name: 'Basic',
      emoji: '⚡',
      tagline: 'For caring pet parents',
      priceKey: 'basic',
      features: [
        '25 AI Scans / month',
        '3 Pet Profiles',
        'Full Health Analysis',
        'Vaccination Tracker',
        'Exercise Plans',
        'Email Support',
      ],
      cta: 'Upgrade for Unlimited Access',
      popular: false,
      highlight: true,
    },
    {
      name: 'Pro',
      emoji: '👑',
      tagline: 'Unlimited care for all pets',
      priceKey: 'pro',
      features: [
        'Unlimited AI Scans',
        'Unlimited Pet Profiles',
        'Priority AI Processing',
        'Advanced Health Reports',
        'Smart Routines & Alerts',
        'Medication Tracker',
        'Priority 24/7 Support',
        'Early Feature Access',
      ],
      cta: 'Go Pro — Best Value',
      popular: true,
      highlight: true,
    },
  ];

  const features = [
    {
      icon: '🔬',
      title: 'AI-Powered Health Scans',
      desc: 'Upload a photo and our AI instantly analyzes breed, fur condition, skin health, and potential issues with 98% accuracy.',
      gradient: 'linear-gradient(135deg, #dcfce7, #bbf7d0)',
    },
    {
      icon: '⚡',
      title: 'Instant Results',
      desc: 'Get detailed health reports in under 10 seconds. No waiting, no appointments — just snap, scan, and know.',
      gradient: 'linear-gradient(135deg, #fef9c3, #fde68a)',
    },
    {
      icon: '📱',
      title: 'Easy to Use',
      desc: 'Designed for everyone. Simple interface, guided scans, and clear reports anyone can understand — no vet degree needed.',
      gradient: 'linear-gradient(135deg, #dbeafe, #bfdbfe)',
    },
    {
      icon: '💉',
      title: 'Vaccination Tracker',
      desc: 'Never miss a vaccine again. Auto-reminders, due date tracking, and complete vaccination history for all your pets.',
      gradient: 'linear-gradient(135deg, #fce7f3, #fbcfe8)',
    },
    {
      icon: '🏃',
      title: 'Smart Exercise Plans',
      desc: 'AI-generated exercise routines tailored to your pet\'s breed, age, and health condition.',
      gradient: 'linear-gradient(135deg, #e0e7ff, #c7d2fe)',
    },
    {
      icon: '🔔',
      title: 'Smart Reminders',
      desc: 'Feeding schedules, grooming alerts, medication reminders — all automated so you never miss a thing.',
      gradient: 'linear-gradient(135deg, #ccfbf1, #a7f3d0)',
    },
  ];

  const testimonials = [
    {
      name: 'Priya Sharma',
      location: 'Mumbai, India',
      avatar: '👩‍⚕️',
      text: 'PawCare detected a skin issue on my Golden Retriever that I completely missed. The vet confirmed it! This app literally saved my dog. 🙏',
      rating: 5,
      pet: '🐕 Max',
    },
    {
      name: 'Sarah Johnson',
      location: 'New York, USA',
      avatar: '👩‍💻',
      text: 'I use it for all 3 of my cats. The vaccination tracker alone is worth the Pro subscription. So organized!',
      rating: 5,
      pet: '🐱 Luna, Milo & Nala',
    },
    {
      name: 'Rahul Verma',
      location: 'Delhi, India',
      avatar: '👨‍🎓',
      text: 'Best pet care app I\'ve ever used. The AI scan is insanely accurate and the Indian pricing makes it super affordable! 🔥',
      rating: 5,
      pet: '🐕 Bruno',
    },
  ];

  const getPrice = (plan) => {
    if (plan.price === '0') return { amount: '0', period: 'forever' };
    const cur = pricing[currency];
    const p = cur[plan.priceKey];
    if (billingCycle === 'yearly') {
      return { amount: p.yearly, period: '/year', save: p.monthlySave };
    }
    return { amount: p.monthly, period: '/mo' };
  };

  return (
    <div className="lp-root">
      {/* Urgency Bar */}
      {showUrgency && (
        <div className="lp-urgency-bar">
          <div className="lp-urgency-content">
            <span className="lp-urgency-fire">🔥</span>
            <span className="lp-urgency-text">
              <strong>Limited Time Launch Offer:</strong> Get <span className="lp-urgency-highlight">50% OFF</span> on all plans!
            </span>
            <span className="lp-urgency-timer">⏰ Offer ends soon</span>
            <button className="lp-urgency-close" onClick={() => setShowUrgency(false)} aria-label="Close">×</button>
          </div>
        </div>
      )}

      {/* Background Decorations */}
      <div className="lp-bg-blob lp-bg-blob-1" />
      <div className="lp-bg-blob lp-bg-blob-2" />
      <div className="lp-bg-blob lp-bg-blob-3" />

      {/* Navigation */}
      <nav className="lp-nav">
        <div className="lp-nav-inner">
          <div className="lp-logo">🐾 PawCare AI</div>
          <div className="lp-nav-links">
            <a href="#features" className="lp-nav-link">Features</a>
            <a href="#pricing" className="lp-nav-link">Pricing</a>
            <a href="#reviews" className="lp-nav-link">Reviews</a>
          </div>
          <div className="lp-nav-actions">
            <button className="btn btn-secondary btn-sm" onClick={() => navigate('/login')}>Sign In</button>
            <button className="btn btn-primary btn-sm" onClick={() => navigate('/register')}>Get Started Free</button>
          </div>
        </div>
      </nav>

      {/* ═══════════ HERO SECTION ═══════════ */}
      <section className="lp-hero">
        <div className="lp-hero-content">
          <div className="lp-hero-badge animate-fade-in">
            <span className="lp-hero-badge-dot" />
            AI-Powered Pet Healthcare
          </div>
          <h1 className="lp-hero-title animate-fade-in">
            Your Pet Deserves<br />
            <span className="lp-gradient-text">The Best Care</span> 🐾
          </h1>
          <p className="lp-hero-subtitle animate-fade-in" style={{ animationDelay: '0.1s' }}>
            Detect health issues early with AI. Snap a photo, get instant results, and keep your furry friend happy & healthy — all from your phone.
          </p>
          <div className="lp-hero-ctas animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <button className="lp-cta-primary" onClick={() => navigate('/register')}>
              <span className="lp-cta-icon">📸</span>
              Scan Your Pet Now
              <span className="lp-cta-arrow">→</span>
            </button>
            <button className="lp-cta-secondary" onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}>
              See How It Works
            </button>
          </div>
          <div className="lp-hero-trust animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <span>✅ No credit card needed</span>
            <span>✅ 3 free scans</span>
            <span>✅ Works on all pets</span>
          </div>
        </div>

        {/* Floating Pet Cards */}
        <div className="lp-hero-visuals animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <div className="lp-hero-phone">
            <div className="lp-phone-screen">
              <div className="lp-phone-header">
                <span className="lp-phone-status">PawCare AI</span>
                <span className="lp-phone-badge">LIVE</span>
              </div>
              <div className="lp-phone-scan-area">
                <img src={petImages.dog} alt="Dog scan" className="lp-phone-pet-img" />
                <div className="lp-scan-overlay">
                  <div className="lp-scan-line" />
                </div>
              </div>
              <div className="lp-phone-result">
                <div className="lp-result-row">
                  <span>Health Score</span>
                  <span className="lp-result-score">94/100</span>
                </div>
                <div className="lp-result-bar">
                  <div className="lp-result-bar-fill" style={{ width: '94%' }} />
                </div>
                <div className="lp-result-tags">
                  <span className="lp-result-tag lp-tag-good">✓ Healthy Coat</span>
                  <span className="lp-result-tag lp-tag-good">✓ Good Weight</span>
                  <span className="lp-result-tag lp-tag-warn">⚠ Needs Grooming</span>
                </div>
              </div>

              {/* Added Routine Notification Mockup */}
              <div style={{
                position: 'absolute',
                top: '40%',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '85%',
                background: 'rgba(255,255,255,0.95)',
                backdropFilter: 'blur(10px)',
                borderRadius: '16px',
                padding: '12px',
                boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                animation: 'lp-float 3s ease-in-out infinite'
              }}>
                <div style={{ fontSize: '24px' }}>🦴</div>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: '12px', fontWeight: 800, color: '#1f2937' }}>Routine Reminder</div>
                  <div style={{ fontSize: '10px', color: '#6b7280' }}>Time for afternoon snack!</div>
                </div>
              </div>
            </div>
          </div>
          {/* Floating pet bubbles */}
          <div className="lp-floating-pets">
            {heroPhotos.map((p, i) => (
              <div key={p.type} className="lp-floating-pet" style={{ animationDelay: `${i * 0.6}s` }}>
                <img src={p.img} alt={p.type} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ SOCIAL PROOF STATS ═══════════ */}
      <section className="lp-stats-section">
        <div className="lp-stats-grid">
          <div className="lp-stat">
            <div className="lp-stat-number">{animatedStats.users.toLocaleString()}+</div>
            <div className="lp-stat-label">Happy Pet Parents</div>
          </div>
          <div className="lp-stat-divider" />
          <div className="lp-stat">
            <div className="lp-stat-number">{animatedStats.scans.toLocaleString()}+</div>
            <div className="lp-stat-label">AI Scans Completed</div>
          </div>
          <div className="lp-stat-divider" />
          <div className="lp-stat">
            <div className="lp-stat-number">{animatedStats.accuracy}%</div>
            <div className="lp-stat-label">Detection Accuracy</div>
          </div>
        </div>
      </section>

      {/* ═══════════ EMOTIONAL HOOK ═══════════ */}
      <section className="lp-emotion-section">
        <div className="lp-emotion-card">
          <div className="lp-emotion-icon">🩺</div>
          <h2 className="lp-emotion-title">Detect Issues Early With AI</h2>
          <p className="lp-emotion-text">
            Every year, thousands of pets suffer from undetected health issues. PawCare AI uses advanced computer vision to spot 
            skin conditions, weight problems, dental issues, and more — <strong>before they become serious</strong>.
          </p>
          <div className="lp-emotion-highlight">
            <span className="lp-emotion-stat">🐾 Early detection = Better outcomes</span>
            <span className="lp-emotion-stat">❤️ Because they can't tell you what hurts</span>
          </div>
        </div>
      </section>

      {/* ═══════════ FEATURES ═══════════ */}
      <section id="features" className="lp-features-section">
        <div className="lp-section-header">
          <span className="lp-section-badge">✨ Features</span>
          <h2 className="lp-section-title">Everything Your Pet Needs</h2>
          <p className="lp-section-subtitle">Powered by AI, built with love — for every breed, every species</p>
        </div>
        <div className="lp-features-grid">
          {features.map((f, i) => (
            <div key={i} className="lp-feature-card animate-fade-in" style={{ animationDelay: `${i * 0.08}s` }}>
              <div className="lp-feature-icon-wrap" style={{ background: f.gradient }}>
                <span className="lp-feature-icon">{f.icon}</span>
              </div>
              <h3 className="lp-feature-title">{f.title}</h3>
              <p className="lp-feature-desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════ HOW IT WORKS ═══════════ */}
      <section className="lp-how-section">
        <div className="lp-section-header">
          <span className="lp-section-badge">📱 Simple</span>
          <h2 className="lp-section-title">How It Works</h2>
          <p className="lp-section-subtitle">Three simple steps to better pet health</p>
        </div>
        <div className="lp-steps-grid">
          {[
            { step: '01', icon: '📸', title: 'Snap a Photo', desc: 'Take a clear photo of your pet using your phone camera' },
            { step: '02', icon: '🤖', title: 'AI Analyzes', desc: 'Our AI scans for breed, health markers, skin & fur condition' },
            { step: '03', icon: '📊', title: 'Get Results', desc: 'Receive detailed health report with actionable recommendations' },
          ].map((s, i) => (
            <div key={i} className="lp-step-card">
              <div className="lp-step-number">{s.step}</div>
              <div className="lp-step-icon">{s.icon}</div>
              <h3 className="lp-step-title">{s.title}</h3>
              <p className="lp-step-desc">{s.desc}</p>
              {i < 2 && <div className="lp-step-connector">→</div>}
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════ PRICING ═══════════ */}
      <section id="pricing" className="lp-pricing-section">
        <div className="lp-section-header">
          <span className="lp-section-badge">💎 Pricing</span>
          <h2 className="lp-section-title">Choose Your Plan</h2>
          <p className="lp-section-subtitle">Start free, upgrade when you're ready</p>
        </div>

        {/* Controls */}
        <div className="lp-pricing-controls">
          <div className="lp-billing-toggle">
            <button
              className={`lp-toggle-btn ${billingCycle === 'monthly' ? 'active' : ''}`}
              onClick={() => setBillingCycle('monthly')}
            >
              Monthly
            </button>
            <button
              className={`lp-toggle-btn ${billingCycle === 'yearly' ? 'active' : ''}`}
              onClick={() => setBillingCycle('yearly')}
            >
              Yearly
              <span className="lp-save-badge">Save 50%</span>
            </button>
          </div>
          <div className="lp-currency-switch">
            <button
              className={`lp-currency-btn ${currency === 'USD' ? 'active' : ''}`}
              onClick={() => setCurrency('USD')}
            >
              🇺🇸 USD
            </button>
            <button
              className={`lp-currency-btn ${currency === 'INR' ? 'active' : ''}`}
              onClick={() => setCurrency('INR')}
            >
              🇮🇳 INR
            </button>
          </div>
        </div>

        {/* Launch Offer Banner */}
        <div className="lp-launch-banner">
          <span className="lp-launch-icon">🎉</span>
          <div>
            <strong>Launch Special — 50% OFF!</strong>
            <span className="lp-launch-sub">Lock in this price forever. Limited slots remaining.</span>
          </div>
          <span className="lp-launch-badge">LAUNCH PRICE</span>
        </div>

        {/* Plan Cards */}
        <div className="lp-pricing-grid">
          {plans.map((plan, i) => {
            const priceData = getPrice(plan);
            return (
              <div key={i} className={`lp-plan-card ${plan.popular ? 'lp-plan-popular' : ''}`}>
                {plan.popular && (
                  <div className="lp-popular-ribbon">
                    <span>👑 MOST POPULAR</span>
                  </div>
                )}
                <div className="lp-plan-header">
                  <span className="lp-plan-emoji">{plan.emoji}</span>
                  <h3 className="lp-plan-name">{plan.name}</h3>
                  <p className="lp-plan-tagline">{plan.tagline}</p>
                </div>
                <div className="lp-plan-price-area">
                  {plan.highlight && billingCycle === 'yearly' && (
                    <div className="lp-plan-original-price">
                      <s>{pricing[currency].symbol}{pricing[currency][plan.priceKey].monthly}/mo</s>
                    </div>
                  )}
                  <div className="lp-plan-price">
                    <span className="lp-plan-currency">{plan.price === '0' ? '' : pricing[currency].symbol}</span>
                    <span className="lp-plan-amount">{priceData.amount}</span>
                    <span className="lp-plan-period">{priceData.period}</span>
                  </div>
                  {priceData.save && (
                    <div className="lp-plan-save-tag">
                      You save {pricing[currency].symbol}{priceData.save}/mo
                    </div>
                  )}
                </div>
                <ul className="lp-plan-features">
                  {plan.features.map((f, j) => (
                    <li key={j}>
                      <span className="lp-check">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <button
                  className={`lp-plan-cta ${plan.popular ? 'lp-plan-cta-primary' : ''}`}
                  onClick={() => navigate('/register')}
                >
                  {plan.cta}
                </button>
              </div>
            );
          })}
        </div>

        <p className="lp-pricing-note">
          Cancel anytime · No hidden fees · Instant activation
        </p>
      </section>

      {/* ═══════════ TESTIMONIALS ═══════════ */}
      <section id="reviews" className="lp-testimonials-section">
        <div className="lp-section-header">
          <span className="lp-section-badge">⭐ Reviews</span>
          <h2 className="lp-section-title">Loved by Pet Parents</h2>
          <p className="lp-section-subtitle">Join thousands of happy users worldwide</p>
        </div>
        <div className="lp-testimonials-grid">
          {testimonials.map((t, i) => (
            <div key={i} className="lp-testimonial-card animate-fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="lp-testimonial-stars">{'⭐'.repeat(t.rating)}</div>
              <p className="lp-testimonial-text">"{t.text}"</p>
              <div className="lp-testimonial-author">
                <div className="lp-testimonial-avatar">{t.avatar}</div>
                <div>
                  <div className="lp-testimonial-name">{t.name}</div>
                  <div className="lp-testimonial-location">{t.location} · {t.pet}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════ TRUST BADGES ═══════════ */}
      <section className="lp-trust-section">
        <div className="lp-trust-grid">
          {[
            { icon: '🔒', label: 'Secure & Private' },
            { icon: '🌍', label: '150+ Countries' },
            { icon: '🐾', label: '9+ Pet Types' },
            { icon: '📱', label: 'Works Offline' },
            { icon: '🏆', label: 'Top Rated' },
            { icon: '💳', label: 'Razorpay Secure' },
          ].map((b, i) => (
            <div key={i} className="lp-trust-item">
              <span className="lp-trust-icon">{b.icon}</span>
              <span className="lp-trust-label">{b.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════ FINAL CTA ═══════════ */}
      <section className="lp-final-cta">
        <div className="lp-final-cta-inner">
          <h2 className="lp-final-title">Your Pet's Health Can't Wait 🐾</h2>
          <p className="lp-final-subtitle">
            Join 12,500+ pet parents who trust PawCare AI for early detection and better care.
            Start with 3 free scans today.
          </p>
          <div className="lp-final-buttons">
            <button className="lp-cta-primary lp-cta-large" onClick={() => navigate('/register')}>
              <span className="lp-cta-icon">📸</span>
              Scan Your Pet Now — It's Free
              <span className="lp-cta-arrow">→</span>
            </button>
          </div>
          <p className="lp-final-note">No credit card required · Setup in 30 seconds</p>
        </div>
      </section>

      {/* ═══════════ FOOTER ═══════════ */}
      <footer className="lp-footer">
        <div className="lp-footer-inner">
          <div className="lp-footer-brand">
            <div className="lp-footer-logo">🐾 PawCare AI</div>
            <p>AI-powered pet care for the modern pet parent.</p>
          </div>
          <div className="lp-footer-links">
            <div>
              <h4>Product</h4>
              <a href="#features">Features</a>
              <a href="#pricing">Pricing</a>
              <a href="#reviews">Reviews</a>
            </div>
            <div>
              <h4>Legal</h4>
              <a onClick={() => navigate('/privacy-policy')} style={{ cursor: 'pointer' }}>Privacy Policy</a>
              <a onClick={() => navigate('/terms-of-service')} style={{ cursor: 'pointer' }}>Terms of Service</a>
              <a onClick={() => navigate('/refund-policy')} style={{ cursor: 'pointer' }}>Refund Policy</a>
            </div>
            <div>
              <h4>Support</h4>
              <a href="mailto:support@pawcare.ai">support@pawcare.ai</a>
              <a onClick={() => navigate('/help')} style={{ cursor: 'pointer' }}>Help Center</a>
              <a onClick={() => navigate('/contact')} style={{ cursor: 'pointer' }}>Contact Us</a>
            </div>
          </div>
        </div>
        <div className="lp-footer-bottom">
          <p>© 2026 PawCare AI. All rights reserved. Made with ❤️ for pets.</p>
        </div>
      </footer>
    </div>
  );
}
