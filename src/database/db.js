const path=require('path');
const fs=require('fs');
const Database=require('better-sqlite3');
const env=require('../config/env');
const dataDir=path.join(__dirname,'../../data'); fs.mkdirSync(dataDir,{recursive:true});
const db=new Database(path.join(dataDir,'maline-v4.sqlite'));
db.pragma('journal_mode = WAL'); db.pragma('foreign_keys = ON');
db.exec(`
CREATE TABLE IF NOT EXISTS groups(
 chat_id TEXT PRIMARY KEY,title TEXT,translation_enabled INTEGER DEFAULT 1,
 primary_language TEXT DEFAULT 'en',secondary_language TEXT DEFAULT 'zh',
 other_language_mode TEXT DEFAULT 'primary',welcome_enabled INTEGER DEFAULT 1,
 welcome_message TEXT,staff_group_id TEXT,created_at TEXT DEFAULT CURRENT_TIMESTAMP,
 updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS rooms(
 id INTEGER PRIMARY KEY AUTOINCREMENT,title TEXT NOT NULL,unit_number TEXT DEFAULT '',
 bedrooms INTEGER DEFAULT 0,bathrooms INTEGER DEFAULT 0,size_sqm REAL DEFAULT 0,
 floor TEXT DEFAULT '',monthly_price REAL DEFAULT 0,currency TEXT DEFAULT 'USD',
 available INTEGER DEFAULT 1,featured INTEGER DEFAULT 0,description TEXT DEFAULT '',
 photos_json TEXT DEFAULT '[]',videos_json TEXT DEFAULT '[]',facilities_json TEXT DEFAULT '[]',
 included_json TEXT DEFAULT '[]',excluded_json TEXT DEFAULT '[]',nearby_json TEXT DEFAULT '[]',
 created_at TEXT DEFAULT CURRENT_TIMESTAMP,updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS enquiries(
 id INTEGER PRIMARY KEY AUTOINCREMENT,reference TEXT UNIQUE,telegram_user_id TEXT,
 telegram_username TEXT,customer_name TEXT,phone TEXT,email TEXT,subject TEXT,message TEXT,
 room_id INTEGER,preferred_date TEXT,status TEXT DEFAULT 'new',assigned_to TEXT,
 created_at TEXT DEFAULT CURRENT_TIMESTAMP,updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
 FOREIGN KEY(room_id) REFERENCES rooms(id) ON DELETE SET NULL
);
CREATE TABLE IF NOT EXISTS bookings(
 id INTEGER PRIMARY KEY AUTOINCREMENT,reference TEXT UNIQUE,telegram_user_id TEXT,
 customer_name TEXT,phone TEXT,email TEXT,room_id INTEGER,move_in_date TEXT,
 special_request TEXT,status TEXT DEFAULT 'pending',created_at TEXT DEFAULT CURRENT_TIMESTAMP,
 updated_at TEXT DEFAULT CURRENT_TIMESTAMP,FOREIGN KEY(room_id) REFERENCES rooms(id) ON DELETE SET NULL
);
CREATE TABLE IF NOT EXISTS favorites(
 id INTEGER PRIMARY KEY AUTOINCREMENT,user_key TEXT NOT NULL,room_id INTEGER NOT NULL,
 created_at TEXT DEFAULT CURRENT_TIMESTAMP,UNIQUE(user_key,room_id),
 FOREIGN KEY(room_id) REFERENCES rooms(id) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS translation_logs(
 id INTEGER PRIMARY KEY AUTOINCREMENT,chat_id TEXT,source_language TEXT,target_language TEXT,
 created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS audit_logs(
 id INTEGER PRIMARY KEY AUTOINCREMENT,actor TEXT,action TEXT,details TEXT,
 created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS app_settings(key TEXT PRIMARY KEY,value TEXT);
`);
function ensureColumn(table,column,definition){
 const cols=db.prepare(`PRAGMA table_info(${table})`).all().map(x=>x.name);
 if(!cols.includes(column)) db.exec(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition}`);
}
for(const [c,d] of [['unit_number',"TEXT DEFAULT ''"],['videos_json',"TEXT DEFAULT '[]'"],['nearby_json',"TEXT DEFAULT '[]'"]]) ensureColumn('rooms',c,d);
for(const [c,d] of [['email',"TEXT DEFAULT ''"],['updated_at','TEXT']]) ensureColumn('enquiries',c,d);
const roomCount=db.prepare('SELECT COUNT(*) count FROM rooms').get().count;
if(!roomCount){
 const add=db.prepare(`INSERT INTO rooms(title,unit_number,bedrooms,bathrooms,size_sqm,floor,monthly_price,currency,available,featured,description,facilities_json,included_json,excluded_json,nearby_json) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`);
 add.run('Studio Apartment','',0,1,50,'Available floors',1200,'USD',1,1,'Modern serviced studio apartment. Add your photos later.',JSON.stringify(['Wi-Fi','Fully equipped kitchen','Washing machine','Safe deposit box']),JSON.stringify(['Management fee','Water supply','Gym and pool access','Cleaning and linen change twice weekly']),JSON.stringify(['Electricity $0.25/kWh','Telephone IDD']),JSON.stringify(['Embassies','Restaurants','Supermarkets']));
 add.run('2 Bedroom Apartment','',2,2,150,'3rd Floor',2500,'USD',1,1,'Spacious two-bedroom serviced apartment. Add your photos later.',JSON.stringify(['Bathtub','Wi-Fi','Kitchen','Washing machine','Parking']),JSON.stringify(['Management fee','Water supply','Gym, pool, steam and sauna','Cleaning and linen change twice weekly']),JSON.stringify(['Electricity $0.25/kWh','Telephone IDD','Rooftop sky bar']),JSON.stringify(['BKK1','Aeon Mall','International schools']));
}
db.prepare(`INSERT INTO app_settings(key,value) VALUES('staff_group_id',?) ON CONFLICT(key) DO NOTHING`).run(env.defaultStaffGroupId);
module.exports=db;
