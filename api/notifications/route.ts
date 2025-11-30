// Notifications API: List Notifications
// GET /api/notifications - Get user notifications

import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/api/lib/auth';
import { supabaseAdmin } from '@/api/lib/db';
import { publicApiLimiter, getClientIP, createRateLimitResponse } from '@/api/lib/rate-limiter';

export async function GET(request: NextRequest) {
  // Authentication required
  const user = await getAuthenticatedUser(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Rate limiting
  const ip = getClientIP(request);
  const rateLimit = await publicApiLimiter.limit(ip);
  if (!rateLimit.success) {
    return createRateLimitResponse(Math.ceil((rateLimit.reset - Date.now()) / 1000));
  }

  try {
    const searchParams = request.nextUrl.searchParams;
    const unreadOnly = searchParams.get('unreadOnly') === 'true';
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    let query = supabaseAdmin!
      .from('notifications')
      .select('*')
      .eq('user_id', user.id);

    if (unreadOnly) {
      query = query.eq('read', false);
    }

    // Order by created_at descending
    query = query.order('created_at', { ascending: false });

    // Pagination
    query = query.range(offset, offset + limit - 1);

    const { data: notifications, error } = await query;

    if (error) {
      throw error;
    }

    // Transform to API format
    const transformedNotifications = notifications?.map(notif => ({
      id: notif.id,
      userId: notif.user_id,
      type: notif.type,
      title: notif.title,
      message: notif.message,
      data: notif.data,
      read: notif.read,
      createdAt: notif.created_at,
    })) || [];

    return NextResponse.json(transformedNotifications, {
      status: 200,
      headers: {
        'Cache-Control': 'private, max-age=0, must-revalidate',
      },
    });
  } catch (error) {
    console.error('Get notifications error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch notifications' },
      { status: 500 }
    );
  }
}

