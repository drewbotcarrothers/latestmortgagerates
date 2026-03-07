import { TwitterApi } from 'twitter-api-v2';
import * as fs from 'fs';
import * as path from 'path';

// Day of week determines which rate type to tweet
// 0=Sunday, 1=Monday, etc.
const rateTypes = [
  { type: '5-Year Fixed', icon: '📌' },      // Sunday
  { type: '5-Year Variable', icon: '⚡' },   // Monday
  { type: '3-Year Fixed', icon: '🏠' },     // Tuesday
  { type: '4-Year Fixed', icon: '⏱️' },      // Wednesday
  { type: '10-Year Fixed', icon: '🛡️' },     // Thursday
  { type: '3-Year Variable', icon: '📊' },   // Friday
  { type: '2-Year Fixed', icon: '🎯' },       // Saturday
];

interface Rate {
  lender: string;
  rate: number;
  type: string;
  term_months?: number;
}

interface RatesData {
  rates: Rate[];
  metadata: {
    last_updated: string;
    source: string;
  };
}

function loadRates(): RatesData {
  const dataPath = path.join(__dirname, '..', 'data', 'rates.json');
  const data = fs.readFileSync(dataPath, 'utf8');
  return JSON.parse(data);
}

function getTopRates(rates: Rate[], rateType: string, limit: number = 4): Rate[] {
  // Filter by rate type
  let filtered = rates.filter(r => {
    if (rateType === '5-Year Fixed') return r.type === 'fixed' && r.term_months === 60;
    if (rateType === '5-Year Variable') return r.type === 'variable' && r.term_months === 60;
    if (rateType === '3-Year Fixed') return r.type === 'fixed' && r.term_months === 36;
    if (rateType === '3-Year Variable') return r.type === 'variable' && r.term_months === 36;
    if (rateType === '2-Year Fixed') return r.type === 'fixed' && r.term_months === 24;
    if (rateType === '4-Year Fixed') return r.type === 'fixed' && r.term_months === 48;
    if (rateType === '10-Year Fixed') return r.type === 'fixed' && r.term_months === 120;
    return false;
  });

  // Sort by rate (lowest first)
  filtered.sort((a, b) => a.rate - b.rate);

  // Return top N
  return filtered.slice(0, limit);
}

function formatTweet(topRates: Rate[], rateType: string, icon: string): string {
  const rankingEmojis = ['🥇', '🥈', '🥉', '4️⃣'];
  
  let tweet = `${icon} Best Canadian ${rateType} Mortgage Rates\n\n`;
  
  topRates.forEach((rate, index) => {
    const emoji = rankingEmojis[index] || '•';
    // Shorten lender name if needed
    const lenderShort = rate.lender.length > 15 
      ? rate.lender.substring(0, 12) + '...' 
      : rate.lender;
    tweet += `${emoji} ${lenderShort}: ${rate.rate.toFixed(2)}%\n`;
  });
  
  tweet += `\nCompare all 112 rates at 👇\n`;
  tweet += `latestmortgagerates.ca`;
  
  return tweet;
}

async function postTweet() {
  try {
    // Check for required env vars
    const requiredEnvVars = [
      'TWITTER_API_KEY',
      'TWITTER_API_SECRET', 
      'TWITTER_ACCESS_TOKEN',
      'TWITTER_ACCESS_SECRET'
    ];
    
    for (const envVar of requiredEnvVars) {
      if (!process.env[envVar]) {
        console.error(`❌ Missing environment variable: ${envVar}`);
        process.exit(1);
      }
    }

    // Get today's rate type
    const dayOfWeek = new Date().getDay();
    const { type: rateType, icon } = rateTypes[dayOfWeek];
    
    console.log(`📅 Today is ${['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][dayOfWeek]}`);
    console.log(`📊 Tweeting: ${rateType}`);
    
    // Load and filter rates
    const data = loadRates();
    console.log(`📈 Loaded ${data.rates.length} rates`);
    
    const topRates = getTopRates(data.rates, rateType);
    
    if (topRates.length === 0) {
      console.error(`❌ No rates found for ${rateType}`);
      process.exit(1);
    }
    
    console.log(`🏆 Top rates for ${rateType}:`);
    topRates.forEach((r, i) => console.log(`  ${i + 1}. ${r.lender}: ${r.rate}%`));
    
    // Format tweet
    const tweetText = formatTweet(topRates, rateType, icon);
    console.log(`\n📝 Tweet text (${tweetText.length} chars):`);
    console.log(tweetText);
    
    // Initialize Twitter client
    const client = new TwitterApi({
      appKey: process.env.TWITTER_API_KEY!,
      appSecret: process.env.TWITTER_API_SECRET!,
      accessToken: process.env.TWITTER_ACCESS_TOKEN!,
      accessSecret: process.env.TWITTER_ACCESS_SECRET!,
    });
    
    // Post tweet
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
  postTweet();
}

export { postTweet, loadRates, getTopRates, formatTweet };
