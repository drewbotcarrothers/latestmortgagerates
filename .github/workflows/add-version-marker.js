const fs = require('fs');
let content = fs.readFileSync('scrape-and-deploy.yml', 'utf8');

// Add version marker before build
const oldBuild = `      - name: Clear Next.js cache
        run: rm -rf .next dist

      - name: Setup Node.js`;

const newBuild = `      - name: Clear Next.js cache
        run: rm -rf .next dist

      - name: Create version marker
        run: |
          echo "Build: $(date -u)" > dist/build-info.txt
          echo "Rates: $(cat data/metadata.json | python3 -c 'import json,sys; d=json.load(sys.stdin); print(d.get(\"total_rates\", 0))')" >> dist/build-info.txt
          echo "Lenders: $(cat data/metadata.json | python3 -c 'import json,sys; d=json.load(sys.stdin); print(d.get(\"total_lenders\", 0))')" >> dist/build-info.txt
        continue-on-error: true

      - name: Setup Node.js`;

content = content.replace(oldBuild, newBuild);
fs.writeFileSync('scrape-and-deploy.yml', content);
console.log('Added version marker');
