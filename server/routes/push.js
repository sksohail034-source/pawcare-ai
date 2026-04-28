import { Router } from 'express';
import { getDb, saveDatabase } from '../database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

router.post('/subscribe', authenticateToken, (req, res) => {
  try {
    const { subscription } = req.body;
    const db = getDb();
    const subStr = JSON.stringify(subscription);
    
    // Extract endpoint domain to identify device
    // Each device/browser has a unique push endpoint
    const endpoint = subscription?.endpoint || '';
    
    // Check if this exact subscription already exists
    const existing = db.exec(
      `SELECT rowid FROM push_subscriptions WHERE user_id = '${req.user.id}' AND subscription = '${subStr.replace(/'/g, "''")}'`
    );
    
    if (existing.length === 0 || existing[0].values.length === 0) {
      // Insert new subscription
      db.run(`INSERT INTO push_subscriptions (user_id, subscription) VALUES (?, ?)`, 
        [req.user.id, subStr]);
      saveDatabase();
      console.log(`[Push] New subscription saved for user ${req.user.id}. Endpoint: ${endpoint.substring(0, 60)}...`);
    } else {
      console.log(`[Push] Subscription already exists for user ${req.user.id}.`);
    }
    
    // Count total subscriptions for this user
    const countResult = db.exec(`SELECT COUNT(*) FROM push_subscriptions WHERE user_id = '${req.user.id}'`);
    const count = countResult.length > 0 ? countResult[0].values[0][0] : 0;
    
    res.status(201).json({ success: true, device_count: count });
  } catch (err) {
    console.error('Push subscription error:', err);
    res.status(500).json({ error: 'Failed to subscribe' });
  }
});

export default router;
