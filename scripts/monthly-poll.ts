import { TwitterApi } from 'twitter-api-v2';
import * as fs from 'fs';
import * as path from 'path';

interface RawRate {
  lender_name: string;
  rate: number;
  rate_type: string;
  term_months: number;
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
  const rates = Array.isArray(parsed) ? parsed : parsed.rates;
  
  console.log(`📈 Loaded ${rates.length} rates`);
  return rates;
}

function getBest5YearFixed(rates: RawRate[]): number | null {
  const fixed5Year = rates.filter(r => 
    r.rate_type === 'fixed' && r.term_months === 60
  );
  
  if (fixed5Year.length === 0) return null;
  
  fixed5Year.sort((a, b) => a.rate - b.rate);
  return fixed5Year[0].rate;
}

async function postMonthlyPoll() {
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

    // Load rates to get today's best rate
    const rates = loadRates();
    const bestRate = getBest5YearFixed(rates);
    
    const currentDate = new Date().toLocaleDateString('en-CA', { 
      month: 'short', 
      year: 'numeric' 
    });

    // Create poll text
    let pollText = `📊 Monthly Rate Check - ${currentDate}\n\n`;
    pollText += `What mortgage rate are you currently paying?\n\n`;
    
    if (bestRate) {
      pollText += `💡 Best 5-year fixed available: ${bestRate.toFixed(2)}%`;
    }

    console.log(`📝 Poll text (${pollText.length} chars):`);
    console.log(pollText);

    // Post poll - Twitter polls support 2-4 options, 25 chars max each
    console.log(`\n🚀 Posting poll...`);
    const pollTweet = await client.v2.tweet({
      text: pollText,
      poll: {
        options: [
          'Under 4%',
          '4% to 5%',
          '5% to 6%',
          'Over 6% 😬'
        ],
        duration_minutes: 7 * 24 * 60 // 7 days
      }
    });

    console.log(`\n✅ Poll posted successfully!`);
    console.log(`🔗 Tweet ID: ${pollTweet.data.id}`);
    console.log(`🔗 Poll URL: https://twitter.com/Mortgage_RateCA/status/${pollTweet.data.id}`);

  } catch (error) {
    console.error('❌ Error posting poll:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  postMonthlyPoll();
}

export { postMonthlyPoll };
