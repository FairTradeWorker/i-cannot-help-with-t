// Spark KV Proxy - Supabase-backed KV with localStorage fallback
// Handles parse errors and 405 responses gracefully

const SPARK_KV_BASE = '/api/spark/kv';

interface KVResponse<T> {
  success?: boolean;
  error?: string;
  data?: T;
}

// Fallback to localStorage for dev/offline
function fallbackKV<T>(key: string, method: string, body?: any): T | null {
  const lsKey = `fallback_kv_${key}`;
  
  try {
    if (method === 'GET') {
      const stored = localStorage.getItem(lsKey);
      return stored ? JSON.parse(stored) : null;
    } else if (method === 'POST' || method === 'PUT') {
      const value = body?.value !== undefined ? body.value : body;
      localStorage.setItem(lsKey, JSON.stringify(value));
      return { success: true } as T;
    } else if (method === 'DELETE') {
      localStorage.removeItem(lsKey);
      return { success: true } as T;
    }
  } catch (err) {
    console.error('LocalStorage fallback failed:', err);
  }
  
  return null;
}

// Safe JSON parse with fallback
function safeJsonParse<T>(text: string): T | null {
  try {
    return JSON.parse(text) as T;
  } catch {
    console.warn('Failed to parse KV response as JSON');
    return null;
  }
}

// Main KV request function
async function kvRequest<T>(
  key: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  body?: any
): Promise<T | null> {
  try {
    // URL-encode slashes in key
    const encodedKey = key.replace(/\//g, '%2F');
    const url = `${SPARK_KV_BASE}/${encodedKey}`;
    
    const opts: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (body && (method === 'POST' || method === 'PUT')) {
      opts.body = JSON.stringify(body);
    }

    const res = await fetch(url, opts);

    // Handle 405 (Method Not Allowed) - fallback to localStorage
    if (res.status === 405) {
      console.warn(`KV ${method} not allowed – falling back to localStorage`);
      return fallbackKV<T>(key, method, body);
    }

    // Handle other errors
    if (!res.ok) {
      // Try to parse error, but don't crash on HTML
      const text = await res.text();
      const errorData = safeJsonParse<{ error?: string }>(text);
      
      console.warn(`KV ${method} failed: ${res.status}`, errorData?.error || text.substring(0, 100));
      
      // Fallback to localStorage for client-side errors
      if (res.status >= 400 && res.status < 500) {
        return fallbackKV<T>(key, method, body);
      }
      
      throw new Error(`KV ${method} failed: ${res.status}`);
    }

    // Parse response safely
    const text = await res.text();
    const data = safeJsonParse<T>(text);
    
    return data;
  } catch (err) {
    console.error('KV request failed:', err);
    // Fallback to localStorage on any error
    return fallbackKV<T>(key, method, body);
  }
}

// Spark KV API wrapper
export const sparkKVProxy = {
  async get<T>(key: string): Promise<T | undefined> {
    const data = await kvRequest<T>(key, 'GET');
    return data === null ? undefined : data;
  },

  async set<T>(key: string, value: T): Promise<void> {
    await kvRequest<{ success: boolean }>(key, 'POST', { value });
  },

  async delete(key: string): Promise<void> {
    await kvRequest<{ success: boolean }>(key, 'DELETE');
  },

  async keys(): Promise<string[]> {
    // This would require a different endpoint or scanning all tables
    // For now, return empty array (can be enhanced later)
    console.warn('keys() not implemented in proxy - returning empty array');
    return [];
  },
};

// Helper function for getOrSet pattern
export async function getOrSetKey<T>(
  key: string,
  setterFn: () => Promise<T> | T
): Promise<T> {
  let data = await sparkKVProxy.get<T>(key);
  
  if (data === undefined || data === null) {
    data = await setterFn();
    await sparkKVProxy.set(key, data);
  }
  
  return data;
}

