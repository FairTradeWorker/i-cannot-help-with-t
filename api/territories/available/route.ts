// Territories API: Get Available Territories
// GET /api/territories/available - Get available (unclaimed) territories

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/api/lib/db';
import { publicApiLimiter, getClientIP, createRateLimitResponse } from '@/api/lib/rate-limiter';

export async function GET(request: NextRequest) {
  // Rate limiting
  const ip = getClientIP(request);
  const rateLimit = await publicApiLimiter.limit(ip);
  
  if (!rateLimit.success) {
    return createRateLimitResponse(Math.ceil((rateLimit.reset - Date.now()) / 1000));
  }

  try {
    const searchParams = request.nextUrl.searchParams;
    const zipCode = searchParams.get('zipCode');
    const state = searchParams.get('state');
    const limit = parseInt(searchParams.get('limit') || '100');
    const offset = parseInt(searchParams.get('offset') || '0');

    let query = supabaseAdmin!
      .from('territories')
      .select('*')
      .eq('priority_status', 'available');

    // Apply filters
    if (zipCode) {
      query = query.eq('zip_code', zipCode);
    }

    // Order by zip code
    query = query.order('zip_code', { ascending: true });

    // Pagination
    query = query.range(offset, offset + limit - 1);

    const { data: territories, error } = await query;

    if (error) {
      throw error;
    }

    // Transform to API format
    const transformedTerritories = territories?.map(territory => ({
      id: territory.id,
      zipCode: territory.zip_code,
      ownerId: territory.owner_id,
      priorityStatus: territory.priority_status,
      claimedAt: territory.claimed_at,
      subscriptionActive: territory.subscription_active,
      subscriptionExpiresAt: territory.subscription_expires_at,
      createdAt: territory.created_at,
      updatedAt: territory.updated_at,
    })) || [];

    return NextResponse.json(transformedTerritories, {
      status: 200,
      headers: {
        'Cache-Control': 'public, max-age=30, stale-while-revalidate=60',
      },
    });
  } catch (error) {
    console.error('Get available territories error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch available territories' },
      { status: 500 }
    );
  }
}

