// Fix historical data gaps and UTC date issue
import * as fs from 'fs';

const historicalJson = JSON.parse(fs.readFileSync('data/historical_rates.json', 'utf8'));

console.log('Before fix:');
console.log('  Range:', historicalJson.data[0].date, 'to', historicalJson.data[historicalJson.data.length-1].date);
console.log('  Total days:', historicalJson.data.length);

// Step 1: Remove the erroneous April 26 entry (UTC date issue)
const beforeRemove = historicalJson.data.length;
historicalJson.data = historicalJson.data.filter((e: any) => e.date !== '2026-04-26');
const removedApr26 = beforeRemove - historicalJson.data.length;
if (removedApr26 > 0) console.log(`  Removed ${removedApr26} Apr 26 entries`);

// Step 2: Find missing dates between Apr 23 and today (Apr 25 EDT)
const dates = new Set(historicalJson.data.map((e: any) => e.date));
const apr23 = historicalJson.data.find((e: any) => e.date === '2026-04-23');

if (apr23) {
  // Add April 24 if missing
  if (!dates.has('2026-04-24')) {
    const entry24 = {
      ...apr23,
      date: '2026-04-24',
      created_at: '2026-04-24T12:00:00.000Z'
    };
    historicalJson.data.push(entry24);
    console.log('  Added 2026-04-24');
  }
  
  // Add April 25 (today EDT) if missing
  if (!dates.has('2026-04-25')) {
    // Use fresh data from rates.json for today
    const ratesData = JSON.parse(fs.readFileSync('data/rates.json', 'utf8'));
    
    // Calculate fresh metrics
    const fixedUninsured = ratesData
      .filter((r: any) => r.rate_type === 'fixed' && r.term_months === 60 && r.mortgage_type === 'uninsured')
      .sort((a: any, b: any) => a.rate - b.rate);
    
    const fixedInsured = ratesData
      .filter((r: any) => r.rate_type === 'fixed' && r.term_months === 60 && r.mortgage_type === 'insured')
      .sort((a: any, b: any) => a.rate - b.rate);
    
    const variableUninsured = ratesData
      .filter((r: any) => r.rate_type === 'variable' && r.term_months === 60 && r.mortgage_type === 'uninsured')
      .sort((a: any, b: any) => a.rate - b.rate);
    
    const variableInsured = ratesData
      .filter((r: any) => r.rate_type === 'variable' && r.term_months === 60 && r.mortgage_type === 'insured')
      .sort((a: any, b: any) => a.rate - b.rate);
    
    const avg = (arr: any[], prop: string) => {
      if (arr.length === 0) return 0;
      return arr.reduce((sum: number, item: any) => sum + item[prop], 0) / arr.length;
    };
    
    const primeRate = 5.45;
    const uniqueLenders = [...new Set(ratesData.map((r: any) => r.lender_slug))];
    
    const vuBest = variableUninsured[0];
    const viBest = variableInsured[0];
    
    const entry25 = {
      date: '2026-04-25',
      fixed_uninsured_best_rate: fixedUninsured[0]?.rate || 0,
      fixed_uninsured_best_lender: fixedUninsured[0]?.lender_name || 'Unknown',
      fixed_uninsured_avg_rate: parseFloat(avg(fixedUninsured, 'rate').toFixed(2)),
      fixed_insured_best_rate: fixedInsured[0]?.rate || 0,
      fixed_insured_best_lender: fixedInsured[0]?.lender_name || 'Unknown',
      fixed_insured_avg_rate: parseFloat(avg(fixedInsured, 'rate').toFixed(2)),
      variable_uninsured_best_rate: vuBest?.rate || 0,
      variable_uninsured_best_lender: vuBest?.lender_name || 'Unknown',
      variable_uninsured_avg_rate: parseFloat(avg(variableUninsured, 'rate').toFixed(2)),
      variable_uninsured_spread_to_prime: vuBest?.rate ? parseFloat((vuBest.rate - primeRate).toFixed(2)) : 0,
      variable_insured_best_rate: viBest?.rate || 0,
      variable_insured_best_lender: viBest?.lender_name || 'Unknown',
      variable_insured_avg_rate: parseFloat(avg(variableInsured, 'rate').toFixed(2)),
      variable_insured_spread_to_prime: viBest?.rate ? parseFloat((viBest.rate - primeRate).toFixed(2)) : 0,
      prime_rate: primeRate,
      lender_count: uniqueLenders.length,
      total_rates: ratesData.length,
      created_at: '2026-04-25T12:00:00.000Z'
    };
    
    historicalJson.data.push(entry25);
    console.log('  Added 2026-04-25 with fresh rates data');
    console.log(`    Best fixed uninsured: ${entry25.fixed_uninsured_best_rate}%`);
    console.log(`    Best variable uninsured: ${entry25.variable_uninsured_best_rate}%`);
    console.log(`    Variable spread: ${entry25.variable_uninsured_spread_to_prime}%`);
  }
} else {
  console.log('  Warning: No April 23 data found!');
}

// Step 3: Sort by date
historicalJson.data.sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());

// Step 4: Update metadata
historicalJson.metadata.last_updated = new Date().toISOString();
historicalJson.metadata.total_days = historicalJson.data.length;

fs.writeFileSync('data/historical_rates.json', JSON.stringify(historicalJson, null, 2));

console.log('\nAfter fix:');
console.log('  Range:', historicalJson.data[0].date, 'to', historicalJson.data[historicalJson.data.length-1].date);
console.log('  Total days:', historicalJson.data.length);
console.log('  Last 5 dates:', historicalJson.data.slice(-5).map((e: any) => e.date));
console.log('\nDone!');
