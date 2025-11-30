// Territories API: List Territories
// GET /api/territories - Get territories with filters

import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/api/lib/auth';
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
    const ownerId = searchParams.get('ownerId');
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '100');
    const offset = parseInt(searchParams.get('offset') || '0');

    let query = supabaseAdmin!.from('territories').select('*');

    // Apply filters
    if (zipCode) {
      query = query.eq('zip_code', zipCode);
    }
    if (ownerId) {
      query = query.eq('owner_id', ownerId);
    }
    if (status) {
      query = query.eq('priority_status', status);
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
        'Cache-Control': 'public, max-age=60, stale-while-revalidate=120',
      },
    });
  } catch (error) {
    console.error('Get territories error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch territories' },
      { status: 500 }
    );
  }
}

