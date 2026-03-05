import { NextRequest, NextResponse } from 'next/server';
import { addSubscriber } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { email, frequency } = await request.json();
    
    // Validate inputs
    if (!email || !frequency) {
      return NextResponse.json(
        { error: 'Email and frequency are required' },
        { status: 400 }
      );
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }
    
    // Validate frequency
    const validFrequencies = ['daily', 'weekly', 'monthly'];
    if (!validFrequencies.includes(frequency)) {
      return NextResponse.json(
        { error: 'Invalid frequency. Choose daily, weekly, or monthly' },
        { status: 400 }
      );
    }
    
    // Add subscriber
    const result = await addSubscriber(email, frequency);
    
    return NextResponse.json({
      success: true,
      message: result.updated 
        ? 'Subscription updated successfully!' 
        : 'Subscribed successfully! Check your inbox for confirmation.',
      unsubscribeToken: result.unsubscribeToken
    });
    
  } catch (error: any) {
    console.error('Subscription error:', error);
    return NextResponse.json(
      { error: 'Failed to subscribe. Please try again.' },
      { status: 500 }
    );
  }
}
