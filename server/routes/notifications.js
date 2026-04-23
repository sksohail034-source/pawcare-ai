import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { getDb, saveDatabase } from '../database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

// Get all notifications for user
router.get('/', authenticateToken, (req, res) => {
  try {
    const db = getDb();
    const result = db.exec(`SELECT * FROM notifications WHERE user_id = '${req.user.id}' ORDER BY created_at DESC`);
    
    if (result.length === 0) return res.json([]);
    
    const cols = result[0].columns;
    const notifications = result[0].values.map(row => {
      const notification = {};
      cols.forEach((col, i) => { notification[col] = row[i]; });
      return notification;
    });
    
    res.json(notifications);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

// Mark notification as read
router.put('/:id/read', authenticateToken, (req, res) => {
  try {
    const db = getDb();
    db.run(`UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ?`, [req.params.id, req.user.id]);
    saveDatabase();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update notification' });
  }
});

// Create a notification
router.post('/', authenticateToken, (req, res) => {
  try {
    const { title, message } = req.body;
    const db = getDb();
    const id = uuidv4();
    db.run(`INSERT INTO notifications (id, user_id, title, message) VALUES (?, ?, ?, ?)`, 
      [id, req.user.id, title, message]);
    saveDatabase();
    res.json({ success: true, id });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create notification' });
  }
});

export default router;
