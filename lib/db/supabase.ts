import { createClient } from '@supabase/supabase-js';

// Assicurati di aggiungere queste variabili al tuo .env.local
// NEXT_PUBLIC_SUPABASE_URL=tua-url-supabase
// NEXT_PUBLIC_SUPABASE_ANON_KEY=tua-chiave-anonima-supabase

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials missing. Make sure to set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env.local file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type PortfolioAsset = {
  id: string;
  user_id: string;
  symbol: string;
  name: string;
  quantity: number;
  purchase_price: number;
  current_price: number;
  type: string; // "stock" | "crypto" | "etf" | "bond"
  added_date: string;
  created_at: string;
  updated_at: string;
}; 