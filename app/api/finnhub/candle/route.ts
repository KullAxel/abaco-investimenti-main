import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';

export async function GET(req: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get parameters
    const searchParams = req.nextUrl.searchParams;
    const symbol = searchParams.get('symbol');
    const resolution = searchParams.get('resolution') || 'D'; // Default to daily candles
    
    if (!symbol) {
      return NextResponse.json({ error: 'Symbol is required' }, { status: 400 });
    }
    
    // Calculate time range (1 year by default)
    const today = Math.floor(Date.now() / 1000);
    const oneYearAgo = today - 365 * 24 * 60 * 60;
    
    // Get API key securely from server environment
    const apiKey = process.env.FINNHUB_API_KEY;
    if (!apiKey) {
      console.error('Finnhub API key not configured');
      return NextResponse.json({ error: 'API configuration missing' }, { status: 500 });
    }
    
    // Call Finnhub API securely from the server
    const response = await fetch(
      `https://finnhub.io/api/v1/stock/candle?symbol=${symbol}&resolution=${resolution}&from=${oneYearAgo}&to=${today}&token=${apiKey}`,
      { next: { revalidate: 3600 } } // Cache for 1 hour
    );
    
    if (!response.ok) {
      const status = response.status;
      if (status === 429) {
        return NextResponse.json(
          { error: 'Rate limit reached, please try again later' },
          { status: 429 }
        );
      }
      return NextResponse.json(
        { error: `Finnhub API returned status ${status}` }, 
        { status: 500 }
      );
    }
    
    const data = await response.json();
    
    if (data.s !== 'ok') {
      return NextResponse.json(
        { error: 'No data available for this symbol' }, 
        { status: 404 }
      );
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching candle data:", error);
    return NextResponse.json({ error: 'Failed to fetch candle data' }, { status: 500 });
  }
} 