const fs = require('fs');
let c = fs.readFileSync('test_all_lenders_v2.py', 'utf8');

// Add True North to the list
const oldList = `        ("Street Capital", StreetCapitalScraper),
        ("Centum", CentumScraper),
    ]`;

const newList = `        ("Street Capital", StreetCapitalScraper),
        ("Centum", CentumScraper),
        ("True North", TrueNorthMortgageScraper),
    ]`;

c = c.replace(oldList, newList);
fs.writeFileSync('test_all_lenders_v2.py', c);
console.log('Added True North to scraper_classes');
