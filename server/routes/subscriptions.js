import { Router } from 'express';
import Stripe from 'stripe';
import { getDb, saveDatabase } from '../database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_dummy');


const plans = [
  {
    id: 'free', name: 'Free Plan', 
    price: { USD: { monthly: 0, yearly: 0 }, INR: { monthly: 0, yearly: 0 } },
    features: ['3 AI Scans Total', 'Watch Ad for +1 Scan', 'Ad-supported Basic Features', '1 Pet Profile', 'Community Support'],
    popular: false, scanLimit: 3, petLimit: 1
  },
  {
    id: 'advance', name: 'Advance Plan', 
    price: { USD: { monthly: 7, yearly: 60 }, INR: { monthly: 500, yearly: 4800 } },
    features: ['Unlimited AI Scans', 'Up to 2 Pet Profiles', 'No Ads', 'Full Health Analysis', 'Vaccination Tracker', 'Exercise Plans'],
    popular: false, scanLimit: -1, petLimit: 2
  },
  {
    id: 'pro', name: 'Pro Plan', 
    price: { USD: { monthly: 15, yearly: 132 }, INR: { monthly: 1200, yearly: 10800 } },
    features: ['Unlimited AI Scans', 'Unlimited Pet Profiles', 'No Ads', 'Priority AI Processing', 'Smart Routines', 'AI Support Chatbot'],
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

router.post('/create-checkout-session', authenticateToken, async (req, res) => {
  try {
    const { planId, cycle, currency } = req.body;
    const plan = plans.find(p => p.id === planId);
    if (!plan) return res.status(400).json({ error: 'Invalid plan' });

    // Dummy checkout session creation for testing
    // In production, this uses stripe.checkout.sessions.create()
    const sessionUrl = `https://checkout.stripe.com/pay/cs_test_dummy?plan=${planId}&cycle=${cycle}`;
    
    res.json({ url: sessionUrl });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
});

export default router;
