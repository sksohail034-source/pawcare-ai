import { Router } from 'express';
import { getDb, saveDatabase } from '../database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

const plans = [
  {
    id: 'free_trial',
    name: 'Free Trial',
    price: 0,
    duration: '14 days',
    features: ['1 Pet Profile', 'Basic AI Styling (3/month)', 'Basic Health Tips', 'Email Support'],
    popular: false
  },
  {
    id: 'basic',
    name: 'PawCare Basic',
    price: 9.99,
    duration: 'per month',
    features: ['3 Pet Profiles', 'Unlimited AI Styling', 'Full Health Tips', 'Vaccination Tracker', 'Priority Support'],
    popular: false
  },
  {
    id: 'premium',
    name: 'PawCare Premium',
    price: 19.99,
    duration: 'per month',
    features: ['Unlimited Pets', 'Unlimited AI Styling', 'Advanced Health AI', 'Vaccination Reminders', 'Product Recommendations', 'Priority Support', 'Family Sharing'],
    popular: true
  },
  {
    id: 'lifetime',
    name: 'PawCare Lifetime',
    price: 199.99,
    duration: 'one-time',
    features: ['Everything in Premium', 'Lifetime Access', 'Early Access to Features', 'VIP Support', 'Custom AI Models'],
    popular: false
  }
];

// Get all plans
router.get('/plans', (req, res) => {
  res.json({ plans });
});

// Get user subscription
router.get('/status', authenticateToken, (req, res) => {
  try {
    const db = getDb();
    const result = db.exec(`SELECT subscription, trial_ends_at FROM users WHERE id = '${req.user.id}'`);

    if (result.length === 0 || result[0].values.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const subscription = result[0].values[0][0];
    const trialEndsAt = result[0].values[0][1];

    const plan = plans.find(p => p.id === subscription) || plans[0];

    res.json({
      subscription,
      plan,
      trial_ends_at: trialEndsAt,
      is_active: subscription !== 'free_trial' || new Date(trialEndsAt) > new Date()
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch subscription' });
  }
});

// Upgrade subscription (simulated)
router.post('/upgrade', authenticateToken, (req, res) => {
  try {
    const { planId } = req.body;
    const plan = plans.find(p => p.id === planId);

    if (!plan) {
      return res.status(400).json({ error: 'Invalid plan' });
    }

    const db = getDb();
    db.run(`UPDATE users SET subscription = ? WHERE id = ?`, [planId, req.user.id]);
    saveDatabase();

    res.json({
      message: `Successfully upgraded to ${plan.name}!`,
      subscription: planId,
      plan
    });
  } catch (err) {
    res.status(500).json({ error: 'Upgrade failed' });
  }
});

export default router;
