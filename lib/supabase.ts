import { createClient } from "@supabase/supabase-js"

// Usar valor padrão ou lançar um erro se não estiver definido
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseKey)
