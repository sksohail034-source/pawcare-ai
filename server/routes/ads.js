import { Router } from 'express';
import { getDb, saveDatabase } from '../database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

// Start watching a rewarded ad
router.post('/start', authenticateToken, (req, res) => {
  const adId = `ad_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  res.json({ adId, duration: 15, message: 'Ad started. Watch for 15 seconds to earn +1 scan.' });
});

// Complete watching ad and get reward
router.post('/complete', authenticateToken, (req, res) => {
  try {
    const { adId } = req.body;
    if (!adId) return res.status(400).json({ error: 'Ad ID required' });
    const db = getDb();
    db.run(`UPDATE users SET ad_bonus_scans = ad_bonus_scans + 1 WHERE id = ?`, [req.user.id]);
    saveDatabase();
    const result = db.exec(`SELECT ad_bonus_scans, scan_count FROM users WHERE id = '${req.user.id}'`);
    const adBonusScans = result[0]?.values[0]?.[0] || 0;
    const scanCount = result[0]?.values[0]?.[1] || 0;
    res.json({ message: 'You earned +1 free scan! 🎉', adBonusScans, scanCount });
  } catch (err) { res.status(500).json({ error: 'Failed to process ad reward' }); }
});

export default router;
