import { useState, useEffect } from 'react';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const plans = [
  {
    id: 'free',
    name: 'Free Plan',
    price: '$0',
    period: 'Forever',
    priceYearly: '$0',
    scans: '5 Scans',
    scansLabel: 'per month',
    pets: '1 Pet',
    features: ['📷 5 AI scans per month', '🐾 Add 1 pet profile', '💊 Basic health tips', '📅 Basic routine reminders'],
    notIncluded: ['❌ Unlimited scans', '❌ Multiple pets', '❌ Advanced grooming'],
    color: '#9CA3AF',
    popular: false,
  },
  {
    id: 'advance',
    name: 'Advance Plan',
    price: '$7',
    period: '/month',
    priceYearly: '$51',
    priceYearlyLabel: '/year (Save $33)',
    scans: 'Unlimited',
    scansLabel: 'scans',
    pets: '1 Pet',
    features: ['♾️ Unlimited AI scans', '🐾 Add 1 pet profile', '✨ Advanced grooming styles', '💊 Full health insights', '🏃 Personalized exercise plans', '📅 Smart routine & alarms', '🌿 Natural care protocols'],
    notIncluded: ['❌ Multiple pets'],
    color: '#8B5CF6',
    popular: true,
  },
  {
    id: 'pro',
    name: 'Pro Family',
    price: '$15',
    period: '/month',
    priceYearly: '$111',
    priceYearlyLabel: '/year (Save $69)',
    scans: 'Unlimited',
    scansLabel: 'scans',
    pets: 'Unlimited',
    features: ['♾️ Unlimited AI scans', '🐾 Unlimited pet profiles', '✨ All advanced grooming styles', '💊 Full health insights', '🏃 Personalized exercise plans', '📅 Smart routine & alarms', '🌿 Natural care protocols', '👨‍👩‍👧‍👦 Family sharing (up to 5)', '📊 Advanced analytics'],
    notIncluded: [],
    color: '#F59E0B',
    popular: false,
  },
];

export default function SubscriptionsPage() {
  const { user, updateUser } = useAuth();
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [upgrading, setUpgrading] = useState(null);

  const currentPlan = user?.subscription || 'free';

  async function handleUpgrade(planId) {
    if (planId === 'free') {
      toast.error('You are already on Free plan');
      return;
    }
    setUpgrading(planId);
    try {
      localStorage.setItem('pawcare_plan', planId);
      updateUser({ subscription: planId });
      toast.success(`Upgraded to ${plans.find(p => p.id === planId)?.name}!`);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setUpgrading(null);
    }
  }

  return (
    <div>
      <div className="page-header">
        <h2>🐾 Upgrade Your Pet Care</h2>
        <p>Unlock premium features for your furry friends!</p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
        <div style={{ background: 'var(--bg-card)', borderRadius: 25, padding: 4, display: 'flex' }}>
          <button
            onClick={() => setBillingCycle('monthly')}
            style={{
              padding: '10px 24px',
              borderRadius: 20,
              background: billingCycle === 'monthly' ? 'var(--primary)' : 'transparent',
              color: billingCycle === 'monthly' ? 'white' : 'var(--text-secondary)',
              border: 'none',
              fontWeight: 600,
            }}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingCycle('yearly')}
            style={{
              padding: '10px 24px',
              borderRadius: 20,
              background: billingCycle === 'yearly' ? 'var(--primary)' : 'transparent',
              color: billingCycle === 'yearly' ? 'white' : 'var(--text-secondary)',
              border: 'none',
              fontWeight: 600,
            }}
          >
            Yearly
          </button>
        </div>
      </div>

      {billingCycle === 'yearly' && (
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <span style={{ background: '#FEF3C7', color: '#D97706', padding: '4px 12px', borderRadius: 12, fontSize: 12, fontWeight: 600 }}>
            🎉 Save up to 40%
          </span>
        </div>
      )}

      <div className="card" style={{ marginBottom: 20, background: 'var(--bg-app)', border: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Current Plan</span>
            <div style={{ fontSize: 16, fontWeight: 'bold', color: 'var(--primary-dark)' }}>🐾 Free Plan</div>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>5 scans remaining</span>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gap: 16 }}>
        {plans.map((plan) => (
          <div
            key={plan.id}
            style={{
              background: 'var(--bg-card)',
              borderRadius: 20,
              padding: 20,
              border: plan.popular ? '2px solid #8B5CF6' : '1px solid var(--border)',
              boxShadow: plan.popular ? '0 4px 20px rgba(139, 92, 246, 0.2)' : 'var(--shadow-soft)',
              position: 'relative',
            }}
          >
            {plan.popular && (
              <div style={{ position: 'absolute', top: -12, right: 20, background: '#8B5CF6', color: 'white', padding: '4px 12px', borderRadius: 12, fontSize: 11, fontWeight: 'bold' }}>
                ⭐ Most Popular
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
              <div>
                <h3 style={{ fontSize: 20, fontWeight: 'bold' }}>{plan.name}</h3>
                <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>{plan.scans} {plan.scansLabel} • {plan.pets}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 24, fontWeight: 'bold', color: 'var(--primary-dark)' }}>
                  {billingCycle === 'monthly' ? plan.price : plan.priceYearly}
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                  {billingCycle === 'monthly' ? plan.period : '/year'}
                </div>
              </div>
            </div>

            {billingCycle === 'yearly' && plan.priceYearlyLabel && (
              <p style={{ fontSize: 12, color: '#10B981', marginBottom: 12, fontWeight: 600 }}>{plan.priceYearlyLabel}</p>
            )}

            <div style={{ marginBottom: 16 }}>
              {plan.features.map((f, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', marginBottom: 8, fontSize: 13 }}>
                  <span style={{ marginRight: 8 }}>✅</span>
                  <span>{f}</span>
                </div>
              ))}
              {plan.notIncluded.map((f, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', marginBottom: 8, fontSize: 13, opacity: 0.5 }}>
                  <span style={{ marginRight: 8 }}>{f.split(' ')[0]}</span>
                  <span style={{ color: 'var(--text-muted)' }}>{f.substring(2)}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => handleUpgrade(plan.id)}
              disabled={plan.id === 'free' || currentPlan === plan.id || upgrading}
              style={{
                width: '100%',
                padding: 14,
                borderRadius: 12,
                background: plan.id === 'free' ? 'var(--border)' : (plan.popular ? '#8B5CF6' : 'var(--primary)'),
                color: 'white',
                fontSize: 16,
                fontWeight: 'bold',
                border: 'none',
                cursor: currentPlan === plan.id ? 'default' : 'pointer',
                opacity: currentPlan === plan.id ? 0.7 : 1,
              }}
            >
              {currentPlan === plan.id ? 'Current Plan' : (upgrading === plan.id ? 'Processing...' : 'Subscribe Now')}
            </button>
          </div>
        ))}
      </div>

      <div className="card" style={{ marginTop: 20, background: '#FEF3C7', border: '1px solid #FECACA' }}>
        <h3 style={{ color: '#D97706', marginBottom: 8 }}>📺 Watch Ads & Earn</h3>
        <p style={{ fontSize: 14, color: '#92400E', marginBottom: 12 }}>Support us and get free scans by watching occasional ads!</p>
        <button style={{ background: '#F59E0B', color: 'white', padding: 12, borderRadius: 10, border: 'none', fontWeight: 'bold' }}>
          🎥 Watch Ad for +1 Free Scan
        </button>
      </div>

      <div style={{ marginTop: 30, marginBottom: 30 }}>
        <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: 16 }}>❓ FAQ</h3>
        <div className="card" style={{ marginBottom: 10 }}>
          <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 6 }}>Can I cancel anytime?</h4>
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Yes! You can cancel your subscription anytime from settings.</p>
        </div>
        <div className="card" style={{ marginBottom: 10 }}>
          <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 6 }}>What payment methods?</h4>
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>We accept Cards, PayPal, UPI and more.</p>
        </div>
      </div>
    </div>
  );
}