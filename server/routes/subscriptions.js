import { Router } from 'express';
import { getDb, saveDatabase } from '../database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

const plans = [
  {
    id: 'free', name: 'Free Plan', price: 0, duration: 'forever',
    features: ['5 AI Scans Total', 'Watch Ad for +1 Scan', 'Basic Health Tips', 'Up to 2 Pets', 'Community Support'],
    popular: false, scanLimit: 5, petLimit: 2
  },
  {
    id: 'advance', name: 'Advance Plan', price: 7, duration: '/month',
    features: ['Unlimited AI Scans', '1 Pet Profile', 'Full Health Analysis', 'Vaccination Tracker', 'Exercise Plans', 'Email Support'],
    popular: false, scanLimit: -1, petLimit: 1
  },
  {
    id: 'pro', name: 'Pro Plan', price: 15, duration: '/month',
    features: ['Unlimited AI Scans', 'Unlimited Pets', 'Priority AI Processing', 'Advanced Health AI', 'Full Vaccination Suite', 'All Exercise Plans', 'Smart Routines', 'Priority Support'],
    popular: true, scanLimit: -1, petLimit: -1
  }
];

router.get('/plans', (req, res) => { res.json({ plans }); });

router.get('/status', authenticateToken, (req, res) => {
  try {
    const db = getDb();
    const result = db.exec(`SELECT subscription, scan_count, ad_bonus_scans FROM users WHERE id = '${req.user.id}'`);
    if (result.length === 0 || result[0].values.length === 0) return res.status(404).json({ error: 'User not found' });
    const subscription = result[0].values[0][0];
    const scanCount = result[0].values[0][1] || 0;
    const adBonusScans = result[0].values[0][2] || 0;
    const plan = plans.find(p => p.id === subscription) || plans[0];
    const totalScans = scanCount + adBonusScans;
    const scansRemaining = plan.scanLimit === -1 ? -1 : Math.max(0, plan.scanLimit + adBonusScans - scanCount);
    res.json({ subscription, plan, scanCount, adBonusScans, scansRemaining, is_active: true });
  } catch (err) { res.status(500).json({ error: 'Failed to fetch subscription' }); }
});

router.post('/upgrade', authenticateToken, (req, res) => {
  try {
    const { planId } = req.body;
    const plan = plans.find(p => p.id === planId);
    if (!plan) return res.status(400).json({ error: 'Invalid plan' });
    const db = getDb();
    db.run(`UPDATE users SET subscription = ? WHERE id = ?`, [planId, req.user.id]);
    saveDatabase();
    res.json({ message: `Successfully upgraded to ${plan.name}!`, subscription: planId, plan });
  } catch (err) { res.status(500).json({ error: 'Upgrade failed' }); }
});

export default router;
