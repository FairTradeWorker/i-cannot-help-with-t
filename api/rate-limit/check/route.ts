// SCALE: Rate limit check endpoint (client-side proxy)
import { publicApiLimiter, territoryClaimLimiter, jobCreationLimiter, checkRateLimit } from '../../lib/rate-limiter';

const limiterMap: Record<string, typeof publicApiLimiter> = {
  'public-api': publicApiLimiter,
  'territory-claim': territoryClaimLimiter,
  'job-creation': jobCreationLimiter,
};

export async function POST(request: Request): Promise<Response> {
  try {
    const body = await request.json();
    const { endpoint, identifier } = body;

    if (!endpoint || !identifier) {
      return new Response(JSON.stringify({ error: 'Missing endpoint or identifier' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const limiter = limiterMap[endpoint] || publicApiLimiter;
    const rateLimit = await checkRateLimit(limiter, identifier);

    if (!rateLimit.allowed) {
      return new Response(
        JSON.stringify({
          allowed: false,
          retryAfter: rateLimit.retryAfter,
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': (rateLimit.retryAfter || 900).toString(),
          },
        }
      );
    }

    return new Response(
      JSON.stringify({
        allowed: true,
        limit: rateLimit.limit,
        remaining: rateLimit.remaining,
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=30, stale-while-revalidate=60',
        },
      }
    );
  } catch (error: any) {
    return new Response(JSON.stringify({ error: 'Rate limit check failed', allowed: true }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

