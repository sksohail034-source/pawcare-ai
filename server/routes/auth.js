import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { getDb, saveDatabase } from '../database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    const db = getDb();
    const existing = db.exec(`SELECT id FROM users WHERE email = '${email.replace(/'/g, "''")}'`);
    if (existing.length > 0 && existing[0].values.length > 0) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const id = uuidv4();
    const trialEnds = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString();

    db.run(`INSERT INTO users (id, name, email, phone, password, subscription, scans_used, trial_ends_at) VALUES (?, ?, ?, ?, ?, 'free_trial', 0, ?)`,
      [id, name, email, phone || '', hashedPassword, trialEnds]);
    saveDatabase();

    const token = jwt.sign({ id, email, name }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      token,
      user: { id, name, email, phone, subscription: 'free_trial', scans_used: 0, trial_ends_at: trialEnds }
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const db = getDb();
    const result = db.exec(`SELECT * FROM users WHERE email = '${email.replace(/'/g, "''")}'`);

    if (result.length === 0 || result[0].values.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const cols = result[0].columns;
    const row = result[0].values[0];
    const user = {};
    cols.forEach((col, i) => { user[col] = row[i]; });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        subscription: user.subscription,
        scans_used: user.scans_used,
        trial_ends_at: user.trial_ends_at,
        avatar: user.avatar
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Get current user profile
router.get('/me', authenticateToken, (req, res) => {
  try {
    const db = getDb();
    const result = db.exec(`SELECT id, name, email, phone, avatar, subscription, scans_used, trial_ends_at, created_at FROM users WHERE id = '${req.user.id}'`);

    if (result.length === 0 || result[0].values.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const cols = result[0].columns;
    const row = result[0].values[0];
    const user = {};
    cols.forEach((col, i) => { user[col] = row[i]; });

    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

export default router;
