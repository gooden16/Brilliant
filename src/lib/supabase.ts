import { createClient } from '@supabase/supabase-js';
import { logger } from './logger';

// Get environment variables for Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

// Validate required environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  const error = new Error('Missing Supabase environment variables');
  logger.error('Supabase initialization failed', { error: error.message });
  throw error;
}

logger.info('Initializing Supabase client', { url: supabaseUrl });

/**
 * Supabase client instance configured with:
 * - Automatic token refresh
 * - Persistent sessions
 * - Session detection in URL
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});