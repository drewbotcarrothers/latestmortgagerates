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
// Typically 8 announcements per year on specific Wednesdays
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

const PREVIOUS_RATES_FILE = path.join(__dirname, '..', 'data', 'previous-rates.json');

interface PreviousRates {
  date: string;
  best5YearFixed: number;
  best5YearVariable: number;
  primeRate: number;
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

function loadPreviousRates(): PreviousRates | null {
  if (!fs.existsSync(PREVIOUS_RATES_FILE)) {
    return null;
  }
  
  try {
    const data = fs.readFileSync(PREVIOUS_RATES_FILE, 'utf8');
    return JSON.parse(data);
  } catch {
    return null;
  }
}

function saveCurrentRates(rates: { best5YearFixed: number; best5YearVariable: number; primeRate: number }) {
  const data: PreviousRates = {
    date: new Date().toISOString().split('T')[0],
    ...rates
  };
  fs.writeFileSync(PREVIOUS_RATES_FILE, JSON.stringify(data, null, 2));
}

function getBestRate(rates: RawRate[], rateType: string, termMonths: number): number | null {
  const filtered = rates.filter(r => 
    r.rate_type === rateType && r.term_months === termMonths
  );
  
  if (filtered.length === 0) return null;
  filtered.sort((a, b) => a.rate - b.rate);
  return filtered[0].rate;
}

function isBankOfCanadaDay(): { isBoC: boolean; nextDate?: string } {
  const today = new Date().toISOString().split('T')[0];
  const isBoC = BOC_DATES_2026.includes(today);
  
  // Find next BoC date
  const nextDate = BOC_DATES_2026.find(d => d >= today);
  
  return { isBoC, nextDate };
}

function detectSignificantChanges(current: PreviousRates, previous: PreviousRates): { hasChange: boolean; changes: string[] } {
  const changes: string[] = [];
  const THRESHOLD = 0.20; // 20 basis points = significant
  
  if (Math.abs(current.best5YearFixed - previous.best5YearFixed) >= THRESHOLD) {
    const direction = current.best5YearFixed < previous.best5YearFixed ? 'dropped' : 'risen';
    changes.push(`5-Year Fixed ${direction} ${Math.abs(current.best5YearFixed - previous.best5YearFixed).toFixed(2)}%`);
  }
  
  if (Math.abs(current.best5YearVariable - previous.best5YearVariable) >= THRESHOLD) {
    const direction = current.best5YearVariable < previous.best5YearVariable ? 'dropped' : 'risen';
    changes.push(`5-Year Variable ${direction} ${Math.abs(current.best5YearVariable - previous.best5YearVariable).toFixed(2)}%`);
  }
  
  return { hasChange: changes.length > 0, changes };
}

function formatBreakingNews(changes: string[], best5YearFixed: number | null, best5YearVariable: number | null): string {
  let tweet = '🚨 BREAKING: Mortgage Rates on the Move\n\n';
  
  changes.forEach(change => {
    tweet += `• ${change}\n`;
  });
  
  tweet += '\nCurrent best rates:\n';
  if (best5YearFixed) tweet += `🔒 Fixed: ${best5YearFixed.toFixed(2)}%\n`;
  if (best5YearVariable) tweet += `⚡ Variable: ${best5YearVariable.toFixed(2)}%\n`;
  
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
    const previousRates = loadPreviousRates();
    const bocInfo = isBankOfCanadaDay();
    
    const currentRates = {
      best5YearFixed: getBestRate(rates, 'fixed', 60) || 0,
      best5YearVariable: getBestRate(rates, 'variable', 60) || 0,
      primeRate: 4.95 // This would come from data in real implementation
    };
    
    let tweetText: string;
    let isBreakingNews = false;
    
    // PRIORITY 1: Bank of Canada Day
    if (bocInfo.isBoC) {
      console.log('🏦 Today is Bank of Canada announcement day');
      tweetText = `🏦 BREAKING: Bank of Canada Decision Day\n\n`;
      tweetText += `Watch for:\n`;
      tweetText += `→ Rate hold or cut announcement\n`;
      tweetText += `→ Updated economic forecasts\n`;
      tweetText += `→ Forward guidance on future moves\n\n`;
      tweetText += `Current best rates:\n`;
      if (currentRates.best5YearFixed) tweetText += `🔒 Fixed: ${currentRates.best5YearFixed.toFixed(2)}%\n`;
      if (currentRates.best5YearVariable) tweetText += `⚡ Variable: ${currentRates.best5YearVariable.toFixed(2)}%`;
      isBreakingNews = true;
    }
    // PRIORITY 2: Significant rate changes (0.20%+ move)
    else if (previousRates && detectSignificantChanges(currentRates as PreviousRates, previousRates).hasChange) {
      const { changes } = detectSignificantChanges(currentRates as PreviousRates, previousRates);
      console.log('📈 Significant rate changes detected:', changes);
      tweetText = formatBreakingNews(
        changes, 
        currentRates.best5YearFixed, 
        currentRates.best5YearVariable
      );
      isBreakingNews = true;
    }
    // PRIORITY 3: Regular daily rates
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
      isBreakingNews = false;
    }
    
    // Save rates for tomorrow's comparison
    saveCurrentRates(currentRates);
    
    console.log(`\n📝 ${isBreakingNews ? 'BREAKING NEWS' : 'Daily'} tweet (${tweetText.length} chars):`);
    console.log(tweetText);
    
    console.log(`\n🚀 Posting tweet...`);
    const tweet = await client.v2.tweet(tweetText);
    
    console.log(`\n✅ Tweet posted successfully!`);
    console.log(`🔗 Tweet ID: ${tweet.data.id}`);
    console.log(`🔗 Tweet URL: https://twitter.com/Mortgage_RateCA/status/${tweet.data.id}`);
    
  } catch (error) {
    console.error('❌ Error posting tweet:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  postSmartTweet();
}

export { postSmartTweet, isBankOfCanadaDay, detectSignificantChanges };
