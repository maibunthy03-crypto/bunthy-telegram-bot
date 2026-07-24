const path = require('path');
const Database = require('better-sqlite3');

const db = new Database(path.join(__dirname, '../../data/maline-v4.sqlite'));
db.pragma('journal_mode = WAL');

db.exec(`
CREATE TABLE IF NOT EXISTS groups (
  chat_id TEXT PRIMARY KEY,
  title TEXT,
  translation_enabled INTEGER DEFAULT 1,
  primary_language TEXT DEFAULT 'en',
  secondary_language TEXT DEFAULT 'zh',
  other_language_mode TEXT DEFAULT 'primary',
  welcome_enabled INTEGER DEFAULT 1,
  welcome_message TEXT,
  staff_group_id TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS rooms (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  bedrooms INTEGER DEFAULT 0,
  bathrooms INTEGER DEFAULT 0,
  size_sqm REAL DEFAULT 0,
  floor TEXT,
  monthly_price REAL DEFAULT 0,
  currency TEXT DEFAULT 'USD',
  available INTEGER DEFAULT 1,
  featured INTEGER DEFAULT 0,
  description TEXT DEFAULT '',
  photos_json TEXT DEFAULT '[]',
  facilities_json TEXT DEFAULT '[]',
  included_json TEXT DEFAULT '[]',
  excluded_json TEXT DEFAULT '[]',
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS enquiries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  reference TEXT UNIQUE,
  telegram_user_id TEXT,
  telegram_username TEXT,
  customer_name TEXT,
  phone TEXT,
  subject TEXT,
  message TEXT,
  room_id INTEGER,
  preferred_date TEXT,
  status TEXT DEFAULT 'new',
  assigned_to TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS translation_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  chat_id TEXT,
  source_language TEXT,
  target_language TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS app_settings (
  key TEXT PRIMARY KEY,
  value TEXT
);
`);

const roomCount = db.prepare('SELECT COUNT(*) AS count FROM rooms').get().count;
if (!roomCount) {
  const insert = db.prepare(`INSERT INTO rooms
    (title, bedrooms, bathrooms, size_sqm, floor, monthly_price, available, featured, description, facilities_json, included_json, excluded_json)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
  insert.run('Studio Apartment', 0, 1, 50, 'Available floors', 1200, 1, 1, 'Modern serviced studio. Add photos later.', JSON.stringify(['Wi-Fi','Kitchen','Washing machine','Safe box']), JSON.stringify(['Management fee','Water supply','Gym and pool access','Housekeeping twice weekly']), JSON.stringify(['Electricity $0.25/kWh','Telephone IDD']));
  insert.run('2 Bedroom Apartment', 2, 2, 150, '3rd Floor', 2500, 1, 1, 'Spacious two-bedroom apartment. Add photos later.', JSON.stringify(['Bathtub','Kitchen','Washing machine','Parking','Wi-Fi']), JSON.stringify(['Management fee','Water supply','Gym, pool, steam and sauna','Housekeeping twice weekly']), JSON.stringify(['Electricity $0.25/kWh','Telephone IDD','Rooftop sky bar']));
}

module.exports = db;
