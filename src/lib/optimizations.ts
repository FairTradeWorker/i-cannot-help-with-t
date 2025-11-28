/**
 * Platform Optimizations Library
 * 20 Performance and functionality optimizations for FairTradeWorker
 */

// Optimization 1: Debounce utility for search inputs
export function debounce<T extends (...args: unknown[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Optimization 2: Throttle utility for scroll events
export function throttle<T extends (...args: unknown[]) => void>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Optimization 3: Memoization for expensive computations
export function memoize<T extends (...args: unknown[]) => unknown>(
  func: T,
  maxCacheSize = 100
): T {
  const cache = new Map<string, ReturnType<T>>();
  return ((...args: Parameters<T>) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = func(...args) as ReturnType<T>;
    if (cache.size >= maxCacheSize) {
      const firstKey = cache.keys().next().value;
      if (firstKey !== undefined) {
        cache.delete(firstKey);
      }
    }
    cache.set(key, result);
    return result;
  }) as T;
}

// Optimization 4: Virtual list helper for large datasets
export function getVisibleItems<T>(
  items: T[],
  scrollTop: number,
  containerHeight: number,
  itemHeight: number,
  overscan = 3
): { visibleItems: T[]; startIndex: number; endIndex: number; offsetY: number } {
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(
    items.length,
    Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
  );
  return {
    visibleItems: items.slice(startIndex, endIndex),
    startIndex,
    endIndex,
    offsetY: startIndex * itemHeight,
  };
}

// Optimization 5: Lazy image loading helper
export function lazyLoadImage(
  src: string,
  placeholder = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(src);
    img.onerror = reject;
    img.src = src;
  });
}

// Optimization 6: Request batching for API calls
export class RequestBatcher<T, R> {
  private batch: { key: T; resolve: (value: R) => void; reject: (reason?: unknown) => void }[] = [];
  private timeout: ReturnType<typeof setTimeout> | null = null;

  constructor(
    private batchHandler: (keys: T[]) => Promise<Map<T, R>>,
    private delay = 50
  ) {}

  request(key: T): Promise<R> {
    return new Promise((resolve, reject) => {
      this.batch.push({ key, resolve, reject });
      if (!this.timeout) {
        this.timeout = setTimeout(() => this.flush(), this.delay);
      }
    });
  }

  private async flush(): Promise<void> {
    const currentBatch = this.batch;
    this.batch = [];
    this.timeout = null;

    try {
      const keys = currentBatch.map(item => item.key);
      const results = await this.batchHandler(keys);
      currentBatch.forEach(item => {
        const result = results.get(item.key);
        if (result !== undefined) {
          item.resolve(result);
        } else {
          item.reject(new Error('Result not found'));
        }
      });
    } catch (error) {
      currentBatch.forEach(item => item.reject(error));
    }
  }
}

// Optimization 7: Local storage with expiration
export class ExpiringStorage {
  static set(key: string, value: unknown, expirationMs: number): void {
    const item = {
      value,
      expiration: Date.now() + expirationMs,
    };
    try {
      localStorage.setItem(key, JSON.stringify(item));
    } catch {
      // Quota exceeded, clear old items
      this.clearExpired();
      localStorage.setItem(key, JSON.stringify(item));
    }
  }

  static get<T>(key: string): T | null {
    const itemStr = localStorage.getItem(key);
    if (!itemStr) return null;

    try {
      const item = JSON.parse(itemStr) as { value: T; expiration: number };
      if (Date.now() > item.expiration) {
        localStorage.removeItem(key);
        return null;
      }
      return item.value;
    } catch {
      return null;
    }
  }

  static clearExpired(): void {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      try {
        const itemStr = localStorage.getItem(key);
        if (itemStr) {
          const item = JSON.parse(itemStr) as { expiration?: number };
          if (item.expiration && Date.now() > item.expiration) {
            localStorage.removeItem(key);
          }
        }
      } catch {
        // Invalid JSON, skip
      }
    });
  }
}

// Optimization 8: Connection quality detector
export function getConnectionQuality(): 'slow' | 'medium' | 'fast' {
  const connection = (navigator as Navigator & { connection?: { effectiveType?: string; downlink?: number } }).connection;
  if (!connection) return 'medium';

  if (connection.effectiveType === '4g' && (connection.downlink ?? 0) > 5) {
    return 'fast';
  } else if (connection.effectiveType === '2g' || connection.effectiveType === 'slow-2g') {
    return 'slow';
  }
  return 'medium';
}

// Optimization 9: Prefetch resources
export function prefetchResources(urls: string[]): void {
  if (getConnectionQuality() === 'slow') return;

  urls.forEach(url => {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = url;
    document.head.appendChild(link);
  });
}

// Optimization 10: Performance timing utility
export class PerformanceTracker {
  private marks: Map<string, number> = new Map();

  mark(name: string): void {
    this.marks.set(name, performance.now());
  }

  measure(name: string, startMark: string): number {
    const start = this.marks.get(startMark);
    if (!start) return -1;
    const duration = performance.now() - start;
    console.debug(`[Performance] ${name}: ${duration.toFixed(2)}ms`);
    return duration;
  }
}

// Optimization 11: Intersection observer factory
export function createVisibilityObserver(
  callback: (isVisible: boolean, entry: IntersectionObserverEntry) => void,
  options: IntersectionObserverInit = {}
): IntersectionObserver {
  return new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        callback(entry.isIntersecting, entry);
      });
    },
    { threshold: 0.1, ...options }
  );
}

// Optimization 12: Retry with exponential backoff
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  baseDelay = 1000
): Promise<T> {
  let lastError: Error | undefined;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      if (attempt < maxRetries - 1) {
        const delay = baseDelay * Math.pow(2, attempt);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError;
}

// Optimization 13: Concurrent request limiter
export class ConcurrencyLimiter {
  private running = 0;
  private queue: (() => void)[] = [];

  constructor(private maxConcurrent: number) {}

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (this.running >= this.maxConcurrent) {
      await new Promise<void>(resolve => this.queue.push(resolve));
    }

    this.running++;
    try {
      return await fn();
    } finally {
      this.running--;
      const next = this.queue.shift();
      if (next) next();
    }
  }
}

// Optimization 14: Data compression for large payloads
export function compressData(data: string): string {
  // Simple RLE compression for repeated characters
  let result = '';
  let count = 1;
  for (let i = 0; i < data.length; i++) {
    if (data[i] === data[i + 1]) {
      count++;
    } else {
      result += count > 3 ? `${count}${data[i]}` : data[i].repeat(count);
      count = 1;
    }
  }
  return result;
}

// Optimization 15: Smart cache invalidation
export class SmartCache<K, V> {
  private cache = new Map<K, { value: V; accessCount: number; lastAccess: number }>();

  constructor(
    private maxSize: number,
    private ttl: number = 300000 // 5 minutes default
  ) {}

  set(key: K, value: V): void {
    this.evictIfNeeded();
    this.cache.set(key, {
      value,
      accessCount: 1,
      lastAccess: Date.now(),
    });
  }

  get(key: K): V | undefined {
    const entry = this.cache.get(key);
    if (!entry) return undefined;

    if (Date.now() - entry.lastAccess > this.ttl) {
      this.cache.delete(key);
      return undefined;
    }

    entry.accessCount++;
    entry.lastAccess = Date.now();
    return entry.value;
  }

  private evictIfNeeded(): void {
    if (this.cache.size < this.maxSize) return;

    // Evict least frequently used
    let minKey: K | null = null;
    let minScore = Infinity;

    this.cache.forEach((entry, key) => {
      const score = entry.accessCount / (Date.now() - entry.lastAccess + 1);
      if (score < minScore) {
        minScore = score;
        minKey = key;
      }
    });

    if (minKey !== null) {
      this.cache.delete(minKey);
    }
  }
}

// Optimization 16: DOM update batching
export class DOMBatcher {
  private updates: (() => void)[] = [];
  private scheduled = false;

  schedule(update: () => void): void {
    this.updates.push(update);
    if (!this.scheduled) {
      this.scheduled = true;
      requestAnimationFrame(() => this.flush());
    }
  }

  private flush(): void {
    const updates = this.updates;
    this.updates = [];
    this.scheduled = false;
    updates.forEach(update => update());
  }
}

// Optimization 17: Event delegation helper
export function delegateEvent(
  container: HTMLElement,
  eventType: string,
  selector: string,
  handler: (event: Event, target: Element) => void
): () => void {
  const listener = (event: Event) => {
    const target = event.target as Element;
    const delegateTarget = target.closest(selector);
    if (delegateTarget && container.contains(delegateTarget)) {
      handler(event, delegateTarget);
    }
  };

  container.addEventListener(eventType, listener);
  return () => container.removeEventListener(eventType, listener);
}

// Optimization 18: Animation frame scheduler
export class AnimationScheduler {
  private callbacks = new Set<(timestamp: number) => void>();
  private running = false;

  add(callback: (timestamp: number) => void): () => void {
    this.callbacks.add(callback);
    if (!this.running) {
      this.running = true;
      this.loop();
    }
    return () => this.callbacks.delete(callback);
  }

  private loop(timestamp = 0): void {
    if (this.callbacks.size === 0) {
      this.running = false;
      return;
    }
    this.callbacks.forEach(cb => cb(timestamp));
    requestAnimationFrame(ts => this.loop(ts));
  }
}

// Optimization 19: Memory-efficient event emitter
export class LightEmitter<T extends Record<string, unknown[]>> {
  private handlers = new Map<keyof T, Set<(...args: unknown[]) => void>>();

  on<K extends keyof T>(event: K, handler: (...args: T[K]) => void): () => void {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, new Set());
    }
    this.handlers.get(event)!.add(handler as (...args: unknown[]) => void);
    return () => this.handlers.get(event)?.delete(handler as (...args: unknown[]) => void);
  }

  emit<K extends keyof T>(event: K, ...args: T[K]): void {
    this.handlers.get(event)?.forEach(handler => handler(...args));
  }

  clear(): void {
    this.handlers.clear();
  }
}

// Optimization 20: Network-aware data fetching
export async function networkAwareFetch(
  url: string,
  options?: RequestInit
): Promise<Response> {
  const quality = getConnectionQuality();

  const defaultOptions: RequestInit = {
    ...options,
    headers: {
      ...options?.headers,
      'X-Connection-Quality': quality,
    },
  };

  // Add timeout based on connection quality
  const timeout = quality === 'slow' ? 30000 : quality === 'medium' ? 15000 : 10000;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...defaultOptions,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

export const performanceTracker = new PerformanceTracker();
export const domBatcher = new DOMBatcher();
export const animationScheduler = new AnimationScheduler();
