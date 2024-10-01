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
    .order('nome', { ascending: true})

  if(error) throw new Error('Erro consultando ramais: ' + error)
  return data || []
}

// export async function addTodo(formData: FormData) {
//   const title = formData.get('title') as string;
//   if (!title) throw new Error("Title is required");
  
//   const { data, error } = await supabase
//     .from('todos')
//     .insert({  title, is_completed: false})
//     .select()

//   if (error) throw new Error('Error adding todo: ' + error)
//   revalidatePath('/')
//   return data[0]
// }

// export async function deleteTodo(formData: FormData) {
//   const id = parseInt(formData.get('id') as string);

//   const { error } = await supabase
//     .from('todos')
//     .delete()
//     .eq('id', id)

//   if (error) throw new Error('Error deleting todo: ' + error)
//   revalidatePath('/')
// }