/**
 * API Rate Limiting Utility
 * 
 * This module provides rate limiting functionality for API calls
 * to prevent abuse and ensure fair usage.
 */

// ============================================================================
// Types
// ============================================================================

interface RateLimitConfig {
  windowMs: number;  // Time window in milliseconds
  maxRequests: number;  // Maximum requests per window
}

interface RateLimitState {
  count: number;
  resetTime: number;
}

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetTime: number;
  retryAfter?: number;
}

// ============================================================================
// Rate Limiter Class
// ============================================================================

export class RateLimiter {
  private limits: Map<string, RateLimitState> = new Map();
  private config: RateLimitConfig;

  constructor(config: RateLimitConfig = { windowMs: 60000, maxRequests: 100 }) {
    this.config = config;
  }

  /**
   * Check if a request is allowed
   */
  check(key: string): RateLimitResult {
    const now = Date.now();
    let state = this.limits.get(key);

    // Reset if window has passed
    if (!state || now >= state.resetTime) {
      state = {
        count: 0,
        resetTime: now + this.config.windowMs,
      };
    }

    const remaining = this.config.maxRequests - state.count;
    const allowed = remaining > 0;

    if (allowed) {
      state.count++;
      this.limits.set(key, state);
    }

    return {
      allowed,
      remaining: Math.max(0, remaining - (allowed ? 1 : 0)),
      resetTime: state.resetTime,
      retryAfter: allowed ? undefined : Math.ceil((state.resetTime - now) / 1000),
    };
  }

  /**
   * Reset rate limit for a key
   */
  reset(key: string): void {
    this.limits.delete(key);
  }

  /**
   * Get current state for a key
   */
  getState(key: string): RateLimitState | undefined {
    return this.limits.get(key);
  }

  /**
   * Clean up expired entries
   */
  cleanup(): void {
    const now = Date.now();
    for (const [key, state] of this.limits.entries()) {
      if (now >= state.resetTime) {
        this.limits.delete(key);
      }
    }
  }
}

// ============================================================================
// Default Rate Limiters
// ============================================================================

// Standard API rate limiter: 100 requests per minute
export const standardRateLimiter = new RateLimiter({
  windowMs: 60000,
  maxRequests: 100,
});

// Strict rate limiter for sensitive endpoints: 10 requests per minute
export const strictRateLimiter = new RateLimiter({
  windowMs: 60000,
  maxRequests: 10,
});

// Auth rate limiter: 5 attempts per 15 minutes
export const authRateLimiter = new RateLimiter({
  windowMs: 900000,
  maxRequests: 5,
});

// ============================================================================
// Rate Limit Middleware
// ============================================================================

type RateLimitMiddleware = (
  key: string,
  fn: () => Promise<Response>
) => Promise<Response>;

/**
 * Create a rate limit middleware for fetch requests
 */
export function createRateLimitMiddleware(
  limiter: RateLimiter
): RateLimitMiddleware {
  return async (key: string, fn: () => Promise<Response>) => {
    const result = limiter.check(key);

    if (!result.allowed) {
      return new Response(
        JSON.stringify({
          error: 'Rate limit exceeded',
          retryAfter: result.retryAfter,
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': String(result.retryAfter),
            'X-RateLimit-Remaining': String(result.remaining),
            'X-RateLimit-Reset': String(result.resetTime),
          },
        }
      );
    }

    const response = await fn();

    // Add rate limit headers to response
    const headers = new Headers(response.headers);
    headers.set('X-RateLimit-Remaining', String(result.remaining));
    headers.set('X-RateLimit-Reset', String(result.resetTime));

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  };
}

// ============================================================================
// Token Bucket Rate Limiter (for burst handling)
// ============================================================================

interface TokenBucketConfig {
  capacity: number;      // Maximum tokens
  refillRate: number;    // Tokens per second
  refillAmount: number;  // Tokens added per refill
}

export class TokenBucketLimiter {
  private buckets: Map<string, { tokens: number; lastRefill: number }> = new Map();
  private config: TokenBucketConfig;

  constructor(config: TokenBucketConfig = { capacity: 100, refillRate: 10, refillAmount: 1 }) {
    this.config = config;
  }

  /**
   * Try to consume tokens
   */
  consume(key: string, tokens: number = 1): boolean {
    const now = Date.now();
    let bucket = this.buckets.get(key);

    if (!bucket) {
      bucket = { tokens: this.config.capacity, lastRefill: now };
    }

    // Calculate refill
    const timePassed = (now - bucket.lastRefill) / 1000;
    const refills = Math.floor(timePassed * this.config.refillRate);
    bucket.tokens = Math.min(
      this.config.capacity,
      bucket.tokens + refills * this.config.refillAmount
    );
    bucket.lastRefill = now;

    // Try to consume
    if (bucket.tokens >= tokens) {
      bucket.tokens -= tokens;
      this.buckets.set(key, bucket);
      return true;
    }

    this.buckets.set(key, bucket);
    return false;
  }

  /**
   * Get available tokens
   */
  getTokens(key: string): number {
    const bucket = this.buckets.get(key);
    return bucket?.tokens ?? this.config.capacity;
  }
}

// ============================================================================
// Sliding Window Rate Limiter
// ============================================================================

interface SlidingWindowConfig {
  windowMs: number;
  maxRequests: number;
}

export class SlidingWindowLimiter {
  private requests: Map<string, number[]> = new Map();
  private config: SlidingWindowConfig;

  constructor(config: SlidingWindowConfig = { windowMs: 60000, maxRequests: 100 }) {
    this.config = config;
  }

  check(key: string): RateLimitResult {
    const now = Date.now();
    const windowStart = now - this.config.windowMs;

    // Get requests in current window
    let timestamps = this.requests.get(key) || [];
    timestamps = timestamps.filter(t => t > windowStart);

    const allowed = timestamps.length < this.config.maxRequests;
    const remaining = Math.max(0, this.config.maxRequests - timestamps.length - (allowed ? 1 : 0));

    if (allowed) {
      timestamps.push(now);
      this.requests.set(key, timestamps);
    }

    // Calculate reset time (when oldest request expires)
    const resetTime = timestamps.length > 0 
      ? timestamps[0] + this.config.windowMs 
      : now + this.config.windowMs;

    return {
      allowed,
      remaining,
      resetTime,
      retryAfter: allowed ? undefined : Math.ceil((resetTime - now) / 1000),
    };
  }

  cleanup(): void {
    const windowStart = Date.now() - this.config.windowMs;
    for (const [key, timestamps] of this.requests.entries()) {
      const filtered = timestamps.filter(t => t > windowStart);
      if (filtered.length === 0) {
        this.requests.delete(key);
      } else {
        this.requests.set(key, filtered);
      }
    }
  }
}

// ============================================================================
// Exports
// ============================================================================

export default {
  RateLimiter,
  TokenBucketLimiter,
  SlidingWindowLimiter,
  standardRateLimiter,
  strictRateLimiter,
  authRateLimiter,
  createRateLimitMiddleware,
};
