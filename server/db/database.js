const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const DB_PATH = path.join(__dirname, 'crm.db');
const db = new Database(DB_PATH);

db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// Initialize schema and seed data if tables don't exist
const tableExists = db.prepare(
  "SELECT name FROM sqlite_master WHERE type='table' AND name='clients'"
).get();

if (!tableExists) {
  const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
  db.exec(schema);

  const seed = fs.readFileSync(path.join(__dirname, 'seed.sql'), 'utf8');
  db.exec(seed);

  console.log('Database initialized with schema and seed data.');
}

module.exports = db;
