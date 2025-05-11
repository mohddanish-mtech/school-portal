const Database = require('better-sqlite3');
const path = require('path');

// Initialize the database
const dbPath = path.resolve(__dirname, 'school-vaccination.db');
const db = new Database(dbPath);

// Create the students table if it doesn't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS students (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    class TEXT NOT NULL,
    vaccinated INTEGER DEFAULT 0, -- 0 = false, 1 = true
    vaccine TEXT
  )
`);

// Create the drives table if it doesn't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS drives (
    id TEXT PRIMARY KEY,
    vaccineName TEXT NOT NULL,
    date TEXT NOT NULL,
    dosesAvailable INTEGER NOT NULL,
    applicableClasses TEXT
  )
`);

module.exports = db;