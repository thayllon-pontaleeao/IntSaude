import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('intsaude.db');

export function setupDatabase() {
  db.execSync(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'paciente',
      created_at TEXT DEFAULT (datetime('now'))
    );
  `);
}

export function createUser(name: string, email: string, password: string, role: string = 'paciente') {
  const existing = db.getFirstSync('SELECT * FROM users WHERE email = ?', [email]);
  if (existing) throw new Error('Este e-mail já está cadastrado.');
  db.runSync(
    'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
    [name, email, password, role]
  );
}

export function findUserByEmail(email: string): any {
  return db.getFirstSync('SELECT * FROM users WHERE email = ?', [email]);
}