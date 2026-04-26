import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { getDb, saveDatabase } from '../database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

// AI Grooming / Styling suggestions
const groomingStyles = {
  dog: [
    { name: 'Royal Poodle Cut', description: 'An elegant poodle-style trim with fluffy pompoms on legs and tail', confidence: 0.95, tags: ['elegant', 'show-ready', 'classic'] },
    { name: 'Teddy Bear Trim', description: 'A soft, rounded cut that makes your dog look like an adorable teddy bear', confidence: 0.92, tags: ['cute', 'low-maintenance', 'popular'] },
    { name: 'Lion Mane Style', description: 'A bold lion-inspired look with a full mane around the face and a trimmed body', confidence: 0.88, tags: ['bold', 'unique', 'statement'] },
    { name: 'Summer Sporty Cut', description: 'A short, practical trim perfect for warm weather and active dogs', confidence: 0.91, tags: ['practical', 'summer', 'active'] },
    { name: 'Puppy Cut Classic', description: 'An even-length trim all over that maintains a youthful, playful appearance', confidence: 0.94, tags: ['youthful', 'easy-care', 'all-seasons'] },
  ],
  cat: [
    { name: 'Lion Cut', description: 'Classic feline lion cut with a majestic mane ruff and trimmed body', confidence: 0.93, tags: ['dramatic', 'cool', 'easy-groom'] },
    { name: 'Panther Sleek', description: 'A smooth, close-trimmed body with natural face and tail floof', confidence: 0.89, tags: ['sleek', 'modern', 'low-shed'] },
    { name: 'Dragon Cut', description: 'Creative lines along the spine creating a dragon-ridge effect', confidence: 0.85, tags: ['creative', 'unique', 'show-stopping'] },
    { name: 'Kitten Soft Trim', description: 'A gentle trim that keeps fur soft and manageable while looking adorable', confidence: 0.92, tags: ['gentle', 'natural', 'cute'] },
  ],
  bird: [
    { name: 'Feather Glow Treatment', description: 'AI-recommended feather conditioning routine for vibrant plumage', confidence: 0.90, tags: ['health', 'shine', 'natural'] },
    { name: 'Wing Symmetry Check', description: 'Analysis of wing feather alignment for optimal flight health', confidence: 0.87, tags: ['health', 'flight', 'checkup'] },
  ],
  rabbit: [
    { name: 'Angora Fluff Style', description: 'A carefully maintained fluffy look with rounded silhouette', confidence: 0.91, tags: ['fluffy', 'adorable', 'show-ready'] },
    { name: 'Summer Cool Trim', description: 'A shorter trim for warm months to keep your bunny comfortable', confidence: 0.88, tags: ['practical', 'comfort', 'summer'] },
  ],
  other: [
    { name: 'Natural Beauty Groom', description: 'A gentle grooming routine tailored to your pet\'s specific needs', confidence: 0.86, tags: ['gentle', 'natural', 'custom'] },
  ]
};

// AI Health Tips
const healthTips = {
  dog: [
    { category: 'Diet', title: 'Balanced Nutrition Plan', tip: 'Ensure your dog gets a mix of high-quality protein (25-30%), healthy fats, and complex carbohydrates. Include omega-3 fatty acids for coat health.', priority: 'high' },
    { category: 'Exercise', title: 'Daily Activity Routine', tip: 'Most dogs need 30-60 minutes of exercise daily. Breed-specific needs vary — high-energy breeds may need 1-2 hours.', priority: 'high' },
    { category: 'Dental', title: 'Oral Health Care', tip: 'Brush your dog\'s teeth 2-3 times per week. Dental disease affects 80% of dogs by age 3. Consider dental chews as supplements.', priority: 'medium' },
    { category: 'Hygiene', title: 'Bathing Schedule', tip: 'Bath every 4-6 weeks unless they get dirty sooner. Over-bathing strips natural oils. Use pH-balanced dog shampoo.', priority: 'medium' },
    { category: 'Behavior', title: 'Mental Stimulation', tip: 'Provide puzzle toys and training sessions. Mental stimulation is as important as physical exercise for preventing anxiety and destructive behavior.', priority: 'medium' },
    { category: 'Prevention', title: 'Parasite Protection', tip: 'Use year-round flea, tick, and heartworm prevention. Check for ticks after outdoor walks, especially in wooded areas.', priority: 'high' },
  ],
  cat: [
    { category: 'Diet', title: 'Feline Nutrition Guide', tip: 'Cats are obligate carnivores. Feed high-protein, meat-based food. Ensure adequate taurine intake. Avoid excessive carbohydrates.', priority: 'high' },
    { category: 'Hydration', title: 'Water Intake', tip: 'Cats often don\'t drink enough water. Consider a pet water fountain — cats prefer running water. Wet food also helps hydration.', priority: 'high' },
    { category: 'Dental', title: 'Dental Care', tip: 'Cats are prone to dental issues. Annual dental checks are recommended. Look for signs like drooling, bad breath, or difficulty eating.', priority: 'medium' },
    { category: 'Behavior', title: 'Environmental Enrichment', tip: 'Provide vertical spaces, scratching posts, and interactive toys. Indoor cats need stimulation to prevent obesity and behavioral issues.', priority: 'medium' },
    { category: 'Litter', title: 'Litter Box Hygiene', tip: 'Clean litter daily and fully change weekly. One box per cat plus one extra. Sudden litter avoidance can signal health issues.', priority: 'medium' },
  ],
  bird: [
    { category: 'Diet', title: 'Avian Nutrition', tip: 'Provide a varied diet of pellets, fresh fruits, vegetables, and occasional seeds. Avoid avocado, chocolate, and caffeine — they\'re toxic to birds.', priority: 'high' },
    { category: 'Environment', title: 'Cage & Air Quality', tip: 'Keep cage clean daily. Avoid non-stick cookware fumes, air fresheners, and smoke near birds — their respiratory systems are extremely sensitive.', priority: 'high' },
  ],
  rabbit: [
    { category: 'Diet', title: 'Rabbit Nutrition', tip: 'Unlimited timothy hay should be 80% of diet. Add fresh leafy greens daily. Limit pellets and treats. Always provide fresh water.', priority: 'high' },
    { category: 'Dental', title: 'Teeth Health', tip: 'Rabbit teeth grow continuously. Hay and chew toys prevent overgrowth. Watch for drooling or difficulty eating as signs of dental problems.', priority: 'high' },
  ],
  other: [
    { category: 'General', title: 'Regular Vet Visits', tip: 'Schedule annual wellness checks. Exotic pets often hide illness symptoms. Early detection is key to successful treatment.', priority: 'high' },
  ]
};

// Check if user can scan
function checkScanLimit(db, userId) {
  const userRes = db.exec(`SELECT subscription, scan_count, ad_bonus_scans, role FROM users WHERE id = '${userId}'`);
  if (!userRes[0]) return { allowed: false };
  const sub = userRes[0].values[0][0];
  const scanCount = userRes[0].values[0][1] || 0;
  const adBonusScans = userRes[0].values[0][2] || 0;
  const role = userRes[0].values[0][3] || 'user';
  
  if (sub === 'pro' || sub === 'advance' || role === 'admin') return { allowed: true };
  if (scanCount < 3 + adBonusScans) return { allowed: true, scanCount, adBonusScans };
  return { allowed: false };
}

// Increment scan count
function incrementScan(db, userId, scanCount) {
  db.run(`UPDATE users SET scan_count = ? WHERE id = ?`, [(scanCount || 0) + 1, userId]);
  saveDatabase();
}

router.post('/analyze/:petId', authenticateToken, (req, res) => {
  try {
    const db = getDb();
    const limitCheck = checkScanLimit(db, req.user.id);
    if (!limitCheck.allowed) return res.status(403).json({ error: 'No scans remaining. Watch an ad to continue.' });
    
    incrementScan(db, req.user.id, limitCheck.scanCount);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: 'Failed to update scan count' }); }
});

// Get grooming/style suggestions for a pet
router.post('/style/:petId', authenticateToken, (req, res) => {
  try {
    const db = getDb();
    const limitCheck = checkScanLimit(db, req.user.id);
    if (!limitCheck.allowed) return res.status(403).json({ error: 'No scans remaining. Watch an ad to continue.' });

    const result = db.exec(`SELECT * FROM pets WHERE id = '${req.params.petId}' AND user_id = '${req.user.id}'`);

    if (result.length === 0 || result[0].values.length === 0) {
      return res.status(404).json({ error: 'Pet not found' });
    }

    const cols = result[0].columns;
    const row = result[0].values[0];
    const pet = {};
    cols.forEach((col, i) => { pet[col] = row[i]; });

    const petType = pet.type.toLowerCase();
    const styles = groomingStyles[petType] || groomingStyles.other;

    // Simulate AI processing delay
    const selectedStyles = styles.map(s => ({
      ...s,
      confidence: +(s.confidence + (Math.random() * 0.05 - 0.025)).toFixed(2),
      estimatedCost: `$${(30 + Math.random() * 70).toFixed(0)}`,
      estimatedTime: `${(30 + Math.floor(Math.random() * 60))} minutes`
    }));

    // Save AI result
    const resultId = uuidv4();
    db.run(`INSERT INTO ai_results (id, pet_id, user_id, type, result) VALUES (?, ?, ?, 'styling', ?)`,
      [resultId, req.params.petId, req.user.id, JSON.stringify(selectedStyles)]);
    saveDatabase();

    res.json({
      pet: { name: pet.name, type: pet.type, breed: pet.breed },
      styles: selectedStyles,
      resultId,
      generatedAt: new Date().toISOString()
    });
  } catch (err) {
    console.error('AI style error:', err);
    res.status(500).json({ error: 'AI processing failed' });
  }
});

// Get health tips for a pet
router.post('/health/:petId', authenticateToken, (req, res) => {
  try {
    const db = getDb();
    const limitCheck = checkScanLimit(db, req.user.id);
    if (!limitCheck.allowed) return res.status(403).json({ error: 'No scans remaining. Watch an ad to continue.' });

    const result = db.exec(`SELECT * FROM pets WHERE id = '${req.params.petId}' AND user_id = '${req.user.id}'`);

    if (result.length === 0 || result[0].values.length === 0) {
      return res.status(404).json({ error: 'Pet not found' });
    }

    const cols = result[0].columns;
    const row = result[0].values[0];
    const pet = {};
    cols.forEach((col, i) => { pet[col] = row[i]; });

    const petType = pet.type.toLowerCase();
    const tips = healthTips[petType] || healthTips.other;

    const personalizedTips = tips.map(t => ({
      ...t,
      personalNote: `Based on ${pet.name}'s profile as a ${pet.age > 0 ? pet.age + ' year old ' : ''}${pet.breed || pet.type}`,
      id: uuidv4()
    }));

    // Save AI result
    const resultId = uuidv4();
    db.run(`INSERT INTO ai_results (id, pet_id, user_id, type, result) VALUES (?, ?, ?, 'health', ?)`,
      [resultId, req.params.petId, req.user.id, JSON.stringify(personalizedTips)]);
    saveDatabase();

    res.json({
      pet: { name: pet.name, type: pet.type, breed: pet.breed },
      tips: personalizedTips,
      resultId,
      generatedAt: new Date().toISOString()
    });
  } catch (err) {
    console.error('AI health error:', err);
    res.status(500).json({ error: 'AI processing failed' });
  }
});

// Get AI history
router.get('/history', authenticateToken, (req, res) => {
  try {
    const db = getDb();
    const result = db.exec(`SELECT ai_results.*, pets.name as pet_name FROM ai_results LEFT JOIN pets ON ai_results.pet_id = pets.id WHERE ai_results.user_id = '${req.user.id}' ORDER BY ai_results.created_at DESC LIMIT 20`);

    if (result.length === 0) return res.json({ history: [] });

    const cols = result[0].columns;
    const history = result[0].values.map(row => {
      const item = {};
      cols.forEach((col, i) => { item[col] = row[i]; });
      item.result = JSON.parse(item.result);
      return item;
    });

    res.json({ history });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch AI history' });
  }
});

// Chat history
router.get('/chat-history', authenticateToken, (req, res) => {
  try {
    const db = getDb();
    const result = db.exec(`SELECT id, sender, text FROM chat_history WHERE user_id = '${req.user.id}' ORDER BY created_at ASC`);
    if (result.length === 0) return res.json([]);
    
    const cols = result[0].columns;
    const history = result[0].values.map(row => {
      const item = {};
      cols.forEach((col, i) => { item[col] = row[i]; });
      return item;
    });
    res.json(history);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch chat history' });
  }
});

// Send chat message
router.post('/chat', authenticateToken, async (req, res) => {
  try {
    const { text } = req.body;
    const db = getDb();
    
    // Save user message
    const userMsgId = uuidv4();
    db.run(`INSERT INTO chat_history (id, user_id, sender, text) VALUES (?, ?, 'user', ?)`, [userMsgId, req.user.id, text]);
    
    // Generate simulated AI response
    let botReply = "I'm your AI assistant. I can help with general pet care questions. Could you provide more details?";
    const ltext = text.toLowerCase();
    
    if (ltext.includes('food') || ltext.includes('eat') || ltext.includes('diet')) {
      botReply = "For diet concerns, ensure you're feeding high-quality, age-appropriate food. Dogs and cats have different nutritional needs. Always consult your vet before making major dietary changes.";
    } else if (ltext.includes('sick') || ltext.includes('vomit') || ltext.includes('diarrhea') || ltext.includes('fever')) {
      botReply = "If your pet is showing signs of illness like vomiting, diarrhea, or lethargy, please contact your veterinarian immediately. It's better to be safe!";
    } else if (ltext.includes('train') || ltext.includes('bark') || ltext.includes('bite') || ltext.includes('behavior')) {
      botReply = "Behavioral issues can often be addressed with positive reinforcement training. Check out our 'Training Videos' section for step-by-step guides on common behavioral corrections.";
    } else if (ltext.includes('hi') || ltext.includes('hello') || ltext.includes('hey')) {
      botReply = "Hello there! How can I help you and your furry friend today?";
    }
    
    // Save bot message
    const botMsgId = uuidv4();
    db.run(`INSERT INTO chat_history (id, user_id, sender, text) VALUES (?, ?, 'bot', ?)`, [botMsgId, req.user.id, botReply]);
    saveDatabase();
    
    res.json({ id: botMsgId, text: botReply, sender: 'bot' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to send message' });
  }
});

export default router;
