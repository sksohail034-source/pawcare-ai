import { Router } from 'express';
import { getDb, saveDatabase } from '../database.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = Router();

// All admin routes require authentication + admin role
router.use(authenticateToken, requireAdmin);

// GET /api/admin/stats — Platform statistics
router.get('/stats', (req, res) => {
  try {
    const db = getDb();
    const users = db.exec(`SELECT COUNT(*) FROM users WHERE role != 'admin'`);
    const pets = db.exec(`SELECT COUNT(*) FROM pets`);
    const scans = db.exec(`SELECT COUNT(*) FROM ai_results`);
    const vaccinations = db.exec(`SELECT COUNT(*) FROM vaccinations`);
    const donations = db.exec(`SELECT SUM(amount) FROM donations`);

    const freeUsers = db.exec(`SELECT COUNT(*) FROM users WHERE subscription = 'free' AND role != 'admin'`);
    const proUsers = db.exec(`SELECT COUNT(*) FROM users WHERE subscription = 'pro' AND role != 'admin'`);
    const enterpriseUsers = db.exec(`SELECT COUNT(*) FROM users WHERE subscription = 'enterprise' AND role != 'admin'`);

    res.json({
      totalUsers: users[0]?.values[0]?.[0] || 0,
      totalPets: pets[0]?.values[0]?.[0] || 0,
      totalScans: scans[0]?.values[0]?.[0] || 0,
      totalVaccinations: vaccinations[0]?.values[0]?.[0] || 0,
      totalDonations: donations[0]?.values[0]?.[0] || 0,
      subscriptions: {
        free: freeUsers[0]?.values[0]?.[0] || 0,
        pro: proUsers[0]?.values[0]?.[0] || 0,
        enterprise: enterpriseUsers[0]?.values[0]?.[0] || 0,
      }
    });
  } catch (err) {
    console.error('Admin stats error:', err);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// GET /api/admin/users — List all users
router.get('/users', (req, res) => {
  try {
    const db = getDb();
    const result = db.exec(`SELECT id, name, email, phone, role, subscription, scan_count, ad_bonus_scans, created_at FROM users ORDER BY created_at DESC`);
    if (result.length === 0) return res.json({ users: [] });
    const cols = result[0].columns;
    const users = result[0].values.map(row => {
      const user = {};
      cols.forEach((col, i) => { user[col] = row[i]; });
      return user;
    });
    res.json({ users });
  } catch (err) {
    console.error('Admin users error:', err);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// DELETE /api/admin/users/:id — Delete a user
router.delete('/users/:id', (req, res) => {
  try {
    const db = getDb();
    const { id } = req.params;
    if (id === 'admin-001') return res.status(400).json({ error: 'Cannot delete admin account' });
    db.run(`DELETE FROM vaccinations WHERE user_id = ?`, [id]);
    db.run(`DELETE FROM ai_results WHERE user_id = ?`, [id]);
    db.run(`DELETE FROM donations WHERE user_id = ?`, [id]);
    db.run(`DELETE FROM pets WHERE user_id = ?`, [id]);
    db.run(`DELETE FROM users WHERE id = ?`, [id]);
    saveDatabase();
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error('Admin delete user error:', err);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

// PUT /api/admin/users/:id/subscription — Update user subscription
router.put('/users/:id/subscription', (req, res) => {
  try {
    const db = getDb();
    const { id } = req.params;
    const { subscription } = req.body;
    if (!['free', 'pro', 'enterprise'].includes(subscription)) {
      return res.status(400).json({ error: 'Invalid subscription type' });
    }
    db.run(`UPDATE users SET subscription = ? WHERE id = ?`, [subscription, id]);
    saveDatabase();
    res.json({ message: 'Subscription updated' });
  } catch (err) {
    console.error('Admin update subscription error:', err);
    res.status(500).json({ error: 'Failed to update subscription' });
  }
});

// GET /api/admin/activity — Recent activity feed
router.get('/activity', (req, res) => {
  try {
    const db = getDb();
    const recentUsers = db.exec(`SELECT name, email, created_at FROM users WHERE role != 'admin' ORDER BY created_at DESC LIMIT 10`);
    const recentPets = db.exec(`SELECT p.name, p.type, u.name as owner, p.created_at FROM pets p JOIN users u ON p.user_id = u.id ORDER BY p.created_at DESC LIMIT 10`);
    const recentDonations = db.exec(`SELECT d.amount, d.organization, u.name as donor, d.created_at FROM donations d JOIN users u ON d.user_id = u.id ORDER BY d.created_at DESC LIMIT 10`);

    const formatRows = (result) => {
      if (!result.length) return [];
      return result[0].values.map(row => {
        const obj = {};
        result[0].columns.forEach((col, i) => { obj[col] = row[i]; });
        return obj;
      });
    };

    res.json({
      recentUsers: formatRows(recentUsers),
      recentPets: formatRows(recentPets),
      recentDonations: formatRows(recentDonations),
    });
  } catch (err) {
    console.error('Admin activity error:', err);
    res.status(500).json({ error: 'Failed to fetch activity' });
  }
});

export default router;
