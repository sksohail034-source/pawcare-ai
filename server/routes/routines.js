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

    console.log(`[Routines GET] User ${req.user.id} has ${routines.length} routines in DB`);
    res.json({ routines });
  } catch (err) {
    console.error('[Routines GET] Error:', err.message);
    res.status(500).json({ error: 'Failed to fetch routines' });
  }
});

// Create or UPSERT a routine (accepts client-provided ID)
router.post('/', authenticateToken, (req, res) => {
  try {
    const { id: clientId, pet_id, title, type, time, enabled } = req.body;
    
    if (!title || !type || !time) {
      console.error('[Routines POST] Missing fields:', { title, type, time });
      return res.status(400).json({ error: 'Missing required fields (title, type, time)' });
    }

    const id = clientId || uuidv4();
    const db = getDb();
    const enabledVal = (enabled === false || enabled === 0) ? 0 : 1;
    
    // Use INSERT OR REPLACE to handle duplicate IDs gracefully
    db.run(
      `INSERT OR REPLACE INTO routines (id, user_id, pet_id, title, type, time, enabled) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [id, req.user.id, pet_id || null, title, type, time, enabledVal]
    );
    saveDatabase();

    console.log(`[Routines POST] ✅ Saved routine "${title}" at ${time} (id: ${id}, enabled: ${enabledVal}) for user ${req.user.id}`);
    res.status(201).json({ routine: { id, user_id: req.user.id, pet_id, title, type, time, enabled: enabledVal } });
  } catch (err) {
    console.error('[Routines POST] Error:', err.message);
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
    
    console.log(`[Routines PUT] Updated routine ${req.params.id}: ${title} at ${time}, enabled=${enabled ? 1 : 0}`);
    res.json({ success: true });
  } catch (err) {
    console.error('[Routines PUT] Error:', err.message);
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
    
    console.log(`[Routines Toggle] ${req.params.id} -> enabled=${enabled ? 1 : 0}`);
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

// PUBLIC Debug endpoint (NO AUTH) — so we can check DB state from any device
router.get('/debug/status', (req, res) => {
  try {
    const db = getDb();
    
    // Current IST
    const now = new Date();
    const istTime = new Date(now.getTime() + (5.5 * 60 * 60 * 1000));
    const timeStr = `${String(istTime.getUTCHours()).padStart(2, '0')}:${String(istTime.getUTCMinutes()).padStart(2, '0')}`;
    
    // All routines
    const routinesResult = db.exec(`SELECT id, user_id, title, time, enabled, type FROM routines ORDER BY time ASC`);
    let allRoutines = [];
    if (routinesResult.length > 0) {
      const cols = routinesResult[0].columns;
      allRoutines = routinesResult[0].values.map(row => {
        const item = {};
        cols.forEach((col, i) => { item[col] = row[i]; });
        return item;
      });
    }
    
    // Active routines (enabled = 1)
    const activeCount = allRoutines.filter(r => r.enabled === 1).length;
    
    // Matching routines for current time
    const matchingNow = allRoutines.filter(r => r.enabled === 1 && r.time === timeStr);
    
    // Push subscriptions
    const pushResult = db.exec(`SELECT user_id, substr(subscription, 1, 80) as sub_preview FROM push_subscriptions`);
    let pushSubs = [];
    if (pushResult.length > 0) {
      pushSubs = pushResult[0].values.map(row => ({ user_id: row[0], preview: row[1] }));
    }
    
    res.json({
      server_utc: now.toISOString(),
      current_ist: timeStr,
      total_routines: allRoutines.length,
      active_routines: activeCount,
      matching_now: matchingNow.length,
      all_routines: allRoutines,
      matching_routines: matchingNow,
      push_subscriptions: pushSubs.length,
      push_details: pushSubs
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
