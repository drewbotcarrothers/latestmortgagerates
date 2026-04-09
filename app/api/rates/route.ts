import { NextResponse } from 'next/server';
import ratesData from '@/data/rates.json';
import metadata from '@/data/metadata.json';

export const dynamic = 'force-static';

interface Rate {
  lender: string;
  lender_slug: string;
  product: string;
  rate_type: string;
  term: string;
  interest_rate: number;
  annual_percentage_rate?: number;
  monthly_payment?: number;
  payment_frequency?: string;
  is_insurable?: boolean;
  is_pre_approval?: boolean;
  location?: string;
  updated_at: string;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get('limit') || '5');
  const type = searchParams.get('type') || '5Y Fixed';
  
  const rates: Rate[] = ratesData as Rate[];
  
  // Filter and sort rates by interest rate (lowest first)
  const filteredRates = rates
    .filter((r: Rate) => r.rate_type === 'Fixed' && r.term === '5 Year')
    .sort((a: Rate, b: Rate) => (a.interest_rate || 99) - (b.interest_rate || 99))
    .slice(0, limit)
    .map((r: Rate) => ({
      lender: r.lender,
      lender_slug: r.lender_slug,
      rate: r.interest_rate,
      type: `${r.term} ${r.rate_type}`,
      url: `https://latestmortgagerates.ca/lenders/${r.lender_slug}`,
      updated_at: r.updated_at
    }));

  // Add CORS headers for external widget usage
  const response = NextResponse.json({
    rates: filteredRates,
    meta: {
      total_rates: rates.length,
      lenders_count: metadata?.lenders_count || 34,
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
