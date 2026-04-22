import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { getDb, saveDatabase } from '../database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

const vaccineIntervals = {
  'Rabies':365,'DHPP (Distemper)':365,'Bordetella':180,'Leptospirosis':365,
  'Canine Influenza':365,'Lyme Disease':365,'FVRCP':365,'FeLV (Feline Leukemia)':365,
  'FIV':365,'Polyomavirus':365,'Psittacosis Test':180,'CDT (Clostridium)':365,
  'Caseous Lymphadenitis':365,'Foot Rot Vaccine':180,'Water Quality Test':30,
  'Parasite Prevention':90,'RHDV2':365,'Myxomatosis':365,'Tetanus Toxoid':365,
  'West Nile Virus':365,'Equine Influenza':180,'EHV (Rhinopneumonitis)':180,
  'Blackleg (Clostridial)':365,'IBR (Infectious Bovine Rhinotracheitis)':365,
  'BVD (Bovine Viral Diarrhea)':365,'Brucellosis':365
};

function calcNextDue(vaccineName, dateGiven) {
  if (!dateGiven) return null;
  const days = vaccineIntervals[vaccineName] || 365;
  const d = new Date(dateGiven);
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

function parseRows(result) {
  if (!result.length || !result[0].values.length) return [];
  const cols = result[0].columns;
  return result[0].values.map(row => {
    const obj = {};
    cols.forEach((c, i) => { obj[c] = row[i]; });
    return obj;
  });
}

router.get('/overdue/:userId', authenticateToken, (req, res) => {
  try {
    const db = getDb();
    const today = new Date().toISOString().split('T')[0];
    const result = db.exec(`SELECT v.*, p.name as pet_name, p.type as pet_type FROM vaccinations v JOIN pets p ON v.pet_id = p.id WHERE v.user_id = '${req.user.id}' AND v.next_due IS NOT NULL AND v.next_due < '${today}'`);
    res.json({ overdue: parseRows(result) });
  } catch (err) { res.status(500).json({ error: 'Failed' }); }
});

router.get('/:petId', authenticateToken, (req, res) => {
  try {
    const db = getDb();
    const result = db.exec(`SELECT * FROM vaccinations WHERE pet_id = '${req.params.petId}' AND user_id = '${req.user.id}' ORDER BY created_at DESC`);
    res.json({ vaccinations: parseRows(result) });
  } catch (err) { res.status(500).json({ error: 'Failed to fetch vaccinations' }); }
});

router.post('/', authenticateToken, (req, res) => {
  try {
    const { pet_id, vaccine_name, date_given, next_due, notes } = req.body;
    if (!pet_id || !vaccine_name) return res.status(400).json({ error: 'Pet and vaccine name required' });
    const db = getDb();
    const id = uuidv4();
    const computedNextDue = next_due || calcNextDue(vaccine_name, date_given);
    const status = date_given ? 'completed' : 'upcoming';
    db.run(`INSERT INTO vaccinations (id, pet_id, user_id, vaccine_name, date_given, next_due, status, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, pet_id, req.user.id, vaccine_name, date_given || null, computedNextDue, status, notes || '']);
    saveDatabase();
    res.json({ message: 'Vaccination added!', vaccination: { id, pet_id, vaccine_name, date_given, next_due: computedNextDue, status, notes } });
  } catch (err) { res.status(500).json({ error: 'Failed to add vaccination' }); }
});

router.put('/:id', authenticateToken, (req, res) => {
  try {
    const { vaccine_name, date_given, next_due, notes } = req.body;
    const db = getDb();
    const computedNextDue = next_due || calcNextDue(vaccine_name, date_given);
    const status = date_given ? 'completed' : 'upcoming';
    db.run(`UPDATE vaccinations SET vaccine_name = ?, date_given = ?, next_due = ?, status = ?, notes = ? WHERE id = ? AND user_id = ?`,
      [vaccine_name, date_given || null, computedNextDue, status, notes || '', req.params.id, req.user.id]);
    saveDatabase();
    res.json({ message: 'Vaccination updated!' });
  } catch (err) { res.status(500).json({ error: 'Failed to update' }); }
});

router.delete('/:id', authenticateToken, (req, res) => {
  try {
    const db = getDb();
    db.run(`DELETE FROM vaccinations WHERE id = ? AND user_id = ?`, [req.params.id, req.user.id]);
    saveDatabase();
    res.json({ message: 'Vaccination deleted' });
  } catch (err) { res.status(500).json({ error: 'Failed to delete' }); }
});

export default router;
