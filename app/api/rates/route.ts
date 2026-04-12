import { NextResponse } from 'next/server';
import ratesData from '@/data/rates.json';
import metadata from '@/data/metadata.json';

export const dynamic = 'force-static';

interface Rate {
  lender_name: string;
  lender_slug: string;
  term_months: number;
  rate_type: string;
  mortgage_type: string;
  rate: number;
  posted_rate: number;
  source_url: string;
  scraped_at: string;
  apr: number | null;
  ltv_tier: string | null;
  spread_to_prime: string | null;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get('limit') || '5');
  const type = searchParams.get('type') || '5Y Fixed';
  
  const rates: Rate[] = ratesData as Rate[];
  
  // Filter and sort rates by interest rate (lowest first)
  const filteredRates = rates
    .filter((r: Rate) => r.rate_type === 'fixed' && r.term_months === 60)
    .sort((a: Rate, b: Rate) => (a.rate || 99) - (b.rate || 99))
    .slice(0, limit)
    .map((r: Rate) => ({
      lender: r.lender_name,
      lender_slug: r.lender_slug,
      rate: r.rate,
      type: `${r.term_months / 12} Year ${r.rate_type === 'fixed' ? 'Fixed' : 'Variable'}`,
      url: `https://latestmortgagerates.ca/lenders/${r.lender_slug}`,
      updated_at: r.scraped_at
    }));

  // Add CORS headers for external widget usage
  const response = NextResponse.json({
    rates: filteredRates,
    meta: {
      total_rates: rates.length,
      lenders_count: metadata?.total_lenders || 34,
      last_updated: metadata?.last_updated || new Date().toISOString(),
      source: 'https://latestmortgagerates.ca'
    }
  });

  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
  response.headers.set('Cache-Control', 'public, max-age=3600'); // Cache for 1 hour

  return response;
}

export async function OPTIONS() {
  const response = new NextResponse(null, { status: 204 });
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
  return response;
}
