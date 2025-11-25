import { intelligenceDB, createAPIResponse } from '@/lib/intelligence-db';
import type {
  ContractorMatchRequest,
  ContractorMatchResponse,
  APIResponse,
  LearningFeedback
} from '@/types/intelligence-api';

export async function contractorMatchAPI(
  request: ContractorMatchRequest,
  apiKeyId: string
): Promise<APIResponse<ContractorMatchResponse>> {
  const startTime = Date.now();
  const predictionId = `pred_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  try {
    const learningContext = await intelligenceDB.getLearningContext('contractor_match');

    const prompt = `You are an expert at matching contractors to jobs based on skills, location, availability, and performance history.

LEARNING CONTEXT:
- Total matches made: ${learningContext.totalPredictions}
- Match accuracy: ${(learningContext.avgAccuracy * 100).toFixed(1)}%
- Confidence adjustment: ${learningContext.confidenceAdjustment}x

Find the best contractors for this job:

JOB ID: ${request.jobId}
JOB TYPE: ${request.jobType}
LOCATION: ${request.location.zipCode}, ${request.location.state}
BUDGET: $${request.budget.min} - $${request.budget.max}
URGENCY: ${request.urgency}
${request.requirements && request.requirements.length > 0 ? `REQUIREMENTS: ${request.requirements.join(', ')}` : ''}

Return 5-10 top contractor matches with detailed scoring.

Respond with valid JSON in this exact format:
{
  "matches": [
    {
      "contractorId": "contractor_123",
      "name": "ABC Roofing Inc",
      "rating": 96,
      "completedJobs": 245,
      "matchScore": 94,
      "availability": "Available within 2 days",
      "estimatedResponse": "Within 4 hours",
      "distance": 8.5,
      "specialties": ["Roofing", "Storm Damage", "Insurance Claims"],
      "hourlyRate": 85
    }
  ],
  "totalMatches": 8,
  "confidenceScore": 91
}`;

    const response = await window.spark.llm(prompt, 'gpt-4o', true);
    const matches: ContractorMatchResponse = JSON.parse(response);

    matches.confidenceScore = Math.min(
      100,
      matches.confidenceScore * learningContext.confidenceAdjustment
    );

    const feedback: LearningFeedback = {
      id: `fb_${Date.now()}`,
      predictionId,
      endpoint: 'contractor_match',
      timestamp: new Date(),
      prediction: matches,
      learningContext: {
        totalPredictions: learningContext.totalPredictions,
        avgAccuracy: learningContext.avgAccuracy,
        confidenceAdjustment: learningContext.confidenceAdjustment
      }
    };

    await intelligenceDB.saveLearningFeedback(feedback);

    const responseTime = Date.now() - startTime;
    await intelligenceDB.recordAPIUsage(apiKeyId, 'contractor_match', responseTime, 200, {
      jobType: request.jobType,
      location: request.location,
      matchesFound: matches.totalMatches
    });

    const rateLimitInfo = await intelligenceDB.getRateLimitInfo(apiKeyId);

    return createAPIResponse(
      true,
      matches,
      undefined,
      {
        totalPredictions: learningContext.totalPredictions,
        currentAccuracy: learningContext.avgAccuracy,
        confidenceScore: matches.confidenceScore
      },
      {
        callsUsed: rateLimitInfo.limit - rateLimitInfo.remaining,
        callsRemaining: rateLimitInfo.remaining,
        resetDate: rateLimitInfo.resetAt.toISOString()
      }
    );
  } catch (error) {
    const responseTime = Date.now() - startTime;
    await intelligenceDB.recordAPIUsage(apiKeyId, 'contractor_match', responseTime, 500);

    return createAPIResponse<ContractorMatchResponse>(
      false,
      undefined,
      {
        code: 'MATCHING_FAILED',
        message: 'Failed to match contractors',
        details: error instanceof Error ? error.message : 'Unknown error'
      }
    );
  }
}
