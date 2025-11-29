// SCALE: Health check endpoint for monitoring
import { createClient } from '@supabase/supabase-js';
import { Redis } from '@upstash/redis';

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '';
const redisUrl = process.env.UPSTASH_REDIS_REST_URL || process.env.VITE_UPSTASH_REDIS_REST_URL || '';
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.VITE_UPSTASH_REDIS_REST_TOKEN || '';

export async function GET(): Promise<Response> {
  const health: {
    status: 'healthy' | 'degraded' | 'unhealthy';
    timestamp: string;
    services: Record<string, { status: 'up' | 'down'; latency?: number }>;
  } = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    services: {},
  };

  // Check Supabase
  try {
    const start = Date.now();
    if (supabaseUrl && supabaseKey) {
      const supabase = createClient(supabaseUrl, supabaseKey);
      await supabase.from('kv_default').select('id').limit(1);
      const latency = Date.now() - start;
      health.services.supabase = { status: 'up', latency };
    } else {
      health.services.supabase = { status: 'down' };
      health.status = 'degraded';
    }
  } catch (error) {
    health.services.supabase = { status: 'down' };
    health.status = 'unhealthy';
  }

  // Check Redis
  try {
    const start = Date.now();
    if (redisUrl && redisToken) {
      const redis = new Redis({ url: redisUrl, token: redisToken });
      await redis.ping();
      const latency = Date.now() - start;
      health.services.redis = { status: 'up', latency };
    } else {
      health.services.redis = { status: 'down' };
      if (health.status === 'healthy') health.status = 'degraded';
    }
  } catch (error) {
    health.services.redis = { status: 'down' };
    health.status = 'unhealthy';
  }

  const statusCode = health.status === 'healthy' ? 200 : health.status === 'degraded' ? 200 : 503;

  return new Response(JSON.stringify(health), {
    status: statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    },
  });
}

