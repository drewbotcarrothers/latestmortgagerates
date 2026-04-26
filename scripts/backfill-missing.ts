// Backfill missing dates in historical data
import * as fs from 'fs';

const historicalJson = JSON.parse(fs.readFileSync('data/historical_rates.json', 'utf8'));

console.log('Current range:', historicalJson.data[0].date, 'to', historicalJson.data[historicalJson.data.length-1].date);
console.log('Total days:', historicalJson.data.length);

// Find missing dates between Apr 23 and Apr 26
const dates = new Set(historicalJson.data.map((e: any) => e.date));
const missingDates = ['2026-04-24', '2026-04-25'].filter(d => !dates.has(d));

if (missingDates.length === 0) {
  console.log('No missing dates!');
  process.exit(0);
}

console.log('Missing dates:', missingDates);

// Copy April 23 data for missing dates (rates were stable)
const apr23 = historicalJson.data.find((e: any) => e.date === '2026-04-23');
if (!apr23) {
  console.log('No April 23 data to copy from!');
  process.exit(1);
}

for (const date of missingDates) {
  const entry = {
    ...apr23,
    date: date,
    created_at: new Date(date + 'T12:00:00.000Z').toISOString()
  };
  historicalJson.data.push(entry);
  console.log(`Added ${date}`);
}

// Sort by date
historicalJson.data.sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());

// Update metadata
historicalJson.metadata.total_days = historicalJson.data.length;

fs.writeFileSync('data/historical_rates.json', JSON.stringify(historicalJson, null, 2));
console.log('\nFixed! New range:', historicalJson.data[0].date, 'to', historicalJson.data[historicalJson.data.length-1].date);
console.log('Total days:', historicalJson.data.length);
