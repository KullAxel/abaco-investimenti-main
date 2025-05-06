import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { supabase, PortfolioAsset } from '@/lib/db/supabase';

// POST /api/portfolio/refresh - Aggiorna i prezzi degli asset nel portafoglio
export async function POST(req: NextRequest) {
  try {
    // Controlla l'autenticazione dell'utente
    const session = await auth();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Utente non autenticato' }, { status: 401 });
    }
    
    const userId = session.user.email;
    
    // Recupera gli asset dal database
    const { data: assets, error: fetchError } = await supabase
      .from('portfolios')
      .select('*')
      .eq('user_id', userId);
      
    if (fetchError) {
      console.error('Errore nel recupero degli asset:', fetchError);
      return NextResponse.json({ error: 'Errore nel recupero degli asset dal database' }, { status: 500 });
    }
    
    if (!assets || assets.length === 0) {
      return NextResponse.json([]);
    }
    
    // Per ogni tipo di asset (azioni, crypto, ecc.), raggruppa i simboli
    const stockSymbols = assets
      .filter(asset => asset.type === 'stock')
      .map(asset => asset.symbol);
      
    const cryptoSymbols = assets
      .filter(asset => asset.type === 'crypto')
      .map(asset => asset.symbol);
      
    // Oggetto per memorizzare i prezzi aggiornati
    const updatedPrices: Record<string, number> = {};
    
    // Funzione per ottenere il prezzo da Alpha Vantage
    async function fetchPrice(symbol: string, type: string): Promise<number | null> {
      try {
        const apiKey = process.env.ALPHA_VANTAGE_API_KEY;
        if (!apiKey) {
          console.error('Alpha Vantage API key non configurata');
          return null;
        }
        
        let url: string;
        
        if (type === 'crypto') {
          url = `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=${symbol}&to_currency=EUR&apikey=${apiKey}`;
        } else {
          // Per azioni ed ETF
          url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${apiKey}`;
        }
        
        const response = await fetch(url);
        const data = await response.json();
        
        if (type === 'crypto' && data['Realtime Currency Exchange Rate']) {
          const rate = parseFloat(data['Realtime Currency Exchange Rate']['5. Exchange Rate']);
          return rate;
        } else if (data['Global Quote'] && data['Global Quote']['05. price']) {
          const price = parseFloat(data['Global Quote']['05. price']);
          return price;
        }
        
        // In caso di errore o risposta non valida, ritorna il prezzo precedente
        return null;
      } catch (error) {
        console.error(`Errore nel recupero del prezzo per ${symbol}:`, error);
        return null;
      }
    }
    
    // Aggiorna i prezzi delle azioni (con limite di rate per l'API)
    if (stockSymbols.length > 0) {
      // Limita a 5 richieste per evitare limiti API
      const symbols = stockSymbols.slice(0, 5);
      for (const symbol of symbols) {
        const price = await fetchPrice(symbol, 'stock');
        if (price !== null) {
          updatedPrices[symbol] = price;
        }
        
        // Pausa per rispettare i limiti API
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    // Aggiorna i prezzi delle crypto (con limiti di rate per l'API)
    if (cryptoSymbols.length > 0) {
      // Limita a 5 richieste per evitare limiti API
      const symbols = cryptoSymbols.slice(0, 5);
      for (const symbol of symbols) {
        const price = await fetchPrice(symbol, 'crypto');
        if (price !== null) {
          updatedPrices[symbol] = price;
        }
        
        // Pausa per rispettare i limiti API
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    // Aggiorna i prezzi nel database
    if (Object.keys(updatedPrices).length > 0) {
      for (const asset of assets) {
        if (updatedPrices[asset.symbol]) {
          const { error: updateError } = await supabase
            .from('portfolios')
            .update({ current_price: updatedPrices[asset.symbol] })
            .eq('id', asset.id)
            .eq('user_id', userId);
            
          if (updateError) {
            console.error(`Errore nell'aggiornamento del prezzo per ${asset.symbol}:`, updateError);
          }
        }
      }
    }
    
    // Recupera i dati aggiornati dal database
    const { data: updatedAssets, error: finalFetchError } = await supabase
      .from('portfolios')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
      
    if (finalFetchError) {
      console.error('Errore nel recupero degli asset aggiornati:', finalFetchError);
      return NextResponse.json({ error: 'Errore nel recupero degli asset aggiornati' }, { status: 500 });
    }
    
    return NextResponse.json(updatedAssets);
  } catch (error) {
    console.error('Errore nell\'aggiornamento dei prezzi:', error);
    return NextResponse.json({ error: 'Errore nell\'elaborazione della richiesta' }, { status: 500 });
  }
} 