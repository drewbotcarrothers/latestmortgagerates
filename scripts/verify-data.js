#!/usr/bin/env node
/**
 * Verify data integrity before build
 * Exits with error if data doesn't meet minimum requirements
 */

const fs = require('fs');
const path = require('path');

const RATES_FILE = process.argv[2] || './data/rates.json';
const META_FILE = process.argv[3] || './data/metadata.json';
const MIN_RATES = 150;
const MIN_LENDERS = 25;

try {
  console.log(`Verifying data: ${RATES_FILE}`);
  
  if (!fs.existsSync(RATES_FILE)) {
    console.error(`ERROR: Rates file not found: ${RATES_FILE}`);
    process.exit(1);
  }
  
  const ratesData = JSON.parse(fs.readFileSync(RATES_FILE, 'utf8'));
  const uniqueLenders = [...new Set(ratesData.map(r => r.lender_slug))];
  
  console.log(`Found ${ratesData.length} rates from ${uniqueLenders.length} lenders`);
  console.log(`Lenders: ${uniqueLenders.slice(0, 10).join(', ')}...`);
  
  if (ratesData.length < MIN_RATES) {
    console.error(`ERROR: Expected at least ${MIN_RATES} rates, got ${ratesData.length}`);
    process.exit(1);
  }
  
  if (uniqueLenders.length < MIN_LENDERS) {
    console.error(`ERROR: Expected at least ${MIN_LENDERS} lenders, got ${uniqueLenders.length}`);
    process.exit(1);
  }
  
  // Check metadata if exists
  if (fs.existsSync(META_FILE)) {
    const meta = JSON.parse(fs.readFileSync(META_FILE, 'utf8'));
    console.log(`Metadata: ${meta.total_rates} rates, ${meta.total_lenders} lenders`);
    console.log(`Last updated: ${meta.last_updated}`);
    
    if (meta.scrapers_failed > 10) {
      console.error(`WARNING: ${meta.scrapers_failed} scrapers failed`);
    }
  }
  
  console.log('✓ Data verification passed');
  process.exit(0);
  
} catch (err) {
  console.error(`ERROR: ${err.message}`);
  process.exit(1);
}
