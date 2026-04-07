// Try to read actual historical data from SQLite database
import * as fs from 'fs';

const sqlite3 = require('sqlite3').verbose();

const DB_PATH = 'scraping/data/historical.db';

if (!fs.existsSync(DB_PATH)) {
  console.log('❌ SQLite database not found at:', DB_PATH);
  process.exit(1);
}

const db = new sqlite3.Database(DB_PATH, sqlite3.OPEN_READONLY, (err: any) => {
  if (err) {
    console.error('❌ Error opening database:', err.message);
    process.exit(1);
  }
  console.log('✅ Connected to SQLite database\n');
});

// Query all data
const query = `
  SELECT date, fixed_uninsured_best_rate, fixed_uninsured_best_lender,
         variable_uninsured_best_rate, variable_uninsured_best_lender,
         prime_rate, lender_count, total_rates, created_at
  FROM daily_snapshots
  ORDER BY date ASC
`;

db.all(query, [], (err: any, rows: any[]) => {
  if (err) {
    console.error('❌ Query error:', err);
    return;
  }
  
  console.log(`Found ${rows.length} entries in SQLite database\n`);
  
  if (rows.length > 0) {
    console.log('First entry:', rows[0]);
    console.log('\nLast 3 entries:');
    rows.slice(-3).forEach((row: any) => {
      console.log(`  ${row.date}: Fixed ${row.fixed_uninsured_best_rate}% (${row.fixed_uninsured_best_lender})`);
    });
    
    // Check if there's April data
    const aprilData = rows.filter((r: any) => r.date.startsWith('2026-04'));
    console.log(`\n📅 April 2026 entries: ${aprilData.length}`);
    if (aprilData.length > 0) {
      console.log('Dates:', aprilData.map((r: any) => r.date).join(', '));
    }
  }
  
  db.close();
});
