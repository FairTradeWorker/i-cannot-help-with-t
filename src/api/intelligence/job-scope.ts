import { intelligenceDB, createAPIResponse } from '@/lib/intelligence-db';
import type {
  JobScopeRequest,
  JobScopeResponse,
  APIResponse,
  LearningFeedback
} from '@/types/intelligence-api';

export async function jobScopeAPI(
  request: JobScopeRequest,
  apiKeyId: string
): Promise<APIResponse<JobScopeResponse>> {
  const startTime = Date.now();
  const predictionId = `pred_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  try {
    const learningContext = await intelligenceDB.getLearningContext('job_scope');

    const prompt = `You are an expert construction estimator analyzing home repair jobs.

LEARNING CONTEXT:
- Total job scopes analyzed: ${learningContext.totalPredictions}
- Current accuracy: ${(learningContext.avgAccuracy * 100).toFixed(1)}%
- Confidence adjustment: ${learningContext.confidenceAdjustment}x

Analyze this job and provide a detailed scope of work:

DESCRIPTION: ${request.description}
LOCATION: ${request.location.zipCode}, ${request.location.state}
${request.videoUrl ? `VIDEO URL: ${request.videoUrl}` : ''}
${request.imageUrl ? `IMAGE URL: ${request.imageUrl}` : ''}

Provide a comprehensive job scope with accurate cost estimates, materials list, labor hours, and timeline.

Respond with valid JSON in this exact format:
{
  "jobTitle": "descriptive job title",
  "summary": "detailed summary of the work required",
  "category": "specific service category",
  "estimatedSquareFootage": 100,
  "materials": [
    {
      "name": "material name",
      "quantity": 10,
      "unit": "sq ft or sheets or gallons etc",
      "estimatedCost": 250
    }
  ],
  "laborHours": 16,
  "estimatedCost": {
    "min": 2500,
    "max": 3500
  },
  "confidenceScore": 87,
  "recommendations": ["recommendation 1", "recommendation 2"],
  "warningsAndRisks": ["warning or risk 1", "warning or risk 2"],
  "permitRequired": false,
  "estimatedTimeline": {
    "min": 2,
    "max": 3,
    "unit": "days"
  }
}`;

    const response = await window.spark.llm(prompt, 'gpt-4o', true);
    const jobScope: JobScopeResponse = JSON.parse(response);

    jobScope.confidenceScore = Math.min(
      100,
      jobScope.confidenceScore * learningContext.confidenceAdjustment
    );

    const feedback: LearningFeedback = {
      id: `fb_${Date.now()}`,
      predictionId,
      endpoint: 'job_scope',
      timestamp: new Date(),
      prediction: jobScope,
      learningContext: {
        totalPredictions: learningContext.totalPredictions,
        avgAccuracy: learningContext.avgAccuracy,
        confidenceAdjustment: learningContext.confidenceAdjustment
      }
    };

    await intelligenceDB.saveLearningFeedback(feedback);

    const responseTime = Date.now() - startTime;
    await intelligenceDB.recordAPIUsage(apiKeyId, 'job_scope', responseTime, 200, {
      location: request.location,
      hasVideo: !!request.videoUrl,
      hasImage: !!request.imageUrl
    });

    const rateLimitInfo = await intelligenceDB.getRateLimitInfo(apiKeyId);

    return createAPIResponse(
      true,
      jobScope,
      undefined,
      {
        totalPredictions: learningContext.totalPredictions,
        currentAccuracy: learningContext.avgAccuracy,
        confidenceScore: jobScope.confidenceScore
      },
      {
        callsUsed: rateLimitInfo.limit - rateLimitInfo.remaining,
        callsRemaining: rateLimitInfo.remaining,
        resetDate: rateLimitInfo.resetAt.toISOString()
      }
    );
  } catch (error) {
    const responseTime = Date.now() - startTime;
    await intelligenceDB.recordAPIUsage(apiKeyId, 'job_scope', responseTime, 500);

    return createAPIResponse<JobScopeResponse>(
      false,
      undefined,
      {
        code: 'ANALYSIS_FAILED',
        message: 'Failed to analyze job scope',
        details: error instanceof Error ? error.message : 'Unknown error'
      }
    );
  }
}
