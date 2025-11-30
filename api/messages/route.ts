// Messages API: List and Create Messages
// GET /api/messages?jobId=xxx - Get messages for a job
// POST /api/messages - Create a new message

import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/api/lib/auth';
import { supabaseAdmin } from '@/api/lib/db';
import { publicApiLimiter, getClientIP, createRateLimitResponse } from '@/api/lib/rate-limiter';
import { v4 as uuidv4 } from 'uuid';

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
    const jobId = searchParams.get('jobId');

    if (!jobId) {
      return NextResponse.json(
        { error: 'jobId parameter is required' },
        { status: 400 }
      );
    }

    // Verify user has access to this job's messages
    const { data: job } = await supabaseAdmin!
      .from('jobs')
      .select('homeowner_id, contractor_id')
      .eq('id', jobId)
      .single();

    if (!job) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      );
    }

    if (job.homeowner_id !== user.id && job.contractor_id !== user.id) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    // Get messages
    const { data: messages, error } = await supabaseAdmin!
      .from('messages')
      .select('*')
      .eq('job_id', jobId)
      .order('created_at', { ascending: true });

    if (error) {
      throw error;
    }

    // Transform to API format
    const transformedMessages = messages?.map(msg => ({
      id: msg.id,
      jobId: msg.job_id,
      senderId: msg.sender_id,
      recipientId: msg.recipient_id,
      content: msg.content,
      read: msg.read,
      createdAt: msg.created_at,
    })) || [];

    // Mark messages as read for current user
    if (transformedMessages.length > 0) {
      await supabaseAdmin!
        .from('messages')
        .update({ read: true })
        .eq('job_id', jobId)
        .eq('recipient_id', user.id)
        .eq('read', false);
    }

    return NextResponse.json(transformedMessages, {
      status: 200,
      headers: {
        'Cache-Control': 'private, max-age=0, must-revalidate',
      },
    });
  } catch (error) {
    console.error('Get messages error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
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
    const { jobId, recipientId, content } = body;

    if (!jobId || !recipientId || !content) {
      return NextResponse.json(
        { error: 'jobId, recipientId, and content are required' },
        { status: 400 }
      );
    }

    // Verify user has access to this job
    const { data: job } = await supabaseAdmin!
      .from('jobs')
      .select('homeowner_id, contractor_id')
      .eq('id', jobId)
      .single();

    if (!job) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      );
    }

    if (job.homeowner_id !== user.id && job.contractor_id !== user.id) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    // Verify recipient is part of the job
    if (recipientId !== job.homeowner_id && recipientId !== job.contractor_id) {
      return NextResponse.json(
        { error: 'Invalid recipient' },
        { status: 400 }
      );
    }

    if (recipientId === user.id) {
      return NextResponse.json(
        { error: 'Cannot send message to yourself' },
        { status: 400 }
      );
    }

    const messageId = uuidv4();
    const newMessage = {
      id: messageId,
      job_id: jobId,
      sender_id: user.id,
      recipient_id: recipientId,
      content,
      read: false,
      created_at: new Date().toISOString(),
    };

    const { data: message, error: insertError } = await supabaseAdmin!
      .from('messages')
      .insert(newMessage)
      .select()
      .single();

    if (insertError || !message) {
      console.error('Create message error:', insertError);
      return NextResponse.json(
        { error: 'Failed to create message' },
        { status: 500 }
      );
    }

    // Create notification for recipient
    await supabaseAdmin!.from('notifications').insert({
      user_id: recipientId,
      type: 'new_message',
      title: 'New Message',
      message: `You have a new message from ${user.name}`,
      data: { jobId, messageId },
    });

    // Transform to API format
    const transformedMessage = {
      id: message.id,
      jobId: message.job_id,
      senderId: message.sender_id,
      recipientId: message.recipient_id,
      content: message.content,
      read: message.read,
      createdAt: message.created_at,
    };

    return NextResponse.json(transformedMessage, {
      status: 201,
    });
  } catch (error) {
    console.error('Create message error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

