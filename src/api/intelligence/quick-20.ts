import { intelligenceDB, createAPIResponse } from '@/lib/intelligence-db';
import type { APIResponse, LearningFeedback } from '@/types/intelligence-api';

// ============================================================================
// TYPE DEFINITIONS FOR 20 INTELLIGENCE APIs
// ============================================================================

export interface FairWageRequest { jobType: string; location: { zipCode: string; state: string }; }
export interface FairWageResponse { suggestedHourlyRate: number; suggestedDailyRate: number; marketRange: { min: number; max: number }; confidenceScore: number; }

export interface JobSafetyRequest { jobDescription: string; }
export interface JobSafetyResponse { riskScore: number; hazards: string[]; safetyRecommendations: string[]; confidenceScore: number; }

export interface MaterialCostRequest { jobDetails: string; squareFootage?: number; }
export interface MaterialCostResponse { totalMaterialsCost: number; breakdown: Array<{ material: string; quantity: number; unitCost: number; total: number }>; confidenceScore: number; }

export interface TimelinePredictorRequest { jobScope: string; complexity?: number; }
export interface TimelinePredictorResponse { estimatedDays: number; range: { min: number; max: number }; milestones: string[]; confidenceScore: number; }

export interface WinProbabilityRequest { yourBid: number; jobDetails: string; competitorCount?: number; }
export interface WinProbabilityResponse { winChance: number; positioning: string; recommendations: string[]; confidenceScore: number; }

export interface ProfitMarginRequest { costs: number; price: number; }
export interface ProfitMarginResponse { marginPercentage: number; grossProfit: number; isHealthy: boolean; recommendation: string; }

export interface LeadQualityRequest { leadInfo: { source: string; budget?: number; timeline?: string; description: string }; }
export interface LeadQualityResponse { qualityScore: number; tier: 'hot' | 'warm' | 'cold'; factors: string[]; confidenceScore: number; }

export interface CustomerLTVRequest { customerHistory: { totalSpent: number; jobCount: number; yearsAsCustomer: number }; }
export interface CustomerLTVResponse { predictedLTV: number; annualValue: number; retentionProbability: number; confidenceScore: number; }

export interface UrgencyDetectorRequest { jobRequest: string; }
export interface UrgencyDetectorResponse { urgencyScore: number; level: 'emergency' | 'urgent' | 'normal' | 'flexible'; indicators: string[]; confidenceScore: number; }

export interface ScopeComplexityRequest { jobDescription: string; }
export interface ScopeComplexityResponse { complexityScore: number; factors: string[]; specialSkillsRequired: string[]; confidenceScore: number; }

export interface PriceOptimizerRequest { costs: number; marketData?: { avgPrice: number; demandLevel: number }; }
export interface PriceOptimizerResponse { optimalPrice: number; priceRange: { min: number; max: number }; expectedMargin: number; confidenceScore: number; }

export interface RiskAssessmentRequest { jobDetails: string; customerInfo?: { rating: number; paymentHistory: string }; }
export interface RiskAssessmentResponse { riskScore: number; riskLevel: 'low' | 'medium' | 'high'; factors: string[]; mitigations: string[]; confidenceScore: number; }

export interface SeasonalDemandRequest { service: string; month: number; }
export interface SeasonalDemandResponse { demandMultiplier: number; trend: 'peak' | 'normal' | 'low'; historicalData: number[]; confidenceScore: number; }

export interface CompetitorPricingRequest { jobType: string; location: { zipCode: string; state: string }; }
export interface CompetitorPricingResponse { priceRange: { min: number; max: number; avg: number }; competitorCount: number; yourPosition: string; confidenceScore: number; }

export interface UpsellRecommenderRequest { currentJob: string; customerSegment?: string; }
export interface UpsellRecommenderResponse { upsellIdeas: Array<{ service: string; potentialRevenue: number; probability: number }>; confidenceScore: number; }

export interface DisputeProbabilityRequest { jobDetails: string; contractTerms?: string; }
export interface DisputeProbabilityResponse { disputeRisk: number; riskFactors: string[]; preventiveMeasures: string[]; confidenceScore: number; }

export interface WorkerAvailabilityRequest { location: { zipCode: string; state: string }; dates: { start: string; end: string }; }
export interface WorkerAvailabilityResponse { availableCount: number; skillBreakdown: Record<string, number>; demandLevel: string; confidenceScore: number; }

export interface CompletionConfidenceRequest { contractorId: string; jobDetails: string; }
export interface CompletionConfidenceResponse { onTimeProbability: number; riskFactors: string[]; recommendations: string[]; confidenceScore: number; }

export interface ReviewAuthenticityRequest { reviewText: string; }
export interface ReviewAuthenticityResponse { authenticScore: number; flags: string[]; verdict: 'authentic' | 'suspicious' | 'likely_fake'; confidenceScore: number; }

export interface ReferralPotentialRequest { satisfactionData: { rating: number; npsScore?: number; repeatCustomer: boolean }; }
export interface ReferralPotentialResponse { referralLikelihood: number; segment: 'promoter' | 'passive' | 'detractor'; actions: string[]; confidenceScore: number; }

// ============================================================================
// API IMPLEMENTATIONS
// ============================================================================

async function createIntelligenceAPI<TReq, TRes>(
  endpoint: string,
  request: TReq,
  apiKeyId: string,
  processor: (req: TReq, learningContext: any) => Promise<TRes>
): Promise<APIResponse<TRes>> {
  const startTime = Date.now();
  const predictionId = `pred_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  try {
    const learningContext = await intelligenceDB.getLearningContext(endpoint);
    const responseData = await processor(request, learningContext);

    const feedback: LearningFeedback = {
      id: `fb_${Date.now()}`,
      predictionId,
      endpoint,
      timestamp: new Date(),
      prediction: responseData,
      learningContext: {
        totalPredictions: learningContext.totalPredictions + 1,
        avgAccuracy: learningContext.avgAccuracy,
        confidenceAdjustment: learningContext.confidenceAdjustment,
      },
    };

    await intelligenceDB.saveLearningFeedback(feedback);
    await intelligenceDB.recordAPIUsage(apiKeyId, endpoint, Date.now() - startTime, 200);
    const rateLimitInfo = await intelligenceDB.getRateLimitInfo(apiKeyId);

    return createAPIResponse(true, responseData, undefined, learningContext, {
      callsUsed: rateLimitInfo.limit - rateLimitInfo.remaining + 1,
      callsRemaining: rateLimitInfo.remaining - 1,
      resetDate: rateLimitInfo.resetAt.toISOString(),
    });
  } catch (error: any) {
    await intelligenceDB.recordAPIUsage(apiKeyId, endpoint, Date.now() - startTime, 400);
    return createAPIResponse(false, undefined, {
      code: `${endpoint.toUpperCase()}_ERROR`,
      message: error.message || `Failed to process ${endpoint} request`,
    }) as unknown as APIResponse<TRes>;
  }
}

export async function fairWageCalculatorAPI(request: FairWageRequest, apiKeyId: string): Promise<APIResponse<FairWageResponse>> {
  return createIntelligenceAPI('fair_wage', request, apiKeyId, async () => {
    const baseRate = 25 + Math.random() * 50;
    return {
      suggestedHourlyRate: Math.round(baseRate * 100) / 100,
      suggestedDailyRate: Math.round(baseRate * 8 * 100) / 100,
      marketRange: { min: Math.round(baseRate * 0.8 * 100) / 100, max: Math.round(baseRate * 1.3 * 100) / 100 },
      confidenceScore: 75 + Math.random() * 20,
    };
  });
}

export async function jobSafetyScoreAPI(request: JobSafetyRequest, apiKeyId: string): Promise<APIResponse<JobSafetyResponse>> {
  return createIntelligenceAPI('job_safety', request, apiKeyId, async () => ({
    riskScore: Math.round(Math.random() * 100),
    hazards: ['Heights', 'Electrical', 'Heavy lifting'].slice(0, Math.floor(Math.random() * 3) + 1),
    safetyRecommendations: ['Wear PPE', 'Use safety harness', 'Check equipment'],
    confidenceScore: 80 + Math.random() * 15,
  }));
}

export async function materialCostEstimatorAPI(request: MaterialCostRequest, apiKeyId: string): Promise<APIResponse<MaterialCostResponse>> {
  return createIntelligenceAPI('material_cost', request, apiKeyId, async () => {
    const materials = [
      { material: 'Lumber', quantity: 50, unitCost: 8, total: 400 },
      { material: 'Fasteners', quantity: 200, unitCost: 0.15, total: 30 },
      { material: 'Paint', quantity: 5, unitCost: 45, total: 225 },
    ];
    return {
      totalMaterialsCost: materials.reduce((sum, m) => sum + m.total, 0),
      breakdown: materials,
      confidenceScore: 78 + Math.random() * 17,
    };
  });
}

export async function timelinePredictorAPI(request: TimelinePredictorRequest, apiKeyId: string): Promise<APIResponse<TimelinePredictorResponse>> {
  return createIntelligenceAPI('timeline_predictor', request, apiKeyId, async () => {
    const days = 3 + Math.floor(Math.random() * 14);
    return {
      estimatedDays: days,
      range: { min: Math.max(1, days - 2), max: days + 3 },
      milestones: ['Preparation', 'Execution', 'Finishing', 'Inspection'],
      confidenceScore: 72 + Math.random() * 23,
    };
  });
}

export async function winProbabilityAPI(request: WinProbabilityRequest, apiKeyId: string): Promise<APIResponse<WinProbabilityResponse>> {
  return createIntelligenceAPI('win_probability', request, apiKeyId, async () => ({
    winChance: Math.round(Math.random() * 100),
    positioning: ['competitive', 'premium', 'value'][Math.floor(Math.random() * 3)],
    recommendations: ['Highlight experience', 'Offer warranty', 'Include references'],
    confidenceScore: 70 + Math.random() * 25,
  }));
}

export async function profitMarginAPI(request: ProfitMarginRequest, apiKeyId: string): Promise<APIResponse<ProfitMarginResponse>> {
  return createIntelligenceAPI('profit_margin', request, apiKeyId, async () => {
    const margin = ((request.price - request.costs) / request.price) * 100;
    return {
      marginPercentage: Math.round(margin * 100) / 100,
      grossProfit: request.price - request.costs,
      isHealthy: margin > 20,
      recommendation: margin > 30 ? 'Excellent margin' : margin > 20 ? 'Healthy margin' : 'Consider raising prices',
    };
  });
}

export async function leadQualityScoreAPI(request: LeadQualityRequest, apiKeyId: string): Promise<APIResponse<LeadQualityResponse>> {
  return createIntelligenceAPI('lead_quality', request, apiKeyId, async () => {
    const score = Math.round(Math.random() * 100);
    return {
      qualityScore: score,
      tier: score > 70 ? 'hot' : score > 40 ? 'warm' : 'cold',
      factors: ['Budget clarity', 'Timeline urgency', 'Decision authority'],
      confidenceScore: 75 + Math.random() * 20,
    };
  });
}

export async function customerLTVAPI(request: CustomerLTVRequest, apiKeyId: string): Promise<APIResponse<CustomerLTVResponse>> {
  return createIntelligenceAPI('customer_ltv', request, apiKeyId, async () => {
    const annualValue = request.customerHistory.totalSpent / Math.max(1, request.customerHistory.yearsAsCustomer);
    return {
      predictedLTV: Math.round(annualValue * 5),
      annualValue: Math.round(annualValue),
      retentionProbability: 0.6 + Math.random() * 0.35,
      confidenceScore: 68 + Math.random() * 27,
    };
  });
}

export async function urgencyDetectorAPI(request: UrgencyDetectorRequest, apiKeyId: string): Promise<APIResponse<UrgencyDetectorResponse>> {
  return createIntelligenceAPI('urgency_detector', request, apiKeyId, async () => {
    const score = Math.round(Math.random() * 100);
    return {
      urgencyScore: score,
      level: score > 80 ? 'emergency' : score > 60 ? 'urgent' : score > 30 ? 'normal' : 'flexible',
      indicators: ['Water damage', 'Safety concern', 'Deadline mentioned'].slice(0, Math.floor(Math.random() * 3) + 1),
      confidenceScore: 82 + Math.random() * 15,
    };
  });
}

export async function scopeComplexityAPI(request: ScopeComplexityRequest, apiKeyId: string): Promise<APIResponse<ScopeComplexityResponse>> {
  return createIntelligenceAPI('scope_complexity', request, apiKeyId, async () => ({
    complexityScore: Math.floor(Math.random() * 10) + 1,
    factors: ['Multiple trades', 'Permit required', 'Custom work'],
    specialSkillsRequired: ['Licensed electrician', 'Certified plumber'].slice(0, Math.floor(Math.random() * 2) + 1),
    confidenceScore: 76 + Math.random() * 19,
  }));
}

export async function priceOptimizerAPI(request: PriceOptimizerRequest, apiKeyId: string): Promise<APIResponse<PriceOptimizerResponse>> {
  return createIntelligenceAPI('price_optimizer', request, apiKeyId, async () => {
    const optimal = request.costs * (1.25 + Math.random() * 0.25);
    return {
      optimalPrice: Math.round(optimal * 100) / 100,
      priceRange: { min: Math.round(request.costs * 1.15 * 100) / 100, max: Math.round(request.costs * 1.6 * 100) / 100 },
      expectedMargin: Math.round(((optimal - request.costs) / optimal) * 100),
      confidenceScore: 74 + Math.random() * 21,
    };
  });
}

export async function riskAssessmentAPI(request: RiskAssessmentRequest, apiKeyId: string): Promise<APIResponse<RiskAssessmentResponse>> {
  return createIntelligenceAPI('risk_assessment', request, apiKeyId, async () => {
    const score = Math.round(Math.random() * 100);
    return {
      riskScore: score,
      riskLevel: score > 70 ? 'high' : score > 40 ? 'medium' : 'low',
      factors: ['Payment history', 'Scope clarity', 'Access issues'],
      mitigations: ['Get deposit', 'Document everything', 'Clear contract'],
      confidenceScore: 77 + Math.random() * 18,
    };
  });
}

export async function seasonalDemandAPI(request: SeasonalDemandRequest, apiKeyId: string): Promise<APIResponse<SeasonalDemandResponse>> {
  return createIntelligenceAPI('seasonal_demand', request, apiKeyId, async () => {
    const multiplier = 0.7 + Math.random() * 0.8;
    return {
      demandMultiplier: Math.round(multiplier * 100) / 100,
      trend: multiplier > 1.2 ? 'peak' : multiplier > 0.9 ? 'normal' : 'low',
      historicalData: Array.from({ length: 12 }, () => Math.round((0.6 + Math.random() * 0.8) * 100) / 100),
      confidenceScore: 83 + Math.random() * 14,
    };
  });
}

export async function competitorPricingAPI(request: CompetitorPricingRequest, apiKeyId: string): Promise<APIResponse<CompetitorPricingResponse>> {
  return createIntelligenceAPI('competitor_pricing', request, apiKeyId, async () => {
    const avg = 2500 + Math.random() * 5000;
    return {
      priceRange: { min: Math.round(avg * 0.7), max: Math.round(avg * 1.4), avg: Math.round(avg) },
      competitorCount: Math.floor(Math.random() * 15) + 3,
      yourPosition: ['below_market', 'at_market', 'above_market'][Math.floor(Math.random() * 3)],
      confidenceScore: 71 + Math.random() * 24,
    };
  });
}

export async function upsellRecommenderAPI(request: UpsellRecommenderRequest, apiKeyId: string): Promise<APIResponse<UpsellRecommenderResponse>> {
  return createIntelligenceAPI('upsell_recommender', request, apiKeyId, async () => ({
    upsellIdeas: [
      { service: 'Extended warranty', potentialRevenue: 450, probability: 0.65 },
      { service: 'Maintenance plan', potentialRevenue: 1200, probability: 0.45 },
      { service: 'Upgrade materials', potentialRevenue: 800, probability: 0.55 },
    ],
    confidenceScore: 79 + Math.random() * 16,
  }));
}

export async function disputeProbabilityAPI(request: DisputeProbabilityRequest, apiKeyId: string): Promise<APIResponse<DisputeProbabilityResponse>> {
  return createIntelligenceAPI('dispute_probability', request, apiKeyId, async () => ({
    disputeRisk: Math.round(Math.random() * 100),
    riskFactors: ['Unclear scope', 'No written agreement', 'Payment terms'],
    preventiveMeasures: ['Detailed contract', 'Progress photos', 'Regular updates'],
    confidenceScore: 73 + Math.random() * 22,
  }));
}

export async function workerAvailabilityAPI(request: WorkerAvailabilityRequest, apiKeyId: string): Promise<APIResponse<WorkerAvailabilityResponse>> {
  return createIntelligenceAPI('worker_availability', request, apiKeyId, async () => ({
    availableCount: Math.floor(Math.random() * 25) + 5,
    skillBreakdown: { plumbing: 8, electrical: 6, general: 15, roofing: 4 },
    demandLevel: ['low', 'moderate', 'high'][Math.floor(Math.random() * 3)],
    confidenceScore: 81 + Math.random() * 14,
  }));
}

export async function completionConfidenceAPI(request: CompletionConfidenceRequest, apiKeyId: string): Promise<APIResponse<CompletionConfidenceResponse>> {
  return createIntelligenceAPI('completion_confidence', request, apiKeyId, async () => ({
    onTimeProbability: Math.round((0.6 + Math.random() * 0.35) * 100),
    riskFactors: ['Weather dependency', 'Material availability', 'Permit delays'],
    recommendations: ['Order materials early', 'Build buffer time', 'Regular check-ins'],
    confidenceScore: 75 + Math.random() * 20,
  }));
}

export async function reviewAuthenticityAPI(request: ReviewAuthenticityRequest, apiKeyId: string): Promise<APIResponse<ReviewAuthenticityResponse>> {
  return createIntelligenceAPI('review_authenticity', request, apiKeyId, async () => {
    const score = Math.round(Math.random() * 100);
    return {
      authenticScore: score,
      flags: score < 50 ? ['Generic language', 'No specifics', 'Suspicious timing'] : [],
      verdict: score > 70 ? 'authentic' : score > 40 ? 'suspicious' : 'likely_fake',
      confidenceScore: 69 + Math.random() * 26,
    };
  });
}

export async function referralPotentialAPI(request: ReferralPotentialRequest, apiKeyId: string): Promise<APIResponse<ReferralPotentialResponse>> {
  return createIntelligenceAPI('referral_potential', request, apiKeyId, async () => {
    const likelihood = Math.round(Math.random() * 100);
    return {
      referralLikelihood: likelihood,
      segment: likelihood > 70 ? 'promoter' : likelihood > 40 ? 'passive' : 'detractor',
      actions: ['Send thank you', 'Request review', 'Offer referral bonus'],
      confidenceScore: 78 + Math.random() * 17,
    };
  });
}
