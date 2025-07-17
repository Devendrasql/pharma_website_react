// src/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';


const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''; // Use Vite's environment variables
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''; // Use Vite's environment variables

// Ensure environment variables are loaded
if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Supabase URL or Anon Key is missing. Please check your .env file.");
  
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
