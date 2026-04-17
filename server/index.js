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
import routineRoutes from './routes/routines.js';

dotenv.config();

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;

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
app.use('/api/routines', routineRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', version: '1.0.0', name: 'PawCare AI API' });
});

// Serve frontend in production
const distPath = join(__dirname, '..', 'dist');
if (existsSync(distPath)) {
  app.use(express.static(distPath));
  // SPA catch-all: send index.html for any non-API route
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
}

start().catch(console.error);
