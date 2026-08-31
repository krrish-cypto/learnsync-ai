import Database from 'better-sqlite3';
import path from 'path';

// Connect to the SQLite database
const dbPath = path.resolve(process.cwd(), 'database.db');
const db = new Database(dbPath);
db.pragma('journal_mode = WAL');

export default db;
