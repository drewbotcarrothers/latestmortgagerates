import { NextResponse } from 'next/server';
import metadata from '../../../data/metadata.json';

export const dynamic = 'force-static';

export async function GET() {
  return NextResponse.json({
    lastUpdated: metadata.last_updated,
    totalRates: metadata.total_rates,
    totalLenders: metadata.total_lenders,
    buildTime: new Date().toISOString(),
  });
}
