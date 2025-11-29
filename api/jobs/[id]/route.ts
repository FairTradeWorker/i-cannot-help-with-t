// Jobs API: Get, Update, Delete Job
// GET /api/jobs/[id] - Get job by ID
// PUT /api/jobs/[id] - Update job
// DELETE /api/jobs/[id] - Delete job

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
    const { data: job, error } = await supabaseAdmin!
      .from('jobs')
      .select('*')
      .eq('id', params.id)
      .single();

    if (error || !job) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      );
    }

    // Get bids for this job
    const { data: bids } = await supabaseAdmin!
      .from('bids')
      .select('*')
      .eq('job_id', params.id)
      .order('created_at', { ascending: false });

    // Transform to API format
    const transformedJob = {
      id: job.id,
      title: job.title,
      description: job.description,
      homeownerId: job.homeowner_id,
      contractorId: job.contractor_id,
      status: job.status,
      urgency: job.urgency,
      address: job.address,
      videoUrl: job.video_url,
      thumbnailUrl: job.thumbnail_url,
      scope: job.scope,
      estimatedCost: job.estimated_cost,
      laborHours: job.labor_hours,
      actualCost: job.actual_cost,
      actualLaborHours: job.actual_labor_hours,
      predictionId: job.prediction_id,
      feedbackCollected: job.feedback_collected,
      feedbackCollectedAt: job.feedback_collected_at,
      createdAt: job.created_at,
      updatedAt: job.updated_at,
      bids: bids?.map(bid => ({
        id: bid.id,
        jobId: bid.job_id,
        contractorId: bid.contractor_id,
        amount: bid.amount,
        message: bid.message,
        status: bid.status,
        createdAt: bid.created_at,
        updatedAt: bid.updated_at,
      })) || [],
    };

    return NextResponse.json(transformedJob, {
      status: 200,
      headers: {
        'Cache-Control': 'public, max-age=30, stale-while-revalidate=60',
      },
    });
  } catch (error) {
    console.error('Get job error:', error);
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

  // Rate limiting
  const ip = getClientIP(request);
  const rateLimit = await publicApiLimiter.limit(ip);
  if (!rateLimit.success) {
    return createRateLimitResponse(Math.ceil((rateLimit.reset - Date.now()) / 1000));
  }

  try {
    // Check if user owns the job
    const { data: existingJob } = await supabaseAdmin!
      .from('jobs')
      .select('homeowner_id, contractor_id')
      .eq('id', params.id)
      .single();

    if (!existingJob) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      );
    }

    // Only homeowner or assigned contractor can update
    if (existingJob.homeowner_id !== user.id && existingJob.contractor_id !== user.id) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const updates: any = {
      updated_at: new Date().toISOString(),
    };

    // Map API fields to database fields
    if (body.title !== undefined) updates.title = body.title;
    if (body.description !== undefined) updates.description = body.description;
    if (body.status !== undefined) updates.status = body.status;
    if (body.urgency !== undefined) updates.urgency = body.urgency;
    if (body.address !== undefined) updates.address = body.address;
    if (body.scope !== undefined) updates.scope = body.scope;
    if (body.estimatedCost !== undefined) updates.estimated_cost = body.estimatedCost;
    if (body.laborHours !== undefined) updates.labor_hours = body.laborHours;
    if (body.actualCost !== undefined) updates.actual_cost = body.actualCost;
    if (body.actualLaborHours !== undefined) updates.actual_labor_hours = body.actualLaborHours;
    if (body.contractorId !== undefined) updates.contractor_id = body.contractorId;
    if (body.feedbackCollected !== undefined) {
      updates.feedback_collected = body.feedbackCollected;
      if (body.feedbackCollected) {
        updates.feedback_collected_at = new Date().toISOString();
      }
    }

    const { data: job, error } = await supabaseAdmin!
      .from('jobs')
      .update(updates)
      .eq('id', params.id)
      .select()
      .single();

    if (error || !job) {
      console.error('Update job error:', error);
      return NextResponse.json(
        { error: 'Failed to update job' },
        { status: 500 }
      );
    }

    // Transform to API format
    const transformedJob = {
      id: job.id,
      title: job.title,
      description: job.description,
      homeownerId: job.homeowner_id,
      contractorId: job.contractor_id,
      status: job.status,
      urgency: job.urgency,
      address: job.address,
      videoUrl: job.video_url,
      thumbnailUrl: job.thumbnail_url,
      scope: job.scope,
      estimatedCost: job.estimated_cost,
      laborHours: job.labor_hours,
      actualCost: job.actual_cost,
      actualLaborHours: job.actual_labor_hours,
      predictionId: job.prediction_id,
      feedbackCollected: job.feedback_collected,
      feedbackCollectedAt: job.feedback_collected_at,
      createdAt: job.created_at,
      updatedAt: job.updated_at,
    };

    return NextResponse.json(transformedJob, {
      status: 200,
    });
  } catch (error) {
    console.error('Update job error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

