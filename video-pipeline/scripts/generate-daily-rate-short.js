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

function generateHTML({ fixed5y, variable5y, fixed3y }, historical) {
  const today = new Date().toLocaleDateString('en-CA', { month: 'short', day: 'numeric' });
  const totalRates = fixed5y && variable5y ? 2 : 0;

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
      padding-top: 200px;
    }
    .section-label {
      font-size: 40px; font-weight: 700; color: #94a3b8;
      text-transform: uppercase; letter-spacing: 6px;
    }
    .rate-card {
      width: 920px; margin-top: 60px;
      background: rgba(255,255,255,0.06);
      border: 2px solid rgba(255,255,255,0.12);
      border-radius: 40px; padding: 60px 50px;
      backdrop-filter: blur(20px);
      position: relative; overflow: hidden;
    }
    .rate-card::before {
      content: ''; position: absolute; top: 0; left: 0; right: 0; height: 4px;
      background: linear-gradient(90deg, #2563eb, #059669);
    }
    .rate-row {
      display: flex; align-items: center; justify-content: space-between;
      margin-bottom: 40px;
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
      font-size: 36px; color: #94a3b8; margin-top: 8px;
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

    /* Floating elements */
    .float-icon {
      position: absolute; font-size: 120px; opacity: 0.08;
    }
    .float-1 { top: 300px; right: 60px; }
    .float-2 { bottom: 500px; left: 60px; }
    .float-3 { top: 700px; left: 80px; }
  </style>
</head>
<body>
  <div id="root" data-composition-id="daily-rate-short" data-width="1080" data-height="1920">
    <!-- Background -->
    <div class="bg-glow bg-glow-1 clip" data-start="0" data-duration="15" data-track-index="0"></div>
    <div class="bg-glow bg-glow-2 clip" data-start="0" data-duration="15" data-track-index="0"></div>

    <!-- Progress bar -->
    <div class="progress-container clip" data-start="0" data-duration="15" data-track-index="100">
      <div class="progress-bar" id="progress"></div>
    </div>

    <!-- Floating icons -->
    <div class="float-icon float-1 clip" data-start="0" data-duration="15" data-track-index="1">💰</div>
    <div class="float-icon float-2 clip" data-start="0" data-duration="15" data-track-index="1">🏠</div>
    <div class="float-icon float-3 clip" data-start="0" data-duration="15" data-track-index="1">📊</div>

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
    </div>

    <!-- CTA: 12-15 seconds -->
    <div class="cta-section clip" id="cta" data-start="12" data-duration="3" data-track-index="20">
      <div class="cta-url" id="cta-url">latestmortgagerates.ca</div>
      <div class="cta-sub" id="cta-sub">Compare ${fixed5y ? '34+' : '30+'} Lenders Instantly</div>
      <div class="cta-button" id="cta-btn">Compare Now →</div>
    </div>

    <!-- GSAP -->
    <script src="https://cdn.jsdelivr.net/npm/gsap@3/dist/gsap.min.js"></script>
    <script>
      const tl = gsap.timeline({ paused: true });

      // === HOOK PHASE (0-3s) ===
      // Badge pops in with elastic bounce
      tl.from('#hook-badge', {
        scale: 0, opacity: 0, duration: 0.5, ease: 'elastic.out(1, 0.5)'
      }, 0);

      // Headline slides up from below with dramatic ease
      tl.from('#hook-headline', {
        y: 100, opacity: 0, duration: 0.6, ease: 'power4.out'
      }, 0.2);

      // Sub fades in
      tl.from('#hook-sub', {
        y: 40, opacity: 0, duration: 0.4, ease: 'power2.out'
      }, 0.5);

      // Arrow bounces in
      tl.from('#hook-arrow', {
        y: -30, opacity: 0, duration: 0.4, ease: 'back.out(2)'
      }, 0.7);

      // Hook zooms out and fades as rates come in
      tl.to('#hook', {
        scale: 0.9, opacity: 0, duration: 0.4, ease: 'power2.in'
      }, 2.6);

      // === RATES PHASE (3-12s) ===
      // Section label slides in
      tl.from('#rates-label', {
        x: -60, opacity: 0, duration: 0.5, ease: 'power4.out'
      }, 3);

      // Rate card scales up with back.out overshoot
      tl.from('#rate-card', {
        scale: 0.8, opacity: 0, y: 60, duration: 0.7, ease: 'back.out(1.2)'
      }, 3.2);

      // Fixed rate row slides in from left
      tl.from('#row-fixed', {
        x: -80, opacity: 0, duration: 0.5, ease: 'power4.out'
      }, 3.5);

      // Fixed rate number counts up with elastic pop
      tl.from('#fixed-rate', {
        scale: 0.3, opacity: 0, duration: 0.6, ease: 'elastic.out(1, 0.5)'
      }, 3.8);

      // Fixed trend badge pops
      tl.from('#fixed-trend', {
        scale: 0, opacity: 0, duration: 0.4, ease: 'back.out(2)'
      }, 4.1);

      // Variable rate row slides in
      tl.from('#row-variable', {
        x: -80, opacity: 0, duration: 0.5, ease: 'power4.out'
      }, 4.5);

      // Variable rate number pops
      tl.from('#var-rate', {
        scale: 0.3, opacity: 0, duration: 0.6, ease: 'elastic.out(1, 0.5)'
      }, 4.8);

      // Variable trend badge pops
      tl.from('#var-trend', {
        scale: 0, opacity: 0, duration: 0.4, ease: 'back.out(2)'
      }, 5.1);

      // Brief hold on rates, then subtle pulse to keep attention
      tl.to('#rate-card', {
        scale: 1.02, duration: 0.3, yoyo: true, repeat: 1, ease: 'power1.inOut'
      }, 8);

      // Rates fade out for CTA
      tl.to('#rates', {
        y: -40, opacity: 0, duration: 0.4, ease: 'power2.in'
      }, 11.6);

      // === CTA PHASE (12-15s) ===
      // URL slides up
      tl.from('#cta-url', {
        y: 60, opacity: 0, duration: 0.5, ease: 'power4.out'
      }, 12);

      // Subtext fades in
      tl.from('#cta-sub', {
        y: 30, opacity: 0, duration: 0.4, ease: 'power2.out'
      }, 12.3);

      // Button bounces in with glow pulse
      tl.from('#cta-btn', {
        scale: 0, opacity: 0, duration: 0.5, ease: 'elastic.out(1, 0.5)'
      }, 12.5);

      // Button glow pulse to drive clicks
      tl.to('#cta-btn', {
        boxShadow: '0 8px 60px rgba(37,99,235,0.8)',
        scale: 1.05, duration: 0.4, yoyo: true, repeat: 3, ease: 'power1.inOut'
      }, 13);

      // Progress bar animation
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

  const html = generateHTML(best, historical);

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
