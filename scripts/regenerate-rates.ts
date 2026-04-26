// Regenerate rates.json from all scraper fallback data
// This uses the verified April 25, 2026 fallback rates from each scraper

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('=== REGENERATING rates.json FROM SCRAPER FALLBACKS ===\n');

const scrapersDir = path.join(__dirname, '..', 'scraping', 'src', 'scrapers');
const rates: any[] = [];

// List of scrapers to run
const scraperFiles = fs.readdirSync(scrapersDir)
  .filter((f: string) => f.endsWith('_scraper.py'))
  .filter((f: string) => !f.includes('ratehub') && !f.includes('ratesca') && !f.includes('lowestrates') && !f.includes('wowa') && !f.includes('boc'));

console.log(`Found ${scraperFiles.length} lender scrapers to run\n`);

let successCount = 0;
let failCount = 0;

for (const scraperFile of scraperFiles.sort()) {
  const slug = scraperFile.replace('_scraper.py', '');
  const scraperPath = path.join(scrapersDir, scraperFile);
  
  try {
    // Run each scraper in Python and capture output
    // We use a wrapper that runs the scraper and outputs JSON
    const wrapperCode = `
import sys
sys.path.insert(0, 'scraping/src')
sys.path.insert(0, 'scraping/src/scrapers')

from ${slug}_scraper import *Scraper
import json

scraper = [c for c in globals().values() if hasattr(c, 'scrape') and hasattr(c, 'LENDER_SLUG')][0]()
rates = scraper._get_fallback_rates()

output = []
for r in rates:
    output.append({
        "lender_name": r.lender_name,
        "lender_slug": r.lender_slug,
        "term_months": r.term_months,
        "rate_type": r.rate_type.value if hasattr(r.rate_type, 'value') else str(r.rate_type),
        "mortgage_type": r.mortgage_type.value if hasattr(r.mortgage_type, 'value') else str(r.mortgage_type),
        "rate": float(r.rate) if hasattr(r.rate, '__float__') else r.rate,
        "posted_rate": float(r.posted_rate) if r.posted_rate and hasattr(r.posted_rate, '__float__') else None,
        "source_url": r.source_url,
        "scraped_at": r.scraped_at.isoformat() if hasattr(r.scraped_at, 'isoformat') else str(r.scraped_at),
        "raw_data": r.raw_data
    })

print(json.dumps(output))
`;
    
    const result = execSync(`cd "${path.join(__dirname, '..')}" && python -c "${wrapperCode}"`, {
      encoding: 'utf8',
      timeout: 30000,
      maxBuffer: 1024 * 1024
    });
    
    const scraperRates = JSON.parse(result.trim());
    rates.push(...scraperRates);
    successCount++;
    console.log(`✅ ${slug}: ${scraperRates.length} rates`);
    
  } catch (e) {
    failCount++;
    const errorMsg = e instanceof Error ? e.message : 'Failed';
    console.log(`❌ ${slug}: ${errorMsg.substring(0, 80)}`);
  }
}

console.log(`\n✅ Success: ${successCount}, ❌ Failed: ${failCount}`);
console.log(`Total rates: ${rates.length}\n`);

// Save to rates.json
const ratesPath = path.join(__dirname, '..', 'data', 'rates.json');
fs.writeFileSync(ratesPath, JSON.stringify(rates, null, 2));

console.log(`💾 Saved ${rates.length} rates to data/rates.json`);

// Show summary
const byLender: Record<string, any[]> = {};
for (const r of rates) {
  if (!byLender[r.lender_slug]) byLender[r.lender_slug] = [];
  byLender[r.lender_slug].push(r);
}

console.log('\n📊 Lender Summary:');
for (const [slug, lenderRates] of Object.entries(byLender).sort()) {
  const bestFixed = lenderRates.filter(r => r.rate_type === 'fixed').sort((a, b) => a.rate - b.rate)[0];
  const bestVariable = lenderRates.filter(r => r.rate_type === 'variable').sort((a, b) => a.rate - b.rate)[0];
  const fixedStr = bestFixed ? `${bestFixed.rate}%` : 'N/A';
  const varStr = bestVariable ? `${bestVariable.rate}%` : 'N/A';
  console.log(`  ${slug}: ${lenderRates.length} rates | Best Fixed: ${fixedStr} | Best Var: ${varStr}`);
}
