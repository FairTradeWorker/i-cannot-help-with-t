/**
 * Unit Tests for API Rate Limiting
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';

import {
  RateLimiter,
  TokenBucketLimiter,
  SlidingWindowLimiter,
  standardRateLimiter,
  strictRateLimiter,
  authRateLimiter,
  createRateLimitMiddleware,
} from '../src/api/core/rate-limiting';

describe('Rate Limiting', () => {
  describe('RateLimiter', () => {
    it('allows requests within limit', () => {
      const limiter = new RateLimiter({ windowMs: 60000, maxRequests: 10 });
      
      for (let i = 0; i < 10; i++) {
        const result = limiter.check('test-key');
        expect(result.allowed).toBe(true);
        expect(result.remaining).toBe(10 - i - 1);
      }
    });

    it('blocks requests exceeding limit', () => {
      const limiter = new RateLimiter({ windowMs: 60000, maxRequests: 3 });
      
      // Use up the limit
      limiter.check('test-key');
      limiter.check('test-key');
      limiter.check('test-key');
      
      const result = limiter.check('test-key');
      expect(result.allowed).toBe(false);
      expect(result.remaining).toBe(0);
      expect(result.retryAfter).toBeDefined();
      expect(result.retryAfter).toBeGreaterThan(0);
    });

    it('tracks different keys separately', () => {
      const limiter = new RateLimiter({ windowMs: 60000, maxRequests: 2 });
      
      limiter.check('key-a');
      limiter.check('key-a');
      
      const resultA = limiter.check('key-a');
      expect(resultA.allowed).toBe(false);
      
      const resultB = limiter.check('key-b');
      expect(resultB.allowed).toBe(true);
    });

    it('reset clears the limit for a key', () => {
      const limiter = new RateLimiter({ windowMs: 60000, maxRequests: 2 });
      
      limiter.check('test-key');
      limiter.check('test-key');
      
      const blockedResult = limiter.check('test-key');
      expect(blockedResult.allowed).toBe(false);
      
      limiter.reset('test-key');
      
      const allowedResult = limiter.check('test-key');
      expect(allowedResult.allowed).toBe(true);
    });

    it('getState returns current state', () => {
      const limiter = new RateLimiter({ windowMs: 60000, maxRequests: 10 });
      
      limiter.check('test-key');
      limiter.check('test-key');
      
      const state = limiter.getState('test-key');
      expect(state).toBeDefined();
      expect(state?.count).toBe(2);
    });
  });

  describe('TokenBucketLimiter', () => {
    it('allows consumption when tokens available', () => {
      const limiter = new TokenBucketLimiter({ capacity: 10, refillRate: 1, refillAmount: 1 });
      
      const result = limiter.consume('test-key', 5);
      expect(result).toBe(true);
      expect(limiter.getTokens('test-key')).toBe(5);
    });

    it('rejects consumption when insufficient tokens', () => {
      const limiter = new TokenBucketLimiter({ capacity: 5, refillRate: 1, refillAmount: 1 });
      
      limiter.consume('test-key', 5);
      
      const result = limiter.consume('test-key', 1);
      expect(result).toBe(false);
    });

    it('returns full capacity for new keys', () => {
      const limiter = new TokenBucketLimiter({ capacity: 100, refillRate: 10, refillAmount: 1 });
      
      expect(limiter.getTokens('new-key')).toBe(100);
    });
  });

  describe('SlidingWindowLimiter', () => {
    it('allows requests within window', () => {
      const limiter = new SlidingWindowLimiter({ windowMs: 60000, maxRequests: 5 });
      
      for (let i = 0; i < 5; i++) {
        const result = limiter.check('test-key');
        expect(result.allowed).toBe(true);
      }
    });

    it('blocks excess requests', () => {
      const limiter = new SlidingWindowLimiter({ windowMs: 60000, maxRequests: 2 });
      
      limiter.check('test-key');
      limiter.check('test-key');
      
      const result = limiter.check('test-key');
      expect(result.allowed).toBe(false);
    });

    it('cleanup removes expired entries', () => {
      const limiter = new SlidingWindowLimiter({ windowMs: 1, maxRequests: 10 });
      
      limiter.check('test-key');
      
      // Wait for window to expire
      vi.useFakeTimers();
      vi.advanceTimersByTime(10);
      
      limiter.cleanup();
      
      // After cleanup, key should be fresh
      const result = limiter.check('test-key');
      expect(result.allowed).toBe(true);
      expect(result.remaining).toBe(9);
      
      vi.useRealTimers();
    });
  });

  describe('Pre-configured Rate Limiters', () => {
    it('standardRateLimiter is configured correctly', () => {
      expect(standardRateLimiter).toBeInstanceOf(RateLimiter);
    });

    it('strictRateLimiter is configured correctly', () => {
      expect(strictRateLimiter).toBeInstanceOf(RateLimiter);
    });

    it('authRateLimiter is configured correctly', () => {
      expect(authRateLimiter).toBeInstanceOf(RateLimiter);
    });
  });

  describe('createRateLimitMiddleware', () => {
    it('allows requests within limit', async () => {
      const limiter = new RateLimiter({ windowMs: 60000, maxRequests: 10 });
      const middleware = createRateLimitMiddleware(limiter);
      
      const mockResponse = new Response('OK', { status: 200 });
      const fn = vi.fn().mockResolvedValue(mockResponse);
      
      const response = await middleware('test-key', fn);
      
      expect(fn).toHaveBeenCalled();
      expect(response.status).toBe(200);
    });

    it('returns 429 when limit exceeded', async () => {
      const limiter = new RateLimiter({ windowMs: 60000, maxRequests: 1 });
      const middleware = createRateLimitMiddleware(limiter);
      
      // Use up the limit
      await middleware('test-key', () => Promise.resolve(new Response('OK')));
      
      // Next request should be blocked
      const response = await middleware('test-key', () => Promise.resolve(new Response('OK')));
      
      expect(response.status).toBe(429);
      const body = await response.json();
      expect(body.error).toBe('Rate limit exceeded');
    });

    it('adds rate limit headers to successful responses', async () => {
      const limiter = new RateLimiter({ windowMs: 60000, maxRequests: 10 });
      const middleware = createRateLimitMiddleware(limiter);
      
      const response = await middleware('test-key', () => 
        Promise.resolve(new Response('OK', { status: 200 }))
      );
      
      expect(response.headers.get('X-RateLimit-Remaining')).toBeDefined();
      expect(response.headers.get('X-RateLimit-Reset')).toBeDefined();
    });
  });
});
