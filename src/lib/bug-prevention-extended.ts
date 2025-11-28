/**
 * Extended Bug Prevention and Error Handling Utilities
 * 20 Additional Bug preventers (11-30) for robust application
 * Combined with base bug-prevention.ts, this provides 30 total bug preventers
 */

// Bug Preventer 11: Deep freeze for immutable data
export function deepFreeze<T extends object>(obj: T): Readonly<T> {
  Object.keys(obj).forEach(key => {
    const value = (obj as Record<string, unknown>)[key];
    if (value && typeof value === 'object' && !Object.isFrozen(value)) {
      deepFreeze(value as object);
    }
  });
  return Object.freeze(obj);
}

// Bug Preventer 12: Safe property access with fallback chain
export function safeGet<T>(
  obj: unknown,
  path: string,
  fallback: T
): T {
  const keys = path.split('.');
  let current: unknown = obj;

  for (const key of keys) {
    if (current === null || current === undefined) {
      return fallback;
    }
    
    if (typeof current !== 'object') {
      return fallback;
    }
    
    current = (current as Record<string, unknown>)[key];
  }

  return (current as T) ?? fallback;
}

// Bug Preventer 13: Async operation timeout wrapper
export async function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
  timeoutError = 'Operation timed out'
): Promise<T> {
  let timeoutHandle: ReturnType<typeof setTimeout>;

  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutHandle = setTimeout(() => reject(new Error(timeoutError)), timeoutMs);
  });

  try {
    const result = await Promise.race([promise, timeoutPromise]);
    clearTimeout(timeoutHandle!);
    return result;
  } catch (error) {
    clearTimeout(timeoutHandle!);
    throw error;
  }
}

// Bug Preventer 14: Safe array operations
export const safeArray = {
  first: <T>(arr: T[] | null | undefined, fallback?: T): T | undefined => {
    if (!arr || arr.length === 0) return fallback;
    return arr[0];
  },

  last: <T>(arr: T[] | null | undefined, fallback?: T): T | undefined => {
    if (!arr || arr.length === 0) return fallback;
    return arr[arr.length - 1];
  },

  at: <T>(arr: T[] | null | undefined, index: number, fallback?: T): T | undefined => {
    if (!arr) return fallback;
    const normalizedIndex = index < 0 ? arr.length + index : index;
    if (normalizedIndex < 0 || normalizedIndex >= arr.length) return fallback;
    return arr[normalizedIndex];
  },

  chunk: <T>(arr: T[], size: number): T[][] => {
    if (size <= 0) return [arr];
    const chunks: T[][] = [];
    for (let i = 0; i < arr.length; i += size) {
      chunks.push(arr.slice(i, i + size));
    }
    return chunks;
  },

  unique: <T>(arr: T[], key?: (item: T) => unknown): T[] => {
    if (key) {
      const seen = new Set();
      return arr.filter(item => {
        const k = key(item);
        if (seen.has(k)) return false;
        seen.add(k);
        return true;
      });
    }
    return [...new Set(arr)];
  },

  groupBy: <T, K extends string | number>(arr: T[], keyFn: (item: T) => K): Record<K, T[]> => {
    return arr.reduce((acc, item) => {
      const key = keyFn(item);
      if (!acc[key]) acc[key] = [];
      acc[key].push(item);
      return acc;
    }, {} as Record<K, T[]>);
  },

  shuffle: <T>(arr: T[]): T[] => {
    const result = [...arr];
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  },
};

// Bug Preventer 15: Safe object operations
export const safeObject = {
  keys: <T extends object>(obj: T | null | undefined): (keyof T)[] => {
    if (!obj) return [];
    return Object.keys(obj) as (keyof T)[];
  },

  values: <T extends object>(obj: T | null | undefined): T[keyof T][] => {
    if (!obj) return [];
    return Object.values(obj);
  },

  entries: <T extends object>(obj: T | null | undefined): [keyof T, T[keyof T]][] => {
    if (!obj) return [];
    return Object.entries(obj) as [keyof T, T[keyof T]][];
  },

  pick: <T extends object, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> => {
    const result = {} as Pick<T, K>;
    keys.forEach(key => {
      if (key in obj) {
        result[key] = obj[key];
      }
    });
    return result;
  },

  omit: <T extends object, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> => {
    const result = { ...obj };
    keys.forEach(key => {
      delete result[key];
    });
    return result;
  },

  merge: <T extends object>(...objects: (Partial<T> | null | undefined)[]): T => {
    return objects.reduce((acc, obj) => {
      if (!obj) return acc;
      return { ...acc, ...obj };
    }, {} as T) as T;
  },
};

// Bug Preventer 16: Safe number operations
export const safeNumber = {
  parse: (value: unknown, fallback = 0): number => {
    if (typeof value === 'number' && !isNaN(value)) return value;
    if (typeof value === 'string') {
      const parsed = parseFloat(value);
      return isNaN(parsed) ? fallback : parsed;
    }
    return fallback;
  },

  parseInt: (value: unknown, fallback = 0, radix = 10): number => {
    if (typeof value === 'number' && !isNaN(value)) return Math.floor(value);
    if (typeof value === 'string') {
      const parsed = parseInt(value, radix);
      return isNaN(parsed) ? fallback : parsed;
    }
    return fallback;
  },

  clamp: (value: number, min: number, max: number): number => {
    return Math.min(Math.max(value, min), max);
  },

  round: (value: number, decimals = 0): number => {
    const factor = Math.pow(10, decimals);
    return Math.round(value * factor) / factor;
  },

  percentage: (value: number, total: number, decimals = 2): number => {
    if (total === 0) return 0;
    return safeNumber.round((value / total) * 100, decimals);
  },

  isInRange: (value: number, min: number, max: number): boolean => {
    return value >= min && value <= max;
  },

  formatCurrency: (value: number, currency = 'USD', locale = 'en-US'): string => {
    try {
      return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(value);
    } catch {
      return `$${value.toFixed(2)}`;
    }
  },

  formatCompact: (value: number, locale = 'en-US'): string => {
    try {
      return new Intl.NumberFormat(locale, { notation: 'compact' }).format(value);
    } catch {
      if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
      if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
      return value.toString();
    }
  },
};

// Bug Preventer 17: Safe string operations
export const safeString = {
  trim: (value: unknown): string => {
    if (typeof value !== 'string') return '';
    return value.trim();
  },

  truncate: (value: string, maxLength: number, suffix = '...'): string => {
    if (value.length <= maxLength) return value;
    return value.slice(0, maxLength - suffix.length) + suffix;
  },

  capitalize: (value: string): string => {
    if (!value) return '';
    return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
  },

  titleCase: (value: string): string => {
    return value.split(' ').map(word => safeString.capitalize(word)).join(' ');
  },

  kebabCase: (value: string): string => {
    return value
      .replace(/([a-z])([A-Z])/g, '$1-$2')
      .replace(/[\s_]+/g, '-')
      .toLowerCase();
  },

  camelCase: (value: string): string => {
    return value
      .replace(/[-_\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ''))
      .replace(/^./, c => c.toLowerCase());
  },

  snakeCase: (value: string): string => {
    return value
      .replace(/([a-z])([A-Z])/g, '$1_$2')
      .replace(/[\s-]+/g, '_')
      .toLowerCase();
  },

  slugify: (value: string): string => {
    return value
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  },

  escapeRegex: (value: string): string => {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  },

  pluralize: (count: number, singular: string, plural?: string): string => {
    if (count === 1) return singular;
    return plural ?? `${singular}s`;
  },
};

// Bug Preventer 18: Safe date operations
export const safeDate = {
  parse: (value: unknown): Date | null => {
    if (value instanceof Date && !isNaN(value.getTime())) return value;
    if (typeof value === 'string' || typeof value === 'number') {
      const date = new Date(value);
      return isNaN(date.getTime()) ? null : date;
    }
    return null;
  },

  format: (date: Date | null | undefined, format = 'YYYY-MM-DD'): string => {
    if (!date || isNaN(date.getTime())) return '';
    
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return format
      .replace('YYYY', String(year))
      .replace('MM', month)
      .replace('DD', day)
      .replace('HH', hours)
      .replace('mm', minutes)
      .replace('ss', seconds);
  },

  addDays: (date: Date, days: number): Date => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  },

  addMonths: (date: Date, months: number): Date => {
    const result = new Date(date);
    result.setMonth(result.getMonth() + months);
    return result;
  },

  isBeforeToday: (date: Date): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  },

  isAfterToday: (date: Date): boolean => {
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    return date > today;
  },

  daysBetween: (date1: Date, date2: Date): number => {
    const oneDay = 24 * 60 * 60 * 1000;
    return Math.round(Math.abs((date1.getTime() - date2.getTime()) / oneDay));
  },

  relativeTime: (date: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffSec < 60) return 'just now';
    if (diffMin < 60) return `${diffMin} minute${diffMin > 1 ? 's' : ''} ago`;
    if (diffHour < 24) return `${diffHour} hour${diffHour > 1 ? 's' : ''} ago`;
    if (diffDay < 7) return `${diffDay} day${diffDay > 1 ? 's' : ''} ago`;
    if (diffDay < 30) return `${Math.floor(diffDay / 7)} week${Math.floor(diffDay / 7) > 1 ? 's' : ''} ago`;
    if (diffDay < 365) return `${Math.floor(diffDay / 30)} month${Math.floor(diffDay / 30) > 1 ? 's' : ''} ago`;
    return `${Math.floor(diffDay / 365)} year${Math.floor(diffDay / 365) > 1 ? 's' : ''} ago`;
  },
};

// Bug Preventer 19: Error type classification
export enum ErrorType {
  Network = 'NETWORK',
  Validation = 'VALIDATION',
  Authentication = 'AUTHENTICATION',
  Authorization = 'AUTHORIZATION',
  NotFound = 'NOT_FOUND',
  RateLimit = 'RATE_LIMIT',
  ServerError = 'SERVER_ERROR',
  Timeout = 'TIMEOUT',
  Unknown = 'UNKNOWN',
}

export function classifyError(error: unknown): { type: ErrorType; message: string; isRetryable: boolean } {
  if (error instanceof TypeError && error.message.includes('fetch')) {
    return { type: ErrorType.Network, message: 'Network connection failed', isRetryable: true };
  }

  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    
    if (message.includes('timeout') || error.name === 'AbortError') {
      return { type: ErrorType.Timeout, message: 'Request timed out', isRetryable: true };
    }
    
    if (message.includes('401') || message.includes('unauthorized')) {
      return { type: ErrorType.Authentication, message: 'Authentication required', isRetryable: false };
    }
    
    if (message.includes('403') || message.includes('forbidden')) {
      return { type: ErrorType.Authorization, message: 'Access denied', isRetryable: false };
    }
    
    if (message.includes('404') || message.includes('not found')) {
      return { type: ErrorType.NotFound, message: 'Resource not found', isRetryable: false };
    }
    
    if (message.includes('429') || message.includes('rate limit')) {
      return { type: ErrorType.RateLimit, message: 'Too many requests', isRetryable: true };
    }
    
    if (message.includes('5') || message.includes('server')) {
      return { type: ErrorType.ServerError, message: 'Server error', isRetryable: true };
    }
    
    if (message.includes('valid') || message.includes('invalid')) {
      return { type: ErrorType.Validation, message: error.message, isRetryable: false };
    }
  }

  return { type: ErrorType.Unknown, message: 'An unexpected error occurred', isRetryable: false };
}

// Bug Preventer 20: Promise safety utilities
export const safePromise = {
  // Wrap a promise to never reject
  wrap: async <T>(promise: Promise<T>, fallback: T): Promise<T> => {
    try {
      return await promise;
    } catch {
      return fallback;
    }
  },

  // Run promises with a limit on concurrent executions
  all: async <T>(
    promises: (() => Promise<T>)[],
    concurrency = 5
  ): Promise<{ results: T[]; errors: Error[] }> => {
    const results: T[] = [];
    const errors: Error[] = [];
    let index = 0;

    const executeNext = async (): Promise<void> => {
      while (index < promises.length) {
        const currentIndex = index++;
        try {
          results[currentIndex] = await promises[currentIndex]();
        } catch (error) {
          errors.push(error instanceof Error ? error : new Error(String(error)));
        }
      }
    };

    const workers = Array(Math.min(concurrency, promises.length))
      .fill(null)
      .map(() => executeNext());

    await Promise.all(workers);
    return { results: results.filter((r): r is T => r !== undefined), errors };
  },

  // First successful promise
  race: async <T>(promises: Promise<T>[]): Promise<T | null> => {
    try {
      return await Promise.race(promises);
    } catch {
      return null;
    }
  },

  // Wait for all promises, returning both successes and failures
  allSettled: async <T>(
    promises: Promise<T>[]
  ): Promise<{ fulfilled: T[]; rejected: Error[] }> => {
    const results = await Promise.allSettled(promises);
    const fulfilled: T[] = [];
    const rejected: Error[] = [];

    results.forEach(result => {
      if (result.status === 'fulfilled') {
        fulfilled.push(result.value);
      } else {
        rejected.push(result.reason instanceof Error ? result.reason : new Error(String(result.reason)));
      }
    });

    return { fulfilled, rejected };
  },

  // Delay execution
  delay: (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms)),

  // Retry with delay
  retry: async <T>(
    fn: () => Promise<T>,
    maxAttempts = 3,
    delayMs = 1000,
    backoff = 2
  ): Promise<T> => {
    let lastError: Error = new Error('No attempts made');
    
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        if (attempt < maxAttempts - 1) {
          await safePromise.delay(delayMs * Math.pow(backoff, attempt));
        }
      }
    }
    
    throw lastError;
  },
};

// Bug Preventer 21: URL validation and sanitization
export const safeURL = {
  isValid: (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  },

  parse: (url: string): URL | null => {
    try {
      return new URL(url);
    } catch {
      return null;
    }
  },

  sanitize: (url: string): string => {
    const parsed = safeURL.parse(url);
    if (!parsed) return '';
    
    // Only allow http and https protocols
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return '';
    }
    
    return parsed.toString();
  },

  getParams: (url: string): Record<string, string> => {
    const parsed = safeURL.parse(url);
    if (!parsed) return {};
    
    const params: Record<string, string> = {};
    parsed.searchParams.forEach((value, key) => {
      params[key] = value;
    });
    return params;
  },

  setParams: (url: string, params: Record<string, string>): string => {
    const parsed = safeURL.parse(url);
    if (!parsed) return url;
    
    Object.entries(params).forEach(([key, value]) => {
      parsed.searchParams.set(key, value);
    });
    
    return parsed.toString();
  },
};

// Bug Preventer 22: Event listener manager
export class EventListenerManager {
  private listeners: Array<{ target: EventTarget; type: string; listener: EventListener; options?: AddEventListenerOptions }> = [];

  add(
    target: EventTarget,
    type: string,
    listener: EventListener,
    options?: AddEventListenerOptions
  ): void {
    target.addEventListener(type, listener, options);
    this.listeners.push({ target, type, listener, options });
  }

  remove(target: EventTarget, type: string, listener: EventListener): void {
    target.removeEventListener(type, listener);
    this.listeners = this.listeners.filter(
      l => !(l.target === target && l.type === type && l.listener === listener)
    );
  }

  removeAll(): void {
    this.listeners.forEach(({ target, type, listener, options }) => {
      target.removeEventListener(type, listener, options);
    });
    this.listeners = [];
  }
}

// Bug Preventer 23: Component state validator
export function createStateValidator<T extends Record<string, unknown>>(schema: {
  [K in keyof T]: (value: T[K]) => boolean;
}): (state: T) => { isValid: boolean; invalidFields: (keyof T)[] } {
  return (state: T) => {
    const invalidFields: (keyof T)[] = [];
    
    Object.entries(schema).forEach(([key, validator]) => {
      if (!(validator as (value: unknown) => boolean)(state[key as keyof T])) {
        invalidFields.push(key as keyof T);
      }
    });
    
    return {
      isValid: invalidFields.length === 0,
      invalidFields,
    };
  };
}

// Bug Preventer 24: Safe localStorage wrapper
export const safeLocalStorage = {
  get: <T>(key: string, fallback?: T): T | null => {
    try {
      const item = localStorage.getItem(key);
      if (item === null) return fallback ?? null;
      return JSON.parse(item) as T;
    } catch {
      return fallback ?? null;
    }
  },

  set: (key: string, value: unknown): boolean => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  },

  remove: (key: string): boolean => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch {
      return false;
    }
  },

  clear: (): boolean => {
    try {
      localStorage.clear();
      return true;
    } catch {
      return false;
    }
  },

  has: (key: string): boolean => {
    try {
      return localStorage.getItem(key) !== null;
    } catch {
      return false;
    }
  },

  keys: (): string[] => {
    try {
      return Object.keys(localStorage);
    } catch {
      return [];
    }
  },
};

// Bug Preventer 25: Safe sessionStorage wrapper
export const safeSessionStorage = {
  get: <T>(key: string, fallback?: T): T | null => {
    try {
      const item = sessionStorage.getItem(key);
      if (item === null) return fallback ?? null;
      return JSON.parse(item) as T;
    } catch {
      return fallback ?? null;
    }
  },

  set: (key: string, value: unknown): boolean => {
    try {
      sessionStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  },

  remove: (key: string): boolean => {
    try {
      sessionStorage.removeItem(key);
      return true;
    } catch {
      return false;
    }
  },

  clear: (): boolean => {
    try {
      sessionStorage.clear();
      return true;
    } catch {
      return false;
    }
  },
};

// Bug Preventer 26: Form data sanitizer
export function sanitizeFormData(data: Record<string, unknown>): Record<string, unknown> {
  const sanitized: Record<string, unknown> = {};
  
  Object.entries(data).forEach(([key, value]) => {
    if (typeof value === 'string') {
      // Remove potential XSS vectors
      sanitized[key] = value
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/javascript:/gi, '')
        .replace(/on\w+\s*=/gi, '')
        .trim();
    } else if (typeof value === 'number' && !isNaN(value)) {
      sanitized[key] = value;
    } else if (typeof value === 'boolean') {
      sanitized[key] = value;
    } else if (value === null || value === undefined) {
      sanitized[key] = null;
    } else if (Array.isArray(value)) {
      sanitized[key] = value.map(item => 
        typeof item === 'object' && item !== null 
          ? sanitizeFormData(item as Record<string, unknown>)
          : item
      );
    } else if (typeof value === 'object') {
      sanitized[key] = sanitizeFormData(value as Record<string, unknown>);
    }
  });
  
  return sanitized;
}

// Bug Preventer 27: API response validator
export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  statusCode: number;
}

export function validateAPIResponse<T>(
  response: unknown,
  dataValidator: (data: unknown) => data is T
): APIResponse<T> {
  if (!response || typeof response !== 'object') {
    return { success: false, error: 'Invalid response format', statusCode: 500 };
  }

  const res = response as Record<string, unknown>;

  if ('error' in res && typeof res.error === 'string') {
    return {
      success: false,
      error: res.error,
      statusCode: typeof res.statusCode === 'number' ? res.statusCode : 400,
    };
  }

  if ('data' in res) {
    if (dataValidator(res.data)) {
      return {
        success: true,
        data: res.data,
        statusCode: typeof res.statusCode === 'number' ? res.statusCode : 200,
      };
    }
    return { success: false, error: 'Invalid data format', statusCode: 422 };
  }

  return { success: false, error: 'Missing data in response', statusCode: 500 };
}

// Bug Preventer 28: Circular reference detector
export function hasCircularReference(obj: unknown, seen = new WeakSet()): boolean {
  if (obj === null || typeof obj !== 'object') {
    return false;
  }

  if (seen.has(obj)) {
    return true;
  }

  seen.add(obj);

  if (Array.isArray(obj)) {
    return obj.some(item => hasCircularReference(item, seen));
  }

  return Object.values(obj).some(value => hasCircularReference(value, seen));
}

// Bug Preventer 29: Safe JSON stringify with circular reference handling
export function safeStringify(obj: unknown, space?: number): string {
  const seen = new WeakSet();
  
  return JSON.stringify(obj, (_key, value) => {
    if (typeof value === 'object' && value !== null) {
      if (seen.has(value)) {
        return '[Circular]';
      }
      seen.add(value);
    }
    return value;
  }, space);
}

// Bug Preventer 30: Rate limiter for function calls
export class RateLimiter {
  private calls: number[] = [];
  private readonly limit: number;
  private readonly windowMs: number;

  constructor(limit: number, windowMs: number) {
    this.limit = limit;
    this.windowMs = windowMs;
  }

  canCall(): boolean {
    const now = Date.now();
    this.calls = this.calls.filter(time => now - time < this.windowMs);
    return this.calls.length < this.limit;
  }

  call(): boolean {
    if (!this.canCall()) {
      return false;
    }
    this.calls.push(Date.now());
    return true;
  }

  getRemainingCalls(): number {
    const now = Date.now();
    this.calls = this.calls.filter(time => now - time < this.windowMs);
    return Math.max(0, this.limit - this.calls.length);
  }

  getResetTime(): number {
    if (this.calls.length === 0) return 0;
    const oldestCall = Math.min(...this.calls);
    return Math.max(0, this.windowMs - (Date.now() - oldestCall));
  }

  async waitAndCall(): Promise<boolean> {
    if (this.canCall()) {
      return this.call();
    }
    
    const resetTime = this.getResetTime();
    await new Promise(resolve => setTimeout(resolve, resetTime));
    return this.call();
  }
}

// Export singleton instances
export const eventListenerManager = new EventListenerManager();
