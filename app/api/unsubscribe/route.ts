import { NextRequest, NextResponse } from 'next/server';
import { unsubscribeUser } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const token = request.nextUrl.searchParams.get('token');
    
    if (!token) {
      return NextResponse.json(
        { error: 'Token is required' },
        { status: 400 }
      );
    }
    
    await unsubscribeUser(token);
    
    // Redirect to a thank you page or return JSON
    return NextResponse.redirect(new URL('/unsubscribed', request.url));
    
  } catch (error: any) {
    console.error('Unsubscribe error:', error);
    return NextResponse.json(
      { error: 'Failed to unsubscribe. Please try again.' },
      { status: 500 }
    );
  }
}
