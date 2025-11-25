import { intelligenceDB, createAPIResponse } from '@/lib/intelligence-db';
import type {
  DemandHeatmapRequest,
  DemandHeatmapResponse,
  APIResponse,
  LearningFeedback
} from '@/types/intelligence-api';

export async function demandHeatmapAPI(
  request: DemandHeatmapRequest,
  apiKeyId: string
): Promise<APIResponse<DemandHeatmapResponse>> {
  const startTime = Date.now();
  const predictionId = `pred_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  try {
    const learningContext = await intelligenceDB.getLearningContext('demand_heatmap');

    const prompt = `You are a market analyst specializing in home services demand patterns.

LEARNING CONTEXT:
- Total analyses: ${learningContext.totalPredictions}
- Forecast accuracy: ${(learningContext.avgAccuracy * 100).toFixed(1)}%
- Confidence adjustment: ${learningContext.confidenceAdjustment}x

Analyze demand for:

REGION TYPE: ${request.region}
REGION VALUE: ${request.regionValue}
${request.serviceType ? `SERVICE TYPE: ${request.serviceType}` : 'All Services'}
TIME RANGE: ${request.timeRange}

Provide detailed demand heatmap with trends and opportunities.

Respond with valid JSON in this exact format:
{
  "heatmap": [
    {
      "location": {
        "zipCode": "90210",
        "city": "Beverly Hills",
        "state": "CA",
        "lat": 34.0901,
        "lng": -118.4065
      },
      "demand": 92,
      "trend": "rising",
      "avgJobValue": 4500,
      "competition": 65,
      "opportunity": 88
    }
  ],
  "insights": [
    "Storm season driving 45% increase in roofing demand",
    "Beverly Hills area shows premium pricing tolerance",
    "Low competition in 90210 zip code"
  ],
  "recommendations": [
    "Focus marketing on 90210 area",
    "Prepare for storm-related surge in next 2 weeks",
    "Premium pricing viable in top 3 zip codes"
  ]
}`;

    const response = await window.spark.llm(prompt, 'gpt-4o', true);
    const heatmap: DemandHeatmapResponse = JSON.parse(response);

    const feedback: LearningFeedback = {
      id: `fb_${Date.now()}`,
      predictionId,
      endpoint: 'demand_heatmap',
      timestamp: new Date(),
      prediction: heatmap,
      learningContext: {
        totalPredictions: learningContext.totalPredictions,
        avgAccuracy: learningContext.avgAccuracy,
        confidenceAdjustment: learningContext.confidenceAdjustment
      }
    };

    await intelligenceDB.saveLearningFeedback(feedback);

    const responseTime = Date.now() - startTime;
    await intelligenceDB.recordAPIUsage(apiKeyId, 'demand_heatmap', responseTime, 200, {
      region: request.region,
      regionValue: request.regionValue,
      timeRange: request.timeRange
    });

    const rateLimitInfo = await intelligenceDB.getRateLimitInfo(apiKeyId);

    return createAPIResponse(
      true,
      heatmap,
      undefined,
      {
        totalPredictions: learningContext.totalPredictions,
        currentAccuracy: learningContext.avgAccuracy,
        confidenceScore: 90
      },
      {
        callsUsed: rateLimitInfo.limit - rateLimitInfo.remaining,
        callsRemaining: rateLimitInfo.remaining,
        resetDate: rateLimitInfo.resetAt.toISOString()
      }
    );
  } catch (error) {
    const responseTime = Date.now() - startTime;
    await intelligenceDB.recordAPIUsage(apiKeyId, 'demand_heatmap', responseTime, 500);

    return createAPIResponse<DemandHeatmapResponse>(
      false,
      undefined,
      {
        code: 'HEATMAP_GENERATION_FAILED',
        message: 'Failed to generate demand heatmap',
        details: error instanceof Error ? error.message : 'Unknown error'
      }
    );
  }
}
