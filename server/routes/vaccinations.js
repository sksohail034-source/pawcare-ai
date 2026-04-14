import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { getDb, saveDatabase } from '../database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

// Get vaccinations for a pet
router.get('/:petId', authenticateToken, (req, res) => {
  try {
    const db = getDb();
    const result = db.exec(`SELECT * FROM vaccinations WHERE pet_id = '${req.params.petId}' AND user_id = '${req.user.id}' ORDER BY next_due ASC`);

    if (result.length === 0) return res.json({ vaccinations: [] });

    const cols = result[0].columns;
    const vaccinations = result[0].values.map(row => {
      const v = {};
      cols.forEach((col, i) => { v[col] = row[i]; });
      return v;
    });

    res.json({ vaccinations });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch vaccinations' });
  }
});

// Add vaccination
router.post('/', authenticateToken, (req, res) => {
  try {
    const { pet_id, vaccine_name, date_given, next_due, notes } = req.body;
    if (!pet_id || !vaccine_name) {
      return res.status(400).json({ error: 'Pet ID and vaccine name are required' });
    }

    const db = getDb();
    const id = uuidv4();
    const status = next_due && new Date(next_due) > new Date() ? 'upcoming' : 'completed';

    db.run(`INSERT INTO vaccinations (id, pet_id, user_id, vaccine_name, date_given, next_due, status, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, pet_id, req.user.id, vaccine_name, date_given || null, next_due || null, status, notes || '']);
    saveDatabase();

    res.status(201).json({
      vaccination: { id, pet_id, user_id: req.user.id, vaccine_name, date_given, next_due, status, notes: notes || '' }
    });
  } catch (err) {
    console.error('Create vaccination error:', err);
    res.status(500).json({ error: 'Failed to create vaccination' });
  }
});

// Update vaccination
router.put('/:id', authenticateToken, (req, res) => {
  try {
    const { vaccine_name, date_given, next_due, status, notes } = req.body;
    const db = getDb();

    db.run(`UPDATE vaccinations SET vaccine_name = ?, date_given = ?, next_due = ?, status = ?, notes = ? WHERE id = ? AND user_id = ?`,
      [vaccine_name, date_given, next_due, status || 'upcoming', notes || '', req.params.id, req.user.id]);
    saveDatabase();

    res.json({ message: 'Vaccination updated' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update vaccination' });
  }
});

// Delete vaccination
router.delete('/:id', authenticateToken, (req, res) => {
  try {
    const db = getDb();
    db.run(`DELETE FROM vaccinations WHERE id = '${req.params.id}' AND user_id = '${req.user.id}'`);
    saveDatabase();
    res.json({ message: 'Vaccination deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete vaccination' });
  }
});

export default router;
