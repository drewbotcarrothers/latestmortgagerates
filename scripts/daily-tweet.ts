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

interface RawRate {
  lender_name: string;
  rate: number;
  rate_type: string;
  term_months: number;
}

interface Rate {
  lender_name: string;
  rate: number;
}

function loadRates(): RawRate[] {
  const dataPath = path.join(__dirname, '..', 'data', 'rates.json');
  console.log(`📂 Loading rates from: ${dataPath}`);
  
  if (!fs.existsSync(dataPath)) {
    console.error(`❌ Rates file not found at ${dataPath}`);
    process.exit(1);
  }
  
  const data = fs.readFileSync(dataPath, 'utf8');
  const parsed = JSON.parse(data);
  
  // Handle both array and object with rates property
  const rates = Array.isArray(parsed) ? parsed : parsed.rates;
  
  console.log(`📈 Loaded ${rates.length} rates`);
  
  // Log first rate to debug
  if (rates.length > 0) {
    console.log('🔍 Sample rate:', JSON.stringify(rates[0], null, 2));
  }
  
  return rates;
}

function getTopRates(rates: RawRate[], rateType: string, limit: number = 4): Rate[] {
  // Filter by rate type
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

  console.log(`🔍 Found ${filtered.length} rates for ${rateType}`);
  
  if (filtered.length === 0) {
    // Show what rate_types and term_months we have
    const types = [...new Set(rates.map(r => `${r.rate_type}-${r.term_months}`))];
    console.log('📋 Available rate types:', types.slice(0, 10));
  }

  // Sort by rate (lowest first)
  filtered.sort((a, b) => a.rate - b.rate);

  // Return top N with just the fields we need
  return filtered.slice(0, limit).map(r => ({
    lender_name: r.lender_name || 'Unknown',
    rate: r.rate
  }));
}

function formatTweet(topRates: Rate[], rateType: string, icon: string): string {
  const rankingEmojis = ['🥇', '🥈', '🥉', '4️⃣'];
  
  let tweet = `${icon} Best Canadian ${rateType} Mortgage Rates\n\n`;
  
  for (let i = 0; i < topRates.length; i++) {
    const rate = topRates[i];
    const emoji = rankingEmojis[i] || '•';
    
    if (!rate.lender_name) {
      console.warn(`⚠️ Missing lender_name for rate ${i}:`, rate);
      continue;
    }
    
    // Shorten lender name if needed
    const lenderShort = rate.lender_name.length > 15 
      ? rate.lender_name.substring(0, 12) + '...' 
      : rate.lender_name;
    tweet += `${emoji} ${lenderShort}: ${rate.rate.toFixed(2)}%\n`;
  }
  
  tweet += `\nCompare all rates at 👇\n`;
  tweet += `latestmortgagerates.ca`;
  
  return tweet;
}

async function postTweet() {
  try {
    // Check for OAuth 2.0 credentials first
    const clientId = process.env.TWITTER_CLIENT_ID;
    const clientSecret = process.env.TWITTER_CLIENT_SECRET;
    const accessToken = process.env.TWITTER_ACCESS_TOKEN;
    
    // Fall back to OAuth 1.0a if OAuth 2.0 not available
    const apiKey = process.env.TWITTER_API_KEY;
    const apiSecret = process.env.TWITTER_API_SECRET;
    const accessSecret = process.env.TWITTER_ACCESS_SECRET;
    
    let client: TwitterApi;
    
    // Prefer OAuth 1.0a for posting tweets (requires user context)
    if (apiKey && apiSecret && accessToken && accessSecret) {
      console.log('🔐 Using OAuth 1.0a authentication');
      client = new TwitterApi({
        appKey: apiKey,
        appSecret: apiSecret,
        accessToken: accessToken,
        accessSecret: accessSecret,
      });
    } else if (accessToken) {
      // OAuth 2.0 Bearer token (App-only, read-only)
      console.log('🔐 Using OAuth 2.0 Bearer token (read-only)');
      console.log('⚠️  Warning: App-only auth cannot post tweets. Use OAuth 1.0a instead.');
      client = new TwitterApi(accessToken);
    } else {
      console.error('❌ Missing Twitter credentials. Need:');
      console.error('   OAuth 1.0a: TWITTER_API_KEY, TWITTER_API_SECRET, TWITTER_ACCESS_TOKEN, TWITTER_ACCESS_SECRET');
      process.exit(1);
    }

    // Get today's rate type
    const dayOfWeek = new Date().getDay();
    const { type: rateType, icon } = rateTypes[dayOfWeek];
    
    console.log(`📅 Today is ${['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][dayOfWeek]}`);
    console.log(`📊 Tweeting: ${rateType}`);
    
    // Load and filter rates
    const rates = loadRates();
    
    const topRates = getTopRates(rates, rateType);
    
    if (topRates.length === 0) {
      console.error(`❌ No rates found for ${rateType}`);
      process.exit(1);
    }
    
    console.log(`🏆 Top rates for ${rateType}:`);
    topRates.forEach((r, i) => console.log(`  ${i + 1}. ${r.lender_name}: ${r.rate}%`));
    
    // Format tweet
    const tweetText = formatTweet(topRates, rateType, icon);
    console.log(`\n📝 Tweet text (${tweetText.length} chars):`);
    console.log(tweetText);
    
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
