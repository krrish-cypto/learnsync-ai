const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.resolve(__dirname, '../database.db');
const db = new Database(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT,
    interests TEXT,
    experience TEXT,
    goals TEXT,
    level INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS learning_paths (
    id TEXT PRIMARY KEY,
    user_id TEXT UNIQUE,
    title TEXT,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS milestones (
    id TEXT PRIMARY KEY,
    learning_path_id TEXT,
    title TEXT,
    type TEXT,
    status TEXT,
    description TEXT,
    aiNote TEXT,
    display_order INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (learning_path_id) REFERENCES learning_paths(id)
  );
`);

console.log("Database initialized at", dbPath);
