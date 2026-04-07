// Remove placeholder April entries - keep only real data through March 31, 2026
import * as fs from 'fs';

const historicalJson = JSON.parse(fs.readFileSync('data/historical_rates.json', 'utf8'));

console.log('Before fix:');
console.log(`  Total days: ${historicalJson.data.length}`);
console.log(`  Date range: ${historicalJson.data[0].date} to ${historicalJson.data[historicalJson.data.length - 1].date}`);

// Filter out April 2026 entries (placeholder data)
const realData = historicalJson.data.filter((entry: any) => {
  const entryDate = new Date(entry.date);
  return entryDate < new Date('2026-04-01');
});

console.log('\nAfter fix:');
console.log(`  Total days: ${realData.length}`);
console.log(`  Date range: ${realData[0].date} to ${realData[realData.length - 1].date}`);
console.log(`  Removed: ${historicalJson.data.length - realData.length} placeholder entries`);

// Update the file
historicalJson.data = realData;
historicalJson.metadata.total_days = realData.length;
historicalJson.metadata.last_updated = new Date().toISOString();

fs.writeFileSync('data/historical_rates.json', JSON.stringify(historicalJson, null, 2));

console.log('\n✅ Historical data fixed to only include real scraped data');
console.log('Note: April 1-6, 2026 entries were placeholders and have been removed.');
