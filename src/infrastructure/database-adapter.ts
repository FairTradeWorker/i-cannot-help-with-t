/**
 * Database Adapter
 * Abstracts database operations with auto-upgrade support
 * Starts with Spark KV (free), upgrades to Supabase when triggered
 */

import type { FeatureFlags } from './feature-flags';

export type DatabaseProvider = 'spark-kv' | 'supabase';

export interface DatabaseAdapter {
  provider: DatabaseProvider;
  
  // Core operations
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T): Promise<void>;
  delete(key: string): Promise<boolean>;
  
  // List operations (Supabase only)
  query?<T>(table: string, filters?: Record<string, unknown>): Promise<T[]>;
  insert?<T>(table: string, data: T): Promise<T>;
  update?<T>(table: string, id: string, data: Partial<T>): Promise<T | null>;
  
  // Connection management
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  isConnected(): boolean;
}

/**
 * Spark KV Adapter (Free tier - default)
 * Uses window.spark.kv for storage
 */
class SparkKVAdapter implements DatabaseAdapter {
  provider: DatabaseProvider = 'spark-kv';
  private connected = false;

  async get<T>(key: string): Promise<T | null> {
    if (typeof window !== 'undefined' && window.spark?.kv) {
      return await window.spark.kv.get<T>(key) || null;
    }
    // Fallback to localStorage for development
    const stored = localStorage.getItem(`ftw_${key}`);
    return stored ? JSON.parse(stored) : null;
  }

  async set<T>(key: string, value: T): Promise<void> {
    if (typeof window !== 'undefined' && window.spark?.kv) {
      await window.spark.kv.set(key, value);
      return;
    }
    // Fallback to localStorage for development
    localStorage.setItem(`ftw_${key}`, JSON.stringify(value));
  }

  async delete(key: string): Promise<boolean> {
    if (typeof window !== 'undefined' && window.spark?.kv) {
      await window.spark.kv.set(key, null);
      return true;
    }
    localStorage.removeItem(`ftw_${key}`);
    return true;
  }

  async connect(): Promise<void> {
    this.connected = true;
    console.log('📦 Connected to Spark KV (free tier)');
  }

  async disconnect(): Promise<void> {
    this.connected = false;
  }

  isConnected(): boolean {
    return this.connected;
  }
}

/**
 * Supabase Adapter (Pro tier - activated on upgrade)
 * Uses Supabase client for PostgreSQL operations
 */
class SupabaseAdapter implements DatabaseAdapter {
  provider: DatabaseProvider = 'supabase';
  private connected = false;
  private supabaseUrl: string | null = null;
  private supabaseKey: string | null = null;
  
  // Cache for KV-style operations
  private kvCache = new Map<string, unknown>();

  async get<T>(key: string): Promise<T | null> {
    // Check cache first
    if (this.kvCache.has(key)) {
      return this.kvCache.get(key) as T;
    }
    
    // In production, this would query Supabase
    // For now, fall back to localStorage simulation
    const stored = localStorage.getItem(`supabase_${key}`);
    const value = stored ? JSON.parse(stored) as T : null;
    if (value) {
      this.kvCache.set(key, value);
    }
    return value;
  }

  async set<T>(key: string, value: T): Promise<void> {
    this.kvCache.set(key, value);
    // In production, this would upsert to Supabase
    localStorage.setItem(`supabase_${key}`, JSON.stringify(value));
  }

  async delete(key: string): Promise<boolean> {
    this.kvCache.delete(key);
    localStorage.removeItem(`supabase_${key}`);
    return true;
  }

  async query<T>(table: string, filters?: Record<string, unknown>): Promise<T[]> {
    // Supabase query implementation
    console.log(`📊 Querying ${table} with filters:`, filters);
    // In production: return await supabase.from(table).select().match(filters);
    return [];
  }

  async insert<T>(table: string, data: T): Promise<T> {
    console.log(`📊 Inserting into ${table}:`, data);
    // In production: return await supabase.from(table).insert(data).single();
    return data;
  }

  async update<T>(table: string, id: string, data: Partial<T>): Promise<T | null> {
    console.log(`📊 Updating ${table}[${id}]:`, data);
    // In production: return await supabase.from(table).update(data).eq('id', id).single();
    return null;
  }

  async connect(): Promise<void> {
    this.supabaseUrl = import.meta.env.VITE_SUPABASE_URL || null;
    this.supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || null;
    
    if (!this.supabaseUrl || !this.supabaseKey) {
      console.warn('⚠️ Supabase credentials not configured, using simulation mode');
    }
    
    this.connected = true;
    console.log('🔗 Connected to Supabase (pro tier)');
  }

  async disconnect(): Promise<void> {
    this.kvCache.clear();
    this.connected = false;
  }

  isConnected(): boolean {
    return this.connected;
  }
}

/**
 * Database Factory
 * Creates the appropriate adapter based on feature flags
 */
class DatabaseFactory {
  private currentAdapter: DatabaseAdapter | null = null;
  private currentProvider: DatabaseProvider = 'spark-kv';

  /**
   * Get or create database adapter based on feature flags
   */
  async getAdapter(flags: FeatureFlags): Promise<DatabaseAdapter> {
    const targetProvider: DatabaseProvider = flags.supabasePro ? 'supabase' : 'spark-kv';
    
    // If adapter exists and matches target, return it
    if (this.currentAdapter && this.currentProvider === targetProvider) {
      return this.currentAdapter;
    }
    
    // Disconnect existing adapter
    if (this.currentAdapter) {
      await this.currentAdapter.disconnect();
    }
    
    // Create new adapter
    if (targetProvider === 'supabase') {
      this.currentAdapter = new SupabaseAdapter();
    } else {
      this.currentAdapter = new SparkKVAdapter();
    }
    
    this.currentProvider = targetProvider;
    await this.currentAdapter.connect();
    
    console.log(`🔄 Switched to ${targetProvider} database adapter`);
    return this.currentAdapter;
  }

  /**
   * Get current adapter (creates default if none exists)
   */
  async getCurrentAdapter(): Promise<DatabaseAdapter> {
    if (!this.currentAdapter) {
      this.currentAdapter = new SparkKVAdapter();
      await this.currentAdapter.connect();
    }
    return this.currentAdapter;
  }

  /**
   * Force switch to a specific provider
   */
  async switchProvider(provider: DatabaseProvider): Promise<DatabaseAdapter> {
    const flags: FeatureFlags = {
      supabasePro: provider === 'supabase',
      connectionPooling: provider === 'supabase',
      readReplicas: false,
      redisPro: false,
      globalRedisCluster: false,
      aiResponseCaching: false,
      kubernetes: false,
      multiRegion: false,
      autoScaling: false,
      sentryEnabled: true,
      datadogEnabled: false,
      customDashboards: false,
      cloudflareProEnabled: false,
      wafEnabled: false,
      ddosProtection: false,
      bullmqEnabled: false,
      priorityQueues: false,
      kongGateway: false,
      rateLimiting: false,
      apiVersioning: false,
    };
    return this.getAdapter(flags);
  }
}

// Singleton instance
export const databaseFactory = new DatabaseFactory();

/**
 * Convenience function to get the current database adapter
 */
export async function getDatabase(): Promise<DatabaseAdapter> {
  return databaseFactory.getCurrentAdapter();
}

/**
 * Migrate data from one provider to another
 */
export async function migrateData(
  from: DatabaseAdapter,
  to: DatabaseAdapter,
  keys: string[]
): Promise<{ migrated: number; failed: number }> {
  let migrated = 0;
  let failed = 0;
  
  for (const key of keys) {
    try {
      const value = await from.get(key);
      if (value !== null) {
        await to.set(key, value);
        migrated++;
      }
    } catch (error) {
      console.error(`Failed to migrate key ${key}:`, error);
      failed++;
    }
  }
  
  console.log(`📦 Migration complete: ${migrated} migrated, ${failed} failed`);
  return { migrated, failed };
}
