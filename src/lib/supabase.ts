import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/database';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabasePublishableKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  (import.meta.env as any).VITE_SUPABASE_ANON_KEY ||
  '';

if (!supabaseUrl || !supabasePublishableKey) {
  console.warn(
    'Supabase URL or Publishable Key is missing in environment variables. Please check your .env or .env.local configuration.'
  );
}

// Create a single supabase client for interacting with your database
export const supabase = createClient<Database>(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabasePublishableKey || 'placeholder'
);
