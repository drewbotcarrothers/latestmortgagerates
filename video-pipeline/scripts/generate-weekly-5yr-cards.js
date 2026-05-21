// generate-weekly-5yr-cards.js
// Weekly YouTube video showing best 5-year rates from homepage cards
// Matches latestmortgagerates.ca branding: 2x2 card grid, top 3 lenders per category
// Landscape 1920x1080 for standard YouTube uploads

const fs = require('fs');
const path = require('path');

const RATES_PATH = path.join(__dirname, '..', '..', 'data', 'rates.json');
const OUTPUT_DIR = path.join(__dirname, '..', 'output');

function loadRates() {
  return JSON.parse(fs.readFileSync(RATES_PATH, 'utf-8'));
}

function getTop3(rates, termMonths, rateType, mortgageType) {
  return rates
    .filter(r => r.term_months === termMonths && r.rate_type === rateType && r.mortgage_type === mortgageType)
    .sort((a, b) => a.rate - b.rate)
    .slice(0, 3);
}

function getWeekRange() {
  const now = new Date();
  const day = now.getDay(); // 0 = Sunday
  const diff = now.getDate() - day + (day === 0 ? -6 : 1); // Adjust to Monday
  const monday = new Date(now.setDate(diff));
  const friday = new Date(monday);
  friday.setDate(monday.getDate() + 4);

  const fmt = (d) => d.toLocaleDateString('en-CA', { month: 'short', day: 'numeric' });
  return `${fmt(monday)} – ${fmt(friday)}, ${now.getFullYear()}`;
}

function getToday() {
  return new Date().toLocaleDateString('en-CA', { month: 'short', day: 'numeric', year: 'numeric' });
}

function generateHTML(rates) {
  const weekRange = getWeekRange();
  const today = getToday();

  // Get top 3 for each of the 4 homepage card categories
  const fixedInsured = getTop3(rates, 60, 'fixed', 'insured');
  const fixedUninsured = getTop3(rates, 60, 'fixed', 'uninsured');
  const variableInsured = getTop3(rates, 60, 'variable', 'insured');
  const variableUninsured = getTop3(rates, 60, 'variable', 'uninsured');

  const totalLenders = new Set(rates.map(r => r.lender_name)).size;

  function renderCard(id, title, subtitle, accentColor, dotColor, ratesList, tagline) {
    const rows = ratesList.map((r, i) => `
        <div class="card-row" id="${id}-row-${i}">
          <div class="card-rank ${i === 0 ? 'rank-gold' : i === 1 ? 'rank-silver' : 'rank-bronze'}">${i + 1}</div>
          <div class="card-lender">${r.lender_name}</div>
          <div class="card-rate">${r.rate.toFixed(2)}%</div>
        </div>`).join('');

    return `
    <div class="rate-card" id="${id}">
      <div class="card-header">
        <div class="card-title">
          <span class="card-dot" style="background:${dotColor}"></span>
          ${title}
        </div>
        <div class="card-subtitle">${subtitle}</div>
      </div>
      <div class="card-body">
        ${rows || '<div class="card-row"><div class="card-lender">No rates available</div></div>'}
      </div>
      <div class="card-footer">${tagline}</div>
    </div>`;
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Weekly Best 5-Year Mortgage Rates Canada</title>
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

    /* === SLIDE 1: TITLE CARD (0–3s) === */
    .slide-title {
      display: flex; flex-direction: column;
      align-items: center; justify-content: center;
      background: #0f172a;
      text-align: center;
    }
    .title-logo {
      font-size: 24px; font-weight: 800; color: #f59e0b;
      letter-spacing: 4px; text-transform: uppercase;
      margin-bottom: 24px;
    }
    .title-week {
      font-size: 22px; font-weight: 600; color: #94a3b8;
      background: rgba(255,255,255,0.06);
      padding: 10px 28px; border-radius: 100px;
      border: 1px solid rgba(255,255,255,0.08);
      margin-bottom: 32px;
    }
    .title-headline {
      font-size: 76px; font-weight: 900; color: #fff;
      line-height: 1.1; letter-spacing: -0.02em;
      margin-bottom: 16px;
    }
    .title-sub {
      font-size: 36px; font-weight: 400; color: #22d3ee;
    }
    .title-divider {
      width: 80px; height: 4px;
      background: linear-gradient(90deg, #0891b2, #22d3ee);
      border-radius: 2px; margin: 28px 0;
    }
    .title-meta {
      font-size: 20px; color: #64748b;
      margin-top: 16px;
    }

    /* === SLIDE 2: RATE CARDS (3–22s) === */
    .slide-cards {
      display: flex; flex-direction: column;
      align-items: center; justify-content: center;
      background: #0f172a;
      padding: 40px 80px;
    }
    .cards-header {
      text-align: center; margin-bottom: 32px;
    }
    .cards-title {
      font-size: 42px; font-weight: 800; color: #fff;
      letter-spacing: -0.02em;
    }
    .cards-subtitle {
      font-size: 22px; font-weight: 400; color: #94a3b8;
      margin-top: 6px;
    }
    .cards-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
      width: 100%;
      max-width: 1640px;
    }
    .rate-card {
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 20px;
      padding: 24px 28px;
      backdrop-filter: blur(10px);
    }
    .card-header {
      margin-bottom: 16px;
      padding-bottom: 14px;
      border-bottom: 1px solid rgba(255,255,255,0.06);
    }
    .card-title {
      font-size: 22px; font-weight: 700; color: #e2e8f0;
      display: flex; align-items: center; gap: 10px;
    }
    .card-dot {
      width: 10px; height: 10px; border-radius: 50%;
      display: inline-block;
    }
    .card-subtitle {
      font-size: 14px; font-weight: 500;
      margin-top: 6px; margin-left: 20px;
    }
    .card-body {
      display: flex; flex-direction: column;
      gap: 10px;
    }
    .card-row {
      display: flex; align-items: center; gap: 14px;
      padding: 10px 14px;
      background: rgba(255,255,255,0.03);
      border-radius: 10px;
      font-size: 20px;
    }
    .card-rank {
      width: 32px; height: 32px;
      border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-size: 14px; font-weight: 800;
      flex-shrink: 0;
    }
    .rank-gold { background: #f59e0b; color: #0f172a; }
    .rank-silver { background: #94a3b8; color: #0f172a; }
    .rank-bronze { background: #b45309; color: #fff; }
    .card-lender {
      flex: 1; font-weight: 600; color: #cbd5e1;
      white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    }
    .card-rate {
      font-size: 24px; font-weight: 900;
      flex-shrink: 0;
    }
    .card-footer {
      font-size: 14px; color: #475569;
      margin-top: 14px;
      padding-top: 10px;
      border-top: 1px solid rgba(255,255,255,0.06);
    }

    /* Accent colors for each card */
    #card-fi .card-rate { color: #34d399; }
    #card-fi .card-subtitle { color: #34d399; }
    #card-fu .card-rate { color: #22d3ee; }
    #card-fu .card-subtitle { color: #22d3ee; }
    #card-vi .card-rate { color: #34d399; }
    #card-vi .card-subtitle { color: #34d399; }
    #card-vu .card-rate { color: #22d3ee; }
    #card-vu .card-subtitle { color: #22d3ee; }

    /* === SLIDE 3: CTA (22–25s) === */
    .slide-cta {
      display: flex; flex-direction: column;
      align-items: center; justify-content: center;
      background: #0f172a;
      text-align: center;
      padding: 60px;
    }
    .cta-headline {
      font-size: 64px; font-weight: 900;
      color: #fff; letter-spacing: -0.02em;
      line-height: 1.1; margin-bottom: 16px;
    }
    .cta-url {
      font-size: 48px; font-weight: 800;
      color: #f59e0b; letter-spacing: 2px;
    }
    .cta-tagline {
      font-size: 26px; color: #94a3b8;
      margin-top: 16px;
    }
    .cta-btn {
      font-size: 30px; font-weight: 800;
      color: #fff;
      background: linear-gradient(135deg, #0891b2, #0e7490);
      padding: 20px 48px; border-radius: 100px;
      box-shadow: 0 8px 32px rgba(8,145,178,0.35);
      display: inline-block;
      margin-top: 32px;
    }
    .cta-note {
      font-size: 18px; color: #475569;
      margin-top: 24px;
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
  <div id="root" data-composition-id="weekly-5yr-cards" data-width="1920" data-height="1080">

    <!-- Background accents -->
    <div class="bg-accent clip" data-start="0" data-duration="25" data-track-index="0"
         style="width:600px;height:600px;background:#0891b2;top:-100px;left:-100px;"></div>
    <div class="bg-accent clip" data-start="0" data-duration="25" data-track-index="0"
         style="width:500px;height:500px;background:#059669;bottom:-100px;right:-100px;"></div>

    <!-- === SLIDE 1: TITLE CARD (0–3s) === -->
    <div class="slide-title clip" data-start="0" data-duration="3" data-track-index="10">
      <div class="title-logo" id="t-logo">LatestMortgageRates.ca</div>
      <div class="title-week" id="t-week">${weekRange}</div>
      <div class="title-headline" id="t-headline">Best 5-Year Mortgage Rates<br>This Week</div>
      <div class="title-divider" id="t-divider"></div>
      <div class="title-sub" id="t-sub">Top Lenders Ranked & Compared</div>
      <div class="title-meta" id="t-meta">Updated ${today} • ${totalLenders}+ Canadian Lenders</div>
    </div>

    <!-- === SLIDE 2: RATE CARDS (3–22s) === -->
    <div class="slide-cards clip" data-start="3" data-duration="19" data-track-index="10">
      <div class="cards-header" id="c-header">
        <div class="cards-title">Today's Best 5-Year Rates</div>
        <div class="cards-subtitle">Top 3 lenders in each category</div>
      </div>
      <div class="cards-grid" id="c-grid">
        ${renderCard('card-fi', '5-Year Fixed', 'Insured — Down Payment < 20%', '#059669', '#059669', fixedInsured, `${fixedInsured.length > 3 ? fixedInsured.length + ' lenders compared' : 'All lenders compared'}`)}
        ${renderCard('card-fu', '5-Year Fixed', 'Uninsured — Down Payment ≥ 20%', '#0891b2', '#0891b2', fixedUninsured, `${fixedUninsured.length > 3 ? fixedUninsured.length + ' lenders compared' : 'All lenders compared'}`)}
        ${renderCard('card-vi', '5-Year Variable', 'Insured — Down Payment < 20%', '#059669', '#059669', variableInsured, `${variableInsured.length > 3 ? variableInsured.length + ' lenders compared' : 'All lenders compared'}`)}
        ${renderCard('card-vu', '5-Year Variable', 'Uninsured — Down Payment ≥ 20%', '#0891b2', '#0891b2', variableUninsured, `${variableUninsured.length > 3 ? variableUninsured.length + ' lenders compared' : 'All lenders compared'}`)}
      </div>
    </div>

    <!-- === SLIDE 3: CTA (22–25s) === -->
    <div class="slide-cta clip" data-start="22" data-duration="3" data-track-index="10">
      <div class="cta-headline" id="cta-headline">Compare All Rates</div>
      <div class="cta-url" id="cta-url">LatestMortgageRates.ca</div>
      <div class="cta-tagline" id="cta-tagline">${totalLenders}+ Lenders • Updated Daily • 100% Free</div>
      <div class="cta-btn" id="cta-btn">Get Your Best Rate →</div>
      <div class="cta-note">No signup required</div>
    </div>

    <!-- GSAP Animations -->
    <script src="https://cdn.jsdelivr.net/npm/gsap@3/dist/gsap.min.js"></script>
    <script>
      const tl = gsap.timeline({ paused: true });

      // === TITLE CARD (0–3s) ===
      tl.from('#t-logo', { y: -30, opacity: 0, duration: 0.5, ease: 'power3.out' }, 0);
      tl.from('#t-week', { scale: 0.85, opacity: 0, duration: 0.5, ease: 'back.out(1.8)' }, 0.3);
      tl.from('#t-headline', { y: 40, opacity: 0, duration: 0.7, ease: 'power4.out' }, 0.5);
      tl.from('#t-divider', { scaleX: 0, opacity: 0, duration: 0.4, ease: 'power2.out' }, 0.9);
      tl.from('#t-sub', { y: 20, opacity: 0, duration: 0.4, ease: 'power2.out' }, 1.1);
      tl.from('#t-meta', { opacity: 0, duration: 0.3, ease: 'power2.out' }, 1.4);
      tl.to('.slide-title', { opacity: 0, y: -20, duration: 0.35, ease: 'power2.in' }, 2.65);

      // === RATE CARDS (3–22s) ===
      tl.from('#c-header', { y: 30, opacity: 0, duration: 0.5, ease: 'power3.out' }, 3.1);

      // Animate cards in staggered
      const cards = ['card-fi', 'card-fu', 'card-vi', 'card-vu'];
      cards.forEach((id, i) => {
        tl.from('#' + id, { y: 50, opacity: 0, scale: 0.95, duration: 0.6, ease: 'back.out(1.2)' }, 3.3 + i * 0.2);
      });

      // Animate rows within each card
      let rowDelay = 4.2;
      cards.forEach((cardId) => {
        for (let i = 0; i < 3; i++) {
          const row = document.getElementById(cardId + '-row-' + i);
          if (row) {
            tl.from(row, { x: -25, opacity: 0, duration: 0.3, ease: 'power3.out' }, rowDelay);
            rowDelay += 0.15;
          }
        }
      });

      tl.to('.slide-cards', { opacity: 0, y: -20, duration: 0.3, ease: 'power2.in' }, 21.7);

      // === CTA (22–25s) ===
      tl.from('#cta-headline', { y: 40, opacity: 0, duration: 0.5, ease: 'power3.out' }, 22.1);
      tl.from('#cta-url', { y: 30, opacity: 0, duration: 0.4, ease: 'power3.out' }, 22.4);
      tl.from('#cta-tagline', { y: 20, opacity: 0, duration: 0.35, ease: 'power2.out' }, 22.65);
      tl.from('#cta-btn', { scale: 0.85, opacity: 0, duration: 0.5, ease: 'back.out(1.8)' }, 22.9);

      window.__timelines = window.__timelines || {};
      window.__timelines['weekly-5yr-cards'] = tl;
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
  const html = generateHTML(rates);

  const dateStr = new Date().toISOString().split('T')[0];
  const outDir = path.join(OUTPUT_DIR, `weekly-5yr-cards-${dateStr}`);
  fs.mkdirSync(outDir, { recursive: true });

  const outPath = path.join(outDir, 'index.html');
  fs.writeFileSync(outPath, html, 'utf-8');

  console.log('✅ Generated:', outPath);
  console.log('\n📺 Next steps:');
  console.log(`  cd "${outDir}"`);
  console.log('  npx hyperframes preview');
  console.log('  npx hyperframes render --quality high --output weekly-5yr-cards.mp4');
  console.log('\n📤 Upload:');
  console.log(`  cd "${path.dirname(__dirname)}"`);
  console.log(`  node scripts/upload-youtube.js --video "${outDir}/weekly-5yr-cards.mp4" --type weekly`);
}

main();
