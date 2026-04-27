import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getDb, saveDatabase } from '../database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

// AI Grooming / Styling suggestions
const groomingStyles = {
  dog: [
    { name: 'Royal Poodle Cut', description: 'Elegant trim with pompoms', confidence: 0.95, tags: ['elegant', 'classic'] },
    { name: 'Teddy Bear Trim', description: 'Soft rounded look', confidence: 0.92, tags: ['cute', 'popular'] },
  ],
  cat: [
    { name: 'Lion Cut', description: 'Majestic mane ruff', confidence: 0.93, tags: ['dramatic', 'cool'] },
    { name: 'Sleek Panther', description: 'Smooth body trim', confidence: 0.89, tags: ['sleek', 'modern'] },
  ],
  bird: [
    { name: 'Feather Shine', description: 'Conditioning routine', confidence: 0.90, tags: ['health', 'shine'] },
  ],
  rabbit: [
    { name: 'Angora Fluff', description: 'Maintained fluffy silhouette', confidence: 0.91, tags: ['fluffy', 'show'] },
  ],
  hamster: [
    { name: 'Soft Brush Routine', description: 'Gentle cleaning for small coats', confidence: 0.88, tags: ['gentle', 'care'] },
  ],
  fish: [
    { name: 'Scale Brightening', description: 'Water minerals for scale health', confidence: 0.85, tags: ['water-care', 'scales'] },
  ],
  goat: [
    { name: 'Natural Coat Brush', description: 'Gentle grooming for farm health', confidence: 0.87, tags: ['farm-care', 'natural'] },
  ],
  horse: [
    { name: 'Mane Braiding', description: 'Professional show braiding', confidence: 0.94, tags: ['professional', 'show'] },
    { name: 'Show Clip', description: 'Full body competition trim', confidence: 0.92, tags: ['sporty', 'sleek'] },
  ],
  cow: [
    { name: 'Livestock Groom', description: 'Clean and brush for show health', confidence: 0.86, tags: ['farm', 'clean'] },
  ],
  other: [
    { name: 'Natural Beauty', description: 'Custom gentle routine', confidence: 0.86, tags: ['custom'] },
  ]
};

const healthTips = {
  dog: [
    { category: 'Diet', title: 'Balanced Nutrition', tip: 'High-quality protein and omega-3s.', priority: 'high' },
    { category: 'Exercise', title: 'Daily Activity', tip: '30-60 mins of active play.', priority: 'high' },
  ],
  cat: [
    { category: 'Diet', title: 'Carnivore Needs', tip: 'High-protein, meat-based diet.', priority: 'high' },
    { category: 'Hydration', title: 'Water Intake', tip: 'Use fountains to encourage drinking.', priority: 'high' },
  ],
  bird: [
    { category: 'Air Quality', title: 'Sensitive Lungs', tip: 'Avoid non-stick fumes and smoke.', priority: 'high' },
  ],
  rabbit: [
    { category: 'Diet', title: 'Hay Requirement', tip: 'Unlimited timothy hay is 80% of diet.', priority: 'high' },
  ],
  hamster: [
    { category: 'Exercise', title: 'Wheel Time', tip: 'Ensure safe, solid-surface wheels.', priority: 'high' },
  ],
  fish: [
    { category: 'Water', title: 'pH Balance', tip: 'Test water levels weekly for stability.', priority: 'high' },
  ],
  goat: [
    { category: 'Diet', title: 'Mineral Support', tip: 'Provide mineral blocks to prevent deficiencies.', priority: 'high' },
  ],
  horse: [
    { category: 'Hoof', title: 'Regular Trimming', tip: 'Clean hooves daily and trim every 6 weeks.', priority: 'high' },
  ],
  cow: [
    { category: 'Grazing', title: 'Pasture Rotation', tip: 'Ensure access to fresh, varied pasture.', priority: 'high' },
  ],
  other: [
    { category: 'General', title: 'Wellness Check', tip: 'Annual exotic vet visits are key.', priority: 'high' },
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


router.post('/analyze/:petId', authenticateToken, async (req, res) => {
  try {
    const { detectedType, image } = req.body;
    const db = getDb();
    
    // Check if pet exists
    const petResult = db.exec(`SELECT type FROM pets WHERE id = '${req.params.petId}'`);
    if (petResult.length === 0 || petResult[0].values.length === 0) {
      return res.status(404).json({ error: 'Pet not found' });
    }
    const expectedType = petResult[0].values[0][0].toLowerCase();

    // REAL GEMINI AI INTEGRATION
    if (!process.env.GEMINI_API_KEY) {
      return res.status(503).json({ error: 'AI Service currently unavailable (API Key missing).' });
    }

    if (image) {
      try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        // Using the most stable model name for Gemini 1.5 Flash
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const mimeType = image.split(";")[0].split(":")[1] || "image/jpeg";
        const base64Data = image.split(",")[1];
        
        const prompt = `STRICT SPECIES VERIFICATION:
        Subject Identification:
        1. Identify the subject of this image.
        2. Is it a ${expectedType.toUpperCase()}?
        3. If it is a HUMAN, a girl, a boy, or any person, answer: "HUMAN".
        4. If it is an animal but NOT a ${expectedType}, answer with that animal name (e.g., "CAT", "GOAT").
        5. If it is a ${expectedType}, answer: "${expectedType.toUpperCase()}".
        
        ANSWER WITH ONLY ONE WORD.`;

        const result = await model.generateContent([
          prompt,
          { inlineData: { data: base64Data, mimeType } }
        ]);
        
        const responseText = result.response.text().trim().toUpperCase();
        console.log(`Gemini Vision Verdict: [${responseText}] (Expected: ${expectedType.toUpperCase()})`);

        if (responseText === "HUMAN") {
          return res.status(400).json({ 
            error: "🛑 SECURITY ALERT: Human detected. Please upload a real pet photo.",
            code: 'MISMATCH'
          });
        }

        if (!responseText.includes(expectedType.toUpperCase())) {
          return res.status(400).json({ 
            error: `🛑 VISION MISMATCH: Identified as ${responseText}, but your profile is ${expectedType.toUpperCase()}.`,
            code: 'MISMATCH'
          });
        }
      } catch (err) {
        console.error("Gemini API Error Detail:", err);
        return res.status(503).json({ error: "AI service is currently initializing or busy. Please try again in a few moments." });
      }
    } else {
      return res.status(400).json({ error: 'Image data is required for AI analysis.' });
    }

    const limitCheck = checkScanLimit(db, req.user.id);
    if (!limitCheck.allowed) return res.status(403).json({ error: 'No scans remaining. Watch an ad to continue.' });
    
    incrementScan(db, req.user.id, limitCheck.scanCount);
    res.json({ 
      success: true, 
      message: geminiError || 'Analysis verified by Real AI Vision.' 
    });
  } catch (err) { 
    console.error('Analysis error:', err);
    res.status(500).json({ error: 'Failed to update scan count' }); 
  }
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
    let botReply = "I am the PawCare Support Bot. I can assist you with diet, training, health issues, and general care for your pets. How can I help?";
    const ltext = text.toLowerCase();
    
    if (ltext.includes('food') || ltext.includes('eat') || ltext.includes('diet')) {
      botReply = "For diet concerns, ensure you're feeding high-quality, age-appropriate food. Dogs and cats have different nutritional needs. Always consult your vet before making major dietary changes.";
    } else if (ltext.includes('sick') || ltext.includes('vomit') || ltext.includes('diarrhea') || ltext.includes('fever')) {
      botReply = "If your pet is showing signs of illness like vomiting, diarrhea, or lethargy, please contact your veterinarian immediately. It's better to be safe!";
    } else if (ltext.includes('train') || ltext.includes('bark') || ltext.includes('bite') || ltext.includes('behavior')) {
      botReply = "Behavioral issues can often be addressed with positive reinforcement training. Check out our 'Training Videos' section for step-by-step guides on common behavioral corrections.";
    } else if (ltext.includes('hi') || ltext.includes('hello') || ltext.includes('hey')) {
      botReply = "Hello there! How can I help you and your furry friend today?";
    } else if (ltext.includes('thank')) {
      botReply = "You're very welcome! If you need anything else, just ask.";
    } else if (ltext.length > 5) {
      botReply = `That's a great question about "${text.substring(0, 30)}...". While I'm still learning, I recommend checking our Care Protocols section or consulting your local vet for specific advice!`;
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
