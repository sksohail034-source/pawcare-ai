import initSqlJs from 'sql.js';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DB_PATH = join(__dirname, '..', 'data', 'pawcare.db');

let db = null;

export async function initDatabase() {
  const SQL = await initSqlJs();
  const dataDir = dirname(DB_PATH);
  if (!existsSync(dataDir)) mkdirSync(dataDir, { recursive: true });

  if (existsSync(DB_PATH)) {
    const buffer = readFileSync(DB_PATH);
    db = new SQL.Database(buffer);
  } else {
    db = new SQL.Database();
  }

  db.run(`CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT DEFAULT '',
    password TEXT NOT NULL,
    avatar TEXT DEFAULT '',
    subscription TEXT DEFAULT 'free_trial',
    scans_used INTEGER DEFAULT 0,
    trial_ends_at TEXT,
    created_at TEXT DEFAULT (datetime('now'))
  )`);

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
    pet_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    type TEXT NOT NULL,
    input_image TEXT DEFAULT '',
    result TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (pet_id) REFERENCES pets(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS health_records (
    id TEXT PRIMARY KEY,
    pet_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT DEFAULT '',
    date TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (pet_id) REFERENCES pets(id)
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

  db.run(`CREATE TABLE IF NOT EXISTS routines (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    pet_id TEXT NOT NULL,
    title TEXT NOT NULL,
    type TEXT NOT NULL, -- morning, afternoon, evening, weekly
    time TEXT NOT NULL, -- HH:MM format
    enabled INTEGER DEFAULT 1,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (pet_id) REFERENCES pets(id)
  )`);

  db.run(`INSERT OR IGNORE INTO users (id, name, email, phone, password, subscription, scans_used, trial_ends_at) 
          VALUES ('test-user-id', 'Test User', 'test@gmail.com', '', '$2b$10$wwHNKYQ3ZYb4ygA4OvPSeOD0YfQjgZh6mJrNTIfFm/7jeqs1Ig1ym', 'premium', 0, '2099-12-31T00:00:00.000Z')`);

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
