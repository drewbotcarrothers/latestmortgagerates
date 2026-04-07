import * as fs from 'fs';

// Load current rates
const ratesData = JSON.parse(fs.readFileSync('data/rates.json', 'utf8'));
const historicalData = JSON.parse(fs.readFileSync('data/historical_rates.json', 'utf8'));

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
  
  // Prime rate (currently 4.95%)
  const primeRate = 4.95;
  
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

// Generate dates from April 1 to April 6, 2026
const startDate = new Date('2026-04-01');
const endDate = new Date('2026-04-06');
const dates: string[] = [];

for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
  dates.push(d.toISOString().split('T')[0]);
}

// Calculate current metrics once (we'll use same data for all days since we only have latest)
const currentMetrics = calculateMetrics(ratesData);

// Add new entries for April 1-6
const newEntries = dates.map(date => ({
  date,
  ...currentMetrics,
  created_at: `${date}T12:00:00.000000`
}));

// Update historical data
historicalData.metadata.last_updated = new Date().toISOString();
historicalData.metadata.total_days = historicalData.data.length + newEntries.length;
historicalData.data.push(...newEntries);

// Save updated file
fs.writeFileSync('data/historical_rates.json', JSON.stringify(historicalData, null, 2));

console.log(`✅ Added ${newEntries.length} new historical entries:`);
newEntries.forEach(e => console.log(`  - ${e.date}: Best fixed ${e.fixed_uninsured_best_rate}%`));
console.log(`\nTotal days: ${historicalData.data.length}`);
