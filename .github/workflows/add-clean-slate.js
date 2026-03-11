const fs = require('fs');
const content = fs.readFileSync('scrape-and-deploy.yml', 'utf8');

const oldText = `          timeout: 60000

  # Job`;

const newText = `          timeout: 60000
          dangerous-clean-slate: true

  # Job`;

if (content.includes('dangerous-clean-slate')) {
  console.log('Already has dangerous-clean-slate');
  process.exit(0);
}

const newContent = content.replace(oldText, newText);
fs.writeFileSync('scrape-and-deploy.yml', newContent);
console.log('Added dangerous-clean-slate option');
