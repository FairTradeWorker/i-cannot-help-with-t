// Jobs API: List and Create Jobs
// GET /api/jobs - List jobs with filters
// POST /api/jobs - Create a new job

import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/api/lib/auth';
import { supabaseAdmin } from '@/api/lib/db';
import { publicApiLimiter, getClientIP, createRateLimitResponse, jobCreationLimiter } from '@/api/lib/rate-limiter';
import { v4 as uuidv4 } from 'uuid';

export async function GET(request: NextRequest) {
  // Rate limiting
  const ip = getClientIP(request);
  const rateLimit = await publicApiLimiter.limit(ip);
  
  if (!rateLimit.success) {
    return createRateLimitResponse(Math.ceil((rateLimit.reset - Date.now()) / 1000));
  }

  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    const urgency = searchParams.get('urgency');
    const homeownerId = searchParams.get('homeownerId');
    const contractorId = searchParams.get('contractorId');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    let query = supabaseAdmin!.from('jobs').select('*');

    // Apply filters
    if (status) {
      query = query.eq('status', status);
    }
    if (urgency) {
      query = query.eq('urgency', urgency);
    }
    if (homeownerId) {
      query = query.eq('homeowner_id', homeownerId);
    }
    if (contractorId) {
      query = query.eq('contractor_id', contractorId);
    }

    // Order by created_at descending
    query = query.order('created_at', { ascending: false });

    // Pagination
    query = query.range(offset, offset + limit - 1);

    const { data: jobs, error } = await query;

    if (error) {
      throw error;
    }

    // Transform database format to API format
    const transformedJobs = jobs?.map(job => ({
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
    })) || [];

    return NextResponse.json(transformedJobs, {
      status: 200,
      headers: {
        'Cache-Control': 'public, max-age=30, stale-while-revalidate=60',
      },
    });
  } catch (error) {
    console.error('Get jobs error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch jobs' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  // Rate limiting
  const user = await getAuthenticatedUser(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const rateLimit = await jobCreationLimiter.limit(user.id);
  if (!rateLimit.success) {
    return createRateLimitResponse(Math.ceil((rateLimit.reset - Date.now()) / 1000));
  }

  try {
    const body = await request.json();
    const {
      title,
      description,
      address,
      videoUrl,
      thumbnailUrl,
      scope,
      estimatedCost,
      laborHours,
      urgency = 'normal',
      predictionId,
    } = body;

    if (!title || !address) {
      return NextResponse.json(
        { error: 'Title and address are required' },
        { status: 400 }
      );
    }

    const jobId = uuidv4();
    const newJob = {
      id: jobId,
      title,
      description: description || null,
      homeowner_id: user.id,
      status: 'posted',
      urgency,
      address,
      video_url: videoUrl || null,
      thumbnail_url: thumbnailUrl || null,
      scope: scope || null,
      estimated_cost: estimatedCost || null,
      labor_hours: laborHours || null,
      prediction_id: predictionId || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data: job, error: insertError } = await supabaseAdmin!
      .from('jobs')
      .insert(newJob)
      .select()
      .single();

    if (insertError || !job) {
      console.error('Create job error:', insertError);
      return NextResponse.json(
        { error: 'Failed to create job' },
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
      status: 201,
    });
  } catch (error) {
    console.error('Create job error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

