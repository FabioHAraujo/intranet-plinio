import { createClient } from "@supabase/supabase-js"

const supabaseUrl = "http://supabasekong-y84swckocg0oswok80k8wg84.144.33.31.46.sslip.io"
const supabaseKey = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzdXBhYmFzZSIsImlhdCI6MTcyNzQzODU4MCwiZXhwIjo0ODgzMTEyMTgwLCJyb2xlIjoic2VydmljZV9yb2xlIn0.bGlrUoJRvCDim80bB6NaZUmzPmMmRmt8j8I0EEyZIgo"

export const supabase = createClient(supabaseUrl, supabaseKey)