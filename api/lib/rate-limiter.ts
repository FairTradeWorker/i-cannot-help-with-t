// SCALE: Rate limiting with Upstash Redis (server-side)
// Prevents abuse and bot attacks at scale
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Initialize Redis client (uses Upstash REST API)
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || process.env.VITE_UPSTASH_REDIS_REST_URL || '',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || process.env.VITE_UPSTASH_REDIS_REST_TOKEN || '',
});

// Rate limiter for public API routes: 100 requests per 15 minutes per IP
export const publicApiLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(100, '15 m'),
  analytics: true,
  prefix: '@upstash/ratelimit/public-api',
});

// Rate limiter for territory claims: 5 claims per hour per user
export const territoryClaimLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, '1 h'),
  analytics: true,
  prefix: '@upstash/ratelimit/territory-claims',
});

// Rate limiter for job creation: 10 jobs per hour per user
export const jobCreationLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, '1 h'),
  analytics: true,
  prefix: '@upstash/ratelimit/job-creation',
});

// Helper to get client IP from request
export function getClientIP(request: Request): string {
  // Check various headers for IP (Vercel, Cloudflare, etc.)
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const cfConnectingIP = request.headers.get('cf-connecting-ip');
  
  if (cfConnectingIP) return cfConnectingIP;
  if (realIP) return realIP;
  if (forwarded) return forwarded.split(',')[0].trim();
  
  return 'unknown';
}

// Rate limit check with proper error response
export async function checkRateLimit(
  limiter: Ratelimit,
  identifier: string
): Promise<{ allowed: boolean; limit: number; remaining: number; reset: number; retryAfter?: number }> {
  try {
    const result = await limiter.limit(identifier);
    
    if (!result.success) {
      // Calculate retry after in seconds
      const retryAfter = Math.ceil((result.reset - Date.now()) / 1000);
      return {
        allowed: false,
        limit: result.limit,
        remaining: result.remaining,
        reset: result.reset,
        retryAfter,
      };
    }
    
    return {
      allowed: true,
      limit: result.limit,
      remaining: result.remaining,
      reset: result.reset,
    };
  } catch (error) {
    // If Redis fails, allow the request (fail open for availability)
    console.error('Rate limiter error:', error);
    return {
      allowed: true,
      limit: 100,
      remaining: 99,
      reset: Date.now() + 900000, // 15 minutes
    };
  }
}

// Create rate limit response (429)
export function createRateLimitResponse(retryAfter: number): Response {
  return new Response(
    JSON.stringify({
      error: 'Rate limit exceeded',
      message: 'Too many requests. Please try again later.',
      retryAfter,
    }),
    {
      status: 429,
      headers: {
        'Content-Type': 'application/json',
        'Retry-After': retryAfter.toString(),
        'X-RateLimit-Limit': '100',
        'X-RateLimit-Remaining': '0',
        'Cache-Control': 'public, max-age=30, stale-while-revalidate=60',
      },
    }
  );
}

