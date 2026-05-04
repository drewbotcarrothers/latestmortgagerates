// generate-weekly-update.js
// Creates a high-retention 75-sec YouTube video
// Long-form with multiple hooks, data viz, and strong CTAs

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
  const data = JSON.parse(fs.readFileSync(HISTORICAL_PATH, 'utf-8'));
  return Array.isArray(data) ? data : data.rates || [];
}

function analyzeRates(rates) {
  const fixed5y = rates.filter(r => r.term_months === 60 && r.rate_type === 'fixed');
  const variable5y = rates.filter(r => r.term_months === 60 && r.rate_type === 'variable');
  const fixed3y = rates.filter(r => r.term_months === 36 && r.rate_type === 'fixed');

  return {
    bestFixed: fixed5y.sort((a, b) => a.rate - b.rate)[0],
    bestVariable: variable5y.sort((a, b) => a.rate - b.rate)[0],
    bestFixed3y: fixed3y.sort((a, b) => a.rate - b.rate)[0],
    avgFixed: fixed5y.length ? (fixed5y.reduce((s, r) => s + r.rate, 0) / fixed5y.length).toFixed(2) : 'N/A',
    avgVariable: variable5y.length ? (variable5y.reduce((s, r) => s + r.rate, 0) / variable5y.length).toFixed(2) : 'N/A',
    totalRates: rates.length,
    lenderCount: new Set(rates.map(r => r.lender_name)).size,
  };
}

function getWeeklyTrend(current, historical) {
  if (!historical || historical.length < 7) return { direction: 'stable', change: 0 };
  const weekAgo = historical[historical.length - 7];
  const prev = weekAgo.best_5y_fixed_uninsured || weekAgo.best_5y_fixed;
  if (!prev || !current) return { direction: 'stable', change: 0 };
  const change = current - prev;
  if (change < -0.05) return { direction: 'down', change: Math.abs(change) };
  if (change > 0.05) return { direction: 'up', change };
  return { direction: 'stable', change: 0 };
}

function generateHTML(analysis, historical) {
  const { bestFixed, bestVariable, bestFixed3y, avgFixed, avgVariable, totalRates, lenderCount } = analysis;
  const today = new Date();
  const dateStr = today.toLocaleDateString('en-CA', { month: 'long', day: 'numeric', year: 'numeric' });
  const weekRange = `${new Date(today - 6*86400000).toLocaleDateString('en-CA', {month:'short', day:'numeric'})} - ${dateStr}`;

  const trend = getWeeklyTrend(bestFixed?.rate, historical);
  const trendEmoji = trend.direction === 'down' ? '📉' : trend.direction === 'up' ? '📈' : '➡️';
  const trendText = trend.direction === 'down' ? `Down ${trend.change.toFixed(2)}% this week` :
                    trend.direction === 'up' ? `Up ${trend.change.toFixed(2)}% this week` :
                    'Holding steady this week';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Weekly Rate Update</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800;900&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Inter', sans-serif; background: #000; overflow: hidden; }
    #root {
      width: 1920px; height: 1080px; position: relative;
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%);
      overflow: hidden;
    }

    /* Progress bar */
    .progress-container {
      position: absolute; top: 0; left: 0; right: 0; height: 6px;
      background: rgba(255,255,255,0.1); z-index: 1000;
    }
    .progress-bar {
      height: 100%; width: 0%;
      background: linear-gradient(90deg, #fbbf24, #f59e0b);
    }

    /* Section base */
    .section {
      position: absolute; top: 0; left: 0; right: 0; bottom: 0;
      display: flex; flex-direction: column; align-items: center; justify-content: center;
    }

    /* === HOOK (0-5s) === */
    .hook-section { text-align: center; }
    .hook-eyebrow {
      font-size: 36px; font-weight: 700; color: #fbbf24;
      text-transform: uppercase; letter-spacing: 6px;
      background: rgba(251,191,36,0.15); padding: 12px 32px;
      border-radius: 100px; border: 2px solid rgba(251,191,36,0.3);
    }
    .hook-headline {
      font-size: 96px; font-weight: 900; color: #fff;
      margin-top: 30px; line-height: 1.1;
    }
    .hook-sub {
      font-size: 48px; font-weight: 600; color: #94a3b8;
      margin-top: 24px;
    }
    .hook-trend {
      font-size: 64px; margin-top: 40px;
    }

    /* === RATES DASHBOARD (5-25s) === */
    .rates-section { padding: 60px; }
    .rates-header {
      display: flex; align-items: center; justify-content: space-between;
      width: 100%; max-width: 1600px; margin-bottom: 40px;
    }
    .rates-title {
      font-size: 56px; font-weight: 900; color: #fff;
    }
    .rates-date {
      font-size: 32px; color: #94a3b8;
    }
    .rates-grid {
      display: grid; grid-template-columns: repeat(3, 1fr);
      gap: 40px; width: 100%; max-width: 1600px;
    }
    .rate-panel {
      background: rgba(255,255,255,0.05);
      border: 2px solid rgba(255,255,255,0.1);
      border-radius: 32px; padding: 50px;
      position: relative; overflow: hidden;
    }
    .rate-panel::before {
      content: ''; position: absolute; top: 0; left: 0; right: 0; height: 4px;
    }
    .rate-panel.best::before { background: linear-gradient(90deg, #fbbf24, #f59e0b); }
    .rate-panel.avg::before { background: linear-gradient(90deg, #2563eb, #1d4ed8); }
    .rate-panel.trend::before { background: linear-gradient(90deg, #059669, #10b981); }
    .panel-label {
      font-size: 28px; font-weight: 700; color: #94a3b8;
      text-transform: uppercase; letter-spacing: 3px;
    }
    .panel-value {
      font-size: 80px; font-weight: 900; margin-top: 20px;
    }
    .panel-value.best { color: #fbbf24; }
    .panel-value.avg { color: #60a5fa; }
    .panel-value.trend { color: #34d399; }
    .panel-detail {
      font-size: 32px; color: #cbd5e1; margin-top: 16px;
    }
    .panel-lender {
      font-size: 28px; color: #94a3b8; margin-top: 12px;
    }

    /* === BIGGEST MOVERS (25-45s) === */
    .movers-section { padding: 60px; }
    .movers-title {
      font-size: 64px; font-weight: 900; color: #fff;
      margin-bottom: 50px;
    }
    .movers-list {
      width: 100%; max-width: 1400px;
    }
    .mover-item {
      display: flex; align-items: center; justify-content: space-between;
      background: rgba(255,255,255,0.05);
      border: 2px solid rgba(255,255,255,0.08);
      border-radius: 24px; padding: 40px 50px;
      margin-bottom: 24px;
    }
    .mover-lender {
      font-size: 40px; font-weight: 800; color: #e2e8f0;
    }
    .mover-change {
      display: flex; align-items: center; gap: 16px;
    }
    .mover-arrow {
      font-size: 48px;
    }
    .mover-rate {
      font-size: 52px; font-weight: 900;
    }
    .mover-rate.down { color: #34d399; }
    .mover-rate.up { color: #f87171; }

    /* === MARKET CONTEXT (45-60s) === */
    .context-section { padding: 60px; text-align: center; }
    .context-title {
      font-size: 64px; font-weight: 900; color: #fff;
      margin-bottom: 40px;
    }
    .context-cards {
      display: flex; gap: 40px; justify-content: center;
      width: 100%; max-width: 1600px;
    }
    .context-card {
      flex: 1; background: rgba(255,255,255,0.05);
      border: 2px solid rgba(255,255,255,0.1);
      border-radius: 32px; padding: 50px;
      text-align: center;
    }
    .context-icon {
      font-size: 80px; margin-bottom: 24px;
    }
    .context-label {
      font-size: 32px; font-weight: 700; color: #94a3b8;
    }
    .context-value {
      font-size: 48px; font-weight: 900; color: #fff;
      margin-top: 16px;
    }

    /* === CTA (60-75s) === */
    .cta-section { text-align: center; padding: 60px; }
    .cta-headline {
      font-size: 72px; font-weight: 900; color: #fff;
      margin-bottom: 30px;
    }
    .cta-url {
      font-size: 56px; font-weight: 900; color: #fbbf24;
      letter-spacing: 2px;
    }
    .cta-sub {
      font-size: 40px; color: #94a3b8; margin-top: 24px;
    }
    .cta-features {
      display: flex; gap: 30px; justify-content: center;
      margin-top: 40px;
    }
    .cta-feature {
      background: rgba(37,99,235,0.15);
      border: 2px solid rgba(37,99,235,0.3);
      border-radius: 20px; padding: 24px 40px;
      font-size: 32px; font-weight: 700; color: #60a5fa;
    }
    .cta-button {
      margin-top: 50px; padding: 32px 100px;
      background: linear-gradient(135deg, #2563eb, #1d4ed8);
      border-radius: 100px; font-size: 48px; font-weight: 900;
      color: #fff;
      box-shadow: 0 12px 60px rgba(37,99,235,0.5);
    }

    /* Floating accent shapes */
    .accent-shape {
      position: absolute; border-radius: 50%;
      filter: blur(100px); opacity: 0.15;
    }
  </style>
</head>
<body>
  <div id="root" data-composition-id="weekly-update" data-width="1920" data-height="1080">
    <!-- Progress bar -->
    <div class="progress-container clip" data-start="0" data-duration="75" data-track-index="1000">
      <div class="progress-bar" id="progress"></div>
    </div>

    <!-- Background accents -->
    <div class="accent-shape clip" data-start="0" data-duration="75" data-track-index="0"
         style="width:800px;height:800px;background:#2563eb;top:-200px;left:-200px;"></div>
    <div class="accent-shape clip" data-start="0" data-duration="75" data-track-index="0"
         style="width:600px;height:600px;background:#059669;bottom:-100px;right:-100px;"></div>

    <!-- === HOOK: 0-5s === -->
    <div class="section hook-section clip" id="hook" data-start="0" data-duration="5" data-track-index="10">
      <div class="hook-eyebrow" id="hook-eyebrow">${weekRange}</div>
      <div class="hook-headline" id="hook-headline">
        ${trendEmoji} Mortgage Rates<br>${trend.direction === 'down' ? 'Just Dropped' : trend.direction === 'up' ? 'Are Rising' : 'Holding Steady'}
      </div>
      <div class="hook-sub" id="hook-sub">Here's what happened this week</div>
    </div>

    <!-- === RATES DASHBOARD: 5-25s === -->
    <div class="section rates-section clip" id="rates" data-start="5" data-duration="20" data-track-index="10">
      <div class="rates-header">
        <div class="rates-title" id="rates-title">This Week's Best Rates</div>
        <div class="rates-date">${dateStr}</div>
      </div>
      <div class="rates-grid">
        <div class="rate-panel best" id="panel-best">
          <div class="panel-label">Best 5Y Fixed</div>
          <div class="panel-value best" id="best-rate">${bestFixed?.rate.toFixed(2) || '4.00'}%</div>
          <div class="panel-detail">from ${bestFixed?.lender_name || 'Top Lenders'}</div>
        </div>
        <div class="rate-panel avg" id="panel-avg">
          <div class="panel-label">Average Fixed</div>
          <div class="panel-value avg" id="avg-rate">${avgFixed}%</div>
          <div class="panel-detail">Across ${lenderCount} lenders</div>
        </div>
        <div class="rate-panel trend" id="panel-trend">
          <div class="panel-label">Best Variable</div>
          <div class="panel-value trend" id="var-rate">${bestVariable?.rate.toFixed(2) || '4.50'}%</div>
          <div class="panel-detail">${trendText}</div>
        </div>
      </div>
    </div>

    <!-- === BIGGEST MOVERS: 25-45s === -->
    <div class="section movers-section clip" id="movers" data-start="25" data-duration="20" data-track-index="10">
      <div class="movers-title" id="movers-title">🏦 Biggest Rate Changes</div>
      <div class="movers-list" id="movers-list">
        <div class="mover-item" id="mover-1">
          <div class="mover-lender">${bestFixed?.lender_name || 'nesto'}</div>
          <div class="mover-change">
            <div class="mover-arrow">${trendEmoji}</div>
            <div class="mover-rate ${trend.direction}">${bestFixed?.rate.toFixed(2) || '3.89'}%</div>
          </div>
        </div>
        <div class="mover-item" id="mover-2">
          <div class="mover-lender">${bestVariable?.lender_name || 'Wealthsimple'}</div>
          <div class="mover-change">
            <div class="mover-arrow">➡️</div>
            <div class="mover-rate">${bestVariable?.rate.toFixed(2) || '4.50'}%</div>
          </div>
        </div>
      </div>
    </div>

    <!-- === MARKET CONTEXT: 45-60s === -->
    <div class="section context-section clip" id="context" data-start="45" data-duration="15" data-track-index="10">
      <div class="context-title" id="context-title">📊 Market Snapshot</div>
      <div class="context-cards">
        <div class="context-card" id="ctx-1">
          <div class="context-icon">🏠</div>
          <div class="context-label">Lenders Compared</div>
          <div class="context-value">${lenderCount}+</div>
        </div>
        <div class="context-card" id="ctx-2">
          <div class="context-icon">📈</div>
          <div class="context-label">Rates Tracked</div>
          <div class="context-value">${totalRates}</div>
        </div>
        <div class="context-card" id="ctx-3">
          <div class="context-icon">⏰</div>
          <div class="context-label">Updated</div>
          <div class="context-value">Daily</div>
        </div>
      </div>
    </div>

    <!-- === CTA: 60-75s === -->
    <div class="section cta-section clip" id="cta" data-start="60" data-duration="15" data-track-index="20">
      <div class="cta-headline" id="cta-headline">Don't Miss the Best Rate</div>
      <div class="cta-url" id="cta-url">latestmortgagerates.ca</div>
      <div class="cta-sub" id="cta-sub">Compare ${lenderCount}+ lenders instantly — free</div>
      <div class="cta-features">
        <div class="cta-feature">✓ Daily Updates</div>
        <div class="cta-feature">✓ 100% Free</div>
        <div class="cta-feature">✓ Unbiased</div>
      </div>
      <div class="cta-button" id="cta-btn">Compare Now →</div>
    </div>

    <!-- GSAP -->
    <script src="https://cdn.jsdelivr.net/npm/gsap@3/dist/gsap.min.js"></script>
    <script>
      const tl = gsap.timeline({ paused: true });

      // === HOOK (0-5s) ===
      tl.from('#hook-eyebrow', { scale: 0, opacity: 0, duration: 0.6, ease: 'elastic.out(1, 0.5)' }, 0);
      tl.from('#hook-headline', { y: 80, opacity: 0, duration: 0.8, ease: 'power4.out' }, 0.2);
      tl.from('#hook-sub', { y: 40, opacity: 0, duration: 0.5, ease: 'power2.out' }, 0.5);
      tl.to('#hook', { scale: 0.95, opacity: 0, duration: 0.5, ease: 'power2.in' }, 4.5);

      // === RATES DASHBOARD (5-25s) ===
      tl.from('#rates-title', { x: -60, opacity: 0, duration: 0.6, ease: 'power4.out' }, 5);
      tl.from('#panel-best', { scale: 0.9, opacity: 0, y: 40, duration: 0.7, ease: 'back.out(1.2)' }, 5.3);
      tl.from('#best-rate', { scale: 0.5, opacity: 0, duration: 0.5, ease: 'elastic.out(1, 0.5)' }, 5.6);
      tl.from('#panel-avg', { scale: 0.9, opacity: 0, y: 40, duration: 0.7, ease: 'back.out(1.2)' }, 5.6);
      tl.from('#avg-rate', { scale: 0.5, opacity: 0, duration: 0.5, ease: 'elastic.out(1, 0.5)' }, 5.9);
      tl.from('#panel-trend', { scale: 0.9, opacity: 0, y: 40, duration: 0.7, ease: 'back.out(1.2)' }, 5.9);
      tl.from('#var-rate', { scale: 0.5, opacity: 0, duration: 0.5, ease: 'elastic.out(1, 0.5)' }, 6.2);
      // Hold rates visible, subtle pulse
      tl.to('#rates', { opacity: 0, y: -30, duration: 0.4, ease: 'power2.in' }, 24.6);

      // === MOVERS (25-45s) ===
      tl.from('#movers-title', { x: -60, opacity: 0, duration: 0.6, ease: 'power4.out' }, 25);
      tl.from('#mover-1', { x: -100, opacity: 0, duration: 0.6, ease: 'power4.out' }, 25.3);
      tl.from('#mover-2', { x: -100, opacity: 0, duration: 0.6, ease: 'power4.out' }, 25.6);
      tl.to('#movers', { opacity: 0, y: -30, duration: 0.4, ease: 'power2.in' }, 44.6);

      // === CONTEXT (45-60s) ===
      tl.from('#context-title', { scale: 0.9, opacity: 0, duration: 0.6, ease: 'power4.out' }, 45);
      tl.from('#ctx-1', { y: 60, opacity: 0, duration: 0.5, ease: 'back.out(1.2)' }, 45.3);
      tl.from('#ctx-2', { y: 60, opacity: 0, duration: 0.5, ease: 'back.out(1.2)' }, 45.5);
      tl.from('#ctx-3', { y: 60, opacity: 0, duration: 0.5, ease: 'back.out(1.2)' }, 45.7);
      tl.to('#context', { opacity: 0, y: -30, duration: 0.4, ease: 'power2.in' }, 59.6);

      // === CTA (60-75s) ===
      tl.from('#cta-headline', { y: 60, opacity: 0, duration: 0.6, ease: 'power4.out' }, 60);
      tl.from('#cta-url', { scale: 0.8, opacity: 0, duration: 0.5, ease: 'elastic.out(1, 0.5)' }, 60.3);
      tl.from('#cta-sub', { y: 30, opacity: 0, duration: 0.4, ease: 'power2.out' }, 60.5);
      tl.from('.cta-feature', { y: 30, opacity: 0, duration: 0.4, stagger: 0.1, ease: 'power2.out' }, 60.7);
      tl.from('#cta-btn', { scale: 0, opacity: 0, duration: 0.5, ease: 'elastic.out(1, 0.5)' }, 61.2);
      // Pulse CTA button
      tl.to('#cta-btn', {
        boxShadow: '0 12px 80px rgba(37,99,235,0.8)',
        scale: 1.05, duration: 0.4, yoyo: true, repeat: 5, ease: 'power1.inOut'
      }, 63);

      // Progress bar
      tl.to('#progress', { width: '100%', duration: 75, ease: 'none' }, 0);

      window.__timelines = window.__timelines || {};
      window.__timelines['weekly-update'] = tl;
    </script>
  </div>
</body>
</html>`;
}

function main() {
  if (!fs.existsSync(RATES_PATH)) {
    console.error('❌ rates.json not found at', RATES_PATH);
    process.exit(1);
  }

  const rates = loadRates();
  const historical = loadHistorical();
  const analysis = analyzeRates(rates);

  console.log('📊 Analysis:');
  console.log('  Best 5Y Fixed:', analysis.bestFixed?.rate.toFixed(2) + '%', '@', analysis.bestFixed?.lender_name);
  console.log('  Best 5Y Variable:', analysis.bestVariable?.rate.toFixed(2) + '%', '@', analysis.bestVariable?.lender_name);
  console.log('  Average Fixed:', analysis.avgFixed);
  console.log('  Total rates:', analysis.totalRates);
  console.log('  Lenders:', analysis.lenderCount);

  const html = generateHTML(analysis, historical);

  const outDir = path.join(OUTPUT_DIR, `weekly-update-${new Date().toISOString().split('T')[0]}`);
  fs.mkdirSync(outDir, { recursive: true });

  const outPath = path.join(outDir, 'index.html');
  fs.writeFileSync(outPath, html, 'utf-8');

  console.log('\n✅ Generated:', outPath);
  console.log('\n📺 Next steps:');
  console.log(`  cd "${outDir}"`);
  console.log('  npx hyperframes preview');
  console.log('  npx hyperframes render --quality high --output weekly-update.mp4');
}

main();
