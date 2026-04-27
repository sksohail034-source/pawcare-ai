import express from 'express';
import cors from 'cors';
import { existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { initDatabase } from './database.js';
import authRoutes from './routes/auth.js';
import petRoutes from './routes/pets.js';
import aiRoutes from './routes/ai.js';
import vaccinationRoutes from './routes/vaccinations.js';
import subscriptionRoutes from './routes/subscriptions.js';
import donationRoutes from './routes/donations.js';
import productRoutes from './routes/products.js';
import adsRoutes from './routes/ads.js';
import exerciseRoutes from './routes/exercise.js';
import adminRoutes from './routes/admin.js';
import notificationRoutes from './routes/notifications.js';
import routineRoutes from './routes/routines.js';
import pushRoutes from './routes/push.js';
import cron from 'node-cron';
import webpush from 'web-push';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;

// Web Push Setup
const VAPID_PUBLIC_KEY = 'BNnynhB1r6Wfn8WSBy1z8CFIxPRJanICT4AEVmKsXxNBpeO3tsaw1ILjjoChaVbGyUWgeXz_cO5NeXX2k52hzT8';
const VAPID_PRIVATE_KEY = 'Zk2wrmBAVMoShdSUYhH5L3DhuBlOp4U4rDfsfTaT8aM';

webpush.setVapidDetails(
  'mailto:support@pawcare.ai',
  VAPID_PUBLIC_KEY,
  VAPID_PRIVATE_KEY
);

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Uploads directory
const uploadsDir = join(__dirname, '..', 'uploads');
if (!existsSync(uploadsDir)) mkdirSync(uploadsDir, { recursive: true });
app.use('/uploads', express.static(uploadsDir));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/pets', petRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/vaccinations', vaccinationRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/products', productRoutes);
app.use('/api/ads', adsRoutes);
app.use('/api/exercise', exerciseRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/routines', routineRoutes);
app.use('/api/push', pushRoutes);

// Health check with debug info
app.get('/api/health', (req, res) => {
  const now = new Date();
  const istTime = new Date(now.getTime() + (5.5 * 60 * 60 * 1000));
  const timeStr = `${String(istTime.getUTCHours()).padStart(2, '0')}:${String(istTime.getUTCMinutes()).padStart(2, '0')}`;
  
  let subCount = 0;
  try {
    const db = (import('./database.js')).getDb();
    const result = db.exec('SELECT COUNT(*) FROM push_subscriptions');
    if (result.length > 0) subCount = result[0].values[0][0];
  } catch (e) {}

  res.json({ 
    status: 'ok', 
    server_utc: now.toISOString(),
    calculated_ist: timeStr,
    active_subscriptions: subCount
  });
});

// Serve frontend in production
const distPath = join(__dirname, '..', 'dist');
if (existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('{*path}', (req, res) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(join(distPath, 'index.html'));
    }
  });
}

// Start server
async function start() {
  await initDatabase();
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`\n🐾 PawCare AI Server running at http://localhost:${PORT}`);
    console.log(`   API docs: http://localhost:${PORT}/api/health\n`);
  });

  // Background Cron Job for Routines (Set to Asia/Kolkata to match user's local time)
  cron.schedule('* * * * *', async () => {
    try {
      const db = (await import('./database.js')).getDb();
      
      // Reliable IST time calculation
      const now = new Date();
      const istTime = new Date(now.getTime() + (5.5 * 60 * 60 * 1000));
      const hours = String(istTime.getUTCHours()).padStart(2, '0');
      const minutes = String(istTime.getUTCMinutes()).padStart(2, '0');
      const timeStr = `${hours}:${minutes}`;
      
      console.log(`[Cron] Checking routines for time: ${timeStr} (Server UTC: ${now.toUTCString()})`);

      const result = db.exec(`
        SELECT * FROM routines 
        WHERE enabled = 1 AND time = '${timeStr}'
      `);

      if (result.length > 0 && result[0].values.length > 0) {
        const rows = result[0].values;
        const cols = result[0].columns;
        
        for (const row of rows) {
          const r = {};
          cols.forEach((col, i) => { r[col] = row[i]; });
          
          // 1. Create In-App Notification
          const notifId = uuidv4();
          db.run(`INSERT INTO notifications (id, user_id, title, message) VALUES (?, ?, ?, ?)`,
            [notifId, r.user_id, `⏰ Routine: ${r.title}`, `🐾 It's time for ${r.title}!`]);
          
          // 2. Send Push Notification
          const subResult = db.exec(`SELECT subscription FROM push_subscriptions WHERE user_id = '${r.user_id}'`);
          if (subResult.length > 0) {
              subResult[0].values.forEach(subRow => {
                const subscription = JSON.parse(subRow[0]);
                webpush.sendNotification(subscription, JSON.stringify({
                  title: `🐾 PawCare: ${r.title}`,
                  body: `It's time for ${r.title}!`,
                  icon: '/pwa-192x192.png',
                  badge: '/favicon.svg',
                  data: { url: '/routine' },
                  vibrate: [500, 110, 500, 110, 450, 110, 200, 110, 170, 40, 450, 110, 200, 110, 170, 40, 500],
                  requireInteraction: true,
                  tag: 'pawcare-alarm',
                  urgency: 'high'
                })).catch(err => console.error('Push error:', err));
              });
          }
        }
        (await import('./database.js')).saveDatabase();
      }
    } catch (err) {
      console.error('Cron error:', err);
    }
  });
}

start().catch(console.error);
