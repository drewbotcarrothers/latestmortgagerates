import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';

let db: any = null;

export async function getDb() {
  if (!db) {
    db = await open({
      filename: path.join(process.cwd(), 'data', 'subscribers.db'),
      driver: sqlite3.Database,
    });
    
    // Create subscribers table if not exists
    await db.exec(`
      CREATE TABLE IF NOT EXISTS subscribers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        frequency TEXT NOT NULL CHECK(frequency IN ('daily', 'weekly', 'monthly')),
        subscribed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        last_sent_at DATETIME,
        is_active BOOLEAN DEFAULT 1,
        unsubscribe_token TEXT UNIQUE
      );
    `);
  }
  return db;
}

export async function addSubscriber(email: string, frequency: string) {
  const db = await getDb();
  const unsubscribeToken = crypto.randomUUID();
  
  try {
    await db.run(
      `INSERT INTO subscribers (email, frequency, unsubscribe_token) VALUES (?, ?, ?)`,
      [email.toLowerCase().trim(), frequency, unsubscribeToken]
    );
    return { success: true, unsubscribeToken };
  } catch (error: any) {
    if (error.message?.includes('UNIQUE constraint failed')) {
      // Update existing subscriber's frequency
      await db.run(
        `UPDATE subscribers SET frequency = ?, is_active = 1 WHERE email = ?`,
        [frequency, email.toLowerCase().trim()]
      );
      const existing = await db.get(
        `SELECT unsubscribe_token FROM subscribers WHERE email = ?`,
        [email.toLowerCase().trim()]
      );
      return { success: true, unsubscribeToken: existing.unsubscribe_token, updated: true };
    }
    throw error;
  }
}

export async function unsubscribeUser(token: string) {
  const db = await getDb();
  await db.run(
    `UPDATE subscribers SET is_active = 0 WHERE unsubscribe_token = ?`,
    [token]
  );
  return { success: true };
}

export async function getSubscribersForFrequency(frequency: string) {
  const db = await getDb();
  return db.all(
    `SELECT email, unsubscribe_token FROM subscribers 
     WHERE frequency = ? AND is_active = 1`,
    [frequency]
  );
}

export async function getAllActiveSubscribers() {
  const db = await getDb();
  return db.all(
    `SELECT email, frequency, unsubscribe_token FROM subscribers WHERE is_active = 1 ORDER BY subscribed_at DESC`
  );
}

export async function updateLastSent(email: string) {
  const db = await getDb();
  await db.run(
    `UPDATE subscribers SET last_sent_at = CURRENT_TIMESTAMP WHERE email = ?`,
    [email.toLowerCase().trim()]
  );
}
