// Database Client for Supabase
// Centralized database connection and utilities

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Supabase credentials not found. Some features may not work.');
}

// Client for client-side usage (uses anon key)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Admin client for server-side usage (uses service role key)
export const supabaseAdmin = supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  : null;

// Database helper functions
export async function dbQuery<T>(query: string, params?: any[]): Promise<T[]> {
  try {
    // For Supabase, we use the client methods instead of raw SQL
    // This is a placeholder for if we need raw queries
    return [] as T[];
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

// Type-safe table helpers
export const db = {
  users: () => supabase.from('users'),
  jobs: () => supabase.from('jobs'),
  bids: () => supabase.from('bids'),
  messages: () => supabase.from('messages'),
  territories: () => supabase.from('territories'),
  notifications: () => supabase.from('notifications'),
  payments: () => supabase.from('payments'),
  subscriptions: () => supabase.from('subscriptions'),
};

