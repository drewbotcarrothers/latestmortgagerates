const fs = require('fs');
let c = fs.readFileSync('test_all_lenders_v2.py', 'utf8');

// Add import after centum
const oldImport = 'from src.scrapers.centum_scraper import CentumScraper\n\n\n# Define approved lender slugs (whitelist)';
const newImport = 'from src.scrapers.centum_scraper import CentumScraper\nfrom src.scrapers.truenorth_scraper import TrueNorthMortgageScraper\n\n\n# Define approved lender slugs (whitelist)';
c = c.replace(oldImport, newImport);

// Add to APPROVED_LENDERS
const oldLenders = "    'cmls', 'merix', 'lendwise', 'butlermortgage', 'intellimortgage', 'streetcapital', 'centum'\n}";
const newLenders = "    'cmls', 'merix', 'lendwise', 'butlermortgage', 'intellimortgage', 'streetcapital', 'centum',\n    'truenorth'\n}";
c = c.replace(oldLenders, newLenders);

// Add to scraper_classes
const oldClasses = "    (CentumScraper, \"centum\"),\n";
const newClasses = "    (CentumScraper, \"centum\"),\n    (TrueNorthMortgageScraper, \"truenorth\"),\n";
c = c.replace(oldClasses, newClasses);

fs.writeFileSync('test_all_lenders_v2.py', c);
console.log('Updated test_all_lenders_v2.py');
