// SCALE: Client-side rate limiting helper
// Server-side rate limiting is handled in api/lib/rate-limiter.ts
// This is for client-side checks and UI feedback

// Check rate limit via API (client-side helper)
export async function checkClientRateLimit(
  endpoint: string,
  identifier: string
): Promise<{ allowed: boolean; retryAfter?: number; limit?: number; remaining?: number }> {
  try {
    const response = await fetch(`/api/rate-limit/check`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ endpoint, identifier }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        const retryAfter = response.headers.get('Retry-After');
        return {
          allowed: false,
          retryAfter: retryAfter ? parseInt(retryAfter, 10) : 900,
        };
      }
      // On error, allow the request (fail open)
      return { allowed: true };
    }

    const data = await response.json();
    return {
      allowed: data.allowed !== false,
      limit: data.limit,
      remaining: data.remaining,
    };
  } catch (error) {
    // On error, allow the request (fail open for availability)
    console.warn('Rate limit check failed:', error);
    return { allowed: true };
  }
}

