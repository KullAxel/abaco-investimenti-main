import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';

export async function GET(req: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get symbol from query params
    const searchParams = req.nextUrl.searchParams;
    const symbol = searchParams.get('symbol');
    
    if (!symbol) {
      return NextResponse.json({ error: 'Symbol is required' }, { status: 400 });
    }
    
    // Get API key securely from server environment
    const apiKey = process.env.FINNHUB_API_KEY;
    if (!apiKey) {
      console.error('Finnhub API key not configured');
      return NextResponse.json({ error: 'API configuration missing' }, { status: 500 });
    }
    
    // Call Finnhub API securely from the server
    const response = await fetch(
      `https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}&token=${apiKey}`,
      { next: { revalidate: 86400 } } // Cache for 24 hours as company profiles rarely change
    );
    
    if (!response.ok) {
      const status = response.status;
      return NextResponse.json(
        { error: `Finnhub API returned status ${status}` }, 
        { status: status === 429 ? 429 : 500 }
      );
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching company profile:", error);
    return NextResponse.json({ error: 'Failed to fetch company profile' }, { status: 500 });
  }
} 