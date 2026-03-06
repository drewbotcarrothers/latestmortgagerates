import { TwitterApi } from 'twitter-api-v2';
import { readFileSync } from 'fs';
import { join } from 'path';

// Twitter API credentials
const apiKey = process.env.TWITTER_API_KEY!;
const apiSecret = process.env.TWITTER_API_SECRET!;
const accessToken = process.env.TWITTER_ACCESS_TOKEN!;
const accessSecret = process.env.TWITTER_ACCESS_SECRET!;

interface Rate {
  lender_name: string;
  lender_slug: string;
  rate: number;
  rate_type: string;
  term_months: number;
  mortgage_type: string;
}

interface RateData {
  rates: Rate[];
  metadata: {
    scrape_date: string;
  };
}

// Rotation templates based on day of week
// 0 = Sunday, 1 = Monday, etc.
const ROTATION: Array<{ type: 'fixed' | 'variable'; term: number; title: string; emoji: string }> = [
  { type: 'fixed', term: 60, title: '5-Year Fixed', emoji: '📌' },
  { type: 'variable', term: 60, title: '5-Year Variable', emoji: '📌' },
  { type: 'fixed', term: 36, title: '3-Year Fixed', emoji: '⚡' },
  { type: 'fixed', term: 48, title: '4-Year Fixed', emoji: '⚡' },
  { type: 'fixed', term: 120, title: '10-Year Fixed', emoji: '🏠' },
  { type: 'variable', term: 36, title: '3-Year Variable', emoji: '⚡' },
  { type: 'fixed', term: 24, title: '2-Year Fixed', emoji: '⏱️' },
];

function loadRates(): RateData {
  // Try different paths for flexibility
  const paths = [
    join(process.cwd(), 'data', 'rates.json'),
    join(process.cwd(), '..', 'data', 'rates.json'),
    join(__dirname, '..', '..', 'data', 'rates.json'),
    join(__dirname, '..', 'data', 'rates.json'),
  ];
  
  for (const ratesPath of paths) {
    try {
      const ratesData = readFileSync(ratesPath, 'utf-8');
      const metadataPath = ratesPath.replace('rates.json', 'metadata.json');
      const metadataData = readFileSync(metadataPath, 'utf-8');
      
      console.log(`📂 Loaded data from: ${ratesPath}`);
      
      return {
        rates: JSON.parse(ratesData),
        metadata: JSON.parse(metadataData)
      };
    } catch (err) {
      // Continue to next path
    }
  }
  
  throw new Error('Could not find rates.json in any expected location');
}

function getBestRate(data: RateData, rateType: 'fixed' | 'variable', termMonths: number): Rate | null {
  const filtered = data.rates.filter(r => 
    r.rate_type === rateType && 
    r.term_months === termMonths &&
    r.mortgage_type === 'uninsured'
  );
  
  if (filtered.length === 0) return null;
  
  return filtered.sort((a, b) => a.rate - b.rate)[0];
}

function getTopRates(data: RateData, rateType: 'fixed' | 'variable', termMonths: number): Rate[] {
  const filtered = data.rates.filter(r => 
    r.rate_type === rateType && 
    r.term_months === termMonths &&
    r.mortgage_type === 'uninsured'
  );
  
  return filtered.sort((a, b) => a.rate - b.rate).slice(0, 5);
}

function formatDate(): string {
  return new Date().toLocaleDateString('en-CA', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

function buildTweet(data: RateData, dayOfWeek: number): string {
  const config = ROTATION[dayOfWeek % ROTATION.length];
  
  const bestRate = getBestRate(data, config.type, config.term);
  const topRates = getTopRates(data, config.type, config.term);
  
  if (!bestRate) {
    throw new Error(`No rates found for ${config.title}`);
  }
  
  // Build tweet
  let tweet = `📊 ${config.title} Rate Update | ${formatDate()}\n\n`;
  tweet += `${config.emoji} Best Rate: ${bestRate.rate.toFixed(2)}%\n`;
  tweet += `🏦 Lender: ${bestRate.lender_name}\n\n`;
  
  // Show top 3-4 other rates
  tweet += `🔗 Compare Top 4:\n`;
  topRates.slice(0, 4).forEach((rate, idx) => {
    const rank = ['🥇', '🥈', '🥉', '4️⃣'][idx];
    tweet += `${rank} ${rate.lender_name}: ${rate.rate.toFixed(2)}%\n`;
  });
  
  // Add context based on rate type
  if (config.type === 'fixed') {
    const bestVariable = getBestRate(data, 'variable', config.term);
    const diff = bestVariable ? (bestRate.rate - bestVariable.rate).toFixed(2) : null;
    if (diff && parseFloat(diff) > 0) {
      tweet += `\n💡 Variable rates: ${bestVariable?.rate.toFixed(2)}% (${diff}% lower)\n`;
    }
  } else {
    const bestFixed = getBestRate(data, 'fixed', config.term);
    const diff = bestFixed ? (bestRate.rate - bestFixed.rate).toFixed(2) : null;
    if (diff && parseFloat(diff) < 0) {
      tweet += `\n💡 Save ${Math.abs(parseFloat(diff)).toFixed(2)}% vs fixed (${bestFixed?.rate.toFixed(2)}%)\n`;
    }
  }
  
  tweet += `\n🌐 latestmortgagerates.ca\n`;
  tweet += `#MortgageRates #${config.title.replace(/\s+/g, '')} #Canada #RealEstate`;
  
  return tweet;
}

async function postTweet(): Promise<void> {
  const dryRun = process.env.DRY_RUN === 'true' || process.argv.includes('--dry-run');
  
  if (dryRun) {
    console.log('🔧 DRY RUN MODE - No actual posting to Twitter\n');
  } else if (!apiKey || !apiSecret || !accessToken || !accessSecret) {
    console.error('❌ Missing Twitter API credentials');
    console.error('Required: TWITTER_API_KEY, TWITTER_API_SECRET, TWITTER_ACCESS_TOKEN, TWITTER_ACCESS_SECRET');
    process.exit(1);
  }
  
  try {
    console.log('📊 Loading rate data...');
    const data = loadRates();
    
    console.log(`✅ Loaded ${data.rates.length} rates from ${data.rates.filter(r => r.rate_type === 'fixed').length} fixed / ${data.rates.filter(r => r.rate_type === 'variable').length} variable`);
    
    // Calculate rotation based on day
    const dayOfWeek = new Date().getDay();
    const rotationDay = ROTATION[dayOfWeek % ROTATION.length];
    
    console.log(`📅 Today is ${['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dayOfWeek]}`);
    console.log(`🎯 Posting: ${rotationDay.title}`);
    
    // Build and log tweet
    const tweet = buildTweet(data, dayOfWeek);
    
    console.log('\n📝 Tweet content:');
    console.log('─'.repeat(50));
    console.log(tweet);
    console.log('─'.repeat(50));
    console.log(`\nLength: ${tweet.length} characters`);
    
    if (dryRun) {
      console.log('\n✅ Dry run complete. To post, run without --dry-run flag or set DRY_RUN=false.');
      return;
    }
    
    // Post to Twitter
    console.log('\n🐦 Connecting to Twitter...');
    const client = new TwitterApi({
      appKey: apiKey,
      appSecret: apiSecret,
      accessToken: accessToken,
      accessSecret: accessSecret,
    });
    
    console.log('\n📤 Posting to Twitter...');
    const { data: tweetData } = await client.v2.tweet(tweet);
    
    console.log(`✅ Tweet posted successfully!`);
    console.log(`🔗 https://twitter.com/i/web/status/${tweetData.id}`);
    
  } catch (error: any) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Run if called directly
const isMain = require.main === module || 
               process.argv[1]?.includes('daily-tweet') ||
               process.argv[0]?.includes('daily-tweet');

if (isMain) {
  postTweet().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}

export { buildTweet, loadRates };
