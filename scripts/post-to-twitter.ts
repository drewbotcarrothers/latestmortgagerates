import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Twitter API v2 credentials from environment
const BEARER_TOKEN = process.env.TWITTER_BEARER_TOKEN;
const API_KEY = process.env.TWITTER_API_KEY;
const API_SECRET = process.env.TWITTER_API_SECRET;
const ACCESS_TOKEN = process.env.TWITTER_ACCESS_TOKEN;
const ACCESS_SECRET = process.env.TWITTER_ACCESS_SECRET;

interface Rate {
  lender_name: string;
  rate: number;
  rate_type: string;
  term_months: number;
  mortgage_type: string;
}

function loadRates(): Rate[] {
  const ratesPath = join(__dirname, '..', 'data', 'rates.json');
  const ratesData = readFileSync(ratesPath, 'utf-8');
  return JSON.parse(ratesData);
}

function getBestRates(rates: Rate[]) {
  // Get best 5-year fixed uninsured
  const fiveYearFixed = rates
    .filter(r => r.term_months === 60 && r.rate_type === 'fixed' && r.mortgage_type === 'uninsured')
    .sort((a, b) => a.rate - b.rate);
  
  // Get best 5-year variable uninsured
  const fiveYearVariable = rates
    .filter(r => r.term_months === 60 && r.rate_type === 'variable' && r.mortgage_type === 'uninsured')
    .sort((a, b) => a.rate - b.rate);
  
  // Get best 3-year fixed uninsured
  const threeYearFixed = rates
    .filter(r => r.term_months === 36 && r.rate_type === 'fixed' && r.mortgage_type === 'uninsured')
    .sort((a, b) => a.rate - b.rate);
  
  return {
    fixed5yr: fiveYearFixed[0] || null,
    variable5yr: fiveYearVariable[0] || null,
    fixed3yr: threeYearFixed[0] || null,
    totalRates: rates.length,
    uniqueLenders: new Set(rates.map(r => r.lender_name)).size
  };
}

function formatTweet(bestRates: ReturnType<typeof getBestRates>): string {
  const today = new Date().toLocaleDateString('en-CA', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
  
  let tweet = `\ud83d\udcca Canadian Mortgage Rate Update | ${today}\n\n`;
  
  if (bestRates.fixed5yr) {
    tweet += `\ud83d\udccc Best 5-Year Fixed: ${bestRates.fixed5yr.rate.toFixed(2)}% (${bestRates.fixed5yr.lender_name})\n`;
  }
  
  if (bestRates.variable5yr) {
    tweet += `\ud83d\udccc Best 5-Year Variable: ${bestRates.variable5yr.rate.toFixed(2)}% (${bestRates.variable5yr.lender_name})\n`;
  }
  
  if (bestRates.fixed3yr) {
    tweet += `\ud83d\udccc Best 3-Year Fixed: ${bestRates.fixed3yr.rate.toFixed(2)}% (${bestRates.fixed3yr.lender_name})\n`;
  }
  
  tweet += `\nTracking ${bestRates.totalRates} rates from ${bestRates.uniqueLenders} lenders\n`;
  tweet += `\ud83d\udc47 latestmortgagerates.ca\n\n`;
  tweet += `#MortgageRates #CanadianRealEstate #InterestRates`;
  
  return tweet;
}

async function postTweet(text: string): Promise<void> {
  // Check for credentials
  if (!BEARER_TOKEN || !API_KEY || !API_SECRET || !ACCESS_TOKEN || !ACCESS_SECRET) {
    console.error('Missing Twitter API credentials. Please set all required environment variables.');
    process.exit(1);
  }
  
  // Twitter API v2 endpoint
  const tweetUrl = 'https://api.twitter.com/2/tweets';
  
  // Create request using OAuth 1.0a (required for posting tweets)
  // We'll need to install the oauth-1.0a and crypto libraries for proper signing
  
  console.log('Tweet content:');
  console.log(text);
  console.log('\nTweet length:', text.length, 'characters');
  
  // For now, just log that we would post
  console.log('\nReady to post tweet!');
  console.log('Run this script with proper OAuth signing to actually post to Twitter.');
  
  // TODO: Implement OAuth 1.0a signing and POST to Twitter API
  // This requires crypto and oauth-1.0a packages
  // 
  // Example implementation:
  // const OAuth = require('oauth-1.0a');
  // const crypto = require('crypto');
  // 
  // const oauth = OAuth({
  //   consumer: { key: API_KEY, secret: API_SECRET },
  //   signature_method: 'HMAC-SHA1',
  //   hash_function(base_string, key) {
  //     return crypto.createHmac('sha1', key).update(base_string).digest('base64');
  //   },
  // });
  // 
  // const token = { key: ACCESS_TOKEN, secret: ACCESS_SECRET };
  // const authHeader = oauth.toHeader(oauth.authorize({ url: tweetUrl, method: 'POST' }, token));
  // 
  // const response = await fetch(tweetUrl, {
  //   method: 'POST',
  //   headers: {
  //     'Authorization': authHeader['Authorization'],
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify({ text }),
  // });
}

async function main() {
  try {
    console.log('Loading mortgage rates...');
    const rates = loadRates();
    console.log(`Loaded ${rates.length} rates`);
    
    const bestRates = getBestRates(rates);
    console.log('Best rates found:', bestRates);
    
    const tweet = formatTweet(bestRates);
    console.log('\n--- Generated Tweet ---\n');
    console.log(tweet);
    
    await postTweet(tweet);
    
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

main();
