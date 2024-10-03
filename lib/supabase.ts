import { createClient } from "@supabase/supabase-js"

// Usar valor padrão ou lançar um erro se não estiver definido
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
console.log("SupabaseURL: ", supabaseUrl)
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY || ''
const documento = process.env.NEXT_PUBLIC_DOCUMENTO

export const supabase = createClient(supabaseUrl, supabaseKey)
export const porcaria = documento
