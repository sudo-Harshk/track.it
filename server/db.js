import { createClient } from '@libsql/client';
import dotenv from 'dotenv';

dotenv.config();

export const db = createClient({
  url: process.env.TURSO_DATABASE_URL || '',
  authToken: process.env.TURSO_AUTH_TOKEN || '',
});

export async function initDB() {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS jobs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      company TEXT NOT NULL,
      role TEXT NOT NULL,
      url TEXT NOT NULL,
      date_applied TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'Applied',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);
}
