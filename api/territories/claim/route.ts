// SCALE: Territory claim API with rate limiting
import { territoryClaimLimiter, getClientIP, checkRateLimit, createRateLimitResponse } from '../../lib/rate-limiter';

export async function POST(request: Request): Promise<Response> {
  const clientIP = getClientIP(request);
  const body = await request.json();
  const userId = body.userId || clientIP; // Use userId if authenticated, fallback to IP
  
  // SCALE: Rate limit - 5 claims per hour per user
  const rateLimit = await checkRateLimit(territoryClaimLimiter, userId);
  if (!rateLimit.allowed) {
    return createRateLimitResponse(rateLimit.retryAfter || 3600);
  }

  // Process claim...
  // This will be called from the client-side processTerritoryClaim
  
  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=30, stale-while-revalidate=60',
      'X-RateLimit-Limit': '5',
      'X-RateLimit-Remaining': rateLimit.remaining.toString(),
    },
  });
}

