const fs = require('fs');

// Add cache-busting meta tag to layout.tsx
let content = fs.readFileSync('../../app/layout.tsx', 'utf8');

// Check if already has cache-busting
if (!content.includes('build-time')) {
  // Add cache-busting comment/meta
  const headEnd = '</head>';
  const cacheBust = `  <meta name="build-time" content={new Date().toISOString()} />\n  </head>`;
  content = content.replace(headEnd, cacheBust);
  fs.writeFileSync('../../app/layout.tsx', content);
  console.log('Added cache-busting meta tag');
}
