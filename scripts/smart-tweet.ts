import { TwitterApi } from 'twitter-api-v2';
import * as fs from 'fs';
import * as path from 'path';

interface RawRate {
  lender_name: string;
  rate: number;
  rate_type: string;
  term_months: number;
}

// Bank of Canada announcement dates for 2026
const BOC_DATES_2026 = [
  '2026-01-22',
  '2026-03-12', 
  '2026-04-16',
  '2026-06-04',
  '2026-07-16',
  '2026-09-03',
  '2026-10-22',
  '2026-12-10'
];

// Day of week determines which rate type to tweet
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
  
  if (!fs.existsSync(dataPath)) {
    console.error(`❌ Rates file not found at ${dataPath}`);
    process.exit(1);
  }
  
  const data = fs.readFileSync(dataPath, 'utf8');
  const parsed = JSON.parse(data);
  return Array.isArray(parsed) ? parsed : parsed.rates;
}

function loadPreviousData(): PreviousData | null {
  if (!fs.existsSync(PREVIOUS_DATA_FILE)) {
    return null;
  }
  
  try {
    const data = fs.readFileSync(PREVIOUS_DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch {
    return null;
  }
}

function saveCurrentData(data: PreviousData) {
  fs.writeFileSync(PREVIOUS_DATA_FILE, JSON.stringify(data, null, 2));
}

// Fetch Government of Canada 5-year bond yield
async function fetchBondYield(): Promise<number | null> {
  try {
    // The Bank of Canada publishes daily bond yields
    // V39050 = Government of Canada marketable bonds, 5 year
    const response = await fetch('https://www.bankofcanada.ca/valet/observations/V39050/json?recent=1');
    if (!response.ok) return null;
    
    const data = await response.json();
    if (data.observations && data.observations.length > 0) {
      const latest = data.observations[data.observations.length - 1];
      return parseFloat(latest.V39050.v);
    }
    return null;
  } catch (error) {
    console.log('⚠️ Could not fetch bond yield:', error);
    return null;
  }
}

function getBestRate(rates: RawRate[], rateType: string, termMonths: number): number | null {
  const filtered = rates.filter(r => 
    r.rate_type === rateType && r.term_months === termMonths
  );
  
  if (filtered.length === 0) return null;
  filtered.sort((a, b) => a.rate - b.rate);
  return filtered[0].rate;
}

function getTopLenders(rates: RawRate[], limit: number = 5): { name: string; rate: number }[] {
  const fixed5Year = rates.filter(r => r.rate_type === 'fixed' && r.term_months === 60);
  fixed5Year.sort((a, b) => a.rate - b.rate);
  
  return fixed5Year.slice(0, limit).map(r => ({
    name: r.lender_name,
    rate: r.rate
  }));
}

function isBankOfCanadaDay(): boolean {
  const today = new Date().toISOString().split('T')[0];
  return BOC_DATES_2026.includes(today);
}

function getNextBoCDate(): string | undefined {
  const today = new Date().toISOString().split('T')[0];
  return BOC_DATES_2026.find(d => d >= today);
}

function detectSignificantRateChanges(current: PreviousData, previous: PreviousData): { hasChange: boolean; changes: string[] } {
  const changes: string[] = [];
  const RATE_THRESHOLD = 0.20; // 20 basis points
  
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
  const BOND_THRESHOLD = 0.15; // 15 basis points is significant
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
  
  // Check for major lender rate drops
  current.topLenders.forEach(currentLender => {
    const previousLender = previous.topLenders.find(l => l.name === currentLender.name);
    
    if (previousLender && MAJOR_LENDERS.some(ml => currentLender.name.includes(ml))) {
      const drop = previousLender.rate - currentLender.rate;
      if (drop >= 0.10) { // 10+ basis point drop from big bank
        announcements.push(`${currentLender.name} cut rates ${drop.toFixed(2)}% → ${currentLender.rate.toFixed(2)}%`);
      }
    }
  });
  
  // Check for new best rate (lender jumped to #1)
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
      tweet += 'Key things to watch:\n';
      tweet += '→ Overnight rate decision\n';
      tweet += '→ Updated economic outlook\n';
      tweet += '→ Forward guidance\n\n';
      if (data.best5YearFixed) tweet += `Current best 5-year fixed: ${data.best5YearFixed.toFixed(2)}%\n`;
      if (data.best5YearVariable) tweet += `Current variable: ${data.best5YearVariable.toFixed(2)}%`;
      break;
      
    case 'rates':
      tweet = '🚨 BREAKING: Mortgage Rates on the Move\n\n';
      data.changes.forEach((change: string) => {
        tweet += `• ${change}\n`;
      });
      tweet += '\nBest rates now:\n';
      if (data.best5YearFixed) tweet += `🔒 Fixed: ${data.best5YearFixed.toFixed(2)}%\n`;
      if (data.best5YearVariable) tweet += `⚡ Variable: ${data.best5YearVariable.toFixed(2)}%`;
      break;
      
    case 'bonds':
      tweet = `📈 Bond Yields ${data.direction} ${data.amount}%\n\n`;
      tweet += 'Why this matters:\n';
      tweet += 'Gov bond yields → fixed mortgage rates\n';
      tweet += 'Expect fixed rates to follow soon\n\n';
      if (data.best5YearFixed) tweet += `Current best fixed: ${data.best5YearFixed.toFixed(2)}%`;
      break;
      
    case 'lenders':
      tweet = '🏦 Lender Rate Alert\n\n';
      if (data.announcements.length === 1) {
        tweet += `${data.announcements[0]}\n\n`;
      } else {
        tweet += 'Multiple lenders adjusting:\n';
        data.announcements.forEach((ann: string) => {
          tweet += `• ${ann}\n`;
        });
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
    const lenderShort = rate.lender_name.length > 15 
      ? rate.lender_name.substring(0, 12) + '...' 
      : rate.lender_name;
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
  
  return filtered.slice(0, limit).map(r => ({
    lender_name: r.lender_name || 'Unknown',
    rate: r.rate
  }));
}

async function postSmartTweet() {
  try {
    const apiKey = process.env.TWITTER_API_KEY;
    const apiSecret = process.env.TWITTER_API_SECRET;
    const accessToken = process.env.TWITTER_ACCESS_TOKEN;
    const accessSecret = process.env.TWITTER_ACCESS_SECRET;
    
    if (!apiKey || !apiSecret || !accessToken || !accessSecret) {
      console.error('❌ Missing Twitter credentials');
      process.exit(1);
    }

    const client = new TwitterApi({
      appKey: apiKey,
      appSecret: apiSecret,
      accessToken: accessToken,
      accessSecret: accessSecret,
    });

    const rates = loadRates();
    const previousData = loadPreviousData();
    const bondYield = await fetchBondYield();
    
    const currentData: PreviousData = {
      date: new Date().toISOString().split('T')[0],
      best5YearFixed: getBestRate(rates, 'fixed', 60) || 0,
      best5YearVariable: getBestRate(rates, 'variable', 60) || 0,
      primeRate: 4.95,
      bondYield5Year: bondYield || (previousData?.bondYield5Year || 2.8),
      topLenders: getTopLenders(rates)
    };
    
    let tweetText: string;
    let newsType: string = 'daily';
    
    // PRIORITY 1: Bank of Canada Day (highest priority)
    if (isBankOfCanadaDay()) {
      console.log('🏦 Today is Bank of Canada announcement day');
      tweetText = formatBreakingNews('boc', currentData);
      newsType = 'boc';
    }
    // PRIORITY 2: Lender announcements (major bank cuts, new best rate)
    else if (previousData && detectLenderAnnouncements(currentData, previousData).hasNews) {
      const { announcements } = detectLenderAnnouncements(currentData, previousData);
      console.log('🏦 Lender announcements detected:', announcements);
      tweetText = formatBreakingNews('lenders', { 
        announcements, 
        best5YearFixed: currentData.best5YearFixed 
      });
      newsType = 'lenders';
    }
    // PRIORITY 3: Bond yield moves (signals future fixed rate changes)
    else if (previousData && detectBondYieldMove(currentData.bondYield5Year, previousData.bondYield5Year).hasMove) {
      const bondMove = detectBondYieldMove(currentData.bondYield5Year, previousData.bondYield5Year);
      console.log('📈 Bond yield move detected:', bondMove);
      tweetText = formatBreakingNews('bonds', { 
        ...bondMove, 
        best5YearFixed: currentData.best5YearFixed 
      });
      newsType = 'bonds';
    }
    // PRIORITY 4: Significant rate changes
    else if (previousData && detectSignificantRateChanges(currentData, previousData).hasChange) {
      const { changes } = detectSignificantRateChanges(currentData, previousData);
      console.log('📈 Rate changes detected:', changes);
      tweetText = formatBreakingNews('rates', {
        changes,
        best5YearFixed: currentData.best5YearFixed,
        best5YearVariable: currentData.best5YearVariable
      });
      newsType = 'rates';
    }
    // PRIORITY 5: Regular daily rates
    else {
      const dayOfWeek = new Date().getDay();
      const { type: rateType, icon } = rateTypes[dayOfWeek];
      
      console.log(`📅 Regular daily post: ${rateType}`);
      const topRates = getTopRates(rates, rateType);
      
      if (topRates.length === 0) {
        console.error(`❌ No rates found for ${rateType}`);
        process.exit(1);
      }
      
      tweetText = formatDailyRates(topRates, rateType, icon);
      newsType = 'daily';
    }
    
    // Save data for tomorrow's comparison
    saveCurrentData(currentData);
    
    console.log(`\n📝 ${newsType.toUpperCase()} tweet (${tweetText.length} chars):`);
    console.log(tweetText);
    
    console.log(`\n🚀 Posting tweet...`);
    const tweet = await client.v2.tweet(tweetText);
    
    console.log(`\n✅ Tweet posted successfully!`);
    console.log(`🔗 Tweet ID: ${tweet.data.id}`);
    console.log(`🔗 Tweet URL: https://twitter.com/Mortgage_RateCA/status/${tweet.data.id}`);
    
    // Log what triggered the post
    console.log(`\n📊 Trigger: ${newsType}`);
    if (bondYield) console.log(`📊 Bond Yield: ${bondYield.toFixed(2)}%`);
    console.log(`📊 Best 5-Year Fixed: ${currentData.best5YearFixed.toFixed(2)}%`);
    
  } catch (error) {
    console.error('❌ Error posting tweet:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  postSmartTweet();
}

export { postSmartTweet, isBankOfCanadaDay, detectSignificantRateChanges, detectBondYieldMove, detectLenderAnnouncements };
