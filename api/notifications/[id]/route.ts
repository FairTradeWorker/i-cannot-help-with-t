// Notifications API: Mark Notification as Read
// PATCH /api/notifications/[id] - Mark notification as read

import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/api/lib/auth';
import { supabaseAdmin } from '@/api/lib/db';
import { publicApiLimiter, getClientIP, createRateLimitResponse } from '@/api/lib/rate-limiter';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    const body = await request.json();
    const { read } = body;

    // Verify notification belongs to user
    const { data: notification } = await supabaseAdmin!
      .from('notifications')
      .select('user_id')
      .eq('id', params.id)
      .single();

    if (!notification) {
      return NextResponse.json(
        { error: 'Notification not found' },
        { status: 404 }
      );
    }

    if (notification.user_id !== user.id) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    // Update notification
    const { data: updatedNotification, error: updateError } = await supabaseAdmin!
      .from('notifications')
      .update({ read: read !== undefined ? read : true })
      .eq('id', params.id)
      .select()
      .single();

    if (updateError || !updatedNotification) {
      console.error('Update notification error:', updateError);
      return NextResponse.json(
        { error: 'Failed to update notification' },
        { status: 500 }
      );
    }

    // Transform to API format
    const transformedNotification = {
      id: updatedNotification.id,
      userId: updatedNotification.user_id,
      type: updatedNotification.type,
      title: updatedNotification.title,
      message: updatedNotification.message,
      data: updatedNotification.data,
      read: updatedNotification.read,
      createdAt: updatedNotification.created_at,
    };

    return NextResponse.json(transformedNotification, {
      status: 200,
    });
  } catch (error) {
    console.error('Update notification error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

