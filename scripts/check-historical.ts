// Check what real data exists in the historical database
import * as fs from 'fs';

const historicalJson = JSON.parse(fs.readFileSync('data/historical_rates.json', 'utf8'));

console.log('=== Historical Rates Data Check ===\n');
console.log(`Last updated: ${historicalJson.metadata.last_updated}`);
console.log(`Total days: ${historicalJson.metadata.total_days}`);
console.log(`Prime rate: ${historicalJson.metadata.prime_rate}%\n`);

// Show first and last entries
console.log('First entry:', historicalJson.data[0]);
console.log('\nLast 5 entries:');
const lastFive = historicalJson.data.slice(-5);
lastFive.forEach((entry: any) => {
  console.log(`  ${entry.date}: Fixed ${entry.fixed_uninsured_best_rate}% (${entry.fixed_uninsured_best_lender}), Variable ${entry.variable_uninsured_best_rate}%`);
});

// Check for duplicate rates (might indicate fake data)
console.log('\n\nChecking for repeated rates (may indicate placeholder data):');
const fixedRates = historicalJson.data.map((d: any) => d.fixed_uninsured_best_rate);
const duplicates = fixedRates.filter((item: number, index: number) => fixedRates.indexOf(item) !== index);
const uniqueDuplicates = [...new Set(duplicates)];
console.log(`Unique rate values that repeat: ${uniqueDuplicates.length > 0 ? uniqueDuplicates.join(', ') : 'None detected'}`);
