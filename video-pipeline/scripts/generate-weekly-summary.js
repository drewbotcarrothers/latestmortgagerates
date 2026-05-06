// generate-weekly-summary.js
// Professional weekly mortgage rate summary video
// Matches latestmortgagerates.ca branding: deep navy, teal accents, clean cards

const fs = require('fs');
const path = require('path');

const RATES_PATH = path.join(__dirname, '..', '..', 'data', 'rates.json');
const OUTPUT_DIR = path.join(__dirname, '..', 'output');

function loadRates() {
  return JSON.parse(fs.readFileSync(RATES_PATH, 'utf-8'));
}

function getBestRate(rates, termMonths, rateType, mortgageType = null) {
  let filtered = rates.filter(r => r.term_months === termMonths && r.rate_type === rateType);
  if (mortgageType) {
    filtered = filtered.filter(r => r.mortgage_type === mortgageType);
  }
  return filtered.sort((a, b) => a.rate - b.rate)[0] || null;
}

function getAllBestByTerm(rates, rateType, mortgageType = null) {
  const terms = [6, 12, 24, 36, 48, 60, 84, 120];
  return terms
    .map(term => ({
      term,
      best: getBestRate(rates, term, rateType, mortgageType)
    }))
    .filter(item => item.best !== null);
}

function formatTerm(months) {
  if (months === 6) return '6-Month';
  if (months === 12) return '1-Year';
  if (months === 24) return '2-Year';
  if (months === 36) return '3-Year';
  if (months === 48) return '4-Year';
  if (months === 60) return '5-Year';
  if (months === 84) return '7-Year';
  if (months === 120) return '10-Year';
  return `${months}M`;
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

function generateHTML(rates) {
  const weekRange = getWeekRange();
  const today = new Date().toLocaleDateString('en-CA', { month: 'short', day: 'numeric', year: 'numeric' });

  // Best rates by category
  const fixedInsuredByTerm = getAllBestByTerm(rates, 'fixed', 'insured');
  const fixedUninsuredByTerm = getAllBestByTerm(rates, 'fixed', 'uninsured');
  const varInsuredByTerm = getAllBestByTerm(rates, 'variable', 'insured');
  const varUninsuredByTerm = getAllBestByTerm(rates, 'variable', 'uninsured');

  // Headline best rates (5-year)
  const bestFixed5yInsured = getBestRate(rates, 60, 'fixed', 'insured');
  const bestFixed5yUninsured = getBestRate(rates, 60, 'fixed', 'uninsured');
  const bestVar5yInsured = getBestRate(rates, 60, 'variable', 'insured');
  const bestVar5yUninsured = getBestRate(rates, 60, 'variable', 'uninsured');

  const hasFixedInsured = fixedInsuredByTerm.length > 0;
  const hasFixedUninsured = fixedUninsuredByTerm.length > 0;
  const hasVarInsured = varInsuredByTerm.length > 0;
  const hasVarUninsured = varUninsuredByTerm.length > 0;

  function renderRateRow(item, i, totalRows) {
    const term = formatTerm(item.term);
    const isBest = i === 0;
    const isPopular = item.term === 60;
    let badge = '';
    if (isBest) badge = '<span class="badge badge-best">Lowest</span>';
    else if (isPopular) badge = '<span class="badge badge-popular">Popular</span>';
    
    return `
        <div class="table-row ${isBest || isPopular ? 'highlight' : ''}" id="row-${totalRows}">
          <div class="table-term">${term} ${badge}</div>
          <div class="table-rate">${item.best.rate.toFixed(2)}%</div>
          <div class="table-lender">${item.best.lender_name}</div>
        </div>`;
  }

  let fixedRows = '';
  let rowIndex = 0;
  
  if (hasFixedInsured) {
    fixedRows += `
        <div class="subsection-header" id="sub-fixed-insured">
          <span class="subsection-dot" style="background:#059669"></span>
          <span class="subsection-label">Insured <span class="subsection-hint">Down Payment &lt; 20%</span></span>
        </div>`;
    fixedRows += fixedInsuredByTerm.map((item, i) => renderRateRow(item, i, rowIndex++)).join('');
  }
  
  if (hasFixedUninsured) {
    fixedRows += `
        <div class="subsection-header" id="sub-fixed-uninsured">
          <span class="subsection-dot" style="background:#0891b2"></span>
          <span class="subsection-label">Uninsured <span class="subsection-hint">Down Payment ≥ 20%</span></span>
        </div>`;
    fixedRows += fixedUninsuredByTerm.map((item, i) => renderRateRow(item, i, rowIndex++)).join('');
  }

  let varRows = '';
  if (hasVarInsured) {
    varRows += `
        <div class="subsection-header" id="sub-var-insured">
          <span class="subsection-dot" style="background:#059669"></span>
          <span class="subsection-label">Insured <span class="subsection-hint">Down Payment &lt; 20%</span></span>
        </div>`;
    varRows += varInsuredByTerm.map((item, i) => renderRateRow(item, i, rowIndex++)).join('');
  }
  
  if (hasVarUninsured) {
    varRows += `
        <div class="subsection-header" id="sub-var-uninsured">
          <span class="subsection-dot" style="background:#0891b2"></span>
          <span class="subsection-label">Uninsured <span class="subsection-hint">Down Payment ≥ 20%</span></span>
        </div>`;
    varRows += varUninsuredByTerm.map((item, i) => renderRateRow(item, i, rowIndex++)).join('');
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Weekly Mortgage Rate Summary Canada</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Inter', sans-serif; background: #0f172a; overflow: hidden; }

    #root {
      width: 1080px; height: 1920px;
      position: relative;
      background: #0f172a;
      overflow: hidden;
    }

    /* ====== SHARED COMPONENTS ====== */
    .clip { position: absolute; inset: 0; }
    
    .slide-title {
      font-size: 48px; font-weight: 800; color: #0f172a;
      letter-spacing: -0.02em;
    }
    
    .slide-subtitle {
      font-size: 28px; font-weight: 500; color: #64748b;
      margin-top: 8px;
    }

    .badge {
      font-size: 18px; font-weight: 700;
      padding: 4px 12px; border-radius: 6px;
      display: inline-block;
    }
    .badge-best { background: #fef3c7; color: #92400e; }
    .badge-popular { background: #ecfdf5; color: #065f46; }

    /* ====== SLIDE 1: TITLE CARD (0–3s) ====== */
    .slide-titlecard {
      display: flex; flex-direction: column;
      align-items: center; justify-content: center;
      background: #0f172a;
      padding: 100px 80px;
      text-align: center;
    }
    .titlecard-logo {
      font-size: 28px; font-weight: 800; color: #f59e0b;
      letter-spacing: 3px; text-transform: uppercase;
      margin-bottom: 50px;
    }
    .titlecard-week {
      font-size: 26px; font-weight: 600; color: #94a3b8;
      background: rgba(255,255,255,0.06);
      padding: 14px 36px; border-radius: 100px;
      border: 1px solid rgba(255,255,255,0.08);
      margin-bottom: 40px;
    }
    .titlecard-headline {
      font-size: 86px; font-weight: 900; color: #fff;
      line-height: 1.05; letter-spacing: -0.03em;
      margin-bottom: 24px;
    }
    .titlecard-sub {
      font-size: 40px; font-weight: 400; color: #22d3ee;
      letter-spacing: -0.01em;
    }
    .titlecard-divider {
      width: 80px; height: 4px;
      background: linear-gradient(90deg, #0891b2, #22d3ee);
      border-radius: 2px; margin: 40px 0;
    }
    .titlecard-cta {
      font-size: 24px; font-weight: 500; color: #64748b;
    }

    /* ====== SLIDE 2: BEST RATES OVERVIEW (3–7s) ====== */
    .slide-overview {
      display: flex; flex-direction: column;
      align-items: center;
      background: #f8fafc;
      padding: 60px 50px;
    }
    .overview-header {
      text-align: center; margin-bottom: 40px;
    }
    .overview-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
      width: 100%;
    }
    .overview-card {
      background: #fff;
      border: 1px solid #e2e8f0;
      border-radius: 20px;
      padding: 32px 28px;
      text-align: center;
      box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.04);
    }
    .overview-card.accent {
      border-color: rgba(8,145,178,0.25);
      box-shadow: 0 4px 20px rgba(8,145,178,0.08);
    }
    .overview-type {
      font-size: 22px; font-weight: 700; color: #64748b;
      margin-bottom: 10px;
      display: flex; align-items: center; justify-content: center; gap: 8px;
    }
    .overview-type-dot {
      width: 10px; height: 10px; border-radius: 50%;
    }
    .overview-rate {
      font-size: 64px; font-weight: 900;
      color: #0f172a; line-height: 1;
      letter-spacing: -0.03em;
    }
    .overview-rate .num { color: #0891b2; }
    .overview-card.accent .overview-rate .num { color: #059669; }
    .overview-lender {
      font-size: 24px; font-weight: 500; color: #64748b;
      margin-top: 10px;
    }
    .overview-tag {
      font-size: 18px; font-weight: 600;
      color: #0891b2; background: rgba(8,145,178,0.08);
      padding: 6px 16px; border-radius: 100px;
      margin-top: 14px; display: inline-block;
    }
    .overview-card.accent .overview-tag {
      color: #059669; background: rgba(5,150,105,0.08);
    }

    /* ====== SLIDE 3: FIXED RATES BY TERM (7–12s) ====== */
    .slide-fixed {
      display: flex; flex-direction: column;
      align-items: center;
      background: #fff;
      padding: 50px 40px;
    }
    .section-header {
      display: flex; align-items: center; gap: 16px;
      margin-bottom: 30px;
      width: 100%;
    }
    .section-icon {
      width: 52px; height: 52px;
      background: linear-gradient(135deg, #0891b2, #0e7490);
      border-radius: 14px;
      display: flex; align-items: center; justify-content: center;
      font-size: 26px; color: #fff;
    }
    .rates-table {
      width: 100%;
      background: #f8fafc;
      border-radius: 16px;
      border: 1px solid #e2e8f0;
      overflow: hidden;
    }
    .table-header {
      display: grid;
      grid-template-columns: 1fr 1fr 1.5fr;
      background: #f1f5f9;
      padding: 18px 28px;
      font-size: 20px; font-weight: 700; color: #475569;
      text-transform: uppercase; letter-spacing: 1.5px;
    }
    .table-row {
      display: grid;
      grid-template-columns: 1fr 1fr 1.5fr;
      padding: 16px 28px;
      border-top: 1px solid #e2e8f0;
      font-size: 26px;
      background: #fff;
      transition: background 0.2s;
    }
    .table-row.highlight { background: rgba(8,145,178,0.04); }
    .table-term {
      font-weight: 700; color: #0f172a;
      display: flex; align-items: center; gap: 10px;
    }
    .table-rate {
      font-weight: 800; color: #0891b2;
      font-size: 30px;
    }
    .table-row.highlight .table-rate { color: #059669; }
    .table-lender {
      font-weight: 500; color: #64748b;
      font-size: 22px;
    }
    .subsection-header {
      display: flex; align-items: center; gap: 10px;
      padding: 12px 28px;
      background: #f1f5f9;
      border-top: 1px solid #e2e8f0;
      font-size: 20px; font-weight: 700; color: #475569;
    }
    .subsection-dot {
      width: 10px; height: 10px; border-radius: 50%;
    }
    .subsection-hint {
      font-weight: 400; color: #94a3b8;
      margin-left: 6px;
    }
    .table-footer {
      font-size: 20px; color: #94a3b8;
      margin-top: 16px; text-align: center;
    }

    /* ====== SLIDE 4: VARIABLE RATES BY TERM (12–16s) ====== */
    .slide-variable {
      display: flex; flex-direction: column;
      align-items: center;
      background: #f8fafc;
      padding: 50px 40px;
    }
    .slide-variable .section-icon {
      background: linear-gradient(135deg, #059669, #047857);
    }
    .slide-variable .table-rate { color: #059669; }
    .slide-variable .table-row.highlight { background: rgba(5,150,105,0.04); }
    .slide-variable .table-row.highlight .table-rate { color: #047857; }

    /* ====== SLIDE 5: CTA (16–18s) ====== */
    .slide-cta {
      display: flex; flex-direction: column;
      align-items: center; justify-content: center;
      background: #0f172a;
      text-align: center;
      padding: 100px 80px;
    }
    .cta-headline {
      font-size: 72px; font-weight: 900;
      color: #fff; letter-spacing: -0.03em;
      line-height: 1.1; margin-bottom: 20px;
    }
    .cta-domain {
      font-size: 56px; font-weight: 800;
      color: #f59e0b; letter-spacing: 2px;
      margin-bottom: 16px;
    }
    .cta-tagline {
      font-size: 32px; font-weight: 400;
      color: #94a3b8; margin-bottom: 50px;
    }
    .cta-btn {
      font-size: 36px; font-weight: 800;
      color: #fff;
      background: linear-gradient(135deg, #0891b2, #0e7490);
      padding: 24px 60px; border-radius: 100px;
      box-shadow: 0 8px 32px rgba(8,145,178,0.35);
      display: inline-block;
    }
    .cta-note {
      font-size: 24px; color: #475569;
      margin-top: 36px;
    }
  </style>
</head>
<body>
  <div id="root" data-composition-id="weekly-summary" data-width="1080" data-height="1920">

    <!-- ====== SLIDE 1: TITLE CARD (0–3s) ====== -->
    <div class="slide-titlecard clip" data-start="0" data-duration="3" data-track-index="10">
      <div class="titlecard-logo" id="tc-logo">LatestMortgageRates.ca</div>
      <div class="titlecard-week" id="tc-week">${weekRange}</div>
      <div class="titlecard-headline" id="tc-headline">This Week's Best<br>Mortgage Rates</div>
      <div class="titlecard-divider" id="tc-divider"></div>
      <div class="titlecard-sub" id="tc-sub">Canada-Wide Lender Comparison</div>
      <div class="titlecard-cta" id="tc-cta">Updated ${today}</div>
    </div>

    <!-- ====== SLIDE 2: BEST RATES OVERVIEW (3–7s) ====== -->
    <div class="slide-overview clip" data-start="3" data-duration="4" data-track-index="10">
      <div class="overview-header" id="ov-header">
        <div class="slide-title">Best Rates This Week</div>
        <div class="slide-subtitle">Top lenders for the most popular terms</div>
      </div>
      <div class="overview-grid" id="ov-grid">
        <div class="overview-card accent" id="ov-fi">
          <div class="overview-type">
            <span class="overview-type-dot" style="background:#059669"></span>
            5-Year Fixed — Insured
          </div>
          <div class="overview-rate"><span class="num">${bestFixed5yInsured?.rate.toFixed(2) || '--'}%</span></div>
          <div class="overview-lender">${bestFixed5yInsured?.lender_name || 'N/A'}</div>
          <div class="overview-tag">Down Payment &lt; 20%</div>
        </div>
        <div class="overview-card" id="ov-fu">
          <div class="overview-type">
            <span class="overview-type-dot" style="background:#0891b2"></span>
            5-Year Fixed — Uninsured
          </div>
          <div class="overview-rate"><span class="num">${bestFixed5yUninsured?.rate.toFixed(2) || '--'}%</span></div>
          <div class="overview-lender">${bestFixed5yUninsured?.lender_name || 'N/A'}</div>
          <div class="overview-tag">Down Payment ≥ 20%</div>
        </div>
        <div class="overview-card accent" id="ov-vi">
          <div class="overview-type">
            <span class="overview-type-dot" style="background:#059669"></span>
            5-Year Variable — Insured
          </div>
          <div class="overview-rate"><span class="num">${bestVar5yInsured?.rate.toFixed(2) || '--'}%</span></div>
          <div class="overview-lender">${bestVar5yInsured?.lender_name || 'N/A'}</div>
          <div class="overview-tag">Down Payment &lt; 20%</div>
        </div>
        <div class="overview-card" id="ov-vu">
          <div class="overview-type">
            <span class="overview-type-dot" style="background:#0891b2"></span>
            5-Year Variable — Uninsured
          </div>
          <div class="overview-rate"><span class="num">${bestVar5yUninsured?.rate.toFixed(2) || '--'}%</span></div>
          <div class="overview-lender">${bestVar5yUninsured?.lender_name || 'N/A'}</div>
          <div class="overview-tag">Down Payment ≥ 20%</div>
        </div>
      </div>
    </div>

    <!-- ====== SLIDE 3: FIXED RATES BY TERM (7–12s) ====== -->
    <div class="slide-fixed clip" data-start="7" data-duration="5" data-track-index="10">
      <div class="section-header" id="fx-header">
        <div class="section-icon">📊</div>
        <div>
          <div class="slide-title">Fixed Rates by Term</div>
          <div class="slide-subtitle">Sorted shortest to longest term</div>
        </div>
      </div>
      <div class="rates-table" id="fx-table">
        <div class="table-header">
          <div>Term</div>
          <div>Rate</div>
          <div>Lender</div>
        </div>
        ${fixedRows}
      </div>
      <div class="table-footer">Sorted by term length • Data from ${rates.length}+ lenders</div>
    </div>

    <!-- ====== SLIDE 4: VARIABLE RATES BY TERM (12–16s) ====== -->
    <div class="slide-variable clip" data-start="12" data-duration="4" data-track-index="10">
      <div class="section-header" id="vr-header">
        <div class="section-icon">📈</div>
        <div>
          <div class="slide-title">Variable Rates by Term</div>
          <div class="slide-subtitle">Prime-based rates, sorted by term</div>
        </div>
      </div>
      <div class="rates-table" id="vr-table">
        <div class="table-header">
          <div>Term</div>
          <div>Rate</div>
          <div>Lender</div>
        </div>
        ${varRows}
      </div>
      <div class="table-footer">Prime Rate: 5.45% • Data from ${rates.length}+ lenders</div>
    </div>

    <!-- ====== SLIDE 5: CTA (16–18s) ====== -->
    <div class="slide-cta clip" data-start="16" data-duration="2" data-track-index="10">
      <div class="cta-headline" id="cta-headline">Compare & Save</div>
      <div class="cta-domain" id="cta-domain">LatestMortgageRates.ca</div>
      <div class="cta-tagline" id="cta-tagline">34+ Canadian Lenders • Updated Daily</div>
      <div class="cta-btn" id="cta-btn">Get Your Best Rate →</div>
      <div class="cta-note">Free. No signup required.</div>
    </div>

    <!-- GSAP Animations -->
    <script src="https://cdn.jsdelivr.net/npm/gsap@3/dist/gsap.min.js"></script>
    <script>
      const tl = gsap.timeline({ paused: true });

      // === SLIDE 1: Title Card (0–3s) ===
      tl.from('#tc-logo', { y: -30, opacity: 0, duration: 0.5, ease: 'power3.out' }, 0);
      tl.from('#tc-week', { scale: 0.85, opacity: 0, duration: 0.5, ease: 'back.out(1.8)' }, 0.3);
      tl.from('#tc-headline', { y: 50, opacity: 0, duration: 0.7, ease: 'power4.out' }, 0.5);
      tl.from('#tc-divider', { scaleX: 0, opacity: 0, duration: 0.4, ease: 'power2.out' }, 0.9);
      tl.from('#tc-sub', { y: 20, opacity: 0, duration: 0.4, ease: 'power2.out' }, 1.1);
      tl.from('#tc-cta', { opacity: 0, duration: 0.3, ease: 'power2.out' }, 1.4);
      tl.to('.slide-titlecard', { opacity: 0, y: -20, duration: 0.35, ease: 'power2.in' }, 2.65);

      // === SLIDE 2: Overview (3–7s) ===
      tl.from('#ov-header', { y: 30, opacity: 0, duration: 0.5, ease: 'power3.out' }, 3.1);
      tl.from('#ov-fi', { y: 40, opacity: 0, duration: 0.55, ease: 'power3.out' }, 3.4);
      tl.from('#ov-fu', { y: 40, opacity: 0, duration: 0.55, ease: 'power3.out' }, 3.55);
      tl.from('#ov-vi', { y: 40, opacity: 0, duration: 0.55, ease: 'power3.out' }, 3.7);
      tl.from('#ov-vu', { y: 40, opacity: 0, duration: 0.55, ease: 'power3.out' }, 3.85);
      tl.to('.slide-overview', { opacity: 0, y: -20, duration: 0.3, ease: 'power2.in' }, 6.7);

      // === SLIDE 3: Fixed Rates (7–12s) ===
      tl.from('#fx-header', { x: -30, opacity: 0, duration: 0.4, ease: 'power3.out' }, 7.1);
      tl.from('#fx-table', { y: 40, opacity: 0, duration: 0.5, ease: 'power3.out' }, 7.3);
      ${(() => {
        let anims = '';
        let delay = 7.5;
        for (let i = 0; i < rowIndex; i++) {
          anims += `tl.from('#row-${i}', { x: -25, opacity: 0, duration: 0.3, ease: 'power3.out' }, ${delay.toFixed(2)});\n      `;
          delay += 0.18;
        }
        return anims;
      })()}
      tl.to('.slide-fixed', { opacity: 0, duration: 0.3, ease: 'power2.in' }, 11.7);

      // === SLIDE 4: Variable Rates (12–16s) ===
      tl.from('#vr-header', { x: -30, opacity: 0, duration: 0.4, ease: 'power3.out' }, 12.1);
      tl.from('#vr-table', { y: 40, opacity: 0, duration: 0.5, ease: 'power3.out' }, 12.3);
      tl.to('.slide-variable', { opacity: 0, duration: 0.3, ease: 'power2.in' }, 15.7);

      // === SLIDE 5: CTA (16–18s) ===
      tl.from('#cta-headline', { y: 40, opacity: 0, duration: 0.5, ease: 'power3.out' }, 16.1);
      tl.from('#cta-domain', { y: 30, opacity: 0, duration: 0.4, ease: 'power3.out' }, 16.4);
      tl.from('#cta-tagline', { y: 20, opacity: 0, duration: 0.35, ease: 'power2.out' }, 16.65);
      tl.from('#cta-btn', { scale: 0.85, opacity: 0, duration: 0.5, ease: 'back.out(1.8)' }, 16.85);

      window.__timelines = window.__timelines || {};
      window.__timelines['weekly-summary'] = tl;
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
  const html = generateHTML(rates);

  const outDir = path.join(OUTPUT_DIR, `weekly-summary-${new Date().toISOString().split('T')[0]}`);
  fs.mkdirSync(outDir, { recursive: true });

  const outPath = path.join(outDir, 'index.html');
  fs.writeFileSync(outPath, html, 'utf-8');

  console.log('✅ Generated:', outPath);
  console.log('\n📺 Render:');
  console.log(`  cd "${outDir}"`);
  console.log('  npx hyperframes render --quality high --output video.mp4');
}

main();
