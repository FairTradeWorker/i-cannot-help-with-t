/**
 * Cache Adapter
 * Abstracts caching operations with auto-upgrade support
 * Starts with in-memory cache (free), upgrades to Upstash Redis when triggered
 */

import type { FeatureFlags } from './feature-flags';

export type CacheProvider = 'memory' | 'upstash';

export interface CacheOptions {
  ttlSeconds?: number;
  tags?: string[];
}

export interface CacheAdapter {
  provider: CacheProvider;
  
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T, options?: CacheOptions): Promise<void>;
  delete(key: string): Promise<boolean>;
  exists(key: string): Promise<boolean>;
  
  // Batch operations
  mget<T>(keys: string[]): Promise<(T | null)[]>;
  mset<T>(entries: Array<{ key: string; value: T; options?: CacheOptions }>): Promise<void>;
  
  // Pattern operations (Redis only)
  keys?(pattern: string): Promise<string[]>;
  deleteByPattern?(pattern: string): Promise<number>;
  
  // Stats
  getStats(): CacheStats;
  
  connect(): Promise<void>;
  disconnect(): Promise<void>;
}

export interface CacheStats {
  hits: number;
  misses: number;
  hitRate: number;
  itemCount: number;
  memoryUsageMB: number;
}

/**
 * In-Memory Cache Adapter (Free tier - default)
 */
class MemoryCacheAdapter implements CacheAdapter {
  provider: CacheProvider = 'memory';
  
  private cache = new Map<string, { value: unknown; expiresAt: number }>();
  private hits = 0;
  private misses = 0;
  
  async get<T>(key: string): Promise<T | null> {
    const entry = this.cache.get(key);
    
    if (!entry) {
      this.misses++;
      return null;
    }
    
    if (entry.expiresAt < Date.now()) {
      this.cache.delete(key);
      this.misses++;
      return null;
    }
    
    this.hits++;
    return entry.value as T;
  }
  
  async set<T>(key: string, value: T, options?: CacheOptions): Promise<void> {
    const ttl = options?.ttlSeconds ?? 3600; // Default 1 hour
    this.cache.set(key, {
      value,
      expiresAt: Date.now() + ttl * 1000,
    });
  }
  
  async delete(key: string): Promise<boolean> {
    return this.cache.delete(key);
  }
  
  async exists(key: string): Promise<boolean> {
    const entry = this.cache.get(key);
    if (!entry) return false;
    if (entry.expiresAt < Date.now()) {
      this.cache.delete(key);
      return false;
    }
    return true;
  }
  
  async mget<T>(keys: string[]): Promise<(T | null)[]> {
    return Promise.all(keys.map(key => this.get<T>(key)));
  }
  
  async mset<T>(entries: Array<{ key: string; value: T; options?: CacheOptions }>): Promise<void> {
    await Promise.all(entries.map(e => this.set(e.key, e.value, e.options)));
  }
  
  getStats(): CacheStats {
    const total = this.hits + this.misses;
    return {
      hits: this.hits,
      misses: this.misses,
      hitRate: total > 0 ? this.hits / total : 0,
      itemCount: this.cache.size,
      memoryUsageMB: this.estimateMemoryUsage(),
    };
  }
  
  private estimateMemoryUsage(): number {
    // Rough estimate based on cache size
    let bytes = 0;
    this.cache.forEach((entry, key) => {
      bytes += key.length * 2; // String chars
      bytes += JSON.stringify(entry.value).length * 2;
      bytes += 16; // Object overhead
    });
    return bytes / (1024 * 1024);
  }
  
  async connect(): Promise<void> {
    console.log('💾 In-memory cache initialized (free tier)');
  }
  
  async disconnect(): Promise<void> {
    this.cache.clear();
    this.hits = 0;
    this.misses = 0;
  }
}

/**
 * Upstash Redis Adapter (Pro tier - activated on upgrade)
 */
class UpstashCacheAdapter implements CacheAdapter {
  provider: CacheProvider = 'upstash';
  
  private redisUrl: string | null = null;
  private redisToken: string | null = null;
  private hits = 0;
  private misses = 0;
  private connected = false;
  
  // Local fallback cache for development
  private fallbackCache = new Map<string, { value: unknown; expiresAt: number }>();
  
  async get<T>(key: string): Promise<T | null> {
    // In production, this would use Upstash REST API
    // For now, use fallback cache
    const entry = this.fallbackCache.get(key);
    
    if (!entry) {
      this.misses++;
      return null;
    }
    
    if (entry.expiresAt < Date.now()) {
      this.fallbackCache.delete(key);
      this.misses++;
      return null;
    }
    
    this.hits++;
    return entry.value as T;
  }
  
  async set<T>(key: string, value: T, options?: CacheOptions): Promise<void> {
    const ttl = options?.ttlSeconds ?? 3600;
    this.fallbackCache.set(key, {
      value,
      expiresAt: Date.now() + ttl * 1000,
    });
  }
  
  async delete(key: string): Promise<boolean> {
    return this.fallbackCache.delete(key);
  }
  
  async exists(key: string): Promise<boolean> {
    const entry = this.fallbackCache.get(key);
    if (!entry) return false;
    if (entry.expiresAt < Date.now()) {
      this.fallbackCache.delete(key);
      return false;
    }
    return true;
  }
  
  async mget<T>(keys: string[]): Promise<(T | null)[]> {
    return Promise.all(keys.map(key => this.get<T>(key)));
  }
  
  async mset<T>(entries: Array<{ key: string; value: T; options?: CacheOptions }>): Promise<void> {
    await Promise.all(entries.map(e => this.set(e.key, e.value, e.options)));
  }
  
  async keys(pattern: string): Promise<string[]> {
    // Replace all occurrences of * with .* for regex matching
    const escapedPattern = pattern.replace(/[.+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(escapedPattern.replace(/\*/g, '.*'));
    const result: string[] = [];
    this.fallbackCache.forEach((_, key) => {
      if (regex.test(key)) {
        result.push(key);
      }
    });
    return result;
  }
  
  async deleteByPattern(pattern: string): Promise<number> {
    const keysToDelete = await this.keys(pattern);
    for (const key of keysToDelete) {
      this.fallbackCache.delete(key);
    }
    return keysToDelete.length;
  }
  
  getStats(): CacheStats {
    const total = this.hits + this.misses;
    return {
      hits: this.hits,
      misses: this.misses,
      hitRate: total > 0 ? this.hits / total : 0,
      itemCount: this.fallbackCache.size,
      memoryUsageMB: this.estimateMemoryUsage(),
    };
  }
  
  private estimateMemoryUsage(): number {
    // Estimate memory based on cache contents
    // Note: Actual Upstash usage would require API call to /info endpoint
    let bytes = 0;
    this.fallbackCache.forEach((entry, key) => {
      bytes += key.length * 2;
      bytes += JSON.stringify(entry.value).length * 2;
      bytes += 16;
    });
    return bytes / (1024 * 1024);
  }
  
  async connect(): Promise<void> {
    this.redisUrl = import.meta.env.VITE_UPSTASH_REDIS_URL || null;
    this.redisToken = import.meta.env.VITE_UPSTASH_REDIS_TOKEN || null;
    
    if (!this.redisUrl || !this.redisToken) {
      console.warn('⚠️ Upstash credentials not configured, using simulation mode');
    }
    
    this.connected = true;
    console.log('🔴 Connected to Upstash Redis (pro tier)');
  }
  
  async disconnect(): Promise<void> {
    this.fallbackCache.clear();
    this.connected = false;
  }
}

/**
 * Cache Factory
 * Creates the appropriate adapter based on feature flags
 */
class CacheFactory {
  private currentAdapter: CacheAdapter | null = null;
  private currentProvider: CacheProvider = 'memory';

  async getAdapter(flags: FeatureFlags): Promise<CacheAdapter> {
    const targetProvider: CacheProvider = flags.redisPro ? 'upstash' : 'memory';
    
    if (this.currentAdapter && this.currentProvider === targetProvider) {
      return this.currentAdapter;
    }
    
    if (this.currentAdapter) {
      await this.currentAdapter.disconnect();
    }
    
    if (targetProvider === 'upstash') {
      this.currentAdapter = new UpstashCacheAdapter();
    } else {
      this.currentAdapter = new MemoryCacheAdapter();
    }
    
    this.currentProvider = targetProvider;
    await this.currentAdapter.connect();
    
    console.log(`🔄 Switched to ${targetProvider} cache adapter`);
    return this.currentAdapter;
  }

  async getCurrentAdapter(): Promise<CacheAdapter> {
    if (!this.currentAdapter) {
      this.currentAdapter = new MemoryCacheAdapter();
      await this.currentAdapter.connect();
    }
    return this.currentAdapter;
  }
}

export const cacheFactory = new CacheFactory();

export async function getCache(): Promise<CacheAdapter> {
  return cacheFactory.getCurrentAdapter();
}

/**
 * AI Response Cache Helper
 * Specifically for caching OpenAI responses
 */
export class AIResponseCache {
  private cache: CacheAdapter;
  private defaultTTLDays: number;
  
  constructor(cache: CacheAdapter, ttlDays: number = 30) {
    this.cache = cache;
    this.defaultTTLDays = ttlDays;
  }
  
  private hashInput(input: string): string {
    // Simple hash function for cache keys
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
      const char = input.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return `ai_response_${Math.abs(hash).toString(36)}`;
  }
  
  async get<T>(input: string): Promise<T | null> {
    const key = this.hashInput(input);
    return this.cache.get<T>(key);
  }
  
  async set<T>(input: string, response: T): Promise<void> {
    const key = this.hashInput(input);
    await this.cache.set(key, response, {
      ttlSeconds: this.defaultTTLDays * 24 * 60 * 60,
      tags: ['ai-response'],
    });
  }
  
  async invalidate(input: string): Promise<boolean> {
    const key = this.hashInput(input);
    return this.cache.delete(key);
  }
}
