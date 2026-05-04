// generate-rate-of-day.js
// Generates a "Rate of the Day" short-form video (9:16, 15 seconds)
// Reads latest rates from ../data/rates.json

const fs = require('fs');
const path = require('path');

const RATES_PATH = path.join(__dirname, '..', 'data', 'rates.json');
const OUTPUT_DIR = path.join(__dirname, '..', 'output');

function loadRates() {
  const raw = fs.readFileSync(RATES_PATH, 'utf-8');
  return JSON.parse(raw);
}

function getBestRates(rates) {
  const fiveYearFixed = rates
    .filter(r => r.term_months === 60 && r.rate_type === 'fixed')
    .sort((a, b) => a.rate - b.rate);

  const fiveYearVariable = rates
    .filter(r => r.term_months === 60 && r.rate_type === 'variable')
    .sort((a, b) => a.rate - b.rate);

  return {
    bestFixed: fiveYearFixed[0],
    bestVariable: fiveYearVariable[0],
    totalRates: rates.length,
  };
}

function generateHTML({ bestFixed, bestVariable, totalRates }) {
  const today = new Date().toLocaleDateString('en-CA', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Rate of the Day</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800;900&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Inter', sans-serif;
      background: #0f172a;
      color: white;
      overflow: hidden;
    }
    #root {
      width: 1080px;
      height: 1920px;
      position: relative;
      background: linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0f172a 100%);
    }
    .header {
      position: absolute;
      top: 80px;
      left: 0;
      width: 100%;
      text-align: center;
    }
    .header h2 {
      font-size: 48px;
      font-weight: 600;
      color: #94a3b8;
      letter-spacing: 4px;
      text-transform: uppercase;
    }
    .header h1 {
      font-size: 96px;
      font-weight: 900;
      margin-top: 16px;
      background: linear-gradient(135deg, #60a5fa, #34d399);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .date {
      position: absolute;
      top: 320px;
      left: 0;
      width: 100%;
      text-align: center;
      font-size: 40px;
      color: #94a3b8;
    }
    .rate-card {
      position: absolute;
      left: 80px;
      right: 80px;
      background: rgba(255,255,255,0.05);
      border: 2px solid rgba(255,255,255,0.1);
      border-radius: 32px;
      padding: 60px;
      backdrop-filter: blur(10px);
    }
    .rate-card.fixed {
      top: 480px;
    }
    .rate-card.variable {
      top: 1020px;
    }
    .rate-label {
      font-size: 40px;
      font-weight: 600;
      color: #94a3b8;
      text-transform: uppercase;
      letter-spacing: 3px;
    }
    .rate-value {
      font-size: 120px;
      font-weight: 900;
      margin-top: 16px;
    }
    .rate-value.fixed-rate { color: #60a5fa; }
    .rate-value.variable-rate { color: #34d399; }
    .rate-lender {
      font-size: 44px;
      color: #cbd5e1;
      margin-top: 16px;
    }
    .footer {
      position: absolute;
      bottom: 80px;
      left: 0;
      width: 100%;
      text-align: center;
    }
    .footer .url {
      font-size: 44px;
      font-weight: 700;
      color: #fbbf24;
    }
    .footer .subtitle {
      font-size: 36px;
      color: #64748b;
      margin-top: 12px;
    }
  </style>
</head>
<body>
  <div id="root" data-composition-id="rate-of-day" data-width="1080" data-height="1920">
    
    <div class="header clip" id="header" data-start="0" data-duration="15" data-track-index="0">
      <h2>Latest Mortgage Rates</h2>
      <h1>Rate of the Day</h1>
    </div>

    <div class="date clip" id="date" data-start="0" data-duration="15" data-track-index="0">
      ${today}
    </div>

    <div class="rate-card fixed clip" id="card-fixed" data-start="0.5" data-duration="14.5" data-track-index="1">
      <div class="rate-label">Best 5-Year Fixed</div>
      <div class="rate-value fixed-rate" id="fixed-rate">${bestFixed.rate.toFixed(2)}%</div>
      <div class="rate-lender">${bestFixed.lender_name}</div>
    </div>

    <div class="rate-card variable clip" id="card-variable" data-start="1" data-duration="14" data-track-index="1">
      <div class="rate-label">Best 5-Year Variable</div>
      <div class="rate-value variable-rate" id="variable-rate">${bestVariable.rate.toFixed(2)}%</div>
      <div class="rate-lender">${bestVariable.lender_name}</div>
    </div>

    <div class="footer clip" id="footer" data-start="2" data-duration="13" data-track-index="2">
      <div class="url">latestmortgagerates.ca</div>
      <div class="subtitle">Compare ${totalRates}+ rates from top lenders</div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/gsap@3/dist/gsap.min.js"></script>
    <script>
      const tl = gsap.timeline({ paused: true });

      // Header fade in
      tl.from('#header', { opacity: 0, y: -60, duration: 0.8, ease: 'power4.out' }, 0);
      tl.from('#date', { opacity: 0, y: -30, duration: 0.6, ease: 'power4.out' }, 0.2);

      // Rate cards stagger in
      tl.from('#card-fixed', { opacity: 0, scale: 0.8, y: 80, duration: 0.8, ease: 'back.out(1.2)' }, 0.5);
      tl.from('#fixed-rate', { opacity: 0, scale: 0.5, duration: 0.6, ease: 'elastic.out(1, 0.5)' }, 0.9);

      tl.from('#card-variable', { opacity: 0, scale: 0.8, y: 80, duration: 0.8, ease: 'back.out(1.2)' }, 1.0);
      tl.from('#variable-rate', { opacity: 0, scale: 0.5, duration: 0.6, ease: 'elastic.out(1, 0.5)' }, 1.4);

      // Footer slide up
      tl.from('#footer', { opacity: 0, y: 60, duration: 0.6, ease: 'power4.out' }, 1.8);

      // Hold, then fade everything out at end
      tl.to(['#header','#date','#card-fixed','#card-variable','#footer'], {
        opacity: 0, y: -40, duration: 0.5, stagger: 0.05, ease: 'power2.in'
      }, 13.5);

      window.__timelines = window.__timelines || {};
      window.__timelines['rate-of-day'] = tl;
    </script>
  </div>
</body>
</html>`;
}

function main() {
  if (!fs.existsSync(RATES_PATH)) {
    console.error('❌ rates.json not found at', RATES_PATH);
    console.error('Run this from the video-pipeline/scripts/ directory');
    process.exit(1);
  }

  const rates = loadRates();
  const best = getBestRates(rates);

  console.log('📊 Loaded', rates.length, 'rates');
  console.log('🏆 Best 5Y Fixed:', best.bestFixed.rate.toFixed(2) + '%', 'at', best.bestFixed.lender_name);
  console.log('🏆 Best 5Y Variable:', best.bestVariable.rate.toFixed(2) + '%', 'at', best.bestVariable.lender_name);

  const html = generateHTML(best);

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const outPath = path.join(OUTPUT_DIR, 'rate-of-day.html');
  fs.writeFileSync(outPath, html, 'utf-8');

  console.log('\n✅ Generated:', outPath);
  console.log('\nNext steps:');
  console.log('  1. cd video-pipeline/output');
  console.log('  2. npx hyperframes preview     # Preview in browser');
  console.log('  3. npx hyperframes render --output rate-of-day.mp4   # Render to MP4');
}

main();
