import { z } from 'zod';
import { intelligenceDB, createAPIResponse } from '@/lib/intelligence-db';
import type { APIResponse, LearningFeedback } from '@/types/intelligence-api';

// ============================================================================
// REQUEST SCHEMAS
// ============================================================================

const WeatherImpactRequestSchema = z.object({
  jobDates: z.array(z.string()),
  location: z.object({
    zipCode: z.string(),
    state: z.string(),
  }),
});

const InsuranceClaimRequestSchema = z.object({
  damagePhotos: z.array(z.string()),
  description: z.string(),
  propertyType: z.string().optional(),
});

const LeadSourceRequestSchema = z.object({
  leadSources: z.array(z.object({
    source: z.string(),
    leads: z.number(),
    conversions: z.number(),
    cost: z.number(),
  })),
});

const CashflowRequestSchema = z.object({
  upcomingJobs: z.array(z.object({
    id: z.string(),
    value: z.number(),
    expectedPayDate: z.string(),
  })),
  expenses: z.array(z.object({
    category: z.string(),
    amount: z.number(),
    dueDate: z.string(),
  })),
  currentBalance: z.number(),
});

const CrewSizeRequestSchema = z.object({
  jobScope: z.string(),
  squareFootage: z.number(),
  timeline: z.number(),
  complexity: z.enum(['simple', 'moderate', 'complex']),
});

const EquipmentRequestSchema = z.object({
  jobType: z.string(),
  scale: z.enum(['small', 'medium', 'large', 'commercial']),
  duration: z.number(),
});

const PermitRequirementRequestSchema = z.object({
  jobType: z.string(),
  location: z.object({
    zipCode: z.string(),
    state: z.string(),
    city: z.string().optional(),
  }),
  scope: z.object({
    squareFootage: z.number(),
    structural: z.boolean(),
    electrical: z.boolean(),
    plumbing: z.boolean(),
  }),
});

const QualityChecklistRequestSchema = z.object({
  jobType: z.string(),
  specialRequirements: z.array(z.string()).optional(),
});

const CustomerCommunicationRequestSchema = z.object({
  customerType: z.enum(['residential', 'commercial', 'property_manager', 'insurance']),
  situation: z.enum(['quote', 'complaint', 'update', 'follow_up', 'emergency', 'upsell']),
  previousInteractions: z.number().optional(),
});

const BidTimingRequestSchema = z.object({
  jobDetails: z.object({
    type: z.string(),
    value: z.number(),
    urgency: z.enum(['low', 'medium', 'high']),
  }),
  competitorCount: z.number(),
  customerResponseTime: z.number().optional(),
});

const TerritoryExpansionRequestSchema = z.object({
  currentTerritories: z.array(z.string()),
  marketData: z.object({
    targetZipCodes: z.array(z.string()),
    populationDensity: z.number().optional(),
    averageIncome: z.number().optional(),
  }),
});

const SubcontractorNeedRequestSchema = z.object({
  jobRequirements: z.object({
    type: z.string(),
    laborHours: z.number(),
    specialties: z.array(z.string()),
    startDate: z.string(),
  }),
  yourCapacity: z.object({
    availableCrew: z.number(),
    skills: z.array(z.string()),
    currentWorkload: z.number(),
  }),
});

const WarrantyPricingRequestSchema = z.object({
  jobType: z.string(),
  materials: z.array(z.object({
    name: z.string(),
    cost: z.number(),
    expectedLife: z.number(),
  })),
  laborCost: z.number(),
  timeline: z.number(),
});

const MarketingMessageRequestSchema = z.object({
  customerType: z.enum(['homeowner', 'landlord', 'property_manager', 'commercial']),
  service: z.string(),
  tone: z.enum(['professional', 'friendly', 'urgent', 'premium']).optional(),
});

const JobBundleRequestSchema = z.object({
  customerLocation: z.string(),
  customerNeeds: z.array(z.string()),
  budget: z.number().optional(),
});

const TravelTimeRequestSchema = z.object({
  jobLocations: z.array(z.object({
    id: z.string(),
    address: z.string(),
    zipCode: z.string(),
    priority: z.number(),
  })),
  crewLocation: z.object({
    address: z.string(),
    zipCode: z.string(),
  }),
});

const SkillsGapRequestSchema = z.object({
  crewSkills: z.array(z.object({
    memberId: z.string(),
    skills: z.array(z.string()),
    certifications: z.array(z.string()),
  })),
  upcomingJobs: z.array(z.object({
    type: z.string(),
    requiredSkills: z.array(z.string()),
    date: z.string(),
  })),
});

const PeakSeasonRequestSchema = z.object({
  serviceType: z.string(),
  location: z.object({
    zipCode: z.string(),
    state: z.string(),
  }),
});

const CustomerRetentionRequestSchema = z.object({
  customerHistory: z.object({
    totalJobs: z.number(),
    totalSpent: z.number(),
    firstJobDate: z.string(),
    lastJobDate: z.string(),
    avgTimeBetweenJobs: z.number(),
  }),
  satisfaction: z.object({
    avgRating: z.number(),
    complaints: z.number(),
    referrals: z.number(),
  }),
});

const EmergencyPricingRequestSchema = z.object({
  jobUrgency: z.enum(['same_day', 'next_day', 'within_48h', 'weekend', 'holiday']),
  timeOfDay: z.enum(['business_hours', 'evening', 'night', 'early_morning']),
  jobType: z.string(),
  baseCost: z.number(),
});

// ============================================================================
// REQUEST TYPES
// ============================================================================

export type WeatherImpactRequest = z.infer<typeof WeatherImpactRequestSchema>;
export type InsuranceClaimRequest = z.infer<typeof InsuranceClaimRequestSchema>;
export type LeadSourceRequest = z.infer<typeof LeadSourceRequestSchema>;
export type CashflowRequest = z.infer<typeof CashflowRequestSchema>;
export type CrewSizeRequest = z.infer<typeof CrewSizeRequestSchema>;
export type EquipmentRequest = z.infer<typeof EquipmentRequestSchema>;
export type PermitRequirementRequest = z.infer<typeof PermitRequirementRequestSchema>;
export type QualityChecklistRequest = z.infer<typeof QualityChecklistRequestSchema>;
export type CustomerCommunicationRequest = z.infer<typeof CustomerCommunicationRequestSchema>;
export type BidTimingRequest = z.infer<typeof BidTimingRequestSchema>;
export type TerritoryExpansionRequest = z.infer<typeof TerritoryExpansionRequestSchema>;
export type SubcontractorNeedRequest = z.infer<typeof SubcontractorNeedRequestSchema>;
export type WarrantyPricingRequest = z.infer<typeof WarrantyPricingRequestSchema>;
export type MarketingMessageRequest = z.infer<typeof MarketingMessageRequestSchema>;
export type JobBundleRequest = z.infer<typeof JobBundleRequestSchema>;
export type TravelTimeRequest = z.infer<typeof TravelTimeRequestSchema>;
export type SkillsGapRequest = z.infer<typeof SkillsGapRequestSchema>;
export type PeakSeasonRequest = z.infer<typeof PeakSeasonRequestSchema>;
export type CustomerRetentionRequest = z.infer<typeof CustomerRetentionRequestSchema>;
export type EmergencyPricingRequest = z.infer<typeof EmergencyPricingRequestSchema>;

// ============================================================================
// RESPONSE INTERFACES
// ============================================================================

export interface WeatherImpactResponse {
  delayDays: number;
  costImpact: number;
  affectedDates: Array<{
    date: string;
    weatherType: string;
    severity: 'low' | 'medium' | 'high';
    workability: number;
  }>;
  recommendations: string[];
  alternativeSchedule: Array<{
    originalDate: string;
    suggestedDate: string;
    reason: string;
  }>;
}

export interface InsuranceClaimResponse {
  claimEstimate: {
    min: number;
    max: number;
    confidence: number;
  };
  damageAssessment: Array<{
    area: string;
    severity: 'minor' | 'moderate' | 'severe';
    repairCost: number;
  }>;
  documentationNeeded: string[];
  claimStrength: number;
  recommendations: string[];
}

export interface LeadSourceResponse {
  bestChannels: Array<{
    source: string;
    conversionRate: number;
    costPerLead: number;
    costPerConversion: number;
    roi: number;
    recommendation: 'increase' | 'maintain' | 'decrease' | 'eliminate';
  }>;
  budgetAllocation: Array<{
    source: string;
    currentPercent: number;
    recommendedPercent: number;
  }>;
  projectedImprovement: {
    leads: number;
    conversions: number;
    costSavings: number;
  };
}

export interface CashflowResponse {
  forecast: {
    day30: { balance: number; inflow: number; outflow: number };
    day60: { balance: number; inflow: number; outflow: number };
    day90: { balance: number; inflow: number; outflow: number };
  };
  cashflowHealth: 'critical' | 'tight' | 'healthy' | 'strong';
  alerts: Array<{
    date: string;
    type: 'shortfall' | 'surplus' | 'large_expense';
    amount: number;
    recommendation: string;
  }>;
  recommendations: string[];
}

export interface CrewSizeResponse {
  optimalCrewSize: number;
  rolesNeeded: Array<{
    role: string;
    count: number;
    skillLevel: 'junior' | 'mid' | 'senior';
    hourlyRate: number;
  }>;
  totalLaborCost: number;
  estimatedDuration: number;
  efficiency: number;
  alternatives: Array<{
    crewSize: number;
    duration: number;
    cost: number;
    tradeoff: string;
  }>;
}

export interface EquipmentResponse {
  requiredEquipment: Array<{
    name: string;
    quantity: number;
    dailyRentalCost: number;
    purchaseCost: number;
    recommendation: 'rent' | 'buy' | 'use_existing';
    reasoning: string;
  }>;
  totalRentalCost: number;
  totalPurchaseCost: number;
  breakEvenDays: number;
  recommendations: string[];
}

export interface PermitRequirementResponse {
  permitsNeeded: Array<{
    type: string;
    authority: string;
    estimatedCost: number;
    processingDays: number;
    required: boolean;
  }>;
  totalCost: number;
  totalTimeline: number;
  inspectionSchedule: Array<{
    stage: string;
    inspectionType: string;
    estimatedDate: string;
  }>;
  recommendations: string[];
  riskFactors: string[];
}

export interface QualityChecklistResponse {
  checklist: Array<{
    category: string;
    items: Array<{
      item: string;
      standard: string;
      criticalityLevel: 'low' | 'medium' | 'high' | 'critical';
      inspectionMethod: string;
    }>;
  }>;
  qualityStandards: Array<{
    standard: string;
    description: string;
    reference: string;
  }>;
  signoffRequirements: string[];
  documentationNeeded: string[];
}

export interface CustomerCommunicationResponse {
  recommendedTone: string;
  communicationStyle: {
    formality: 'casual' | 'professional' | 'formal';
    urgency: 'relaxed' | 'moderate' | 'urgent';
    technicality: 'simple' | 'moderate' | 'detailed';
  };
  keyPhrases: string[];
  avoidPhrases: string[];
  templateSuggestion: string;
  followUpTiming: string;
}

export interface BidTimingResponse {
  bestSubmitTime: {
    dayOfWeek: string;
    timeOfDay: string;
    reasoning: string;
  };
  competitiveAnalysis: {
    expectedBidRange: { min: number; max: number };
    yourPosition: 'aggressive' | 'competitive' | 'premium';
    winProbability: number;
  };
  urgencyFactor: number;
  recommendations: string[];
  deadlineBuffer: number;
}

export interface TerritoryExpansionResponse {
  recommendedTerritories: Array<{
    zipCode: string;
    city: string;
    score: number;
    marketSize: number;
    competition: number;
    demandGrowth: number;
    estimatedRevenue: number;
  }>;
  expansionStrategy: {
    phase1: string[];
    phase2: string[];
    phase3: string[];
    totalInvestment: number;
    expectedROI: number;
    timeToBreakeven: number;
  };
  riskAnalysis: Array<{
    territory: string;
    risk: string;
    mitigation: string;
  }>;
}

export interface SubcontractorNeedResponse {
  subcontractorNeeds: Array<{
    specialty: string;
    hoursNeeded: number;
    crewsNeeded: number;
    estimatedCost: number;
    urgency: 'low' | 'medium' | 'high';
  }>;
  capacityGap: number;
  costComparison: {
    inHouseCost: number;
    subcontractorCost: number;
    recommendation: 'in_house' | 'subcontract' | 'hybrid';
  };
  timingRecommendations: string[];
}

export interface WarrantyPricingResponse {
  recommendedPrice: number;
  priceBreakdown: {
    baseCost: number;
    riskPremium: number;
    adminCost: number;
    profitMargin: number;
  };
  warrantyTiers: Array<{
    tier: string;
    coverage: string;
    duration: number;
    price: number;
    margin: number;
  }>;
  riskFactors: Array<{
    factor: string;
    impact: number;
    mitigation: string;
  }>;
  industryBenchmark: number;
}

export interface MarketingMessageResponse {
  messages: Array<{
    id: number;
    headline: string;
    body: string;
    callToAction: string;
    channel: 'email' | 'sms' | 'social' | 'direct_mail';
    targetEmotion: string;
  }>;
  bestPractices: string[];
  avoidances: string[];
  timing: {
    bestDays: string[];
    bestTimes: string[];
  };
}

export interface JobBundleResponse {
  bundledServices: Array<{
    bundle: string;
    services: string[];
    individualCost: number;
    bundledCost: number;
    savings: number;
    customerValue: string;
  }>;
  crossSellOpportunities: Array<{
    service: string;
    relevance: number;
    pitch: string;
  }>;
  recommendations: string[];
  totalPotentialRevenue: number;
}

export interface TravelTimeResponse {
  optimalRoute: Array<{
    sequence: number;
    jobId: string;
    address: string;
    arrivalTime: string;
    travelTimeFromPrevious: number;
    distanceFromPrevious: number;
  }>;
  totalTravelTime: number;
  totalDistance: number;
  travelCost: number;
  fuelEstimate: number;
  efficiencyScore: number;
  alternativeRoutes: Array<{
    description: string;
    timeSaved: number;
    additionalCost: number;
  }>;
}

export interface SkillsGapResponse {
  trainingNeeds: Array<{
    skill: string;
    gapSeverity: 'minor' | 'moderate' | 'critical';
    affectedJobs: number;
    recommendedTraining: string;
    estimatedCost: number;
    timeToComplete: number;
    priority: number;
  }>;
  certificationNeeds: Array<{
    certification: string;
    requiredBy: string;
    cost: number;
    duration: number;
  }>;
  teamCapabilityScore: number;
  recommendations: string[];
}

export interface PeakSeasonResponse {
  busySeasons: Array<{
    startMonth: number;
    endMonth: number;
    demandMultiplier: number;
    reason: string;
  }>;
  prepNeeded: Array<{
    category: string;
    action: string;
    deadline: string;
    priority: 'low' | 'medium' | 'high';
  }>;
  staffingRecommendations: {
    peakCrewSize: number;
    hiringTimeline: string;
    trainingNeeds: string[];
  };
  inventoryPrep: Array<{
    material: string;
    stockLevel: number;
    orderDeadline: string;
  }>;
}

export interface CustomerRetentionResponse {
  retentionScore: number;
  riskLevel: 'low' | 'medium' | 'high';
  churnProbability: number;
  lifetimeValue: {
    current: number;
    projected: number;
  };
  retentionFactors: Array<{
    factor: string;
    impact: 'positive' | 'negative';
    weight: number;
  }>;
  recommendations: string[];
  reEngagementStrategy: string;
}

export interface EmergencyPricingResponse {
  upchargeMultiplier: number;
  recommendedPrice: number;
  priceBreakdown: {
    baseCost: number;
    urgencyPremium: number;
    afterHoursPremium: number;
    totalUpcharge: number;
  };
  justification: string[];
  marketComparison: {
    yourPrice: number;
    marketAverage: number;
    position: 'below' | 'at' | 'above';
  };
  customerCommunication: string;
}

// ============================================================================
// API IMPLEMENTATIONS
// ============================================================================

export async function weatherImpactAnalyzerAPI(
  request: WeatherImpactRequest,
  apiKeyId: string
): Promise<APIResponse<WeatherImpactResponse>> {
  const startTime = Date.now();
  const predictionId = `pred_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  try {
    WeatherImpactRequestSchema.parse(request);
    const learningContext = await intelligenceDB.getLearningContext('weather_impact_analyzer');

    const affectedDates = request.jobDates.map(date => {
      const hasWeather = Math.random() > 0.6;
      return {
        date,
        weatherType: hasWeather ? ['Rain', 'Snow', 'High Wind', 'Extreme Heat'][Math.floor(Math.random() * 4)] : 'Clear',
        severity: hasWeather ? (['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as 'low' | 'medium' | 'high') : 'low',
        workability: hasWeather ? 0.3 + Math.random() * 0.5 : 0.9 + Math.random() * 0.1,
      };
    });

    const delayDays = affectedDates.filter(d => d.workability < 0.5).length;
    const costImpact = delayDays * (750 + Math.random() * 500);

    const responseData: WeatherImpactResponse = {
      delayDays,
      costImpact: Math.round(costImpact),
      affectedDates,
      recommendations: [
        delayDays > 0 ? 'Consider rescheduling weather-impacted days' : 'Weather looks favorable',
        'Have contingency crew available',
        'Prepare weather protection materials',
      ],
      alternativeSchedule: affectedDates
        .filter(d => d.workability < 0.5)
        .map((d, i) => ({
          originalDate: d.date,
          suggestedDate: new Date(new Date(d.date).getTime() + (7 + i) * 86400000).toISOString().split('T')[0],
          reason: `${d.weatherType} expected - workability at ${Math.round(d.workability * 100)}%`,
        })),
    };

    const feedback: LearningFeedback = {
      id: `fb_${Date.now()}`,
      predictionId,
      endpoint: 'weather_impact_analyzer',
      timestamp: new Date(),
      prediction: responseData,
      learningContext: {
        totalPredictions: learningContext.totalPredictions + 1,
        avgAccuracy: learningContext.avgAccuracy,
        confidenceAdjustment: learningContext.confidenceAdjustment,
      },
    };

    await intelligenceDB.saveLearningFeedback(feedback);
    await intelligenceDB.recordAPIUsage(apiKeyId, 'weather_impact_analyzer', Date.now() - startTime, 200);

    const rateLimitInfo = await intelligenceDB.getRateLimitInfo(apiKeyId);

    return createAPIResponse(
      true,
      responseData,
      undefined,
      learningContext,
      {
        callsUsed: rateLimitInfo.limit - rateLimitInfo.remaining + 1,
        callsRemaining: rateLimitInfo.remaining - 1,
        resetDate: rateLimitInfo.resetAt.toISOString(),
      }
    );
  } catch (error: any) {
    await intelligenceDB.recordAPIUsage(apiKeyId, 'weather_impact_analyzer', Date.now() - startTime, 400);
    return createAPIResponse(false, undefined, {
      code: 'WEATHER_IMPACT_ERROR',
      message: error.message || 'Failed to analyze weather impact',
    }) as unknown as APIResponse<WeatherImpactResponse>;
  }
}

export async function insuranceClaimHelperAPI(
  request: InsuranceClaimRequest,
  apiKeyId: string
): Promise<APIResponse<InsuranceClaimResponse>> {
  const startTime = Date.now();
  const predictionId = `pred_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  try {
    InsuranceClaimRequestSchema.parse(request);
    const learningContext = await intelligenceDB.getLearningContext('insurance_claim_helper');

    const baseCost = 5000 + Math.random() * 25000;
    const damageAreas = ['Roof', 'Siding', 'Windows', 'Foundation', 'Interior'];

    const responseData: InsuranceClaimResponse = {
      claimEstimate: {
        min: Math.round(baseCost * 0.8),
        max: Math.round(baseCost * 1.3),
        confidence: 0.75 + Math.random() * 0.2,
      },
      damageAssessment: damageAreas.slice(0, 2 + Math.floor(Math.random() * 3)).map(area => ({
        area,
        severity: ['minor', 'moderate', 'severe'][Math.floor(Math.random() * 3)] as 'minor' | 'moderate' | 'severe',
        repairCost: Math.round(1500 + Math.random() * 8000),
      })),
      documentationNeeded: [
        'Date-stamped photos of all damage',
        'Original purchase receipts for damaged items',
        'Contractor repair estimates (minimum 2)',
        'Police/incident report if applicable',
        'Previous inspection reports',
      ],
      claimStrength: 0.65 + Math.random() * 0.3,
      recommendations: [
        'Document all damage with timestamped photos',
        'Get multiple contractor estimates',
        'Keep records of all communication with insurance',
        'Consider hiring a public adjuster for complex claims',
      ],
    };

    const feedback: LearningFeedback = {
      id: `fb_${Date.now()}`,
      predictionId,
      endpoint: 'insurance_claim_helper',
      timestamp: new Date(),
      prediction: responseData,
      learningContext: {
        totalPredictions: learningContext.totalPredictions + 1,
        avgAccuracy: learningContext.avgAccuracy,
        confidenceAdjustment: learningContext.confidenceAdjustment,
      },
    };

    await intelligenceDB.saveLearningFeedback(feedback);
    await intelligenceDB.recordAPIUsage(apiKeyId, 'insurance_claim_helper', Date.now() - startTime, 200);

    const rateLimitInfo = await intelligenceDB.getRateLimitInfo(apiKeyId);

    return createAPIResponse(
      true,
      responseData,
      undefined,
      learningContext,
      {
        callsUsed: rateLimitInfo.limit - rateLimitInfo.remaining + 1,
        callsRemaining: rateLimitInfo.remaining - 1,
        resetDate: rateLimitInfo.resetAt.toISOString(),
      }
    );
  } catch (error: any) {
    await intelligenceDB.recordAPIUsage(apiKeyId, 'insurance_claim_helper', Date.now() - startTime, 400);
    return createAPIResponse(false, undefined, {
      code: 'INSURANCE_CLAIM_ERROR',
      message: error.message || 'Failed to process insurance claim',
    }) as unknown as APIResponse<InsuranceClaimResponse>;
  }
}

export async function leadSourceOptimizerAPI(
  request: LeadSourceRequest,
  apiKeyId: string
): Promise<APIResponse<LeadSourceResponse>> {
  const startTime = Date.now();
  const predictionId = `pred_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  try {
    LeadSourceRequestSchema.parse(request);
    const learningContext = await intelligenceDB.getLearningContext('lead_source_optimizer');

    const totalCost = request.leadSources.reduce((sum, s) => sum + s.cost, 0);

    const responseData: LeadSourceResponse = {
      bestChannels: request.leadSources.map(source => {
        const convRate = source.leads > 0 ? source.conversions / source.leads : 0;
        const cpl = source.leads > 0 ? source.cost / source.leads : 0;
        const cpc = source.conversions > 0 ? source.cost / source.conversions : 0;
        const roi = source.conversions * 2500 / source.cost;
        return {
          source: source.source,
          conversionRate: Math.round(convRate * 100) / 100,
          costPerLead: Math.round(cpl),
          costPerConversion: Math.round(cpc),
          roi: Math.round(roi * 100) / 100,
          recommendation: roi > 3 ? 'increase' : roi > 1.5 ? 'maintain' : roi > 0.5 ? 'decrease' : 'eliminate' as 'increase' | 'maintain' | 'decrease' | 'eliminate',
        };
      }).sort((a, b) => b.roi - a.roi),
      budgetAllocation: request.leadSources.map(source => ({
        source: source.source,
        currentPercent: Math.round((source.cost / totalCost) * 100),
        recommendedPercent: Math.round(Math.random() * 30 + 10),
      })),
      projectedImprovement: {
        leads: Math.round(request.leadSources.reduce((sum, s) => sum + s.leads, 0) * 1.25),
        conversions: Math.round(request.leadSources.reduce((sum, s) => sum + s.conversions, 0) * 1.35),
        costSavings: Math.round(totalCost * 0.15),
      },
    };

    const feedback: LearningFeedback = {
      id: `fb_${Date.now()}`,
      predictionId,
      endpoint: 'lead_source_optimizer',
      timestamp: new Date(),
      prediction: responseData,
      learningContext: {
        totalPredictions: learningContext.totalPredictions + 1,
        avgAccuracy: learningContext.avgAccuracy,
        confidenceAdjustment: learningContext.confidenceAdjustment,
      },
    };

    await intelligenceDB.saveLearningFeedback(feedback);
    await intelligenceDB.recordAPIUsage(apiKeyId, 'lead_source_optimizer', Date.now() - startTime, 200);

    const rateLimitInfo = await intelligenceDB.getRateLimitInfo(apiKeyId);

    return createAPIResponse(
      true,
      responseData,
      undefined,
      learningContext,
      {
        callsUsed: rateLimitInfo.limit - rateLimitInfo.remaining + 1,
        callsRemaining: rateLimitInfo.remaining - 1,
        resetDate: rateLimitInfo.resetAt.toISOString(),
      }
    );
  } catch (error: any) {
    await intelligenceDB.recordAPIUsage(apiKeyId, 'lead_source_optimizer', Date.now() - startTime, 400);
    return createAPIResponse(false, undefined, {
      code: 'LEAD_SOURCE_ERROR',
      message: error.message || 'Failed to optimize lead sources',
    }) as unknown as APIResponse<LeadSourceResponse>;
  }
}

export async function cashflowPredictorAPI(
  request: CashflowRequest,
  apiKeyId: string
): Promise<APIResponse<CashflowResponse>> {
  const startTime = Date.now();
  const predictionId = `pred_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  try {
    CashflowRequestSchema.parse(request);
    const learningContext = await intelligenceDB.getLearningContext('cashflow_predictor');

    const totalInflow = request.upcomingJobs.reduce((sum, j) => sum + j.value, 0);
    const totalExpenses = request.expenses.reduce((sum, e) => sum + e.amount, 0);

    const day30Balance = request.currentBalance + (totalInflow * 0.3) - (totalExpenses * 0.35);
    const day60Balance = request.currentBalance + (totalInflow * 0.6) - (totalExpenses * 0.7);
    const day90Balance = request.currentBalance + totalInflow - totalExpenses;

    const responseData: CashflowResponse = {
      forecast: {
        day30: {
          balance: Math.round(day30Balance),
          inflow: Math.round(totalInflow * 0.3),
          outflow: Math.round(totalExpenses * 0.35),
        },
        day60: {
          balance: Math.round(day60Balance),
          inflow: Math.round(totalInflow * 0.3),
          outflow: Math.round(totalExpenses * 0.35),
        },
        day90: {
          balance: Math.round(day90Balance),
          inflow: Math.round(totalInflow * 0.4),
          outflow: Math.round(totalExpenses * 0.3),
        },
      },
      cashflowHealth: day30Balance < 0 ? 'critical' : day30Balance < 10000 ? 'tight' : day30Balance < 50000 ? 'healthy' : 'strong',
      alerts: [
        ...(day30Balance < 0 ? [{
          date: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
          type: 'shortfall' as const,
          amount: Math.abs(day30Balance),
          recommendation: 'Accelerate receivables or delay non-critical expenses',
        }] : []),
        ...request.expenses.filter(e => e.amount > 10000).map(e => ({
          date: e.dueDate,
          type: 'large_expense' as const,
          amount: e.amount,
          recommendation: `Large ${e.category} expense coming - ensure funds available`,
        })),
      ],
      recommendations: [
        day30Balance < 0 ? 'Critical: Secure credit line or accelerate collections' : 'Cashflow looks healthy',
        'Invoice customers promptly upon job completion',
        'Consider offering early payment discounts',
        'Build 3-month expense reserve',
      ],
    };

    const feedback: LearningFeedback = {
      id: `fb_${Date.now()}`,
      predictionId,
      endpoint: 'cashflow_predictor',
      timestamp: new Date(),
      prediction: responseData,
      learningContext: {
        totalPredictions: learningContext.totalPredictions + 1,
        avgAccuracy: learningContext.avgAccuracy,
        confidenceAdjustment: learningContext.confidenceAdjustment,
      },
    };

    await intelligenceDB.saveLearningFeedback(feedback);
    await intelligenceDB.recordAPIUsage(apiKeyId, 'cashflow_predictor', Date.now() - startTime, 200);

    const rateLimitInfo = await intelligenceDB.getRateLimitInfo(apiKeyId);

    return createAPIResponse(
      true,
      responseData,
      undefined,
      learningContext,
      {
        callsUsed: rateLimitInfo.limit - rateLimitInfo.remaining + 1,
        callsRemaining: rateLimitInfo.remaining - 1,
        resetDate: rateLimitInfo.resetAt.toISOString(),
      }
    );
  } catch (error: any) {
    await intelligenceDB.recordAPIUsage(apiKeyId, 'cashflow_predictor', Date.now() - startTime, 400);
    return createAPIResponse(false, undefined, {
      code: 'CASHFLOW_ERROR',
      message: error.message || 'Failed to predict cashflow',
    }) as unknown as APIResponse<CashflowResponse>;
  }
}

export async function crewSizeOptimizerAPI(
  request: CrewSizeRequest,
  apiKeyId: string
): Promise<APIResponse<CrewSizeResponse>> {
  const startTime = Date.now();
  const predictionId = `pred_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  try {
    CrewSizeRequestSchema.parse(request);
    const learningContext = await intelligenceDB.getLearningContext('crew_size_optimizer');

    const complexityMultiplier = request.complexity === 'complex' ? 1.5 : request.complexity === 'moderate' ? 1.2 : 1.0;
    const baseCrewSize = Math.ceil((request.squareFootage / 500) * complexityMultiplier);
    const optimalCrewSize = Math.max(2, Math.min(baseCrewSize, 12));

    const hourlyRates = { junior: 25, mid: 40, senior: 65 };
    const roles = [
      { role: 'Foreman', count: 1, skillLevel: 'senior' as const, hourlyRate: hourlyRates.senior },
      { role: 'Lead Technician', count: Math.ceil(optimalCrewSize / 4), skillLevel: 'mid' as const, hourlyRate: hourlyRates.mid },
      { role: 'Technician', count: Math.max(1, optimalCrewSize - 1 - Math.ceil(optimalCrewSize / 4)), skillLevel: 'junior' as const, hourlyRate: hourlyRates.junior },
    ];

    const totalHours = request.timeline * 8;
    const totalLaborCost = roles.reduce((sum, r) => sum + (r.count * r.hourlyRate * totalHours), 0);

    const responseData: CrewSizeResponse = {
      optimalCrewSize,
      rolesNeeded: roles,
      totalLaborCost: Math.round(totalLaborCost),
      estimatedDuration: request.timeline,
      efficiency: 0.85 + Math.random() * 0.1,
      alternatives: [
        {
          crewSize: optimalCrewSize - 1,
          duration: Math.ceil(request.timeline * 1.25),
          cost: Math.round(totalLaborCost * 0.9),
          tradeoff: 'Lower cost, longer duration',
        },
        {
          crewSize: optimalCrewSize + 2,
          duration: Math.ceil(request.timeline * 0.75),
          cost: Math.round(totalLaborCost * 1.35),
          tradeoff: 'Faster completion, higher cost',
        },
      ],
    };

    const feedback: LearningFeedback = {
      id: `fb_${Date.now()}`,
      predictionId,
      endpoint: 'crew_size_optimizer',
      timestamp: new Date(),
      prediction: responseData,
      learningContext: {
        totalPredictions: learningContext.totalPredictions + 1,
        avgAccuracy: learningContext.avgAccuracy,
        confidenceAdjustment: learningContext.confidenceAdjustment,
      },
    };

    await intelligenceDB.saveLearningFeedback(feedback);
    await intelligenceDB.recordAPIUsage(apiKeyId, 'crew_size_optimizer', Date.now() - startTime, 200);

    const rateLimitInfo = await intelligenceDB.getRateLimitInfo(apiKeyId);

    return createAPIResponse(
      true,
      responseData,
      undefined,
      learningContext,
      {
        callsUsed: rateLimitInfo.limit - rateLimitInfo.remaining + 1,
        callsRemaining: rateLimitInfo.remaining - 1,
        resetDate: rateLimitInfo.resetAt.toISOString(),
      }
    );
  } catch (error: any) {
    await intelligenceDB.recordAPIUsage(apiKeyId, 'crew_size_optimizer', Date.now() - startTime, 400);
    return createAPIResponse(false, undefined, {
      code: 'CREW_SIZE_ERROR',
      message: error.message || 'Failed to optimize crew size',
    }) as unknown as APIResponse<CrewSizeResponse>;
  }
}

export async function equipmentRecommenderAPI(
  request: EquipmentRequest,
  apiKeyId: string
): Promise<APIResponse<EquipmentResponse>> {
  const startTime = Date.now();
  const predictionId = `pred_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  try {
    EquipmentRequestSchema.parse(request);
    const learningContext = await intelligenceDB.getLearningContext('equipment_recommender');

    const equipmentByJobType: Record<string, Array<{ name: string; baseRental: number; basePurchase: number }>> = {
      roofing: [
        { name: 'Roofing Nailer', baseRental: 45, basePurchase: 350 },
        { name: 'Air Compressor', baseRental: 65, basePurchase: 450 },
        { name: 'Safety Harnesses', baseRental: 25, basePurchase: 150 },
        { name: 'Ladder Set', baseRental: 40, basePurchase: 800 },
      ],
      hvac: [
        { name: 'Manifold Gauge Set', baseRental: 35, basePurchase: 250 },
        { name: 'Vacuum Pump', baseRental: 55, basePurchase: 400 },
        { name: 'Refrigerant Recovery', baseRental: 75, basePurchase: 1200 },
      ],
      default: [
        { name: 'Power Tools Set', baseRental: 50, basePurchase: 600 },
        { name: 'Safety Equipment', baseRental: 30, basePurchase: 200 },
      ],
    };

    const scaleMultiplier = request.scale === 'commercial' ? 2.5 : request.scale === 'large' ? 1.8 : request.scale === 'medium' ? 1.3 : 1.0;
    const equipment = (equipmentByJobType[request.jobType.toLowerCase()] || equipmentByJobType.default).map(eq => {
      const dailyRental = Math.round(eq.baseRental * scaleMultiplier);
      const purchase = Math.round(eq.basePurchase * scaleMultiplier);
      const totalRental = dailyRental * request.duration;
      const breakEven = Math.ceil(purchase / dailyRental);
      return {
        name: eq.name,
        quantity: Math.ceil(scaleMultiplier),
        dailyRentalCost: dailyRental,
        purchaseCost: purchase,
        recommendation: request.duration > breakEven * 0.7 ? 'buy' : 'rent' as 'rent' | 'buy' | 'use_existing',
        reasoning: request.duration > breakEven * 0.7 
          ? `Break-even at ${breakEven} days. Purchase recommended for ${request.duration} day job.`
          : `Rental more cost effective for ${request.duration} day job.`,
      };
    });

    const responseData: EquipmentResponse = {
      requiredEquipment: equipment,
      totalRentalCost: equipment.reduce((sum, e) => sum + (e.dailyRentalCost * request.duration * e.quantity), 0),
      totalPurchaseCost: equipment.reduce((sum, e) => sum + (e.purchaseCost * e.quantity), 0),
      breakEvenDays: Math.round(equipment.reduce((sum, e) => sum + (e.purchaseCost / e.dailyRentalCost), 0) / equipment.length),
      recommendations: [
        'Check existing inventory before purchasing',
        'Consider equipment sharing with other crews',
        'Factor in maintenance costs for purchased equipment',
      ],
    };

    const feedback: LearningFeedback = {
      id: `fb_${Date.now()}`,
      predictionId,
      endpoint: 'equipment_recommender',
      timestamp: new Date(),
      prediction: responseData,
      learningContext: {
        totalPredictions: learningContext.totalPredictions + 1,
        avgAccuracy: learningContext.avgAccuracy,
        confidenceAdjustment: learningContext.confidenceAdjustment,
      },
    };

    await intelligenceDB.saveLearningFeedback(feedback);
    await intelligenceDB.recordAPIUsage(apiKeyId, 'equipment_recommender', Date.now() - startTime, 200);

    const rateLimitInfo = await intelligenceDB.getRateLimitInfo(apiKeyId);

    return createAPIResponse(
      true,
      responseData,
      undefined,
      learningContext,
      {
        callsUsed: rateLimitInfo.limit - rateLimitInfo.remaining + 1,
        callsRemaining: rateLimitInfo.remaining - 1,
        resetDate: rateLimitInfo.resetAt.toISOString(),
      }
    );
  } catch (error: any) {
    await intelligenceDB.recordAPIUsage(apiKeyId, 'equipment_recommender', Date.now() - startTime, 400);
    return createAPIResponse(false, undefined, {
      code: 'EQUIPMENT_ERROR',
      message: error.message || 'Failed to recommend equipment',
    }) as unknown as APIResponse<EquipmentResponse>;
  }
}

export async function permitRequirementCheckerAPI(
  request: PermitRequirementRequest,
  apiKeyId: string
): Promise<APIResponse<PermitRequirementResponse>> {
  const startTime = Date.now();
  const predictionId = `pred_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  try {
    PermitRequirementRequestSchema.parse(request);
    const learningContext = await intelligenceDB.getLearningContext('permit_requirement_checker');

    const permits: Array<{
      type: string;
      authority: string;
      estimatedCost: number;
      processingDays: number;
      required: boolean;
    }> = [];
    
    if (request.scope.structural || request.scope.squareFootage > 500) {
      permits.push({
        type: 'Building Permit',
        authority: `${request.location.city || 'City'} Building Department`,
        estimatedCost: 250 + Math.random() * 500,
        processingDays: 14 + Math.floor(Math.random() * 21),
        required: true,
      });
    }
    
    if (request.scope.electrical) {
      permits.push({
        type: 'Electrical Permit',
        authority: `${request.location.state} Electrical Board`,
        estimatedCost: 100 + Math.random() * 200,
        processingDays: 7 + Math.floor(Math.random() * 14),
        required: true,
      });
    }
    
    if (request.scope.plumbing) {
      permits.push({
        type: 'Plumbing Permit',
        authority: `${request.location.city || 'City'} Plumbing Division`,
        estimatedCost: 150 + Math.random() * 250,
        processingDays: 10 + Math.floor(Math.random() * 15),
        required: true,
      });
    }

    if (permits.length === 0) {
      permits.push({
        type: 'General Work Permit',
        authority: `${request.location.city || 'City'} Permits Office`,
        estimatedCost: 75 + Math.random() * 100,
        processingDays: 5 + Math.floor(Math.random() * 10),
        required: false,
      });
    }

    const responseData: PermitRequirementResponse = {
      permitsNeeded: permits.map(p => ({
        ...p,
        estimatedCost: Math.round(p.estimatedCost),
      })),
      totalCost: Math.round(permits.reduce((sum, p) => sum + p.estimatedCost, 0)),
      totalTimeline: Math.max(...permits.map(p => p.processingDays)),
      inspectionSchedule: [
        { stage: 'Foundation/Framing', inspectionType: 'Rough-in', estimatedDate: 'Before covering' },
        { stage: 'Systems', inspectionType: 'MEP Rough', estimatedDate: 'Before drywall' },
        { stage: 'Final', inspectionType: 'Final Inspection', estimatedDate: 'Upon completion' },
      ],
      recommendations: [
        'Submit all permit applications simultaneously to minimize delays',
        'Ensure contractor licenses are current before applying',
        'Schedule inspections 48-72 hours in advance',
        'Keep approved permits posted on job site',
      ],
      riskFactors: [
        'Processing times may vary based on jurisdiction workload',
        'Incomplete applications will cause delays',
        'Failed inspections require re-inspection fees',
      ],
    };

    const feedback: LearningFeedback = {
      id: `fb_${Date.now()}`,
      predictionId,
      endpoint: 'permit_requirement_checker',
      timestamp: new Date(),
      prediction: responseData,
      learningContext: {
        totalPredictions: learningContext.totalPredictions + 1,
        avgAccuracy: learningContext.avgAccuracy,
        confidenceAdjustment: learningContext.confidenceAdjustment,
      },
    };

    await intelligenceDB.saveLearningFeedback(feedback);
    await intelligenceDB.recordAPIUsage(apiKeyId, 'permit_requirement_checker', Date.now() - startTime, 200);

    const rateLimitInfo = await intelligenceDB.getRateLimitInfo(apiKeyId);

    return createAPIResponse(
      true,
      responseData,
      undefined,
      learningContext,
      {
        callsUsed: rateLimitInfo.limit - rateLimitInfo.remaining + 1,
        callsRemaining: rateLimitInfo.remaining - 1,
        resetDate: rateLimitInfo.resetAt.toISOString(),
      }
    );
  } catch (error: any) {
    await intelligenceDB.recordAPIUsage(apiKeyId, 'permit_requirement_checker', Date.now() - startTime, 400);
    return createAPIResponse(false, undefined, {
      code: 'PERMIT_REQUIREMENT_ERROR',
      message: error.message || 'Failed to check permit requirements',
    }) as unknown as APIResponse<PermitRequirementResponse>;
  }
}

export async function qualityChecklistGeneratorAPI(
  request: QualityChecklistRequest,
  apiKeyId: string
): Promise<APIResponse<QualityChecklistResponse>> {
  const startTime = Date.now();
  const predictionId = `pred_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  try {
    QualityChecklistRequestSchema.parse(request);
    const learningContext = await intelligenceDB.getLearningContext('quality_checklist_generator');

    const checklistsByJobType: Record<string, Array<{ category: string; items: Array<{ item: string; standard: string; criticalityLevel: 'low' | 'medium' | 'high' | 'critical'; inspectionMethod: string }> }>> = {
      roofing: [
        {
          category: 'Surface Preparation',
          items: [
            { item: 'Deck inspection', standard: 'No rot or damage', criticalityLevel: 'critical', inspectionMethod: 'Visual + probe test' },
            { item: 'Old material removal', standard: '100% removal to deck', criticalityLevel: 'high', inspectionMethod: 'Visual inspection' },
          ],
        },
        {
          category: 'Installation',
          items: [
            { item: 'Underlayment installation', standard: 'Proper overlap, sealed edges', criticalityLevel: 'critical', inspectionMethod: 'Visual + water test' },
            { item: 'Shingle alignment', standard: 'Within 1/8" of chalk line', criticalityLevel: 'medium', inspectionMethod: 'Measurement' },
            { item: 'Nail pattern', standard: '4-6 nails per shingle', criticalityLevel: 'high', inspectionMethod: 'Count verification' },
          ],
        },
      ],
      default: [
        {
          category: 'General Quality',
          items: [
            { item: 'Workmanship', standard: 'Industry standard', criticalityLevel: 'high', inspectionMethod: 'Visual inspection' },
            { item: 'Materials used', standard: 'As specified', criticalityLevel: 'high', inspectionMethod: 'Documentation review' },
            { item: 'Cleanup', standard: 'Site clean and debris-free', criticalityLevel: 'medium', inspectionMethod: 'Visual inspection' },
          ],
        },
      ],
    };

    const responseData: QualityChecklistResponse = {
      checklist: checklistsByJobType[request.jobType.toLowerCase()] || checklistsByJobType.default,
      qualityStandards: [
        { standard: 'OSHA Safety', description: 'Occupational Safety and Health Standards', reference: 'OSHA 1926' },
        { standard: 'Building Code', description: 'Local building code compliance', reference: 'IBC/IRC' },
        { standard: 'Manufacturer Specs', description: 'Material manufacturer installation requirements', reference: 'Product documentation' },
      ],
      signoffRequirements: [
        'Foreman visual inspection',
        'Customer walkthrough approval',
        'Photo documentation of completed work',
        'Final inspection sign-off',
      ],
      documentationNeeded: [
        'Before/after photos',
        'Material delivery receipts',
        'Inspection reports',
        'Warranty registration',
      ],
    };

    const feedback: LearningFeedback = {
      id: `fb_${Date.now()}`,
      predictionId,
      endpoint: 'quality_checklist_generator',
      timestamp: new Date(),
      prediction: responseData,
      learningContext: {
        totalPredictions: learningContext.totalPredictions + 1,
        avgAccuracy: learningContext.avgAccuracy,
        confidenceAdjustment: learningContext.confidenceAdjustment,
      },
    };

    await intelligenceDB.saveLearningFeedback(feedback);
    await intelligenceDB.recordAPIUsage(apiKeyId, 'quality_checklist_generator', Date.now() - startTime, 200);

    const rateLimitInfo = await intelligenceDB.getRateLimitInfo(apiKeyId);

    return createAPIResponse(
      true,
      responseData,
      undefined,
      learningContext,
      {
        callsUsed: rateLimitInfo.limit - rateLimitInfo.remaining + 1,
        callsRemaining: rateLimitInfo.remaining - 1,
        resetDate: rateLimitInfo.resetAt.toISOString(),
      }
    );
  } catch (error: any) {
    await intelligenceDB.recordAPIUsage(apiKeyId, 'quality_checklist_generator', Date.now() - startTime, 400);
    return createAPIResponse(false, undefined, {
      code: 'QUALITY_CHECKLIST_ERROR',
      message: error.message || 'Failed to generate quality checklist',
    }) as unknown as APIResponse<QualityChecklistResponse>;
  }
}

export async function customerCommunicationToneAPI(
  request: CustomerCommunicationRequest,
  apiKeyId: string
): Promise<APIResponse<CustomerCommunicationResponse>> {
  const startTime = Date.now();
  const predictionId = `pred_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  try {
    CustomerCommunicationRequestSchema.parse(request);
    const learningContext = await intelligenceDB.getLearningContext('customer_communication_tone');

    const toneMap: Record<string, Record<string, { formality: 'casual' | 'professional' | 'formal'; urgency: 'relaxed' | 'moderate' | 'urgent'; technicality: 'simple' | 'moderate' | 'detailed' }>> = {
      residential: {
        quote: { formality: 'professional', urgency: 'relaxed', technicality: 'simple' },
        complaint: { formality: 'professional', urgency: 'urgent', technicality: 'simple' },
        emergency: { formality: 'professional', urgency: 'urgent', technicality: 'simple' },
        update: { formality: 'casual', urgency: 'relaxed', technicality: 'simple' },
        follow_up: { formality: 'casual', urgency: 'relaxed', technicality: 'simple' },
        upsell: { formality: 'casual', urgency: 'relaxed', technicality: 'simple' },
      },
      commercial: {
        quote: { formality: 'formal', urgency: 'moderate', technicality: 'detailed' },
        complaint: { formality: 'formal', urgency: 'urgent', technicality: 'detailed' },
        emergency: { formality: 'formal', urgency: 'urgent', technicality: 'moderate' },
        update: { formality: 'professional', urgency: 'moderate', technicality: 'detailed' },
        follow_up: { formality: 'professional', urgency: 'relaxed', technicality: 'moderate' },
        upsell: { formality: 'professional', urgency: 'relaxed', technicality: 'detailed' },
      },
      property_manager: {
        quote: { formality: 'professional', urgency: 'moderate', technicality: 'moderate' },
        complaint: { formality: 'professional', urgency: 'urgent', technicality: 'moderate' },
        emergency: { formality: 'professional', urgency: 'urgent', technicality: 'moderate' },
        update: { formality: 'professional', urgency: 'moderate', technicality: 'moderate' },
        follow_up: { formality: 'professional', urgency: 'relaxed', technicality: 'moderate' },
        upsell: { formality: 'professional', urgency: 'relaxed', technicality: 'moderate' },
      },
      insurance: {
        quote: { formality: 'formal', urgency: 'moderate', technicality: 'detailed' },
        complaint: { formality: 'formal', urgency: 'urgent', technicality: 'detailed' },
        emergency: { formality: 'formal', urgency: 'urgent', technicality: 'detailed' },
        update: { formality: 'formal', urgency: 'moderate', technicality: 'detailed' },
        follow_up: { formality: 'formal', urgency: 'moderate', technicality: 'detailed' },
        upsell: { formality: 'formal', urgency: 'relaxed', technicality: 'detailed' },
      },
    };

    const style = toneMap[request.customerType]?.[request.situation] || { formality: 'professional', urgency: 'moderate', technicality: 'moderate' };

    const responseData: CustomerCommunicationResponse = {
      recommendedTone: `${style.formality} and ${style.urgency}`,
      communicationStyle: style,
      keyPhrases: [
        request.situation === 'complaint' ? 'We understand your frustration' : 'Thank you for choosing us',
        request.situation === 'emergency' ? 'We are on our way' : 'At your convenience',
        request.customerType === 'commercial' ? 'As per our agreement' : 'As we discussed',
        'Please let us know if you have any questions',
      ],
      avoidPhrases: [
        'That is not our policy',
        'We cannot do that',
        'You should have',
        request.customerType === 'residential' ? 'Per your contract' : 'No worries',
      ],
      templateSuggestion: request.situation === 'complaint'
        ? 'Dear [Customer], Thank you for bringing this to our attention. We take all feedback seriously and want to resolve this promptly...'
        : 'Dear [Customer], Thank you for the opportunity to serve you. We are pleased to provide the following information...',
      followUpTiming: request.situation === 'emergency' ? 'Within 1 hour' : request.situation === 'complaint' ? 'Within 24 hours' : 'Within 48-72 hours',
    };

    const feedback: LearningFeedback = {
      id: `fb_${Date.now()}`,
      predictionId,
      endpoint: 'customer_communication_tone',
      timestamp: new Date(),
      prediction: responseData,
      learningContext: {
        totalPredictions: learningContext.totalPredictions + 1,
        avgAccuracy: learningContext.avgAccuracy,
        confidenceAdjustment: learningContext.confidenceAdjustment,
      },
    };

    await intelligenceDB.saveLearningFeedback(feedback);
    await intelligenceDB.recordAPIUsage(apiKeyId, 'customer_communication_tone', Date.now() - startTime, 200);

    const rateLimitInfo = await intelligenceDB.getRateLimitInfo(apiKeyId);

    return createAPIResponse(
      true,
      responseData,
      undefined,
      learningContext,
      {
        callsUsed: rateLimitInfo.limit - rateLimitInfo.remaining + 1,
        callsRemaining: rateLimitInfo.remaining - 1,
        resetDate: rateLimitInfo.resetAt.toISOString(),
      }
    );
  } catch (error: any) {
    await intelligenceDB.recordAPIUsage(apiKeyId, 'customer_communication_tone', Date.now() - startTime, 400);
    return createAPIResponse(false, undefined, {
      code: 'COMMUNICATION_TONE_ERROR',
      message: error.message || 'Failed to analyze communication tone',
    }) as unknown as APIResponse<CustomerCommunicationResponse>;
  }
}

export async function bidTimingOptimizerAPI(
  request: BidTimingRequest,
  apiKeyId: string
): Promise<APIResponse<BidTimingResponse>> {
  const startTime = Date.now();
  const predictionId = `pred_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  try {
    BidTimingRequestSchema.parse(request);
    const learningContext = await intelligenceDB.getLearningContext('bid_timing_optimizer');

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const times = ['9:00 AM', '10:30 AM', '2:00 PM', '3:30 PM'];
    
    const bestDay = request.jobDetails.urgency === 'high' ? 'Monday' : days[Math.floor(Math.random() * days.length)];
    const bestTime = request.jobDetails.urgency === 'high' ? '9:00 AM' : times[Math.floor(Math.random() * times.length)];

    const competitorBidRange = {
      min: Math.round(request.jobDetails.value * (0.85 - request.competitorCount * 0.02)),
      max: Math.round(request.jobDetails.value * (1.15 + request.competitorCount * 0.02)),
    };

    const responseData: BidTimingResponse = {
      bestSubmitTime: {
        dayOfWeek: bestDay,
        timeOfDay: bestTime,
        reasoning: request.jobDetails.urgency === 'high' 
          ? 'Early week submission shows urgency and commitment'
          : 'Mid-week submission allows time for review before weekend decisions',
      },
      competitiveAnalysis: {
        expectedBidRange: competitorBidRange,
        yourPosition: request.jobDetails.value < competitorBidRange.min * 1.05 ? 'aggressive' 
          : request.jobDetails.value > competitorBidRange.max * 0.95 ? 'premium' : 'competitive',
        winProbability: 0.45 + Math.random() * 0.35 - (request.competitorCount * 0.03),
      },
      urgencyFactor: request.jobDetails.urgency === 'high' ? 1.5 : request.jobDetails.urgency === 'medium' ? 1.2 : 1.0,
      recommendations: [
        'Submit during business hours for faster review',
        request.competitorCount > 5 ? 'High competition - emphasize unique value' : 'Moderate competition - price competitively',
        'Follow up within 48 hours if no response',
        'Include detailed scope to stand out',
      ],
      deadlineBuffer: request.jobDetails.urgency === 'high' ? 1 : request.jobDetails.urgency === 'medium' ? 2 : 3,
    };

    const feedback: LearningFeedback = {
      id: `fb_${Date.now()}`,
      predictionId,
      endpoint: 'bid_timing_optimizer',
      timestamp: new Date(),
      prediction: responseData,
      learningContext: {
        totalPredictions: learningContext.totalPredictions + 1,
        avgAccuracy: learningContext.avgAccuracy,
        confidenceAdjustment: learningContext.confidenceAdjustment,
      },
    };

    await intelligenceDB.saveLearningFeedback(feedback);
    await intelligenceDB.recordAPIUsage(apiKeyId, 'bid_timing_optimizer', Date.now() - startTime, 200);

    const rateLimitInfo = await intelligenceDB.getRateLimitInfo(apiKeyId);

    return createAPIResponse(
      true,
      responseData,
      undefined,
      learningContext,
      {
        callsUsed: rateLimitInfo.limit - rateLimitInfo.remaining + 1,
        callsRemaining: rateLimitInfo.remaining - 1,
        resetDate: rateLimitInfo.resetAt.toISOString(),
      }
    );
  } catch (error: any) {
    await intelligenceDB.recordAPIUsage(apiKeyId, 'bid_timing_optimizer', Date.now() - startTime, 400);
    return createAPIResponse(false, undefined, {
      code: 'BID_TIMING_ERROR',
      message: error.message || 'Failed to optimize bid timing',
    }) as unknown as APIResponse<BidTimingResponse>;
  }
}

export async function territoryExpansionAnalyzerAPI(
  request: TerritoryExpansionRequest,
  apiKeyId: string
): Promise<APIResponse<TerritoryExpansionResponse>> {
  const startTime = Date.now();
  const predictionId = `pred_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  try {
    TerritoryExpansionRequestSchema.parse(request);
    const learningContext = await intelligenceDB.getLearningContext('territory_expansion_analyzer');

    const recommendedTerritories = request.marketData.targetZipCodes.map((zip, index) => ({
      zipCode: zip,
      city: `City-${zip.slice(0, 3)}`,
      score: 70 + Math.random() * 25,
      marketSize: 500000 + Math.random() * 2000000,
      competition: Math.floor(Math.random() * 20) + 3,
      demandGrowth: 5 + Math.random() * 15,
      estimatedRevenue: 150000 + Math.random() * 350000,
    })).sort((a, b) => b.score - a.score);

    const totalInvestment = recommendedTerritories.length * (25000 + Math.random() * 15000);

    const responseData: TerritoryExpansionResponse = {
      recommendedTerritories: recommendedTerritories.slice(0, 5),
      expansionStrategy: {
        phase1: recommendedTerritories.slice(0, 2).map(t => t.zipCode),
        phase2: recommendedTerritories.slice(2, 4).map(t => t.zipCode),
        phase3: recommendedTerritories.slice(4, 6).map(t => t.zipCode),
        totalInvestment: Math.round(totalInvestment),
        expectedROI: 1.8 + Math.random() * 1.2,
        timeToBreakeven: 8 + Math.floor(Math.random() * 10),
      },
      riskAnalysis: recommendedTerritories.slice(0, 3).map(t => ({
        territory: t.zipCode,
        risk: t.competition > 15 ? 'High competition in area' : t.demandGrowth < 8 ? 'Slower growth market' : 'Market saturation possible',
        mitigation: t.competition > 15 ? 'Focus on differentiation and service quality' : 'Target underserved niches',
      })),
    };

    const feedback: LearningFeedback = {
      id: `fb_${Date.now()}`,
      predictionId,
      endpoint: 'territory_expansion_analyzer',
      timestamp: new Date(),
      prediction: responseData,
      learningContext: {
        totalPredictions: learningContext.totalPredictions + 1,
        avgAccuracy: learningContext.avgAccuracy,
        confidenceAdjustment: learningContext.confidenceAdjustment,
      },
    };

    await intelligenceDB.saveLearningFeedback(feedback);
    await intelligenceDB.recordAPIUsage(apiKeyId, 'territory_expansion_analyzer', Date.now() - startTime, 200);

    const rateLimitInfo = await intelligenceDB.getRateLimitInfo(apiKeyId);

    return createAPIResponse(
      true,
      responseData,
      undefined,
      learningContext,
      {
        callsUsed: rateLimitInfo.limit - rateLimitInfo.remaining + 1,
        callsRemaining: rateLimitInfo.remaining - 1,
        resetDate: rateLimitInfo.resetAt.toISOString(),
      }
    );
  } catch (error: any) {
    await intelligenceDB.recordAPIUsage(apiKeyId, 'territory_expansion_analyzer', Date.now() - startTime, 400);
    return createAPIResponse(false, undefined, {
      code: 'TERRITORY_EXPANSION_ERROR',
      message: error.message || 'Failed to analyze territory expansion',
    }) as unknown as APIResponse<TerritoryExpansionResponse>;
  }
}

export async function subcontractorNeedPredictorAPI(
  request: SubcontractorNeedRequest,
  apiKeyId: string
): Promise<APIResponse<SubcontractorNeedResponse>> {
  const startTime = Date.now();
  const predictionId = `pred_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  try {
    SubcontractorNeedRequestSchema.parse(request);
    const learningContext = await intelligenceDB.getLearningContext('subcontractor_need_predictor');

    const availableHours = request.yourCapacity.availableCrew * 40 * (1 - request.yourCapacity.currentWorkload / 100);
    const neededHours = request.jobRequirements.laborHours;
    const capacityGap = Math.max(0, neededHours - availableHours);

    const missingSkills = request.jobRequirements.specialties.filter(
      skill => !request.yourCapacity.skills.includes(skill)
    );

    const subcontractorNeeds = missingSkills.map(skill => ({
      specialty: skill,
      hoursNeeded: Math.ceil(capacityGap / missingSkills.length) || Math.ceil(neededHours * 0.3),
      crewsNeeded: Math.ceil((capacityGap / missingSkills.length) / 40) || 1,
      estimatedCost: Math.round((capacityGap / missingSkills.length || neededHours * 0.3) * 55),
      urgency: capacityGap > availableHours ? 'high' : capacityGap > availableHours * 0.5 ? 'medium' : 'low' as 'low' | 'medium' | 'high',
    }));

    if (capacityGap > 0 && subcontractorNeeds.length === 0) {
      subcontractorNeeds.push({
        specialty: 'General Labor',
        hoursNeeded: Math.ceil(capacityGap),
        crewsNeeded: Math.ceil(capacityGap / 40),
        estimatedCost: Math.round(capacityGap * 45),
        urgency: capacityGap > availableHours ? 'high' : 'medium',
      });
    }

    const inHouseCost = availableHours * 35;
    const subcontractorCost = subcontractorNeeds.reduce((sum, s) => sum + s.estimatedCost, 0);

    const responseData: SubcontractorNeedResponse = {
      subcontractorNeeds,
      capacityGap: Math.round(capacityGap),
      costComparison: {
        inHouseCost: Math.round(inHouseCost),
        subcontractorCost: Math.round(subcontractorCost),
        recommendation: subcontractorCost < inHouseCost * 1.3 ? 'subcontract' : capacityGap > 0 ? 'hybrid' : 'in_house',
      },
      timingRecommendations: [
        'Book subcontractors at least 2 weeks in advance',
        'Verify insurance and licensing before engagement',
        'Establish clear scope and deliverables',
        'Schedule progress check-ins throughout project',
      ],
    };

    const feedback: LearningFeedback = {
      id: `fb_${Date.now()}`,
      predictionId,
      endpoint: 'subcontractor_need_predictor',
      timestamp: new Date(),
      prediction: responseData,
      learningContext: {
        totalPredictions: learningContext.totalPredictions + 1,
        avgAccuracy: learningContext.avgAccuracy,
        confidenceAdjustment: learningContext.confidenceAdjustment,
      },
    };

    await intelligenceDB.saveLearningFeedback(feedback);
    await intelligenceDB.recordAPIUsage(apiKeyId, 'subcontractor_need_predictor', Date.now() - startTime, 200);

    const rateLimitInfo = await intelligenceDB.getRateLimitInfo(apiKeyId);

    return createAPIResponse(
      true,
      responseData,
      undefined,
      learningContext,
      {
        callsUsed: rateLimitInfo.limit - rateLimitInfo.remaining + 1,
        callsRemaining: rateLimitInfo.remaining - 1,
        resetDate: rateLimitInfo.resetAt.toISOString(),
      }
    );
  } catch (error: any) {
    await intelligenceDB.recordAPIUsage(apiKeyId, 'subcontractor_need_predictor', Date.now() - startTime, 400);
    return createAPIResponse(false, undefined, {
      code: 'SUBCONTRACTOR_NEED_ERROR',
      message: error.message || 'Failed to predict subcontractor needs',
    }) as unknown as APIResponse<SubcontractorNeedResponse>;
  }
}

export async function warrantyPricingCalculatorAPI(
  request: WarrantyPricingRequest,
  apiKeyId: string
): Promise<APIResponse<WarrantyPricingResponse>> {
  const startTime = Date.now();
  const predictionId = `pred_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  try {
    WarrantyPricingRequestSchema.parse(request);
    const learningContext = await intelligenceDB.getLearningContext('warranty_pricing_calculator');

    const totalMaterialCost = request.materials.reduce((sum, m) => sum + m.cost, 0);
    const totalJobCost = totalMaterialCost + request.laborCost;
    const avgMaterialLife = request.materials.reduce((sum, m) => sum + m.expectedLife, 0) / request.materials.length;

    const riskFactor = avgMaterialLife < 10 ? 1.3 : avgMaterialLife < 20 ? 1.1 : 0.9;
    const baseCost = totalJobCost * 0.05;
    const riskPremium = baseCost * (riskFactor - 1);
    const adminCost = 50 + totalJobCost * 0.01;
    const profitMargin = (baseCost + riskPremium + adminCost) * 0.25;

    const responseData: WarrantyPricingResponse = {
      recommendedPrice: Math.round(baseCost + riskPremium + adminCost + profitMargin),
      priceBreakdown: {
        baseCost: Math.round(baseCost),
        riskPremium: Math.round(riskPremium),
        adminCost: Math.round(adminCost),
        profitMargin: Math.round(profitMargin),
      },
      warrantyTiers: [
        {
          tier: 'Basic',
          coverage: 'Labor only, 1 year',
          duration: 12,
          price: Math.round((baseCost + adminCost) * 0.6),
          margin: 20,
        },
        {
          tier: 'Standard',
          coverage: 'Labor + Materials, 2 years',
          duration: 24,
          price: Math.round(baseCost + riskPremium + adminCost + profitMargin),
          margin: 25,
        },
        {
          tier: 'Premium',
          coverage: 'Full coverage, 5 years',
          duration: 60,
          price: Math.round((baseCost + riskPremium + adminCost + profitMargin) * 2.2),
          margin: 30,
        },
      ],
      riskFactors: [
        { factor: 'Material quality', impact: riskFactor > 1.1 ? 15 : 5, mitigation: 'Use premium materials' },
        { factor: 'Installation complexity', impact: request.timeline > 7 ? 10 : 5, mitigation: 'Experienced crew assignment' },
        { factor: 'Environmental exposure', impact: 8, mitigation: 'Weather-resistant solutions' },
      ],
      industryBenchmark: Math.round(totalJobCost * 0.08),
    };

    const feedback: LearningFeedback = {
      id: `fb_${Date.now()}`,
      predictionId,
      endpoint: 'warranty_pricing_calculator',
      timestamp: new Date(),
      prediction: responseData,
      learningContext: {
        totalPredictions: learningContext.totalPredictions + 1,
        avgAccuracy: learningContext.avgAccuracy,
        confidenceAdjustment: learningContext.confidenceAdjustment,
      },
    };

    await intelligenceDB.saveLearningFeedback(feedback);
    await intelligenceDB.recordAPIUsage(apiKeyId, 'warranty_pricing_calculator', Date.now() - startTime, 200);

    const rateLimitInfo = await intelligenceDB.getRateLimitInfo(apiKeyId);

    return createAPIResponse(
      true,
      responseData,
      undefined,
      learningContext,
      {
        callsUsed: rateLimitInfo.limit - rateLimitInfo.remaining + 1,
        callsRemaining: rateLimitInfo.remaining - 1,
        resetDate: rateLimitInfo.resetAt.toISOString(),
      }
    );
  } catch (error: any) {
    await intelligenceDB.recordAPIUsage(apiKeyId, 'warranty_pricing_calculator', Date.now() - startTime, 400);
    return createAPIResponse(false, undefined, {
      code: 'WARRANTY_PRICING_ERROR',
      message: error.message || 'Failed to calculate warranty pricing',
    }) as unknown as APIResponse<WarrantyPricingResponse>;
  }
}

export async function marketingMessageGeneratorAPI(
  request: MarketingMessageRequest,
  apiKeyId: string
): Promise<APIResponse<MarketingMessageResponse>> {
  const startTime = Date.now();
  const predictionId = `pred_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  try {
    MarketingMessageRequestSchema.parse(request);
    const learningContext = await intelligenceDB.getLearningContext('marketing_message_generator');

    const tone = request.tone || 'professional';
    const headlines = {
      homeowner: [
        `Protect Your Home with Expert ${request.service}`,
        `${request.service} Done Right - Guaranteed`,
        `Your Home Deserves the Best ${request.service}`,
      ],
      landlord: [
        `Maximize Property Value with Professional ${request.service}`,
        `Reliable ${request.service} for Your Investment Properties`,
        `Keep Tenants Happy with Quality ${request.service}`,
      ],
      property_manager: [
        `Streamlined ${request.service} for Your Portfolio`,
        `Trusted ${request.service} Partner for Property Managers`,
        `Volume Pricing on ${request.service} Services`,
      ],
      commercial: [
        `Enterprise ${request.service} Solutions`,
        `Minimize Downtime with Professional ${request.service}`,
        `Commercial-Grade ${request.service} Services`,
      ],
    };

    const responseData: MarketingMessageResponse = {
      messages: [
        {
          id: 1,
          headline: headlines[request.customerType][0],
          body: `Looking for reliable ${request.service.toLowerCase()}? Our experienced team delivers quality workmanship backed by our satisfaction guarantee. Contact us today for a free estimate.`,
          callToAction: 'Get Your Free Quote Today',
          channel: 'email',
          targetEmotion: 'trust',
        },
        {
          id: 2,
          headline: headlines[request.customerType][1],
          body: `Don't wait until small problems become big expenses. Our ${request.service.toLowerCase()} experts are ready to help protect your property.`,
          callToAction: 'Schedule Now',
          channel: 'sms',
          targetEmotion: 'urgency',
        },
        {
          id: 3,
          headline: headlines[request.customerType][2],
          body: `Join thousands of satisfied customers who trust us for their ${request.service.toLowerCase()} needs. Licensed, insured, and committed to excellence.`,
          callToAction: 'Learn More',
          channel: 'social',
          targetEmotion: 'confidence',
        },
      ],
      bestPractices: [
        'Personalize messages with customer name when possible',
        'Include social proof (reviews, ratings)',
        'Clear and prominent call-to-action',
        'Mobile-optimized formatting',
      ],
      avoidances: [
        'Avoid all-caps text',
        'Don\'t use excessive exclamation marks',
        'Avoid spam trigger words',
        'Don\'t make unrealistic promises',
      ],
      timing: {
        bestDays: ['Tuesday', 'Wednesday', 'Thursday'],
        bestTimes: ['10:00 AM', '2:00 PM', '7:00 PM'],
      },
    };

    const feedback: LearningFeedback = {
      id: `fb_${Date.now()}`,
      predictionId,
      endpoint: 'marketing_message_generator',
      timestamp: new Date(),
      prediction: responseData,
      learningContext: {
        totalPredictions: learningContext.totalPredictions + 1,
        avgAccuracy: learningContext.avgAccuracy,
        confidenceAdjustment: learningContext.confidenceAdjustment,
      },
    };

    await intelligenceDB.saveLearningFeedback(feedback);
    await intelligenceDB.recordAPIUsage(apiKeyId, 'marketing_message_generator', Date.now() - startTime, 200);

    const rateLimitInfo = await intelligenceDB.getRateLimitInfo(apiKeyId);

    return createAPIResponse(
      true,
      responseData,
      undefined,
      learningContext,
      {
        callsUsed: rateLimitInfo.limit - rateLimitInfo.remaining + 1,
        callsRemaining: rateLimitInfo.remaining - 1,
        resetDate: rateLimitInfo.resetAt.toISOString(),
      }
    );
  } catch (error: any) {
    await intelligenceDB.recordAPIUsage(apiKeyId, 'marketing_message_generator', Date.now() - startTime, 400);
    return createAPIResponse(false, undefined, {
      code: 'MARKETING_MESSAGE_ERROR',
      message: error.message || 'Failed to generate marketing messages',
    }) as unknown as APIResponse<MarketingMessageResponse>;
  }
}

export async function jobBundleOptimizerAPI(
  request: JobBundleRequest,
  apiKeyId: string
): Promise<APIResponse<JobBundleResponse>> {
  const startTime = Date.now();
  const predictionId = `pred_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  try {
    JobBundleRequestSchema.parse(request);
    const learningContext = await intelligenceDB.getLearningContext('job_bundle_optimizer');

    const servicePrices: Record<string, number> = {
      roofing: 8500,
      siding: 6500,
      gutters: 1500,
      windows: 4500,
      hvac: 5500,
      plumbing: 2500,
      electrical: 3000,
      painting: 3500,
      landscaping: 2000,
    };

    const bundles: Array<{
      bundle: string;
      services: string[];
      individualCost: number;
      bundledCost: number;
      savings: number;
      customerValue: string;
    }> = [];
    const needs = request.customerNeeds.map(n => n.toLowerCase());
    
    if (needs.length >= 2) {
      const individualCost = needs.reduce((sum, n) => sum + (servicePrices[n] || 3000), 0);
      const bundleDiscount = needs.length >= 3 ? 0.15 : 0.10;
      bundles.push({
        bundle: 'Complete Package',
        services: request.customerNeeds,
        individualCost,
        bundledCost: Math.round(individualCost * (1 - bundleDiscount)),
        savings: Math.round(individualCost * bundleDiscount),
        customerValue: 'One contractor, one schedule, maximum convenience',
      });
    }

    const relatedServices: Record<string, string[]> = {
      roofing: ['gutters', 'siding', 'skylights'],
      siding: ['windows', 'painting', 'trim'],
      hvac: ['insulation', 'ductwork', 'thermostat'],
      plumbing: ['water heater', 'fixtures', 'drainage'],
    };

    const crossSell = needs.flatMap(need => 
      (relatedServices[need] || [])
        .filter(s => !needs.includes(s))
        .map(service => ({
          service,
          relevance: 0.7 + Math.random() * 0.25,
          pitch: `Since we're already working on your ${need}, we can add ${service} at a discounted rate.`,
        }))
    ).slice(0, 5);

    const responseData: JobBundleResponse = {
      bundledServices: bundles,
      crossSellOpportunities: crossSell,
      recommendations: [
        'Bundle services performed in sequence for efficiency',
        'Offer financing options for larger bundles',
        'Highlight single-point-of-contact convenience',
        'Include warranty coverage in bundle pricing',
      ],
      totalPotentialRevenue: bundles.reduce((sum, b) => sum + b.bundledCost, 0) + 
        crossSell.reduce((sum, c) => sum + (servicePrices[c.service] || 2000), 0),
    };

    const feedback: LearningFeedback = {
      id: `fb_${Date.now()}`,
      predictionId,
      endpoint: 'job_bundle_optimizer',
      timestamp: new Date(),
      prediction: responseData,
      learningContext: {
        totalPredictions: learningContext.totalPredictions + 1,
        avgAccuracy: learningContext.avgAccuracy,
        confidenceAdjustment: learningContext.confidenceAdjustment,
      },
    };

    await intelligenceDB.saveLearningFeedback(feedback);
    await intelligenceDB.recordAPIUsage(apiKeyId, 'job_bundle_optimizer', Date.now() - startTime, 200);

    const rateLimitInfo = await intelligenceDB.getRateLimitInfo(apiKeyId);

    return createAPIResponse(
      true,
      responseData,
      undefined,
      learningContext,
      {
        callsUsed: rateLimitInfo.limit - rateLimitInfo.remaining + 1,
        callsRemaining: rateLimitInfo.remaining - 1,
        resetDate: rateLimitInfo.resetAt.toISOString(),
      }
    );
  } catch (error: any) {
    await intelligenceDB.recordAPIUsage(apiKeyId, 'job_bundle_optimizer', Date.now() - startTime, 400);
    return createAPIResponse(false, undefined, {
      code: 'JOB_BUNDLE_ERROR',
      message: error.message || 'Failed to optimize job bundle',
    }) as unknown as APIResponse<JobBundleResponse>;
  }
}

export async function travelTimeOptimizerAPI(
  request: TravelTimeRequest,
  apiKeyId: string
): Promise<APIResponse<TravelTimeResponse>> {
  const startTime = Date.now();
  const predictionId = `pred_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  try {
    TravelTimeRequestSchema.parse(request);
    const learningContext = await intelligenceDB.getLearningContext('travel_time_optimizer');

    const sortedJobs = [...request.jobLocations].sort((a, b) => b.priority - a.priority);
    
    let totalTime = 0;
    let totalDistance = 0;
    let currentTime = new Date();
    currentTime.setHours(8, 0, 0, 0);

    const optimalRoute = sortedJobs.map((job, index) => {
      const travelTime = 15 + Math.floor(Math.random() * 30);
      const distance = 5 + Math.random() * 20;
      totalTime += travelTime;
      totalDistance += distance;
      
      const arrivalTime = new Date(currentTime.getTime() + travelTime * 60000);
      currentTime = new Date(arrivalTime.getTime() + 90 * 60000);

      return {
        sequence: index + 1,
        jobId: job.id,
        address: job.address,
        arrivalTime: arrivalTime.toISOString(),
        travelTimeFromPrevious: travelTime,
        distanceFromPrevious: Math.round(distance * 10) / 10,
      };
    });

    const fuelCostPerMile = 0.58;
    const travelCost = totalDistance * fuelCostPerMile + (totalTime / 60) * 25;

    const responseData: TravelTimeResponse = {
      optimalRoute,
      totalTravelTime: totalTime,
      totalDistance: Math.round(totalDistance * 10) / 10,
      travelCost: Math.round(travelCost),
      fuelEstimate: Math.round(totalDistance * fuelCostPerMile),
      efficiencyScore: 0.75 + Math.random() * 0.2,
      alternativeRoutes: [
        {
          description: 'Reverse order - start from furthest',
          timeSaved: -15 + Math.floor(Math.random() * 30),
          additionalCost: Math.floor(Math.random() * 50),
        },
        {
          description: 'Geographic clustering approach',
          timeSaved: 10 + Math.floor(Math.random() * 20),
          additionalCost: -Math.floor(Math.random() * 30),
        },
      ],
    };

    const feedback: LearningFeedback = {
      id: `fb_${Date.now()}`,
      predictionId,
      endpoint: 'travel_time_optimizer',
      timestamp: new Date(),
      prediction: responseData,
      learningContext: {
        totalPredictions: learningContext.totalPredictions + 1,
        avgAccuracy: learningContext.avgAccuracy,
        confidenceAdjustment: learningContext.confidenceAdjustment,
      },
    };

    await intelligenceDB.saveLearningFeedback(feedback);
    await intelligenceDB.recordAPIUsage(apiKeyId, 'travel_time_optimizer', Date.now() - startTime, 200);

    const rateLimitInfo = await intelligenceDB.getRateLimitInfo(apiKeyId);

    return createAPIResponse(
      true,
      responseData,
      undefined,
      learningContext,
      {
        callsUsed: rateLimitInfo.limit - rateLimitInfo.remaining + 1,
        callsRemaining: rateLimitInfo.remaining - 1,
        resetDate: rateLimitInfo.resetAt.toISOString(),
      }
    );
  } catch (error: any) {
    await intelligenceDB.recordAPIUsage(apiKeyId, 'travel_time_optimizer', Date.now() - startTime, 400);
    return createAPIResponse(false, undefined, {
      code: 'TRAVEL_TIME_ERROR',
      message: error.message || 'Failed to optimize travel time',
    }) as unknown as APIResponse<TravelTimeResponse>;
  }
}

export async function skillsGapIdentifierAPI(
  request: SkillsGapRequest,
  apiKeyId: string
): Promise<APIResponse<SkillsGapResponse>> {
  const startTime = Date.now();
  const predictionId = `pred_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  try {
    SkillsGapRequestSchema.parse(request);
    const learningContext = await intelligenceDB.getLearningContext('skills_gap_identifier');

    const allCrewSkills = new Set(request.crewSkills.flatMap(c => c.skills));
    const allCrewCerts = new Set(request.crewSkills.flatMap(c => c.certifications));
    const requiredSkills = new Set(request.upcomingJobs.flatMap(j => j.requiredSkills));

    const missingSkills = [...requiredSkills].filter(skill => !allCrewSkills.has(skill));
    
    const trainingNeeds = missingSkills.map((skill, index) => {
      const affectedJobs = request.upcomingJobs.filter(j => j.requiredSkills.includes(skill)).length;
      return {
        skill,
        gapSeverity: affectedJobs > 2 ? 'critical' : affectedJobs > 1 ? 'moderate' : 'minor' as 'minor' | 'moderate' | 'critical',
        affectedJobs,
        recommendedTraining: `${skill} Certification Course`,
        estimatedCost: 500 + Math.floor(Math.random() * 1500),
        timeToComplete: 8 + Math.floor(Math.random() * 32),
        priority: missingSkills.length - index,
      };
    });

    const commonCerts = ['OSHA 30', 'EPA 608', 'Lead-Safe Certified', 'First Aid/CPR'];
    const missingCerts = commonCerts.filter(cert => !allCrewCerts.has(cert));

    const responseData: SkillsGapResponse = {
      trainingNeeds: trainingNeeds.sort((a, b) => b.priority - a.priority),
      certificationNeeds: missingCerts.map(cert => ({
        certification: cert,
        requiredBy: new Date(Date.now() + Math.random() * 180 * 86400000).toISOString().split('T')[0],
        cost: 200 + Math.floor(Math.random() * 400),
        duration: 4 + Math.floor(Math.random() * 12),
      })),
      teamCapabilityScore: Math.round((1 - missingSkills.length / requiredSkills.size) * 100),
      recommendations: [
        missingSkills.length > 3 ? 'Consider hiring specialists for critical skill gaps' : 'Cross-train existing crew members',
        'Schedule training during slow periods',
        'Prioritize certifications required by upcoming jobs',
        'Document all training for compliance records',
      ],
    };

    const feedback: LearningFeedback = {
      id: `fb_${Date.now()}`,
      predictionId,
      endpoint: 'skills_gap_identifier',
      timestamp: new Date(),
      prediction: responseData,
      learningContext: {
        totalPredictions: learningContext.totalPredictions + 1,
        avgAccuracy: learningContext.avgAccuracy,
        confidenceAdjustment: learningContext.confidenceAdjustment,
      },
    };

    await intelligenceDB.saveLearningFeedback(feedback);
    await intelligenceDB.recordAPIUsage(apiKeyId, 'skills_gap_identifier', Date.now() - startTime, 200);

    const rateLimitInfo = await intelligenceDB.getRateLimitInfo(apiKeyId);

    return createAPIResponse(
      true,
      responseData,
      undefined,
      learningContext,
      {
        callsUsed: rateLimitInfo.limit - rateLimitInfo.remaining + 1,
        callsRemaining: rateLimitInfo.remaining - 1,
        resetDate: rateLimitInfo.resetAt.toISOString(),
      }
    );
  } catch (error: any) {
    await intelligenceDB.recordAPIUsage(apiKeyId, 'skills_gap_identifier', Date.now() - startTime, 400);
    return createAPIResponse(false, undefined, {
      code: 'SKILLS_GAP_ERROR',
      message: error.message || 'Failed to identify skills gap',
    }) as unknown as APIResponse<SkillsGapResponse>;
  }
}

export async function peakSeasonPredictorAPI(
  request: PeakSeasonRequest,
  apiKeyId: string
): Promise<APIResponse<PeakSeasonResponse>> {
  const startTime = Date.now();
  const predictionId = `pred_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  try {
    PeakSeasonRequestSchema.parse(request);
    const learningContext = await intelligenceDB.getLearningContext('peak_season_predictor');

    const seasonalPatterns: Record<string, Array<{ startMonth: number; endMonth: number; demandMultiplier: number; reason: string }>> = {
      roofing: [
        { startMonth: 4, endMonth: 6, demandMultiplier: 1.8, reason: 'Spring storm damage repairs' },
        { startMonth: 9, endMonth: 11, demandMultiplier: 1.5, reason: 'Pre-winter preparation' },
      ],
      hvac: [
        { startMonth: 5, endMonth: 7, demandMultiplier: 2.0, reason: 'AC season begins' },
        { startMonth: 10, endMonth: 12, demandMultiplier: 1.7, reason: 'Heating system prep' },
      ],
      landscaping: [
        { startMonth: 3, endMonth: 5, demandMultiplier: 2.2, reason: 'Spring cleanup and planting' },
        { startMonth: 9, endMonth: 10, demandMultiplier: 1.4, reason: 'Fall cleanup' },
      ],
      default: [
        { startMonth: 4, endMonth: 6, demandMultiplier: 1.5, reason: 'Spring home improvement season' },
        { startMonth: 9, endMonth: 10, demandMultiplier: 1.3, reason: 'Pre-holiday improvements' },
      ],
    };

    const seasons = seasonalPatterns[request.serviceType.toLowerCase()] || seasonalPatterns.default;

    const currentMonth = new Date().getMonth() + 1;
    const nextPeakSeason = seasons.find(s => s.startMonth > currentMonth) || seasons[0];
    const monthsUntilPeak = nextPeakSeason.startMonth > currentMonth 
      ? nextPeakSeason.startMonth - currentMonth 
      : 12 - currentMonth + nextPeakSeason.startMonth;

    const responseData: PeakSeasonResponse = {
      busySeasons: seasons,
      prepNeeded: [
        { category: 'Staffing', action: 'Post job listings', deadline: `${monthsUntilPeak - 2} months before peak`, priority: 'high' },
        { category: 'Inventory', action: 'Stock up on materials', deadline: `${monthsUntilPeak - 1} months before peak`, priority: 'high' },
        { category: 'Marketing', action: 'Launch seasonal campaigns', deadline: `${monthsUntilPeak} months before peak`, priority: 'medium' },
        { category: 'Equipment', action: 'Service and repair equipment', deadline: `${monthsUntilPeak - 1} months before peak`, priority: 'medium' },
      ],
      staffingRecommendations: {
        peakCrewSize: Math.ceil(5 * nextPeakSeason.demandMultiplier),
        hiringTimeline: `Start hiring ${monthsUntilPeak - 2} months before peak`,
        trainingNeeds: ['Safety refresher', 'New equipment training', 'Customer service'],
      },
      inventoryPrep: [
        { material: 'Primary materials', stockLevel: Math.ceil(150 * nextPeakSeason.demandMultiplier), orderDeadline: new Date(Date.now() + (monthsUntilPeak - 1) * 30 * 86400000).toISOString().split('T')[0] },
        { material: 'Fasteners and supplies', stockLevel: Math.ceil(200 * nextPeakSeason.demandMultiplier), orderDeadline: new Date(Date.now() + monthsUntilPeak * 30 * 86400000).toISOString().split('T')[0] },
        { material: 'Safety equipment', stockLevel: 50, orderDeadline: new Date(Date.now() + (monthsUntilPeak - 2) * 30 * 86400000).toISOString().split('T')[0] },
      ],
    };

    const feedback: LearningFeedback = {
      id: `fb_${Date.now()}`,
      predictionId,
      endpoint: 'peak_season_predictor',
      timestamp: new Date(),
      prediction: responseData,
      learningContext: {
        totalPredictions: learningContext.totalPredictions + 1,
        avgAccuracy: learningContext.avgAccuracy,
        confidenceAdjustment: learningContext.confidenceAdjustment,
      },
    };

    await intelligenceDB.saveLearningFeedback(feedback);
    await intelligenceDB.recordAPIUsage(apiKeyId, 'peak_season_predictor', Date.now() - startTime, 200);

    const rateLimitInfo = await intelligenceDB.getRateLimitInfo(apiKeyId);

    return createAPIResponse(
      true,
      responseData,
      undefined,
      learningContext,
      {
        callsUsed: rateLimitInfo.limit - rateLimitInfo.remaining + 1,
        callsRemaining: rateLimitInfo.remaining - 1,
        resetDate: rateLimitInfo.resetAt.toISOString(),
      }
    );
  } catch (error: any) {
    await intelligenceDB.recordAPIUsage(apiKeyId, 'peak_season_predictor', Date.now() - startTime, 400);
    return createAPIResponse(false, undefined, {
      code: 'PEAK_SEASON_ERROR',
      message: error.message || 'Failed to predict peak season',
    }) as unknown as APIResponse<PeakSeasonResponse>;
  }
}

export async function customerRetentionScoreAPI(
  request: CustomerRetentionRequest,
  apiKeyId: string
): Promise<APIResponse<CustomerRetentionResponse>> {
  const startTime = Date.now();
  const predictionId = `pred_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  try {
    CustomerRetentionRequestSchema.parse(request);
    const learningContext = await intelligenceDB.getLearningContext('customer_retention_score');

    const { customerHistory, satisfaction } = request;
    
    const factors: Array<{ factor: string; impact: 'positive' | 'negative'; weight: number }> = [];
    
    if (customerHistory.totalJobs >= 3) {
      factors.push({ factor: 'Repeat customer', impact: 'positive', weight: 20 });
    }
    if (satisfaction.avgRating >= 4.5) {
      factors.push({ factor: 'High satisfaction rating', impact: 'positive', weight: 25 });
    } else if (satisfaction.avgRating < 3.5) {
      factors.push({ factor: 'Low satisfaction rating', impact: 'negative', weight: 30 });
    }
    if (satisfaction.referrals > 0) {
      factors.push({ factor: 'Has made referrals', impact: 'positive', weight: 15 });
    }
    if (satisfaction.complaints > 1) {
      factors.push({ factor: 'Multiple complaints', impact: 'negative', weight: 20 });
    }
    
    const daysSinceLastJob = (Date.now() - new Date(customerHistory.lastJobDate).getTime()) / 86400000;
    if (daysSinceLastJob > customerHistory.avgTimeBetweenJobs * 1.5) {
      factors.push({ factor: 'Overdue for service', impact: 'negative', weight: 15 });
    }

    const positiveWeight = factors.filter(f => f.impact === 'positive').reduce((sum, f) => sum + f.weight, 0);
    const negativeWeight = factors.filter(f => f.impact === 'negative').reduce((sum, f) => sum + f.weight, 0);
    
    const baseScore = 50;
    const retentionScore = Math.min(100, Math.max(0, baseScore + positiveWeight - negativeWeight));
    const churnProbability = (100 - retentionScore) / 100;

    const currentLTV = customerHistory.totalSpent;
    const projectedYears = retentionScore > 70 ? 5 : retentionScore > 50 ? 3 : 1;
    const projectedLTV = currentLTV + (customerHistory.totalSpent / customerHistory.totalJobs) * projectedYears * 2;

    const responseData: CustomerRetentionResponse = {
      retentionScore: Math.round(retentionScore),
      riskLevel: retentionScore > 70 ? 'low' : retentionScore > 40 ? 'medium' : 'high',
      churnProbability: Math.round(churnProbability * 100) / 100,
      lifetimeValue: {
        current: Math.round(currentLTV),
        projected: Math.round(projectedLTV),
      },
      retentionFactors: factors,
      recommendations: [
        retentionScore < 50 ? 'Immediate outreach recommended - customer at risk' : 'Schedule routine follow-up',
        satisfaction.avgRating < 4 ? 'Address service quality concerns' : 'Request testimonial or review',
        daysSinceLastJob > 180 ? 'Send re-engagement offer' : 'Maintain regular communication',
        satisfaction.referrals === 0 ? 'Introduce referral program' : 'Thank for referrals with loyalty discount',
      ],
      reEngagementStrategy: retentionScore < 50 
        ? 'Personal call from manager + exclusive discount offer'
        : retentionScore < 70 
        ? 'Personalized email with seasonal service reminder'
        : 'Add to VIP customer program with priority scheduling',
    };

    const feedback: LearningFeedback = {
      id: `fb_${Date.now()}`,
      predictionId,
      endpoint: 'customer_retention_score',
      timestamp: new Date(),
      prediction: responseData,
      learningContext: {
        totalPredictions: learningContext.totalPredictions + 1,
        avgAccuracy: learningContext.avgAccuracy,
        confidenceAdjustment: learningContext.confidenceAdjustment,
      },
    };

    await intelligenceDB.saveLearningFeedback(feedback);
    await intelligenceDB.recordAPIUsage(apiKeyId, 'customer_retention_score', Date.now() - startTime, 200);

    const rateLimitInfo = await intelligenceDB.getRateLimitInfo(apiKeyId);

    return createAPIResponse(
      true,
      responseData,
      undefined,
      learningContext,
      {
        callsUsed: rateLimitInfo.limit - rateLimitInfo.remaining + 1,
        callsRemaining: rateLimitInfo.remaining - 1,
        resetDate: rateLimitInfo.resetAt.toISOString(),
      }
    );
  } catch (error: any) {
    await intelligenceDB.recordAPIUsage(apiKeyId, 'customer_retention_score', Date.now() - startTime, 400);
    return createAPIResponse(false, undefined, {
      code: 'CUSTOMER_RETENTION_ERROR',
      message: error.message || 'Failed to calculate retention score',
    }) as unknown as APIResponse<CustomerRetentionResponse>;
  }
}

export async function emergencyPricingCalculatorAPI(
  request: EmergencyPricingRequest,
  apiKeyId: string
): Promise<APIResponse<EmergencyPricingResponse>> {
  const startTime = Date.now();
  const predictionId = `pred_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  try {
    EmergencyPricingRequestSchema.parse(request);
    const learningContext = await intelligenceDB.getLearningContext('emergency_pricing_calculator');

    const urgencyMultipliers: Record<string, number> = {
      same_day: 1.5,
      next_day: 1.25,
      within_48h: 1.15,
      weekend: 1.35,
      holiday: 1.75,
    };

    const timeMultipliers: Record<string, number> = {
      business_hours: 1.0,
      evening: 1.25,
      night: 1.5,
      early_morning: 1.4,
    };

    const urgencyMult = urgencyMultipliers[request.jobUrgency] || 1.0;
    const timeMult = timeMultipliers[request.timeOfDay] || 1.0;
    const combinedMultiplier = Math.round((urgencyMult * timeMult) * 100) / 100;

    const urgencyPremium = request.baseCost * (urgencyMult - 1);
    const afterHoursPremium = request.baseCost * (timeMult - 1);
    const totalUpcharge = urgencyPremium + afterHoursPremium;
    const recommendedPrice = request.baseCost + totalUpcharge;

    const marketAverage = request.baseCost * (combinedMultiplier * 0.95);

    const responseData: EmergencyPricingResponse = {
      upchargeMultiplier: combinedMultiplier,
      recommendedPrice: Math.round(recommendedPrice),
      priceBreakdown: {
        baseCost: Math.round(request.baseCost),
        urgencyPremium: Math.round(urgencyPremium),
        afterHoursPremium: Math.round(afterHoursPremium),
        totalUpcharge: Math.round(totalUpcharge),
      },
      justification: [
        `${request.jobUrgency.replace('_', ' ')} service requires immediate crew mobilization`,
        request.timeOfDay !== 'business_hours' ? `${request.timeOfDay.replace('_', ' ')} work incurs additional labor costs` : '',
        'Emergency materials sourcing may require premium suppliers',
        'Priority scheduling displaces other scheduled work',
      ].filter(Boolean),
      marketComparison: {
        yourPrice: Math.round(recommendedPrice),
        marketAverage: Math.round(marketAverage),
        position: recommendedPrice < marketAverage * 0.95 ? 'below' : recommendedPrice > marketAverage * 1.05 ? 'above' : 'at',
      },
      customerCommunication: `Due to the ${request.jobUrgency.replace('_', ' ')} nature of this request${request.timeOfDay !== 'business_hours' ? ` and ${request.timeOfDay.replace('_', ' ')} scheduling` : ''}, an emergency service fee applies. This ensures we can provide you with immediate, dedicated attention and prioritize your needs.`,
    };

    const feedback: LearningFeedback = {
      id: `fb_${Date.now()}`,
      predictionId,
      endpoint: 'emergency_pricing_calculator',
      timestamp: new Date(),
      prediction: responseData,
      learningContext: {
        totalPredictions: learningContext.totalPredictions + 1,
        avgAccuracy: learningContext.avgAccuracy,
        confidenceAdjustment: learningContext.confidenceAdjustment,
      },
    };

    await intelligenceDB.saveLearningFeedback(feedback);
    await intelligenceDB.recordAPIUsage(apiKeyId, 'emergency_pricing_calculator', Date.now() - startTime, 200);

    const rateLimitInfo = await intelligenceDB.getRateLimitInfo(apiKeyId);

    return createAPIResponse(
      true,
      responseData,
      undefined,
      learningContext,
      {
        callsUsed: rateLimitInfo.limit - rateLimitInfo.remaining + 1,
        callsRemaining: rateLimitInfo.remaining - 1,
        resetDate: rateLimitInfo.resetAt.toISOString(),
      }
    );
  } catch (error: any) {
    await intelligenceDB.recordAPIUsage(apiKeyId, 'emergency_pricing_calculator', Date.now() - startTime, 400);
    return createAPIResponse(false, undefined, {
      code: 'EMERGENCY_PRICING_ERROR',
      message: error.message || 'Failed to calculate emergency pricing',
    }) as unknown as APIResponse<EmergencyPricingResponse>;
  }
}
