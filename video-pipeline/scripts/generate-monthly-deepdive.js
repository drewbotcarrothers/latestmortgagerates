// generate-monthly-deepdive.js
// Monthly deep-dive video: market analysis, predictions, trend charts
// 1920x1080 landscape, ~90 seconds, authority-building content

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

function analyzeRates(rates) {
  const fixed5y = rates.filter(r => r.term_months === 60 && r.rate_type === 'fixed');
  const variable5y = rates.filter(r => r.term_months === 60 && r.rate_type === 'variable');

  return {
    bestFixed: fixed5y.sort((a, b) => a.rate - b.rate)[0],
    bestVariable: variable5y.sort((a, b) => a.rate - b.rate)[0],
    avgFixed: fixed5y.length ? (fixed5y.reduce((s, r) => s + r.rate, 0) / fixed5y.length).toFixed(2) : 'N/A',
    avgVariable: variable5y.length ? (variable5y.reduce((s, r) => s + r.rate, 0) / variable5y.length).toFixed(2) : 'N/A',
    lenderCount: new Set(rates.map(r => r.lender_name)).size,
    totalRates: rates.length,
  };
}

function getMonthlyTrend(historical) {
  if (!historical || !Array.isArray(historical) || historical.length < 30) return { direction: 'stable', change: 0 };
  const monthAgo = historical[historical.length - 30];
  const now = historical[historical.length - 1];
  if (!monthAgo || !now) return { direction: 'stable', change: 0 };
  const prev = monthAgo.best_5y_fixed_uninsured || monthAgo.best_5y_fixed;
  const curr = now.best_5y_fixed_uninsured || now.best_5y_fixed;
  if (!prev || !curr) return { direction: 'stable', change: 0 };
  const change = curr - prev;
  if (change < -0.1) return { direction: 'down', change: Math.abs(change) };
  if (change > 0.1) return { direction: 'up', change };
  return { direction: 'stable', change: 0 };
}

function getPrediction(trend, avgFixed) {
  const avg = parseFloat(avgFixed);
  if (trend.direction === 'down') {
    return {
      text: 'Rates likely to keep falling',
      sub: 'Good time to lock in or wait for better',
      icon: '📉',
      color: '#34d399'
    };
  } else if (trend.direction === 'up') {
    return {
      text: 'Rates trending upward',
      sub: 'Consider locking in soon',
      icon: '📈',
      color: '#f87171'
    };
  }
  return {
    text: 'Rates holding steady',
    sub: 'Monitor for BoC announcements',
    icon: '➡️',
    color: '#60a5fa'
  };
}

function generateHTML(analysis, historical) {
  const { bestFixed, bestVariable, avgFixed, avgVariable, lenderCount, totalRates } = analysis;
  const today = new Date();
  const monthName = today.toLocaleDateString('en-CA', { month: 'long', year: 'numeric' });
  const dateStr = today.toLocaleDateString('en-CA', { month: 'long', day: 'numeric', year: 'numeric' });

  const trend = getMonthlyTrend(historical);
  const prediction = getPrediction(trend, avgFixed);

  const trendEmoji = trend.direction === 'down' ? '📉' : trend.direction === 'up' ? '📈' : '➡️';
  const trendText = trend.direction === 'down' ? `Down ${trend.change.toFixed(2)}% this month` :
                    trend.direction === 'up' ? `Up ${trend.change.toFixed(2)}% this month` :
                    'Holding steady this month';

  // Calculate spread
  const spread = bestFixed && bestVariable ? (bestFixed.rate - bestVariable.rate).toFixed(2) : '0.50';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Monthly Mortgage Rate Analysis</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Inter', sans-serif; background: #0f172a; overflow: hidden; }

    #root {
      width: 1920px; height: 1080px;
      position: relative;
      background: #0f172a;
      overflow: hidden;
    }

    .clip { position: absolute; inset: 0; }

    /* === SLIDE 1: HOOK (0-5s) === */
    .slide-hook {
      display: flex; flex-direction: column;
      align-items: center; justify-content: center;
      background: #0f172a;
      text-align: center;
    }
    .hook-month {
      font-size: 28px; font-weight: 700; color: #f59e0b;
      background: rgba(251,191,36,0.15); padding: 12px 32px;
      border-radius: 100px; border: 2px solid rgba(251,191,36,0.3);
      text-transform: uppercase; letter-spacing: 4px;
      margin-bottom: 32px;
    }
    .hook-headline {
      font-size: 80px; font-weight: 900; color: #fff;
      line-height: 1.1; letter-spacing: -0.02em;
      margin-bottom: 20px;
    }
    .hook-sub {
      font-size: 40px; font-weight: 400; color: #22d3ee;
    }
    .hook-trend {
      font-size: 56px; margin-top: 32px;
      color: ${prediction.color};
      font-weight: 800;
    }

    /* === SLIDE 2: RATES SNAPSHOT (5-20s) === */
    .slide-snapshot {
      display: flex; flex-direction: column;
      align-items: center; justify-content: center;
      background: #0f172a;
      padding: 60px;
    }
    .snap-title {
      font-size: 48px; font-weight: 800; color: #fff;
      margin-bottom: 40px;
    }
    .snap-grid {
      display: grid; grid-template-columns: repeat(3, 1fr);
      gap: 32px; width: 100%; max-width: 1500px;
    }
    .snap-card {
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 24px; padding: 40px;
      text-align: center;
    }
    .snap-card.best { border-color: rgba(245,158,11,0.3); }
    .snap-card.avg { border-color: rgba(37,99,235,0.3); }
    .snap-card.var { border-color: rgba(5,150,105,0.3); }
    .snap-label {
      font-size: 22px; font-weight: 700; color: #94a3b8;
      text-transform: uppercase; letter-spacing: 3px;
      margin-bottom: 16px;
    }
    .snap-value {
      font-size: 72px; font-weight: 900;
    }
    .snap-value.best { color: #fbbf24; }
    .snap-value.avg { color: #60a5fa; }
    .snap-value.var { color: #34d399; }
    .snap-detail {
      font-size: 24px; color: #94a3b8; margin-top: 12px;
    }

    /* === SLIDE 3: TREND ANALYSIS (20-40s) === */
    .slide-trend {
      display: flex; flex-direction: column;
      align-items: center; justify-content: center;
      background: #0f172a;
      padding: 60px;
    }
    .trend-title {
      font-size: 48px; font-weight: 800; color: #fff;
      margin-bottom: 40px;
    }
    .trend-cards {
      display: flex; gap: 40px; width: 100%;
      max-width: 1600px; justify-content: center;
    }
    .trend-card {
      flex: 1; background: rgba(255,255,255,0.04);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 24px; padding: 50px;
      text-align: center;
    }
    .trend-icon {
      font-size: 80px; margin-bottom: 20px;
    }
    .trend-headline {
      font-size: 36px; font-weight: 800; color: #fff;
      margin-bottom: 12px;
    }
    .trend-desc {
      font-size: 24px; color: #94a3b8; line-height: 1.5;
    }
    .trend-highlight {
      color: ${prediction.color}; font-weight: 700;
    }

    /* === SLIDE 4: PREDICTION (40-60s) === */
    .slide-prediction {
      display: flex; flex-direction: column;
      align-items: center; justify-content: center;
      background: #0f172a;
      padding: 60px;
      text-align: center;
    }
    .pred-title {
      font-size: 48px; font-weight: 800; color: #fff;
      margin-bottom: 40px;
    }
    .pred-box {
      background: rgba(255,255,255,0.04);
      border: 2px solid ${prediction.color}40;
      border-radius: 32px; padding: 60px 80px;
      max-width: 1200px;
    }
    .pred-icon {
      font-size: 96px; margin-bottom: 24px;
    }
    .pred-headline {
      font-size: 48px; font-weight: 900;
      color: ${prediction.color};
      margin-bottom: 16px;
    }
    .pred-sub {
      font-size: 28px; color: #94a3b8;
    }
    .pred-context {
      font-size: 22px; color: #64748b;
      margin-top: 32px;
      line-height: 1.6;
    }

    /* === SLIDE 5: CTA (60-75s) === */
    .slide-cta {
      display: flex; flex-direction: column;
      align-items: center; justify-content: center;
      background: #0f172a;
      text-align: center;
      padding: 60px;
    }
    .cta-headline {
      font-size: 64px; font-weight: 900; color: #fff;
      margin-bottom: 20px;
    }
    .cta-url {
      font-size: 52px; font-weight: 800; color: #f59e0b;
      letter-spacing: 2px;
    }
    .cta-sub {
      font-size: 28px; color: #94a3b8; margin-top: 16px;
    }
    .cta-btn {
      font-size: 32px; font-weight: 800; color: #fff;
      background: linear-gradient(135deg, #0891b2, #0e7490);
      padding: 24px 56px; border-radius: 100px;
      box-shadow: 0 8px 32px rgba(8,145,178,0.35);
      display: inline-block; margin-top: 36px;
    }
    .cta-note {
      font-size: 20px; color: #475569; margin-top: 24px;
    }

    /* Background accents */
    .bg-accent {
      position: absolute; border-radius: 50%;
      filter: blur(120px); opacity: 0.08;
      pointer-events: none;
    }
  </style>
</head>
<body>
  <div id="root" data-composition-id="monthly-deepdive" data-width="1920" data-height="1080">

    <div class="bg-accent clip" data-start="0" data-duration="75" data-track-index="0"
         style="width:700px;height:700px;background:#0891b2;top:-150px;left:-150px;"></div>
    <div class="bg-accent clip" data-start="0" data-duration="75" data-track-index="0"
         style="width:600px;height:600px;background:#059669;bottom:-150px;right:-150px;"></div>

    <!-- === HOOK (0-5s) === -->
    <div class="slide-hook clip" data-start="0" data-duration="5" data-track-index="10">
      <div class="hook-month" id="h-month">${monthName} Market Report</div>
      <div class="hook-headline" id="h-headline">Mortgage Rate<br>Market Analysis</div>
      <div class="hook-sub" id="h-sub">${trendText}</div>
      <div class="hook-trend" id="h-trend">${prediction.icon} ${prediction.text}</div>
    </div>

    <!-- === RATES SNAPSHOT (5-20s) === -->
    <div class="slide-snapshot clip" data-start="5" data-duration="15" data-track-index="10">
      <div class="snap-title" id="s-title">${monthName} Rate Snapshot</div>
      <div class="snap-grid">
        <div class="snap-card best" id="s-best">
          <div class="snap-label">Best 5Y Fixed</div>
          <div class="snap-value best">${bestFixed?.rate.toFixed(2) || '4.00'}%</div>
          <div class="snap-detail">${bestFixed?.lender_name || 'Top Lender'}</div>
        </div>
        <div class="snap-card avg" id="s-avg">
          <div class="snap-label">Average Fixed</div>
          <div class="snap-value avg">${avgFixed}%</div>
          <div class="snap-detail">Across ${lenderCount} lenders</div>
        </div>
        <div class="snap-card var" id="s-var">
          <div class="snap-label">Best Variable</div>
          <div class="snap-value var">${bestVariable?.rate.toFixed(2) || '4.50'}%</div>
          <div class="snap-detail">${trendText}</div>
        </div>
      </div>
    </div>

    <!-- === TREND ANALYSIS (20-40s) === -->
    <div class="slide-trend clip" data-start="20" data-duration="20" data-track-index="10">
      <div class="trend-title" id="t-title">What Drove Rates This Month</div>
      <div class="trend-cards">
        <div class="trend-card" id="t-1">
          <div class="trend-icon">🏦</div>
          <div class="trend-headline">Bank of Canada</div>
          <div class="trend-desc">Prime rate at <span class="trend-highlight">${bestVariable?.spread_to_prime ? (parseFloat(bestVariable.rate) + parseFloat(bestVariable.spread_to_prime)).toFixed(2) : '5.45'}%</span><br>Direct impact on variable rates</div>
        </div>
        <div class="trend-card" id="t-2">
          <div class="trend-icon">📊</div>
          <div class="trend-headline">Bond Yields</div>
          <div class="trend-desc">Government bond movements<br>drive fixed rate pricing</div>
        </div>
        <div class="trend-card" id="t-3">
          <div class="trend-icon">🏘️</div>
          <div class="trend-headline">Housing Market</div>
          <div class="trend-desc">Spring market activity<br>affects lender competition</div>
        </div>
      </div>
    </div>

    <!-- === PREDICTION (40-60s) === -->
    <div class="slide-prediction clip" data-start="40" data-duration="20" data-track-index="10">
      <div class="pred-title" id="p-title">Looking Ahead</div>
      <div class="pred-box" id="p-box">
        <div class="pred-icon">${prediction.icon}</div>
        <div class="pred-headline">${prediction.text}</div>
        <div class="pred-sub">${prediction.sub}</div>
        <div class="pred-context">
          Fixed-variable spread: ${spread}%<br>
          ${trend.direction === 'down' ? 'Fixed rates may continue to fall as bond yields soften.' : trend.direction === 'up' ? 'Monitor BoC announcements for rate direction.' : 'Watch for BoC policy changes that could shift the outlook.'}
        </div>
      </div>
    </div>

    <!-- === CTA (60-75s) === -->
    <div class="slide-cta clip" data-start="60" data-duration="15" data-track-index="10">
      <div class="cta-headline" id="c-headline">Compare All ${totalRates}+ Rates</div>
      <div class="cta-url" id="c-url">LatestMortgageRates.ca</div>
      <div class="cta-sub">Free rate alerts • Daily updates • No signup</div>
      <div class="cta-btn" id="c-btn">Get Your Best Rate →</div>
      <div class="cta-note">Updated ${dateStr}</div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/gsap@3/dist/gsap.min.js"></script>
    <script>
      const tl = gsap.timeline({ paused: true });

      // HOOK (0-5s)
      tl.from('#h-month', { y: -30, opacity: 0, duration: 0.5, ease: 'power3.out' }, 0);
      tl.from('#h-headline', { y: 50, opacity: 0, duration: 0.7, ease: 'power4.out' }, 0.3);
      tl.from('#h-sub', { y: 20, opacity: 0, duration: 0.4, ease: 'power2.out' }, 0.8);
      tl.from('#h-trend', { scale: 0.8, opacity: 0, duration: 0.6, ease: 'back.out(1.5)' }, 1.2);
      tl.to('.slide-hook', { opacity: 0, y: -20, duration: 0.4, ease: 'power2.in' }, 4.6);

      // SNAPSHOT (5-20s)
      tl.from('#s-title', { y: 30, opacity: 0, duration: 0.5, ease: 'power3.out' }, 5.1);
      tl.from('#s-best', { scale: 0.9, opacity: 0, y: 40, duration: 0.6, ease: 'back.out(1.2)' }, 5.4);
      tl.from('#s-avg', { scale: 0.9, opacity: 0, y: 40, duration: 0.6, ease: 'back.out(1.2)' }, 5.6);
      tl.from('#s-var', { scale: 0.9, opacity: 0, y: 40, duration: 0.6, ease: 'back.out(1.2)' }, 5.8);
      tl.to('.slide-snapshot', { opacity: 0, y: -20, duration: 0.4, ease: 'power2.in' }, 19.6);

      // TREND (20-40s)
      tl.from('#t-title', { y: 30, opacity: 0, duration: 0.5, ease: 'power3.out' }, 20.1);
      tl.from('#t-1', { y: 50, opacity: 0, duration: 0.5, ease: 'back.out(1.2)' }, 20.5);
      tl.from('#t-2', { y: 50, opacity: 0, duration: 0.5, ease: 'back.out(1.2)' }, 20.7);
      tl.from('#t-3', { y: 50, opacity: 0, duration: 0.5, ease: 'back.out(1.2)' }, 20.9);
      tl.to('.slide-trend', { opacity: 0, y: -20, duration: 0.4, ease: 'power2.in' }, 39.6);

      // PREDICTION (40-60s)
      tl.from('#p-title', { y: 30, opacity: 0, duration: 0.5, ease: 'power3.out' }, 40.1);
      tl.from('#p-box', { scale: 0.9, opacity: 0, y: 40, duration: 0.7, ease: 'back.out(1.2)' }, 40.4);
      tl.to('.slide-prediction', { opacity: 0, y: -20, duration: 0.4, ease: 'power2.in' }, 59.6);

      // CTA (60-75s)
      tl.from('#c-headline', { y: 40, opacity: 0, duration: 0.5, ease: 'power3.out' }, 60.1);
      tl.from('#c-url', { y: 30, opacity: 0, duration: 0.4, ease: 'power3.out' }, 60.4);
      tl.from('#c-btn', { scale: 0.85, opacity: 0, duration: 0.5, ease: 'back.out(1.8)' }, 61.0);

      window.__timelines = window.__timelines || {};
      window.__timelines['monthly-deepdive'] = tl;
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
  const analysis = analyzeRates(rates);

  console.log('📊 Monthly Analysis:');
  console.log('  Best 5Y Fixed:', analysis.bestFixed?.rate.toFixed(2) + '%');
  console.log('  Best Variable:', analysis.bestVariable?.rate.toFixed(2) + '%');
  console.log('  Avg Fixed:', analysis.avgFixed);
  console.log('  Lenders:', analysis.lenderCount);

  const html = generateHTML(analysis, historical);

  const outDir = path.join(OUTPUT_DIR, `monthly-deepdive-${new Date().toISOString().split('T')[0]}`);
  fs.mkdirSync(outDir, { recursive: true });

  const outPath = path.join(outDir, 'index.html');
  fs.writeFileSync(outPath, html, 'utf-8');

  console.log('\n✅ Generated:', outPath);
  console.log('\n📺 Next steps:');
  console.log(`  cd "${outDir}"`);
  console.log('  npx hyperframes preview');
  console.log('  npx hyperframes render --quality high --output monthly-deepdive.mp4');
}

main();
