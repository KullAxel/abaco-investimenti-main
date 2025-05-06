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
    
    if (!symbol) {
      return NextResponse.json({ error: 'Symbol is required' }, { status: 400 });
    }
    
    // Calculate date range (last month to now)
    const today = new Date();
    const lastMonth = new Date(today);
    lastMonth.setMonth(today.getMonth() - 1);
    
    const fromDate = lastMonth.toISOString().split('T')[0];
    const toDate = today.toISOString().split('T')[0];
    
    // Get API key securely from server environment
    const apiKey = process.env.FINNHUB_API_KEY;
    if (!apiKey) {
      console.error('Finnhub API key not configured');
      return NextResponse.json({ error: 'API configuration missing' }, { status: 500 });
    }
    
    // Call Finnhub API securely from the server
    const response = await fetch(
      `https://finnhub.io/api/v1/company-news?symbol=${symbol}&from=${fromDate}&to=${toDate}&token=${apiKey}`,
      { next: { revalidate: 3600 } } // Cache for 1 hour as news can change
    );
    
    if (!response.ok) {
      const status = response.status;
      if (status === 429) {
        // Rate limit hit - implement exponential backoff or queue in a production app
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
    
    // Limit to 10 recent news
    if (Array.isArray(data)) {
      return NextResponse.json(data.slice(0, 10));
    }
    
    return NextResponse.json([]);
  } catch (error) {
    console.error("Error fetching news:", error);
    return NextResponse.json({ error: 'Failed to fetch news' }, { status: 500 });
  }
} 