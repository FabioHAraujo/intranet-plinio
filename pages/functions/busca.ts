'use server';
import { supabase } from '@/lib/supabase';

export interface Ramais {
  id: number
  nome: string
  ramal: string
  setor: string
}

export async function FetchRamais() {
  const { data, error } = await supabase
    .from('ramais')
    .select('*')
    .order('nome', { ascending: true });

  console.log('Supabase error:', error);

  if (error) throw new Error('Erro consultando ramais: ' + error.message);
  return data || [];
}
