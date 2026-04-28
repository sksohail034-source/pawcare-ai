import { Router } from 'express';
import webpush from 'web-push';
import { getDb, saveDatabase } from '../database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

router.post('/subscribe', authenticateToken, (req, res) => {
  try {
    const { subscription } = req.body;
    const db = getDb();
    const subStr = JSON.stringify(subscription);
    
    const endpoint = subscription?.endpoint || '';
    
    // Check if this exact subscription already exists
    const existing = db.exec(
      `SELECT rowid FROM push_subscriptions WHERE user_id = '${req.user.id}' AND subscription = '${subStr.replace(/'/g, "''")}'`
    );
    
    if (existing.length === 0 || existing[0].values.length === 0) {
      db.run(`INSERT INTO push_subscriptions (user_id, subscription) VALUES (?, ?)`, 
        [req.user.id, subStr]);
      saveDatabase();
      console.log(`[Push] ✅ NEW subscription saved for user ${req.user.id}. Endpoint: ${endpoint.substring(0, 80)}...`);
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

// SERVER-SIDE TEST: Send push to ALL devices of the logged-in user
router.post('/test', authenticateToken, async (req, res) => {
  try {
    const db = getDb();
    const userId = req.user.id;
    
    // Get all subscriptions for this user
    const subResult = db.exec(`SELECT subscription FROM push_subscriptions WHERE user_id = '${userId}'`);
    
    if (subResult.length === 0 || subResult[0].values.length === 0) {
      return res.status(404).json({ 
        error: 'No push subscriptions found for your account. Please enable notifications first.',
        device_count: 0
      });
    }
    
    const subscriptions = subResult[0].values;
    console.log(`[Push Test] Sending test push to ${subscriptions.length} device(s) for user ${userId}...`);
    
    const results = [];
    
    for (let i = 0; i < subscriptions.length; i++) {
      const subRow = subscriptions[i];
      try {
        const subscription = JSON.parse(subRow[0]);
        const endpoint = subscription.endpoint || 'unknown';
        
        await webpush.sendNotification(subscription, JSON.stringify({
          title: '🐾 PawCare Push Test',
          body: `✅ Push notifications are working! Device #${i + 1}`,
          icon: '/pwa-192x192.png',
          badge: '/favicon.svg',
          vibrate: [200, 100, 200, 100, 200],
          data: { url: '/routine' },
          requireInteraction: true,
          tag: 'pawcare-test-' + Date.now(),
          renotify: true
        }));
        
        console.log(`[Push Test] ✅ Device #${i + 1} SUCCESS (${endpoint.substring(0, 60)})`);
        results.push({ device: i + 1, status: 'sent', endpoint: endpoint.substring(0, 60) });
      } catch (pushErr) {
        console.error(`[Push Test] ❌ Device #${i + 1} FAILED:`, pushErr.message, pushErr.statusCode);
        results.push({ device: i + 1, status: 'failed', error: pushErr.message, code: pushErr.statusCode });
        
        // Clean up expired/invalid subscriptions
        if (pushErr.statusCode === 410 || pushErr.statusCode === 404) {
          console.log(`[Push Test] Cleaning expired subscription...`);
          db.run(`DELETE FROM push_subscriptions WHERE subscription = ?`, [subRow[0]]);
          saveDatabase();
        }
      }
    }
    
    res.json({
      total_devices: subscriptions.length,
      results: results,
      message: `Push test sent to ${results.filter(r => r.status === 'sent').length}/${subscriptions.length} devices.`
    });
  } catch (err) {
    console.error('[Push Test] Error:', err);
    res.status(500).json({ error: 'Test push failed: ' + err.message });
  }
});

export default router;
