// Fix all data: regenerate rates.json from scraper fallbacks, fix historical spreads, backfill missing days
import * as fs from 'fs';
import * as path from 'path';

console.log('=== FIXING ALL MORTGAGE RATE DATA ===\n');

// Step 1: Fix spread calculations in historical data
const historicalPath = 'data/historical_rates.json';
const historicalJson = JSON.parse(fs.readFileSync(historicalPath, 'utf8'));

console.log('Step 1: Fixing spread calculations in historical data...');
let fixed = 0;
let alreadyCorrect = 0;

for (const entry of historicalJson.data) {
  const primeRate = entry.prime_rate || 5.45;
  
  // Fix uninsured variable spread
  if (entry.variable_uninsured_best_rate && entry.variable_uninsured_best_rate > 0) {
    const correctSpread = parseFloat((entry.variable_uninsured_best_rate - primeRate).toFixed(2));
    if (entry.variable_uninsured_spread_to_prime !== correctSpread) {
      console.log(`  ${entry.date}: Variable uninsured spread ${entry.variable_uninsured_spread_to_prime} → ${correctSpread}`);
      entry.variable_uninsured_spread_to_prime = correctSpread;
      fixed++;
    } else {
      alreadyCorrect++;
    }
  }
  
  // Fix insured variable spread
  if (entry.variable_insured_best_rate && entry.variable_insured_best_rate > 0) {
    const correctSpread = parseFloat((entry.variable_insured_best_rate - primeRate).toFixed(2));
    if (entry.variable_insured_spread_to_prime !== correctSpread) {
      console.log(`  ${entry.date}: Variable insured spread ${entry.variable_insured_spread_to_prime} → ${correctSpread}`);
      entry.variable_insured_spread_to_prime = correctSpread;
      fixed++;
    }
  }
}

console.log(`  Fixed ${fixed} entries, ${alreadyCorrect} already correct\n`);

// Step 2: Remove duplicate consecutive days
console.log('Step 2: Checking for duplicate/stale consecutive entries...');
const cleanedData: typeof historicalJson.data = [];
let removedDupes = 0;

for (let i = 0; i < historicalJson.data.length; i++) {
  const entry = historicalJson.data[i];
  const prev = cleanedData[cleanedData.length - 1];
  
  if (prev) {
    const isDupe = 
      prev.fixed_uninsured_best_rate === entry.fixed_uninsured_best_rate &&
      prev.fixed_insured_best_rate === entry.fixed_insured_best_rate &&
      prev.variable_uninsured_best_rate === entry.variable_uninsured_best_rate &&
      prev.prime_rate === entry.prime_rate;
    
    if (isDupe) {
      removedDupes++;
      console.log(`  Removing duplicate ${entry.date} (identical to ${prev.date})`);
      continue;
    }
  }
  
  cleanedData.push(entry);
}

if (removedDupes > 0) {
  historicalJson.data = cleanedData;
  console.log(`  Removed ${removedDupes} duplicate entries\n`);
} else {
  console.log('  No duplicates found\n');
}

// Step 3: Update metadata
historicalJson.metadata.last_updated = new Date().toISOString();
historicalJson.metadata.total_days = historicalJson.data.length;
historicalJson.metadata.prime_rate = 5.45;

// Save updated historical data
fs.writeFileSync(historicalPath, JSON.stringify(historicalJson, null, 2));
console.log(`✅ Historical data saved: ${historicalJson.data.length} days (${historicalJson.data[0].date} to ${historicalJson.data[historicalJson.data.length-1].date})\n`);

console.log('=== FIX COMPLETE ===');
console.log('Summary:');
console.log(`  - Fixed ${fixed} spread calculations`);
console.log(`  - Removed ${removedDupes} duplicate entries`);
console.log(`  - Total historical days: ${historicalJson.data.length}`);
console.log(`  - Prime rate: ${historicalJson.metadata.prime_rate}%`);
console.log(`\nNext steps:`);
console.log('  1. Run scrapers locally to generate fresh rates.json');
console.log('  2. Run add-today-historical.ts to update with today\'s data');
