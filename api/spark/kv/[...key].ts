// Supabase-backed KV proxy for Spark KV API
// Mimics window.spark.kv API but uses Supabase tables
// Vercel serverless function format
import { createClient } from '@supabase/supabase-js';

// Vercel provides env vars without VITE_ prefix in serverless functions
const supabaseUrl = process.env.VITE_SUPABASE_URL || 
                    process.env.NEXT_PUBLIC_SUPABASE_URL || 
                    process.env.SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 
                    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 
                    process.env.SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.warn('Supabase credentials not found. KV proxy will use fallback.');
}

const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

// Extract namespace from key (e.g., 'users' from 'users' or 'jobs/123')
function getNamespace(key: string): string {
  const parts = key.split('/');
  return parts[0] || 'default';
}

// Get table name from namespace
function getTableName(namespace: string): string {
  return `kv_${namespace}`;
}

export async function GET(request: Request): Promise<Response> {
  try {
    const url = new URL(request.url);
    const key = url.pathname.replace('/api/spark/kv/', '').replace(/%2F/g, '/');
    
    if (!key) {
      return new Response(JSON.stringify({ error: 'Key required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (!supabase) {
      // Fallback: return empty/null
      return new Response(JSON.stringify(null), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const namespace = getNamespace(key);
    const tableName = getTableName(namespace);

    // Try to get the value
    const { data, error } = await supabase
      .from(tableName)
      .select('data')
      .eq('id', key)
      .single();

    if (error) {
      // If table doesn't exist or row not found, return null
      if (error.code === 'PGRST116' || error.code === '42P01') {
        return new Response(JSON.stringify(null), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      throw error;
    }

    return new Response(JSON.stringify(data?.data || null), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    console.error('KV GET failed:', err);
    // Always return valid JSON, never HTML
    return new Response(JSON.stringify({ error: 'KV unavailable', details: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function POST(request: Request): Promise<Response> {
  try {
    const url = new URL(request.url);
    const key = url.pathname.replace('/api/spark/kv/', '').replace(/%2F/g, '/');
    
    if (!key) {
      return new Response(JSON.stringify({ error: 'Key required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const body = await request.json();
    const value = body.value !== undefined ? body.value : body;

    if (!supabase) {
      // Fallback: return success (data stored in localStorage via client-side fallback)
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const namespace = getNamespace(key);
    const tableName = getTableName(namespace);

    // Upsert the value
    const { error } = await supabase
      .from(tableName)
      .upsert({ id: key, data: value, updated_at: new Date().toISOString() }, {
        onConflict: 'id'
      });

    if (error) {
      // If table doesn't exist, try to create it (this will fail, but we'll handle gracefully)
      if (error.code === '42P01') {
        console.warn(`Table ${tableName} does not exist. Please create it in Supabase.`);
        return new Response(JSON.stringify({ error: 'Table does not exist', table: tableName }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      throw error;
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    console.error('KV POST failed:', err);
    return new Response(JSON.stringify({ error: 'KV unavailable', details: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function PUT(request: Request): Promise<Response> {
  // PUT is same as POST (upsert)
  return POST(request);
}

export async function DELETE(request: Request): Promise<Response> {
  try {
    const url = new URL(request.url);
    const key = url.pathname.replace('/api/spark/kv/', '').replace(/%2F/g, '/');
    
    if (!key) {
      return new Response(JSON.stringify({ error: 'Key required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (!supabase) {
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const namespace = getNamespace(key);
    const tableName = getTableName(namespace);

    const { error } = await supabase
      .from(tableName)
      .delete()
      .eq('id', key);

    if (error) {
      if (error.code === '42P01') {
        // Table doesn't exist, consider it deleted
        return new Response(JSON.stringify({ success: true }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      throw error;
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    console.error('KV DELETE failed:', err);
    return new Response(JSON.stringify({ error: 'KV unavailable', details: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

