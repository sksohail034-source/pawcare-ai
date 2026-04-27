import { Router } from 'express';
import { getDb, saveDatabase } from '../database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

router.post('/subscribe', authenticateToken, (req, res) => {
  try {
    const { subscription } = req.body;
    const db = getDb();
    
    // Check if subscription already exists for this user
    const existing = db.exec(`SELECT * FROM push_subscriptions WHERE user_id = ? AND subscription = ?`, 
      [req.user.id, JSON.stringify(subscription)]);
    
    if (existing.length === 0 || existing[0].values.length === 0) {
      db.run(`INSERT INTO push_subscriptions (user_id, subscription) VALUES (?, ?)`, 
        [req.user.id, JSON.stringify(subscription)]);
      saveDatabase();
    }
    
    res.status(201).json({ success: true });
  } catch (err) {
    console.error('Push subscription error:', err);
    res.status(500).json({ error: 'Failed to subscribe' });
  }
});

export default router;
