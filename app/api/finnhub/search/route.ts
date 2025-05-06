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
    const query = searchParams.get('query');
    
    if (!query || query.length < 2) {
      return NextResponse.json({ error: 'Query too short' }, { status: 400 });
    }
    
    // Get API key securely from server environment
    const apiKey = process.env.FINNHUB_API_KEY;
    if (!apiKey) {
      console.error('Finnhub API key not configured');
      return NextResponse.json({ error: 'API configuration missing' }, { status: 500 });
    }
    
    // Call Finnhub API securely from the server
    const response = await fetch(
      `https://finnhub.io/api/v1/search?q=${encodeURIComponent(query)}&token=${apiKey}`,
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
      
      // Return fallback search results
      return NextResponse.json({
        count: 2,
        result: [
          { symbol: 'AAPL', name: 'Apple Inc', type: 'stock', description: 'Apple Inc', displaySymbol: 'AAPL' },
          { symbol: 'MSFT', name: 'Microsoft Corporation', type: 'stock', description: 'Microsoft Corporation', displaySymbol: 'MSFT' }
        ].filter(item => 
          item.symbol.toLowerCase().includes(query.toLowerCase()) || 
          item.name.toLowerCase().includes(query.toLowerCase())
        )
      });
    }
    
    const data = await response.json();
    
    // Add cryptocurrency results if relevant
    if (
      query.toUpperCase() === 'BTC' || 
      query.toLowerCase().includes('bitcoin') ||
      query.toUpperCase() === 'ETH' || 
      query.toLowerCase().includes('ethereum')
    ) {
      // Clone the data object
      const enhancedData = { ...data };
      
      if (!enhancedData.result) {
        enhancedData.result = [];
      }
      
      if (query.toUpperCase() === 'BTC' || query.toLowerCase().includes('bitcoin')) {
        enhancedData.result.push({
          description: 'Bitcoin',
          displaySymbol: 'BTC',
          symbol: 'BTC',
          type: 'crypto'
        });
      }
      
      if (query.toUpperCase() === 'ETH' || query.toLowerCase().includes('ethereum')) {
        enhancedData.result.push({
          description: 'Ethereum',
          displaySymbol: 'ETH',
          symbol: 'ETH',
          type: 'crypto'
        });
      }
      
      enhancedData.count = enhancedData.result.length;
      return NextResponse.json(enhancedData);
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error searching symbols:", error);
    return NextResponse.json({ error: 'Failed to search symbols' }, { status: 500 });
  }
} 