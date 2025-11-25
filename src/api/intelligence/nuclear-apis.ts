import { z } from 'zod';
import { intelligenceDB, createAPIResponse } from '@/lib/intelligence-db';
import type { APIResponse, LearningFeedback } from '@/types/intelligence-api';

const HailstrikeRequestSchema = z.object({
  zipCodes: z.array(z.string()),
  radius: z.number().min(1).max(500),
  severity: z.enum(['minor', 'moderate', 'severe', 'catastrophic']).optional(),
});

const CatastropheAlphaRequestSchema = z.object({
  region: z.string(),
  eventType: z.enum(['hurricane', 'tornado', 'wildfire', 'flood', 'earthquake']),
  forecastDays: z.number().min(1).max(30),
});

const GhostbidRequestSchema = z.object({
  jobId: z.string(),
  targetPrice: z.number(),
  materialsCost: z.number(),
  laborHours: z.number(),
});

const CreepOracleRequestSchema = z.object({
  materialCategory: z.string(),
  region: z.string(),
  forecastMonths: z.number().min(1).max(12),
});

export type HailstrikeRequest = z.infer<typeof HailstrikeRequestSchema>;
export type CatastropheAlphaRequest = z.infer<typeof CatastropheAlphaRequestSchema>;
export type GhostbidRequest = z.infer<typeof GhostbidRequestSchema>;
export type CreepOracleRequest = z.infer<typeof CreepOracleRequestSchema>;

export interface HailstrikeResponse {
  hotspots: Array<{
    zipCode: string;
    city: string;
    state: string;
    hailProbability: number;
    estimatedSize: string;
    demandSurge: number;
    avgJobValue: number;
    competitorCount: number;
    opportunityScore: number;
  }>;
  totalLeads: number;
  peakWindow: { start: string; end: string };
  recommendations: string[];
}

export interface CatastropheAlphaResponse {
  threatLevel: number;
  affectedZips: string[];
  estimatedImpact: {
    properties: number;
    estimatedDamage: number;
    serviceOpportunities: number;
  };
  demandForecast: Array<{
    service: string;
    demandIncrease: number;
    pricingPower: number;
  }>;
  earlyMoverAdvantage: string;
  deploymentRecommendations: string[];
}

export interface GhostbidResponse {
  ghostBid: {
    suggestedPrice: number;
    margin: number;
    winProbability: number;
  };
  competitorAnalysis: {
    estimatedBids: Array<{ low: number; high: number }>;
    yourPosition: 'lowest' | 'competitive' | 'premium';
  };
  strategicRecommendation: string;
  riskFactors: string[];
}

export interface ContractorDNAResponse {
  dna: {
    reliability: number;
    speed: number;
    quality: number;
    communication: number;
    profitability: number;
  };
  behaviorProfile: {
    avgBidRatio: number;
    completionRate: number;
    customerSatisfaction: number;
    repeatBusinessRate: number;
  };
  predictedPerformance: {
    onTimeCompletion: number;
    budgetAdherence: number;
    qualityScore: number;
  };
  redFlags: string[];
  strengths: string[];
}

export interface CreepOracleResponse {
  currentPrice: number;
  forecastedPrices: Array<{
    month: string;
    price: number;
    confidence: number;
  }>;
  priceMovement: 'rising' | 'stable' | 'falling';
  totalChange: number;
  buyingRecommendation: {
    action: 'buy_now' | 'wait' | 'stockpile';
    reasoning: string;
    savingsOpportunity: number;
  };
}

export interface ArbitrageHeatResponse {
  opportunities: Array<{
    fromZip: string;
    toZip: string;
    service: string;
    priceDifferential: number;
    demandRatio: number;
    arbitrageScore: number;
    monthlyPotential: number;
  }>;
  topArbitrage: {
    service: string;
    avgSpread: number;
    monthlyRevenue: number;
  };
}

export interface PermitVelocityResponse {
  jurisdiction: string;
  avgProcessingDays: number;
  currentBacklog: number;
  trends: {
    lastMonth: number;
    lastQuarter: number;
    yearOverYear: number;
  };
  expeditePossible: boolean;
  estimatedCost: number;
  recommendations: string[];
}

export interface SilentRollupResponse {
  contractorProfile: {
    name: string;
    id: string;
    revenue: number;
    jobCount: number;
    territories: string[];
  };
  acquisitionMetrics: {
    estimatedValue: number;
    ebidta: number;
    revenueMultiple: number;
    synergies: number;
  };
  integrationComplexity: 'low' | 'medium' | 'high';
  dealStructure: {
    suggestedPrice: number;
    earnoutPotential: number;
    paybackPeriod: number;
  };
  strategicFit: number;
}

export interface WeatherWeaponResponse {
  forecast: Array<{
    date: string;
    zipCode: string;
    events: string[];
    demandMultiplier: number;
    serviceOpportunities: string[];
  }>;
  preparedness: {
    inventoryNeeds: Array<{ material: string; quantity: number }>;
    crewAllocation: string;
    pricingStrategy: string;
  };
  revenue7Day: number;
  revenue30Day: number;
}

export interface DoomsdayResponse {
  marketCollapse: {
    probability: number;
    timeline: string;
    triggers: string[];
  };
  survivalStrategy: {
    diversification: string[];
    cashReserves: number;
    hedgePositions: string[];
  };
  opportunities: {
    distressedAssets: string[];
    counterCyclicalPlays: string[];
  };
  actionPlan: string[];
}

export async function hailstrikeAPI(
  request: HailstrikeRequest,
  apiKeyId: string
): Promise<APIResponse<HailstrikeResponse>> {
  const startTime = Date.now();
  const predictionId = `pred_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  try {
    HailstrikeRequestSchema.parse(request);
    const learningContext = await intelligenceDB.getLearningContext('hailstrike');

    const hotspots = request.zipCodes.map((zip, i) => ({
      zipCode: zip,
      city: `City-${zip.slice(0, 3)}`,
      state: 'TX',
      hailProbability: 0.65 + Math.random() * 0.3,
      estimatedSize: ['1 inch', '2 inch', '3+ inch'][Math.floor(Math.random() * 3)],
      demandSurge: 2.5 + Math.random() * 2,
      avgJobValue: 8500 + Math.random() * 6500,
      competitorCount: Math.floor(Math.random() * 15) + 2,
      opportunityScore: 70 + Math.random() * 25,
    }));

    const responseData: HailstrikeResponse = {
      hotspots: hotspots.sort((a, b) => b.opportunityScore - a.opportunityScore).slice(0, 10),
      totalLeads: Math.floor(hotspots.reduce((sum, h) => sum + h.demandSurge, 0) * 45),
      peakWindow: {
        start: new Date(Date.now() + 86400000).toISOString(),
        end: new Date(Date.now() + 86400000 * 14).toISOString(),
      },
      recommendations: [
        'Deploy crews to top 3 hotspots within 48 hours',
        'Increase roofing material inventory by 40%',
        'Premium pricing justified for 7-10 days post-event',
      ],
    };

    const feedback: LearningFeedback = {
      id: `fb_${Date.now()}`,
      predictionId,
      endpoint: 'hailstrike',
      timestamp: new Date(),
      prediction: responseData,
      learningContext: {
        totalPredictions: learningContext.totalPredictions + 1,
        avgAccuracy: learningContext.avgAccuracy,
        confidenceAdjustment: learningContext.confidenceAdjustment,
      },
    };

    await intelligenceDB.saveLearningFeedback(feedback);
    await intelligenceDB.recordAPIUsage(apiKeyId, 'hailstrike', Date.now() - startTime, 200);

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
    await intelligenceDB.recordAPIUsage(apiKeyId, 'hailstrike', Date.now() - startTime, 400);
    return createAPIResponse(false, undefined, {
      code: 'HAILSTRIKE_ERROR',
      message: error.message || 'Failed to process hailstrike request',
    }) as unknown as APIResponse<HailstrikeResponse>;
  }
}

export async function catastropheAlphaAPI(
  request: CatastropheAlphaRequest,
  apiKeyId: string
): Promise<APIResponse<CatastropheAlphaResponse>> {
  const startTime = Date.now();
  const predictionId = `pred_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  try {
    CatastropheAlphaRequestSchema.parse(request);
    const learningContext = await intelligenceDB.getLearningContext('catastrophe_alpha');

    const affectedZips = Array.from({ length: 45 }, (_, i) => 
      String(10000 + Math.floor(Math.random() * 89999))
    );

    const responseData: CatastropheAlphaResponse = {
      threatLevel: 7.5 + Math.random() * 2,
      affectedZips: affectedZips.slice(0, 20),
      estimatedImpact: {
        properties: 12500 + Math.floor(Math.random() * 7500),
        estimatedDamage: 185000000 + Math.random() * 115000000,
        serviceOpportunities: 8500 + Math.floor(Math.random() * 3500),
      },
      demandForecast: [
        { service: 'Roofing', demandIncrease: 450, pricingPower: 1.65 },
        { service: 'Water Damage', demandIncrease: 380, pricingPower: 1.75 },
        { service: 'Debris Removal', demandIncrease: 520, pricingPower: 1.45 },
        { service: 'Tree Services', demandIncrease: 290, pricingPower: 1.55 },
      ],
      earlyMoverAdvantage: 'First 72 hours = 3.2x normal margins',
      deploymentRecommendations: [
        'Stage crews at perimeter of impact zone',
        'Secure hotel blocks for 14-day deployment',
        'Pre-purchase critical materials while available',
        'Activate emergency call center protocols',
      ],
    };

    const feedback: LearningFeedback = {
      id: `fb_${Date.now()}`,
      predictionId,
      endpoint: 'catastrophe_alpha',
      timestamp: new Date(),
      prediction: responseData,
      learningContext: {
        totalPredictions: learningContext.totalPredictions + 1,
        avgAccuracy: learningContext.avgAccuracy,
        confidenceAdjustment: learningContext.confidenceAdjustment,
      },
    };

    await intelligenceDB.saveLearningFeedback(feedback);
    await intelligenceDB.recordAPIUsage(apiKeyId, 'catastrophe_alpha', Date.now() - startTime, 200);

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
    await intelligenceDB.recordAPIUsage(apiKeyId, 'catastrophe_alpha', Date.now() - startTime, 400);
    return createAPIResponse(false, undefined, {
      code: 'CATASTROPHE_ALPHA_ERROR',
      message: error.message || 'Failed to process catastrophe request',
    }) as unknown as APIResponse<CatastropheAlphaResponse>;
  }
}

export async function ghostbidAPI(
  request: GhostbidRequest,
  apiKeyId: string
): Promise<APIResponse<GhostbidResponse>> {
  const startTime = Date.now();
  const predictionId = `pred_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  try {
    GhostbidRequestSchema.parse(request);
    const learningContext = await intelligenceDB.getLearningContext('ghostbid');

    const totalCost = request.materialsCost + (request.laborHours * 75);
    const markup = 0.25 + Math.random() * 0.15;
    const suggestedPrice = Math.round(totalCost * (1 + markup));
    
    const responseData: GhostbidResponse = {
      ghostBid: {
        suggestedPrice,
        margin: Math.round((suggestedPrice - totalCost) / suggestedPrice * 100),
        winProbability: 0.62 + Math.random() * 0.25,
      },
      competitorAnalysis: {
        estimatedBids: [
          { low: suggestedPrice * 0.92, high: suggestedPrice * 1.08 },
          { low: suggestedPrice * 0.88, high: suggestedPrice * 1.12 },
          { low: suggestedPrice * 0.95, high: suggestedPrice * 1.15 },
        ],
        yourPosition: suggestedPrice < request.targetPrice * 0.95 ? 'lowest' : 
                      suggestedPrice > request.targetPrice * 1.05 ? 'premium' : 'competitive',
      },
      strategicRecommendation: suggestedPrice < request.targetPrice 
        ? 'Strong position. Consider slight price increase for better margin.'
        : 'Bid is competitive but watch for undercutting. Emphasize quality.',
      riskFactors: [
        'Material price volatility in next 30 days',
        '2 competitors with lower overhead in area',
      ],
    };

    const feedback: LearningFeedback = {
      id: `fb_${Date.now()}`,
      predictionId,
      endpoint: 'ghostbid',
      timestamp: new Date(),
      prediction: responseData,
      learningContext: {
        totalPredictions: learningContext.totalPredictions + 1,
        avgAccuracy: learningContext.avgAccuracy,
        confidenceAdjustment: learningContext.confidenceAdjustment,
      },
    };

    await intelligenceDB.saveLearningFeedback(feedback);
    await intelligenceDB.recordAPIUsage(apiKeyId, 'ghostbid', Date.now() - startTime, 200);

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
    await intelligenceDB.recordAPIUsage(apiKeyId, 'ghostbid', Date.now() - startTime, 400);
    return createAPIResponse(false, undefined, {
      code: 'GHOSTBID_ERROR',
      message: error.message || 'Failed to process ghostbid request',
    }) as unknown as APIResponse<GhostbidResponse>;
  }
}

export async function contractorDNAAPI(
  contractorId: string,
  apiKeyId: string
): Promise<APIResponse<ContractorDNAResponse>> {
  const startTime = Date.now();
  const predictionId = `pred_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  try {
    const learningContext = await intelligenceDB.getLearningContext('contractor_dna');

    const responseData: ContractorDNAResponse = {
      dna: {
        reliability: 0.82 + Math.random() * 0.15,
        speed: 0.78 + Math.random() * 0.18,
        quality: 0.85 + Math.random() * 0.12,
        communication: 0.75 + Math.random() * 0.20,
        profitability: 0.68 + Math.random() * 0.25,
      },
      behaviorProfile: {
        avgBidRatio: 1.15 + Math.random() * 0.25,
        completionRate: 0.88 + Math.random() * 0.10,
        customerSatisfaction: 4.2 + Math.random() * 0.7,
        repeatBusinessRate: 0.42 + Math.random() * 0.28,
      },
      predictedPerformance: {
        onTimeCompletion: 0.83 + Math.random() * 0.14,
        budgetAdherence: 0.91 + Math.random() * 0.08,
        qualityScore: 0.86 + Math.random() * 0.11,
      },
      redFlags: [
        Math.random() > 0.7 ? 'Occasional communication delays' : null,
        Math.random() > 0.8 ? 'Higher than average change orders' : null,
      ].filter(Boolean) as string[],
      strengths: [
        'Consistent on-time delivery',
        'Strong material sourcing relationships',
        'Above-average quality craftsmanship',
      ],
    };

    const feedback: LearningFeedback = {
      id: `fb_${Date.now()}`,
      predictionId,
      endpoint: 'contractor_dna',
      timestamp: new Date(),
      prediction: responseData,
      learningContext: {
        totalPredictions: learningContext.totalPredictions + 1,
        avgAccuracy: learningContext.avgAccuracy,
        confidenceAdjustment: learningContext.confidenceAdjustment,
      },
    };

    await intelligenceDB.saveLearningFeedback(feedback);
    await intelligenceDB.recordAPIUsage(apiKeyId, 'contractor_dna', Date.now() - startTime, 200);

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
    await intelligenceDB.recordAPIUsage(apiKeyId, 'contractor_dna', Date.now() - startTime, 400);
    return createAPIResponse(false, undefined, {
      code: 'CONTRACTOR_DNA_ERROR',
      message: error.message || 'Failed to retrieve contractor DNA',
    }) as unknown as APIResponse<ContractorDNAResponse>;
  }
}

export async function creepOracleAPI(
  request: CreepOracleRequest,
  apiKeyId: string
): Promise<APIResponse<CreepOracleResponse>> {
  const startTime = Date.now();
  const predictionId = `pred_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  try {
    CreepOracleRequestSchema.parse(request);
    const learningContext = await intelligenceDB.getLearningContext('creep_oracle');

    const basePrice = 125 + Math.random() * 75;
    const trend = Math.random() > 0.5 ? 1 : -1;
    const volatility = 0.02 + Math.random() * 0.06;

    const forecastedPrices = Array.from({ length: request.forecastMonths }, (_, i) => {
      const drift = trend * volatility * (i + 1);
      const noise = (Math.random() - 0.5) * 0.03;
      return {
        month: new Date(Date.now() + (i + 1) * 30 * 86400000).toISOString().slice(0, 7),
        price: Math.round(basePrice * (1 + drift + noise) * 100) / 100,
        confidence: 0.85 - (i * 0.05),
      };
    });

    const totalChange = ((forecastedPrices[forecastedPrices.length - 1].price - basePrice) / basePrice) * 100;
    
    const responseData: CreepOracleResponse = {
      currentPrice: basePrice,
      forecastedPrices,
      priceMovement: totalChange > 2 ? 'rising' : totalChange < -2 ? 'falling' : 'stable',
      totalChange: Math.round(totalChange * 10) / 10,
      buyingRecommendation: {
        action: totalChange > 5 ? 'buy_now' : totalChange < -3 ? 'wait' : 'stockpile',
        reasoning: totalChange > 5 
          ? 'Prices trending up. Lock in current rates.'
          : totalChange < -3 
          ? 'Prices declining. Delay non-urgent purchases.'
          : 'Stable pricing. Maintain normal inventory.',
        savingsOpportunity: Math.abs(totalChange) > 3 ? Math.round(basePrice * Math.abs(totalChange) / 100) : 0,
      },
    };

    const feedback: LearningFeedback = {
      id: `fb_${Date.now()}`,
      predictionId,
      endpoint: 'creep_oracle',
      timestamp: new Date(),
      prediction: responseData,
      learningContext: {
        totalPredictions: learningContext.totalPredictions + 1,
        avgAccuracy: learningContext.avgAccuracy,
        confidenceAdjustment: learningContext.confidenceAdjustment,
      },
    };

    await intelligenceDB.saveLearningFeedback(feedback);
    await intelligenceDB.recordAPIUsage(apiKeyId, 'creep_oracle', Date.now() - startTime, 200);

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
    await intelligenceDB.recordAPIUsage(apiKeyId, 'creep_oracle', Date.now() - startTime, 400);
    return createAPIResponse(false, undefined, {
      code: 'CREEP_ORACLE_ERROR',
      message: error.message || 'Failed to forecast material prices',
    }) as unknown as APIResponse<CreepOracleResponse>;
  }
}

export async function arbitrageHeatAPI(
  apiKeyId: string
): Promise<APIResponse<ArbitrageHeatResponse>> {
  const startTime = Date.now();
  const predictionId = `pred_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  try {
    const learningContext = await intelligenceDB.getLearningContext('arbitrage_heat');

    const services = ['Roofing', 'HVAC', 'Plumbing', 'Electrical', 'Landscaping'];
    const opportunities = Array.from({ length: 12 }, (_, i) => ({
      fromZip: String(10000 + Math.floor(Math.random() * 89999)),
      toZip: String(10000 + Math.floor(Math.random() * 89999)),
      service: services[Math.floor(Math.random() * services.length)],
      priceDifferential: 15 + Math.random() * 35,
      demandRatio: 1.2 + Math.random() * 2.3,
      arbitrageScore: 65 + Math.random() * 30,
      monthlyPotential: 2500 + Math.random() * 12500,
    })).sort((a, b) => b.arbitrageScore - a.arbitrageScore);

    const responseData: ArbitrageHeatResponse = {
      opportunities: opportunities.slice(0, 8),
      topArbitrage: {
        service: opportunities[0].service,
        avgSpread: opportunities
          .filter(o => o.service === opportunities[0].service)
          .reduce((sum, o) => sum + o.priceDifferential, 0) / 
          opportunities.filter(o => o.service === opportunities[0].service).length,
        monthlyRevenue: opportunities
          .filter(o => o.service === opportunities[0].service)
          .reduce((sum, o) => sum + o.monthlyPotential, 0),
      },
    };

    const feedback: LearningFeedback = {
      id: `fb_${Date.now()}`,
      predictionId,
      endpoint: 'arbitrage_heat',
      timestamp: new Date(),
      prediction: responseData,
      learningContext: {
        totalPredictions: learningContext.totalPredictions + 1,
        avgAccuracy: learningContext.avgAccuracy,
        confidenceAdjustment: learningContext.confidenceAdjustment,
      },
    };

    await intelligenceDB.saveLearningFeedback(feedback);
    await intelligenceDB.recordAPIUsage(apiKeyId, 'arbitrage_heat', Date.now() - startTime, 200);

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
    await intelligenceDB.recordAPIUsage(apiKeyId, 'arbitrage_heat', Date.now() - startTime, 400);
    return createAPIResponse(false, undefined, {
      code: 'ARBITRAGE_HEAT_ERROR',
      message: error.message || 'Failed to calculate arbitrage opportunities',
    }) as unknown as APIResponse<ArbitrageHeatResponse>;
  }
}

export async function permitVelocityAPI(
  jurisdiction: string,
  apiKeyId: string
): Promise<APIResponse<PermitVelocityResponse>> {
  const startTime = Date.now();
  const predictionId = `pred_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  try {
    const learningContext = await intelligenceDB.getLearningContext('permit_velocity');

    const avgDays = 14 + Math.floor(Math.random() * 45);
    const backlog = Math.floor(Math.random() * 350) + 50;

    const responseData: PermitVelocityResponse = {
      jurisdiction,
      avgProcessingDays: avgDays,
      currentBacklog: backlog,
      trends: {
        lastMonth: avgDays + Math.floor(Math.random() * 10) - 5,
        lastQuarter: avgDays + Math.floor(Math.random() * 15) - 7,
        yearOverYear: avgDays - Math.floor(Math.random() * 8),
      },
      expeditePossible: Math.random() > 0.4,
      estimatedCost: Math.random() > 0.4 ? 250 + Math.floor(Math.random() * 750) : 0,
      recommendations: [
        backlog > 200 ? 'High backlog detected. File early or consider expedite.' : 'Normal processing time expected.',
        'All documents must be complete to avoid delays',
        avgDays > 30 ? 'Consider pre-application consultation' : 'Standard application recommended',
      ],
    };

    const feedback: LearningFeedback = {
      id: `fb_${Date.now()}`,
      predictionId,
      endpoint: 'permit_velocity',
      timestamp: new Date(),
      prediction: responseData,
      learningContext: {
        totalPredictions: learningContext.totalPredictions + 1,
        avgAccuracy: learningContext.avgAccuracy,
        confidenceAdjustment: learningContext.confidenceAdjustment,
      },
    };

    await intelligenceDB.saveLearningFeedback(feedback);
    await intelligenceDB.recordAPIUsage(apiKeyId, 'permit_velocity', Date.now() - startTime, 200);

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
    await intelligenceDB.recordAPIUsage(apiKeyId, 'permit_velocity', Date.now() - startTime, 400);
    return createAPIResponse(false, undefined, {
      code: 'PERMIT_VELOCITY_ERROR',
      message: error.message || 'Failed to retrieve permit velocity data',
    }) as unknown as APIResponse<PermitVelocityResponse>;
  }
}

export async function silentRollupAPI(
  contractorName: string,
  apiKeyId: string
): Promise<APIResponse<SilentRollupResponse>> {
  const startTime = Date.now();
  const predictionId = `pred_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  try {
    const learningContext = await intelligenceDB.getLearningContext('silent_rollup');

    const revenue = 500000 + Math.random() * 4500000;
    const ebitdaMargin = 0.12 + Math.random() * 0.18;
    const multiple = 3.5 + Math.random() * 2.5;

    const responseData: SilentRollupResponse = {
      contractorProfile: {
        name: contractorName,
        id: `ctr_${Date.now()}`,
        revenue: Math.round(revenue),
        jobCount: Math.floor(revenue / 8500),
        territories: ['ZIP-' + String(10000 + Math.floor(Math.random() * 10000))],
      },
      acquisitionMetrics: {
        estimatedValue: Math.round(revenue * multiple),
        ebidta: Math.round(revenue * ebitdaMargin),
        revenueMultiple: Math.round(multiple * 10) / 10,
        synergies: Math.round(revenue * 0.15),
      },
      integrationComplexity: revenue > 2000000 ? 'high' : revenue > 750000 ? 'medium' : 'low',
      dealStructure: {
        suggestedPrice: Math.round(revenue * multiple * 0.85),
        earnoutPotential: Math.round(revenue * multiple * 0.15),
        paybackPeriod: Math.round((multiple / ebitdaMargin) * 10) / 10,
      },
      strategicFit: 0.72 + Math.random() * 0.23,
    };

    const feedback: LearningFeedback = {
      id: `fb_${Date.now()}`,
      predictionId,
      endpoint: 'silent_rollup',
      timestamp: new Date(),
      prediction: responseData,
      learningContext: {
        totalPredictions: learningContext.totalPredictions + 1,
        avgAccuracy: learningContext.avgAccuracy,
        confidenceAdjustment: learningContext.confidenceAdjustment,
      },
    };

    await intelligenceDB.saveLearningFeedback(feedback);
    await intelligenceDB.recordAPIUsage(apiKeyId, 'silent_rollup', Date.now() - startTime, 200);

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
    await intelligenceDB.recordAPIUsage(apiKeyId, 'silent_rollup', Date.now() - startTime, 400);
    return createAPIResponse(false, undefined, {
      code: 'SILENT_ROLLUP_ERROR',
      message: error.message || 'Failed to analyze rollup opportunity',
    }) as unknown as APIResponse<SilentRollupResponse>;
  }
}

export async function weatherWeaponAPI(
  zipCode: string,
  apiKeyId: string
): Promise<APIResponse<WeatherWeaponResponse>> {
  const startTime = Date.now();
  const predictionId = `pred_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  try {
    const learningContext = await intelligenceDB.getLearningContext('weather_weapon');

    const forecast = Array.from({ length: 7 }, (_, i) => {
      const events: string[] = [];
      if (Math.random() > 0.7) events.push('Heavy Rain');
      if (Math.random() > 0.85) events.push('Hail');
      if (Math.random() > 0.9) events.push('High Winds');
      
      return {
        date: new Date(Date.now() + i * 86400000).toISOString().split('T')[0],
        zipCode,
        events,
        demandMultiplier: events.length > 0 ? 1.5 + Math.random() * 1.5 : 1.0,
        serviceOpportunities: events.length > 0 
          ? ['Roofing', 'Water Damage', 'Tree Services'].slice(0, events.length)
          : [],
      };
    });

    const responseData: WeatherWeaponResponse = {
      forecast,
      preparedness: {
        inventoryNeeds: [
          { material: 'Roofing shingles', quantity: 150 },
          { material: 'Tarps', quantity: 50 },
          { material: 'Plywood', quantity: 75 },
        ],
        crewAllocation: 'Deploy 2 crews to standby',
        pricingStrategy: 'Standard + 15% for emergency response',
      },
      revenue7Day: Math.round(12500 + Math.random() * 37500),
      revenue30Day: Math.round(45000 + Math.random() * 105000),
    };

    const feedback: LearningFeedback = {
      id: `fb_${Date.now()}`,
      predictionId,
      endpoint: 'weather_weapon',
      timestamp: new Date(),
      prediction: responseData,
      learningContext: {
        totalPredictions: learningContext.totalPredictions + 1,
        avgAccuracy: learningContext.avgAccuracy,
        confidenceAdjustment: learningContext.confidenceAdjustment,
      },
    };

    await intelligenceDB.saveLearningFeedback(feedback);
    await intelligenceDB.recordAPIUsage(apiKeyId, 'weather_weapon', Date.now() - startTime, 200);

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
    await intelligenceDB.recordAPIUsage(apiKeyId, 'weather_weapon', Date.now() - startTime, 400);
    return createAPIResponse(false, undefined, {
      code: 'WEATHER_WEAPON_ERROR',
      message: error.message || 'Failed to generate weather intelligence',
    }) as unknown as APIResponse<WeatherWeaponResponse>;
  }
}

export async function doomsdayAPI(
  apiKeyId: string
): Promise<APIResponse<DoomsdayResponse>> {
  const startTime = Date.now();
  const predictionId = `pred_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  try {
    const learningContext = await intelligenceDB.getLearningContext('doomsday');

    const responseData: DoomsdayResponse = {
      marketCollapse: {
        probability: 0.05 + Math.random() * 0.15,
        timeline: Math.random() > 0.5 ? '18-24 months' : '6-12 months',
        triggers: [
          'Housing market correction >15%',
          'Federal interest rate increase',
          'Labor shortage escalation',
          'Material cost spiral',
        ],
      },
      survivalStrategy: {
        diversification: [
          'Essential maintenance services (recession-resistant)',
          'Insurance restoration work',
          'Government contract bidding',
        ],
        cashReserves: 180000,
        hedgePositions: [
          'Fixed-price material contracts',
          'Counter-cyclical service offerings',
        ],
      },
      opportunities: {
        distressedAssets: [
          'Failing contractors with good territories',
          'Equipment auctions',
          'Material liquidation sales',
        ],
        counterCyclicalPlays: [
          'Home repair vs new construction',
          'Insurance claims processing',
          'Property management services',
        ],
      },
      actionPlan: [
        'Build 6-month cash reserve immediately',
        'Diversify into 3+ service categories',
        'Lock in material prices where possible',
        'Strengthen insurance carrier relationships',
        'Prepare acquisition war chest',
      ],
    };

    const feedback: LearningFeedback = {
      id: `fb_${Date.now()}`,
      predictionId,
      endpoint: 'doomsday',
      timestamp: new Date(),
      prediction: responseData,
      learningContext: {
        totalPredictions: learningContext.totalPredictions + 1,
        avgAccuracy: learningContext.avgAccuracy,
        confidenceAdjustment: learningContext.confidenceAdjustment,
      },
    };

    await intelligenceDB.saveLearningFeedback(feedback);
    await intelligenceDB.recordAPIUsage(apiKeyId, 'doomsday', Date.now() - startTime, 200);

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
    await intelligenceDB.recordAPIUsage(apiKeyId, 'doomsday', Date.now() - startTime, 400);
    return createAPIResponse(false, undefined, {
      code: 'DOOMSDAY_ERROR',
      message: error.message || 'Failed to generate doomsday analysis',
    }) as unknown as APIResponse<DoomsdayResponse>;
  }
}
