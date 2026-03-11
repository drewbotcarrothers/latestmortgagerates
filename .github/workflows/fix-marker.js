const fs = require('fs');
let c = fs.readFileSync('scrape-and-deploy.yml', 'utf8');

// Remove the version marker from before build
const oldMarker = `
      - name: Create version marker
        run: |
          mkdir -p dist
          echo "Build: $(date -u)" > dist/build-info.txt
          echo "Rates: $(cat data/metadata.json | python3 -c 'import json,sys; d=json.load(sys.stdin); print(d.get("total_rates", 0))')" >> dist/build-info.txt
          echo "Lenders: $(cat data/metadata.json | python3 -c 'import json,sys; d=json.load(sys.stdin); print(d.get("total_lenders", 0))')" >> dist/build-info.txt
        continue-on-error: true

      - name: Setup Node.js`;

const newMarker = `
      - name: Setup Node.js`;

c = c.replace(oldMarker, newMarker);

// Add version marker AFTER build step
const afterBuild = `      - name: Build
        run: npm run build

      - name: Upload build artifacts`;

const withMarker = `      - name: Build
        run: npm run build

      - name: Create version marker
        run: |
          echo "Build: $(date -u)" > dist/build-info.txt
          echo "Rates: $(cat data/metadata.json | python3 -c 'import json,sys; d=json.load(sys.stdin); print(d.get(\"total_rates\", 0))')" >> dist/build-info.txt
          echo "Lenders: $(cat data/metadata.json | python3 -c 'import json,sys; d=json.load(sys.stdin); print(d.get(\"total_lenders\", 0))')" >> dist/build-info.txt
          cat dist/build-info.txt

      - name: Upload build artifacts`;

c = c.replace(afterBuild, withMarker);

fs.writeFileSync('scrape-and-deploy.yml', c);
console.log('Moved version marker to after build');
