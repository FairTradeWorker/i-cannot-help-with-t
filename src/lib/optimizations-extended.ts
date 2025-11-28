/**
 * Extended Platform Optimizations Library
 * 40 Additional Performance and functionality optimizations (21-60)
 * Combined with base optimizations.ts, this provides 60 total optimizations
 */

// Optimization 21: Image optimization with WebP/AVIF support detection
export function getOptimalImageFormat(): 'avif' | 'webp' | 'jpg' {
  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;
  
  if (canvas.toDataURL('image/avif').indexOf('data:image/avif') === 0) {
    return 'avif';
  }
  if (canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0) {
    return 'webp';
  }
  return 'jpg';
}

// Optimization 22: Service Worker registration helper
export async function registerServiceWorker(swPath: string): Promise<ServiceWorkerRegistration | null> {
  if (!('serviceWorker' in navigator)) return null;
  
  try {
    const registration = await navigator.serviceWorker.register(swPath);
    console.log('SW registered:', registration.scope);
    return registration;
  } catch (error) {
    console.error('SW registration failed:', error);
    return null;
  }
}

// Optimization 23: IndexedDB wrapper for large data storage
export class IndexedDBStore {
  private dbName: string;
  private storeName: string;
  private db: IDBDatabase | null = null;

  constructor(dbName: string, storeName: string) {
    this.dbName = dbName;
    this.storeName = storeName;
  }

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 1);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };
      
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName, { keyPath: 'id' });
        }
      };
    });
  }

  async set(id: string, data: unknown): Promise<void> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.put({ id, data, timestamp: Date.now() });
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  async get<T>(id: string): Promise<T | null> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
      const request = store.get(id);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        resolve(request.result?.data ?? null);
      };
    });
  }

  async delete(id: string): Promise<void> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.delete(id);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  async clear(): Promise<void> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.clear();
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }
}

// Optimization 24: Web Worker task offloader
export class WorkerPool {
  private workers: Worker[] = [];
  private taskQueue: Array<{ task: unknown; resolve: (value: unknown) => void; reject: (reason?: unknown) => void }> = [];
  private busyWorkers = new Set<Worker>();

  constructor(workerScript: string, poolSize = navigator.hardwareConcurrency || 4) {
    for (let i = 0; i < poolSize; i++) {
      const worker = new Worker(workerScript);
      this.workers.push(worker);
    }
  }

  async execute<T, R>(task: T): Promise<R> {
    return new Promise((resolve, reject) => {
      const availableWorker = this.workers.find(w => !this.busyWorkers.has(w));
      
      if (availableWorker) {
        this.runTask(availableWorker, task, resolve as (value: unknown) => void, reject);
      } else {
        this.taskQueue.push({ task, resolve: resolve as (value: unknown) => void, reject });
      }
    });
  }

  private runTask(
    worker: Worker,
    task: unknown,
    resolve: (value: unknown) => void,
    reject: (reason?: unknown) => void
  ): void {
    this.busyWorkers.add(worker);
    
    const handler = (e: MessageEvent) => {
      worker.removeEventListener('message', handler);
      worker.removeEventListener('error', errorHandler);
      this.busyWorkers.delete(worker);
      resolve(e.data);
      this.processQueue();
    };
    
    const errorHandler = (e: ErrorEvent) => {
      worker.removeEventListener('message', handler);
      worker.removeEventListener('error', errorHandler);
      this.busyWorkers.delete(worker);
      reject(e.error);
      this.processQueue();
    };
    
    worker.addEventListener('message', handler);
    worker.addEventListener('error', errorHandler);
    worker.postMessage(task);
  }

  private processQueue(): void {
    if (this.taskQueue.length === 0) return;
    
    const availableWorker = this.workers.find(w => !this.busyWorkers.has(w));
    if (!availableWorker) return;
    
    const { task, resolve, reject } = this.taskQueue.shift()!;
    this.runTask(availableWorker, task, resolve, reject);
  }

  terminate(): void {
    this.workers.forEach(w => w.terminate());
    this.workers = [];
    this.taskQueue = [];
    this.busyWorkers.clear();
  }
}

// Optimization 25: Request deduplication
export class RequestDeduplicator {
  private pendingRequests = new Map<string, Promise<unknown>>();

  async dedupe<T>(key: string, request: () => Promise<T>): Promise<T> {
    if (this.pendingRequests.has(key)) {
      return this.pendingRequests.get(key) as Promise<T>;
    }

    const promise = request().finally(() => {
      this.pendingRequests.delete(key);
    });

    this.pendingRequests.set(key, promise);
    return promise;
  }
}

// Optimization 26: Optimistic updates manager
export class OptimisticUpdateManager<T> {
  private originalValue: T | null = null;
  private rollbackTimeout: ReturnType<typeof setTimeout> | null = null;

  optimisticUpdate(
    getCurrentValue: () => T,
    setOptimisticValue: (value: T) => void,
    optimisticValue: T,
    confirmUpdate: () => Promise<T>,
    timeoutMs = 5000
  ): Promise<T> {
    this.originalValue = getCurrentValue();
    setOptimisticValue(optimisticValue);

    this.rollbackTimeout = setTimeout(() => {
      if (this.originalValue !== null) {
        setOptimisticValue(this.originalValue);
      }
    }, timeoutMs);

    return confirmUpdate()
      .then(result => {
        if (this.rollbackTimeout) {
          clearTimeout(this.rollbackTimeout);
        }
        this.originalValue = null;
        return result;
      })
      .catch(error => {
        if (this.rollbackTimeout) {
          clearTimeout(this.rollbackTimeout);
        }
        if (this.originalValue !== null) {
          setOptimisticValue(this.originalValue);
        }
        this.originalValue = null;
        throw error;
      });
  }
}

// Optimization 27: Render priority scheduler
export class RenderPriorityScheduler {
  private highPriority: (() => void)[] = [];
  private normalPriority: (() => void)[] = [];
  private lowPriority: (() => void)[] = [];
  private isProcessing = false;

  schedule(callback: () => void, priority: 'high' | 'normal' | 'low' = 'normal'): void {
    switch (priority) {
      case 'high':
        this.highPriority.push(callback);
        break;
      case 'normal':
        this.normalPriority.push(callback);
        break;
      case 'low':
        this.lowPriority.push(callback);
        break;
    }

    if (!this.isProcessing) {
      this.processQueue();
    }
  }

  private processQueue(): void {
    this.isProcessing = true;

    const processNext = () => {
      let callback: (() => void) | undefined;

      if (this.highPriority.length > 0) {
        callback = this.highPriority.shift();
      } else if (this.normalPriority.length > 0) {
        callback = this.normalPriority.shift();
      } else if (this.lowPriority.length > 0) {
        callback = this.lowPriority.shift();
      }

      if (callback) {
        requestAnimationFrame(() => {
          callback!();
          processNext();
        });
      } else {
        this.isProcessing = false;
      }
    };

    processNext();
  }
}

// Optimization 28: Bandwidth estimation
export class BandwidthEstimator {
  private samples: number[] = [];
  private maxSamples = 10;

  async measure(testUrl: string, testSize: number): Promise<number> {
    const start = performance.now();
    
    try {
      await fetch(testUrl, { cache: 'no-store' });
      const duration = performance.now() - start;
      const bandwidth = (testSize * 8) / (duration / 1000); // bits per second
      
      this.samples.push(bandwidth);
      if (this.samples.length > this.maxSamples) {
        this.samples.shift();
      }
      
      return bandwidth;
    } catch {
      return 0;
    }
  }

  getAverageBandwidth(): number {
    if (this.samples.length === 0) return 0;
    return this.samples.reduce((a, b) => a + b, 0) / this.samples.length;
  }

  getQuality(): 'poor' | 'moderate' | 'good' | 'excellent' {
    const avg = this.getAverageBandwidth();
    if (avg < 1_000_000) return 'poor'; // < 1 Mbps
    if (avg < 5_000_000) return 'moderate'; // 1-5 Mbps
    if (avg < 25_000_000) return 'good'; // 5-25 Mbps
    return 'excellent'; // > 25 Mbps
  }
}

// Optimization 29: Component render tracker
export class RenderTracker {
  private renders = new Map<string, { count: number; totalTime: number; lastRender: number }>();

  trackRender(componentName: string, renderTime: number): void {
    const existing = this.renders.get(componentName) || { count: 0, totalTime: 0, lastRender: 0 };
    this.renders.set(componentName, {
      count: existing.count + 1,
      totalTime: existing.totalTime + renderTime,
      lastRender: Date.now(),
    });
  }

  getStats(componentName: string): { count: number; avgTime: number; lastRender: number } | null {
    const data = this.renders.get(componentName);
    if (!data) return null;
    return {
      count: data.count,
      avgTime: data.totalTime / data.count,
      lastRender: data.lastRender,
    };
  }

  getSlowComponents(threshold = 16): string[] {
    const slow: string[] = [];
    this.renders.forEach((data, name) => {
      if (data.totalTime / data.count > threshold) {
        slow.push(name);
      }
    });
    return slow;
  }

  reset(): void {
    this.renders.clear();
  }
}

// Optimization 30: Scroll position persistence
export class ScrollPositionManager {
  private positions = new Map<string, number>();

  save(key: string, element?: HTMLElement): void {
    const scrollTop = element?.scrollTop ?? window.scrollY;
    this.positions.set(key, scrollTop);
    sessionStorage.setItem(`scroll_${key}`, String(scrollTop));
  }

  restore(key: string, element?: HTMLElement): void {
    const cached = ((this.positions.get(key) ?? Number(sessionStorage.getItem(`scroll_${key}`))) || 0);
    
    if (element) {
      element.scrollTop = cached;
    } else {
      window.scrollTo(0, cached);
    }
  }

  clear(key: string): void {
    this.positions.delete(key);
    sessionStorage.removeItem(`scroll_${key}`);
  }
}

// Optimization 31: Focus management
export class FocusManager {
  private focusStack: HTMLElement[] = [];

  trapFocus(container: HTMLElement): () => void {
    const focusableElements = container.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    const previousFocus = document.activeElement as HTMLElement;
    this.focusStack.push(previousFocus);
    
    firstElement?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement?.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement?.focus();
      }
    };

    container.addEventListener('keydown', handleKeyDown);

    return () => {
      container.removeEventListener('keydown', handleKeyDown);
      const previousElement = this.focusStack.pop();
      previousElement?.focus();
    };
  }
}

// Optimization 32: Preload critical resources
export function preloadCriticalResources(resources: Array<{ url: string; as: string; type?: string }>): void {
  resources.forEach(({ url, as, type }) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = url;
    link.as = as;
    if (type) link.type = type;
    document.head.appendChild(link);
  });
}

// Optimization 33: CSS containment helper
export function applyCSSContainment(selector: string, containment: string = 'layout style paint'): void {
  const style = document.createElement('style');
  style.textContent = `${selector} { contain: ${containment}; }`;
  document.head.appendChild(style);
}

// Optimization 34: Font loading optimization
export async function loadFontsOptimized(fonts: Array<{ family: string; url: string; weight?: string }>): Promise<void> {
  const fontFaces = fonts.map(({ family, url, weight = 'normal' }) => {
    const font = new FontFace(family, `url(${url})`, { weight });
    return font.load();
  });

  const loadedFonts = await Promise.all(fontFaces);
  loadedFonts.forEach(font => document.fonts.add(font));
}

// Optimization 35: Image dimension calculator (prevent layout shift)
export function calculateImageDimensions(
  originalWidth: number,
  originalHeight: number,
  maxWidth: number,
  maxHeight: number
): { width: number; height: number } {
  const aspectRatio = originalWidth / originalHeight;
  
  let width = originalWidth;
  let height = originalHeight;
  
  if (width > maxWidth) {
    width = maxWidth;
    height = width / aspectRatio;
  }
  
  if (height > maxHeight) {
    height = maxHeight;
    width = height * aspectRatio;
  }
  
  return { width: Math.round(width), height: Math.round(height) };
}

// Optimization 36: Critical CSS extractor helper
export function inlineCriticalCSS(css: string): void {
  const style = document.createElement('style');
  style.textContent = css;
  style.id = 'critical-css';
  
  const existingCritical = document.getElementById('critical-css');
  if (existingCritical) {
    existingCritical.remove();
  }
  
  document.head.insertBefore(style, document.head.firstChild);
}

// Optimization 37: Long task detection
export class LongTaskObserver {
  private observer: PerformanceObserver | null = null;
  private callbacks: Array<(entry: PerformanceEntry) => void> = [];

  start(): void {
    if (!('PerformanceObserver' in window)) return;

    this.observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        this.callbacks.forEach(cb => cb(entry));
      }
    });

    try {
      this.observer.observe({ entryTypes: ['longtask'] });
    } catch {
      // longtask not supported
    }
  }

  onLongTask(callback: (entry: PerformanceEntry) => void): () => void {
    this.callbacks.push(callback);
    return () => {
      this.callbacks = this.callbacks.filter(cb => cb !== callback);
    };
  }

  stop(): void {
    this.observer?.disconnect();
    this.observer = null;
    this.callbacks = [];
  }
}

// Optimization 38: Resource timing analyzer
export function analyzeResourceTiming(): {
  slowResources: Array<{ name: string; duration: number }>;
  totalTransferred: number;
  cacheHitRate: number;
} {
  const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
  
  const slowResources = resources
    .filter(r => r.duration > 100)
    .map(r => ({ name: r.name, duration: r.duration }))
    .sort((a, b) => b.duration - a.duration)
    .slice(0, 10);

  const totalTransferred = resources.reduce((sum, r) => sum + (r.transferSize || 0), 0);
  
  const cacheHits = resources.filter(r => r.transferSize === 0 && r.decodedBodySize > 0).length;
  const cacheHitRate = resources.length > 0 ? cacheHits / resources.length : 0;

  return { slowResources, totalTransferred, cacheHitRate };
}

// Optimization 39: Idle callback scheduler
export class IdleScheduler {
  private queue: Array<{ callback: () => void; timeout: number }> = [];
  private isScheduled = false;

  schedule(callback: () => void, timeout = 5000): void {
    this.queue.push({ callback, timeout });
    
    if (!this.isScheduled) {
      this.isScheduled = true;
      this.processQueue();
    }
  }

  private processQueue(): void {
    if (this.queue.length === 0) {
      this.isScheduled = false;
      return;
    }

    const { callback, timeout } = this.queue.shift()!;

    if ('requestIdleCallback' in window) {
      (window as Window & { requestIdleCallback: (cb: () => void, opts?: { timeout: number }) => void })
        .requestIdleCallback(() => {
          callback();
          this.processQueue();
        }, { timeout });
    } else {
      setTimeout(() => {
        callback();
        this.processQueue();
      }, 1);
    }
  }
}

// Optimization 40: Memory usage monitor
export function getMemoryUsage(): { usedJSHeapSize: number; totalJSHeapSize: number; jsHeapSizeLimit: number } | null {
  const memory = (performance as Performance & { memory?: { usedJSHeapSize: number; totalJSHeapSize: number; jsHeapSizeLimit: number } }).memory;
  
  if (!memory) return null;
  
  return {
    usedJSHeapSize: memory.usedJSHeapSize,
    totalJSHeapSize: memory.totalJSHeapSize,
    jsHeapSizeLimit: memory.jsHeapSizeLimit,
  };
}

// Optimization 41: Mutation observer pool
export class MutationObserverPool {
  private observers = new Map<string, MutationObserver>();

  observe(
    id: string,
    target: Node,
    callback: MutationCallback,
    options: MutationObserverInit = { childList: true, subtree: true }
  ): void {
    this.disconnect(id);
    
    const observer = new MutationObserver(callback);
    observer.observe(target, options);
    this.observers.set(id, observer);
  }

  disconnect(id: string): void {
    const observer = this.observers.get(id);
    if (observer) {
      observer.disconnect();
      this.observers.delete(id);
    }
  }

  disconnectAll(): void {
    this.observers.forEach(observer => observer.disconnect());
    this.observers.clear();
  }
}

// Optimization 42: Resize observer manager
export class ResizeObserverManager {
  private observer: ResizeObserver;
  private callbacks = new Map<Element, (entry: ResizeObserverEntry) => void>();

  constructor() {
    this.observer = new ResizeObserver((entries) => {
      entries.forEach(entry => {
        const callback = this.callbacks.get(entry.target);
        callback?.(entry);
      });
    });
  }

  observe(element: Element, callback: (entry: ResizeObserverEntry) => void): () => void {
    this.callbacks.set(element, callback);
    this.observer.observe(element);
    
    return () => {
      this.callbacks.delete(element);
      this.observer.unobserve(element);
    };
  }

  disconnect(): void {
    this.observer.disconnect();
    this.callbacks.clear();
  }
}

// Optimization 43: Event coalescing
export class EventCoalescer {
  private pending = new Map<string, { data: unknown[]; timeout: ReturnType<typeof setTimeout> }>();

  coalesce<T>(
    key: string,
    data: T,
    callback: (items: T[]) => void,
    delay = 100
  ): void {
    const existing = this.pending.get(key);
    
    if (existing) {
      clearTimeout(existing.timeout);
      existing.data.push(data);
    } else {
      this.pending.set(key, { data: [data], timeout: null as unknown as ReturnType<typeof setTimeout> });
    }
    
    const entry = this.pending.get(key)!;
    entry.timeout = setTimeout(() => {
      const items = entry.data as T[];
      this.pending.delete(key);
      callback(items);
    }, delay);
  }
}

// Optimization 44: Chunk loading with priority
export async function loadChunksWithPriority<T>(
  chunks: Array<{ load: () => Promise<T>; priority: number }>,
  concurrency = 3
): Promise<T[]> {
  const sorted = [...chunks].sort((a, b) => b.priority - a.priority);
  const results: T[] = [];
  
  for (let i = 0; i < sorted.length; i += concurrency) {
    const batch = sorted.slice(i, i + concurrency);
    const batchResults = await Promise.all(batch.map(chunk => chunk.load()));
    results.push(...batchResults);
  }
  
  return results;
}

// Optimization 45: State snapshot for debugging
export function createStateSnapshot<T extends Record<string, unknown>>(state: T): {
  snapshot: T;
  diff: (newState: T) => Array<{ key: string; oldValue: unknown; newValue: unknown }>;
} {
  const snapshot = JSON.parse(JSON.stringify(state)) as T;
  
  return {
    snapshot,
    diff: (newState: T) => {
      const changes: Array<{ key: string; oldValue: unknown; newValue: unknown }> = [];
      
      Object.keys(newState).forEach(key => {
        const oldValue = snapshot[key];
        const newValue = newState[key];
        
        if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
          changes.push({ key, oldValue, newValue });
        }
      });
      
      return changes;
    },
  };
}

// Optimization 46: Lazy initialization pattern
export function lazyInit<T>(factory: () => T): () => T {
  let instance: T | null = null;
  let initialized = false;
  
  return () => {
    if (!initialized) {
      instance = factory();
      initialized = true;
    }
    return instance!;
  };
}

// Optimization 47: Request queue with priority
export class PriorityRequestQueue {
  private queues: Map<number, Array<() => Promise<unknown>>> = new Map();
  private isProcessing = false;
  private concurrency: number;
  private activeRequests = 0;

  constructor(concurrency = 4) {
    this.concurrency = concurrency;
  }

  add<T>(request: () => Promise<T>, priority = 0): Promise<T> {
    return new Promise((resolve, reject) => {
      const wrappedRequest = async () => {
        try {
          const result = await request();
          resolve(result);
        } catch (error) {
          reject(error);
        }
      };

      if (!this.queues.has(priority)) {
        this.queues.set(priority, []);
      }
      this.queues.get(priority)!.push(wrappedRequest);

      this.processQueue();
    });
  }

  private async processQueue(): Promise<void> {
    if (this.isProcessing || this.activeRequests >= this.concurrency) return;
    this.isProcessing = true;

    while (this.activeRequests < this.concurrency) {
      const nextRequest = this.getNextRequest();
      if (!nextRequest) break;

      this.activeRequests++;
      nextRequest().finally(() => {
        this.activeRequests--;
        this.processQueue();
      });
    }

    this.isProcessing = false;
  }

  private getNextRequest(): (() => Promise<unknown>) | undefined {
    const priorities = Array.from(this.queues.keys()).sort((a, b) => b - a);
    
    for (const priority of priorities) {
      const queue = this.queues.get(priority)!;
      if (queue.length > 0) {
        return queue.shift();
      }
    }
    
    return undefined;
  }
}

// Optimization 48: Text measurement cache
export class TextMeasurementCache {
  private cache = new Map<string, { width: number; height: number }>();
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  constructor() {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d')!;
  }

  measure(text: string, font: string): { width: number; height: number } {
    const cacheKey = `${text}|${font}`;
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    this.ctx.font = font;
    const metrics = this.ctx.measureText(text);
    const result = {
      width: metrics.width,
      height: metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent,
    };

    this.cache.set(cacheKey, result);
    return result;
  }

  clear(): void {
    this.cache.clear();
  }
}

// Optimization 49: Clipboard manager
export class ClipboardManager {
  async copy(text: string): Promise<boolean> {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(text);
        return true;
      }
      
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-9999px';
      document.body.appendChild(textArea);
      textArea.select();
      const success = document.execCommand('copy');
      document.body.removeChild(textArea);
      return success;
    } catch {
      return false;
    }
  }

  async read(): Promise<string | null> {
    try {
      if (navigator.clipboard) {
        return await navigator.clipboard.readText();
      }
      return null;
    } catch {
      return null;
    }
  }
}

// Optimization 50: Animation frame limiter
export class FrameRateLimiter {
  private lastFrame = 0;
  private targetInterval: number;

  constructor(targetFPS = 60) {
    this.targetInterval = 1000 / targetFPS;
  }

  shouldUpdate(): boolean {
    const now = performance.now();
    const elapsed = now - this.lastFrame;
    
    if (elapsed >= this.targetInterval) {
      this.lastFrame = now - (elapsed % this.targetInterval);
      return true;
    }
    
    return false;
  }
}

// Optimization 51: URL state manager
export class URLStateManager {
  getState<T extends Record<string, string>>(): T {
    const params = new URLSearchParams(window.location.search);
    const state: Record<string, string> = {};
    
    params.forEach((value, key) => {
      state[key] = value;
    });
    
    return state as T;
  }

  setState(state: Record<string, string | undefined>, replace = false): void {
    const params = new URLSearchParams(window.location.search);
    
    Object.entries(state).forEach(([key, value]) => {
      if (value === undefined) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });
    
    const newURL = `${window.location.pathname}${params.toString() ? '?' + params.toString() : ''}`;
    
    if (replace) {
      window.history.replaceState({}, '', newURL);
    } else {
      window.history.pushState({}, '', newURL);
    }
  }
}

// Optimization 52: Network request interceptor
export class NetworkInterceptor {
  private interceptors: Array<{
    matcher: (url: string, options?: RequestInit) => boolean;
    handler: (url: string, options?: RequestInit) => Promise<Response> | Response | null;
  }> = [];
  private originalFetch = window.fetch.bind(window);

  install(): void {
    window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url;
      
      for (const interceptor of this.interceptors) {
        if (interceptor.matcher(url, init)) {
          const response = await interceptor.handler(url, init);
          if (response) return response;
        }
      }
      
      return this.originalFetch(input, init);
    };
  }

  addInterceptor(
    matcher: (url: string, options?: RequestInit) => boolean,
    handler: (url: string, options?: RequestInit) => Promise<Response> | Response | null
  ): () => void {
    const interceptor = { matcher, handler };
    this.interceptors.push(interceptor);
    return () => {
      this.interceptors = this.interceptors.filter(i => i !== interceptor);
    };
  }

  uninstall(): void {
    window.fetch = this.originalFetch;
  }
}

// Optimization 53: Color contrast checker
export function checkColorContrast(foreground: string, background: string): {
  ratio: number;
  passes: { AA: boolean; AAA: boolean; AALarge: boolean; AAALarge: boolean };
} {
  const getLuminance = (hex: string): number => {
    const rgb = hex.replace('#', '').match(/.{2}/g)!.map(x => parseInt(x, 16) / 255);
    const [r, g, b] = rgb.map(c => c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };

  const l1 = getLuminance(foreground);
  const l2 = getLuminance(background);
  const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);

  return {
    ratio,
    passes: {
      AA: ratio >= 4.5,
      AAA: ratio >= 7,
      AALarge: ratio >= 3,
      AAALarge: ratio >= 4.5,
    },
  };
}

// Optimization 54: Script loading manager
export class ScriptLoader {
  private loaded = new Set<string>();
  private loading = new Map<string, Promise<void>>();

  load(src: string, async = true): Promise<void> {
    if (this.loaded.has(src)) {
      return Promise.resolve();
    }

    if (this.loading.has(src)) {
      return this.loading.get(src)!;
    }

    const promise = new Promise<void>((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.async = async;
      
      script.onload = () => {
        this.loaded.add(src);
        this.loading.delete(src);
        resolve();
      };
      
      script.onerror = () => {
        this.loading.delete(src);
        reject(new Error(`Failed to load script: ${src}`));
      };
      
      document.head.appendChild(script);
    });

    this.loading.set(src, promise);
    return promise;
  }
}

// Optimization 55: Attribute change observer
export function observeAttributeChange(
  element: Element,
  attributeName: string,
  callback: (oldValue: string | null, newValue: string | null) => void
): () => void {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'attributes' && mutation.attributeName === attributeName) {
        callback(mutation.oldValue, element.getAttribute(attributeName));
      }
    });
  });

  observer.observe(element, { attributes: true, attributeOldValue: true, attributeFilter: [attributeName] });
  
  return () => observer.disconnect();
}

// Optimization 56: Storage quota manager
export async function getStorageQuota(): Promise<{ usage: number; quota: number; percentage: number } | null> {
  if (!navigator.storage?.estimate) return null;
  
  const estimate = await navigator.storage.estimate();
  const usage = estimate.usage || 0;
  const quota = estimate.quota || 0;
  
  return {
    usage,
    quota,
    percentage: quota > 0 ? (usage / quota) * 100 : 0,
  };
}

// Optimization 57: Touch gesture detector
export class GestureDetector {
  private startX = 0;
  private startY = 0;
  private startTime = 0;

  detectSwipe(
    element: HTMLElement,
    callback: (direction: 'left' | 'right' | 'up' | 'down') => void,
    minDistance = 50,
    maxTime = 300
  ): () => void {
    const handleStart = (e: TouchEvent) => {
      this.startX = e.touches[0].clientX;
      this.startY = e.touches[0].clientY;
      this.startTime = Date.now();
    };

    const handleEnd = (e: TouchEvent) => {
      if (!e.changedTouches[0]) return;
      
      const deltaX = e.changedTouches[0].clientX - this.startX;
      const deltaY = e.changedTouches[0].clientY - this.startY;
      const deltaTime = Date.now() - this.startTime;

      if (deltaTime > maxTime) return;

      const absX = Math.abs(deltaX);
      const absY = Math.abs(deltaY);

      if (absX < minDistance && absY < minDistance) return;

      if (absX > absY) {
        callback(deltaX > 0 ? 'right' : 'left');
      } else {
        callback(deltaY > 0 ? 'down' : 'up');
      }
    };

    element.addEventListener('touchstart', handleStart, { passive: true });
    element.addEventListener('touchend', handleEnd, { passive: true });

    return () => {
      element.removeEventListener('touchstart', handleStart);
      element.removeEventListener('touchend', handleEnd);
    };
  }
}

// Optimization 58: Render blocking resource detector
export function detectRenderBlockingResources(): { scripts: string[]; stylesheets: string[] } {
  const scripts: string[] = [];
  const stylesheets: string[] = [];

  document.querySelectorAll('script[src]:not([async]):not([defer])').forEach((script) => {
    const src = (script as HTMLScriptElement).src;
    if (src) scripts.push(src);
  });

  document.querySelectorAll('link[rel="stylesheet"]').forEach((link) => {
    const href = (link as HTMLLinkElement).href;
    if (href) stylesheets.push(href);
  });

  return { scripts, stylesheets };
}

// Optimization 59: Document visibility manager
export class VisibilityManager {
  private callbacks: Array<(isVisible: boolean) => void> = [];

  constructor() {
    document.addEventListener('visibilitychange', () => {
      const isVisible = document.visibilityState === 'visible';
      this.callbacks.forEach(cb => cb(isVisible));
    });
  }

  onVisibilityChange(callback: (isVisible: boolean) => void): () => void {
    this.callbacks.push(callback);
    return () => {
      this.callbacks = this.callbacks.filter(cb => cb !== callback);
    };
  }

  isVisible(): boolean {
    return document.visibilityState === 'visible';
  }
}

// Optimization 60: Performance metrics collector
export class PerformanceMetrics {
  collect(): {
    fcp: number | null;
    lcp: number | null;
    fid: number | null;
    cls: number | null;
    ttfb: number | null;
  } {
    const entries = performance.getEntriesByType('paint');
    const fcpEntry = entries.find(e => e.name === 'first-contentful-paint');
    
    const navigationEntries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
    const navEntry = navigationEntries[0];

    return {
      fcp: fcpEntry?.startTime ?? null,
      lcp: null, // Requires PerformanceObserver
      fid: null, // Requires PerformanceObserver
      cls: null, // Requires PerformanceObserver
      ttfb: navEntry?.responseStart ?? null,
    };
  }

  observeWebVitals(callback: (metric: { name: string; value: number }) => void): () => void {
    const observers: PerformanceObserver[] = [];

    // LCP Observer
    try {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        callback({ name: 'LCP', value: lastEntry.startTime });
      });
      lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
      observers.push(lcpObserver);
    } catch { /* not supported */ }

    // FID Observer
    try {
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries() as PerformanceEventTiming[];
        entries.forEach(entry => {
          callback({ name: 'FID', value: entry.processingStart - entry.startTime });
        });
      });
      fidObserver.observe({ type: 'first-input', buffered: true });
      observers.push(fidObserver);
    } catch { /* not supported */ }

    // CLS Observer
    try {
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries() as (PerformanceEntry & { hadRecentInput?: boolean; value?: number })[];
        entries.forEach(entry => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value || 0;
            callback({ name: 'CLS', value: clsValue });
          }
        });
      });
      clsObserver.observe({ type: 'layout-shift', buffered: true });
      observers.push(clsObserver);
    } catch { /* not supported */ }

    return () => {
      observers.forEach(o => o.disconnect());
    };
  }
}

// Export singleton instances
export const requestDeduplicator = new RequestDeduplicator();
export const renderPriorityScheduler = new RenderPriorityScheduler();
export const bandwidthEstimator = new BandwidthEstimator();
export const renderTracker = new RenderTracker();
export const scrollPositionManager = new ScrollPositionManager();
export const focusManager = new FocusManager();
export const longTaskObserver = new LongTaskObserver();
export const idleScheduler = new IdleScheduler();
export const mutationObserverPool = new MutationObserverPool();
export const resizeObserverManager = new ResizeObserverManager();
export const eventCoalescer = new EventCoalescer();
export const textMeasurementCache = new TextMeasurementCache();
export const clipboardManager = new ClipboardManager();
export const frameRateLimiter = new FrameRateLimiter();
export const urlStateManager = new URLStateManager();
export const scriptLoader = new ScriptLoader();
export const gestureDetector = new GestureDetector();
export const visibilityManager = new VisibilityManager();
export const performanceMetrics = new PerformanceMetrics();
