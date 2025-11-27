export interface APIKey {
  id: string;
  key: string;
  userId: string;
  name: string;
  tier: 'free' | 'professional' | 'enterprise';
  status: 'active' | 'revoked' | 'expired';
  callsUsed: number;
  callsLimit: number;
  resetDate: Date;
  createdAt: Date;
  lastUsedAt?: Date;
  permissions: string[];
}

export interface APIUsage {
  apiKeyId: string;
  endpoint: string;
  timestamp: Date;
  responseTime: number;
  statusCode: number;
  requestId: string;
  metadata?: Record<string, unknown>;
}

export interface LearningFeedback {
  id: string;
  predictionId: string;
  endpoint: string;
  timestamp: Date;
  prediction: Record<string, unknown>;
  actualOutcome?: Record<string, unknown>;
  accuracyScore?: number;
  errorMargin?: number;
  userFeedback?: {
    rating: number;
    wasAccurate: boolean;
    comments?: string;
  };
  learningContext: {
    totalPredictions: number;
    avgAccuracy: number;
    confidenceAdjustment: number;
  };
}

export interface APIResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
  metadata: {
    requestId: string;
    timestamp: string;
    learningContext: {
      totalPredictions: number;
      currentAccuracy: number;
      confidenceScore: number;
    };
  };
  usage?: {
    callsUsed: number;
    callsRemaining: number;
    resetDate: string;
  };
}

export interface RateLimitInfo {
  limit: number;
  remaining: number;
  resetAt: Date;
  burstLimit: number;
}

export interface WebhookSubscription {
  id: string;
  userId: string;
  event: 'storm_alert' | 'demand_spike' | 'price_change' | 'compliance_update';
  url: string;
  secret: string;
  active: boolean;
  createdAt: Date;
  lastTriggeredAt?: Date;
}

export interface JobScopeRequest {
  videoUrl?: string;
  imageUrl?: string;
  description: string;
  location: {
    zipCode: string;
    state: string;
  };
}

export interface JobScopeResponse {
  jobTitle: string;
  summary: string;
  category: string;
  estimatedSquareFootage: number;
  materials: Array<{
    name: string;
    quantity: number;
    unit: string;
    estimatedCost: number;
  }>;
  laborHours: number;
  estimatedCost: { min: number; max: number };
  confidenceScore: number;
  recommendations: string[];
  warningsAndRisks: string[];
  permitRequired: boolean;
  estimatedTimeline: { min: number; max: number; unit: 'days' | 'weeks' };
}

export interface InstantQuoteRequest {
  jobType: string;
  squareFootage?: number;
  materials?: string[];
  urgency: 'normal' | 'urgent' | 'emergency';
  location: { zipCode: string; state: string };
}

export interface InstantQuoteResponse {
  quoteId: string;
  totalCost: { min: number; max: number };
  breakdown: {
    materials: number;
    labor: number;
    overhead: number;
    profit: number;
  };
  timeline: { min: number; max: number; unit: 'days' | 'weeks' };
  validUntil: string;
  confidenceScore: number;
}

export interface ContractorMatchRequest {
  jobId: string;
  jobType: string;
  location: { zipCode: string; state: string };
  budget: { min: number; max: number };
  urgency: string;
  requirements?: string[];
}

export interface ContractorMatchResponse {
  matches: Array<{
    contractorId: string;
    name: string;
    rating: number;
    completedJobs: number;
    matchScore: number;
    availability: string;
    estimatedResponse: string;
    distance: number;
    specialties: string[];
    hourlyRate: number;
  }>;
  totalMatches: number;
  confidenceScore: number;
}

export interface DemandHeatmapRequest {
  region: 'zipCode' | 'city' | 'state' | 'national';
  regionValue: string;
  serviceType?: string;
  timeRange: 'week' | 'month' | 'quarter' | 'year';
}

export interface DemandHeatmapResponse {
  heatmap: Array<{
    location: { zipCode: string; city: string; state: string; lat: number; lng: number };
    demand: number;
    trend: 'rising' | 'stable' | 'falling';
    avgJobValue: number;
    competition: number;
    opportunity: number;
  }>;
  insights: string[];
  recommendations: string[];
}

export interface StormAlertRequest {
  locations: Array<{ zipCode: string; state: string }>;
  services: string[];
  alertThreshold: 'low' | 'medium' | 'high';
}

export interface StormAlertResponse {
  alerts: Array<{
    location: { zipCode: string; city: string; state: string };
    severity: 'low' | 'moderate' | 'high' | 'extreme';
    stormType: string;
    expectedImpact: string;
    timeline: string;
    estimatedDemandIncrease: number;
    recommendedActions: string[];
  }>;
  webhookRegistered: boolean;
}

export interface CapitalIntelligenceRequest {
  territoryId?: string;
  marketId?: string;
  analysisType: 'territory_valuation' | 'market_opportunity' | 'acquisition_target' | 'portfolio_optimization';
}

export interface CapitalIntelligenceResponse {
  valuation: {
    current: number;
    projected12Month: number;
    projected36Month: number;
  };
  metrics: {
    roi: number;
    paybackPeriod: number;
    cashOnCashReturn: number;
    irr: number;
  };
  riskFactors: Array<{
    factor: string;
    severity: 'low' | 'medium' | 'high';
    mitigation: string;
  }>;
  opportunities: Array<{
    type: string;
    potential: number;
    timeline: string;
    investment: number;
  }>;
  benchmarks: {
    industryAverage: number;
    topQuartile: number;
    yourPosition: string;
  };
}

export interface BatchScopeRequest {
  jobs: Array<{
    id: string;
    videoUrl?: string;
    imageUrl?: string;
    description: string;
    location: { zipCode: string; state: string };
  }>;
  priority: 'standard' | 'high' | 'urgent';
}

export interface BatchScopeResponse {
  batchId: string;
  status: 'processing' | 'completed' | 'failed';
  totalJobs: number;
  processedJobs: number;
  results: Array<JobScopeResponse & { jobId: string }>;
  estimatedCompletion?: string;
}

export interface MasterIntelligenceRequest {
  jobId?: string;
  territoryId?: string;
  contractorId?: string;
  analysisDepth: 'basic' | 'standard' | 'comprehensive' | 'enterprise';
  modules: string[];
}

export interface MasterIntelligenceResponse {
  overview: {
    summary: string;
    keyInsights: string[];
    recommendations: string[];
  };
  jobIntelligence?: JobScopeResponse;
  pricingIntelligence?: unknown;
  marketIntelligence?: unknown;
  competitiveIntelligence?: unknown;
  riskIntelligence?: unknown;
  opportunityIntelligence?: unknown;
  compoundingFactor: number;
  generatedAt: string;
}
