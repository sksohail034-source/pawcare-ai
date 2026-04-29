import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { getDb, saveDatabase } from '../database.js';
import { authenticateToken } from '../middleware/auth.js';
import { generateOTP, sendOTPEmail } from '../utils/email.js';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'pawcare-secret-key-2024';

// Step 1: Register — validate, save pending user data, send OTP
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone, country_code } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: 'Name, email and password are required' });
    
    const db = getDb();
    const existing = db.exec(`SELECT id FROM users WHERE email = '${email.replace(/'/g, "''")}'`);
    if (existing.length > 0 && existing[0].values.length > 0) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Generate OTP
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // 10 min expiry
    const otpId = uuidv4();

    // Store pending registration data with OTP
    const userData = JSON.stringify({ name, email, password, phone: phone || '', country_code: country_code || '+1' });
    
    // Clear old OTPs for this email
    db.run(`DELETE FROM otp_codes WHERE email = ?`, [email]);
    db.run(`INSERT INTO otp_codes (id, email, otp, purpose, user_data, expires_at) VALUES (?, ?, ?, 'register', ?, ?)`,
      [otpId, email, otp, userData, expiresAt]);
    saveDatabase();

    // Send OTP email
    const emailResult = await sendOTPEmail(email, otp, 'register');
    
    console.log(`[Auth] OTP sent for registration: ${email}`);
    
    const response = { 
      message: 'Verification code sent to your email', 
      otpId,
      requiresOTP: true 
    };
    
    // In dev/fallback mode, include OTP for testing
    if (emailResult.fallback || !emailResult.success) {
      response.devOTP = otp;
    }
    
    res.json(response);
  } catch (err) { 
    console.error('Register error:', err); 
    res.status(500).json({ error: 'Registration failed' }); 
  }
});

// Step 1: Login — validate credentials, send OTP
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
    
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
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

    // Generate OTP
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();
    const otpId = uuidv4();

    // Clear old OTPs and save new
    db.run(`DELETE FROM otp_codes WHERE email = ?`, [email]);
    db.run(`INSERT INTO otp_codes (id, email, otp, purpose, expires_at) VALUES (?, ?, ?, 'login', ?)`,
      [otpId, email, otp, expiresAt]);
    saveDatabase();

    // Send OTP email
    const emailResult = await sendOTPEmail(email, otp, 'login');
    
    console.log(`[Auth] OTP sent for login: ${email}`);
    
    const response = { 
      message: 'Verification code sent to your email', 
      otpId,
      requiresOTP: true 
    };
    
    if (emailResult.fallback || !emailResult.success) {
      response.devOTP = otp;
    }
    
    res.json(response);
  } catch (err) { 
    console.error('Login error:', err); 
    res.status(500).json({ error: 'Login failed' }); 
  }
});

// Step 2: Verify OTP — complete login or registration
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp, otpId } = req.body;
    if (!email || !otp) return res.status(400).json({ error: 'Email and OTP required' });

    const db = getDb();
    
    // Find valid OTP
    const otpResult = db.exec(
      `SELECT * FROM otp_codes WHERE email = '${email.replace(/'/g, "''")}' AND otp = '${otp}' AND verified = 0 ORDER BY created_at DESC LIMIT 1`
    );
    
    if (otpResult.length === 0 || otpResult[0].values.length === 0) {
      return res.status(400).json({ error: 'Invalid verification code' });
    }

    const otpCols = otpResult[0].columns;
    const otpRow = otpResult[0].values[0];
    const otpRecord = {};
    otpCols.forEach((col, i) => { otpRecord[col] = otpRow[i]; });

    // Check expiry
    if (new Date(otpRecord.expires_at) < new Date()) {
      db.run(`DELETE FROM otp_codes WHERE email = ?`, [email]);
      saveDatabase();
      return res.status(400).json({ error: 'Verification code expired. Please request a new one.' });
    }

    // Mark as verified
    db.run(`UPDATE otp_codes SET verified = 1 WHERE id = ?`, [otpRecord.id]);

    if (otpRecord.purpose === 'register') {
      // Complete registration
      const userData = JSON.parse(otpRecord.user_data);
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const id = uuidv4();
      
      // Check if user was already created (double-submit protection)
      const existing = db.exec(`SELECT id FROM users WHERE email = '${email.replace(/'/g, "''")}'`);
      if (existing.length > 0 && existing[0].values.length > 0) {
        return res.status(400).json({ error: 'Account already exists. Please login.' });
      }
      
      db.run(`INSERT INTO users (id, name, email, password, phone, country_code, role, subscription, scan_count) VALUES (?, ?, ?, ?, ?, ?, 'user', 'free', 0)`,
        [id, userData.name, userData.email, hashedPassword, userData.phone, userData.country_code]);
      
      // Cleanup OTPs
      db.run(`DELETE FROM otp_codes WHERE email = ?`, [email]);
      saveDatabase();

      const token = jwt.sign({ id, email, role: 'user' }, JWT_SECRET, { expiresIn: '30d' });
      console.log(`[Auth] ✅ Registration complete: ${email}`);
      
      res.json({ 
        token, 
        user: { id, name: userData.name, email, phone: userData.phone, country_code: userData.country_code, role: 'user', subscription: 'free', scan_count: 0, ad_bonus_scans: 0 } 
      });

    } else {
      // Complete login
      const userResult = db.exec(`SELECT * FROM users WHERE email = '${email.replace(/'/g, "''")}'`);
      if (userResult.length === 0 || userResult[0].values.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      const cols = userResult[0].columns;
      const row = userResult[0].values[0];
      const user = {};
      cols.forEach((col, i) => { user[col] = row[i]; });

      // Cleanup OTPs
      db.run(`DELETE FROM otp_codes WHERE email = ?`, [email]);
      saveDatabase();

      const token = jwt.sign({ id: user.id, email: user.email, role: user.role || 'user' }, JWT_SECRET, { expiresIn: '30d' });
      delete user.password;
      delete user.password_reset_token;
      delete user.reset_token_expires;
      
      console.log(`[Auth] ✅ Login complete: ${email}`);
      res.json({ token, user });
    }
  } catch (err) {
    console.error('OTP verify error:', err);
    res.status(500).json({ error: 'Verification failed' });
  }
});

// Resend OTP
router.post('/resend-otp', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email required' });

    const db = getDb();
    
    // Check if there's an existing OTP request
    const existing = db.exec(
      `SELECT purpose, user_data FROM otp_codes WHERE email = '${email.replace(/'/g, "''")}' AND verified = 0 ORDER BY created_at DESC LIMIT 1`
    );
    
    if (existing.length === 0 || existing[0].values.length === 0) {
      return res.status(400).json({ error: 'No pending verification found. Please login again.' });
    }
    
    const purpose = existing[0].values[0][0];
    const userData = existing[0].values[0][1];

    // Generate new OTP
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();
    const otpId = uuidv4();

    // Replace old OTP
    db.run(`DELETE FROM otp_codes WHERE email = ?`, [email]);
    db.run(`INSERT INTO otp_codes (id, email, otp, purpose, user_data, expires_at) VALUES (?, ?, ?, ?, ?, ?)`,
      [otpId, email, otp, purpose, userData, expiresAt]);
    saveDatabase();

    const emailResult = await sendOTPEmail(email, otp, purpose);
    console.log(`[Auth] OTP resent to: ${email}`);

    const response = { message: 'New verification code sent!', otpId };
    if (emailResult.fallback || !emailResult.success) {
      response.devOTP = otp;
    }

    res.json(response);
  } catch (err) {
    console.error('Resend OTP error:', err);
    res.status(500).json({ error: 'Failed to resend code' });
  }
});

// Get current user
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

// Restore user data (after DB reset) — client sends backup
router.post('/restore-data', authenticateToken, async (req, res) => {
  try {
    const { scan_count, ad_bonus_scans, subscription } = req.body;
    const db = getDb();
    
    // Get current server values
    const result = db.exec(`SELECT scan_count, ad_bonus_scans, subscription FROM users WHERE id = '${req.user.id}'`);
    if (result.length === 0 || result[0].values.length === 0) return res.status(404).json({ error: 'User not found' });
    
    const serverScan = result[0].values[0][0] || 0;
    const serverBonus = result[0].values[0][1] || 0;
    const serverSub = result[0].values[0][2] || 'free';
    
    // Only restore if client has HIGHER values (prevents cheating)
    // For scan_count: higher means MORE scans used, so restore the higher one
    const restoreScan = Math.max(serverScan, scan_count || 0);
    const restoreBonus = Math.max(serverBonus, ad_bonus_scans || 0);
    // For subscription: keep the better one
    const subRank = { 'free': 0, 'basic': 1, 'pro': 2, 'enterprise': 3 };
    const restoreSub = (subRank[subscription] || 0) > (subRank[serverSub] || 0) ? subscription : serverSub;
    
    db.run(`UPDATE users SET scan_count = ?, ad_bonus_scans = ?, subscription = ? WHERE id = ?`,
      [restoreScan, restoreBonus, restoreSub, req.user.id]);
    saveDatabase();
    
    console.log(`[Auth] Data restored for user ${req.user.id}: scans=${restoreScan}, bonus=${restoreBonus}, sub=${restoreSub}`);
    res.json({ success: true, scan_count: restoreScan, ad_bonus_scans: restoreBonus, subscription: restoreSub });
  } catch (err) {
    console.error('Restore data error:', err);
    res.status(500).json({ error: 'Failed to restore data' });
  }
});

// Forgot password
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

// Reset password
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
