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
    features: ['📷 5 AI scans per month', '🐾 Add 1 pet profile', '💊 Basic health tips', '📅 Basic routine reminders', '📺 Watch ads for +1 extra scan'],
    notIncluded: ['❌ Unlimited scans', '❌ Multiple pets', '❌ Premium grooming'],
    color: '#6B7280',
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
    features: ['♾️ Unlimited AI scans', '🐾 Add 1 pet profile', '✨ Premium grooming styles', '💊 Full health insights', '🏃 Exercise plans', '📅 Smart routines', '🌿 Natural care', '🔔 Priority support'],
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
    features: ['♾️ Unlimited AI scans', '🐾 Unlimited pets', '✨ All premium features', '💊 Full health insights', '🏃 Exercise plans', '📅 Smart routines', '🌿 Natural care', '👨‍👩‍👧‍👦 Family sharing (5 members)', '📊 Advanced analytics', '🎯 Priority AI processing'],
    notIncluded: [],
    color: '#F59E0B',
    popular: false,
  },
];

export default function SubscriptionsPage() {
  const { user, updateUser } = useAuth();
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [loading, setLoading] = useState(false);
  const [adWatched, setAdWatched] = useState(false);

  const currentPlan = user?.subscription || 'free';

  const handleWatchAd = () => {
    setLoading(true);
    setTimeout(() => {
      setAdWatched(true);
      const currentCount = parseInt(localStorage.getItem('pawcare_scan_count') || '0');
      localStorage.setItem('pawcare_scan_count', String(currentCount + 1));
      toast.success('🎉 You got +1 free scan!');
      setLoading(false);
    }, 2000);
  };

  async function handleUpgrade(planId) {
    if (planId === 'free') {
      toast.error('You are already on Free plan');
      return;
    }
    setLoading(true);
    try {
      localStorage.setItem('pawcare_plan', planId);
      updateUser({ subscription: planId });
      toast.success(`🎉 Welcome to ${plans.find(p => p.id === planId)?.name}!`);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="page-header">
        <h2>🐾 Upgrade Your Pet Care</h2>
        <p>Choose the perfect plan for you and your furry friends!</p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
        <div style={{ 
          background: 'var(--bg-card)', 
          borderRadius: 25, 
          padding: 4, 
          display: 'flex',
          border: '1px solid var(--border)'
        }}>
          <button
            onClick={() => setBillingCycle('monthly')}
            style={{
              padding: '12px 24px',
              borderRadius: 20,
              background: billingCycle === 'monthly' ? 'var(--primary)' : 'transparent',
              color: billingCycle === 'monthly' ? 'white' : 'var(--text-secondary)',
              border: 'none',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingCycle('yearly')}
            style={{
              padding: '12px 24px',
              borderRadius: 20,
              background: billingCycle === 'yearly' ? 'var(--primary)' : 'transparent',
              color: billingCycle === 'yearly' ? 'white' : 'var(--text-secondary)',
              border: 'none',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Yearly
          </button>
        </div>
      </div>

      {billingCycle === 'yearly' && (
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <span style={{ 
            background: 'linear-gradient(135deg, #FEF3C7, #FDE68A)', 
            color: '#D97706', 
            padding: '6px 16px', 
            borderRadius: 20, 
            fontSize: 13, 
            fontWeight: 600,
            display: 'inline-block'
          }}>
            🎉 Save up to 40% with yearly plan!
          </span>
        </div>
      )}

      <div className="card" style={{ 
        marginBottom: 24, 
        background: 'linear-gradient(135deg, var(--primary-light) 0%, var(--bg-app) 100%)', 
        border: '1px solid var(--primary)',
        padding: 20
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1 }}>Current Plan</span>
            <div style={{ fontSize: 22, fontWeight: 'bold', color: 'var(--primary-dark)', marginTop: 4 }}>
              🐾 {plans.find(p => p.id === currentPlan)?.name || 'Free Plan'}
            </div>
            <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
              {localStorage.getItem('pawcare_scan_count') || 0} / 5 scans used this month
            </span>
          </div>
          <div style={{ 
            background: 'var(--success)', 
            color: 'white', 
            padding: '6px 14px', 
            borderRadius: 20,
            fontSize: 12,
            fontWeight: 600
          }}>
            Active ✓
          </div>
        </div>
      </div>

      {currentPlan === 'free' && (
        <div className="card" style={{ 
          marginBottom: 24, 
          background: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)',
          border: '1px solid #F59E0B',
          textAlign: 'center',
          padding: 20
        }}>
          <h3 style={{ color: '#D97706', marginBottom: 8 }}>📺 Watch an Ad & Get +1 Free Scan!</h3>
          <p style={{ color: '#92400E', fontSize: 14, marginBottom: 16 }}>
            Running low on scans? Watch a quick ad and get an extra scan for free!
          </p>
          <button 
            onClick={handleWatchAd}
            disabled={loading || adWatched}
            style={{
              background: adWatched ? '#10B981' : '#F59E0B',
              color: 'white',
              border: 'none',
              padding: '14px 28px',
              borderRadius: 25,
              fontSize: 16,
              fontWeight: 'bold',
              cursor: loading ? 'wait' : 'pointer',
              boxShadow: '0 4px 14px rgba(245, 158, 11, 0.4)',
            }}
          >
            {loading ? '⏳ Loading Ad...' : adWatched ? '✅ Scan Added!' : '🎥 Watch Ad for +1 Scan'}
          </button>
        </div>
      )}

      <div style={{ display: 'grid', gap: 20, paddingBottom: 30 }}>
        {plans.map((plan) => (
          <div
            key={plan.id}
            className="card animate-fade-in"
            style={{
              borderRadius: 24,
              padding: 24,
              border: plan.popular ? '2px solid #8B5CF6' : '1px solid var(--border)',
              boxShadow: plan.popular 
                ? '0 8px 30px rgba(139, 92, 246, 0.25), 0 4px 12px rgba(0,0,0,0.08)' 
                : 'var(--shadow-soft)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {plan.popular && (
              <div style={{ 
                position: 'absolute', 
                top: 0, 
                right: 0,
                background: 'linear-gradient(135deg, #8B5CF6, #A78BFA)',
                color: 'white',
                padding: '6px 16px',
                borderRadius: '0 12px 0 12px',
                fontSize: 12,
                fontWeight: 'bold',
              }}>
                ⭐ Most Popular
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
              <div>
                <h3 style={{ fontSize: 22, fontWeight: 'bold', color: plan.color }}>{plan.name}</h3>
                <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>
                  {plan.scans} {plan.scansLabel} • {plan.pets}
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 28, fontWeight: '800', color: 'var(--primary-dark)' }}>
                  {billingCycle === 'monthly' ? plan.price : plan.priceYearly}
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                  {billingCycle === 'monthly' ? plan.period : '/year'}
                </div>
              </div>
            </div>

            {billingCycle === 'yearly' && plan.priceYearlyLabel && (
              <div style={{ 
                background: 'linear-gradient(135deg, #D1FAE5, #A7F3D0)', 
                color: '#059669',
                padding: '8px 14px',
                borderRadius: 12,
                fontSize: 13,
                fontWeight: 600,
                marginBottom: 16,
                display: 'inline-block'
              }}>
                {plan.priceYearlyLabel}
              </div>
            )}

            <div style={{ marginBottom: 20 }}>
              {plan.features.map((feature, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}>
                  <span style={{ marginRight: 10, fontSize: 16 }}>✅</span>
                  <span style={{ fontSize: 14, color: 'var(--text-main)' }}>{feature}</span>
                </div>
              ))}
              {plan.notIncluded?.map((feature, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', marginBottom: 10, opacity: 0.5 }}>
                  <span style={{ marginRight: 10, fontSize: 16 }}>❌</span>
                  <span style={{ fontSize: 14, color: 'var(--text-muted)' }}>{feature}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => handleUpgrade(plan.id)}
              disabled={plan.id === 'free' || currentPlan === plan.id || loading}
              style={{
                width: '100%',
                padding: 16,
                borderRadius: 16,
                background: plan.id === 'free' 
                  ? 'var(--border)' 
                  : plan.popular 
                    ? 'linear-gradient(135deg, #8B5CF6, #7C3AED)' 
                    : 'var(--primary)',
                color: 'white',
                fontSize: 16,
                fontWeight: 'bold',
                border: 'none',
                cursor: currentPlan === plan.id ? 'default' : 'pointer',
                opacity: currentPlan === plan.id ? 0.7 : 1,
                boxShadow: plan.popular ? '0 4px 14px rgba(139, 92, 246, 0.4)' : 'none',
              }}
            >
              {currentPlan === plan.id 
                ? '✓ Current Plan' 
                : loading 
                  ? 'Processing...' 
                  : plan.id === 'free' 
                    ? 'Free Plan' 
                    : `Upgrade to ${plan.name}`
              }
            </button>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 20, marginBottom: 40 }}>
        <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: 16, textAlign: 'center' }}>
          ❓ Frequently Asked Questions
        </h3>
        
        <div className="card" style={{ marginBottom: 12, padding: 16 }}>
          <h4 style={{ fontSize: 15, fontWeight: '600', marginBottom: 8 }}>Can I cancel anytime?</h4>
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
            Yes! You can cancel your subscription anytime. Your features will remain until the billing period ends.
          </p>
        </div>
        
        <div className="card" style={{ marginBottom: 12, padding: 16 }}>
          <h4 style={{ fontSize: 15, fontWeight: '600', marginBottom: 8 }}>What payment methods are accepted?</h4>
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
            We accept all major credit cards, PayPal, UPI, and digital wallets.
          </p>
        </div>
        
        <div className="card" style={{ marginBottom: 12, padding: 16 }}>
          <h4 style={{ fontSize: 15, fontWeight: '600', marginBottom: 8 }}>How does the ad scan work?</h4>
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
            Free users can watch a quick ad to get +1 extra scan. This helps support us while giving you more AI analyses!
          </p>
        </div>
      </div>
    </div>
  );
}