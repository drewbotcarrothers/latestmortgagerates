import * as fs from 'fs';
import * as path from 'path';

interface RawRate {
  lender_name: string;
  rate: number;
  rate_type: string;
  term_months: number;
}

const BOC_DATES_2026 = [
  '2026-01-22', '2026-03-12', '2026-04-16', '2026-06-04',
  '2026-07-16', '2026-09-03', '2026-10-22', '2026-12-10'
];

const rateTypes = [
  { type: '5-Year Fixed', icon: '📌' },      // Sunday
  { type: '5-Year Variable', icon: '⚡' },   // Monday
  { type: '3-Year Fixed', icon: '🏠' },     // Tuesday
  { type: '4-Year Fixed', icon: '⏱️' },      // Wednesday
  { type: '10-Year Fixed', icon: '🛡️' },     // Thursday
  { type: '3-Year Variable', icon: '📊' },   // Friday
  { type: '2-Year Fixed', icon: '🎯' },       // Saturday
];

const PREVIOUS_DATA_FILE = path.join(__dirname, '..', 'data', 'twitter-previous-data.json');

interface PreviousData {
  date: string;
  best5YearFixed: number;
  best5YearVariable: number;
  primeRate: number;
  bondYield5Year: number;
  topLenders: { name: string; rate: number }[];
}

function loadRates(): RawRate[] {
  const dataPath = path.join(__dirname, '..', 'data', 'rates.json');
  const data = fs.readFileSync(dataPath, 'utf8');
  const parsed = JSON.parse(data);
  return Array.isArray(parsed) ? parsed : parsed.rates;
}

function loadPreviousData(): PreviousData | null {
  if (!fs.existsSync(PREVIOUS_DATA_FILE)) return null;
  try {
    return JSON.parse(fs.readFileSync(PREVIOUS_DATA_FILE, 'utf8'));
  } catch { return null; }
}

function getBestRate(rates: RawRate[], rateType: string, termMonths: number): number | null {
  const filtered = rates.filter(r => r.rate_type === rateType && r.term_months === termMonths);
  if (filtered.length === 0) return null;
  filtered.sort((a, b) => a.rate - b.rate);
  return filtered[0].rate;
}

function getTopLenders(rates: RawRate[], limit: number = 5): { name: string; rate: number }[] {
  const fixed5Year = rates.filter(r => r.rate_type === 'fixed' && r.term_months === 60);
  fixed5Year.sort((a, b) => a.rate - b.rate);
  return fixed5Year.slice(0, limit).map(r => ({ name: r.lender_name, rate: r.rate }));
}

function isBankOfCanadaDay(): boolean {
  const today = new Date().toISOString().split('T')[0];
  return BOC_DATES_2026.includes(today);
}

function detectSignificantRateChanges(current: PreviousData, previous: PreviousData): { hasChange: boolean; changes: string[] } {
  const changes: string[] = [];
  const RATE_THRESHOLD = 0.20;
  
  if (Math.abs(current.best5YearFixed - previous.best5YearFixed) >= RATE_THRESHOLD) {
    const direction = current.best5YearFixed < previous.best5YearFixed ? 'dropped' : 'risen';
    const diff = Math.abs(current.best5YearFixed - previous.best5YearFixed).toFixed(2);
    changes.push(`5-Year Fixed ${direction} ${diff}%`);
  }
  
  if (Math.abs(current.best5YearVariable - previous.best5YearVariable) >= RATE_THRESHOLD) {
    const direction = current.best5YearVariable < previous.best5YearVariable ? 'dropped' : 'risen';
    const diff = Math.abs(current.best5YearVariable - previous.best5YearVariable).toFixed(2);
    changes.push(`5-Year Variable ${direction} ${diff}%`);
  }
  
  return { hasChange: changes.length > 0, changes };
}

function detectBondYieldMove(current: number, previous: number): { hasMove: boolean; direction: string; amount: string } {
  const BOND_THRESHOLD = 0.15;
  const diff = current - previous;
  
  if (Math.abs(diff) >= BOND_THRESHOLD) {
    return {
      hasMove: true,
      direction: diff > 0 ? 'surged' : 'dropped',
      amount: Math.abs(diff).toFixed(2)
    };
  }
  return { hasMove: false, direction: '', amount: '' };
}

function detectLenderAnnouncements(current: PreviousData, previous: PreviousData): { hasNews: boolean; announcements: string[] } {
  const announcements: string[] = [];
  const MAJOR_LENDERS = ['RBC', 'TD', 'Scotiabank', 'BMO', 'CIBC', 'National Bank', 'HSBC', 'Desjardins'];
  
  current.topLenders.forEach(currentLender => {
    const previousLender = previous.topLenders.find(l => l.name === currentLender.name);
    if (previousLender && MAJOR_LENDERS.some(ml => currentLender.name.includes(ml))) {
      const drop = previousLender.rate - currentLender.rate;
      if (drop >= 0.10) {
        announcements.push(`${currentLender.name} cut rates ${drop.toFixed(2)}% → ${currentLender.rate.toFixed(2)}%`);
      }
    }
  });
  
  if (current.topLenders.length > 0 && previous.topLenders.length > 0) {
    const currentBest = current.topLenders[0];
    const previousBest = previous.topLenders[0];
    if (currentBest.name !== previousBest.name && currentBest.rate < previousBest.rate - 0.05) {
      announcements.push(`${currentBest.name} now has lowest 5-year fixed at ${currentBest.rate.toFixed(2)}%`);
    }
  }
  
  return { hasNews: announcements.length > 0, announcements };
}

function formatBreakingNews(type: 'boc' | 'rates' | 'bonds' | 'lenders', data: any): string {
  let tweet = '';
  switch (type) {
    case 'boc':
      tweet = '🏦 BREAKING: Bank of Canada Decision Day\n\n';
      tweet += 'Key things to watch:\n→ Overnight rate decision\n→ Updated economic outlook\n→ Forward guidance\n\n';
      if (data.best5YearFixed) tweet += `Current best 5-year fixed: ${data.best5YearFixed.toFixed(2)}%\n`;
      if (data.best5YearVariable) tweet += `Current variable: ${data.best5YearVariable.toFixed(2)}%`;
      break;
    case 'rates':
      tweet = '🚨 BREAKING: Mortgage Rates on the Move\n\n';
      data.changes.forEach((change: string) => { tweet += `• ${change}\n`; });
      tweet += '\nBest rates now:\n';
      if (data.best5YearFixed) tweet += `🔒 Fixed: ${data.best5YearFixed.toFixed(2)}%\n`;
      if (data.best5YearVariable) tweet += `⚡ Variable: ${data.best5YearVariable.toFixed(2)}%`;
      break;
    case 'bonds':
      tweet = `📈 Bond Yields ${data.direction} ${data.amount}%\n\n`;
      tweet += 'Why this matters:\nGov bond yields → fixed mortgage rates\nExpect fixed rates to follow soon\n\n';
      if (data.best5YearFixed) tweet += `Current best fixed: ${data.best5YearFixed.toFixed(2)}%`;
      break;
    case 'lenders':
      tweet = '🏦 Lender Rate Alert\n\n';
      if (data.announcements.length === 1) {
        tweet += `${data.announcements[0]}\n\n`;
      } else {
        tweet += 'Multiple lenders adjusting:\n';
        data.announcements.forEach((ann: string) => { tweet += `• ${ann}\n`; });
        tweet += '\n';
      }
      if (data.best5YearFixed) tweet += `Best rate now: ${data.best5YearFixed.toFixed(2)}%`;
      break;
  }
  return tweet;
}

function formatDailyRates(topRates: { lender_name: string; rate: number }[], rateType: string, icon: string): string {
  const rankingEmojis = ['🥇', '🥈', '🥉', '4️⃣'];
  let tweet = `${icon} Best Canadian ${rateType} Mortgage Rates\n\n`;
  
  for (let i = 0; i < topRates.length; i++) {
    const rate = topRates[i];
    const emoji = rankingEmojis[i] || '•';
    const lenderShort = rate.lender_name.length > 15 ? rate.lender_name.substring(0, 12) + '...' : rate.lender_name;
    tweet += `${emoji} ${lenderShort}: ${rate.rate.toFixed(2)}%\n`;
  }
  
  return tweet;
}

function getTopRates(rates: RawRate[], rateType: string, limit: number = 4) {
  let filtered = rates.filter(r => {
    if (rateType === '5-Year Fixed') return r.rate_type === 'fixed' && r.term_months === 60;
    if (rateType === '5-Year Variable') return r.rate_type === 'variable' && r.term_months === 60;
    if (rateType === '3-Year Fixed') return r.rate_type === 'fixed' && r.term_months === 36;
    if (rateType === '3-Year Variable') return r.rate_type === 'variable' && r.term_months === 36;
    if (rateType === '2-Year Fixed') return r.rate_type === 'fixed' && r.term_months === 24;
    if (rateType === '4-Year Fixed') return r.rate_type === 'fixed' && r.term_months === 48;
    if (rateType === '10-Year Fixed') return r.rate_type === 'fixed' && r.term_months === 120;
    return false;
  });
  filtered.sort((a, b) => a.rate - b.rate);
  return filtered.slice(0, limit).map(r => ({ lender_name: r.lender_name || 'Unknown', rate: r.rate }));
}

async function dryRunTweet() {
  console.log('🔍 X.COM POST DRY RUN\n' + '='.repeat(50));
  
  const rates = loadRates();
  const previousData = loadPreviousData();
  
  console.log(`📊 Loaded ${rates.length} rates`);
  console.log(`📊 Previous data: ${previousData ? 'YES (' + previousData.date + ')' : 'NO - first run'}`);
  
  const currentData: PreviousData = {
    date: new Date().toISOString().split('T')[0],
    best5YearFixed: getBestRate(rates, 'fixed', 60) || 0,
    best5YearVariable: getBestRate(rates, 'variable', 60) || 0,
    primeRate: 4.95,
    bondYield5Year: 2.8,
    topLenders: getTopLenders(rates)
  };
  
  console.log(`\n📊 Current best 5Y Fixed: ${currentData.best5YearFixed.toFixed(2)}%`);
  console.log(`📊 Current best 5Y Variable: ${currentData.best5YearVariable.toFixed(2)}%`);
  if (previousData) {
    console.log(`📊 Previous best 5Y Fixed: ${previousData.best5YearFixed.toFixed(2)}%`);
  }
  
  // Check triggers
  const isBoC = isBankOfCanadaDay();
  const lenderNews = previousData ? detectLenderAnnouncements(currentData, previousData) : { hasNews: false, announcements: [] };
  const bondMove = previousData ? detectBondYieldMove(currentData.bondYield5Year, previousData.bondYield5Year) : { hasMove: false };
  const rateChanges = previousData ? detectSignificantRateChanges(currentData, previousData) : { hasChange: false, changes: [] };
  
  console.log('\n🔍 PRIORITY CHECKS:');
  console.log(`   1. Bank of Canada Day? ${isBoC ? '✅ YES (Apr 16)' : '❌ No'}`);
  console.log(`   2. Lender announcements? ${lenderNews.hasNews ? '✅ YES' : '❌ No'}`);
  if (lenderNews.hasNews) console.log(`      → ${lenderNews.announcements.join(', ')}`);
  console.log(`   3. Bond yield moves? ${bondMove.hasMove ? '✅ YES' : '❌ No'}`);
  console.log(`   4. Significant rate changes? ${rateChanges.hasChange ? '✅ YES' : '❌ No'}`);
  
  let tweetText: string;
  let newsType: string;
  
  if (isBoC) {
    console.log('\n🏆 TRIGGER: Bank of Canada Day (Priority 1)');
    tweetText = formatBreakingNews('boc', currentData);
    newsType = 'boc';
  } else if (lenderNews.hasNews) {
    console.log('\n🏆 TRIGGER: Lender announcements (Priority 2)');
    tweetText = formatBreakingNews('lenders', { announcements: lenderNews.announcements, best5YearFixed: currentData.best5YearFixed });
    newsType = 'lenders';
  } else if (bondMove.hasMove) {
    console.log('\n🏆 TRIGGER: Bond yield move (Priority 3)');
    tweetText = formatBreakingNews('bonds', { ...bondMove, best5YearFixed: currentData.best5YearFixed });
    newsType = 'bonds';
  } else if (rateChanges.hasChange) {
    console.log('\n🏆 TRIGGER: Rate changes (Priority 4)');
    tweetText = formatBreakingNews('rates', { changes: rateChanges.changes, best5YearFixed: currentData.best5YearFixed, best5YearVariable: currentData.best5YearVariable });
    newsType = 'rates';
  } else {
    console.log('\n🏆 TRIGGER: Regular daily rates (Priority 5)');
    const dayOfWeek = new Date().getDay();
    const { type: rateType, icon } = rateTypes[dayOfWeek];
    const topRates = getTopRates(rates, rateType);
    tweetText = formatDailyRates(topRates, rateType, icon);
    newsType = 'daily';
  }
  
  console.log('\n' + '='.repeat(50));
  console.log(`📤 WOULD POST (${tweetText.length} chars):`);
  console.log(tweetText);
  console.log('='.repeat(50));
  console.log(`\n✅ Post type: ${newsType.toUpperCase()}`);
  console.log(`⏰ Scheduled: Daily at 9 AM EST`);
  console.log(`📅 Next BoC day: April 16, 2026`);
  console.log('\n💡 To actually post: Set Twitter secrets and run without DRY_RUN');
}

dryRunTweet();
