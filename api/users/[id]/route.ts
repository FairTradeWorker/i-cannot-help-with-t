// Users API: Get and Update User
// GET /api/users/[id] - Get user by ID
// PUT /api/users/[id] - Update user

import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/api/lib/auth';
import { supabaseAdmin } from '@/api/lib/db';
import { publicApiLimiter, getClientIP, createRateLimitResponse } from '@/api/lib/rate-limiter';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Rate limiting
  const ip = getClientIP(request);
  const rateLimit = await publicApiLimiter.limit(ip);
  
  if (!rateLimit.success) {
    return createRateLimitResponse(Math.ceil((rateLimit.reset - Date.now()) / 1000));
  }

  try {
    const { data: user, error } = await supabaseAdmin!
      .from('users')
      .select('id, email, name, phone, role, avatar_url, created_at, updated_at')
      .eq('id', params.id)
      .single();

    if (error || !user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Transform to API format
    const transformedUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      role: user.role,
      avatarUrl: user.avatar_url,
      createdAt: user.created_at,
      updatedAt: user.updated_at,
    };

    return NextResponse.json(transformedUser, {
      status: 200,
      headers: {
        'Cache-Control': 'public, max-age=300, stale-while-revalidate=60',
      },
    });
  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Authentication required
  const user = await getAuthenticatedUser(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Users can only update their own profile
  if (user.id !== params.id) {
    return NextResponse.json(
      { error: 'Forbidden' },
      { status: 403 }
    );
  }

  // Rate limiting
  const ip = getClientIP(request);
  const rateLimit = await publicApiLimiter.limit(ip);
  if (!rateLimit.success) {
    return createRateLimitResponse(Math.ceil((rateLimit.reset - Date.now()) / 1000));
  }

  try {
    const body = await request.json();
    const updates: any = {
      updated_at: new Date().toISOString(),
    };

    // Map API fields to database fields
    if (body.name !== undefined) updates.name = body.name;
    if (body.phone !== undefined) updates.phone = body.phone;
    if (body.avatarUrl !== undefined) updates.avatar_url = body.avatarUrl;

    // Don't allow email or role updates via this endpoint
    // (should have separate admin endpoint for those)

    const { data: updatedUser, error: updateError } = await supabaseAdmin!
      .from('users')
      .update(updates)
      .eq('id', params.id)
      .select('id, email, name, phone, role, avatar_url, created_at, updated_at')
      .single();

    if (updateError || !updatedUser) {
      console.error('Update user error:', updateError);
      return NextResponse.json(
        { error: 'Failed to update user' },
        { status: 500 }
      );
    }

    // Transform to API format
    const transformedUser = {
      id: updatedUser.id,
      email: updatedUser.email,
      name: updatedUser.name,
      phone: updatedUser.phone,
      role: updatedUser.role,
      avatarUrl: updatedUser.avatar_url,
      createdAt: updatedUser.created_at,
      updatedAt: updatedUser.updated_at,
    };

    return NextResponse.json(transformedUser, {
      status: 200,
    });
  } catch (error) {
    console.error('Update user error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

