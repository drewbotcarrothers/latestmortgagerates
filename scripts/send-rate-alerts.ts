import { getAllActiveSubscribers, updateLastSent, getSubscribersForFrequency } from '../lib/db';

// This script should be run via GitHub Actions cron
// Usage: ts-node scripts/send-rate-alerts.ts [daily|weekly|monthly]

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = 'alerts@latestmortgagerates.ca';
const SITE_URL = 'https://latestmortgagerates.ca';

interface RateSummary {
  bestFixed5yr: { lender: string; rate: number } | null;
  bestVariable5yr: { lender: string; rate: number } | null;
  avgFixed5yr: number;
  totalRates: number;
}

async function fetchRateSummary(): Promise<RateSummary> {
  // Read rates from the JSON file
  const ratesData = require('../data/rates.json');
  
  const fiveYearFixed = ratesData
    .filter((r: any) => r.term_months === 60 && r.rate_type === 'fixed' && r.mortgage_type === 'uninsured')
    .sort((a: any, b: any) => a.rate - b.rate);
  
  const fiveYearVariable = ratesData
    .filter((r: any) => r.term_months === 60 && r.rate_type === 'variable' && r.mortgage_type === 'uninsured')
    .sort((a: any, b: any) => a.rate - b.rate);
  
  const avgFixed = fiveYearFixed.length > 0 
    ? fiveYearFixed.reduce((sum: number, r: any) => sum + r.rate, 0) / fiveYearFixed.length 
    : 0;
  
  return {
    bestFixed5yr: fiveYearFixed.length > 0 
      ? { lender: fiveYearFixed[0].lender_name, rate: fiveYearFixed[0].rate } 
      : null,
    bestVariable5yr: fiveYearVariable.length > 0 
      ? { lender: fiveYearVariable[0].lender_name, rate: fiveYearVariable[0].rate } 
      : null,
    avgFixed5yr: avgFixed,
    totalRates: ratesData.length,
  };
}

function generateEmailHTML(summary: RateSummary, frequency: string, unsubscribeToken: string): string {
  const frequencyLabels: Record<string, string> = {
    daily: "Today's",
    weekly: "This Week's",
    monthly: "This Month's",
  };
  
  const unsubscribeUrl = `${SITE_URL}/api/unsubscribe?token=${unsubscribeToken}`;
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${frequencyLabels[frequency]} Canadian Mortgage Rate Summary</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #2563eb, #1d4ed8); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center; }
        .content { background: #f9fafb; padding: 30px; }
        .rate-card { background: white; border-radius: 8px; padding: 20px; margin: 15px 0; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
        .rate-value { font-size: 32px; font-weight: bold; color: #2563eb; }
        .rate-label { color: #6b7280; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px; }
        .lender { font-size: 16px; font-weight: 600; color: #111827; margin-top: 5px; }
        .cta { background: #2563eb; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; margin: 20px 0; }
        .footer { text-align: center; color: #9ca3af; font-size: 12px; padding: 20px; }
        .footer a { color: #6b7280; }
        .stats { display: flex; justify-content: space-around; text-align: center; margin: 20px 0; }
        .stat-value { font-size: 24px; font-weight: bold; color: #111827; }
        .stat-label { color: #6b7280; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>🇨🇦 ${frequencyLabels[frequency]} Mortgage Rate Summary</h1>
        <p>Your curated update from 19 Canadian lenders</p>
      </div>
      
      <div class="content">
        <div class="stats">
          <div>
            <div class="stat-value">${summary.totalRates}</div>
            <div class="stat-label">Rates Tracked</div>
          </div>
          <div>
            <div class="stat-value">${summary.avgFixed5yr.toFixed(2)}%</div>
            <div class="stat-label">Avg 5-Year Fixed</div>
          </div>
        </div>
        
        <div class="rate-card">
          <div class="rate-label">Best 5-Year Fixed Rate</div>
          <div class="rate-value">${summary.bestFixed5yr?.rate.toFixed(2) || 'N/A'}%</div>
          <div class="lender">${summary.bestFixed5yr?.lender || 'N/A'}</div>
        </div>
        
        <div class="rate-card">
          <div class="rate-label">Best 5-Year Variable Rate</div>
          <div class="rate-value">${summary.bestVariable5yr?.rate.toFixed(2) || 'N/A'}%</div>
          <div class="lender">${summary.bestVariable5yr?.lender || 'N/A'}</div>
        </div>
        
        <div style="text-align: center;">
          <a href="${SITE_URL}" class="cta">View All Rates →</a>
        </div>
        
        <p style="color: #6b7280; font-size: 14px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
          💡 Stay ahead of rate changes. Compare all 19 lenders at a glance on our website.
        </p>
      </div>
      
      <div class="footer">
        <p>You're receiving this because you subscribed to ${frequency} rate alerts from Latest Mortgage Rates Canada.</p>
        <p><a href="${unsubscribeUrl}">Unsubscribe</a> | <a href="${SITE_URL}">Visit Website</a></p>
        <p>© 2026 Latest Mortgage Rates Canada</p>
      </div>
    </body>
    </html>
  `;
}

async function sendEmail(to: string, subject: string, html: string) {
  if (!RESEND_API_KEY) {
    console.log('RESEND_API_KEY not set. Email would be sent to:', to);
    console.log('Subject:', subject);
    return { success: true, id: 'test-id' };
  }
  
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: `Latest Mortgage Rates <${FROM_EMAIL}>`,
      to,
      subject,
      html,
    }),
  });
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to send email: ${error}`);
  }
  
  return response.json();
}

async function main() {
  const frequency = process.argv[2] as 'daily' | 'weekly' | 'monthly';
  
  if (!['daily', 'weekly', 'monthly'].includes(frequency)) {
    console.error('Usage: ts-node send-rate-alerts.ts [daily|weekly|monthly]');
    process.exit(1);
  }
  
  console.log(`📧 Sending ${frequency} rate alerts...`);
  
  // Get subscribers for this frequency
  const subscribers = await getSubscribersForFrequency(frequency);
  
  if (subscribers.length === 0) {
    console.log(`No ${frequency} subscribers found.`);
    return;
  }
  
  console.log(`Found ${subscribers.length} ${frequency} subscribers`);
  
  // Fetch current rate summary
  const summary = await fetchRateSummary();
  
  // Send emails
  let sent = 0;
  let failed = 0;
  
  for (const subscriber of subscribers) {
    try {
      const html = generateEmailHTML(summary, frequency, subscriber.unsubscribe_token);
      const subject = frequency === 'daily' 
        ? "Today's Canadian Mortgage Rates: " + summary.bestFixed5yr?.lender + " leads at " + summary.bestFixed5yr?.rate + "%"
        : frequency === 'weekly'
        ? "Weekly Rate Wrap: Your Summary from 19 Canadian Lenders"
        : "Monthly Rate Report: Trends and Best Deals";
      
      await sendEmail(subscriber.email, subject, html);
      await updateLastSent(subscriber.email);
      sent++;
      console.log(`✅ Sent to ${subscriber.email}`);
    } catch (error) {
      console.error(`❌ Failed to send to ${subscriber.email}:`, error);
      failed++;
    }
  }
  
  console.log(`\n📊 Summary: ${sent} sent, ${failed} failed`);
}

main().catch(console.error);
