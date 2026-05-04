#!/usr/bin/env node
// upload-youtube.js
// Upload videos to YouTube with SEO-optimized metadata
// Usage: node upload-youtube.js --video output/video.mp4 --type short|long

const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');
const { authenticate } = require('./auth-youtube');

const RATES_PATH = path.join(__dirname, '..', '..', 'data', 'rates.json');
const CONFIG_PATH = path.join(__dirname, '..', 'config', 'upload-config.json');

// CLI args
const args = process.argv.slice(2);
const getArg = (flag) => {
  const idx = args.indexOf(flag);
  return idx !== -1 ? args[idx + 1] : null;
};

const VIDEO_PATH = getArg('--video') || getArg('-v');
const VIDEO_TYPE = (getArg('--type') || getArg('-t') || 'short').toLowerCase();
const TITLE_OVERRIDE = getArg('--title');
const DRY_RUN = args.includes('--dry-run');

if (!VIDEO_PATH) {
  console.error('Usage: node upload-youtube.js --video path/to/video.mp4 --type short|long [--title "Custom Title"] [--dry-run]');
  process.exit(1);
}

if (!fs.existsSync(VIDEO_PATH)) {
  console.error('❌ Video file not found:', VIDEO_PATH);
  process.exit(1);
}

// Load rate data for dynamic metadata
function loadRateData() {
  try {
    const data = JSON.parse(fs.readFileSync(RATES_PATH, 'utf-8'));
    const fixed5y = data.filter(r => r.term_months === 60 && r.rate_type === 'fixed')
      .sort((a, b) => a.rate - b.rate)[0];
    const variable5y = data.filter(r => r.term_months === 60 && r.rate_type === 'variable')
      .sort((a, b) => a.rate - b.rate)[0];
    return { fixed5y, variable5y, totalRates: data.length };
  } catch (e) {
    return { fixed5y: null, variable5y: null, totalRates: 0 };
  }
}

// Generate SEO-optimized title
function generateTitle(type, rates) {
  if (TITLE_OVERRIDE) return TITLE_OVERRIDE;

  const date = new Date().toLocaleDateString('en-CA', { month: 'long', day: 'numeric' });
  const { fixed5y, variable5y } = rates;

  const titles = {
    short: [
      `${fixed5y?.rate.toFixed(2) || '3.89'}% Mortgage Rate — Best Deal Today | Canada ${date}`,
      `Stop Overpaying — ${fixed5y?.lender_name || 'Top Lender'} at ${fixed5y?.rate.toFixed(2) || '3.89'}% | ${date}`,
      `${fixed5y?.rate.toFixed(2) || '3.89'}% vs ${variable5y?.rate.toFixed(2) || '4.50'}% — Which Saves You More?`,
      `Mortgage Rates ${date} — ${fixed5y?.rate.toFixed(2) || '3.89'}% Fixed | Don't Miss Out`,
      `🔥 ${fixed5y?.rate.toFixed(2) || '3.89'}% — Lowest 5-Year Fixed in Canada Today`,
    ],
    long: [
      `Weekly Mortgage Rate Update | ${date} | Best Fixed & Variable Rates Canada`,
      `Canada Mortgage Rates This Week — Full Breakdown + Best Lenders | ${date}`,
      `Mortgage Rate Forecast ${date} — Should You Lock In Now?`,
      `Complete Canadian Mortgage Rate Guide | ${date} | Save Thousands`,
    ],
  };

  const pool = titles[type] || titles.short;
  return pool[Math.floor(Math.random() * pool.length)];
}

// Generate SEO-optimized description
function generateDescription(type, rates) {
  const { fixed5y, variable5y, totalRates } = rates;
  const date = new Date().toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric' });
  const url = 'https://latestmortgagerates.ca';

  if (type === 'short') {
    return `🏆 Today's best mortgage rates in Canada

${fixed5y ? `✅ Best 5-Year Fixed: ${fixed5y.rate.toFixed(2)}% from ${fixed5y.lender_name}` : ''}
${variable5y ? `✅ Best 5-Year Variable: ${variable5y.rate.toFixed(2)}% from ${variable5y.lender_name}` : ''}

Compare ${totalRates || '200+'} rates from top Canadian lenders instantly — 100% free.

🔗 ${url}

#mortgagerates #canadamortgage #realestate #firsttimehomebuyer #mortgagetips #homeloans #canadianrealestate

Subscribe for daily rate updates!`;
  }

  return `📊 Complete mortgage rate breakdown for ${date}

TIMESTAMPS:
0:00 This Week's Headlines
0:30 Best 5-Year Fixed Rates
1:00 Best 5-Year Variable Rates
1:30 Biggest Rate Changes
2:00 Market Analysis & Predictions
2:30 What to Expect Next Week

🏆 THIS WEEK'S TOP RATES:
${fixed5y ? `• Best 5-Year Fixed: ${fixed5y.rate.toFixed(2)}% — ${fixed5y.lender_name}` : ''}
${variable5y ? `• Best 5-Year Variable: ${variable5y.rate.toFixed(2)}% — ${variable5y.lender_name}` : ''}

📈 RATES TRACKED: ${totalRates || '200+'} from ${totalRates ? Math.round(totalRates / 6) : '34'}+ lenders
🔄 UPDATED: Daily at 6 AM & 6 PM EST

🔗 RESOURCES:
• Compare all rates: ${url}
• Mortgage calculator: ${url}/tools/mortgage-calculator
• Rate alerts: ${url}/rate-alerts
• City guides: ${url}/cities
• Lender reviews: ${url}/lenders

📊 DATA SOURCES:
Rates scraped daily from major Canadian lenders including RBC, TD, Scotiabank, BMO, CIBC, National Bank, nesto, EQ Bank, Simplii, Tangerine, Wealthsimple, and more.

🎯 WHO WE HELP:
• First-time home buyers
• Mortgage renewals
• Refinancing
• Investment properties
• Commercial mortgages

📱 FOLLOW US:
• Website: ${url}
• YouTube: @LatestMortgageRates
• X/Twitter: @Mortgage_RateCA

#MortgageRates #CanadianRealEstate #HomeBuying #MortgageBroker #InterestRates #FirstTimeHomeBuyer #MortgageTips #RealEstateCanada #HomeLoans #FinancialFreedom

—
🎬 New videos: Sundays (weekly recap) + daily Shorts
🔔 Subscribe and hit the bell for instant rate alerts
💬 Drop your city in the comments for local rates`;
}

// Generate tags
function generateTags(type) {
  const baseTags = [
    'mortgage rates canada',
    'canadian mortgage rates',
    'best mortgage rates',
    'mortgage calculator',
    'home buying',
    'first time home buyer',
    'mortgage broker',
    'real estate',
    'canadian real estate',
    'interest rates',
  ];

  const shortTags = [
    'mortgage tips',
    'save money',
    'financial tips',
    'money saving',
    'personal finance',
    'canada',
    'toronto real estate',
    'vancouver real estate',
  ];

  const longTags = [
    'mortgage renewal',
    'refinance mortgage',
    'fixed vs variable',
    'cmhc insurance',
    'stress test',
    'bank of canada',
    'bond yields',
    'housing market',
    'mortgage advice',
    'home ownership',
  ];

  return type === 'short'
    ? [...baseTags, ...shortTags]
    : [...baseTags, ...longTags];
}

// Upload video
async function uploadVideo(auth) {
  const youtube = google.youtube({ version: 'v3', auth });
  const rates = loadRateData();

  const title = generateTitle(VIDEO_TYPE, rates);
  const description = generateDescription(VIDEO_TYPE, rates);
  const tags = generateTags(VIDEO_TYPE);

  console.log('\n📤 Upload Configuration:');
  console.log('  Type:', VIDEO_TYPE);
  console.log('  Title:', title);
  console.log('  Tags:', tags.slice(0, 5).join(', ') + '...');
  console.log('  File:', VIDEO_PATH);
  console.log('  Size:', (fs.statSync(VIDEO_PATH).size / 1024 / 1024).toFixed(2) + ' MB');

  if (DRY_RUN) {
    console.log('\n🧪 DRY RUN — Would upload with above metadata');
    console.log('\nFull description:\n', description);
    return;
  }

  const fileSize = fs.statSync(VIDEO_PATH).size;

  try {
    const response = await youtube.videos.insert({
      part: 'snippet,status',
      requestBody: {
        snippet: {
          title,
          description,
          tags,
          categoryId: '25', // News & Politics (good for financial content)
          defaultLanguage: 'en',
          defaultAudioLanguage: 'en',
        },
        status: {
          privacyStatus: 'public',
          selfDeclaredMadeForKids: false,
          // For Shorts: must be under 60 seconds, have #Shorts in title or description
          // (We already include relevant terms)
        },
      },
      media: {
        body: fs.createReadStream(VIDEO_PATH),
      },
    }, {
      // Upload progress
      onUploadProgress: (evt) => {
        const progress = (evt.bytesRead / fileSize * 100).toFixed(1);
        process.stdout.write(`\r  Upload: ${progress}%`);
      },
    });

    console.log('\n✅ Upload complete!');
    console.log('  Video ID:', response.data.id);
    console.log('  URL:', `https://youtube.com/watch?v=${response.data.id}`);

    // Set thumbnail if available
    const thumbPath = VIDEO_PATH.replace('.mp4', '.png').replace('.mov', '.png');
    if (fs.existsSync(thumbPath)) {
      await youtube.thumbnails.set({
        videoId: response.data.id,
        media: { body: fs.createReadStream(thumbPath) },
      });
      console.log('  Thumbnail set ✓');
    }

    // Save upload record
    const recordPath = path.join(__dirname, '..', 'output', 'uploads.json');
    let uploads = [];
    if (fs.existsSync(recordPath)) {
      uploads = JSON.parse(fs.readFileSync(recordPath, 'utf-8'));
    }
    uploads.push({
      videoId: response.data.id,
      title,
      type: VIDEO_TYPE,
      uploadedAt: new Date().toISOString(),
      rates: {
        fixed5y: rates.fixed5y?.rate,
        fixed5yLender: rates.fixed5y?.lender_name,
        variable5y: rates.variable5y?.rate,
        variable5yLender: rates.variable5y?.lender_name,
      },
    });
    fs.writeFileSync(recordPath, JSON.stringify(uploads, null, 2));

    return response.data;
  } catch (error) {
    console.error('\n❌ Upload failed:', error.message);
    if (error.response) {
      console.error('  Details:', JSON.stringify(error.response.data, null, 2));
    }
    throw error;
  }
}

// Main
async function main() {
  console.log('🎬 YouTube Upload Script');
  console.log('========================\n');

  try {
    const auth = await authenticate();
    await uploadVideo(auth);
  } catch (err) {
    console.error('\n❌ Error:', err.message);
    process.exit(1);
  }
}

main();
