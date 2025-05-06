import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { supabase } from '@/lib/db/supabase';

// DELETE /api/portfolio/[id] - Elimina un asset dal portafoglio
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    if (!id) {
      return NextResponse.json({ error: 'ID asset non specificato' }, { status: 400 });
    }
    
    // Controlla l'autenticazione dell'utente
    const session = await auth();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Utente non autenticato' }, { status: 401 });
    }
    
    const userId = session.user.email;
    
    // Prima verifica che l'asset appartenga all'utente
    const { data: asset, error: fetchError } = await supabase
      .from('portfolios')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();
      
    if (fetchError || !asset) {
      return NextResponse.json({ error: 'Asset non trovato o non autorizzato' }, { status: 404 });
    }
    
    // Elimina l'asset
    const { error: deleteError } = await supabase
      .from('portfolios')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);
      
    if (deleteError) {
      console.error('Errore nell\'eliminazione dell\'asset:', deleteError);
      return NextResponse.json({ error: 'Errore nell\'eliminazione dell\'asset' }, { status: 500 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Errore nell\'eliminazione dell\'asset:', error);
    return NextResponse.json({ error: 'Errore nell\'elaborazione della richiesta' }, { status: 500 });
  }
} 