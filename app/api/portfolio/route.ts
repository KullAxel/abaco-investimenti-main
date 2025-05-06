import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { supabase, PortfolioAsset } from '@/lib/db/supabase';

// GET /api/portfolio - Recupera gli asset del portafoglio dell'utente autenticato
export async function GET(req: NextRequest) {
  try {
    // Controlla l'autenticazione dell'utente
    const session = await auth();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Utente non autenticato' }, { status: 401 });
    }
    
    const userId = session.user.email;
    
    // Recupera gli asset dal database
    const { data, error } = await supabase
      .from('portfolios')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error('Errore nel recupero degli asset:', error);
      return NextResponse.json({ error: 'Errore nel recupero degli asset dal database' }, { status: 500 });
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Errore nel recupero del portafoglio:', error);
    return NextResponse.json({ error: 'Errore nel recupero del portafoglio' }, { status: 500 });
  }
}

// POST /api/portfolio - Aggiungi un nuovo asset al portafoglio
export async function POST(req: NextRequest) {
  try {
    // Controlla l'autenticazione dell'utente
    const session = await auth();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Utente non autenticato' }, { status: 401 });
    }
    
    const userId = session.user.email;
    
    // Ottieni i dati dal body della richiesta
    const { symbol, name, quantity, type, current_price } = await req.json();
    
    // Verifica che tutti i campi obbligatori siano presenti
    if (!symbol || !name || !quantity || !type) {
      return NextResponse.json({ error: 'Dati mancanti' }, { status: 400 });
    }
    
    // Crea un nuovo asset nel database
    const newAsset = {
      user_id: userId,
      symbol: symbol.toUpperCase(),
      name,
      quantity,
      purchase_price: current_price,
      current_price,
      type,
      added_date: new Date().toISOString(),
    };
    
    const { data, error } = await supabase
      .from('portfolios')
      .insert([newAsset])
      .select();
      
    if (error) {
      console.error('Errore nell\'aggiunta dell\'asset:', error);
      return NextResponse.json({ error: 'Errore nell\'aggiunta dell\'asset al database' }, { status: 500 });
    }
    
    return NextResponse.json(data[0], { status: 201 });
  } catch (error) {
    console.error('Errore nell\'aggiunta dell\'asset:', error);
    return NextResponse.json({ error: 'Errore nell\'aggiunta dell\'asset al portafoglio' }, { status: 500 });
  }
} 