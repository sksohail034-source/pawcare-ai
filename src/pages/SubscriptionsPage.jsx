import { useState, useEffect } from 'react';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

function AdRewardModal({ onClose, onReward }) {
  const [timer, setTimer] = useState(15);
  const [completed, setCompleted] = useState(false);
  const [adId, setAdId] = useState(null);

  useEffect(() => {
    api.startAd().then(d => setAdId(d.adId)).catch(() => {});
    const interval = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) { clearInterval(interval); setCompleted(true); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  async function claimReward() {
    try {
      const data = await api.completeAd(adId);
      toast.success(data.message);
      onReward();
    } catch (err) { toast.error(err.message); }
    onClose();
  }

  return (
    <div className="modal-overlay" onClick={completed ? onClose : undefined}>
      <div className="modal ad-modal" onClick={e => e.stopPropagation()}>
        {!completed ? (
          <>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 20, marginBottom: 8 }}>📺 Watching Ad...</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: 16 }}>Watch this ad to earn a free AI scan</p>
            <div className="ad-timer">{timer}s</div>
            <div className="ad-progress">
              <div className="ad-progress-fill" style={{ width: `${((15 - timer) / 15) * 100}%` }}></div>
            </div>
            <div style={{ background: 'var(--bg-input)', borderRadius: 16, padding: 40, marginBottom: 16 }}>
              <p style={{ fontSize: 24 }}>🐾</p>
              <p style={{ fontSize: 14, color: 'var(--text-muted)', marginTop: 8 }}>Premium pet care awaits...</p>
            </div>
            <p style={{ fontSize: 12, color: 'var(--text-light)' }}>Please wait for the ad to complete</p>
          </>
        ) : (
          <>
            <div style={{ fontSize: 64, marginBottom: 16 }}>🎉</div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 22, marginBottom: 8 }}>Ad Complete!</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: 24 }}>You've earned +1 free AI scan</p>
            <button className="btn btn-primary btn-full" onClick={claimReward}>Claim Free Scan 🐾</button>
          </>
        )}
      </div>
    </div>
  );
}

export default function SubscriptionsPage() {
  const { user, updateUser } = useAuth();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState(null);
  const [showAd, setShowAd] = useState(false);
  const [subStatus, setSubStatus] = useState(null);

  useEffect(() => {
    Promise.all([
      api.getPlans().then(d => setPlans(d.plans || [])),
      api.getSubscriptionStatus().then(d => setSubStatus(d)).catch(() => {})
    ]).finally(() => setLoading(false));
  }, []);

  async function handleUpgrade(planId) {
    setUpgrading(planId);
    try {
      const data = await api.upgradePlan(planId);
      updateUser({ subscription: planId });
      toast.success(data.message);
    } catch (err) { toast.error(err.message); }
    finally { setUpgrading(null); }
  }

  if (loading) return <div className="loading-container"><div className="spinner"></div><p>Loading plans...</p></div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>Subscription Plans 💎</h2>
        <p>Choose the plan that suits you and your pets</p>
      </div>

      {/* Current Plan */}
      <div className="card" style={{ marginBottom: 24, background: 'linear-gradient(135deg, rgba(34,197,94,0.1), rgba(74,222,128,0.05))', borderColor: 'var(--primary)' }}>
        <div className="flex-row justify-between items-center" style={{ flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: 4 }}>Current Plan</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>
              You are on the <strong style={{ color: 'var(--primary-dark)', textTransform: 'capitalize' }}>{user?.subscription || 'free'}</strong> plan
            </p>
            {subStatus && user?.subscription === 'free' && (
              <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
                Scans used: {subStatus.scanCount || 0}/5 | Bonus scans: {subStatus.adBonusScans || 0}
              </p>
            )}
          </div>
          <div className="flex-row gap-2">
            <span className="active-plan-badge">Active</span>
            {user?.subscription === 'free' && (
              <button className="btn btn-secondary btn-sm" onClick={() => setShowAd(true)}>
                📺 Watch Ad (+1 Scan)
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Plans Grid */}
      <div className="pricing-grid">
        {plans.map((plan, i) => {
          const isCurrent = user?.subscription === plan.id;
          return (
            <div className={`pricing-card ${plan.popular ? 'popular' : ''}`} key={i}>
              <div className="pricing-name">{plan.name}</div>
              <div className="pricing-price">
                <span className="currency">$</span>{plan.price}
                <span className="period"> {plan.duration}</span>
              </div>
              <ul className="pricing-features">
                {plan.features.map((f, j) => <li key={j}>{f}</li>)}
              </ul>
              {isCurrent ? (
                <button className="btn btn-success btn-full" disabled>✓ Current Plan</button>
              ) : (
                <button className={`btn btn-full ${plan.popular ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => handleUpgrade(plan.id)} disabled={upgrading === plan.id}>
                  {upgrading === plan.id ? 'Processing...' : plan.price === 0 ? 'Downgrade' : `Upgrade to ${plan.name}`}
                </button>
              )}
            </div>
          );
        })}
      </div>

      {showAd && <AdRewardModal onClose={() => setShowAd(false)} onReward={() => {
        api.getSubscriptionStatus().then(d => setSubStatus(d)).catch(() => {});
      }} />}
    </div>
  );
}
