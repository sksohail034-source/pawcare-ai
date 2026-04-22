import initSqlJs from 'sql.js';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DB_PATH = join(__dirname, '..', 'data', 'pawcare.db');

let db = null;

export async function initDatabase() {
  const SQL = await initSqlJs();
  const dataDir = dirname(DB_PATH);
  if (!existsSync(dataDir)) mkdirSync(dataDir, { recursive: true });

  // Load existing database or create fresh
  if (existsSync(DB_PATH)) {
    const fileBuffer = readFileSync(DB_PATH);
    db = new SQL.Database(fileBuffer);
    console.log('Loaded existing database');
  } else {
    db = new SQL.Database();
    console.log('Created new database');
  }

  db.run(`CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    phone TEXT DEFAULT '',
    country_code TEXT DEFAULT '+1',
    avatar TEXT DEFAULT '',
    role TEXT DEFAULT 'user',
    subscription TEXT DEFAULT 'free',
    scan_count INTEGER DEFAULT 0,
    ad_bonus_scans INTEGER DEFAULT 0,
    password_reset_token TEXT,
    reset_token_expires TEXT,
    created_at TEXT DEFAULT (datetime('now'))
  )`);

  // Create default admin account
  const adminExists = db.exec(`SELECT id FROM users WHERE email = 'admin@pawcare.com'`);
  if (adminExists.length === 0 || adminExists[0].values.length === 0) {
    const adminPass = await bcrypt.hash('Admin@123', 10);
    db.run(`INSERT INTO users (id, name, email, password, role, subscription, scan_count) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      ['admin-001', 'PawCare Admin', 'admin@pawcare.com', adminPass, 'admin', 'enterprise', 0]);
    console.log('✅ Default admin account created (admin@pawcare.com / Admin@123)');
  }

  db.run(`CREATE TABLE IF NOT EXISTS pets (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    breed TEXT DEFAULT '',
    age REAL DEFAULT 0,
    weight REAL DEFAULT 0,
    photo TEXT DEFAULT '',
    notes TEXT DEFAULT '',
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS ai_results (
    id TEXT PRIMARY KEY,
    pet_id TEXT,
    user_id TEXT NOT NULL,
    type TEXT NOT NULL,
    input_image TEXT DEFAULT '',
    result TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS vaccinations (
    id TEXT PRIMARY KEY,
    pet_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    vaccine_name TEXT NOT NULL,
    date_given TEXT,
    next_due TEXT,
    status TEXT DEFAULT 'upcoming',
    notes TEXT DEFAULT '',
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (pet_id) REFERENCES pets(id)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS donations (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    amount REAL NOT NULL,
    organization TEXT NOT NULL,
    message TEXT DEFAULT '',
    status TEXT DEFAULT 'completed',
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id)
  )`);

  saveDatabase();
  console.log('Database initialized successfully');
  return db;
}

export function getDb() {
  if (!db) throw new Error('Database not initialized');
  return db;
}

export function saveDatabase() {
  if (db) {
    const data = db.export();
    const buffer = Buffer.from(data);
    writeFileSync(DB_PATH, buffer);
  }
}
