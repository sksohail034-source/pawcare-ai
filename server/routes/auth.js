import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { getDb, saveDatabase } from '../database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'pawcare-secret-key-2024';

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone, country_code } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: 'Name, email and password are required' });
    const db = getDb();
    const existing = db.exec(`SELECT id FROM users WHERE email = '${email}'`);
    if (existing.length > 0 && existing[0].values.length > 0) return res.status(400).json({ error: 'Email already registered' });
    const hashedPassword = await bcrypt.hash(password, 10);
    const id = uuidv4();
    db.run(`INSERT INTO users (id, name, email, password, phone, country_code, role, subscription, scan_count) VALUES (?, ?, ?, ?, ?, ?, 'user', 'free', 0)`,
      [id, name, email, hashedPassword, phone || '', country_code || '+1']);
    saveDatabase();
    const token = jwt.sign({ id, email, role: 'user' }, JWT_SECRET, { expiresIn: '30d' });
    res.json({ token, user: { id, name, email, phone: phone || '', country_code: country_code || '+1', role: 'user', subscription: 'free', scan_count: 0, ad_bonus_scans: 0 } });
  } catch (err) { console.error('Register error:', err); res.status(500).json({ error: 'Registration failed' }); }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
    const db = getDb();
    const result = db.exec(`SELECT * FROM users WHERE email = '${email}'`);
    if (result.length === 0 || result[0].values.length === 0) return res.status(401).json({ error: 'Invalid credentials' });
    const cols = result[0].columns;
    const row = result[0].values[0];
    const user = {};
    cols.forEach((col, i) => { user[col] = row[i]; });
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role || 'user' }, JWT_SECRET, { expiresIn: '30d' });
    delete user.password;
    delete user.password_reset_token;
    delete user.reset_token_expires;
    res.json({ token, user });
  } catch (err) { console.error('Login error:', err); res.status(500).json({ error: 'Login failed' }); }
});

router.get('/me', authenticateToken, (req, res) => {
  try {
    const db = getDb();
    const result = db.exec(`SELECT * FROM users WHERE id = '${req.user.id}'`);
    if (result.length === 0 || result[0].values.length === 0) return res.status(404).json({ error: 'User not found' });
    const cols = result[0].columns;
    const row = result[0].values[0];
    const user = {};
    cols.forEach((col, i) => { user[col] = row[i]; });
    delete user.password;
    delete user.password_reset_token;
    delete user.reset_token_expires;
    res.json({ user });
  } catch (err) { res.status(500).json({ error: 'Failed to fetch user' }); }
});

router.post('/forgot-password', (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email required' });
    const db = getDb();
    const result = db.exec(`SELECT id FROM users WHERE email = '${email}'`);
    if (result.length === 0 || result[0].values.length === 0) {
      return res.json({ message: 'If the email exists, a reset link has been sent.' });
    }
    const token = uuidv4().replace(/-/g, '').substring(0, 6).toUpperCase();
    const expires = new Date(Date.now() + 3600000).toISOString();
    db.run(`UPDATE users SET password_reset_token = ?, reset_token_expires = ? WHERE email = ?`, [token, expires, email]);
    saveDatabase();
    console.log(`Password reset code for ${email}: ${token}`);
    res.json({ message: 'If the email exists, a reset code has been sent.', code: token });
  } catch (err) { res.status(500).json({ error: 'Failed to process request' }); }
});

router.post('/reset-password', async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;
    if (!email || !code || !newPassword) return res.status(400).json({ error: 'All fields required' });
    const db = getDb();
    const result = db.exec(`SELECT id, password_reset_token, reset_token_expires FROM users WHERE email = '${email}'`);
    if (result.length === 0 || result[0].values.length === 0) return res.status(400).json({ error: 'Invalid request' });
    const row = result[0].values[0];
    const storedToken = row[1];
    const expires = row[2];
    if (!storedToken || storedToken !== code) return res.status(400).json({ error: 'Invalid reset code' });
    if (new Date(expires) < new Date()) return res.status(400).json({ error: 'Reset code expired' });
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    db.run(`UPDATE users SET password = ?, password_reset_token = NULL, reset_token_expires = NULL WHERE email = ?`, [hashedPassword, email]);
    saveDatabase();
    res.json({ message: 'Password reset successfully!' });
  } catch (err) { res.status(500).json({ error: 'Failed to reset password' }); }
});

export default router;
