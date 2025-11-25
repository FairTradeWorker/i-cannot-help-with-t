import { intelligenceDB, createAPIResponse } from '@/lib/intelligence-db';
import type {
  InstantQuoteRequest,
  InstantQuoteResponse,
  APIResponse,
  LearningFeedback
} from '@/types/intelligence-api';

export async function instantQuoteAPI(
  request: InstantQuoteRequest,
  apiKeyId: string
): Promise<APIResponse<InstantQuoteResponse>> {
  const startTime = Date.now();
  const predictionId = `pred_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  try {
    const learningContext = await intelligenceDB.getLearningContext('instant_quote');

    const prompt = `You are an expert pricing consultant for home services.

LEARNING CONTEXT:
- Total quotes generated: ${learningContext.totalPredictions}
- Current accuracy: ${(learningContext.avgAccuracy * 100).toFixed(1)}%
- Confidence adjustment: ${learningContext.confidenceAdjustment}x

Generate an instant quote for this job:

JOB TYPE: ${request.jobType}
${request.squareFootage ? `SQUARE FOOTAGE: ${request.squareFootage}` : ''}
${request.materials && request.materials.length > 0 ? `MATERIALS: ${request.materials.join(', ')}` : ''}
URGENCY: ${request.urgency}
LOCATION: ${request.location.zipCode}, ${request.location.state}

Provide accurate pricing with detailed breakdown and timeline.

Respond with valid JSON in this exact format:
{
  "quoteId": "quote_${Date.now()}",
  "totalCost": {
    "min": 2000,
    "max": 3000
  },
  "breakdown": {
    "materials": 1200,
    "labor": 1200,
    "overhead": 400,
    "profit": 200
  },
  "timeline": {
    "min": 3,
    "max": 5,
    "unit": "days"
  },
  "validUntil": "${new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()}",
  "confidenceScore": 88
}`;

    const response = await window.spark.llm(prompt, 'gpt-4o', true);
    const quote: InstantQuoteResponse = JSON.parse(response);

    quote.confidenceScore = Math.min(
      100,
      quote.confidenceScore * learningContext.confidenceAdjustment
    );

    const feedback: LearningFeedback = {
      id: `fb_${Date.now()}`,
      predictionId,
      endpoint: 'instant_quote',
      timestamp: new Date(),
      prediction: quote,
      learningContext: {
        totalPredictions: learningContext.totalPredictions,
        avgAccuracy: learningContext.avgAccuracy,
        confidenceAdjustment: learningContext.confidenceAdjustment
      }
    };

    await intelligenceDB.saveLearningFeedback(feedback);

    const responseTime = Date.now() - startTime;
    await intelligenceDB.recordAPIUsage(apiKeyId, 'instant_quote', responseTime, 200, {
      jobType: request.jobType,
      urgency: request.urgency,
      location: request.location
    });

    const rateLimitInfo = await intelligenceDB.getRateLimitInfo(apiKeyId);

    return createAPIResponse(
      true,
      quote,
      undefined,
      {
        totalPredictions: learningContext.totalPredictions,
        currentAccuracy: learningContext.avgAccuracy,
        confidenceScore: quote.confidenceScore
      },
      {
        callsUsed: rateLimitInfo.limit - rateLimitInfo.remaining,
        callsRemaining: rateLimitInfo.remaining,
        resetDate: rateLimitInfo.resetAt.toISOString()
      }
    );
  } catch (error) {
    const responseTime = Date.now() - startTime;
    await intelligenceDB.recordAPIUsage(apiKeyId, 'instant_quote', responseTime, 500);

    return createAPIResponse<InstantQuoteResponse>(
      false,
      undefined,
      {
        code: 'QUOTE_GENERATION_FAILED',
        message: 'Failed to generate instant quote',
        details: error instanceof Error ? error.message : 'Unknown error'
      }
    );
  }
}
