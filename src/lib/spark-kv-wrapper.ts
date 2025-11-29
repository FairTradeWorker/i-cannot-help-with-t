// Spark KV Wrapper - Wraps window.spark.kv with Supabase proxy
// Falls back to original Spark KV if proxy fails
import { sparkKVProxy } from './spark-kv-proxy';

// Check if we should use proxy (can be controlled via env var)
const USE_KV_PROXY = import.meta.env.VITE_USE_KV_PROXY !== 'false';

// Wrapper that tries proxy first, falls back to Spark KV
export const kvWrapper = {
  async get<T>(key: string): Promise<T | undefined> {
    if (USE_KV_PROXY && typeof window !== 'undefined') {
      try {
        const result = await sparkKVProxy.get<T>(key);
        return result;
      } catch (err) {
        console.warn('KV proxy failed, falling back to Spark KV:', err);
      }
    }
    
    // Fallback to original Spark KV
    if (typeof window !== 'undefined' && window.spark?.kv) {
      return await window.spark.kv.get<T>(key);
    }
    
    return undefined;
  },

  async set<T>(key: string, value: T): Promise<void> {
    if (USE_KV_PROXY && typeof window !== 'undefined') {
      try {
        await sparkKVProxy.set(key, value);
        return;
      } catch (err) {
        console.warn('KV proxy failed, falling back to Spark KV:', err);
      }
    }
    
    // Fallback to original Spark KV
    if (typeof window !== 'undefined' && window.spark?.kv) {
      await window.spark.kv.set(key, value);
    }
  },

  async delete(key: string): Promise<void> {
    if (USE_KV_PROXY && typeof window !== 'undefined') {
      try {
        await sparkKVProxy.delete(key);
        return;
      } catch (err) {
        console.warn('KV proxy failed, falling back to Spark KV:', err);
      }
    }
    
    // Fallback to original Spark KV
    if (typeof window !== 'undefined' && window.spark?.kv) {
      await window.spark.kv.delete(key);
    }
  },

  async keys(): Promise<string[]> {
    if (USE_KV_PROXY && typeof window !== 'undefined') {
      try {
        return await sparkKVProxy.keys();
      } catch (err) {
        console.warn('KV proxy failed, falling back to Spark KV:', err);
      }
    }
    
    // Fallback to original Spark KV
    if (typeof window !== 'undefined' && window.spark?.kv) {
      return await window.spark.kv.keys();
    }
    
    return [];
  },
};

