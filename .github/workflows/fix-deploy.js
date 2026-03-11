const fs = require('fs');
let content = fs.readFileSync('scrape-and-deploy.yml', 'utf8');

// Fix: move version marker to AFTER build, and add dangerous-clean-slate
// First, fix the version marker timing
content = content.replace(
  `- name: Create version marker
        run: |
          echo "Build: $(date -u)" > dist/build-info.txt`,
  `- name: Create version marker
        run: |
          mkdir -p dist
          echo "Build: $(date -u)" > dist/build-info.txt`
);

// Add dangerous-clean-slate
if (!content.includes('dangerous-clean-slate')) {
  content = content.replace(
    'timeout: 60000',
    'timeout: 60000\n          dangerous-clean-slate: true'
  );
  console.log('Added dangerous-clean-slate');
} else {
  console.log('dangerous-clean-slate already present');
}

fs.writeFileSync('scrape-and-deploy.yml', content);
console.log('Fixed workflow');
