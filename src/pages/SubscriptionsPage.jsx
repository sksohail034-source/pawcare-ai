import { useState, useEffect } from 'react';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function SubscriptionsPage() {
  const { user, updateUser } = useAuth();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState(null);

  useEffect(() => {
    api.getPlans().then(d => setPlans(d.plans || [])).catch(console.error).finally(() => setLoading(false));
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
    <div>
      <div className="page-header">
        <h2>Subscription Plans 💎</h2>
        <p>Choose the plan that suits you and your pets best</p>
      </div>

      <div className="card" style={{ marginBottom: 32, background: 'linear-gradient(135deg, rgba(108, 92, 231, 0.1), rgba(0, 206, 201, 0.05))', border: '1px solid rgba(108, 92, 231, 0.3)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: 4 }}>Current Plan</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
              You are on the <strong style={{ color: 'var(--primary-light)', textTransform: 'capitalize' }}>{user?.subscription?.replace('_', ' ')}</strong> plan
            </p>
          </div>
          <span className="active-plan-badge">Active</span>
        </div>
      </div>

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
                  {upgrading === plan.id ? 'Processing...' : `Upgrade to ${plan.name}`}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
