// generate-daily-rate-short.js
// Creates a high-retention 15-sec YouTube Short optimized for views
// 9:16 vertical, fast cuts, bold text, pattern-interrupt hook

const fs = require('fs');
const path = require('path');

const RATES_PATH = path.join(__dirname, '..', '..', 'data', 'rates.json');
const HISTORICAL_PATH = path.join(__dirname, '..', '..', 'data', 'historical_rates.json');
const OUTPUT_DIR = path.join(__dirname, '..', 'output');

function loadRates() {
  return JSON.parse(fs.readFileSync(RATES_PATH, 'utf-8'));
}

function loadHistorical() {
  if (!fs.existsSync(HISTORICAL_PATH)) return null;
  return JSON.parse(fs.readFileSync(HISTORICAL_PATH, 'utf-8'));
}

function getTrendIcon(current, previous) {
  if (!previous) return '';
  const diff = current - previous;
  if (diff < -0.01) return '📉';
  if (diff > 0.01) return '📈';
  return '➡️';
}

function getTrendText(current, previous) {
  if (!previous) return '';
  const diff = current - previous;
  if (Math.abs(diff) < 0.005) return 'Holding steady';
  return diff < 0 ? `Down ${Math.abs(diff).toFixed(2)}%` : `Up ${diff.toFixed(2)}%`;
}

function getBestRates(rates) {
  const fixed5y = rates.filter(r => r.term_months === 60 && r.rate_type === 'fixed')
    .sort((a, b) => a.rate - b.rate)[0];
  const variable5y = rates.filter(r => r.term_months === 60 && r.rate_type === 'variable')
    .sort((a, b) => a.rate - b.rate)[0];
  const fixed3y = rates.filter(r => r.term_months === 36 && r.rate_type === 'fixed')
    .sort((a, b) => a.rate - b.rate)[0];
  return { fixed5y, variable5y, fixed3y };
}

function generateHTML({ fixed5y, variable5y, fixed3y }, rates, historical) {
  const today = new Date().toLocaleDateString('en-CA', { month: 'short', day: 'numeric' });

  // Get yesterday's rates for trend
  let prevFixed5y, prevVariable5y;
  if (historical && historical.length > 1) {
    const yesterday = historical[historical.length - 2];
    prevFixed5y = yesterday.best_5y_fixed_uninsured || yesterday.best_5y_fixed;
    prevVariable5y = yesterday.best_5y_variable_uninsured || yesterday.best_5y_variable;
  }

  const fixedTrend = getTrendText(fixed5y?.rate, prevFixed5y);
  const varTrend = getTrendText(variable5y?.rate, prevVariable5y);
  const fixedIcon = getTrendIcon(fixed5y?.rate, prevFixed5y);
  const varIcon = getTrendIcon(variable5y?.rate, prevVariable5y);

  // Helper to get best rate for any term/type
  const getRate = (termMonths, rateType, mortgageType = 'uninsured') => {
    const match = rates.filter(r => 
      r.term_months === termMonths && 
      r.rate_type === rateType && 
      r.mortgage_type === mortgageType
    ).sort((a, b) => a.rate - b.rate)[0];
    return match;
  };

  const r2yFixed = getRate(24, 'fixed');
  const r10yFixed = getRate(120, 'fixed');
  const r1yFixed = getRate(12, 'fixed');
  const r6mFixed = getRate(6, 'fixed');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Rate of the Day</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800;900&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Inter', sans-serif; background: #000; overflow: hidden; }
    #root {
      width: 1080px; height: 1920px; position: relative;
      background: linear-gradient(180deg, #0f172a 0%, #1e3a5f 40%, #0f172a 100%);
      overflow: hidden;
    }
    /* Animated background particles */
    .bg-glow {
      position: absolute; width: 600px; height: 600px;
      border-radius: 50%; filter: blur(120px); opacity: 0.3;
    }
    .bg-glow-1 { background: #2563eb; top: -200px; left: -100px; }
    .bg-glow-2 { background: #059669; bottom: -200px; right: -100px; }

    /* Progress bar at top */
    .progress-container {
      position: absolute; top: 0; left: 0; right: 0; height: 8px;
      background: rgba(255,255,255,0.1); z-index: 100;
    }
    .progress-bar {
      height: 100%; width: 0%; background: linear-gradient(90deg, #fbbf24, #f59e0b);
      border-radius: 0 4px 4px 0;
    }

    /* Hook section - full screen pattern interrupt */
    .hook-section {
      position: absolute; top: 0; left: 0; right: 0; bottom: 0;
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      text-align: center;
    }
    .hook-badge {
      font-size: 48px; font-weight: 800; color: #fbbf24;
      background: rgba(251,191,36,0.15); padding: 16px 40px;
      border-radius: 100px; border: 2px solid rgba(251,191,36,0.3);
      text-transform: uppercase; letter-spacing: 4px;
    }
    .hook-headline {
      font-size: 96px; font-weight: 900; color: #fff;
      margin-top: 40px; line-height: 1.1;
      text-shadow: 0 4px 30px rgba(0,0,0,0.5);
    }
    .hook-sub {
      font-size: 52px; font-weight: 600; color: #94a3b8;
      margin-top: 24px;
    }
    .hook-arrow {
      font-size: 80px; margin-top: 40px; animation: bounce 1s infinite;
    }
    @keyframes bounce {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-20px); }
    }

    /* Rate reveal section */
    .rates-section {
      position: absolute; top: 0; left: 0; right: 0; bottom: 0;
      display: flex; flex-direction: column; align-items: center;
      padding-top: 140px;
    }
    .section-label {
      font-size: 40px; font-weight: 700; color: #94a3b8;
      text-transform: uppercase; letter-spacing: 6px;
    }
    .rate-card {
      width: 920px; margin-top: 40px;
      background: rgba(255,255,255,0.06);
      border: 2px solid rgba(255,255,255,0.12);
      border-radius: 40px; padding: 50px 50px;
      backdrop-filter: blur(20px);
      position: relative; overflow: hidden;
    }
    .rate-card::before {
      content: ''; position: absolute; top: 0; left: 0; right: 0; height: 4px;
      background: linear-gradient(90deg, #2563eb, #059669);
    }
    .rate-row {
      display: flex; align-items: center; justify-content: space-between;
      margin-bottom: 30px;
    }
    .rate-row:last-child { margin-bottom: 0; }
    .rate-type {
      font-size: 44px; font-weight: 700; color: #e2e8f0;
    }
    .rate-value-container {
      display: flex; align-items: center; gap: 20px;
    }
    .rate-value {
      font-size: 88px; font-weight: 900;
    }
    .rate-value.fixed { color: #60a5fa; }
    .rate-value.variable { color: #34d399; }
    .rate-trend {
      font-size: 36px; font-weight: 700; padding: 8px 20px;
      border-radius: 12px;
    }
    .rate-trend.down { color: #34d399; background: rgba(52,211,153,0.15); }
    .rate-trend.up { color: #f87171; background: rgba(248,113,113,0.15); }
    .rate-trend.flat { color: #94a3b8; background: rgba(148,163,184,0.15); }
    .rate-lender {
      font-size: 32px; color: #94a3b8; margin-top: 6px;
    }

    /* More rates grid */
    .rates-grid {
      display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px;
      width: 920px; margin-top: 30px;
    }
    .rate-mini {
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 20px; padding: 20px 16px;
      text-align: center;
    }
    .rate-mini .rate-type {
      font-size: 24px; font-weight: 600; color: #94a3b8;
      margin-bottom: 6px;
    }
    .rate-mini .rate-value {
      font-size: 44px; font-weight: 900; color: #fff;
    }
    .rate-mini .rate-lender {
      font-size: 20px; color: #64748b; margin-top: 4px;
    }

    /* CTA section */
    .cta-section {
      position: absolute; bottom: 0; left: 0; right: 0;
      padding: 80px 60px 120px;
      background: linear-gradient(180deg, transparent 0%, rgba(15,23,42,0.95) 40%);
      display: flex; flex-direction: column; align-items: center;
    }
    .cta-url {
      font-size: 56px; font-weight: 900; color: #fbbf24;
      letter-spacing: 2px;
    }
    .cta-sub {
      font-size: 40px; color: #94a3b8; margin-top: 20px;
    }
    .cta-button {
      margin-top: 40px; padding: 28px 80px;
      background: linear-gradient(135deg, #2563eb, #1d4ed8);
      border-radius: 100px; font-size: 44px; font-weight: 800;
      color: #fff; box-shadow: 0 8px 40px rgba(37,99,235,0.4);
    }
  </style>
</head>
<body>
  <div id="root" data-composition-id="daily-rate-short" data-width="1080" data-height="1920">
    <!-- Background glow effects only -->
    <div class="bg-glow bg-glow-1 clip" data-start="0" data-duration="15" data-track-index="0"></div>
    <div class="bg-glow bg-glow-2 clip" data-start="0" data-duration="15" data-track-index="0"></div>

    <!-- Progress bar -->
    <div class="progress-container clip" data-start="0" data-duration="15" data-track-index="100">
      <div class="progress-bar" id="progress"></div>
    </div>

    <!-- HOOK: 0-3 seconds -->
    <div class="hook-section clip" id="hook" data-start="0" data-duration="3" data-track-index="10">
      <div class="hook-badge" id="hook-badge">${today}</div>
      <div class="hook-headline" id="hook-headline">Best Mortgage<br>Rates in Canada</div>
      <div class="hook-sub" id="hook-sub">Updated Daily</div>
      <div class="hook-arrow" id="hook-arrow">👇</div>
    </div>

    <!-- RATES: 3-12 seconds -->
    <div class="rates-section clip" id="rates" data-start="3" data-duration="9" data-track-index="10">
      <div class="section-label" id="rates-label">Today's Best Rates</div>

      <div class="rate-card" id="rate-card">
        <div class="rate-row" id="row-fixed">
          <div>
            <div class="rate-type">5-Year Fixed</div>
            <div class="rate-lender">${fixed5y?.lender_name || 'Various Lenders'}</div>
          </div>
          <div class="rate-value-container">
            <div class="rate-value fixed" id="fixed-rate">${fixed5y?.rate.toFixed(2) || '4.00'}%</div>
            <div class="rate-trend ${fixedTrend.includes('Down') ? 'down' : fixedTrend.includes('Up') ? 'up' : 'flat'}" id="fixed-trend">
              ${fixedIcon} ${fixedTrend}
            </div>
          </div>
        </div>

        <div class="rate-row" id="row-variable">
          <div>
            <div class="rate-type">5-Year Variable</div>
            <div class="rate-lender">${variable5y?.lender_name || 'Various Lenders'}</div>
          </div>
          <div class="rate-value-container">
            <div class="rate-value variable" id="var-rate">${variable5y?.rate.toFixed(2) || '4.50'}%</div>
            <div class="rate-trend ${varTrend.includes('Down') ? 'down' : varTrend.includes('Up') ? 'up' : 'flat'}" id="var-trend">
              ${varIcon} ${varTrend}
            </div>
          </div>
        </div>
      </div>

      <div class="rates-grid" id="rates-grid">
        <div class="rate-mini" id="mini-3y-fixed">
          <div class="rate-type">3Y Fixed</div>
          <div class="rate-value">${fixed3y?.rate.toFixed(2) || '4.00'}%</div>
          <div class="rate-lender">${fixed3y?.lender_name || 'Various'}</div>
        </div>
        <div class="rate-mini" id="mini-2y-fixed">
          <div class="rate-type">2Y Fixed</div>
          <div class="rate-value">${r2yFixed?.rate.toFixed(2) || '4.50'}%</div>
          <div class="rate-lender">${r2yFixed?.lender_name || 'Various'}</div>
        </div>
        <div class="rate-mini" id="mini-10y-fixed">
          <div class="rate-type">10Y Fixed</div>
          <div class="rate-value">${r10yFixed?.rate.toFixed(2) || '5.00'}%</div>
          <div class="rate-lender">${r10yFixed?.lender_name || 'Various'}</div>
        </div>
        <div class="rate-mini" id="mini-1y-fixed">
          <div class="rate-type">1Y Fixed</div>
          <div class="rate-value">${r1yFixed?.rate.toFixed(2) || '5.00'}%</div>
          <div class="rate-lender">${r1yFixed?.lender_name || 'Various'}</div>
        </div>
        <div class="rate-mini" id="mini-6m-fixed">
          <div class="rate-type">6M Fixed</div>
          <div class="rate-value">${r6mFixed?.rate.toFixed(2) || '5.00'}%</div>
          <div class="rate-lender">${r6mFixed?.lender_name || 'Various'}</div>
        </div>
        <div class="rate-mini" id="mini-1y-variable">
          <div class="rate-type">1Y Variable</div>
          <div class="rate-value">${getRate(12, 'variable')?.rate.toFixed(2) || '5.00'}%</div>
          <div class="rate-lender">${getRate(12, 'variable')?.lender_name || 'Various'}</div>
        </div>
      </div>
    </div>

    <!-- CTA: 12-15 seconds -->
    <div class="cta-section clip" id="cta" data-start="12" data-duration="3" data-track-index="20">
      <div class="cta-url" id="cta-url">latestmortgagerates.ca</div>
      <div class="cta-sub" id="cta-sub">Compare 34+ Lenders Instantly</div>
      <div class="cta-button" id="cta-btn">Compare Now →</div>
    </div>

    <!-- GSAP -->
    <script src="https://cdn.jsdelivr.net/npm/gsap@3/dist/gsap.min.js"></script>
    <script>
      const tl = gsap.timeline({ paused: true });

      // === HOOK PHASE (0-3s) ===
      tl.from('#hook-badge', {
        scale: 0, opacity: 0, duration: 0.5, ease: 'elastic.out(1, 0.5)'
      }, 0);

      tl.from('#hook-headline', {
        y: 100, opacity: 0, duration: 0.6, ease: 'power4.out'
      }, 0.2);

      tl.from('#hook-sub', {
        y: 40, opacity: 0, duration: 0.4, ease: 'power2.out'
      }, 0.5);

      tl.from('#hook-arrow', {
        y: -30, opacity: 0, duration: 0.4, ease: 'back.out(2)'
      }, 0.7);

      tl.to('#hook', {
        scale: 0.9, opacity: 0, duration: 0.4, ease: 'power2.in'
      }, 2.6);

      // === RATES PHASE (3-12s) ===
      tl.from('#rates-label', {
        x: -60, opacity: 0, duration: 0.5, ease: 'power4.out'
      }, 3);

      tl.from('#rate-card', {
        scale: 0.8, opacity: 0, y: 60, duration: 0.7, ease: 'back.out(1.2)'
      }, 3.2);

      tl.from('#row-fixed', {
        x: -80, opacity: 0, duration: 0.5, ease: 'power4.out'
      }, 3.5);

      tl.from('#fixed-rate', {
        scale: 0.3, opacity: 0, duration: 0.6, ease: 'elastic.out(1, 0.5)'
      }, 3.8);

      tl.from('#fixed-trend', {
        scale: 0, opacity: 0, duration: 0.4, ease: 'back.out(2)'
      }, 4.1);

      tl.from('#row-variable', {
        x: -80, opacity: 0, duration: 0.5, ease: 'power4.out'
      }, 4.5);

      tl.from('#var-rate', {
        scale: 0.3, opacity: 0, duration: 0.6, ease: 'elastic.out(1, 0.5)'
      }, 4.8);

      tl.from('#var-trend', {
        scale: 0, opacity: 0, duration: 0.4, ease: 'back.out(2)'
      }, 5.1);

      // Mini grid staggered entrance
      tl.from('#rates-grid', {
        y: 40, opacity: 0, duration: 0.5, ease: 'power2.out'
      }, 5.5);

      tl.from('#mini-3y-fixed', {
        scale: 0.8, opacity: 0, duration: 0.4, ease: 'back.out(1.5)'
      }, 5.7);

      tl.from('#mini-2y-fixed', {
        scale: 0.8, opacity: 0, duration: 0.4, ease: 'back.out(1.5)'
      }, 5.85);

      tl.from('#mini-10y-fixed', {
        scale: 0.8, opacity: 0, duration: 0.4, ease: 'back.out(1.5)'
      }, 6.0);

      tl.from('#mini-1y-fixed', {
        scale: 0.8, opacity: 0, duration: 0.4, ease: 'back.out(1.5)'
      }, 6.15);

      tl.from('#mini-6m-fixed', {
        scale: 0.8, opacity: 0, duration: 0.4, ease: 'back.out(1.5)'
      }, 6.3);

      tl.from('#mini-1y-variable', {
        scale: 0.8, opacity: 0, duration: 0.4, ease: 'back.out(1.5)'
      }, 6.45);

      // Rates section exits for CTA
      tl.to('#rates', {
        y: -40, opacity: 0, duration: 0.4, ease: 'power2.in'
      }, 11.6);

      // === CTA PHASE (12-15s) ===
      tl.from('#cta-url', {
        y: 60, opacity: 0, duration: 0.5, ease: 'power4.out'
      }, 12);

      tl.from('#cta-sub', {
        y: 30, opacity: 0, duration: 0.4, ease: 'power2.out'
      }, 12.3);

      tl.from('#cta-btn', {
        scale: 0, opacity: 0, duration: 0.5, ease: 'elastic.out(1, 0.5)'
      }, 12.5);

      tl.to('#cta-btn', {
        boxShadow: '0 8px 60px rgba(37,99,235,0.8)',
        scale: 1.05, duration: 0.4, yoyo: true, repeat: 3, ease: 'power1.inOut'
      }, 13);

      // Progress bar
      tl.to('#progress', { width: '100%', duration: 15, ease: 'none' }, 0);

      // Register timeline
      window.__timelines = window.__timelines || {};
      window.__timelines['daily-rate-short'] = tl;
    </script>
  </div>
</body>
</html>`;
}

function main() {
  if (!fs.existsSync(RATES_PATH)) {
    console.error('❌ rates.json not found');
    process.exit(1);
  }

  const rates = loadRates();
  const historical = loadHistorical();
  const best = getBestRates(rates);

  console.log('📊 Best 5Y Fixed:', best.fixed5y?.rate.toFixed(2) + '%', '@', best.fixed5y?.lender_name);
  console.log('📊 Best 5Y Variable:', best.variable5y?.rate.toFixed(2) + '%', '@', best.variable5y?.lender_name);
  console.log('📊 Best 3Y Fixed:', best.fixed3y?.rate.toFixed(2) + '%', '@', best.fixed3y?.lender_name);

  const html = generateHTML(best, rates, historical);

  const outDir = path.join(OUTPUT_DIR, `daily-rate-${new Date().toISOString().split('T')[0]}`);
  fs.mkdirSync(outDir, { recursive: true });

  const outPath = path.join(outDir, 'index.html');
  fs.writeFileSync(outPath, html, 'utf-8');

  console.log('\n✅ Generated:', outPath);
  console.log('\n📺 Next steps:');
  console.log(`  cd "${outDir}"`);
  console.log('  npx hyperframes preview');
  console.log('  npx hyperframes render --quality high --output video.mp4');
}

main();
