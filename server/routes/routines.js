import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { getDb, saveDatabase } from '../database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

// Get all routines for a user
router.get('/', authenticateToken, (req, res) => {
  try {
    const db = getDb();
    const result = db.exec(`SELECT * FROM routines WHERE user_id = '${req.user.id}' ORDER BY time ASC`);

    if (result.length === 0) return res.json({ routines: [] });

    const cols = result[0].columns;
    const routines = result[0].values.map(row => {
      const item = {};
      cols.forEach((col, i) => { item[col] = row[i]; });
      return item;
    });

    res.json({ routines });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch routines' });
  }
});

// Create a new routine
router.post('/', authenticateToken, (req, res) => {
  try {
    const { pet_id, title, type, time } = req.body;
    
    if (!title || !type || !time) {
      return res.status(400).json({ error: 'Missing required fields (title, type, time)' });
    }

    const id = uuidv4();
    const db = getDb();
    
    db.run(
      `INSERT INTO routines (id, user_id, pet_id, title, type, time, enabled) VALUES (?, ?, ?, ?, ?, ?, 1)`,
      [id, req.user.id, pet_id, title, type, time]
    );
    saveDatabase();

    res.status(201).json({ routine: { id, user_id: req.user.id, pet_id, title, type, time, enabled: 1 } });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create routine' });
  }
});

// Update routine (time, title, etc)
router.put('/:id', authenticateToken, (req, res) => {
  try {
    const { title, time, enabled, type } = req.body;
    const db = getDb();
    
    db.run(
      `UPDATE routines SET title = ?, time = ?, enabled = ?, type = ? WHERE id = ? AND user_id = ?`,
      [title, time, enabled ? 1 : 0, type, req.params.id, req.user.id]
    );
    saveDatabase();
    
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update routine' });
  }
});

// Toggle routine
router.put('/:id/toggle', authenticateToken, (req, res) => {
  try {
    const { enabled } = req.body;
    const db = getDb();
    
    db.run(`UPDATE routines SET enabled = ? WHERE id = ? AND user_id = ?`, 
      [enabled ? 1 : 0, req.params.id, req.user.id]);
    saveDatabase();
    
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update routine' });
  }
});

// Delete a routine
router.delete('/:id', authenticateToken, (req, res) => {
  try {
    const db = getDb();
    db.run(`DELETE FROM routines WHERE id = ? AND user_id = ?`, [req.params.id, req.user.id]);
    saveDatabase();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete routine' });
  }
});

export default router;
