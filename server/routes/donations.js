import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { getDb, saveDatabase } from '../database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

const organizations = [
  { id: 'aspca', name: 'ASPCA', description: 'American Society for the Prevention of Cruelty to Animals', logo: '🐾', location: 'USA' },
  { id: 'hsus', name: 'Humane Society', description: 'Humane Society of the United States', logo: '🏠', location: 'USA' },
  { id: 'wwf', name: 'World Wildlife Fund', description: 'Global wildlife conservation and endangered species protection', logo: '🌍', location: 'Global' },
  { id: 'bestfriends', name: 'Best Friends Animal Society', description: 'Working to end the killing of cats and dogs in shelters', logo: '💛', location: 'USA' },
  { id: 'spca_canada', name: 'SPCA Canada', description: 'Society for Prevention of Cruelty to Animals — Canada', logo: '🍁', location: 'Canada' },
  { id: 'local_shelter', name: 'Local Animal Shelter', description: 'Support your local animal shelter and rescue organizations', logo: '🏡', location: 'Local' },
];

// Get organizations
router.get('/organizations', (req, res) => {
  res.json({ organizations });
});

// Make a donation (simulated)
router.post('/', authenticateToken, (req, res) => {
  try {
    const { amount, organization, message } = req.body;
    if (!amount || !organization) {
      return res.status(400).json({ error: 'Amount and organization are required' });
    }

    if (amount < 1) {
      return res.status(400).json({ error: 'Minimum donation is $1' });
    }

    const db = getDb();
    const id = uuidv4();
    const org = organizations.find(o => o.id === organization);

    db.run(`INSERT INTO donations (id, user_id, amount, organization, message, status) VALUES (?, ?, ?, ?, ?, 'completed')`,
      [id, req.user.id, amount, org ? org.name : organization, message || '']);
    saveDatabase();

    res.status(201).json({
      donation: {
        id,
        amount,
        organization: org ? org.name : organization,
        message: message || '',
        status: 'completed',
        created_at: new Date().toISOString()
      },
      thankYouMessage: `Thank you for your generous $${amount} donation to ${org ? org.name : organization}! Your contribution helps animals in need. 🐾`
    });
  } catch (err) {
    console.error('Donation error:', err);
    res.status(500).json({ error: 'Donation failed' });
  }
});

// Get donation history
router.get('/history', authenticateToken, (req, res) => {
  try {
    const db = getDb();
    const result = db.exec(`SELECT * FROM donations WHERE user_id = '${req.user.id}' ORDER BY created_at DESC`);

    if (result.length === 0) return res.json({ donations: [], totalDonated: 0 });

    const cols = result[0].columns;
    const donations = result[0].values.map(row => {
      const d = {};
      cols.forEach((col, i) => { d[col] = row[i]; });
      return d;
    });

    const totalDonated = donations.reduce((sum, d) => sum + d.amount, 0);

    res.json({ donations, totalDonated });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch donations' });
  }
});

export default router;
