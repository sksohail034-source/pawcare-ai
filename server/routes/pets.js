import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { getDb, saveDatabase } from '../database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

// Get all pets for the current user
router.get('/', authenticateToken, (req, res) => {
  try {
    const db = getDb();
    const result = db.exec(`SELECT * FROM pets WHERE user_id = '${req.user.id}' ORDER BY created_at DESC`);

    if (result.length === 0) return res.json({ pets: [] });

    const cols = result[0].columns;
    const pets = result[0].values.map(row => {
      const pet = {};
      cols.forEach((col, i) => { pet[col] = row[i]; });
      return pet;
    });

    res.json({ pets });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch pets' });
  }
});

// Get single pet
router.get('/:id', authenticateToken, (req, res) => {
  try {
    const db = getDb();
    const result = db.exec(`SELECT * FROM pets WHERE id = '${req.params.id}' AND user_id = '${req.user.id}'`);

    if (result.length === 0 || result[0].values.length === 0) {
      return res.status(404).json({ error: 'Pet not found' });
    }

    const cols = result[0].columns;
    const row = result[0].values[0];
    const pet = {};
    cols.forEach((col, i) => { pet[col] = row[i]; });

    res.json({ pet });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch pet' });
  }
});

// Create pet
router.post('/', authenticateToken, (req, res) => {
  try {
    const { name, type, breed, age, weight, photo, notes } = req.body;
    if (!name || !type) {
      return res.status(400).json({ error: 'Name and type are required' });
    }

    const db = getDb();
    
    // Check pet limits
    const userRes = db.exec(`SELECT subscription, role FROM users WHERE id = '${req.user.id}'`);
    const sub = userRes[0]?.values[0][0] || 'free';
    const role = userRes[0]?.values[0][1] || 'user';
    const petCountRes = db.exec(`SELECT COUNT(*) FROM pets WHERE user_id = '${req.user.id}'`);
    const currentPets = petCountRes[0]?.values[0][0] || 0;
    
    const maxPets = (sub === 'pro' || sub === 'enterprise' || role === 'admin') ? -1 : sub === 'basic' ? 2 : 1;
    if (maxPets !== -1 && currentPets >= maxPets) {
      return res.status(403).json({ error: 'Pet limit reached for your current plan.' });
    }

    const id = uuidv4();

    db.run(`INSERT INTO pets (id, user_id, name, type, breed, age, weight, photo, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, req.user.id, name, type, breed || '', age || 0, weight || 0, photo || '', notes || '']);
    saveDatabase();

    res.status(201).json({
      pet: { id, user_id: req.user.id, name, type, breed: breed || '', age: age || 0, weight: weight || 0, photo: photo || '', notes: notes || '' }
    });
  } catch (err) {
    console.error('Create pet error:', err);
    res.status(500).json({ error: 'Failed to create pet' });
  }
});

// Update pet
router.put('/:id', authenticateToken, (req, res) => {
  try {
    const { name, type, breed, age, weight, photo, notes } = req.body;
    const db = getDb();

    db.run(`UPDATE pets SET name = ?, type = ?, breed = ?, age = ?, weight = ?, photo = ?, notes = ? WHERE id = ? AND user_id = ?`,
      [name, type, breed || '', age || 0, weight || 0, photo || '', notes || '', req.params.id, req.user.id]);
    saveDatabase();

    res.json({ message: 'Pet updated' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update pet' });
  }
});

// Delete pet
router.delete('/:id', authenticateToken, (req, res) => {
  try {
    const db = getDb();
    db.run(`DELETE FROM pets WHERE id = '${req.params.id}' AND user_id = '${req.user.id}'`);
    saveDatabase();
    res.json({ message: 'Pet deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete pet' });
  }
});

export default router;
