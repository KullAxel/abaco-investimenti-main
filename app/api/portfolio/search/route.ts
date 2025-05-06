import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';

// Helper function for exponential backoff on rate limiting
async function fetchWithRetry(url: string, maxRetries = 3, baseDelay = 1000) {
  let retries = 0;
  
  while (retries < maxRetries) {
    try {
      const response = await fetch(url);
      
      if (response.ok) {
        return await response.json();
      }
      
      if (response.status === 429) {
        // Rate limit hit - wait with exponential backoff
        const delay = baseDelay * Math.pow(2, retries);
        console.log(`Rate limit hit, retrying in ${delay}ms (retry ${retries + 1}/${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, delay));
        retries++;
      } else {
        // Other error
        return { error: `API returned status ${response.status}` };
      }
    } catch (error) {
      console.error("Fetch error:", error);
      return { error: "Network error" };
    }
  }
  
  return { error: "Max retries reached" };
}

// GET /api/portfolio/search - Cerca asset tramite Alpha Vantage
export async function GET(req: NextRequest) {
  try {
    // Controlla l'autenticazione dell'utente
    const session = await auth();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Utente non autenticato' }, { status: 401 });
    }
    
    // Ottieni il parametro di ricerca
    const searchParams = req.nextUrl.searchParams;
    const query = searchParams.get('query');
    
    if (!query || query.length < 2) {
      return NextResponse.json({ error: 'Query di ricerca troppo breve' }, { status: 400 });
    }
    
    const apiKey = process.env.ALPHA_VANTAGE_API_KEY;
    if (!apiKey) {
      console.error('Alpha Vantage API key non configurata');
      return NextResponse.json({ error: 'Configurazione API mancante' }, { status: 500 });
    }
    
    // Cerca azioni tramite Alpha Vantage
    const url = `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${encodeURIComponent(query)}&apikey=${apiKey}`;
    
    const data = await fetchWithRetry(url);
    
    if (data.error) {
      return NextResponse.json({ error: data.error }, { status: 500 });
    }
    
    if (!data.bestMatches) {
      return NextResponse.json([]);
    }
    
    // Trasforma i risultati nel formato richiesto
    const results = data.bestMatches.map((match: any) => {
      const symbol = match['1. symbol'];
      const name = match['2. name'];
      const type = match['3. type'].toLowerCase();
      
      return {
        symbol,
        name,
        type: type === 'equity' ? 'stock' : type === 'etf' ? 'etf' : 'altro',
      };
    });
    
    // Aggiungi anche alcuni risultati crypto simulati se la query corrisponde
    if (query.toUpperCase() === 'BTC' || query.toLowerCase().includes('bitcoin')) {
      results.push({
        symbol: 'BTC',
        name: 'Bitcoin',
        type: 'crypto',
        price: 55000, // Simulato
      });
    } else if (query.toUpperCase() === 'ETH' || query.toLowerCase().includes('ethereum')) {
      results.push({
        symbol: 'ETH',
        name: 'Ethereum',
        type: 'crypto',
        price: 2500, // Simulato
      });
    }
    
    // Ottieni i prezzi correnti per i primi 5 risultati in parallelo
    const top5Results = results.slice(0, 5);
    
    const resultsWithPrices = await Promise.all(
      top5Results.map(async (result: any) => {
        if (result.price) return result; // Se è già simulato
        
        try {
          // Ottieni il prezzo in base al tipo di asset
          let priceUrl: string;
          
          if (result.type === 'crypto') {
            priceUrl = `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=${result.symbol}&to_currency=EUR&apikey=${apiKey}`;
          } else {
            priceUrl = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${result.symbol}&apikey=${apiKey}`;
          }
          
          const priceData = await fetchWithRetry(priceUrl);
          
          if (priceData.error) {
            console.warn(`Error fetching price for ${result.symbol}: ${priceData.error}`);
            return result;
          }
          
          try {
            if (result.type === 'crypto' && priceData['Realtime Currency Exchange Rate']) {
              result.price = parseFloat(priceData['Realtime Currency Exchange Rate']['5. Exchange Rate'] || '0');
            } else if (priceData['Global Quote'] && priceData['Global Quote']['05. price']) {
              result.price = parseFloat(priceData['Global Quote']['05. price'] || '0');
            }
          } catch (parseError) {
            console.warn(`Error parsing price for ${result.symbol}:`, parseError);
          }
          
          return result;
        } catch (error) {
          console.error(`Errore nel recupero del prezzo per ${result.symbol}:`, error);
          return result;
        }
      })
    );
    
    return NextResponse.json(resultsWithPrices);
  } catch (error) {
    console.error('Errore nella ricerca:', error);
    return NextResponse.json({ error: 'Errore nella ricerca degli asset' }, { status: 500 });
  }
} 