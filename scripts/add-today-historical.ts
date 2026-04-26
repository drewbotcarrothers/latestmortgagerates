// Add today's rate snapshot to historical_rates.json without overwriting existing data
import * as fs from 'fs';

// Load current rates
const ratesData = JSON.parse(fs.readFileSync('data/rates.json', 'utf8'));
const historicalJson = JSON.parse(fs.readFileSync('data/historical_rates.json', 'utf8'));

// Fix any incorrect spread calculations in existing data first
fixSpreadCalculations(historicalJson);

// Calculate metrics from current rates
function calculateMetrics(rates: any[]) {
  // Fixed uninsured 5-year
  const fixedUninsured = rates
    .filter((r: any) => r.rate_type === 'fixed' && r.term_months === 60 && r.mortgage_type === 'uninsured')
    .sort((a: any, b: any) => a.rate - b.rate);
  
  // Fixed insured 5-year
  const fixedInsured = rates
    .filter((r: any) => r.rate_type === 'fixed' && r.term_months === 60 && r.mortgage_type === 'insured')
    .sort((a: any, b: any) => a.rate - b.rate);
  
  // Variable uninsured 5-year
  const variableUninsured = rates
    .filter((r: any) => r.rate_type === 'variable' && r.term_months === 60 && r.mortgage_type === 'uninsured')
    .sort((a: any, b: any) => a.rate - b.rate);
  
  // Variable insured 5-year
  const variableInsured = rates
    .filter((r: any) => r.rate_type === 'variable' && r.term_months === 60 && r.mortgage_type === 'insured')
    .sort((a: any, b: any) => a.rate - b.rate);
  
  const avg = (arr: any[], prop: string) => {
    if (arr.length === 0) return 0;
    return arr.reduce((sum: number, item: any) => sum + item[prop], 0) / arr.length;
  };
  
  // Prime rate (as of April 2026: 5.45%)
  const primeRate = 5.45;
  
  // Get unique lenders
  const uniqueLenders = [...new Set(rates.map((r: any) => r.lender_slug))];
  
  return {
    fixed_uninsured_best_rate: fixedUninsured[0]?.rate || 0,
    fixed_uninsured_best_lender: fixedUninsured[0]?.lender_name || 'Unknown',
    fixed_uninsured_avg_rate: parseFloat(avg(fixedUninsured, 'rate').toFixed(2)),
    
    fixed_insured_best_rate: fixedInsured[0]?.rate || 0,
    fixed_insured_best_lender: fixedInsured[0]?.lender_name || 'Unknown',
    fixed_insured_avg_rate: parseFloat(avg(fixedInsured, 'rate').toFixed(2)),
    
    variable_uninsured_best_rate: variableUninsured[0]?.rate || 0,
    variable_uninsured_best_lender: variableUninsured[0]?.lender_name || 'Unknown',
    variable_uninsured_avg_rate: parseFloat(avg(variableUninsured, 'rate').toFixed(2)),
    variable_uninsured_spread_to_prime: variableUninsured[0]?.rate ? 
      parseFloat((variableUninsured[0].rate - primeRate).toFixed(2)) : 0,
    
    variable_insured_best_rate: variableInsured[0]?.rate || 0,
    variable_insured_best_lender: variableInsured[0]?.lender_name || 'Unknown',
    variable_insured_avg_rate: parseFloat(avg(variableInsured, 'rate').toFixed(2)),
    variable_insured_spread_to_prime: variableInsured[0]?.rate ? 
      parseFloat((variableInsured[0].rate - primeRate).toFixed(2)) : 0,
    
    prime_rate: primeRate,
    lender_count: uniqueLenders.length,
    total_rates: rates.length
  };
}

// Function to fix spread calculations in existing historical data
function fixSpreadCalculations(historicalJson: any) {
  console.log('Fixing spread calculations...');
  let fixed = 0;
  
  for (const entry of historicalJson.data) {
    const primeRate = entry.prime_rate || 5.45;
    
    // Fix uninsured variable spread
    if (entry.variable_uninsured_best_rate && entry.variable_uninsured_best_rate > 0) {
      const correctSpread = parseFloat((entry.variable_uninsured_best_rate - primeRate).toFixed(2));
      if (entry.variable_uninsured_spread_to_prime !== correctSpread) {
        entry.variable_uninsured_spread_to_prime = correctSpread;
        fixed++;
      }
    }
    
    // Fix insured variable spread
    if (entry.variable_insured_best_rate && entry.variable_insured_best_rate > 0) {
      const correctSpread = parseFloat((entry.variable_insured_best_rate - primeRate).toFixed(2));
      if (entry.variable_insured_spread_to_prime !== correctSpread) {
        entry.variable_insured_spread_to_prime = correctSpread;
        fixed++;
      }
    }
  }
  
  console.log(`Fixed ${fixed} spread calculations`);
  return historicalJson;
}

// Calculate today's metrics
const currentMetrics = calculateMetrics(ratesData);

// Get today's date
const today = new Date().toISOString().split('T')[0];

// Check if today already exists in historical data
const existingIndex = historicalJson.data.findIndex((entry: any) => entry.date === today);

const newEntry = {
  date: today,
  ...currentMetrics,
  created_at: new Date().toISOString()
};

if (existingIndex >= 0) {
  // Update existing entry
  console.log(`Updating existing entry for ${today}`);
  historicalJson.data[existingIndex] = newEntry;
} else {
  // Add new entry
  console.log(`Adding new entry for ${today}`);
  historicalJson.data.push(newEntry);
}

// Sort by date to maintain order
historicalJson.data.sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());

// Update metadata
historicalJson.metadata.last_updated = new Date().toISOString();
historicalJson.metadata.total_days = historicalJson.data.length;

// Save updated file
fs.writeFileSync('data/historical_rates.json', JSON.stringify(historicalJson, null, 2));

console.log(`✅ Historical data updated:`);
console.log(`   Total days: ${historicalJson.data.length}`);
console.log(`   Date range: ${historicalJson.data[0].date} to ${historicalJson.data[historicalJson.data.length-1].date}`);
console.log(`   Today's best fixed uninsured: ${currentMetrics.fixed_uninsured_best_rate}% (${currentMetrics.fixed_uninsured_best_lender})`);
console.log(`   Today's best variable uninsured: ${currentMetrics.variable_uninsured_best_rate}% (${currentMetrics.variable_uninsured_best_lender})`);
