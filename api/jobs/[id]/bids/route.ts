// Jobs API: Create Bid
// POST /api/jobs/[id]/bids - Create a bid on a job

import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/api/lib/auth';
import { supabaseAdmin } from '@/api/lib/db';
import { publicApiLimiter, getClientIP, createRateLimitResponse } from '@/api/lib/rate-limiter';
import { v4 as uuidv4 } from 'uuid';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Authentication required
  const user = await getAuthenticatedUser(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Only contractors can create bids
  if (user.role !== 'contractor') {
    return NextResponse.json(
      { error: 'Only contractors can create bids' },
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
    // Check if job exists
    const { data: job, error: jobError } = await supabaseAdmin!
      .from('jobs')
      .select('id, status, homeowner_id')
      .eq('id', params.id)
      .single();

    if (jobError || !job) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      );
    }

    if (job.status !== 'posted') {
      return NextResponse.json(
        { error: 'Job is no longer accepting bids' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { amount, message } = body;

    if (!amount || typeof amount !== 'number' || amount <= 0) {
      return NextResponse.json(
        { error: 'Valid bid amount is required' },
        { status: 400 }
      );
    }

    // Check if contractor already has a bid on this job
    const { data: existingBid } = await supabaseAdmin!
      .from('bids')
      .select('id')
      .eq('job_id', params.id)
      .eq('contractor_id', user.id)
      .eq('status', 'pending')
      .single();

    if (existingBid) {
      return NextResponse.json(
        { error: 'You already have a pending bid on this job' },
        { status: 409 }
      );
    }

    const bidId = uuidv4();
    const newBid = {
      id: bidId,
      job_id: params.id,
      contractor_id: user.id,
      amount,
      message: message || null,
      status: 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data: bid, error: insertError } = await supabaseAdmin!
      .from('bids')
      .insert(newBid)
      .select()
      .single();

    if (insertError || !bid) {
      console.error('Create bid error:', insertError);
      return NextResponse.json(
        { error: 'Failed to create bid' },
        { status: 500 }
      );
    }

    // Create notification for homeowner
    await supabaseAdmin!.from('notifications').insert({
      user_id: job.homeowner_id,
      type: 'new_bid',
      title: 'New Bid Received',
      message: `${user.name} submitted a bid of $${amount.toLocaleString()} on your job`,
      data: { jobId: params.id, bidId: bidId },
    });

    // Transform to API format
    const transformedBid = {
      id: bid.id,
      jobId: bid.job_id,
      contractorId: bid.contractor_id,
      amount: bid.amount,
      message: bid.message,
      status: bid.status,
      createdAt: bid.created_at,
      updatedAt: bid.updated_at,
    };

    return NextResponse.json(transformedBid, {
      status: 201,
    });
  } catch (error) {
    console.error('Create bid error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

